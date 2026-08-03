import { useState } from "react";
import { SectionHeader, Card, CardTitle, Field, Btn, selectStyle } from "../components/ui/index.js";
import { C } from "../theme.js";
import { ALL_STATIONS } from "../data/stations.js";

export function CommandMapView(){
  const[station,setStation]=useState("46402");const[mode,setMode]=useState("Standard (15-min)");const[pending,setPending]=useState(null);const[done,setDone]=useState(null);
  const st=ALL_STATIONS.find(s=>s.id===station)||ALL_STATIONS[0];
  const cmds=[
    {id:"bpr_test",label:"In-Situ BPR Test",desc:"Trigger BPR self-diagnostic"},
    {id:"hf_mode",label:"Enable High-Freq (1-min)",desc:"Switch from 15-min to 1-min avg"},
    {id:"reset_link",label:"Reset RUDICS Link",desc:"Force satellite link reset"},
    {id:"status_req",label:"Request Status Report",desc:"Pull full diagnostic payload"},
  ];
  const exec=cmd=>{setPending(null);setDone(cmd);setTimeout(()=>setDone(null),3000);};
  return(<div>
    <SectionHeader title="Command Map — Operational Center" sub="Remote command execution with amber validation gate"/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
      <Card>
        <CardTitle>Station Profile</CardTitle>
        <Field label="Target Station" style={{marginBottom:10}}>
          <select value={station} onChange={e=>setStation(e.target.value)} style={selectStyle}>
            {ALL_STATIONS.filter(s=>s.type==="active").map(s=><option key={s.id}>{s.id}</option>)}
          </select>
        </Field>
        {[["Name",st.name],["Lat/Lon",`${st.lat}°N, ${Math.abs(st.lon)}°W`],["Depth",`${st.depth} m`],["Payload",st.payload]].map(([k,v])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"5px 0",borderBottom:`1px solid ${C.gray100}`}}>
            <span style={{color:C.gray500}}>{k}</span><span style={{fontWeight:600}}>{v}</span>
          </div>
        ))}
      </Card>
      <Card>
        <CardTitle>Operating Mode</CardTitle>
        {["Standard (15-min)","Event (1-min avg)"].map(m=>(
          <label key={m} style={{display:"flex",alignItems:"center",gap:8,fontSize:13,cursor:"pointer",marginBottom:8}}>
            <input type="radio" name="opmode" checked={mode===m} onChange={()=>setMode(m)}/> {m}
          </label>
        ))}
      </Card>
    </div>
    <div style={{background:C.amberLight,border:`1px solid ${C.amber}`,borderRadius:8,padding:"8px 14px",marginBottom:12,fontSize:12,color:"#713f12"}}>
      Command Routing Validation Gate — verify station and mode before executing. All commands are logged.
    </div>
    {done&&<div style={{background:C.greenLight,border:`1px solid ${C.green}`,borderRadius:8,padding:"9px 14px",marginBottom:12,fontSize:12,fontWeight:600,color:"#166534"}}>"{done.label}" executed at {new Date().toLocaleTimeString()}</div>}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
      {cmds.map(cmd=>(
        <button key={cmd.id} onClick={()=>setPending(cmd)} style={{background:C.white,border:`1px solid ${C.gray200}`,borderRadius:10,padding:"12px 14px",textAlign:"left",cursor:"pointer",transition:"all .12s"}}
          onMouseEnter={e=>e.currentTarget.style.borderColor=C.blue}
          onMouseLeave={e=>e.currentTarget.style.borderColor=C.gray200}>
          <div style={{fontSize:13,fontWeight:600,color:C.navy,marginBottom:3}}>{cmd.label}</div>
          <div style={{fontSize:11,color:C.gray500}}>{cmd.desc}</div>
        </button>
      ))}
    </div>
    {pending&&(
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}}>
        <div style={{background:C.white,borderRadius:14,padding:24,maxWidth:360,width:"90%"}}>
          <div style={{fontSize:15,fontWeight:700,color:C.navy,marginBottom:8}}>Confirm Command</div>
          <div style={{fontSize:13,color:C.gray700,marginBottom:6,fontWeight:600}}>{pending.label}</div>
          <div style={{fontSize:12,color:C.gray500,background:C.gray50,padding:"7px 10px",borderRadius:6,marginBottom:16}}>
            Station: {station} · Mode: {mode} · {new Date().toLocaleTimeString()}
          </div>
          <div style={{display:"flex",gap:10}}>
            <Btn variant="primary" full onClick={()=>exec(pending)}>Execute</Btn>
            <Btn full onClick={()=>setPending(null)}>Cancel</Btn>
          </div>
        </div>
      </div>
    )}
  </div>);
}
