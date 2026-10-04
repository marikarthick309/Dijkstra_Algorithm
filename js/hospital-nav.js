/**
 * MEDINAV - HOSPITAL INDOOR VISUAL NAVIGATION SYSTEM
 * Standalone Zero-Dependency Production Bundle
 * 
 * Provides 100% native offline capability:
 * - Direct execution in Chrome / Edge / Firefox via file:// protocol
 * - Exact master navigation dataset
 * - A* pathfinding strictly on supplied walkable graph
 * - Interactive vector SVG map (zoom, pan, fit-route)
 * - Blue route terminating exactly at destination
 * - Live Wi-Fi positioning architecture ({ floor, x, y })
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. MASTER HOSPITAL NAVIGATION DATASET
  // =========================================================================
  const MASTER_DATASET = {
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

    nodes: {
      // ---------------- GROUND FLOOR (Floor 0) ----------------
      "G-ENTRANCE": { id: "G-ENTRANCE", name: "Hospital Main Entrance", floor: 0, x: 420, y: 500, type: "entrance" },
      "G-VESTIBULE": { id: "G-VESTIBULE", name: "Entrance Vestibule & Triage", floor: 0, x: 420, y: 440, type: "junction" },
      "G-RECEPTION": { id: "G-RECEPTION", name: "Main Reception & Help Desk", floor: 0, x: 420, y: 370, type: "room", roomNumber: "REC-01", department: "Patient Services" },
      "G-LOBBY-CORR": { id: "G-LOBBY-CORR", name: "Main Lobby Central Corridor", floor: 0, x: 420, y: 320, type: "corridor" },
      "G-CENTRAL-HUB": { id: "G-CENTRAL-HUB", name: "Ground Floor Central Atrium Hub", floor: 0, x: 420, y: 250, type: "junction" },

      "G-LIFT-A": { id: "G-LIFT-A", name: "Elevator Bank A (Ground)", floor: 0, x: 380, y: 200, type: "lift" },
      "G-LIFT-B": { id: "G-LIFT-B", name: "Elevator Bank B (Ground)", floor: 0, x: 460, y: 200, type: "lift" },
      "G-LIFT-LOBBY": { id: "G-LIFT-LOBBY", name: "Ground Elevator Lobby Junction", floor: 0, x: 420, y: 200, type: "junction" },

      "G-CORR-W1": { id: "G-CORR-W1", name: "West Corridor - Pharmacy Access", floor: 0, x: 300, y: 250, type: "corridor" },
      "G-PHARMACY-ENT": { id: "G-PHARMACY-ENT", name: "Pharmacy Entrance", floor: 0, x: 300, y: 290, type: "corridor" },
      "G-PHARMACY": { id: "G-PHARMACY", name: "Central Outpatient Pharmacy", floor: 0, x: 300, y: 360, type: "room", roomNumber: "PHARM", department: "Pharmacy Services" },
      
      "G-CORR-W2": { id: "G-CORR-W2", name: "West Clinic Concourse Junction", floor: 0, x: 190, y: 250, type: "junction" },
      "G-STAIR-WEST": { id: "G-STAIR-WEST", name: "West Staircase (Ground)", floor: 0, x: 190, y: 130, type: "stair" },
      "G-CORR-W-NORTH": { id: "G-CORR-W-NORTH", name: "West North Concourse", floor: 0, x: 190, y: 170, type: "corridor" },
      "G-CORR-W-SOUTH": { id: "G-CORR-W-SOUTH", name: "West South Concourse", floor: 0, x: 190, y: 350, type: "corridor" },

      "G-101-DOOR": { id: "G-101-DOOR", name: "Room 101 Doorway", floor: 0, x: 150, y: 350, type: "corridor" },
      "G-101": { id: "G-101", name: "Room 101 - General Medicine Consultation", floor: 0, x: 95, y: 350, type: "room", roomNumber: "101", department: "Outpatient Clinic" },

      "G-102-DOOR": { id: "G-102-DOOR", name: "Room 102 Doorway", floor: 0, x: 150, y: 250, type: "corridor" },
      "G-102": { id: "G-102", name: "Room 102 - Pediatrics Consultation", floor: 0, x: 95, y: 250, type: "room", roomNumber: "102", department: "Pediatrics" },

      "G-103-DOOR": { id: "G-103-DOOR", name: "Room 103 Doorway", floor: 0, x: 150, y: 170, type: "corridor" },
      "G-103": { id: "G-103", name: "Room 103 - Internal Medicine", floor: 0, x: 95, y: 170, type: "room", roomNumber: "103", department: "Internal Medicine" },

      "G-RAD-DOOR": { id: "G-RAD-DOOR", name: "Radiology Entrance", floor: 0, x: 150, y: 90, type: "corridor" },
      "G-RADIOLOGY": { id: "G-RADIOLOGY", name: "Radiology & Imaging (X-Ray, CT, MRI)", floor: 0, x: 95, y: 90, type: "room", roomNumber: "RAD-01", department: "Diagnostic Radiology" },

      "G-CORR-N1": { id: "G-CORR-N1", name: "North Concourse Junction", floor: 0, x: 420, y: 130, type: "junction" },
      "G-CAFETERIA-ENT": { id: "G-CAFETERIA-ENT", name: "Cafeteria Entrance", floor: 0, x: 310, y: 130, type: "corridor" },
      "G-CAFETERIA": { id: "G-CAFETERIA", name: "Cafeteria & Hospital Dining", floor: 0, x: 310, y: 70, type: "room", roomNumber: "CAF-01", department: "Food Services" },
      
      "G-RESTROOMS-ENT": { id: "G-RESTROOMS-ENT", name: "Restroom Lobby Access", floor: 0, x: 530, y: 130, type: "corridor" },
      "G-RESTROOMS": { id: "G-RESTROOMS", name: "Public Restrooms & Accessible Washrooms", floor: 0, x: 530, y: 70, type: "room", roomNumber: "WC-01", department: "Facilities" },

      "G-CORR-E1": { id: "G-CORR-E1", name: "East Corridor - Laboratory Access", floor: 0, x: 540, y: 250, type: "corridor" },
      "G-PATHOLOGY-ENT": { id: "G-PATHOLOGY-ENT", name: "Pathology Lab Doorway", floor: 0, x: 540, y: 290, type: "corridor" },
      "G-PATHOLOGY": { id: "G-PATHOLOGY", name: "Pathology & Blood Collection Laboratory", floor: 0, x: 540, y: 360, type: "room", roomNumber: "LAB-01", department: "Laboratory" },

      "G-CORR-E2": { id: "G-CORR-E2", name: "East Wing Concourse Junction", floor: 0, x: 650, y: 250, type: "junction" },
      "G-STAIR-EAST": { id: "G-STAIR-EAST", name: "East Staircase (Ground)", floor: 0, x: 650, y: 130, type: "stair" },
      "G-CORR-E-NORTH": { id: "G-CORR-E-NORTH", name: "East North Concourse", floor: 0, x: 650, y: 170, type: "corridor" },
      "G-CORR-E-SOUTH": { id: "G-CORR-E-SOUTH", name: "East South Concourse", floor: 0, x: 650, y: 350, type: "corridor" },

      "G-104-DOOR": { id: "G-104-DOOR", name: "Room 104 Doorway", floor: 0, x: 690, y: 170, type: "corridor" },
      "G-104": { id: "G-104", name: "Room 104 - Orthopedics Consultation", floor: 0, x: 750, y: 170, type: "room", roomNumber: "104", department: "Orthopedics" },

      "G-105-DOOR": { id: "G-105-DOOR", name: "Room 105 Doorway", floor: 0, x: 690, y: 90, type: "corridor" },
      "G-105": { id: "G-105", name: "Room 105 - ENT & Ophthalmology", floor: 0, x: 750, y: 90, type: "room", roomNumber: "105", department: "Specialist Outpatient" },

      "G-EMERGENCY-ENT": { id: "G-EMERGENCY-ENT", name: "Emergency Department Doorway", floor: 0, x: 690, y: 350, type: "corridor" },
      "G-EMERGENCY": { id: "G-EMERGENCY", name: "Emergency & Trauma Centre", floor: 0, x: 750, y: 350, type: "room", roomNumber: "ER-01", department: "Emergency Services" },
      "G-AMBULANCE-BAY": { id: "G-AMBULANCE-BAY", name: "Ambulance Bay Entry", floor: 0, x: 750, y: 470, type: "entrance" },

      // ---------------- FIRST FLOOR (Floor 1) ----------------
      "F1-CENTRAL-HUB": { id: "F1-CENTRAL-HUB", name: "Level 1 Central Atrium Hub", floor: 1, x: 420, y: 250, type: "junction" },
      "F1-NURSE-STATION": { id: "F1-NURSE-STATION", name: "Central Nursing Station 1", floor: 1, x: 420, y: 330, type: "room", roomNumber: "NS-01", department: "Inpatient Care" },

      "F1-LIFT-A": { id: "F1-LIFT-A", name: "Elevator Bank A (Level 1)", floor: 1, x: 380, y: 200, type: "lift" },
      "F1-LIFT-B": { id: "F1-LIFT-B", name: "Elevator Bank B (Level 1)", floor: 1, x: 460, y: 200, type: "lift" },
      "F1-LIFT-LOBBY": { id: "F1-LIFT-LOBBY", name: "Level 1 Elevator Lobby Junction", floor: 1, x: 420, y: 200, type: "junction" },
      "F1-STAIR-WEST": { id: "F1-STAIR-WEST", name: "West Staircase (Level 1)", floor: 1, x: 190, y: 130, type: "stair" },
      "F1-STAIR-EAST": { id: "F1-STAIR-EAST", name: "East Staircase (Level 1)", floor: 1, x: 650, y: 130, type: "stair" },

      "F1-CORR-N1": { id: "F1-CORR-N1", name: "Level 1 North Concourse", floor: 1, x: 420, y: 130, type: "junction" },
      "F1-DOCTORS-LOUNGE-ENT": { id: "F1-DOCTORS-LOUNGE-ENT", name: "Doctors Lounge Doorway", floor: 1, x: 530, y: 130, type: "corridor" },
      "F1-DOCTORS-LOUNGE": { id: "F1-DOCTORS-LOUNGE", name: "Physicians Lounge & Conference", floor: 1, x: 530, y: 70, type: "room", roomNumber: "DOC-01", department: "Staff" },

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

      "F1-OT-AIRLOCK": { id: "F1-OT-AIRLOCK", name: "OT Sterile Airlock Entry", floor: 1, x: 150, y: 90, type: "corridor" },
      "F1-OT-SUITE": { id: "F1-OT-SUITE", name: "Operation Theatre Complex (OT 1 & 2)", floor: 1, x: 95, y: 90, type: "room", roomNumber: "OT-01", department: "Surgical Services" },

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

    edges: [
      // Ground floor walkable edges
      { from: "G-ENTRANCE", to: "G-VESTIBULE", distance: 12.0 },
      { from: "G-VESTIBULE", to: "G-RECEPTION", distance: 14.0 },
      { from: "G-RECEPTION", to: "G-LOBBY-CORR", distance: 10.0 },
      { from: "G-LOBBY-CORR", to: "G-CENTRAL-HUB", distance: 14.0 },

      { from: "G-CENTRAL-HUB", to: "G-LIFT-LOBBY", distance: 10.0 },
      { from: "G-LIFT-LOBBY", to: "G-LIFT-A", distance: 8.0 },
      { from: "G-LIFT-LOBBY", to: "G-LIFT-B", distance: 8.0 },
      { from: "G-LIFT-LOBBY", to: "G-CORR-N1", distance: 14.0 },

      { from: "G-CORR-N1", to: "G-CAFETERIA-ENT", distance: 22.0 },
      { from: "G-CAFETERIA-ENT", to: "G-CAFETERIA", distance: 12.0 },
      { from: "G-CORR-N1", to: "G-RESTROOMS-ENT", distance: 22.0 },
      { from: "G-RESTROOMS-ENT", to: "G-RESTROOMS", distance: 12.0 },

      { from: "G-CENTRAL-HUB", to: "G-CORR-W1", distance: 24.0 },
      { from: "G-CORR-W1", to: "G-PHARMACY-ENT", distance: 8.0 },
      { from: "G-PHARMACY-ENT", to: "G-PHARMACY", distance: 14.0 },
      { from: "G-CORR-W1", to: "G-CORR-W2", distance: 22.0 },

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

      { from: "G-CENTRAL-HUB", to: "G-CORR-E1", distance: 24.0 },
      { from: "G-CORR-E1", to: "G-PATHOLOGY-ENT", distance: 8.0 },
      { from: "G-PATHOLOGY-ENT", to: "G-PATHOLOGY", distance: 14.0 },
      { from: "G-CORR-E1", to: "G-CORR-E2", distance: 22.0 },

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

      // First floor walkable edges
      { from: "F1-CENTRAL-HUB", to: "F1-LIFT-LOBBY", distance: 10.0 },
      { from: "F1-CENTRAL-HUB", to: "F1-NURSE-STATION", distance: 16.0 },
      { from: "F1-LIFT-LOBBY", to: "F1-LIFT-A", distance: 8.0 },
      { from: "F1-LIFT-LOBBY", to: "F1-LIFT-B", distance: 8.0 },
      { from: "F1-LIFT-LOBBY", to: "F1-CORR-N1", distance: 14.0 },

      { from: "F1-CORR-N1", to: "F1-DOCTORS-LOUNGE-ENT", distance: 22.0 },
      { from: "F1-DOCTORS-LOUNGE-ENT", to: "F1-DOCTORS-LOUNGE", distance: 12.0 },

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

      // Vertical links (Elevators & Stairs)
      { from: "G-LIFT-A", to: "F1-LIFT-A", distance: 15.0, isVertical: true, type: "lift" },
      { from: "G-LIFT-B", to: "F1-LIFT-B", distance: 15.0, isVertical: true, type: "lift" },
      { from: "G-STAIR-WEST", to: "F1-STAIR-WEST", distance: 22.0, isVertical: true, type: "stair" },
      { from: "G-STAIR-EAST", to: "F1-STAIR-EAST", distance: 22.0, isVertical: true, type: "stair" }
    ],

    destinations: [
      {
        id: "dest-101",
        name: "Room 101",
        aliases: ["101", "room 101", "general medicine", "dr sharma", "consultation 101", "opd 101"],
        nodeId: "G-101",
        floor: 0,
        department: "General Medicine Outpatient",
        roomNumber: "101"
      },
      {
        id: "dest-102",
        name: "Room 102",
        aliases: ["102", "room 102", "pediatrics", "child clinic", "pediatric consultation"],
        nodeId: "G-102",
        floor: 0,
        department: "Pediatrics Outpatient",
        roomNumber: "102"
      },
      {
        id: "dest-103",
        name: "Room 103",
        aliases: ["103", "room 103", "internal medicine", "physician"],
        nodeId: "G-103",
        floor: 0,
        department: "Internal Medicine",
        roomNumber: "103"
      },
      {
        id: "dest-104",
        name: "Room 104",
        aliases: ["104", "room 104", "orthopedics", "bone clinic", "ortho"],
        nodeId: "G-104",
        floor: 0,
        department: "Orthopedic Clinic",
        roomNumber: "104"
      },
      {
        id: "dest-105",
        name: "Room 105",
        aliases: ["105", "room 105", "ent", "eye clinic", "ophthalmology", "ear nose throat"],
        nodeId: "G-105",
        floor: 0,
        department: "ENT & Ophthalmology",
        roomNumber: "105"
      },
      {
        id: "dest-emergency",
        name: "Emergency & Trauma Centre",
        aliases: ["emergency", "er", "trauma", "casualty", "urgent care", "ambulance"],
        nodeId: "G-EMERGENCY",
        floor: 0,
        department: "Emergency Services",
        roomNumber: "ER-01"
      },
      {
        id: "dest-pharmacy",
        name: "Pharmacy",
        aliases: ["pharmacy", "chemist", "drugs", "medication", "medicine shop", "dispensary"],
        nodeId: "G-PHARMACY",
        floor: 0,
        department: "Pharmacy Services",
        roomNumber: "PHARM"
      },
      {
        id: "dest-radiology",
        name: "Radiology & Imaging",
        aliases: ["radiology", "x-ray", "mri", "ct scan", "ultrasound", "imaging"],
        nodeId: "G-RADIOLOGY",
        floor: 0,
        department: "Diagnostic Imaging",
        roomNumber: "RAD-01"
      },
      {
        id: "dest-pathology",
        name: "Pathology Laboratory",
        aliases: ["pathology", "lab", "blood test", "laboratory", "diagnostics", "sample collection"],
        nodeId: "G-PATHOLOGY",
        floor: 0,
        department: "Laboratory Services",
        roomNumber: "LAB-01"
      },
      {
        id: "dest-reception",
        name: "Main Reception & Help Desk",
        aliases: ["reception", "help desk", "information", "lobby", "registration", "front desk"],
        nodeId: "G-RECEPTION",
        floor: 0,
        department: "Patient Administration",
        roomNumber: "REC-01"
      },
      {
        id: "dest-cafeteria",
        name: "Hospital Cafeteria",
        aliases: ["cafeteria", "canteen", "coffee", "food", "dining", "snack"],
        nodeId: "G-CAFETERIA",
        floor: 0,
        department: "Hospital Amenities",
        roomNumber: "CAF-01"
      },
      {
        id: "dest-restrooms",
        name: "Restrooms & Washrooms",
        aliases: ["restroom", "toilet", "washroom", "bathroom", "wc"],
        nodeId: "G-RESTROOMS",
        floor: 0,
        department: "Public Facilities",
        roomNumber: "WC-01"
      },
      // Level 1 Destinations
      {
        id: "dest-201",
        name: "Room 201",
        aliases: ["201", "room 201", "inpatient 201", "suite 201", "private room 201"],
        nodeId: "F1-201",
        floor: 1,
        department: "Inpatient Ward A",
        roomNumber: "201"
      },
      {
        id: "dest-202",
        name: "Room 202",
        aliases: ["202", "room 202", "inpatient 202", "ward 202"],
        nodeId: "F1-202",
        floor: 1,
        department: "Inpatient Ward A",
        roomNumber: "202"
      },
      {
        id: "dest-203",
        name: "Room 203",
        aliases: ["203", "room 203", "inpatient 203"],
        nodeId: "F1-203",
        floor: 1,
        department: "Inpatient Ward A",
        roomNumber: "203"
      },
      {
        id: "dest-204",
        name: "Room 204",
        aliases: ["204", "room 204", "inpatient 204", "ward 204"],
        nodeId: "F1-204",
        floor: 1,
        department: "Inpatient Ward B",
        roomNumber: "204"
      },
      {
        id: "dest-205",
        name: "Room 205 - Neurology",
        aliases: ["205", "room 205", "neurology", "neuro suite", "brain clinic"],
        nodeId: "F1-205",
        floor: 1,
        department: "Neurology",
        roomNumber: "205"
      },
      {
        id: "dest-206",
        name: "Room 206 - Oncology",
        aliases: ["206", "room 206", "oncology", "cancer care"],
        nodeId: "F1-206",
        floor: 1,
        department: "Oncology Care",
        roomNumber: "206"
      },
      {
        id: "dest-icu",
        name: "Intensive Care Unit (ICU)",
        aliases: ["icu", "intensive care", "ccu", "critical care"],
        nodeId: "F1-ICU",
        floor: 1,
        department: "Critical Care",
        roomNumber: "ICU-01"
      },
      {
        id: "dest-ot",
        name: "Operation Theatre Complex",
        aliases: ["ot", "operation theatre", "surgery", "or", "operating room", "ot 1", "ot 2"],
        nodeId: "F1-OT-SUITE",
        floor: 1,
        department: "Surgical Services",
        roomNumber: "OT-01"
      },
      {
        id: "dest-cardiology",
        name: "Cardiology Suite & Cath Lab",
        aliases: ["cardiology", "heart", "cath lab", "cardiac", "ecg"],
        nodeId: "F1-CARDIOLOGY",
        floor: 1,
        department: "Cardiology",
        roomNumber: "CARD-01"
      },
      {
        id: "dest-nurse-station",
        name: "Nursing Station 1",
        aliases: ["nurse", "nursing", "duty station", "inpatient desk"],
        nodeId: "F1-NURSE-STATION",
        floor: 1,
        department: "Inpatient Administration",
        roomNumber: "NS-01"
      }
    ],

    architecturalLayout: {
      0: {
        rooms: [
          { id: "G-101", x: 40, y: 310, width: 110, height: 80, label: "Room 101", subLabel: "General Medicine", number: "101", type: "consultation" },
          { id: "G-102", x: 40, y: 210, width: 110, height: 80, label: "Room 102", subLabel: "Pediatrics", number: "102", type: "consultation" },
          { id: "G-103", x: 40, y: 130, width: 110, height: 70, label: "Room 103", subLabel: "Internal Med", number: "103", type: "consultation" },
          { id: "G-RADIOLOGY", x: 40, y: 50, width: 110, height: 70, label: "Radiology", subLabel: "X-Ray / MRI / CT", number: "RAD-01", type: "diagnostic" },
          { id: "G-PHARMACY", x: 240, y: 320, width: 120, height: 80, label: "Pharmacy", subLabel: "Outpatient Dispensary", number: "PHARM", type: "pharmacy" },
          { id: "G-RECEPTION", x: 360, y: 350, width: 120, height: 60, label: "Main Reception", subLabel: "Help & Registration", number: "REC-01", type: "reception" },
          { id: "G-CAFETERIA", x: 240, y: 40, width: 130, height: 60, label: "Cafeteria", subLabel: "Dining & Refreshments", number: "CAF-01", type: "facility" },
          { id: "G-RESTROOMS", x: 470, y: 40, width: 120, height: 60, label: "Restrooms", subLabel: "Accessible WC", number: "WC-01", type: "facility" },
          { id: "G-PATHOLOGY", x: 480, y: 320, width: 120, height: 80, label: "Pathology", subLabel: "Blood Lab & Testing", number: "LAB-01", type: "diagnostic" },
          { id: "G-104", x: 700, y: 130, width: 110, height: 80, label: "Room 104", subLabel: "Orthopedics", number: "104", type: "consultation" },
          { id: "G-105", x: 700, y: 50, width: 110, height: 70, label: "Room 105", subLabel: "ENT / Eye", number: "105", type: "consultation" },
          { id: "G-EMERGENCY", x: 700, y: 290, width: 110, height: 110, label: "Emergency", subLabel: "Trauma Care", number: "ER-01", type: "emergency" }
        ],
        verticals: [
          { id: "G-LIFT-A", x: 355, y: 175, width: 50, height: 50, label: "Lift A", type: "lift" },
          { id: "G-LIFT-B", x: 435, y: 175, width: 50, height: 50, label: "Lift B", type: "lift" },
          { id: "G-STAIR-WEST", x: 165, y: 105, width: 50, height: 50, label: "Stair W", type: "stair" },
          { id: "G-STAIR-EAST", x: 625, y: 105, width: 50, height: 50, label: "Stair E", type: "stair" }
        ],
        corridors: [
          { d: "M 420 500 L 420 200" },
          { d: "M 190 250 L 650 250" },
          { d: "M 190 90 L 190 350" },
          { d: "M 650 90 L 650 350" },
          { d: "M 310 130 L 530 130" }
        ],
        entrances: [
          { id: "G-ENTRANCE", x: 420, y: 520, label: "Main Entrance" },
          { id: "G-AMBULANCE-BAY", x: 755, y: 470, label: "Ambulance Entry" }
        ]
      },
      1: {
        rooms: [
          { id: "F1-201", x: 40, y: 310, width: 110, height: 80, label: "Room 201", subLabel: "Deluxe Inpatient Suite", number: "201", type: "inpatient" },
          { id: "F1-202", x: 40, y: 210, width: 110, height: 80, label: "Room 202", subLabel: "Inpatient Ward", number: "202", type: "inpatient" },
          { id: "F1-203", x: 40, y: 130, width: 110, height: 70, label: "Room 203", subLabel: "Inpatient Ward", number: "203", type: "inpatient" },
          { id: "F1-OT-SUITE", x: 40, y: 50, width: 110, height: 70, label: "Operation Theatre", subLabel: "Sterile OT 1 & 2", number: "OT-01", type: "surgical" },
          { id: "F1-ICU", x: 240, y: 320, width: 120, height: 80, label: "ICU", subLabel: "Intensive Care Unit", number: "ICU-01", type: "critical" },
          { id: "F1-NURSE-STATION", x: 360, y: 310, width: 120, height: 50, label: "Nurse Station", subLabel: "Ward Monitoring", number: "NS-01", type: "nursing" },
          { id: "F1-DOCTORS-LOUNGE", x: 470, y: 40, width: 120, height: 60, label: "Doctors Lounge", subLabel: "Clinical Staff Only", number: "DOC-01", type: "staff" },
          { id: "F1-CARDIOLOGY", x: 480, y: 320, width: 120, height: 80, label: "Cardiology", subLabel: "Cath Lab & Diagnostics", number: "CARD-01", type: "cardiology" },
          { id: "F1-204", x: 700, y: 130, width: 110, height: 80, label: "Room 204", subLabel: "Inpatient Suite", number: "204", type: "inpatient" },
          { id: "F1-205", x: 700, y: 50, width: 110, height: 70, label: "Room 205", subLabel: "Neurology Care", number: "205", type: "inpatient" },
          { id: "F1-206", x: 700, y: 290, width: 110, height: 110, label: "Room 206", subLabel: "Oncology Care", number: "206", type: "inpatient" }
        ],
        verticals: [
          { id: "F1-LIFT-A", x: 355, y: 175, width: 50, height: 50, label: "Lift A", type: "lift" },
          { id: "F1-LIFT-B", x: 435, y: 175, width: 50, height: 50, label: "Lift B", type: "lift" },
          { id: "F1-STAIR-WEST", x: 165, y: 105, width: 50, height: 50, label: "Stair W", type: "stair" },
          { id: "F1-STAIR-EAST", x: 625, y: 105, width: 50, height: 50, label: "Stair E", type: "stair" }
        ],
        corridors: [
          { d: "M 420 370 L 420 200" },
          { d: "M 190 250 L 650 250" },
          { d: "M 190 90 L 190 350" },
          { d: "M 650 90 L 650 350" },
          { d: "M 420 130 L 530 130" }
        ],
        entrances: []
      }
    }
  };

  // =========================================================================
  // 2. A* PATHFINDING ALGORITHM
  // =========================================================================
  class AStarPathfinder {
    constructor(dataset) {
      this.dataset = dataset;
      this.adjacency = new Map();
      this.buildGraph();
    }

    buildGraph() {
      for (const nodeId of Object.keys(this.dataset.nodes)) {
        this.adjacency.set(nodeId, []);
      }

      for (const edge of this.dataset.edges) {
        const fromNode = this.dataset.nodes[edge.from];
        const toNode = this.dataset.nodes[edge.to];
        if (!fromNode || !toNode) continue;

        const dist = typeof edge.distance === "number" ? edge.distance : Math.hypot(fromNode.x - toNode.x, fromNode.y - toNode.y);

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

    heuristic(nodeA, nodeB) {
      const dx = nodeA.x - nodeB.x;
      const dy = nodeA.y - nodeB.y;
      const planar = Math.sqrt(dx * dx + dy * dy);
      const floorPenalty = Math.abs(nodeA.floor - nodeB.floor) * 16.0;
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
          floorSegments: { [startNode.floor]: [startNode] },
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
          return this.reconstructPath(cameFrom, currentId, gScore.get(targetNodeId));
        }

        openSet.delete(currentId);
        const neighbors = this.adjacency.get(currentId) || [];

        for (const edge of neighbors) {
          const neighborNode = this.dataset.nodes[edge.to];
          if (!neighborNode) continue;

          const tentativeG = gScore.get(currentId) + edge.distance;

          if (tentativeG < gScore.get(edge.to)) {
            cameFrom.set(edge.to, { fromId: currentId, edge: edge });
            gScore.set(edge.to, tentativeG);
            fScore.set(edge.to, tentativeG + this.heuristic(neighborNode, targetNode));

            if (!openSet.has(edge.to)) {
              openSet.add(edge.to);
            }
          }
        }
      }

      return {
        success: false,
        error: "Destination location unavailable."
      };
    }

    reconstructPath(cameFrom, currentId, totalCost) {
      const path = [];
      let curr = currentId;

      while (curr) {
        path.unshift(this.dataset.nodes[curr]);
        const parent = cameFrom.get(curr);
        curr = parent ? parent.fromId : null;
      }

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
              connectorType: (prev.type === "lift" || node.type === "lift") ? "Elevator" : "Stairs"
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

  // =========================================================================
  // 3. VECTOR SVG MAP RENDERER
  // =========================================================================
  class HospitalMapRenderer {
    constructor(containerElement, dataset) {
      this.container = containerElement;
      this.dataset = dataset;
      this.currentFloor = 0;
      
      this.scale = 1.0;
      this.panX = 0;
      this.panY = 0;
      this.isDragging = false;
      this.dragStartX = 0;
      this.dragStartY = 0;

      this.activeRoute = null;
      this.currentLocationNode = null;
      this.destinationNode = null;
      this.livePosition = null;
      this.onNodeSelected = null;

      this.initSVG();
      this.setupEventListeners();
    }

    initSVG() {
      this.container.innerHTML = `
        <svg id="hospital-svg" class="map-svg" viewBox="0 0 850 540" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            <filter id="room-shadow" x="-5%" y="-5%" width="115%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#0f172a" flood-opacity="0.06" />
            </filter>

            <filter id="marker-shadow" x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#0284c7" flood-opacity="0.3" />
            </filter>

            <pattern id="hospital-grid" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#e2e8f0" stroke-width="0.7" stroke-opacity="0.6"/>
            </pattern>
          </defs>

          <g id="viewport-group" transform="matrix(1 0 0 1 0 0)">
            <rect id="map-bg-grid" x="0" y="0" width="850" height="540" fill="url(#hospital-grid)" />
            <rect id="floor-boundary" x="15" y="15" width="820" height="510" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />
            
            <g id="corridors-layer"></g>
            <g id="rooms-layer"></g>
            <g id="verticals-layer"></g>
            <g id="entrances-layer"></g>
            <g id="walkable-nodes-layer"></g>

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
      this.svgElement.addEventListener("mousedown", (e) => {
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

      this.svgElement.addEventListener("wheel", (e) => {
        e.preventDefault();
        const factor = e.deltaY < 0 ? 1.15 : 0.87;
        this.zoomAtPoint(factor, e.clientX, e.clientY);
      }, { passive: false });

      // Touch events
      let initialDist = null;
      let initialCenter = null;

      this.svgElement.addEventListener("touchstart", (e) => {
        if (e.touches.length === 1) {
          this.isDragging = true;
          this.dragStartX = e.touches[0].clientX - this.panX;
          this.dragStartY = e.touches[0].clientY - this.panY;
        } else if (e.touches.length === 2) {
          this.isDragging = false;
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          initialDist = Math.hypot(dx, dy);
          initialCenter = {
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
        } else if (e.touches.length === 2 && initialDist) {
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          const dist = Math.hypot(dx, dy);
          this.zoomAtPoint(dist / initialDist, initialCenter.x, initialCenter.y);
          initialDist = dist;
        }
      }, { passive: true });

      this.svgElement.addEventListener("touchend", () => {
        this.isDragging = false;
        initialDist = null;
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

      this.corridorsLayer.innerHTML = "";
      this.roomsLayer.innerHTML = "";
      this.verticalsLayer.innerHTML = "";
      this.entrancesLayer.innerHTML = "";
      this.walkableNodesLayer.innerHTML = "";

      // 1. Corridors
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

      // 2. Rooms
      layout.rooms.forEach(room => {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("class", `room-group room-${room.type}`);
        g.setAttribute("data-node-id", room.id);
        g.style.cursor = "pointer";

        let fill = "#f8fafc";
        let border = "#cbd5e1";
        let badgeBg = "#e2e8f0";
        let badgeText = "#334155";

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
        }

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

        g.addEventListener("click", () => {
          if (this.onNodeSelected) {
            this.onNodeSelected(room.id);
          }
        });

        this.roomsLayer.appendChild(g);
      });

      // 3. Verticals (Lifts & Stairs)
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

        const iconText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        iconText.setAttribute("x", v.x + v.width / 2);
        iconText.setAttribute("y", v.y + 24);
        iconText.setAttribute("text-anchor", "middle");
        iconText.setAttribute("font-size", "14");
        iconText.textContent = isLift ? "🛗" : "🪜";
        g.appendChild(iconText);

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

      // 4. Entrances
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

      // 5. Walkable Nodes
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
        if (this.currentLocationNode && this.currentLocationNode.floor === this.currentFloor) {
          this.renderCurrentLocationMarker(this.currentLocationNode.x, this.currentLocationNode.y);
        }
        return;
      }

      const currentFloorNodes = this.activeRoute.floorSegments[this.currentFloor];

      if (currentFloorNodes && currentFloorNodes.length > 1) {
        let pathD = `M ${currentFloorNodes[0].x} ${currentFloorNodes[0].y}`;
        for (let i = 1; i < currentFloorNodes.length; i++) {
          pathD += ` L ${currentFloorNodes[i].x} ${currentFloorNodes[i].y}`;
        }

        const glowLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
        glowLine.setAttribute("d", pathD);
        glowLine.setAttribute("stroke", "#60a5fa");
        glowLine.setAttribute("stroke-width", "11");
        glowLine.setAttribute("stroke-linecap", "round");
        glowLine.setAttribute("stroke-linejoin", "round");
        glowLine.setAttribute("stroke-opacity", "0.4");
        glowLine.setAttribute("fill", "none");
        this.routeLayer.appendChild(glowLine);

        // Primary BLUE Route Line
        const blueLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
        blueLine.setAttribute("id", "active-route-line");
        blueLine.setAttribute("d", pathD);
        blueLine.setAttribute("stroke", "#2563eb");
        blueLine.setAttribute("stroke-width", "5.5");
        blueLine.setAttribute("stroke-linecap", "round");
        blueLine.setAttribute("stroke-linejoin", "round");
        blueLine.setAttribute("fill", "none");
        this.routeLayer.appendChild(blueLine);

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

      if (this.currentLocationNode && this.currentLocationNode.floor === this.currentFloor) {
        const posX = this.livePosition ? this.livePosition.x : this.currentLocationNode.x;
        const posY = this.livePosition ? this.livePosition.y : this.currentLocationNode.y;
        this.renderCurrentLocationMarker(posX, posY);
      }

      if (this.destinationNode && this.destinationNode.floor === this.currentFloor) {
        this.renderDestinationMarker(this.destinationNode.x, this.destinationNode.y, this.destinationNode.name);
      }

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

      const ripple = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      ripple.setAttribute("cx", x);
      ripple.setAttribute("cy", y);
      ripple.setAttribute("r", "16");
      ripple.setAttribute("fill", "#2563eb");
      ripple.setAttribute("fill-opacity", "0.2");
      ripple.setAttribute("class", "pulse-ripple");
      g.appendChild(ripple);

      const pin = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      pin.setAttribute("cx", x);
      pin.setAttribute("cy", y);
      pin.setAttribute("r", "9");
      pin.setAttribute("fill", "#1d4ed8");
      pin.setAttribute("stroke", "#ffffff");
      pin.setAttribute("stroke-width", "3");
      pin.setAttribute("filter", "url(#marker-shadow)");
      g.appendChild(pin);

      const centerDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      centerDot.setAttribute("cx", x);
      centerDot.setAttribute("cy", y);
      centerDot.setAttribute("r", "3");
      centerDot.setAttribute("fill", "#ffffff");
      g.appendChild(centerDot);

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

      const beacon = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      beacon.setAttribute("cx", x);
      beacon.setAttribute("cy", y);
      beacon.setAttribute("r", "20");
      beacon.setAttribute("fill", "#ef4444");
      beacon.setAttribute("fill-opacity", "0.22");
      beacon.setAttribute("class", "pulse-ripple-red");
      g.appendChild(beacon);

      // Exact blue route termination dot
      const exactTerminusDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      exactTerminusDot.setAttribute("cx", x);
      exactTerminusDot.setAttribute("cy", y);
      exactTerminusDot.setAttribute("r", "6");
      exactTerminusDot.setAttribute("fill", "#2563eb");
      exactTerminusDot.setAttribute("stroke", "#ffffff");
      exactTerminusDot.setAttribute("stroke-width", "2");
      g.appendChild(exactTerminusDot);

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

    updateLivePosition(pos) {
      this.livePosition = pos;

      if (pos.floor !== this.currentFloor) {
        this.setFloor(pos.floor);
        return;
      }

      const markerGroup = this.markersLayer.querySelector("#current-loc-marker-group");
      if (markerGroup) {
        markerGroup.remove();
      }
      this.renderCurrentLocationMarker(pos.x, pos.y);

      if (this.activeRoute && this.activeRoute.floorSegments[this.currentFloor]) {
        const floorNodes = this.activeRoute.floorSegments[this.currentFloor];
        if (floorNodes.length > 1) {
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

      let remainingPathD = `M ${projPoint.x} ${projPoint.y}`;
      for (let i = closestSegmentIdx + 1; i < nodes.length; i++) {
        remainingPathD += ` L ${nodes[i].x} ${nodes[i].y}`;
      }

      return remainingPathD;
    }
  }

  // =========================================================================
  // 4. LIVE POSITIONING SYSTEM (Wi-Fi Architecture)
  // =========================================================================
  class LivePositioningSystem {
    constructor(mapRenderer) {
      this.mapRenderer = mapRenderer;
      this.currentPosition = null;
      this.isSimulating = false;
      this.simInterval = null;

      window.updateLivePosition = (payload) => this.handlePositionUpdate(payload);
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

      this.mapRenderer.updateLivePosition(this.currentPosition);
    }

    startRouteWalkSimulation(routeNodes, onComplete) {
      this.stopSimulation();
      if (!routeNodes || routeNodes.length < 2) return;

      this.isSimulating = true;
      let currentIdx = 0;
      let t = 0;
      const speed = 0.05;

      this.simInterval = setInterval(() => {
        if (currentIdx >= routeNodes.length - 1) {
          this.stopSimulation();
          if (onComplete) onComplete();
          return;
        }

        const p1 = routeNodes[currentIdx];
        const p2 = routeNodes[currentIdx + 1];

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
      }, 70);
    }

    stopSimulation() {
      if (this.simInterval) {
        clearInterval(this.simInterval);
        this.simInterval = null;
      }
      this.isSimulating = false;
    }
  }

  // =========================================================================
  // 5. APPLICATION CONTROLLER
  // =========================================================================
  class HospitalNavigationApp {
    constructor() {
      this.dataset = MASTER_DATASET;
      this.pathfinder = new AStarPathfinder(this.dataset);
      
      this.mapContainer = document.getElementById("map-viewport");
      this.startSelect = document.getElementById("start-location-select");
      this.destInput = document.getElementById("destination-search-input");
      this.searchResultsDropdown = document.getElementById("search-results-dropdown");
      this.clearSearchBtn = document.getElementById("clear-search-btn");
      this.distanceBadge = document.getElementById("route-distance-badge");
      this.routeInfoBanner = document.getElementById("route-info-banner");
      this.errorMessageBanner = document.getElementById("error-message-banner");
      this.floorButtons = document.querySelectorAll(".floor-tab-btn");
      
      this.btnZoomIn = document.getElementById("btn-zoom-in");
      this.btnZoomOut = document.getElementById("btn-zoom-out");
      this.btnResetView = document.getElementById("btn-reset-view");
      this.btnFitRoute = document.getElementById("btn-fit-route");
      
      this.btnSimulateWalk = document.getElementById("btn-simulate-walk");
      this.btnWifiMock = document.getElementById("btn-wifi-mock");
      this.wifiModal = document.getElementById("wifi-modal");
      this.closeWifiModalBtn = document.getElementById("btn-close-wifi-modal");
      this.sendWifiPayloadBtn = document.getElementById("btn-send-wifi-payload");
      this.wifiFloorInput = document.getElementById("wifi-input-floor");
      this.wifiXInput = document.getElementById("wifi-input-x");
      this.wifiYInput = document.getElementById("wifi-input-y");

      this.currentStartNodeId = "G-ENTRANCE";
      this.currentSelectedDest = null;
      this.currentRoute = null;

      this.renderer = new HospitalMapRenderer(this.mapContainer, this.dataset);
      this.livePositioning = new LivePositioningSystem(this.renderer);

      this.initUI();
      this.bindEvents();
      
      const initialNode = this.dataset.nodes[this.currentStartNodeId];
      this.renderer.currentLocationNode = initialNode;
      this.renderer.renderCurrentLocationMarker(initialNode.x, initialNode.y);
    }

    initUI() {
      this.startSelect.innerHTML = "";
      
      const groundNodes = [];
      const firstFloorNodes = [];

      Object.values(this.dataset.nodes).forEach(node => {
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
      this.floorButtons.forEach(btn => {
        btn.addEventListener("click", () => {
          const floor = parseInt(btn.dataset.floor, 10);
          this.switchFloorUI(floor);
        });
      });

      this.startSelect.addEventListener("change", (e) => {
        this.currentStartNodeId = e.target.value;
        const startNode = this.dataset.nodes[this.currentStartNodeId];
        this.renderer.currentLocationNode = startNode;
        
        if (startNode.floor !== this.renderer.currentFloor) {
          this.switchFloorUI(startNode.floor);
        } else {
          this.renderer.refreshRouteAndMarkers();
        }

        if (this.currentSelectedDest) {
          this.calculateAndDisplayRoute();
        }
      });

      this.destInput.addEventListener("input", (e) => {
        const query = e.target.value.trim().toLowerCase();
        this.handleSearchInput(query);
      });

      this.destInput.addEventListener("focus", () => {
        const query = this.destInput.value.trim().toLowerCase();
        this.handleSearchInput(query);
      });

      this.clearSearchBtn.addEventListener("click", () => {
        this.destInput.value = "";
        this.clearSearchBtn.style.display = "none";
        this.searchResultsDropdown.style.display = "none";
        this.currentSelectedDest = null;
        this.clearActiveRoute();
      });

      document.addEventListener("click", (e) => {
        if (!this.searchResultsDropdown.contains(e.target) && e.target !== this.destInput) {
          this.searchResultsDropdown.style.display = "none";
        }
      });

      this.btnZoomIn.addEventListener("click", () => this.renderer.zoomIn());
      this.btnZoomOut.addEventListener("click", () => this.renderer.zoomOut());
      this.btnResetView.addEventListener("click", () => this.renderer.resetView());
      this.btnFitRoute.addEventListener("click", () => this.renderer.fitRoute());

      this.renderer.onNodeSelected = (nodeId) => {
        const matchingDest = this.dataset.destinations.find(d => d.nodeId === nodeId);
        if (matchingDest) {
          this.selectDestination(matchingDest);
        }
      };

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

      this.btnSimulateWalk.addEventListener("click", () => {
        if (!this.currentRoute || !this.currentRoute.path) {
          this.showError("Please calculate a route first before starting simulation.");
          return;
        }
        this.btnSimulateWalk.classList.add("active-simulating");
        this.btnSimulateWalk.textContent = "Walking Route…";
        this.livePositioning.startRouteWalkSimulation(this.currentRoute.path, () => {
          this.btnSimulateWalk.classList.remove("active-simulating");
          this.btnSimulateWalk.textContent = "▶ Simulate Walk";
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

      const routeResult = this.pathfinder.findRoute(startNode.id, destNode.id);

      if (!routeResult.success) {
        this.showError(routeResult.error || "Destination location unavailable.");
        return;
      }

      this.currentRoute = routeResult;

      this.renderer.setRoute(routeResult, startNode, destNode);

      const estTimeSec = Math.round(routeResult.totalDistance / 1.3);
      const estTimeStr = estTimeSec < 60 ? `${estTimeSec} sec` : `${Math.ceil(estTimeSec / 60)} min`;
      
      this.distanceBadge.innerHTML = `
        <span class="dist-icon">📏</span>
        <span class="dist-val">Distance: <strong>${routeResult.totalDistance} m</strong></span>
        <span class="dist-dot">•</span>
        <span class="dist-time">~${estTimeStr} walk</span>
      `;
      this.distanceBadge.style.display = "inline-flex";

      if (routeResult.hasVerticalTransition) {
        const trans = routeResult.transitionNodes[0];
        this.routeInfoBanner.innerHTML = `
          <span class="banner-icon">ℹ️</span>
          <span>Route transitions from Level ${trans.fromFloor === 0 ? "G" : "1"} to Level ${trans.toFloor === 0 ? "G" : "1"} via <strong>${trans.connectorType}</strong>.</span>
        `;
        this.routeInfoBanner.style.display = "flex";
      } else {
        this.routeInfoBanner.style.display = "none";
      }

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

  // Auto-init on load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      window.hospitalApp = new HospitalNavigationApp();
    });
  } else {
    window.hospitalApp = new HospitalNavigationApp();
  }
})();
