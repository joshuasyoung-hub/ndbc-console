import { useState } from "react";
import { SectionHeader, Field, DTInput, Btn, Toggle, Table, Tabs, selectStyle } from "../components/ui/index.js";
import { C } from "../theme.js";
import { ERMS_INVENTORY } from "../data/misc.js";

export function EquipmentView(){
  const[tab,setTab]=useState("LRUs");
  const[visit,setVisit]=useState(false);
  const[leader,setLeader]=useState("H. Jenkins (MCC)");
  const[svcDate,setSvcDate]=useState("");
  const[selIdx,setSelIdx]=useState(0);
  const[assets,setAssets]=useState([
    {propNum:"ERMS-9981",partNum:"LRU-SST-V4",serialNum:"SN-882110",pos:"Hull A1",desc:"SST Processing Element",installDate:"03/12/2025",installSDR:"SDR-2026-001",removeDate:"—",removeSDR:"—"},
    {propNum:"ERMS-4512",partNum:"LRU-BARO-2",serialNum:"SN-993021",pos:"Upper Mast",desc:"Barometric Transducer",installDate:"06/18/2025",installSDR:"—",removeDate:"—",removeSDR:"—"},
  ]);

  const install=()=>{
    const src=ERMS_INVENTORY[selIdx];
    if(assets.find(a=>a.propNum===src.propNum)){alert("Already installed.");return;}
    setAssets(a=>[...a,{...src,pos:"Assigned",installDate:svcDate||new Date().toLocaleDateString(),installSDR:"—",removeDate:"—",removeSDR:"—"}]);
  };

  return(<div>
    <SectionHeader title="Equipment Asset Registry" sub="Track LRUs and hardware installed on active marine hulls"/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:10,background:C.navy,color:C.white,padding:12,borderRadius:8,marginBottom:14,fontFamily:C.mono,fontSize:11}}>
      {[["STATION","46402"],["HULL","NMC-3M-24"],["PAYLOAD","PL-4500A"],["STATUS","ACTIVE"],["LOC","PAC-A20P"],["STAGE","INTEGRATED"]].map(([k,v])=>(
        <div key={k}>{k}: <span style={{color:k==="STATUS"?"#22c55e":C.white}}>{v}</span></div>
      ))}
    </div>
    <div style={{background:C.white,border:`1px solid ${C.gray200}`,borderRadius:12,padding:"16px 20px",marginBottom:12}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
        <DTInput label="Service Visit Date" value={svcDate} onChange={setSvcDate}/>
        <Field label="Team Leader">
          <select value={leader} onChange={e=>setLeader(e.target.value)} style={selectStyle}>
            <option>H. Jenkins (MCC)</option>
            <option>K. Holly (OSO)</option>
          </select>
        </Field>
        <div style={{display:"flex",alignItems:"flex-end",paddingBottom:2}}>
          <label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,cursor:"pointer"}}>
            <Toggle on={visit} onClick={()=>setVisit(v=>!v)}/> Official Service Visit
          </label>
        </div>
      </div>
    </div>
    <Tabs tabs={["LRUs","Non-LRUs","Power Systems","Power Types"]} active={tab} onChange={setTab}/>
    {tab==="LRUs"?(<>
      <Table
        cols={[
          {key:"propNum",label:"Property #",mono:true,bold:true},
          {key:"partNum",label:"Part Number",mono:true},
          {key:"serialNum",label:"Serial #",mono:true},
          {key:"pos",label:"Slot"},
          {key:"desc",label:"Description"},
          {key:"installDate",label:"Install Date",mono:true},
          {key:"installSDR",label:"Install SDR",render:v=>v!=="—"
            ?<span style={{color:C.blue,textDecoration:"underline",cursor:"pointer"}} onClick={()=>alert("Loading SDR "+v)}>{v}</span>
            :"—"},
          {key:"removeDate",label:"Removal Date"},
          {key:"removeSDR",label:"Removal SDR"},
        ]}
        rows={assets}
      />
      <div style={{display:"flex",gap:12,marginTop:12,alignItems:"flex-end"}}>
        <Field label="Add from ERMS Inventory" style={{flex:1}}>
          <select value={selIdx} onChange={e=>setSelIdx(+e.target.value)} style={selectStyle}>
            {ERMS_INVENTORY.map((i,idx)=>(
              <option key={idx} value={idx}>[{i.propNum}] {i.partNum} — {i.desc}</option>
            ))}
          </select>
        </Field>
        <Btn variant="primary" onClick={install}>+ Commit to Hull</Btn>
      </div>
    </>):(
      <div style={{padding:32,textAlign:"center",color:C.gray400,background:C.white,border:`1px solid ${C.gray200}`,borderRadius:12}}>
        No {tab} entries yet.
      </div>
    )}
  </div>);
}
