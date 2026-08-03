import { seed } from "../utils/helpers.js";

// ── MASTER STATION DATA ───────────────────────────────────────────
export const ALL_STATIONS = [
  {id:"46402",name:"S of Dutch Harbor",region:"PAC",type:"active",lat:52.83,lon:-168.23,hull:"3M-Discus",depth:4715,deployed:"2024-03-15",payload:"PL-4500A",program:"DART"},
  {id:"46403",name:"N Pacific Shelf",region:"PAC",type:"active",lat:55.10,lon:-162.50,hull:"6M-NOMAD",depth:75,deployed:"2023-09-12",payload:"PL-4501B",program:"Moored Buoy"},
  {id:"46405",name:"Gulf of Alaska",region:"PAC",type:"active",lat:56.90,lon:-155.30,hull:"3M-Discus",depth:1200,deployed:"2022-06-01",payload:"PL-4504E",program:"Moored Buoy"},
  {id:"42012",name:"Orange Beach AL",region:"GM",type:"active",lat:30.07,lon:-87.55,hull:"3M-Discus",depth:24,deployed:"2021-11-20",payload:"PL-4502C",program:"CMAN"},
  {id:"41047",name:"NE Providence Ch.",region:"ATL",type:"active",lat:27.47,lon:-71.49,hull:"3M-Discus",depth:5400,deployed:"2023-01-08",payload:"PL-4503D",program:"Moored Buoy"},
  {id:"46404",name:"Bering Sea West",region:"PAC",type:"historic",lat:57.30,lon:-170.10,hull:"10M-Buoy",depth:3200,deployed:"2018-07-20",payload:"PL-4502C",program:"Moored Buoy"},
  {id:"46407",name:"Cook Inlet",region:"PAC",type:"historic",lat:59.20,lon:-152.80,hull:"6M-NOMAD",depth:85,deployed:"2019-04-10",payload:"PL-4501B",program:"Moored Buoy"},
  {id:"T-001",name:"Test Bench Alpha",region:"TEST",type:"testing",lat:29.10,lon:-89.40,hull:"3M-Discus",depth:50,deployed:"2026-05-01",payload:"PL-TEST1",program:"Moored Buoy"},
];

export const SENSOR_TEMPLATES = [
  {param:"PRES",name:"Barometric Pressure",unit:"hPa",elev:4.2,range:[960,1040],hier:1},
  {param:"WSPD",name:"Wind Speed",unit:"m/s",elev:5.0,range:[0,60],hier:1},
  {param:"WDIR",name:"Wind Direction",unit:"deg",elev:5.0,range:[0,360],hier:1},
  {param:"ATMP",name:"Air Temperature",unit:"°C",elev:4.0,range:[-20,50],hier:1},
  {param:"WTMP",name:"Sea Surface Temp",unit:"°C",elev:-0.6,range:[-2,35],hier:1},
  {param:"WVHT",name:"Wave Height (Hm0)",unit:"m",elev:0,range:[0,20],hier:2},
  {param:"DPD",name:"Dominant Period",unit:"s",elev:0,range:[1,30],hier:2},
  {param:"BARO",name:"Bottom Pressure",unit:"mbar",elev:-4715,range:[900,1100],hier:1},
];

export const STATION_SENSORS = {};
ALL_STATIONS.forEach(st=>{
  const count = st.type==="testing"?2:st.type==="historic"?2:Math.min(SENSOR_TEMPLATES.length,6);
  STATION_SENSORS[st.id] = SENSOR_TEMPLATES.slice(0,count).map((tmpl,j)=>({
    ...tmpl, id:`S${String(j+1).padStart(2,"0")}`,
    status: st.type==="historic"?"historic":
            (j===2&&st.id==="46403")?"fault":
            (j===5&&st.id==="46402")?"degraded":"active",
    lastVal: st.type==="historic"?null:seed(j+1,tmpl.range[0],tmpl.range[1]),
    lastTime: st.type==="historic"?"2025-01-14":"14:32Z",
  }));
});

export const SENSOR_SERIES = {};
ALL_STATIONS.forEach(st=>{
  SENSOR_SERIES[st.id]={};
  (STATION_SENSORS[st.id]||[]).forEach(s=>{
    const [lo,hi]=s.range, span=hi-lo, base=s.lastVal??(lo+span*0.5);
    SENSOR_SERIES[st.id][s.id]=Array.from({length:48},(_,i)=>({
      t:`${String(Math.floor(i/2)).padStart(2,"0")}:${i%2===0?"00":"30"}`,
      v:+(base+Math.sin(i/4)*span*0.03+(Math.random()-0.5)*span*0.015).toFixed(2),
      flag:(i===9||i===22)?"fail":"pass",
    }));
  });
});
