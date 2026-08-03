import { useState } from "react";
import { SectionHeader, Field, DTInput, Btn, Tabs, Chip, StatusPill, Table, inputStyle } from "../components/ui/index.js";
import { C } from "../theme.js";
import { WAVE_PARAMS } from "../data/misc.js";
import { ALL_STATIONS } from "../data/stations.js";
import { seed } from "../utils/helpers.js";

export function WaveView(){
  const[tab,setTab]=useState("Report");const[wp,setWp]=useState(Object.fromEntries(WAVE_PARAMS.map(p=>[p,false])));const[start,setStart]=useState("");const[stop,setStop]=useState("");const[stId,setStId]=useState("46402");const[outDir,setOutDir]=useState("/data/wave/reports/");
  const allSel=Object.values(wp).every(Boolean);
  return(<div>
    <SectionHeader title="Wave Suite" sub="Report generation, spectral database maintenance, and oceanographer health check"/>
    <Tabs tabs={["Report","DB Maintenance","Health Check"]} active={tab} onChange={setTab}/>
    {tab==="Report"&&(<div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
        <Field label="Station ID"><input value={stId} onChange={e=>setStId(e.target.value)} style={inputStyle}/></Field>
        <Field label="Output Directory"><input value={outDir} onChange={e=>setOutDir(e.target.value)} style={{...inputStyle,fontFamily:C.mono,fontSize:12}}/></Field>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        <DTInput label="Start DateTime" value={start} onChange={setStart}/>
        <DTInput label="Stop DateTime" value={stop} onChange={setStop}/>
      </div>
      <Btn variant="primary" onClick={()=>alert(`Wave report → ${outDir}`)}>Generate Wave Report</Btn>
    </div>)}
    {tab==="DB Maintenance"&&(<div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <span style={{fontSize:13,fontWeight:600,color:C.navy}}>Spectral Measurements — 19 parameters</span>
        <Btn sm onClick={()=>setWp(Object.fromEntries(WAVE_PARAMS.map(p=>[p,!allSel])))}>{allSel?"Deselect All":"Select All"}</Btn>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"6px 14px",background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:10,padding:14,marginBottom:12}}>
        {WAVE_PARAMS.map(p=>(<label key={p} style={{display:"flex",alignItems:"center",gap:7,fontSize:13,cursor:"pointer"}}><input type="checkbox" checked={wp[p]} onChange={e=>setWp(w=>({...w,[p]:e.target.checked}))}/><span style={{fontFamily:C.mono,fontWeight:600}}>{p}</span></label>))}
      </div>
      <div style={{fontSize:12,color:C.gray500}}>{Object.values(wp).filter(Boolean).length}/{WAVE_PARAMS.length} selected</div>
    </div>)}
    {tab==="Health Check"&&(<Table cols={[{key:"id",label:"Station",bold:true,mono:true},{key:"name",label:"Name"},{key:"wvht",label:"Hm0 (m)",mono:true},{key:"dpd",label:"Period (s)",mono:true},{key:"cov",label:"Coverage",render:v=><Chip label={v+"%"} color={v>80?"green":v>60?"amber":"red"}/>},{key:"status",label:"Status",render:v=><StatusPill status={v}/>}]}
      rows={ALL_STATIONS.filter(s=>s.type==="active").map(s=>({...s,wvht:seed(s.id.charCodeAt(0),0.5,4.5).toFixed(1),dpd:seed(s.id.charCodeAt(1),5,16).toFixed(1),cov:60+Math.floor(Math.random()*38)}))}/>)}
  </div>);
}
