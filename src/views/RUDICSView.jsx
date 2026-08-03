import { useState } from "react";
import { SectionHeader, Table, StatusPill, Btn, inputStyle } from "../components/ui/index.js";
import { ALL_STATIONS } from "../data/stations.js";

export function RUDICSView(){
  const[search,setSearch]=useState("");const[activeOnly,setActive]=useState(false);
  const data=ALL_STATIONS.filter(s=>(!activeOnly||s.type==="active")&&(s.id.includes(search)||s.name.toLowerCase().includes(search.toLowerCase())));
  return(<div>
    <SectionHeader title="RUDICS Data Hub" sub="Payload and BPR file management — filterable interface, no Z-naming hacks"/>
    <div style={{display:"flex",gap:10,marginBottom:12,alignItems:"center"}}>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search station…" style={{...inputStyle,width:220}}/>
      <label style={{display:"flex",alignItems:"center",gap:7,fontSize:13,cursor:"pointer"}}><input type="checkbox" checked={activeOnly} onChange={e=>setActive(e.target.checked)}/> Active only</label>
    </div>
    <Table
      cols={[
        {key:"id",label:"Station ID",bold:true,mono:true},
        {key:"name",label:"Name"},
        {key:"region",label:"Region"},
        {key:"hull",label:"Hull"},
        {key:"payload",label:"Payload",mono:true},
        {key:"type",label:"Status",render:v=><StatusPill status={v}/>},
        {key:"id",label:"",render:(_,r)=><Btn sm onClick={()=>alert("Loading files for "+r.id)}>View Files</Btn>},
      ]}
      rows={data}
    />
  </div>);
}
