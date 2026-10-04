/**
 * LIVE POSITIONING SYSTEM (Wi-Fi / BLE Architecture)
 * 
 * Provides an interface for real-time indoor positioning:
 * Input format: { floor: number, x: number, y: number }
 * 
 * - Exposes window.updateLivePosition(payload) for external integration
 * - Maps position onto current route
 * - Dynamically updates current-location marker
 * - Clips travelled portion of route, leaving only remaining blue line
 * - Includes simulation mode for live testing & demonstration
 */

export class LivePositioningSystem {
  constructor(mapRenderer) {
    this.mapRenderer = mapRenderer;
    this.currentPosition = null;
    this.isSimulating = false;
    this.simInterval = null;
    this.listeners = [];

    // Register global hook for external systems / Wi-Fi daemons
    window.updateLivePosition = (payload) => this.handlePositionUpdate(payload);
  }

  onPositionUpdate(callback) {
    this.listeners.push(callback);
  }

  handlePositionUpdate(payload) {
    if (!payload || typeof payload.x !== "number" || typeof payload.y !== "number") {
      console.error("Invalid position payload. Expected { floor: number, x: number, y: number }", payload);
      return;
    }

    const floor = typeof payload.floor === "number" ? payload.floor : 0;
    this.currentPosition = {
      floor: floor,
      x: payload.x,
      y: payload.y
    };

    // Update map renderer
    this.mapRenderer.updateLivePosition(this.currentPosition);

    // Notify listeners
    this.listeners.forEach(cb => cb(this.currentPosition));
  }

  /**
   * Simulates a patient walking along the calculated route in real-time
   */
  startRouteWalkSimulation(routeNodes, onComplete) {
    this.stopSimulation();
    if (!routeNodes || routeNodes.length < 2) return;

    this.isSimulating = true;
    let currentIdx = 0;
    let t = 0;
    const speed = 0.05; // interpolation step speed

    this.simInterval = setInterval(() => {
      if (currentIdx >= routeNodes.length - 1) {
        this.stopSimulation();
        if (onComplete) onComplete();
        return;
      }

      const p1 = routeNodes[currentIdx];
      const p2 = routeNodes[currentIdx + 1];

      // If transition between different floors, switch floor smoothly
      if (p1.floor !== p2.floor) {
        currentIdx++;
        t = 0;
        this.handlePositionUpdate({
          floor: p2.floor,
          x: p2.x,
          y: p2.y
        });
        return;
      }

      t += speed;
      if (t >= 1) {
        t = 0;
        currentIdx++;
      }

      const currX = p1.x + (p2.x - p1.x) * t;
      const currY = p1.y + (p2.y - p1.y) * t;

      this.handlePositionUpdate({
        floor: p1.floor,
        x: Math.round(currX * 10) / 10,
        y: Math.round(currY * 10) / 10
      });
    }, 80);
  }

  stopSimulation() {
    if (this.simInterval) {
      clearInterval(this.simInterval);
      this.simInterval = null;
    }
    this.isSimulating = false;
  }
}
