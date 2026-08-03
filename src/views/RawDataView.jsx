import { useState } from "react";
import { SectionHeader, Field, DTInput, Btn, Chip, Card, CardTitle, inputStyle, selectStyle } from "../components/ui/index.js";
import { C } from "../theme.js";

export function RawDataView(){
  const[scope,setScope]=useState("individual");const[payload,setPL]=useState("");const[stationId,setSt]=useState("");const[selected,setSel]=useState(["WX-4500","BP-1122"]);const[input,setInput]=useState("");const[hours,setHours]=useState(null);const[start,setStart]=useState("");const[stop,setStop]=useState("");const[matrix,setMatrix]=useState({summary:true,gaps:false,spectral:false});
  const ALL_IDS=["WX-4500","WX-4501","WX-4502","BP-1122","BP-1123","TP-0001","CT-5500"];
  const filtered=ALL_IDS.filter(i=>i.toLowerCase().includes(input.toLowerCase())&&!selected.includes(i));
  const addId=id=>{if(id&&!selected.includes(id))setSel(s=>[...s,id]);setInput("");};
  return(<div>
    <SectionHeader title="Raw Data Report (B012M)" sub="Select scope, station IDs, and time window for raw data export"/>
    <Card style={{marginBottom:14}}>
      <CardTitle>Report Scope</CardTitle>
      <div style={{display:"flex",gap:20,marginBottom:12}}>
        {[["individual","Individual Payload"],["all","All Payloads by Station"]].map(([v,l])=>(<label key={v} style={{display:"flex",alignItems:"center",gap:8,fontSize:13,cursor:"pointer"}}><input type="radio" name="scope" checked={scope===v} onChange={()=>setScope(v)}/> {l}</label>))}
      </div>
      {scope==="individual"?(<Field label="Payload"><select value={payload} onChange={e=>setPL(e.target.value)} style={selectStyle}><option value="">— Select Payload —</option>{["PL-4500A","PL-4501B","PL-4502C","PL-4503D","PL-4504E"].map(p=><option key={p}>{p}</option>)}</select></Field>):(<Field label="Station / Location ID"><input value={stationId} onChange={e=>setSt(e.target.value)} placeholder="e.g. 42012" style={inputStyle}/></Field>)}
    </Card>
    <Field label="Station IDs" style={{marginBottom:12}}>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,minHeight:38,padding:8,border:`1px solid ${C.gray200}`,borderRadius:8,background:C.white}}>
        {selected.map(s=><Chip key={s} label={s} onRemove={()=>setSel(p=>p.filter(i=>i!==s))}/>)}
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addId(input.trim().toUpperCase());}} placeholder="Type ID + Enter…" style={{border:"none",outline:"none",fontSize:12,background:"transparent",minWidth:90}}/>
      </div>
      {input&&filtered.length>0&&(<div style={{border:`1px solid ${C.gray200}`,borderRadius:8,marginTop:4,background:C.white,maxHeight:120,overflowY:"auto"}}>{filtered.map(i=><div key={i} onClick={()=>addId(i)} style={{padding:"6px 12px",fontSize:12,cursor:"pointer"}} onMouseEnter={e=>e.target.style.background=C.gray50} onMouseLeave={e=>e.target.style.background="transparent"}>{i}</div>)}</div>)}
    </Field>
    <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
      {["Last 1 Hr","Last 3 Hrs","Last 6 Hrs","Last 12 Hrs","Last 24 Hrs"].map(h=>(<button key={h} onClick={()=>setHours(h)} style={{padding:"5px 12px",borderRadius:16,fontSize:11,fontWeight:600,cursor:"pointer",background:hours===h?C.navy:C.gray100,color:hours===h?C.white:C.gray500,border:`1px solid ${hours===h?C.navy:C.gray200}`}}>{h}</button>))}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
      <DTInput label="Start DateTime" value={start} onChange={setStart}/>
      <DTInput label="Stop DateTime" value={stop} onChange={setStop}/>
    </div>
    <div style={{display:"flex",gap:16,marginBottom:18}}>
      {Object.entries({summary:"Summary Matrix",gaps:"Data Gaps",spectral:"Spectral Data"}).map(([k,v])=>(<label key={k} style={{display:"flex",alignItems:"center",gap:7,fontSize:13,cursor:"pointer"}}><input type="checkbox" checked={matrix[k]} onChange={e=>setMatrix(m=>({...m,[k]:e.target.checked}))}/> {v}</label>))}
    </div>
    <Btn variant="primary" onClick={()=>alert(`Report: ${scope} | ${selected.join(",")} | Window: ${hours||"custom"}`)}>Generate B012M Report</Btn>
  </div>);
}
