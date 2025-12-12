require('./main.css');

// Protect against AFRAME being undefined at build time (Node/webpack)
if (typeof AFRAME !== 'undefined') {
  AFRAME.registerComponent('campus-tour', {
    init() {
      console.log('AR Campus Tour component loaded');

      // Locations (images are from <a-assets> IDs)
      this.locations = [
        {
          name: 'Main Entrance',
          description:
            'Welcome to the campus! This is the main entrance where students, staff and visitors arrive.',
          image: '#imgGate',
          position: { x: 0, y: 0, z: -2 },
        },
        {
          name: 'Cafeteria & Foyer',
          description:
            'The central foyer and cafeteria area. Students meet here between classes to eat, relax and study.',
          image: '#imgCafe',
          position: { x: 2, y: 0, z: -3 },
        },
        {
          name: 'Library',
          description:
            'Quiet study spaces, computers and thousands of books and journals are available in the library.',
          image: '#imgLibrary',
          position: { x: -2, y: 0, z: -3 },
        },
        {
          name: 'Academic Blocks',
          description:
            'The academic blocks contain classrooms, lecture halls, and faculty offices for daily academic activities.',
          image: '#imgAcademic',
          position: { x: 3.5, y: 0, z: -4 },
        },
        {
          name: 'Medical Lab',
          description:
            'The medical laboratory is used for practical experiments, diagnostics training, and healthcare research.',
          image: '#imgMedical',
          position: { x: -3.5, y: 0, z: -4 },
        },
        {
          name: 'Outdoor Seating Area',
          description:
            'An outdoor seating area where students relax, collaborate, and enjoy open-air campus life.',
          image: '#imgOutdoor',
          position: { x: 0, y: 0, z: -5 },
        },
      ];

      this.currentSpot = 0;
      this.visited = new Set();
      this.markerEntities = [];

      // Load saved progress
      this.loadProgress();

      this.markersParent = document.querySelector('#markers');
      this.infoPanel = document.querySelector('#infoPanel');
      this.title = document.querySelector('#panelTitle');
      this.desc = document.querySelector('#panelDesc');
      this.img = document.querySelector('#panelImg');

      this.progressEl = document.getElementById('progressChip');
      this.muteBtn = document.getElementById('muteBtn');
      this.bgm = document.getElementById('bgm');

      this.updateProgress();
      this.generateMarkers();
      this.setupUI();

      // Apply loaded progress visuals
      this.updateProgress();

      // If user already had progress, start at next unvisited
      if (this.visited.size > 0) {
        this.currentSpot = this.nextUnvisitedIndex();
        this.highlightSpot(this.currentSpot);

        // Also hide welcome overlay automatically (so it feels professional)
        const welcome = document.getElementById('welcomeOverlay');
        if (welcome) welcome.classList.add('hidden');
      }
    },

    ensureMusicStarted() {
      if (!this.bgm) return;

      // If user previously muted, don't force start
      // (still allow user to start manually via 🔊 button)
      // If you DO want it to start always, remove this if block.
      if (this.bgm.muted) return;

      // If already playing, nothing to do
      if (!this.bgm.paused) return;

      this.bgm.volume = 0.25;
      this.bgm.play().catch(() => {
        // autoplay blocked until a user gesture - that's fine
      });
    },

    generateMarkers() {
      this.locations.forEach((loc, index) => {
        const marker = document.createElement('a-entity');

        // Base marker (red)
        marker.setAttribute('geometry', 'primitive: box');
        marker.setAttribute('material', 'color: #ff4444; opacity: 0.85');
        marker.setAttribute('scale', '0.35 0.35 0.35');

        // 3D marker model
        marker.setAttribute('gltf-model', '#markerModel');

        marker.setAttribute(
          'position',
          `${loc.position.x} ${loc.position.y} ${loc.position.z}`
        );
        marker.setAttribute('class', 'clickable');

        // Float animation
        marker.setAttribute(
          'animation__float',
          `property: position; dir: alternate; dur: 1500; easing: easeInOutSine; loop: true; to: ${
            loc.position.x
          } ${loc.position.y + 0.25} ${loc.position.z}`
        );

        // Heading label
        const label = document.createElement('a-text');
        label.setAttribute('value', loc.name);
        label.setAttribute('align', 'center');
        label.setAttribute('color', '#ffffff');
        label.setAttribute('width', '3');
        label.setAttribute('side', 'double');
        label.setAttribute('position', '0 0.75 0');
        marker.appendChild(label);

        // Arrow
        const arrow = document.createElement('a-entity');
        arrow.setAttribute('gltf-model', '#arrowModel');
        arrow.setAttribute('scale', '0.2 0.2 0.2');
        arrow.setAttribute('position', '0 0.25 0.8');
        arrow.setAttribute('class', 'clickable');
        arrow.setAttribute(
          'animation__spin',
          'property: rotation; to: 0 360 0; loop: true; dur: 3000; easing: linear'
        );
        arrow.addEventListener('click', () => this.goToSpot(index));
        marker.appendChild(arrow);

        // Click marker
        marker.addEventListener('click', () => this.goToSpot(index));

        this.markersParent.appendChild(marker);
        this.markerEntities.push(marker);
      });

      this.highlightSpot(0);
    },

    showInfo(index) {
      const loc = this.locations[index];
      this.title.setAttribute('value', loc.name);
      this.desc.setAttribute('value', loc.description);
      this.img.setAttribute('src', loc.image);
      this.infoPanel.setAttribute('visible', true);
    },

    updateProgress() {
      if (!this.progressEl) return;
      this.progressEl.textContent = `Visited ${this.visited.size}/${this.locations.length}`;
    },

    setMarkerState(index, state) {
      const m = this.markerEntities[index];
      if (!m) return;

      // Reset pulse
      m.removeAttribute('animation__pulse');
      m.setAttribute('scale', '0.35 0.35 0.35');

      if (state === 'current') {
        m.setAttribute('material', 'color: #ff4444; opacity: 0.95');
        m.setAttribute(
          'animation__pulse',
          'property: scale; dir: alternate; dur: 700; loop: true; to: 0.42 0.42 0.42; easing: easeInOutSine'
        );
      } else if (state === 'visited') {
        m.setAttribute('material', 'color: #2ecc71; opacity: 0.9');
        m.setAttribute('scale', '0.33 0.33 0.33');
      } else {
        m.setAttribute('material', 'color: #ff4444; opacity: 0.85');
      }
    },

    highlightSpot(index) {
      for (let i = 0; i < this.markerEntities.length; i++) {
        if (this.visited.has(i)) this.setMarkerState(i, 'visited');
        else this.setMarkerState(i, 'default');
      }
      this.setMarkerState(index, 'current');
    },

    goToSpot(index) {
      this.currentSpot = index;
      this.ensureMusicStarted();
      this.highlightSpot(index);
      this.showInfo(index);

      // Mark visited + save
      this.visited.add(index);
      this.updateProgress();
      this.saveProgress();

      // Tour complete?
      // this.checkTourComplete()
    },

    nextUnvisitedIndex() {
      for (let step = 1; step <= this.locations.length; step++) {
        const idx = (this.currentSpot + step) % this.locations.length;
        if (!this.visited.has(idx)) return idx;
      }
      return 0;
    },

    // ---- LocalStorage Save/Load ----
    loadProgress() {
      try {
        const raw = localStorage.getItem('arCampusTourVisited');
        const arr = raw ? JSON.parse(raw) : [];
        this.visited = new Set(
          Array.isArray(arr)
            ? arr.filter(
                (n) =>
                  Number.isInteger(n) && n >= 0 && n < this.locations.length
              )
            : []
        );
      } catch (e) {
        this.visited = new Set();
      }
    },

    saveProgress() {
      try {
        localStorage.setItem(
          'arCampusTourVisited',
          JSON.stringify(Array.from(this.visited))
        );
      } catch (e) {}
    },

    clearProgress() {
      try {
        localStorage.removeItem('arCampusTourVisited');
      } catch (e) {}
    },

    // ---- Tour Complete Overlay ----
    showTourComplete() {
      const el = document.getElementById('tourCompleteOverlay');
      if (el) el.classList.remove('hidden');
    },

    hideTourComplete() {
      const el = document.getElementById('tourCompleteOverlay');
      if (el) el.classList.add('hidden');
    },

    checkTourComplete() {
      if (this.visited.size >= this.locations.length) {
        this.showTourComplete();
      }
    },

    setupUI() {
      const startBtn = document.getElementById('startTourBtn');
      const nextBtn = document.getElementById('nextBtn');
      const restartBtn = document.getElementById('restartBtn');

      const welcome = document.getElementById('welcomeOverlay');
      const beginBtn = document.getElementById('beginBtn');

      const helpFab = document.getElementById('helpFab');
      const instructions = document.getElementById('instructionsPanel');
      const closeInstructions = document.getElementById('closeInstructions');

      // Start Tour button
      if (startBtn) {
        startBtn.onclick = () => {
          this.goToSpot(0);
        };
      }

      // Next Spot (go to next unvisited)
      if (nextBtn) {
        nextBtn.onclick = () => {
          // ✅ If tour is complete, show completion ONLY when Next is pressed
          if (this.visited.size >= this.locations.length) {
            this.showTourComplete();
            return;
          }

          const next = this.nextUnvisitedIndex();
          this.goToSpot(next);
        };
      }

      if (restartBtn) {
        restartBtn.onclick = () => {
          // Hide info panel
          this.infoPanel.setAttribute('visible', false);

          // Reset progress
          this.visited = new Set();
          this.clearProgress();
          this.currentSpot = 0;

          // Hide completion overlay if open
          this.hideTourComplete();

          // Reset UI + marker states
          this.updateProgress();
          this.highlightSpot(0);
        };
      }

      // Begin (welcome overlay)
      if (beginBtn && welcome) {
        beginBtn.onclick = () => {
          welcome.classList.add('hidden');
          this.goToSpot(0);

          // Start music after user gesture
          if (this.bgm) {
            this.bgm.volume = 0.25;
            this.bgm.play().catch(() => {});
          }
        };
      }

      // Mute / Unmute + Start audio on first gesture
      if (this.muteBtn) {
        this.muteBtn.onclick = () => {
          if (!this.bgm) return;

          // If audio is paused (common after refresh), try starting it
          if (this.bgm.paused) {
            this.bgm.muted = false;
            this.bgm.volume = 0.25;
            this.bgm.play().catch(() => {});
          } else {
            // Otherwise just toggle mute
            this.bgm.muted = !this.bgm.muted;
          }

          this.muteBtn.textContent = this.bgm.muted ? '🔇' : '🔊';
        };
      }

      // Help overlay
      if (helpFab && instructions) {
        helpFab.onclick = () => instructions.classList.remove('hidden');
      }
      if (closeInstructions && instructions) {
        closeInstructions.onclick = () => instructions.classList.add('hidden');
      }

      const completeRestartBtn = document.getElementById('completeRestartBtn');
      const completeCloseBtn = document.getElementById('completeCloseBtn');

      if (completeRestartBtn) {
        completeRestartBtn.onclick = () => {
          this.infoPanel.setAttribute('visible', false);
          this.visited = new Set();
          this.clearProgress();
          this.currentSpot = 0;
          this.hideTourComplete();
          this.updateProgress();
          this.highlightSpot(0);
        };
      }

      if (completeCloseBtn) {
        completeCloseBtn.onclick = () => {
          this.hideTourComplete();
        };
      }
    },
  });
}
