/**
 * VECTOR SVG MAP RENDERING ENGINE
 * 
 * Renders floor plans, rooms, corridors, vertical links, routes, and markers.
 * Supports smooth pan, zoom, pinch, fit-route, and dynamic route clipping.
 */

export class HospitalMapRenderer {
  constructor(containerElement, dataset) {
    this.container = containerElement;
    this.dataset = dataset;
    this.currentFloor = 0;
    
    // Viewport transform state
    this.scale = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;

    // Active route & marker state
    this.activeRoute = null;
    this.currentLocationNode = null;
    this.destinationNode = null;
    this.livePosition = null;

    // Callbacks
    this.onNodeSelected = null;

    this.initSVG();
    this.setupEventListeners();
  }

  initSVG() {
    this.container.innerHTML = `
      <svg id="hospital-svg" class="map-svg" viewBox="0 0 850 540" preserveAspectRatio="xMidYMid meet">
        <defs>
          <!-- Route blue glow filter -->
          <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <!-- Subtle shadow for rooms -->
          <filter id="room-shadow" x="-5%" y="-5%" width="115%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#0f172a" flood-opacity="0.06" />
          </filter>

          <!-- Marker drop shadow -->
          <filter id="marker-shadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#0284c7" flood-opacity="0.3" />
          </filter>

          <!-- Linear Gradients for Healthcare Aesthetic -->
          <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#2563eb" />
            <stop offset="50%" stop-color="#3b82f6" />
            <stop offset="100%" stop-color="#1d4ed8" />
          </linearGradient>

          <linearGradient id="corridor-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#f8fafc" />
            <stop offset="100%" stop-color="#f1f5f9" />
          </linearGradient>

          <pattern id="hospital-grid" width="25" height="25" patternUnits="userSpaceOnUse">
            <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#e2e8f0" stroke-width="0.7" stroke-opacity="0.6"/>
          </pattern>
        </defs>

        <!-- Dynamic viewport transformation container -->
        <g id="viewport-group" transform="matrix(1 0 0 1 0 0)">
          <!-- Floor Base Grid & Outer Boundary -->
          <rect id="map-bg-grid" x="0" y="0" width="850" height="540" fill="url(#hospital-grid)" />
          <rect id="floor-boundary" x="15" y="15" width="820" height="510" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />
          
          <!-- Architectural Elements -->
          <g id="corridors-layer"></g>
          <g id="rooms-layer"></g>
          <g id="verticals-layer"></g>
          <g id="entrances-layer"></g>
          <g id="walkable-nodes-layer"></g>

          <!-- Navigation Visualization Layers -->
          <g id="route-layer"></g>
          <g id="markers-layer"></g>
        </g>
      </svg>
    `;

    this.svgElement = this.container.querySelector("#hospital-svg");
    this.viewportGroup = this.container.querySelector("#viewport-group");
    this.corridorsLayer = this.container.querySelector("#corridors-layer");
    this.roomsLayer = this.container.querySelector("#rooms-layer");
    this.verticalsLayer = this.container.querySelector("#verticals-layer");
    this.entrancesLayer = this.container.querySelector("#entrances-layer");
    this.walkableNodesLayer = this.container.querySelector("#walkable-nodes-layer");
    this.routeLayer = this.container.querySelector("#route-layer");
    this.markersLayer = this.container.querySelector("#markers-layer");

    this.renderFloor(this.currentFloor);
  }

