/* ============================================================
   HotelPick — 互動：相片燈箱 + 地圖
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 1. 相片燈箱 ---------- */
  var lb = document.getElementById('lightbox');
  if (lb) {
    var lbImg = lb.querySelector('.lb-img');
    var lbCap = lb.querySelector('.lb-cap');
    var lbCount = lb.querySelector('.lb-count');
    var group = [];
    var index = 0;
    var lastFocus = null;

    function render() {
      var item = group[index];
      if (!item) return;
      lbImg.src = item.src;
      lbImg.alt = item.cap;
      lbCap.innerHTML = '<span></span><em></em>';
      lbCap.firstChild.textContent = item.cap;
      lbCap.lastChild.textContent = item.owner;
      lbCount.textContent = (index + 1) + ' / ' + group.length;
    }

    function open(gal, i) {
      group = [].map.call(gal.querySelectorAll('.shot'), function (b) {
        return {
          src: b.getAttribute('data-full'),
          cap: b.getAttribute('data-cap') || '',
          owner: gal.getAttribute('data-owner') || ''
        };
      });
      index = i;
      lastFocus = document.activeElement;
      render();
      lb.classList.add('on');
      document.body.classList.add('locked');
      lb.querySelector('.lb-close').focus();
    }

    function close() {
      lb.classList.remove('on');
      document.body.classList.remove('locked');
      lbImg.removeAttribute('src');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    function step(d) {
      if (!group.length) return;
      index = (index + d + group.length) % group.length;
      render();
    }

    document.addEventListener('click', function (e) {
      var shot = e.target.closest ? e.target.closest('.shot') : null;
      if (shot) {
        var gal = shot.closest('.gal');
        var shots = [].slice.call(gal.querySelectorAll('.shot'));
        open(gal, shots.indexOf(shot));
      }
    });

    lb.addEventListener('click', function (e) {
      var act = e.target.getAttribute && e.target.getAttribute('data-act');
      if (act === 'prev') { step(-1); return; }
      if (act === 'next') { step(1); return; }
      if (act === 'close' || e.target === lb || e.target.classList.contains('lb-fig')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('on')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    });

    /* 手機左右滑動切換 */
    var tx = 0, ty = 0;
    lb.addEventListener('touchstart', function (e) {
      tx = e.changedTouches[0].clientX;
      ty = e.changedTouches[0].clientY;
    }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - tx;
      var dy = e.changedTouches[0].clientY - ty;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.6) step(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  /* ---------- 2. 地圖 ---------- */
  var SPOTS = [
    {
      n: '1',
      cls: 'pin-1',
      lat: 35.15688,
      lng: 129.17382,
      name: '選手 01｜Banwol Poolvilla',
      addr: '4-5F, 67, Dalmaji-gil 62beon-gil, Haeundae-gu'
    },
    {
      n: '2',
      cls: 'pin-2',
      lat: 35.15982,
      lng: 129.16113,
      name: '選手 02｜UH Suite The Haeundae',
      addr: '271, Haeundaehaebyeon-ro, Haeundae-gu'
    }
  ];

  function initMap() {
    var el = document.getElementById('leafmap');
    var fb = document.getElementById('map-fallback');
    if (!el) return;

    if (typeof window.L === 'undefined') {
      if (fb) fb.classList.add('on');
      return;
    }

    try {
      var map = L.map(el, { scrollWheelZoom: false, attributionControl: true });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      var pts = [];
      SPOTS.forEach(function (s) {
        var icon = L.divIcon({
          className: '',
          html: '<div class="pin ' + s.cls + '"><b>' + s.n + '</b></div>',
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -28]
        });
        L.marker([s.lat, s.lng], { icon: icon, title: s.name })
          .addTo(map)
          .bindPopup(
            '<strong>' + s.name + '</strong><br>' + s.addr +
            '<br><a href="https://www.google.com/maps/search/?api=1&query=' +
            s.lat + ',' + s.lng + '" target="_blank" rel="noopener">在 Google 地圖開啟</a>'
          );
        pts.push([s.lat, s.lng]);
      });

      /* 兩點之間的連線，直觀顯示距離 */
      L.polyline(pts, {
        color: '#6b6258',
        weight: 2,
        opacity: .55,
        dashArray: '5,6'
      }).addTo(map);

      map.fitBounds(L.latLngBounds(pts).pad(0.55));
      if (map.getZoom() > 16) map.setZoom(16);

      /* 手機上用單指捲動頁面、雙指縮放地圖 */
      if (window.matchMedia('(max-width: 860px)').matches && map.dragging) {
        map.dragging.disable();
        if (L.Browser.touch) map.touchZoom.enable();
        el.addEventListener('touchstart', function (e) {
          if (e.touches.length > 1) map.dragging.enable();
        }, { passive: true });
        el.addEventListener('touchend', function (e) {
          if (e.touches.length === 0) map.dragging.disable();
        }, { passive: true });
      }
    } catch (err) {
      if (fb) fb.classList.add('on');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMap);
  } else {
    initMap();
  }
})();
