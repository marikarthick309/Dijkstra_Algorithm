/**
 * HOSPITAL INDOOR NAVIGATION CONTROLLER
 * 
 * Orchestrates search, location selection, A* path calculation,
 * vector map rendering, floor switching, and live positioning architecture.
 */

import { MASTER_DATASET } from "./dataset.js";
import { AStarPathfinder } from "./astar.js";
import { HospitalMapRenderer } from "./mapRenderer.js";
import { LivePositioningSystem } from "./livePositioning.js";

class HospitalNavigationApp {
  constructor() {
    this.dataset = MASTER_DATASET;
    this.pathfinder = new AStarPathfinder(this.dataset);
    
    // DOM Elements
    this.mapContainer = document.getElementById("map-viewport");
    this.startSelect = document.getElementById("start-location-select");
    this.destInput = document.getElementById("destination-search-input");
    this.searchResultsDropdown = document.getElementById("search-results-dropdown");
    this.clearSearchBtn = document.getElementById("clear-search-btn");
    this.distanceBadge = document.getElementById("route-distance-badge");
    this.routeInfoBanner = document.getElementById("route-info-banner");
    this.errorMessageBanner = document.getElementById("error-message-banner");
    this.floorButtons = document.querySelectorAll(".floor-tab-btn");
    
    // Map control buttons
    this.btnZoomIn = document.getElementById("btn-zoom-in");
    this.btnZoomOut = document.getElementById("btn-zoom-out");
    this.btnResetView = document.getElementById("btn-reset-view");
    this.btnFitRoute = document.getElementById("btn-fit-route");
    
    // Wi-Fi simulation elements
    this.btnSimulateWalk = document.getElementById("btn-simulate-walk");
    this.btnWifiMock = document.getElementById("btn-wifi-mock");
    this.wifiModal = document.getElementById("wifi-modal");
    this.closeWifiModalBtn = document.getElementById("btn-close-wifi-modal");
    this.sendWifiPayloadBtn = document.getElementById("btn-send-wifi-payload");
    this.wifiFloorInput = document.getElementById("wifi-input-floor");
    this.wifiXInput = document.getElementById("wifi-input-x");
    this.wifiYInput = document.getElementById("wifi-input-y");

    // State
    this.currentStartNodeId = "G-ENTRANCE"; // Default entry point
    this.currentSelectedDest = null;
    this.currentRoute = null;

    // Initialize Subsystems
    this.renderer = new HospitalMapRenderer(this.mapContainer, this.dataset);
    this.livePositioning = new LivePositioningSystem(this.renderer);

    this.initUI();
    this.bindEvents();
    
    // Set initial current location marker
    const initialNode = this.dataset.nodes[this.currentStartNodeId];
    this.renderer.currentLocationNode = initialNode;
    this.renderer.renderCurrentLocationMarker(initialNode.x, initialNode.y);
  }

  initUI() {
    // Populate start location select options
    this.startSelect.innerHTML = "";
    
    // Group locations by floor
    const groundNodes = [];
    const firstFloorNodes = [];

    Object.values(this.dataset.nodes).forEach(node => {
      // Exclude doorways to keep list human-friendly
      if (node.id.includes("-DOOR") || node.id.includes("-ENT") || node.id.includes("-AIRLOCK")) return;
      
      if (node.floor === 0) {
        groundNodes.push(node);
      } else {
        firstFloorNodes.push(node);
      }
    });

    const optGroupGF = document.createElement("optgroup");
    optGroupGF.label = "Ground Floor (GF)";
    groundNodes.forEach(node => {
      const opt = document.createElement("option");
      opt.value = node.id;
      opt.textContent = node.name;
      if (node.id === this.currentStartNodeId) opt.selected = true;
      optGroupGF.appendChild(opt);
    });
    this.startSelect.appendChild(optGroupGF);

    const optGroup1F = document.createElement("optgroup");
    optGroup1F.label = "First Floor (1F)";
    firstFloorNodes.forEach(node => {
      const opt = document.createElement("option");
      opt.value = node.id;
      opt.textContent = node.name;
      optGroup1F.appendChild(opt);
    });
    this.startSelect.appendChild(optGroup1F);
  }

