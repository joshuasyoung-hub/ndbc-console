import { ALL_STATIONS } from "./data/stations.js";
import { TAO_NODES } from "./data/tao.js";
import { INITIAL_SDRS } from "./data/misc.js";

// ═══════════════════════════════════════════════════════════════════
// MODULE DEFINITIONS — each module has an id, label, sidebar items,
// accent color, icon char, and description for the landing card.
// ═══════════════════════════════════════════════════════════════════
export const MODULES = [
  {
    id: "data",
    label: "Data Management Console",
    desc: "DQA, Raw Data Reports, Time Tabulation, Wave Suite, Comms Summary",
    icon: "≡",
    color: "#2563eb",
    colorLight: "#dbeafe",
    stat: "5 tools",
    items: [
      { id:"dqa",     label:"Data Quality Assurance" },
      { id:"rawdata", label:"Raw Data Report" },
      { id:"timetab", label:"Time Tabulation" },
      { id:"wave",    label:"Wave Suite" },
      { id:"comms",   label:"Comms Summary" },
    ],
  },
  {
    id: "property",
    label: "Property Management",
    desc: "Equipment Registry, Hierarchy Swap, SDR Logs, Station Setup Wizard",
    icon: "⊞",
    color: "#0891b2",
    colorLight: "#cffafe",
    stat: "4 tools",
    items: [
      { id:"equipment", label:"Equipment Registry" },
      { id:"hierswap",  label:"Hierarchy Swap" },
      { id:"sdr",       label:"SDR Logs" },
      { id:"wizard",    label:"Station Setup Wizard" },
    ],
  },
  {
    id: "analytics",
    label: "Data Analytics & Insights",
    desc: "Multi-Series Plot, QC Plot & Flagging, Engineering Station Browser",
    icon: "◈",
    color: "#7c3aed",
    colorLight: "#ede9fe",
    stat: "3 tools",
    items: [
      { id:"multiplot",   label:"Multi-Series Plot" },
      { id:"qcplot",      label:"QC Plot & Flagging" },
      { id:"engineering", label:"Engineering Browser" },
    ],
  },
  {
    id: "arrays",
    label: "Operational Arrays",
    desc: "TAO Interactive Grid, Data Availability, DART RUDICS Hub, Command Map",
    icon: "◉",
    color: "#059669",
    colorLight: "#d1fae5",
    stat: "4 tools",
    items: [
      { id:"taogrid",    label:"TAO Interactive Grid" },
      { id:"taoreports", label:"TAO Data Availability" },
      { id:"rudics",     label:"DART RUDICS Hub" },
      { id:"cmdmap",     label:"Command Map" },
    ],
  },
];

// Flat view→module / view→label maps
export const VIEW_MODULE = {};
export const VIEW_LABEL  = {};
MODULES.forEach(m => m.items.forEach(i => {
  VIEW_MODULE[i.id] = m;
  VIEW_LABEL[i.id]  = i.label;
}));

// Legacy flat nav list (kept for any component that wants a simple list)
export const NAV = MODULES.map(m => ({ section: m.label, items: m.items }));
export const NAV_FLAT = VIEW_LABEL;

// Views that require a station to be selected before showing content
export const STATION_GATED_VIEWS = new Set(["dqa","rawdata","timetab","wave","comms","qcplot"]);

// Fleet health mock stats
export const FLEET_STATS = {
  online:    ALL_STATIONS.filter(s=>s.type==="active").length,
  anomalies: 2,
  sdrs:      INITIAL_SDRS.filter(s=>s.status==="Open").length,
  nodes:     TAO_NODES.length,
  healthy:   TAO_NODES.filter(n=>n.status==="green").length,
};
