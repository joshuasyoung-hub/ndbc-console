import { C } from "../theme.js";

// ── TAO ARRAY DATA ────────────────────────────────────────────────
export const TAO_LATS=[8,4,0,-4,-8];
export const TAO_LONS=[-95,-110,-125,-140,-155,-165,-170,-180];

export const TAO_STATUS_META={
  green:   {color:C.green, label:">80% data"},
  yellow:  {color:C.amber, label:"60-79%"},
  red:     {color:C.red,   label:"<60%"},
  "red-t": {color:C.red,   label:"Tx Outage",mark:"!"},
  "orange-d":{color:"#ea580c",label:"Drift",mark:"D"},
};

export const TAO_NODES=(()=>{
  const statuses=["green","green","green","yellow","red","red-t","orange-d","green","yellow","green"];
  const nodes=[];
  TAO_LATS.forEach(lat=>TAO_LONS.forEach(lon=>{
    const st=statuses[Math.floor(Math.random()*statuses.length)];
    nodes.push({
      id:`${lat>=0?lat+"N":Math.abs(lat)+"S"}_${Math.abs(lon)}W`,
      lat,lon,status:st,
      pct:st==="green"?85+Math.floor(Math.random()*14):st==="yellow"?65+Math.floor(Math.random()*14):30+Math.floor(Math.random()*29),
      deploy:"2025-03-15",last:new Date(Date.now()-Math.random()*3600000).toLocaleTimeString(),
      adrift:lat===4&&lon===-125,
    });
  }));
  return nodes;
})();
