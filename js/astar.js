/**
 * A* PATHFINDING ALGORITHM
 * 
 * Strictly uses supplied graph nodes, walkable edges, and vertical connections.
 * Guarantees optimal path using edge distances and Euclidean heuristic.
 */

export class AStarPathfinder {
  constructor(dataset) {
    this.dataset = dataset;
    this.adjacency = new Map();
    this.buildGraph();
  }

  buildGraph() {
    // Initialize adjacency map for each node
    for (const nodeId of Object.keys(this.dataset.nodes)) {
      this.adjacency.set(nodeId, []);
    }

    // Populate walkable edges (bidirectional)
    for (const edge of this.dataset.edges) {
      const fromNode = this.dataset.nodes[edge.from];
      const toNode = this.dataset.nodes[edge.to];

      if (!fromNode || !toNode) {
        console.warn(`Edge references missing node: ${edge.from} -> ${edge.to}`);
        continue;
      }

      const dist = typeof edge.distance === "number" ? edge.distance : this.calculateEuclideanDistance(fromNode, toNode);

      this.adjacency.get(edge.from).push({
        to: edge.to,
        distance: dist,
        isVertical: !!edge.isVertical,
        type: edge.type || "corridor"
      });

      this.adjacency.get(edge.to).push({
        to: edge.from,
        distance: dist,
        isVertical: !!edge.isVertical,
        type: edge.type || "corridor"
      });
    }
  }

  calculateEuclideanDistance(nodeA, nodeB) {
    const dx = nodeA.x - nodeB.x;
    const dy = nodeA.y - nodeB.y;
    const planarDist = Math.sqrt(dx * dx + dy * dy);
    if (nodeA.floor !== nodeB.floor) {
      const floorDiff = Math.abs(nodeA.floor - nodeB.floor);
      return planarDist + floorDiff * 18.0;
    }
    return planarDist;
  }

  heuristic(nodeA, nodeB) {
    // Admissible Euclidean heuristic
    const dx = nodeA.x - nodeB.x;
    const dy = nodeA.y - nodeB.y;
    const planar = Math.sqrt(dx * dx + dy * dy);
    const floorPenalty = Math.abs(nodeA.floor - nodeB.floor) * 15.0;
    return planar + floorPenalty;
  }

  findRoute(startNodeId, targetNodeId) {
    const startNode = this.dataset.nodes[startNodeId];
    const targetNode = this.dataset.nodes[targetNodeId];

    if (!startNode || !targetNode) {
      return {
        success: false,
        error: "Destination location unavailable."
      };
    }

    if (startNodeId === targetNodeId) {
      return {
        success: true,
        path: [startNode],
        totalDistance: 0,
        floorSegments: {
          [startNode.floor]: [startNode]
        },
        hasVerticalTransition: false,
        transitionNodes: []
      };
    }

    const openSet = new Set([startNodeId]);
    const cameFrom = new Map();

    const gScore = new Map();
    const fScore = new Map();

    for (const id of Object.keys(this.dataset.nodes)) {
      gScore.set(id, Infinity);
      fScore.set(id, Infinity);
    }

    gScore.set(startNodeId, 0);
    fScore.set(startNodeId, this.heuristic(startNode, targetNode));

    while (openSet.size > 0) {
      // Find node in openSet with lowest fScore
      let currentId = null;
      let lowestF = Infinity;

      for (const id of openSet) {
        const score = fScore.get(id);
        if (score < lowestF) {
          lowestF = score;
          currentId = id;
        }
      }

      if (currentId === targetNodeId) {
        // Goal reached! Reconstruct full path
        return this.reconstructPath(cameFrom, currentId, gScore.get(targetNodeId));
      }

      openSet.delete(currentId);
      const currentNode = this.dataset.nodes[currentId];
      const neighbors = this.adjacency.get(currentId) || [];

      for (const edge of neighbors) {
        const neighborNode = this.dataset.nodes[edge.to];
        if (!neighborNode) continue;

        const tentativeG = gScore.get(currentId) + edge.distance;

        if (tentativeG < gScore.get(edge.to)) {
          cameFrom.set(edge.to, {
            fromId: currentId,
            edge: edge
          });
          gScore.set(edge.to, tentativeG);
          fScore.set(edge.to, tentativeG + this.heuristic(neighborNode, targetNode));

          if (!openSet.has(edge.to)) {
            openSet.add(edge.to);
          }
        }
      }
    }

    // No path found in graph
    return {
      success: false,
      error: "No walkable route found between the selected locations."
    };
  }

  reconstructPath(cameFrom, currentId, totalCost) {
    const path = [];
    let curr = currentId;

    while (curr) {
      const node = this.dataset.nodes[curr];
      path.unshift(node);
      const parent = cameFrom.get(curr);
      curr = parent ? parent.fromId : null;
    }

    // Organize path into floor segments and identify vertical transitions
    const floorSegments = {};
    const transitionNodes = [];
    let hasVerticalTransition = false;

    for (let i = 0; i < path.length; i++) {
      const node = path[i];
      if (!floorSegments[node.floor]) {
        floorSegments[node.floor] = [];
      }
      floorSegments[node.floor].push(node);

      if (i > 0) {
        const prev = path[i - 1];
        if (prev.floor !== node.floor) {
          hasVerticalTransition = true;
          transitionNodes.push({
            fromFloor: prev.floor,
            toFloor: node.floor,
            fromNode: prev,
            toNode: node,
            connectorType: (prev.type === "lift" || node.type === "lift") ? "Lift" : "Stairs"
          });
        }
      }
    }

    return {
      success: true,
      path: path,
      totalDistance: Math.round(totalCost * 10) / 10,
      floorSegments: floorSegments,
      hasVerticalTransition: hasVerticalTransition,
      transitionNodes: transitionNodes
    };
  }
}