  bindEvents() {
    // Floor Switching Tabs
    this.floorButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const floor = parseInt(btn.dataset.floor, 10);
        this.switchFloorUI(floor);
      });
    });

    // Start Location Change
    this.startSelect.addEventListener("change", (e) => {
      this.currentStartNodeId = e.target.value;
      const startNode = this.dataset.nodes[this.currentStartNodeId];
      this.renderer.currentLocationNode = startNode;
      
      // Auto-switch to start node floor if different
      if (startNode.floor !== this.renderer.currentFloor) {
        this.switchFloorUI(startNode.floor);
      } else {
        this.renderer.refreshRouteAndMarkers();
      }

      // Re-run route if destination already selected
      if (this.currentSelectedDest) {
        this.calculateAndDisplayRoute();
      }
    });

    // Destination Search Input
    this.destInput.addEventListener("input", (e) => {
      const query = e.target.value.trim().toLowerCase();
      this.handleSearchInput(query);
    });

    this.destInput.addEventListener("focus", () => {
      const query = this.destInput.value.trim().toLowerCase();
      this.handleSearchInput(query);
    });

    // Clear search button
    this.clearSearchBtn.addEventListener("click", () => {
      this.destInput.value = "";
      this.clearSearchBtn.style.display = "none";
      this.searchResultsDropdown.style.display = "none";
      this.currentSelectedDest = null;
      this.clearActiveRoute();
    });

    // Click outside to close dropdown
    document.addEventListener("click", (e) => {
      if (!this.searchResultsDropdown.contains(e.target) && e.target !== this.destInput) {
        this.searchResultsDropdown.style.display = "none";
      }
    });

    // Map controls
    this.btnZoomIn.addEventListener("click", () => this.renderer.zoomIn());
    this.btnZoomOut.addEventListener("click", () => this.renderer.zoomOut());
    this.btnResetView.addEventListener("click", () => this.renderer.resetView());
    this.btnFitRoute.addEventListener("click", () => this.renderer.fitRoute());

    // Map interactive node click
    this.renderer.onNodeSelected = (nodeId) => {
      // Find matching destination or node
      const matchingDest = this.dataset.destinations.find(d => d.nodeId === nodeId);
      if (matchingDest) {
        this.selectDestination(matchingDest);
      }
    };

    // Quick destination pill buttons
    const quickPills = document.querySelectorAll(".quick-dest-pill");
    quickPills.forEach(pill => {
      pill.addEventListener("click", () => {
        const destId = pill.dataset.destId;
        const dest = this.dataset.destinations.find(d => d.id === destId);
        if (dest) {
          this.selectDestination(dest);
        }
      });
    });

    // Wi-Fi / Live positioning controls
    this.btnSimulateWalk.addEventListener("click", () => {
      if (!this.currentRoute || !this.currentRoute.path) {
        this.showError("Please calculate a route first before starting simulation.");
        return;
      }
      this.btnSimulateWalk.classList.add("active-simulating");
      this.btnSimulateWalk.textContent = "Walking Route…";
      this.livePositioning.startRouteWalkSimulation(this.currentRoute.path, () => {
        this.btnSimulateWalk.classList.remove("active-simulating");
        this.btnSimulateWalk.textContent = "▶ Simulate Wi-Fi Walk";
      });
    });

    this.btnWifiMock.addEventListener("click", () => {
      this.wifiModal.classList.add("open");
    });

    this.closeWifiModalBtn.addEventListener("click", () => {
      this.wifiModal.classList.remove("open");
    });

    this.sendWifiPayloadBtn.addEventListener("click", () => {
      const floor = parseInt(this.wifiFloorInput.value, 10);
      const x = parseFloat(this.wifiXInput.value);
      const y = parseFloat(this.wifiYInput.value);

      if (isNaN(floor) || isNaN(x) || isNaN(y)) {
        alert("Please enter valid numeric values for floor, x, and y.");
        return;
      }

      const payload = { floor, x, y };
      window.updateLivePosition(payload);
      this.wifiModal.classList.remove("open");
    });
  }

  switchFloorUI(floor) {
    this.floorButtons.forEach(b => {
      b.classList.toggle("active", parseInt(b.dataset.floor, 10) === floor);
    });
    this.renderer.setFloor(floor);
  }

  handleSearchInput(query) {
    if (!query) {
      this.searchResultsDropdown.style.display = "none";
      this.clearSearchBtn.style.display = "none";
      return;
    }

    this.clearSearchBtn.style.display = "flex";

    // Search through supplied dataset destinations
    const matched = this.dataset.destinations.filter(dest => {
      const nameMatch = dest.name.toLowerCase().includes(query);
      const aliasMatch = dest.aliases.some(a => a.toLowerCase().includes(query));
      const roomMatch = dest.roomNumber && dest.roomNumber.toLowerCase().includes(query);
      const deptMatch = dest.department && dest.department.toLowerCase().includes(query);
      return nameMatch || aliasMatch || roomMatch || deptMatch;
    });

    if (matched.length === 0) {
      this.searchResultsDropdown.innerHTML = `
        <div class="search-no-results">
          <span class="warning-icon">⚠️</span>
          <span>Destination location unavailable.</span>
        </div>
      `;
      this.searchResultsDropdown.style.display = "block";
      return;
    }

    // Render search results
    this.searchResultsDropdown.innerHTML = "";
    matched.forEach(dest => {
      const item = document.createElement("div");
      item.className = "search-result-item";
      
      const floorLabel = dest.floor === 0 ? "Ground Floor" : "1st Floor";
      
      item.innerHTML = `
        <div class="result-icon-col">
          <div class="dest-type-icon">🏥</div>
        </div>
        <div class="result-details-col">
          <div class="result-name">${this.highlightMatch(dest.name, query)}</div>
          <div class="result-sub">${dest.department} • <span class="floor-tag">${floorLabel}</span></div>
        </div>
        <div class="result-action-col">
          <span class="action-route-arrow">➔</span>
        </div>
      `;

      item.addEventListener("click", () => {
        this.selectDestination(dest);
      });

      this.searchResultsDropdown.appendChild(item);
    });

    this.searchResultsDropdown.style.display = "block";
  }

  highlightMatch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, "<strong>$1</strong>");
  }

  selectDestination(dest) {
    this.currentSelectedDest = dest;
    this.destInput.value = dest.name;
    this.searchResultsDropdown.style.display = "none";
    this.clearSearchBtn.style.display = "flex";
    this.hideError();

    // Verify node integrity from supplied dataset
    const destNode = this.dataset.nodes[dest.nodeId];
    if (!destNode) {
      this.showError("Destination location unavailable.");
      return;
    }

    this.calculateAndDisplayRoute();
  }

  calculateAndDisplayRoute() {
    this.hideError();

    const startNode = this.dataset.nodes[this.currentStartNodeId];
    if (!startNode) {
      this.showError("Current start location is unavailable in graph.");
      return;
    }

    if (!this.currentSelectedDest) {
      return;
    }

    const destNode = this.dataset.nodes[this.currentSelectedDest.nodeId];
    if (!destNode) {
      this.showError("Destination location unavailable.");
      return;
    }

    // Run A* algorithm strictly on supplied graph
    const routeResult = this.pathfinder.findRoute(startNode.id, destNode.id);

    if (!routeResult.success) {
      this.showError(routeResult.error || "Destination location unavailable.");
      return;
    }

    this.currentRoute = routeResult;

    // Display blue line terminating exactly at destination node
    this.renderer.setRoute(routeResult, startNode, destNode);

    // Update Distance badge
    const estTimeSec = Math.round(routeResult.totalDistance / 1.3); // ~1.3 m/s walking speed
    const estTimeStr = estTimeSec < 60 ? `${estTimeSec} sec` : `${Math.ceil(estTimeSec / 60)} min`;
    
    this.distanceBadge.innerHTML = `
      <span class="dist-icon">📏</span>
      <span class="dist-val">Distance: <strong>${routeResult.totalDistance} m</strong></span>
      <span class="dist-dot">•</span>
      <span class="dist-time">~${estTimeStr} walk</span>
    `;
    this.distanceBadge.style.display = "inline-flex";

    // Multi-floor information banner
    if (routeResult.hasVerticalTransition) {
      const trans = routeResult.transitionNodes[0];
      this.routeInfoBanner.innerHTML = `
        <span class="banner-icon">ℹ️</span>
        <span>Route transitions from Level ${trans.fromFloor === 0 ? "G" : "1"} to Level ${trans.toFloor === 0 ? "G" : "1"} via <strong>${trans.connectorType}</strong>. Switching floors visually supported.</span>
      `;
      this.routeInfoBanner.style.display = "flex";
    } else {
      this.routeInfoBanner.style.display = "none";
    }

    // Automatically show correct floor
    // If starting on a different floor than currently visible, switch to start floor
    if (startNode.floor !== this.renderer.currentFloor) {
      this.switchFloorUI(startNode.floor);
    }
  }

  clearActiveRoute() {
    this.currentRoute = null;
    this.renderer.clearRoute();
    this.distanceBadge.style.display = "none";
    this.routeInfoBanner.style.display = "none";
    this.hideError();
  }

  showError(message) {
    this.errorMessageBanner.textContent = message;
    this.errorMessageBanner.style.display = "block";
  }

  hideError() {
    this.errorMessageBanner.style.display = "none";
  }
}

// Bootstrap application on DOM load
window.addEventListener("DOMContentLoaded", () => {
  window.hospitalApp = new HospitalNavigationApp();
});