  setupEventListeners() {
    // Mouse drag pan
    this.svgElement.addEventListener("mousedown", (e) => {
      // Only drag with left click or middle click
      if (e.button !== 0 && e.button !== 1) return;
      this.isDragging = true;
      this.dragStartX = e.clientX - this.panX;
      this.dragStartY = e.clientY - this.panY;
      this.svgElement.style.cursor = "grabbing";
    });

    window.addEventListener("mousemove", (e) => {
      if (!this.isDragging) return;
      this.panX = e.clientX - this.dragStartX;
      this.panY = e.clientY - this.dragStartY;
      this.updateTransform();
    });

    window.addEventListener("mouseup", () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.svgElement.style.cursor = "grab";
      }
    });

    // Mouse wheel zoom
    this.svgElement.addEventListener("wheel", (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
      this.zoomAtPoint(zoomFactor, e.clientX, e.clientY);
    }, { passive: false });

    // Touch support for mobile / tablet
    let initialTouchDistance = null;
    let initialTouchCenter = null;

    this.svgElement.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.dragStartX = e.touches[0].clientX - this.panX;
        this.dragStartY = e.touches[0].clientY - this.panY;
      } else if (e.touches.length === 2) {
        this.isDragging = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialTouchDistance = Math.hypot(dx, dy);
        initialTouchCenter = {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2
        };
      }
    }, { passive: true });

    this.svgElement.addEventListener("touchmove", (e) => {
      if (e.touches.length === 1 && this.isDragging) {
        this.panX = e.touches[0].clientX - this.dragStartX;
        this.panY = e.touches[0].clientY - this.dragStartY;
        this.updateTransform();
      } else if (e.touches.length === 2 && initialTouchDistance) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const factor = dist / initialTouchDistance;
        initialTouchDistance = dist;
        this.zoomAtPoint(factor, initialTouchCenter.x, initialTouchCenter.y);
      }
    }, { passive: true });

    this.svgElement.addEventListener("touchend", () => {
      this.isDragging = false;
      initialTouchDistance = null;
    });
  }

  zoomAtPoint(factor, clientX, clientY) {
    const rect = this.svgElement.getBoundingClientRect();
    const svgX = clientX - rect.left;
    const svgY = clientY - rect.top;

    const newScale = Math.min(Math.max(this.scale * factor, 0.6), 4.5);
    const actualFactor = newScale / this.scale;

    this.panX = svgX - (svgX - this.panX) * actualFactor;
    this.panY = svgY - (svgY - this.panY) * actualFactor;
    this.scale = newScale;

    this.updateTransform();
  }

  updateTransform() {
    this.viewportGroup.setAttribute(
      "transform",
      `matrix(${this.scale} 0 0 ${this.scale} ${this.panX} ${this.panY})`
    );
  }

  zoomIn() {
    const rect = this.svgElement.getBoundingClientRect();
    this.zoomAtPoint(1.25, rect.width / 2, rect.height / 2);
  }

  zoomOut() {
    const rect = this.svgElement.getBoundingClientRect();
    this.zoomAtPoint(0.8, rect.width / 2, rect.height / 2);
  }

  resetView() {
    this.scale = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.updateTransform();
  }

  fitRoute() {
    if (!this.activeRoute || !this.activeRoute.floorSegments[this.currentFloor]) {
      this.resetView();
      return;
    }

    const currentFloorNodes = this.activeRoute.floorSegments[this.currentFloor];
    if (currentFloorNodes.length === 0) {
      this.resetView();
      return;
    }

    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    currentFloorNodes.forEach(node => {
      minX = Math.min(minX, node.x);
      maxX = Math.max(maxX, node.x);
      minY = Math.min(minY, node.y);
      maxY = Math.max(maxY, node.y);
    });

    const padding = 120;
    const routeWidth = Math.max(maxX - minX, 150) + padding * 2;
    const routeHeight = Math.max(maxY - minY, 150) + padding * 2;

    const svgWidth = 850;
    const svgHeight = 540;

    const scaleX = svgWidth / routeWidth;
    const scaleY = svgHeight / routeHeight;
    const targetScale = Math.min(Math.max(Math.min(scaleX, scaleY), 0.8), 2.2);

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    this.scale = targetScale;
    this.panX = (svgWidth / 2) - centerX * targetScale;
    this.panY = (svgHeight / 2) - centerY * targetScale;

    this.updateTransform();
  }

  setFloor(floorNumber) {
    if (this.currentFloor === floorNumber) return;
    this.currentFloor = floorNumber;
    this.renderFloor(floorNumber);
    this.refreshRouteAndMarkers();
  }

  renderFloor(floorNumber) {
    const layout = this.dataset.architecturalLayout[floorNumber];
    if (!layout) return;

    // Clear previous elements
    this.corridorsLayer.innerHTML = "";
    this.roomsLayer.innerHTML = "";
    this.verticalsLayer.innerHTML = "";
    this.entrancesLayer.innerHTML = "";
    this.walkableNodesLayer.innerHTML = "";

    // 1. Render Corridors (Wide walkable tracks)
    layout.corridors.forEach(corridor => {
      const pathBg = document.createElementNS("http://www.w3.org/2000/svg", "path");
      pathBg.setAttribute("d", corridor.d);
      pathBg.setAttribute("stroke", "#f1f5f9");
      pathBg.setAttribute("stroke-width", "42");
      pathBg.setAttribute("stroke-linecap", "round");
      pathBg.setAttribute("stroke-linejoin", "round");
      this.corridorsLayer.appendChild(pathBg);

      const pathCenter = document.createElementNS("http://www.w3.org/2000/svg", "path");
      pathCenter.setAttribute("d", corridor.d);
      pathCenter.setAttribute("stroke", "#e2e8f0");
      pathCenter.setAttribute("stroke-width", "2");
      pathCenter.setAttribute("stroke-dasharray", "6,6");
      pathCenter.setAttribute("fill", "none");
      this.corridorsLayer.appendChild(pathCenter);
    });

    // 2. Render Rooms
    layout.rooms.forEach(room => {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", `room-group room-${room.type}`);
      g.setAttribute("data-node-id", room.id);
      g.style.cursor = "pointer";

      // Color scheme based on room type
      let fill = "#ffffff";
      let border = "#cbd5e1";
      let badgeBg = "#f8fafc";
      let badgeText = "#475569";

      if (room.type === "consultation") {
        fill = "#f8fafc";
        border = "#94a3b8";
        badgeBg = "#e0f2fe";
        badgeText = "#0369a1";
      } else if (room.type === "emergency") {
        fill = "#fff1f2";
        border = "#fda4af";
        badgeBg = "#ffe4e6";
        badgeText = "#e11d48";
      } else if (room.type === "pharmacy") {
        fill = "#f0fdf4";
        border = "#86efac";
        badgeBg = "#dcfce7";
        badgeText = "#15803d";
      } else if (room.type === "diagnostic" || room.type === "cardiology") {
        fill = "#f0f9ff";
        border = "#7dd3fc";
        badgeBg = "#e0f2fe";
        badgeText = "#0284c7";
      } else if (room.type === "critical" || room.type === "surgical") {
        fill = "#fffbeb";
        border = "#fcd34d";
        badgeBg = "#fef3c7";
        badgeText = "#b45309";
      } else if (room.type === "inpatient") {
        fill = "#f8fafc";
        border = "#cbd5e1";
        badgeBg = "#e2e8f0";
        badgeText = "#334155";
      }

      // Room Card Rectangle
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", room.x);
      rect.setAttribute("y", room.y);
      rect.setAttribute("width", room.width);
      rect.setAttribute("height", room.height);
      rect.setAttribute("rx", "10");
      rect.setAttribute("fill", fill);
      rect.setAttribute("stroke", border);
      rect.setAttribute("stroke-width", "1.8");
      rect.setAttribute("filter", "url(#room-shadow)");
      g.appendChild(rect);

      // Room Number Badge
      if (room.number) {
        const badgeW = Math.min(room.number.length * 11 + 18, 56);
        const badgeH = 18;
        const badgeX = room.x + 8;
        const badgeY = room.y + 8;

        const badgeRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        badgeRect.setAttribute("x", badgeX);
        badgeRect.setAttribute("y", badgeY);
        badgeRect.setAttribute("width", badgeW);
        badgeRect.setAttribute("height", badgeH);
        badgeRect.setAttribute("rx", "4");
        badgeRect.setAttribute("fill", badgeBg);
        g.appendChild(badgeRect);

        const badgeTextEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
        badgeTextEl.setAttribute("x", badgeX + badgeW / 2);
        badgeTextEl.setAttribute("y", badgeY + 13);
        badgeTextEl.setAttribute("text-anchor", "middle");
        badgeTextEl.setAttribute("font-size", "10");
        badgeTextEl.setAttribute("font-weight", "700");
        badgeTextEl.setAttribute("font-family", "'Inter', system-ui, sans-serif");
        badgeTextEl.setAttribute("fill", badgeText);
        badgeTextEl.textContent = room.number;
        g.appendChild(badgeTextEl);
      }

      // Room Label text
      const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      labelText.setAttribute("x", room.x + room.width / 2);
      labelText.setAttribute("y", room.y + (room.number ? 45 : 32));
      labelText.setAttribute("text-anchor", "middle");
      labelText.setAttribute("font-size", "12");
      labelText.setAttribute("font-weight", "700");
      labelText.setAttribute("font-family", "'Inter', system-ui, sans-serif");
      labelText.setAttribute("fill", "#0f172a");
      labelText.textContent = room.label;
      g.appendChild(labelText);

      // Sub-label (Department / Specialty)
      if (room.subLabel) {
        const subText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        subText.setAttribute("x", room.x + room.width / 2);
        subText.setAttribute("y", room.y + (room.number ? 60 : 48));
        subText.setAttribute("text-anchor", "middle");
        subText.setAttribute("font-size", "9.5");
        subText.setAttribute("font-family", "'Inter', system-ui, sans-serif");
        subText.setAttribute("fill", "#64748b");
        subText.textContent = room.subLabel;
        g.appendChild(subText);
      }

      // Room click listener
      g.addEventListener("click", () => {
        if (this.onNodeSelected) {
          this.onNodeSelected(room.id);
        }
      });

      this.roomsLayer.appendChild(g);
    });

    // 3. Render Verticals (Lifts & Stairs)
    layout.verticals.forEach(v => {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", `vertical-group vertical-${v.type}`);
      g.setAttribute("data-node-id", v.id);
      g.style.cursor = "pointer";

      const isLift = v.type === "lift";
      const bgFill = isLift ? "#eff6ff" : "#f1f5f9";
      const strokeColor = isLift ? "#3b82f6" : "#64748b";

      const box = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      box.setAttribute("x", v.x);
      box.setAttribute("y", v.y);
      box.setAttribute("width", v.width);
      box.setAttribute("height", v.height);
      box.setAttribute("rx", "8");
      box.setAttribute("fill", bgFill);
      box.setAttribute("stroke", strokeColor);
      box.setAttribute("stroke-width", "2");
      g.appendChild(box);

      // Icon indicator
      const iconText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      iconText.setAttribute("x", v.x + v.width / 2);
      iconText.setAttribute("y", v.y + 24);
      iconText.setAttribute("text-anchor", "middle");
      iconText.setAttribute("font-size", "14");
      iconText.textContent = isLift ? "🛗" : "🪜";
      g.appendChild(iconText);

      // Label text
      const vLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
      vLabel.setAttribute("x", v.x + v.width / 2);
      vLabel.setAttribute("y", v.y + 40);
      vLabel.setAttribute("text-anchor", "middle");
      vLabel.setAttribute("font-size", "10");
      vLabel.setAttribute("font-weight", "600");
      vLabel.setAttribute("font-family", "'Inter', system-ui, sans-serif");
      vLabel.setAttribute("fill", strokeColor);
      vLabel.textContent = v.label;
      g.appendChild(vLabel);

      g.addEventListener("click", () => {
        if (this.onNodeSelected) {
          this.onNodeSelected(v.id);
        }
      });

      this.verticalsLayer.appendChild(g);
    });

    // 4. Render Entrances
    layout.entrances.forEach(ent => {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", "entrance-marker");

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", ent.x);
      circle.setAttribute("cy", ent.y);
      circle.setAttribute("r", "16");
      circle.setAttribute("fill", "#10b981");
      circle.setAttribute("stroke", "#ffffff");
      circle.setAttribute("stroke-width", "2.5");
      g.appendChild(circle);

      const arrow = document.createElementNS("http://www.w3.org/2000/svg", "text");
      arrow.setAttribute("x", ent.x);
      arrow.setAttribute("y", ent.y + 5);
      arrow.setAttribute("text-anchor", "middle");
      arrow.setAttribute("font-size", "14");
      arrow.setAttribute("fill", "#ffffff");
      arrow.textContent = "▲";
      g.appendChild(arrow);

      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", ent.x);
      label.setAttribute("y", ent.y - 20);
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("font-size", "11");
      label.setAttribute("font-weight", "700");
      label.setAttribute("fill", "#065f46");
      label.textContent = ent.label;
      g.appendChild(label);

      this.entrancesLayer.appendChild(g);
    });

    // 5. Render Walkable Node Dots (Subtle indicator of graph fidelity)
    Object.values(this.dataset.nodes).forEach(node => {
      if (node.floor !== floorNumber) return;
      if (node.type === "corridor" || node.type === "junction") {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", node.x);
        circle.setAttribute("cy", node.y);
        circle.setAttribute("r", "3.5");
        circle.setAttribute("fill", "#cbd5e1");
        circle.setAttribute("stroke", "#ffffff");
        circle.setAttribute("stroke-width", "1");
        circle.setAttribute("opacity", "0.6");
        this.walkableNodesLayer.appendChild(circle);
      }
    });
  }

  setRoute(routeData, startNode, destNode) {
    this.activeRoute = routeData;
    this.currentLocationNode = startNode;
    this.destinationNode = destNode;

    // Automatically switch to start node floor initially if needed
    if (startNode && startNode.floor !== this.currentFloor) {
      this.setFloor(startNode.floor);
    } else {
      this.refreshRouteAndMarkers();
    }

    this.fitRoute();
  }

  clearRoute() {
    this.activeRoute = null;
    this.destinationNode = null;
    this.routeLayer.innerHTML = "";
    this.markersLayer.innerHTML = "";
  }

  refreshRouteAndMarkers() {
    this.routeLayer.innerHTML = "";
    this.markersLayer.innerHTML = "";

    if (!this.activeRoute || !this.activeRoute.success) {
      // Just render current location marker if available
      if (this.currentLocationNode && this.currentLocationNode.floor === this.currentFloor) {
        this.renderCurrentLocationMarker(this.currentLocationNode.x, this.currentLocationNode.y);
      }
      return;
    }

    const currentFloorNodes = this.activeRoute.floorSegments[this.currentFloor];

    // If there are nodes on this floor, render the blue route line
    if (currentFloorNodes && currentFloorNodes.length > 1) {
      let pathD = `M ${currentFloorNodes[0].x} ${currentFloorNodes[0].y}`;
      for (let i = 1; i < currentFloorNodes.length; i++) {
        pathD += ` L ${currentFloorNodes[i].x} ${currentFloorNodes[i].y}`;
      }

      // Outer glow line
      const glowLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
      glowLine.setAttribute("d", pathD);
      glowLine.setAttribute("stroke", "#60a5fa");
      glowLine.setAttribute("stroke-width", "11");
      glowLine.setAttribute("stroke-linecap", "round");
      glowLine.setAttribute("stroke-linejoin", "round");
      glowLine.setAttribute("stroke-opacity", "0.4");
      glowLine.setAttribute("fill", "none");
      this.routeLayer.appendChild(glowLine);

      // Primary BLUE route line
      const blueLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
      blueLine.setAttribute("id", "active-route-line");
      blueLine.setAttribute("d", pathD);
      blueLine.setAttribute("stroke", "#2563eb");
      blueLine.setAttribute("stroke-width", "5.5");
      blueLine.setAttribute("stroke-linecap", "round");
      blueLine.setAttribute("stroke-linejoin", "round");
      blueLine.setAttribute("fill", "none");
      this.routeLayer.appendChild(blueLine);

      // Animated pulsing dash overlay
      const dashLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
      dashLine.setAttribute("d", pathD);
      dashLine.setAttribute("stroke", "#ffffff");
      dashLine.setAttribute("stroke-width", "2");
      dashLine.setAttribute("stroke-dasharray", "8,12");
      dashLine.setAttribute("stroke-linecap", "round");
      dashLine.setAttribute("stroke-linejoin", "round");
      dashLine.setAttribute("fill", "none");
      dashLine.setAttribute("class", "animated-route-dash");
      this.routeLayer.appendChild(dashLine);
    }

    // Render Markers for this floor:
    // 1. Current Location Marker (if on this floor)
    if (this.currentLocationNode && this.currentLocationNode.floor === this.currentFloor) {
      const posX = this.livePosition ? this.livePosition.x : this.currentLocationNode.x;
      const posY = this.livePosition ? this.livePosition.y : this.currentLocationNode.y;
      this.renderCurrentLocationMarker(posX, posY);
    }

    // 2. Destination Marker (if on this floor)
    if (this.destinationNode && this.destinationNode.floor === this.currentFloor) {
      this.renderDestinationMarker(this.destinationNode.x, this.destinationNode.y, this.destinationNode.name);
    }

    // 3. Multi-floor vertical connector beacons
    if (this.activeRoute.hasVerticalTransition) {
      this.activeRoute.transitionNodes.forEach(t => {
        if (t.fromFloor === this.currentFloor) {
          this.renderVerticalBeacon(t.fromNode.x, t.fromNode.y, `Take ${t.connectorType} to Level ${t.toFloor === 0 ? "G" : "1"}`);
        } else if (t.toFloor === this.currentFloor) {
          this.renderVerticalBeacon(t.toNode.x, t.toNode.y, `Arriving from Level ${t.fromFloor === 0 ? "G" : "1"}`);
        }
      });
    }
  }

  renderCurrentLocationMarker(x, y) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", "current-location-marker");
    g.setAttribute("id", "current-loc-marker-group");

    // Ripple outer pulse
    const ripple = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    ripple.setAttribute("cx", x);
    ripple.setAttribute("cy", y);
    ripple.setAttribute("r", "16");
    ripple.setAttribute("fill", "#2563eb");
    ripple.setAttribute("fill-opacity", "0.2");
    ripple.setAttribute("class", "pulse-ripple");
    g.appendChild(ripple);

    // Solid blue pin circle
    const pin = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    pin.setAttribute("cx", x);
    pin.setAttribute("cy", y);
    pin.setAttribute("r", "9");
    pin.setAttribute("fill", "#1d4ed8");
    pin.setAttribute("stroke", "#ffffff");
    pin.setAttribute("stroke-width", "3");
    pin.setAttribute("filter", "url(#marker-shadow)");
    g.appendChild(pin);

    // Inner bright center dot
    const centerDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    centerDot.setAttribute("cx", x);
    centerDot.setAttribute("cy", y);
    centerDot.setAttribute("r", "3");
    centerDot.setAttribute("fill", "#ffffff");
    g.appendChild(centerDot);

    // Floating tag
    const badgeW = 90;
    const badgeH = 22;
    const badgeX = x - badgeW / 2;
    const badgeY = y - 36;

    const tagBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    tagBg.setAttribute("x", badgeX);
    tagBg.setAttribute("y", badgeY);
    tagBg.setAttribute("width", badgeW);
    tagBg.setAttribute("height", badgeH);
    tagBg.setAttribute("rx", "11");
    tagBg.setAttribute("fill", "#1e293b");
    tagBg.setAttribute("stroke", "#ffffff");
    tagBg.setAttribute("stroke-width", "1.5");
    tagBg.setAttribute("filter", "url(#room-shadow)");
    g.appendChild(tagBg);

    const tagText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    tagText.setAttribute("x", x);
    tagText.setAttribute("y", badgeY + 15);
    tagText.setAttribute("text-anchor", "middle");
    tagText.setAttribute("font-size", "10");
    tagText.setAttribute("font-weight", "600");
    tagText.setAttribute("font-family", "'Inter', system-ui, sans-serif");
    tagText.setAttribute("fill", "#ffffff");
    tagText.textContent = "Start Location";
    g.appendChild(tagText);

    this.markersLayer.appendChild(g);
  }

  renderDestinationMarker(x, y, name) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", "destination-marker");

    // Pulsing outer beacon
    const beacon = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    beacon.setAttribute("cx", x);
    beacon.setAttribute("cy", y);
    beacon.setAttribute("r", "20");
    beacon.setAttribute("fill", "#ef4444");
    beacon.setAttribute("fill-opacity", "0.22");
    beacon.setAttribute("class", "pulse-ripple-red");
    g.appendChild(beacon);

    // Exact destination terminus point (blue route terminates exactly here!)
    const exactTerminusDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    exactTerminusDot.setAttribute("cx", x);
    exactTerminusDot.setAttribute("cy", y);
    exactTerminusDot.setAttribute("r", "6");
    exactTerminusDot.setAttribute("fill", "#2563eb");
    exactTerminusDot.setAttribute("stroke", "#ffffff");
    exactTerminusDot.setAttribute("stroke-width", "2");
    g.appendChild(exactTerminusDot);

    // Destination Pin Shape
    const pinG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    pinG.setAttribute("transform", `translate(${x - 14}, ${y - 38})`);

    const pinPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pinPath.setAttribute("d", "M 14 0 C 6.268 0 0 6.268 0 14 C 0 24.5 14 38 14 38 C 14 38 28 24.5 28 14 C 28 6.268 21.732 0 14 0 Z");
    pinPath.setAttribute("fill", "#ef4444");
    pinPath.setAttribute("stroke", "#ffffff");
    pinPath.setAttribute("stroke-width", "2");
    pinPath.setAttribute("filter", "url(#room-shadow)");
    pinG.appendChild(pinPath);

    const pinInner = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    pinInner.setAttribute("cx", "14");
    pinInner.setAttribute("cy", "14");
    pinInner.setAttribute("r", "5.5");
    pinInner.setAttribute("fill", "#ffffff");
    pinG.appendChild(pinInner);

    g.appendChild(pinG);

    // Floating Target Label
    const cleanName = (name || "Destination").length > 22 ? (name || "Destination").slice(0, 20) + "…" : (name || "Destination");
    const badgeW = Math.max(cleanName.length * 7.5 + 24, 100);
    const badgeH = 24;
    const badgeX = x - badgeW / 2;
    const badgeY = y - 66;

    const labelBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    labelBg.setAttribute("x", badgeX);
    labelBg.setAttribute("y", badgeY);
    labelBg.setAttribute("width", badgeW);
    labelBg.setAttribute("height", badgeH);
    labelBg.setAttribute("rx", "12");
    labelBg.setAttribute("fill", "#ef4444");
    labelBg.setAttribute("stroke", "#ffffff");
    labelBg.setAttribute("stroke-width", "1.5");
    labelBg.setAttribute("filter", "url(#room-shadow)");
    g.appendChild(labelBg);

    const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    labelText.setAttribute("x", x);
    labelText.setAttribute("y", badgeY + 16);
    labelText.setAttribute("text-anchor", "middle");
    labelText.setAttribute("font-size", "11");
    labelText.setAttribute("font-weight", "700");
    labelText.setAttribute("font-family", "'Inter', system-ui, sans-serif");
    labelText.setAttribute("fill", "#ffffff");
    labelText.textContent = cleanName;
    g.appendChild(labelText);

    this.markersLayer.appendChild(g);
  }

  renderVerticalBeacon(x, y, text) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", "vertical-beacon");

    const badgeW = 150;
    const badgeH = 26;
    const badgeX = x - badgeW / 2;
    const badgeY = y - 40;

    const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bg.setAttribute("x", badgeX);
    bg.setAttribute("y", badgeY);
    bg.setAttribute("width", badgeW);
    bg.setAttribute("height", badgeH);
    bg.setAttribute("rx", "13");
    bg.setAttribute("fill", "#0284c7");
    bg.setAttribute("stroke", "#ffffff");
    bg.setAttribute("stroke-width", "2");
    bg.setAttribute("filter", "url(#room-shadow)");
    g.appendChild(bg);

    const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
    txt.setAttribute("x", x);
    txt.setAttribute("y", badgeY + 17);
    txt.setAttribute("text-anchor", "middle");
    txt.setAttribute("font-size", "10.5");
    txt.setAttribute("font-weight", "700");
    txt.setAttribute("font-family", "'Inter', system-ui, sans-serif");
    txt.setAttribute("fill", "#ffffff");
    txt.textContent = text;
    g.appendChild(txt);

    this.markersLayer.appendChild(g);
  }

  // Update live Wi-Fi position and clip the blue line to only remaining route!
  updateLivePosition(pos) {
    this.livePosition = pos;

    if (pos.floor !== this.currentFloor) {
      this.setFloor(pos.floor);
      return;
    }

    // Update marker coordinates dynamically
    const markerGroup = this.markersLayer.querySelector("#current-loc-marker-group");
    if (markerGroup) {
      markerGroup.remove();
    }
    this.renderCurrentLocationMarker(pos.x, pos.y);

    // If active route exists on this floor, clip travelled portion of the blue line
    if (this.activeRoute && this.activeRoute.floorSegments[this.currentFloor]) {
      const floorNodes = this.activeRoute.floorSegments[this.currentFloor];
      if (floorNodes.length > 1) {
        // Find nearest point/segment along the route
        const clippedPath = this.clipRouteToPosition(floorNodes, pos.x, pos.y);
        if (clippedPath) {
          const blueLine = this.routeLayer.querySelector("#active-route-line");
          if (blueLine) {
            blueLine.setAttribute("d", clippedPath);
          }
        }
      }
    }
  }

  clipRouteToPosition(nodes, px, py) {
    if (!nodes || nodes.length < 2) return null;

    let closestSegmentIdx = 0;
    let minDistance = Infinity;
    let projPoint = { x: nodes[0].x, y: nodes[0].y };

    for (let i = 0; i < nodes.length - 1; i++) {
      const p1 = nodes[i];
      const p2 = nodes[i + 1];

      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const lenSq = dx * dx + dy * dy;

      let t = 0;
      if (lenSq > 0) {
        t = Math.max(0, Math.min(1, ((px - p1.x) * dx + (py - p1.y) * dy) / lenSq));
      }

      const projected = {
        x: p1.x + t * dx,
        y: p1.y + t * dy
      };

      const dist = Math.hypot(px - projected.x, py - projected.y);
      if (dist < minDistance) {
        minDistance = dist;
        closestSegmentIdx = i;
        projPoint = projected;
      }
    }

    // Construct remaining route path starting from the projected live position
    let remainingPathD = `M ${projPoint.x} ${projPoint.y}`;
    for (let i = closestSegmentIdx + 1; i < nodes.length; i++) {
      remainingPathD += ` L ${nodes[i].x} ${nodes[i].y}`;
    }

    return remainingPathD;
  }
}
