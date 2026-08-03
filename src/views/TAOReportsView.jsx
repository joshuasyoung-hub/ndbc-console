import { useState } from "react";
import { SectionHeader, StatBox, DTInput, Btn, Chip, Table } from "../components/ui/index.js";
import { C } from "../theme.js";
import { TAO_NODES, TAO_STATUS_META } from "../data/tao.js";
import { fmtNow } from "../utils/helpers.js";

export function TAOReportsView(){
  const[start,setStart]=useState("2026-01-01 00:00");
  const[stop,setStop]=useState(fmtNow());
  const sorted=[...TAO_NODES].sort((a,b)=>a.pct-b.pct);
  return(<div>
    <SectionHeader title="TAO Data Availability Reports" sub="Sensor uptime and expected vs actual reporting with custom date range"/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
      <StatBox label="Total Nodes" value={TAO_NODES.length}/>
      <StatBox label="Healthy ≥80%" value={TAO_NODES.filter(n=>n.status==="green").length} color={C.green}/>
      <StatBox label="Degraded 60-79%" value={TAO_NODES.filter(n=>n.status==="yellow").length} color={C.amber}/>
      <StatBox label="Poor <60%" value={TAO_NODES.filter(n=>["red","red-t","orange-d"].includes(n.status)).length} color={C.red}/>
    </div>
    <div style={{display:"flex",gap:12,marginBottom:14,alignItems:"flex-end"}}>
      <DTInput label="Start" value={start} onChange={setStart}/>
      <DTInput label="Stop"  value={stop}  onChange={setStop}/>
      <Btn variant="primary" sm onClick={()=>alert(`Calculating ${start} → ${stop}`)}>Calculate</Btn>
    </div>
    <Table
      cols={[
        {key:"id",label:"Node",bold:true,mono:true},
        {key:"pct",label:"Coverage",render:v=>(
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:70,height:6,background:C.gray100,borderRadius:3,overflow:"hidden"}}>
              <div style={{width:`${v}%`,height:"100%",background:v>=80?C.green:v>=60?C.amber:C.red}}/>
            </div>
            <span style={{fontSize:12}}>{v}%</span>
          </div>
        )},
        {key:"status",label:"Status",render:v=>{
          const m=TAO_STATUS_META[v];
          return <Chip label={m?.label||v} color={v==="green"?"green":v==="yellow"?"amber":"red"}/>;
        }},
        {key:"deploy",label:"Deployed"},
        {key:"last",label:"Last Report"},
      ]}
      rows={sorted}
    />
  </div>);
}
