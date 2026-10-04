/**
 * MASTER HOSPITAL NAVIGATION DATASET
 * 
 * Strict specifications:
 * - Exact node IDs, human-readable names, exact physical coordinates (x, y)
 * - Floor numbers (0 = Ground Floor, 1 = First Floor)
 * - Walkable graph edges with exact distances
 * - Vertical connectors (Lifts & Stairs)
 * - Searchable destination catalog
 * - Architectural room boundaries and corridors for SVG rendering
 */

export const MASTER_DATASET = {
  floors: [
    {
      id: 0,
      code: "GF",
      name: "Ground Floor",
      shortName: "Ground",
      level: 0,
      viewBox: "0 0 850 540",
      description: "Outpatient Clinics, Emergency, Radiology, Pharmacy & Reception"
    },
    {
      id: 1,
      code: "1F",
      name: "First Floor",
      shortName: "Level 1",
      level: 1,
      viewBox: "0 0 850 540",
      description: "Inpatient Rooms 201-206, ICU, Operation Theatres & Cardiology"
    }
  ],

  // Node definitions
  nodes: {
    // ==========================================
    // GROUND FLOOR (Floor 0)
    // ==========================================
    // Entrances & Lobby
    "G-ENTRANCE": { id: "G-ENTRANCE", name: "Hospital Main Entrance", floor: 0, x: 420, y: 500, type: "entrance" },
    "G-VESTIBULE": { id: "G-VESTIBULE", name: "Entrance Vestibule & Triage", floor: 0, x: 420, y: 440, type: "junction" },
    "G-RECEPTION": { id: "G-RECEPTION", name: "Main Reception & Help Desk", floor: 0, x: 420, y: 370, type: "room", roomNumber: "REC-01", department: "Patient Services" },
    "G-LOBBY-CORR": { id: "G-LOBBY-CORR", name: "Main Lobby Central Corridor", floor: 0, x: 420, y: 320, type: "corridor" },
    "G-CENTRAL-HUB": { id: "G-CENTRAL-HUB", name: "Ground Floor Central Atrium Hub", floor: 0, x: 420, y: 250, type: "junction" },

    // Central Vertical Connections (Floor 0)
    "G-LIFT-A": { id: "G-LIFT-A", name: "Elevator Bank A (Ground)", floor: 0, x: 380, y: 200, type: "lift" },
    "G-LIFT-B": { id: "G-LIFT-B", name: "Elevator Bank B (Ground)", floor: 0, x: 460, y: 200, type: "lift" },
    "G-LIFT-LOBBY": { id: "G-LIFT-LOBBY", name: "Ground Elevator Lobby Junction", floor: 0, x: 420, y: 200, type: "junction" },

    // West Wing Corridors & Nodes (Floor 0)
    "G-CORR-W1": { id: "G-CORR-W1", name: "West Corridor - Pharmacy Access", floor: 0, x: 300, y: 250, type: "corridor" },
    "G-PHARMACY-ENT": { id: "G-PHARMACY-ENT", name: "Pharmacy Entrance", floor: 0, x: 300, y: 290, type: "corridor" },
    "G-PHARMACY": { id: "G-PHARMACY", name: "Central Outpatient Pharmacy", floor: 0, x: 300, y: 360, type: "room", roomNumber: "PHARM", department: "Pharmacy Services" },
    
    "G-CORR-W2": { id: "G-CORR-W2", name: "West Clinic Concourse Junction", floor: 0, x: 190, y: 250, type: "junction" },
    "G-STAIR-WEST": { id: "G-STAIR-WEST", name: "West Staircase (Ground)", floor: 0, x: 190, y: 130, type: "stair" },
    "G-CORR-W-NORTH": { id: "G-CORR-W-NORTH", name: "West North Concourse", floor: 0, x: 190, y: 170, type: "corridor" },
    "G-CORR-W-SOUTH": { id: "G-CORR-W-SOUTH", name: "West South Concourse", floor: 0, x: 190, y: 350, type: "corridor" },

    // West Outpatient Consultation Rooms (Floor 0)
    "G-101-DOOR": { id: "G-101-DOOR", name: "Room 101 Doorway", floor: 0, x: 150, y: 350, type: "corridor" },
    "G-101": { id: "G-101", name: "Room 101 - General Medicine Consultation", floor: 0, x: 95, y: 350, type: "room", roomNumber: "101", department: "Outpatient Clinic" },

    "G-102-DOOR": { id: "G-102-DOOR", name: "Room 102 Doorway", floor: 0, x: 150, y: 250, type: "corridor" },
    "G-102": { id: "G-102", name: "Room 102 - Pediatrics Consultation", floor: 0, x: 95, y: 250, type: "room", roomNumber: "102", department: "Pediatrics" },

    "G-103-DOOR": { id: "G-103-DOOR", name: "Room 103 Doorway", floor: 0, x: 150, y: 170, type: "corridor" },
    "G-103": { id: "G-103", name: "Room 103 - Internal Medicine", floor: 0, x: 95, y: 170, type: "room", roomNumber: "103", department: "Internal Medicine" },

    // Radiology & Diagnostics (West North)
    "G-RAD-DOOR": { id: "G-RAD-DOOR", name: "Radiology Entrance", floor: 0, x: 150, y: 90, type: "corridor" },
    "G-RADIOLOGY": { id: "G-RADIOLOGY", name: "Radiology & Imaging (X-Ray, CT, MRI)", floor: 0, x: 95, y: 90, type: "room", roomNumber: "RAD-01", department: "Diagnostic Radiology" },

    // North Center Wing (Floor 0)
    "G-CORR-N1": { id: "G-CORR-N1", name: "North Concourse Junction", floor: 0, x: 420, y: 130, type: "junction" },
    "G-CAFETERIA-ENT": { id: "G-CAFETERIA-ENT", name: "Cafeteria Entrance", floor: 0, x: 310, y: 130, type: "corridor" },
    "G-CAFETERIA": { id: "G-CAFETERIA", name: "Cafeteria & Hospital Dining", floor: 0, x: 310, y: 70, type: "room", roomNumber: "CAF-01", department: "Food Services" },
    
    "G-RESTROOMS-ENT": { id: "G-RESTROOMS-ENT", name: "Restroom Lobby Access", floor: 0, x: 530, y: 130, type: "corridor" },
    "G-RESTROOMS": { id: "G-RESTROOMS", name: "Public Restrooms & Accessible Washrooms", floor: 0, x: 530, y: 70, type: "room", roomNumber: "WC-01", department: "Facilities" },

    // East Wing Corridors & Nodes (Floor 0)
    "G-CORR-E1": { id: "G-CORR-E1", name: "East Corridor - Laboratory Access", floor: 0, x: 540, y: 250, type: "corridor" },
    "G-PATHOLOGY-ENT": { id: "G-PATHOLOGY-ENT", name: "Pathology Lab Doorway", floor: 0, x: 540, y: 290, type: "corridor" },
    "G-PATHOLOGY": { id: "G-PATHOLOGY", name: "Pathology & Blood Collection Laboratory", floor: 0, x: 540, y: 360, type: "room", roomNumber: "LAB-01", department: "Laboratory" },

    "G-CORR-E2": { id: "G-CORR-E2", name: "East Wing Concourse Junction", floor: 0, x: 650, y: 250, type: "junction" },
    "G-STAIR-EAST": { id: "G-STAIR-EAST", name: "East Staircase (Ground)", floor: 0, x: 650, y: 130, type: "stair" },
    "G-CORR-E-NORTH": { id: "G-CORR-E-NORTH", name: "East North Concourse", floor: 0, x: 650, y: 170, type: "corridor" },
    "G-CORR-E-SOUTH": { id: "G-CORR-E-SOUTH", name: "East South Concourse", floor: 0, x: 650, y: 350, type: "corridor" },

    // East Consultation & Emergency (Floor 0)
    "G-104-DOOR": { id: "G-104-DOOR", name: "Room 104 Doorway", floor: 0, x: 690, y: 170, type: "corridor" },
    "G-104": { id: "G-104", name: "Room 104 - Orthopedics Consultation", floor: 0, x: 750, y: 170, type: "room", roomNumber: "104", department: "Orthopedics" },

    "G-105-DOOR": { id: "G-105-DOOR", name: "Room 105 Doorway", floor: 0, x: 690, y: 90, type: "corridor" },
    "G-105": { id: "G-105", name: "Room 105 - ENT & Ophthalmology", floor: 0, x: 750, y: 90, type: "room", roomNumber: "105", department: "Specialist Outpatient" },

    "G-EMERGENCY-ENT": { id: "G-EMERGENCY-ENT", name: "Emergency Department Doorway", floor: 0, x: 690, y: 350, type: "corridor" },
    "G-EMERGENCY": { id: "G-EMERGENCY", name: "Emergency & Trauma Centre", floor: 0, x: 750, y: 350, type: "room", roomNumber: "ER-01", department: "Emergency Services" },

    "G-AMBULANCE-BAY": { id: "G-AMBULANCE-BAY", name: "Ambulance Bay Entry", floor: 0, x: 750, y: 470, type: "entrance" },


    // ==========================================
    // FIRST FLOOR (Floor 1)
    // ==========================================
    "F1-CENTRAL-HUB": { id: "F1-CENTRAL-HUB", name: "Level 1 Central Atrium Hub", floor: 1, x: 420, y: 250, type: "junction" },
    "F1-NURSE-STATION": { id: "F1-NURSE-STATION", name: "Central Nursing Station 1", floor: 1, x: 420, y: 330, type: "room", roomNumber: "NS-01", department: "Inpatient Care" },

    // Vertical Connections (Floor 1)
    "F1-LIFT-A": { id: "F1-LIFT-A", name: "Elevator Bank A (Level 1)", floor: 1, x: 380, y: 200, type: "lift" },
    "F1-LIFT-B": { id: "F1-LIFT-B", name: "Elevator Bank B (Level 1)", floor: 1, x: 460, y: 200, type: "lift" },
    "F1-LIFT-LOBBY": { id: "F1-LIFT-LOBBY", name: "Level 1 Elevator Lobby Junction", floor: 1, x: 420, y: 200, type: "junction" },
    "F1-STAIR-WEST": { id: "F1-STAIR-WEST", name: "West Staircase (Level 1)", floor: 1, x: 190, y: 130, type: "stair" },
    "F1-STAIR-EAST": { id: "F1-STAIR-EAST", name: "East Staircase (Level 1)", floor: 1, x: 650, y: 130, type: "stair" },

    // North Facilities (Floor 1)
    "F1-CORR-N1": { id: "F1-CORR-N1", name: "Level 1 North Concourse", floor: 1, x: 420, y: 130, type: "junction" },
    "F1-DOCTORS-LOUNGE-ENT": { id: "F1-DOCTORS-LOUNGE-ENT", name: "Doctors Lounge Doorway", floor: 1, x: 530, y: 130, type: "corridor" },
    "F1-DOCTORS-LOUNGE": { id: "F1-DOCTORS-LOUNGE", name: "Physicians Lounge & Conference", floor: 1, x: 530, y: 70, type: "room", roomNumber: "DOC-01", department: "Staff" },

    // West Wing Inpatient Suites (Floor 1)
    "F1-CORR-W1": { id: "F1-CORR-W1", name: "Level 1 West Corridor Junction", floor: 1, x: 300, y: 250, type: "corridor" },
    "F1-ICU-ENT": { id: "F1-ICU-ENT", name: "ICU Security Airlock", floor: 1, x: 300, y: 290, type: "corridor" },
    "F1-ICU": { id: "F1-ICU", name: "Intensive Care Unit (ICU)", floor: 1, x: 300, y: 360, type: "room", roomNumber: "ICU-01", department: "Critical Care" },

    "F1-CORR-W2": { id: "F1-CORR-W2", name: "Level 1 West Ward Concourse", floor: 1, x: 190, y: 250, type: "junction" },
    "F1-CORR-W-NORTH": { id: "F1-CORR-W-NORTH", name: "West Inpatient Concourse North", floor: 1, x: 190, y: 170, type: "corridor" },
    "F1-CORR-W-SOUTH": { id: "F1-CORR-W-SOUTH", name: "West Inpatient Concourse South", floor: 1, x: 190, y: 350, type: "corridor" },

    "F1-201-DOOR": { id: "F1-201-DOOR", name: "Room 201 Doorway", floor: 1, x: 150, y: 350, type: "corridor" },
    "F1-201": { id: "F1-201", name: "Room 201 - Inpatient Private Suite", floor: 1, x: 95, y: 350, type: "room", roomNumber: "201", department: "Inpatient Ward" },

    "F1-202-DOOR": { id: "F1-202-DOOR", name: "Room 202 Doorway", floor: 1, x: 150, y: 250, type: "corridor" },
    "F1-202": { id: "F1-202", name: "Room 202 - Inpatient Care Unit", floor: 1, x: 95, y: 250, type: "room", roomNumber: "202", department: "Inpatient Ward" },

    "F1-203-DOOR": { id: "F1-203-DOOR", name: "Room 203 Doorway", floor: 1, x: 150, y: 170, type: "corridor" },
    "F1-203": { id: "F1-203", name: "Room 203 - Inpatient Care Unit", floor: 1, x: 95, y: 170, type: "room", roomNumber: "203", department: "Inpatient Ward" },

    // Operation Theatres (West North Level 1)
    "F1-OT-AIRLOCK": { id: "F1-OT-AIRLOCK", name: "OT Sterile Airlock Entry", floor: 1, x: 150, y: 90, type: "corridor" },
    "F1-OT-SUITE": { id: "F1-OT-SUITE", name: "Operation Theatre Complex (OT 1 & 2)", floor: 1, x: 95, y: 90, type: "room", roomNumber: "OT-01", department: "Surgical Services" },

    // East Wing (Level 1)
    "F1-CORR-E1": { id: "F1-CORR-E1", name: "Level 1 East Corridor Junction", floor: 1, x: 540, y: 250, type: "corridor" },
    "F1-CARDIOLOGY-ENT": { id: "F1-CARDIOLOGY-ENT", name: "Cardiology Suite Doorway", floor: 1, x: 540, y: 290, type: "corridor" },
    "F1-CARDIOLOGY": { id: "F1-CARDIOLOGY", name: "Cardiology Suite & Cath Lab", floor: 1, x: 540, y: 360, type: "room", roomNumber: "CARD-01", department: "Cardiology" },

    "F1-CORR-E2": { id: "F1-CORR-E2", name: "Level 1 East Ward Concourse", floor: 1, x: 650, y: 250, type: "junction" },
    "F1-CORR-E-NORTH": { id: "F1-CORR-E-NORTH", name: "East Inpatient Concourse North", floor: 1, x: 650, y: 170, type: "corridor" },
    "F1-CORR-E-SOUTH": { id: "F1-CORR-E-SOUTH", name: "East Inpatient Concourse South", floor: 1, x: 650, y: 350, type: "corridor" },

    "F1-204-DOOR": { id: "F1-204-DOOR", name: "Room 204 Doorway", floor: 1, x: 690, y: 170, type: "corridor" },
    "F1-204": { id: "F1-204", name: "Room 204 - Inpatient Suite", floor: 1, x: 750, y: 170, type: "room", roomNumber: "204", department: "Inpatient Ward" },

    "F1-205-DOOR": { id: "F1-205-DOOR", name: "Room 205 Doorway", floor: 1, x: 690, y: 90, type: "corridor" },
    "F1-205": { id: "F1-205", name: "Room 205 - Neurology Suite", floor: 1, x: 750, y: 90, type: "room", roomNumber: "205", department: "Neurology" },

    "F1-206-DOOR": { id: "F1-206-DOOR", name: "Room 206 Doorway", floor: 1, x: 690, y: 350, type: "corridor" },
    "F1-206": { id: "F1-206", name: "Room 206 - Oncology Care Ward", floor: 1, x: 750, y: 350, type: "room", roomNumber: "206", department: "Oncology" }
  },

  // Walkable planar edges with exact geometric Euclidean distances (in meters)
  edges: [
    // ------------------------------------------
    // GROUND FLOOR EDGES
    // ------------------------------------------
    // Entrance to Central
    { from: "G-ENTRANCE", to: "G-VESTIBULE", distance: 12.0 },
    { from: "G-VESTIBULE", to: "G-RECEPTION", distance: 14.0 },
    { from: "G-RECEPTION", to: "G-LOBBY-CORR", distance: 10.0 },
    { from: "G-LOBBY-CORR", to: "G-CENTRAL-HUB", distance: 14.0 },

    // Central to Vertical Links (Ground)
    { from: "G-CENTRAL-HUB", to: "G-LIFT-LOBBY", distance: 10.0 },
    { from: "G-LIFT-LOBBY", to: "G-LIFT-A", distance: 8.0 },
    { from: "G-LIFT-LOBBY", to: "G-LIFT-B", distance: 8.0 },
    { from: "G-LIFT-LOBBY", to: "G-CORR-N1", distance: 14.0 },

    // Central to North wing
    { from: "G-CORR-N1", to: "G-CAFETERIA-ENT", distance: 22.0 },
    { from: "G-CAFETERIA-ENT", to: "G-CAFETERIA", distance: 12.0 },
    { from: "G-CORR-N1", to: "G-RESTROOMS-ENT", distance: 22.0 },
    // Cross-connections along north corridor
    { from: "G-CAFETERIA-ENT", to: "G-RESTROOMS-ENT", distance: 44.0 },
    { from: "G-CORR-N1", to: "G-STAIR-WEST", distance: 46.0 },
    { from: "G-CORR-N1", to: "G-STAIR-EAST", distance: 46.0 },
    { from: "G-STAIR-WEST", to: "G-CAFETERIA-ENT", distance: 24.0 },
    { from: "G-STAIR-EAST", to: "G-RESTROOMS-ENT", distance: 24.0 },
    { from: "G-RESTROOMS-ENT", to: "G-RESTROOMS", distance: 12.0 },

    // Central to West Wing
    { from: "G-CENTRAL-HUB", to: "G-CORR-W1", distance: 24.0 },
    { from: "G-CORR-W1", to: "G-PHARMACY-ENT", distance: 8.0 },
    { from: "G-PHARMACY-ENT", to: "G-PHARMACY", distance: 14.0 },
    { from: "G-CORR-W1", to: "G-CORR-W2", distance: 22.0 },

    // West Wing Spine
    { from: "G-CORR-W2", to: "G-CORR-W-NORTH", distance: 16.0 },
    { from: "G-CORR-W-NORTH", to: "G-STAIR-WEST", distance: 8.0 },
    { from: "G-CORR-W-NORTH", to: "G-RAD-DOOR", distance: 16.0 },
    { from: "G-RAD-DOOR", to: "G-RADIOLOGY", distance: 11.0 },

    { from: "G-CORR-W2", to: "G-102-DOOR", distance: 8.0 },
    { from: "G-102-DOOR", to: "G-102", distance: 11.0 },

    { from: "G-CORR-W-NORTH", to: "G-103-DOOR", distance: 8.0 },
    { from: "G-103-DOOR", to: "G-103", distance: 11.0 },

    { from: "G-CORR-W2", to: "G-CORR-W-SOUTH", distance: 20.0 },
    { from: "G-CORR-W-SOUTH", to: "G-101-DOOR", distance: 8.0 },
    { from: "G-101-DOOR", to: "G-101", distance: 11.0 },

    // Central to East Wing
    { from: "G-CENTRAL-HUB", to: "G-CORR-E1", distance: 24.0 },
    { from: "G-CORR-E1", to: "G-PATHOLOGY-ENT", distance: 8.0 },
    { from: "G-PATHOLOGY-ENT", to: "G-PATHOLOGY", distance: 14.0 },
    { from: "G-CORR-E1", to: "G-CORR-E2", distance: 22.0 },

    // East Wing Spine
    { from: "G-CORR-E2", to: "G-CORR-E-NORTH", distance: 16.0 },
    { from: "G-CORR-E-NORTH", to: "G-STAIR-EAST", distance: 8.0 },
    { from: "G-CORR-E-NORTH", to: "G-104-DOOR", distance: 8.0 },
    { from: "G-104-DOOR", to: "G-104", distance: 12.0 },

    { from: "G-STAIR-EAST", to: "G-105-DOOR", distance: 12.0 },
    { from: "G-105-DOOR", to: "G-105", distance: 12.0 },

    { from: "G-CORR-E2", to: "G-CORR-E-SOUTH", distance: 20.0 },
    { from: "G-CORR-E-SOUTH", to: "G-EMERGENCY-ENT", distance: 8.0 },
    { from: "G-EMERGENCY-ENT", to: "G-EMERGENCY", distance: 12.0 },
    { from: "G-EMERGENCY", to: "G-AMBULANCE-BAY", distance: 24.0 },


    // ------------------------------------------
    // FIRST FLOOR EDGES
    // ------------------------------------------
    // Central Hub to Lobby & Nursing
    { from: "F1-CENTRAL-HUB", to: "F1-LIFT-LOBBY", distance: 10.0 },
    { from: "F1-CENTRAL-HUB", to: "F1-NURSE-STATION", distance: 16.0 },
    { from: "F1-LIFT-LOBBY", to: "F1-LIFT-A", distance: 8.0 },
    { from: "F1-LIFT-LOBBY", to: "F1-LIFT-B", distance: 8.0 },
    { from: "F1-LIFT-LOBBY", to: "F1-CORR-N1", distance: 14.0 },

    // North Facilities (Level 1)
    { from: "F1-CORR-N1", to: "F1-DOCTORS-LOUNGE-ENT", distance: 22.0 },
    { from: "F1-DOCTORS-LOUNGE-ENT", to: "F1-DOCTORS-LOUNGE", distance: 12.0 },

    // Level 1 West Wing
    { from: "F1-CENTRAL-HUB", to: "F1-CORR-W1", distance: 24.0 },
    { from: "F1-CORR-W1", to: "F1-ICU-ENT", distance: 8.0 },
    { from: "F1-ICU-ENT", to: "F1-ICU", distance: 14.0 },
    { from: "F1-CORR-W1", to: "F1-CORR-W2", distance: 22.0 },

    { from: "F1-CORR-W2", to: "F1-CORR-W-NORTH", distance: 16.0 },
    { from: "F1-CORR-W-NORTH", to: "F1-STAIR-WEST", distance: 8.0 },
    { from: "F1-CORR-W-NORTH", to: "F1-OT-AIRLOCK", distance: 16.0 },
    { from: "F1-OT-AIRLOCK", to: "F1-OT-SUITE", distance: 11.0 },

    { from: "F1-CORR-W2", to: "F1-202-DOOR", distance: 8.0 },
    { from: "F1-202-DOOR", to: "F1-202", distance: 11.0 },

    { from: "F1-CORR-W-NORTH", to: "F1-203-DOOR", distance: 8.0 },
    { from: "F1-203-DOOR", to: "F1-203", distance: 11.0 },

    { from: "F1-CORR-W2", to: "F1-CORR-W-SOUTH", distance: 20.0 },
    { from: "F1-CORR-W-SOUTH", to: "F1-201-DOOR", distance: 8.0 },
    { from: "F1-201-DOOR", to: "F1-201", distance: 11.0 },

    // Level 1 East Wing
    { from: "F1-CENTRAL-HUB", to: "F1-CORR-E1", distance: 24.0 },
    { from: "F1-CORR-E1", to: "F1-CARDIOLOGY-ENT", distance: 8.0 },
    { from: "F1-CARDIOLOGY-ENT", to: "F1-CARDIOLOGY", distance: 14.0 },
    { from: "F1-CORR-E1", to: "F1-CORR-E2", distance: 22.0 },

    { from: "F1-CORR-E2", to: "F1-CORR-E-NORTH", distance: 16.0 },
    { from: "F1-CORR-E-NORTH", to: "F1-STAIR-EAST", distance: 8.0 },
    { from: "F1-CORR-E-NORTH", to: "F1-204-DOOR", distance: 8.0 },
    { from: "F1-204-DOOR", to: "F1-204", distance: 12.0 },

    { from: "F1-STAIR-EAST", to: "F1-205-DOOR", distance: 12.0 },
    { from: "F1-205-DOOR", to: "F1-205", distance: 12.0 },

    { from: "F1-CORR-E2", to: "F1-CORR-E-SOUTH", distance: 20.0 },
    { from: "F1-CORR-E-SOUTH", to: "F1-206-DOOR", distance: 8.0 },
    { from: "F1-206-DOOR", to: "F1-206", distance: 12.0 },

    // ------------------------------------------
    // VERTICAL CONNECTIONS (Floor 0 <-> Floor 1)
    // ONLY supplied elevator & staircase links
    // ------------------------------------------
    { from: "G-LIFT-A", to: "F1-LIFT-A", distance: 15.0, isVertical: true, type: "lift" },
    { from: "G-LIFT-B", to: "F1-LIFT-B", distance: 15.0, isVertical: true, type: "lift" },
    { from: "G-STAIR-WEST", to: "F1-STAIR-WEST", distance: 22.0, isVertical: true, type: "stair" },
    { from: "G-STAIR-EAST", to: "F1-STAIR-EAST", distance: 22.0, isVertical: true, type: "stair" }
  ],

  // Destination Search Index
  destinations: [
    {
      id: "dest-101",
      name: "Room 101",
      aliases: ["101", "room 101", "general medicine", "dr sharma", "consultation 101", "opd 101"],
      nodeId: "G-101",
      floor: 0,
      department: "General Medicine Outpatient",
      roomNumber: "101",
      icon: "stethoscope"
    },
    {
      id: "dest-102",
      name: "Room 102",
      aliases: ["102", "room 102", "pediatrics", "child clinic", "pediatric consultation"],
      nodeId: "G-102",
      floor: 0,
      department: "Pediatrics Outpatient",
      roomNumber: "102",
      icon: "baby"
    },
    {
      id: "dest-103",
      name: "Room 103",
      aliases: ["103", "room 103", "internal medicine", "physician"],
      nodeId: "G-103",
      floor: 0,
      department: "Internal Medicine",
      roomNumber: "103",
      icon: "heart-pulse"
    },
    {
      id: "dest-104",
      name: "Room 104",
      aliases: ["104", "room 104", "orthopedics", "bone clinic", "ortho"],
      nodeId: "G-104",
      floor: 0,
      department: "Orthopedic Clinic",
      roomNumber: "104",
      icon: "bone"
    },
    {
      id: "dest-105",
      name: "Room 105",
      aliases: ["105", "room 105", "ent", "eye clinic", "ophthalmology", "ear nose throat"],
      nodeId: "G-105",
      floor: 0,
      department: "ENT & Ophthalmology",
      roomNumber: "105",
      icon: "eye"
    },
    {
      id: "dest-emergency",
      name: "Emergency & Trauma Centre",
      aliases: ["emergency", "er", "trauma", "casualty", "urgent care", "ambulance"],
      nodeId: "G-EMERGENCY",
      floor: 0,
      department: "Emergency Services",
      roomNumber: "ER-01",
      icon: "ambulance"
    },
    {
      id: "dest-pharmacy",
      name: "Pharmacy",
      aliases: ["pharmacy", "chemist", "drugs", "medication", "medicine shop", "dispensary"],
      nodeId: "G-PHARMACY",
      floor: 0,
      department: "Pharmacy Services",
      roomNumber: "PHARM",
      icon: "pills"
    },
    {
      id: "dest-radiology",
      name: "Radiology & Imaging",
      aliases: ["radiology", "x-ray", "mri", "ct scan", "ultrasound", "imaging"],
      nodeId: "G-RADIOLOGY",
      floor: 0,
      department: "Diagnostic Imaging",
      roomNumber: "RAD-01",
      icon: "x-ray"
    },
    {
      id: "dest-pathology",
      name: "Pathology Laboratory",
      aliases: ["pathology", "lab", "blood test", "laboratory", "diagnostics", "sample collection"],
      nodeId: "G-PATHOLOGY",
      floor: 0,
      department: "Laboratory Services",
      roomNumber: "LAB-01",
      icon: "flask"
    },
    {
      id: "dest-reception",
      name: "Main Reception & Help Desk",
      aliases: ["reception", "help desk", "information", "lobby", "registration", "front desk"],
      nodeId: "G-RECEPTION",
      floor: 0,
      department: "Patient Administration",
      roomNumber: "REC-01",
      icon: "info"
    },
    {
      id: "dest-cafeteria",
      name: "Hospital Cafeteria",
      aliases: ["cafeteria", "canteen", "coffee", "food", "dining", "snack"],
      nodeId: "G-CAFETERIA",
      floor: 0,
      department: "Hospital Amenities",
      roomNumber: "CAF-01",
      icon: "coffee"
    },
    {
      id: "dest-restrooms",
      name: "Restrooms & Washrooms",
      aliases: ["restroom", "toilet", "washroom", "bathroom", "wc"],
      nodeId: "G-RESTROOMS",
      floor: 0,
      department: "Public Facilities",
      roomNumber: "WC-01",
      icon: "restroom"
    },

    // First Floor Destinations
    {
      id: "dest-201",
      name: "Room 201",
      aliases: ["201", "room 201", "inpatient 201", "suite 201", "private room 201"],
      nodeId: "F1-201",
      floor: 1,
      department: "Inpatient Ward A",
      roomNumber: "201",
      icon: "bed"
    },
    {
      id: "dest-202",
      name: "Room 202",
      aliases: ["202", "room 202", "inpatient 202", "ward 202"],
      nodeId: "F1-202",
      floor: 1,
      department: "Inpatient Ward A",
      roomNumber: "202",
      icon: "bed"
    },
    {
      id: "dest-203",
      name: "Room 203",
      aliases: ["203", "room 203", "inpatient 203"],
      nodeId: "F1-203",
      floor: 1,
      department: "Inpatient Ward A",
      roomNumber: "203",
      icon: "bed"
    },
    {
      id: "dest-204",
      name: "Room 204",
      aliases: ["204", "room 204", "inpatient 204", "ward 204"],
      nodeId: "F1-204",
      floor: 1,
      department: "Inpatient Ward B",
      roomNumber: "204",
      icon: "bed"
    },
    {
      id: "dest-205",
      name: "Room 205 - Neurology",
      aliases: ["205", "room 205", "neurology", "neuro suite", "brain clinic"],
      nodeId: "F1-205",
      floor: 1,
      department: "Neurology",
      roomNumber: "205",
      icon: "brain"
    },
    {
      id: "dest-206",
      name: "Room 206 - Oncology",
      aliases: ["206", "room 206", "oncology", "cancer care"],
      nodeId: "F1-206",
      floor: 1,
      department: "Oncology Care",
      roomNumber: "206",
      icon: "ribbon"
    },
    {
      id: "dest-icu",
      name: "Intensive Care Unit (ICU)",
      aliases: ["icu", "intensive care", "ccu", "critical care"],
      nodeId: "F1-ICU",
      floor: 1,
      department: "Critical Care",
      roomNumber: "ICU-01",
      icon: "heart-circle-bolt"
    },
    {
      id: "dest-ot",
      name: "Operation Theatre Complex",
      aliases: ["ot", "operation theatre", "surgery", "or", "operating room", "ot 1", "ot 2"],
      nodeId: "F1-OT-SUITE",
      floor: 1,
      department: "Surgical Services",
      roomNumber: "OT-01",
      icon: "scalpel"
    },
    {
      id: "dest-cardiology",
      name: "Cardiology Suite & Cath Lab",
      aliases: ["cardiology", "heart", "cath lab", "cardiac", "ecg"],
      nodeId: "F1-CARDIOLOGY",
      floor: 1,
      department: "Cardiology",
      roomNumber: "CARD-01",
      icon: "heart-pulse"
    },
    {
      id: "dest-nurse-station",
      name: "Nursing Station 1",
      aliases: ["nurse", "nursing", "duty station", "inpatient desk"],
      nodeId: "F1-NURSE-STATION",
      floor: 1,
      department: "Inpatient Administration",
      roomNumber: "NS-01",
      icon: "user-nurse"
    },
    {
      id: "dest-lift-a",
      name: "Elevator Bank A",
      aliases: ["lift", "elevator", "lift a", "elevator a"],
      nodeId: "G-LIFT-A",
      floor: 0,
      department: "Vertical Transport",
      roomNumber: "LIFT-A",
      icon: "elevator"
    }
  ],

  // Architectural Layout Geometry for SVG Map Rendering
  // (Rooms, Corridors, Walls, Doors)
  architecturalLayout: {
    0: {
      rooms: [
        { id: "G-101", x: 40, y: 310, width: 110, height: 80, label: "Room 101", subLabel: "General Medicine", number: "101", type: "consultation", doorSide: "right" },
        { id: "G-102", x: 40, y: 210, width: 110, height: 80, label: "Room 102", subLabel: "Pediatrics", number: "102", type: "consultation", doorSide: "right" },
        { id: "G-103", x: 40, y: 130, width: 110, height: 70, label: "Room 103", subLabel: "Internal Med", number: "103", type: "consultation", doorSide: "right" },
        { id: "G-RADIOLOGY", x: 40, y: 50, width: 110, height: 70, label: "Radiology", subLabel: "X-Ray / MRI / CT", number: "RAD-01", type: "diagnostic", doorSide: "right" },
        { id: "G-PHARMACY", x: 240, y: 320, width: 120, height: 80, label: "Pharmacy", subLabel: "Outpatient Dispensary", number: "PHARM", type: "pharmacy", doorSide: "top" },
        { id: "G-RECEPTION", x: 360, y: 350, width: 120, height: 60, label: "Main Reception", subLabel: "Help & Registration", number: "REC-01", type: "reception", doorSide: "top" },
        { id: "G-CAFETERIA", x: 240, y: 40, width: 130, height: 60, label: "Cafeteria", subLabel: "Dining & Refreshments", number: "CAF-01", type: "facility", doorSide: "bottom" },
        { id: "G-RESTROOMS", x: 470, y: 40, width: 120, height: 60, label: "Restrooms", subLabel: "Accessible WC", number: "WC-01", type: "facility", doorSide: "bottom" },
        { id: "G-PATHOLOGY", x: 480, y: 320, width: 120, height: 80, label: "Pathology", subLabel: "Blood Lab & Testing", number: "LAB-01", type: "diagnostic", doorSide: "top" },
        { id: "G-104", x: 700, y: 130, width: 110, height: 80, label: "Room 104", subLabel: "Orthopedics", number: "104", type: "consultation", doorSide: "left" },
        { id: "G-105", x: 700, y: 50, width: 110, height: 70, label: "Room 105", subLabel: "ENT / Eye", number: "105", type: "consultation", doorSide: "left" },
        { id: "G-EMERGENCY", x: 700, y: 290, width: 110, height: 110, label: "Emergency", subLabel: "Trauma Care", number: "ER-01", type: "emergency", doorSide: "left" }
      ],
      verticals: [
        { id: "G-LIFT-A", x: 355, y: 175, width: 50, height: 50, label: "Lift A", type: "lift" },
        { id: "G-LIFT-B", x: 435, y: 175, width: 50, height: 50, label: "Lift B", type: "lift" },
        { id: "G-STAIR-WEST", x: 165, y: 105, width: 50, height: 50, label: "Stair W", type: "stair" },
        { id: "G-STAIR-EAST", x: 625, y: 105, width: 50, height: 50, label: "Stair E", type: "stair" }
      ],
      corridors: [
        { d: "M 420 500 L 420 130" }, // Central north-south spine (extended to north concourse)
        { d: "M 190 250 L 650 250" }, // Central east-west spine
        { d: "M 190 90 L 190 350" },  // West concourse
        { d: "M 650 90 L 650 350" },  // East concourse
        { d: "M 190 130 L 650 130" }  // North corridor (Stair W ↔ Cafeteria ↔ Restrooms ↔ Stair E)
      ],
      entrances: [
        { id: "G-ENTRANCE", x: 420, y: 520, label: "Main Entrance", angle: 0 },
        { id: "G-AMBULANCE-BAY", x: 755, y: 470, label: "Ambulance Entry", angle: 90 }
      ]
    },

    1: {
      rooms: [
        { id: "F1-201", x: 40, y: 310, width: 110, height: 80, label: "Room 201", subLabel: "Deluxe Inpatient Suite", number: "201", type: "inpatient", doorSide: "right" },
        { id: "F1-202", x: 40, y: 210, width: 110, height: 80, label: "Room 202", subLabel: "Inpatient Ward", number: "202", type: "inpatient", doorSide: "right" },
        { id: "F1-203", x: 40, y: 130, width: 110, height: 70, label: "Room 203", subLabel: "Inpatient Ward", number: "203", type: "inpatient", doorSide: "right" },
        { id: "F1-OT-SUITE", x: 40, y: 50, width: 110, height: 70, label: "Operation Theatre", subLabel: "Sterile OT 1 & 2", number: "OT-01", type: "surgical", doorSide: "right" },
        { id: "F1-ICU", x: 240, y: 320, width: 120, height: 80, label: "ICU", subLabel: "Intensive Care Unit", number: "ICU-01", type: "critical", doorSide: "top" },
        { id: "F1-NURSE-STATION", x: 360, y: 310, width: 120, height: 50, label: "Nurse Station", subLabel: "Ward Monitoring", number: "NS-01", type: "nursing", doorSide: "top" },
        { id: "F1-DOCTORS-LOUNGE", x: 470, y: 40, width: 120, height: 60, label: "Doctors Lounge", subLabel: "Clinical Staff Only", number: "DOC-01", type: "staff", doorSide: "bottom" },
        { id: "F1-CARDIOLOGY", x: 480, y: 320, width: 120, height: 80, label: "Cardiology", subLabel: "Cath Lab & Diagnostics", number: "CARD-01", type: "cardiology", doorSide: "top" },
        { id: "F1-204", x: 700, y: 130, width: 110, height: 80, label: "Room 204", subLabel: "Inpatient Suite", number: "204", type: "inpatient", doorSide: "left" },
        { id: "F1-205", x: 700, y: 50, width: 110, height: 70, label: "Room 205", subLabel: "Neurology Care", number: "205", type: "inpatient", doorSide: "left" },
        { id: "F1-206", x: 700, y: 290, width: 110, height: 110, label: "Room 206", subLabel: "Oncology Care", number: "206", type: "inpatient", doorSide: "left" }
      ],
      verticals: [
        { id: "F1-LIFT-A", x: 355, y: 175, width: 50, height: 50, label: "Lift A", type: "lift" },
        { id: "F1-LIFT-B", x: 435, y: 175, width: 50, height: 50, label: "Lift B", type: "lift" },
        { id: "F1-STAIR-WEST", x: 165, y: 105, width: 50, height: 50, label: "Stair W", type: "stair" },
        { id: "F1-STAIR-EAST", x: 625, y: 105, width: 50, height: 50, label: "Stair E", type: "stair" }
      ],
      corridors: [
        { d: "M 420 370 L 420 130" }, // Central Level 1 spine (extended to north concourse)
        { d: "M 190 250 L 650 250" }, // Central east-west spine
        { d: "M 190 90 L 190 350" },  // West ward concourse
        { d: "M 650 90 L 650 350" },  // East ward concourse
        { d: "M 190 130 L 650 130" }  // North corridor (Stair W ↔ Doctors Lounge ↔ Stair E)
      ],
      entrances: []
    }
  }
};
