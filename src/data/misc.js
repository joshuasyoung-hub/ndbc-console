import { C } from "../theme.js";
import { ALL_STATIONS } from "./stations.js";

// ── COMMS DATA ────────────────────────────────────────────────────
export const COMMS_DATA=ALL_STATIONS.map(st=>({
  id:st.id,name:st.name,region:st.region,type:st.type,
  onStation:st.type==="active",
  txOk:Math.floor(Math.random()*100+800),
  txFail:Math.floor(Math.random()*18),
  lastGts:st.type==="active"?new Date(Date.now()-Math.random()*1800000).toLocaleTimeString():"—",
  rssi:st.type==="active"?`${-70-Math.floor(Math.random()*20)} dBm`:"—",
}));

// ── SDR LOGS ──────────────────────────────────────────────────────
export const INITIAL_SDRS=[
  {id:"SDR-2026-001",station:"46402",date:"2026-01-14",type:"Sensor Malfunction",status:"Open",summary:"Barometric sensor +12 hPa offset",history:[{date:"2026-01-14",user:"SysAdmin",text:"Auto-created by threshold check."}]},
  {id:"SDR-2026-002",station:"46403",date:"2026-02-03",type:"Communication",status:"Resolved",summary:"RUDICS dropout — 3 hr gap",history:[{date:"2026-02-03",user:"MCC Tech",text:"Link reset. Telemetry restored."}]},
  {id:"SDR-2026-003",station:"46405",date:"2026-02-28",type:"Adrift Alert",status:"Open",summary:"Buoy drift exceeded 3 NM circle",history:[{date:"2026-02-28",user:"GTS_Monitor",text:"Watch circle breach noted."}]},
];

// ── HIERARCHY SWAP ────────────────────────────────────────────────
export const HIERARCHY_INSTRUMENTS=[
  {id:"SENS-001",name:"Barometric Pressure (Primary)",type:"Met",h1:true,h2:false,dflag:false,affected:"Primary weather data stream"},
  {id:"SENS-002",name:"Wind Speed/Direction",type:"Met",h1:true,h2:false,dflag:false,affected:"Anemometer output routing"},
  {id:"SENS-003",name:"Sea Surface Temperature",type:"Physical",h1:false,h2:true,dflag:false,affected:"Thermal climatology updates"},
  {id:"SENS-004",name:"Bottom Pressure Recorder",type:"BPR",h1:true,h2:false,dflag:true,affected:"DART warning evaluation"},
];

// ── EQUIPMENT REGISTRY ────────────────────────────────────────────
export const ERMS_INVENTORY=[
  {propNum:"ERMS-9981",partNum:"LRU-SST-V4",serialNum:"SN-882110",desc:"SST Processing Element"},
  {propNum:"ERMS-4512",partNum:"LRU-BARO-2",serialNum:"SN-993021",desc:"Barometric Transducer"},
  {propNum:"ERMS-1104",partNum:"PWR-BATT-X",serialNum:"SN-441029",desc:"Primary Power Pack"},
  {propNum:"ERMS-3392",partNum:"LRU-WAVE-DIR",serialNum:"SN-775210",desc:"Directional Wave Array"},
];

// ── WAVE / PLOTTING / TABULATION REFERENCE DATA ───────────────────
export const WAVE_PARAMS=["C11","R1","Alpha1","C22","R2","Alpha2","C33","R3","Alpha3","C44","R4","Alpha4","C55","R5","Alpha5","C12","C13","C14","C15"];
export const ALL_PARAMS=["WSPD","WSPD1","WSPD11","WDIR","ATMP","PRES","WTMP","WVHT","DPD","BARO","SALT","CSPD","CDIR"];
export const PLOT_COLORS=[C.blue,"#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4"];
export const PAYLOAD_MEAS={
  "PL-4500A":["WSPD","WDIR","PRES","ATMP","WTMP","WVHT"],
  "PL-4501B":["WSPD","WDIR","PRES","ATMP","WTMP"],
  "PL-4502C":["BARO","WTMP","SALT"],
  "PL-4503D":["WSPD1","WSPD11","WDIR","ATMP"],
  "PL-4504E":["WSPD","WDIR","PRES","ATMP","WTMP","DPD","WVHT"],
};
