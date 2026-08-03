import { useState } from "react";
import { SectionHeader, Table, StatusPill } from "../components/ui/index.js";
import { C } from "../theme.js";
import { COMMS_DATA } from "../data/misc.js";

export function CommsView(){
  const[group,setGroup]=useState("All");const[report,setReport]=useState("Communication Table");
  const GROUPS=["All","ATL","GM","PAC","LAKE","TEST","TAO","DART","CMAN"];
  const rows=COMMS_DATA.filter(r=>group==="All"||r.region===group||r.type.toUpperCase()===group);
  return(<div>
    <SectionHeader title="Communications Summary" sub="Payload group filters, dual-report formats: transmission table and station on/off-station status"/>
    <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:16,flexWrap:"wrap"}}>
      <div style={{display:"flex",gap:0,border:`1px solid ${C.gray200}`,borderRadius:8,overflow:"hidden"}}>
        {GROUPS.map(g=>(<button key={g} onClick={()=>setGroup(g)} style={{padding:"6px 12px",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600,background:group===g?C.navy:C.white,color:group===g?C.white:C.gray500}}>{g}</button>))}
      </div>
      <div style={{marginLeft:"auto",display:"flex",gap:0,border:`1px solid ${C.gray200}`,borderRadius:8,overflow:"hidden"}}>
        {["Communication Table","Station Status Report"].map(r=>(<button key={r} onClick={()=>setReport(r)} style={{padding:"6px 14px",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:12,background:report===r?C.navy:C.white,color:report===r?C.white:C.gray500,fontWeight:report===r?700:400}}>{r}</button>))}
      </div>
    </div>
    {report==="Communication Table"?(<Table cols={[{key:"id",label:"Station",bold:true,mono:true},{key:"name",label:"Name"},{key:"region",label:"Region"},{key:"txOk",label:"Tx OK",mono:true,render:v=><span style={{color:C.green,fontWeight:700}}>{v}</span>},{key:"txFail",label:"Tx Fail",mono:true,render:v=><span style={{color:v>10?C.red:C.gray500}}>{v}</span>},{key:"lastGts",label:"Last GTS"},{key:"rssi",label:"RSSI",mono:true},{key:"onStation",label:"Status",render:v=><StatusPill status={v?"active":"historic"}/>}]} rows={rows}/>):(<Table cols={[{key:"id",label:"Station",bold:true,mono:true},{key:"name",label:"Name"},{key:"region",label:"Region"},{key:"onStation",label:"Station Status",render:v=><span style={{fontWeight:700,fontSize:13,color:v?C.green:C.red}}>{v?"On Station":"Off Station"}</span>}]} rows={rows}/>)}
  </div>);
}
