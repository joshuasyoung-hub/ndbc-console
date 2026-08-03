import { useState } from "react";
import { SectionHeader, Field, DTInput, Btn, Chip, inputStyle, selectStyle } from "../components/ui/index.js";
import { C } from "../theme.js";

export function DQAView(){
  const PAYLOADS=["PL-4500A","PL-4501B","PL-4502C","PL-4503D","PL-4504E"];
  const ASCII_IDS=[{id:"WX-4500",state:"current"},{id:"WX-4499",state:"historic"},{id:"WX-4501",state:"edited"},{id:"BP-1122",state:"current"},{id:"BP-1121",state:"historic"}];
  const NOTES=["Routine maintenance completed","Sensor replacement — calibration verified","Communication outage — telemetry gap logged","Data quality flag applied — spike detected","Buoy recovered and redeployed","Watch circle exceedance — position corrected"];
  const[payload,setPayload]=useState("");const[asciiId,setAsciiId]=useState("");const[start,setStart]=useState("");const[stop,setStop]=useState("");const[note,setNote]=useState("");const[custom,setCustom]=useState(false);const[smartDone,setSmartDone]=useState(false);
  const sel=ASCII_IDS.find(a=>a.id===asciiId);
  const stateColor=s=>s==="current"?C.green:s==="historic"?C.red:C.amber;
  return(<div>
    <SectionHeader title="Data Quality Assurance" sub="Flag or restore data records. Use Smart Proximity Flagging to auto-flag adjacent anomalies."/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
      <Field label="Active Payload"><select value={payload} onChange={e=>setPayload(e.target.value)} style={selectStyle}><option value="">— Select Payload —</option>{PAYLOADS.map(p=><option key={p}>{p}</option>)}</select></Field>
      <Field label="ASCII ID">
        <div style={{position:"relative"}}>
          <select value={asciiId} onChange={e=>setAsciiId(e.target.value)} style={selectStyle}><option value="">— Select ASCII ID —</option>{ASCII_IDS.map(a=><option key={a.id} value={a.id}>{a.id}</option>)}</select>
          {sel&&<span style={{position:"absolute",right:32,top:"50%",transform:"translateY(-50%)",background:stateColor(sel.state),color:C.white,fontSize:10,fontWeight:700,borderRadius:10,padding:"1px 7px"}}>{sel.state}</span>}
        </div>
      </Field>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
      <DTInput label="Start DateTime" value={start} onChange={setStart}/>
      <DTInput label="Stop DateTime" value={stop} onChange={setStop}/>
    </div>
    <Field label="Quality Control Note" style={{marginBottom:16}}>
      {!custom?(<select onChange={e=>{if(e.target.value==="__custom__"){setCustom(true);setNote("");}else setNote(e.target.value);}} style={selectStyle}><option value="">— Select standard note or enter custom —</option>{NOTES.map(n=><option key={n} value={n}>{n}</option>)}<option value="__custom__">Enter custom note…</option></select>):(
        <div style={{display:"flex",gap:8}}><textarea value={note} onChange={e=>setNote(e.target.value)} rows={2} placeholder="Enter custom QC narrative…" style={{...inputStyle,resize:"vertical"}}/><Btn onClick={()=>{setCustom(false);setNote("");}}>Cancel</Btn></div>
      )}
    </Field>
    {smartDone&&<div style={{background:C.blueLight,border:`1px solid ${C.blue}`,borderRadius:8,padding:"10px 14px",marginBottom:14,fontSize:12,color:C.blueDark}}>Smart Flagging complete — 3 adjacent observations auto-flagged based on temporal proximity.</div>}
    <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
      <Btn variant="danger" full onClick={()=>alert("Flags applied — data removed from output.")}>Add Flags — Remove Data</Btn>
      <Btn variant="success" full onClick={()=>alert("Flags cleared — data restored.")}>Remove Flags — Restore Data</Btn>
      <Btn full onClick={()=>{setSmartDone(true);setTimeout(()=>setSmartDone(false),4000);}} style={{borderColor:C.blue,color:C.blue}}>Smart Proximity Flagging</Btn>
    </div>
  </div>);
}
