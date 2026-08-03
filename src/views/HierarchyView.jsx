import { useState } from "react";
import { SectionHeader, Field, DTInput, Btn, inputStyle } from "../components/ui/index.js";
import { C } from "../theme.js";
import { HIERARCHY_INSTRUMENTS } from "../data/misc.js";

export function HierarchyView(){
  const[insts,setInsts]=useState(HIERARCHY_INSTRUMENTS);
  const[start,setStart]=useState("");
  const[pfilter,setPf]=useState("");
  const toggle=(id,f)=>setInsts(i=>i.map(x=>x.id===id?{...x,[f]:!x[f]}:x));
  const allD=insts.every(i=>i.dflag);

  return(<div>
    <SectionHeader title="Hierarchy Swap Utility" sub="Remap instrument H1/H2 assignments and D-Flags. D-Flag rows highlight downstream impacts."/>
    <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap",alignItems:"flex-end"}}>
      <Field label="Payload Filter">
        <input value={pfilter} onChange={e=>setPf(e.target.value)} placeholder="Payload ID…" style={{...inputStyle,width:180,fontFamily:C.mono}}/>
      </Field>
      <Btn variant="primary" sm onClick={()=>alert(`Loaded priorities for ${pfilter||"all"}`)}>Choose Payload</Btn>
      <DTInput label="Start Date" value={start} onChange={setStart} style={{width:220}}/>
      <Btn variant="success" sm onClick={()=>alert("Priority remap committed.")}>OK</Btn>
    </div>
    <div style={{border:`1px solid ${C.gray200}`,borderRadius:12,overflow:"hidden"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
        <thead>
          <tr style={{background:C.gray50}}>
            <th style={{padding:"8px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.04em",borderBottom:`1px solid ${C.gray200}`}}>Instrument</th>
            {["H1","H2"].map(h=>(
              <th key={h} style={{padding:"8px 14px",textAlign:"center",fontSize:11,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.04em",width:80,borderBottom:`1px solid ${C.gray200}`}}>{h}</th>
            ))}
            <th style={{padding:"8px 14px",textAlign:"center",fontSize:11,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.04em",width:90,borderBottom:`1px solid ${C.gray200}`}}>
              <div>D-Flag</div>
              <button onClick={()=>setInsts(i=>i.map(x=>({...x,dflag:!allD})))} style={{display:"block",margin:"3px auto 0",fontSize:10,padding:"1px 6px",borderRadius:4,border:`1px solid ${C.gray300}`,background:C.white,cursor:"pointer"}}>All</button>
            </th>
            <th style={{padding:"8px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.04em",borderBottom:`1px solid ${C.gray200}`}}>What's Affected</th>
          </tr>
        </thead>
        <tbody>
          {insts.map(inst=>(
            <tr key={inst.id} style={{borderTop:`1px solid ${C.gray100}`,background:inst.dflag?"#fff0f0":"transparent",transition:"background .3s"}}>
              <td style={{padding:"9px 14px",fontWeight:500}}>
                <div style={{fontFamily:C.mono,fontSize:10,color:C.gray400}}>{inst.id}</div>
                {inst.name}
              </td>
              <td style={{padding:"9px 14px",textAlign:"center"}}><input type="checkbox" checked={inst.h1} onChange={()=>toggle(inst.id,"h1")} style={{width:15,height:15,cursor:"pointer"}}/></td>
              <td style={{padding:"9px 14px",textAlign:"center"}}><input type="checkbox" checked={inst.h2} onChange={()=>toggle(inst.id,"h2")} style={{width:15,height:15,cursor:"pointer"}}/></td>
              <td style={{padding:"9px 14px",textAlign:"center"}}><input type="checkbox" checked={inst.dflag} onChange={()=>toggle(inst.id,"dflag")} style={{width:15,height:15,cursor:"pointer",accentColor:C.red}}/></td>
              <td style={{padding:"9px 14px",fontSize:11,color:inst.dflag?"#7f1d1d":C.gray500,fontWeight:inst.dflag?600:400,transition:"color .3s"}}>
                {inst.dflag?`⚠ QC chain for "${inst.name}" will re-evaluate on next ingestion`:inst.affected}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>);
}
