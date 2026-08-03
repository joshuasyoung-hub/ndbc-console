import { useState } from "react";
import { SectionHeader, StatusPill, Btn, Field, inputStyle, selectStyle } from "../components/ui/index.js";
import { C } from "../theme.js";
import { INITIAL_SDRS } from "../data/misc.js";

export function SDRView(){
  const[logs,setLogs]=useState(INITIAL_SDRS);
  const[selected,setSelected]=useState(INITIAL_SDRS[0]);
  const[showNew,setShowNew]=useState(false);
  const[newSt,setNewSt]=useState("");
  const[newType,setNewType]=useState("Sensor Malfunction");
  const[newSummary,setNewSummary]=useState("");
  const[draft,setDraft]=useState("");

  const create=()=>{
    if(!newSt||!newSummary){alert("All fields required.");return;}
    const rec={id:`SDR-2026-0${logs.length+1}`,station:newSt,date:new Date().toISOString().split("T")[0],type:newType,status:"Open",summary:newSummary,history:[{date:new Date().toISOString().split("T")[0],user:"ConsoleAdmin",text:`SDR Initiated: ${newSummary}`}]};
    setLogs([rec,...logs]);setSelected(rec);setShowNew(false);setNewSt("");setNewSummary("");
  };
  const addUpdate=()=>{
    if(!draft.trim())return;
    const upd={...selected,history:[...selected.history,{date:new Date().toISOString().split("T")[0],user:"ConsoleAdmin",text:draft.trim()}]};
    setLogs(logs.map(l=>l.id===selected.id?upd:l));setSelected(upd);setDraft("");
  };
  const close=()=>{
    const upd={...selected,history:[...selected.history,{date:new Date().toISOString().split("T")[0],user:"ConsoleAdmin",text:"Resolved. Production pipeline certified clean."}],status:"Resolved"};
    setLogs(logs.map(l=>l.id===selected.id?upd:l));setSelected(upd);
  };

  return(<div>
    <SectionHeader title="Station Discrepancy Reports" sub="Log field incidents, track chronological resolution history"/>
    <div style={{display:"grid",gridTemplateColumns:"230px 1fr",border:`1px solid ${C.gray200}`,borderRadius:12,overflow:"hidden",minHeight:440}}>
      <div style={{background:C.gray50,borderRight:`1px solid ${C.gray200}`,display:"flex",flexDirection:"column"}}>
        <div style={{padding:12,borderBottom:`1px solid ${C.gray200}`}}>
          <Btn variant="primary" full sm onClick={()=>setShowNew(true)}>+ New SDR</Btn>
        </div>
        <div style={{flex:1,overflowY:"auto"}}>
          {logs.map(log=>(<div key={log.id} onClick={()=>setSelected(log)} style={{padding:"10px 13px",borderBottom:`1px solid ${C.gray200}`,cursor:"pointer",background:selected?.id===log.id?"#eff6ff":C.white,borderLeft:`3px solid ${selected?.id===log.id?C.blue:"transparent"}`}}>
            <div style={{fontSize:12,fontWeight:700,fontFamily:C.mono,color:"#1e40af"}}>{log.id}</div>
            <div style={{fontSize:11,color:C.gray400,marginTop:2}}>{log.date}</div>
            <div style={{marginTop:4}}><StatusPill status={log.status.toLowerCase()}/></div>
          </div>))}
        </div>
      </div>
      <div style={{background:C.white,padding:18,overflowY:"auto"}}>
        {selected?(<div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
            <Field label="SDR ID"><input value={selected.id} readOnly style={{...inputStyle,fontFamily:C.mono,background:C.gray50}}/></Field>
            <Field label="Station"><input value={selected.station} readOnly style={{...inputStyle,fontFamily:C.mono,background:C.gray50}}/></Field>
            <Field label="Category"><input value={selected.type} readOnly style={{...inputStyle,background:C.gray50}}/></Field>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
            <StatusPill status={selected.status.toLowerCase()}/>
            <span style={{fontSize:11,color:C.gray400,fontFamily:C.mono}}>{selected.date}</span>
          </div>
          <div style={{fontSize:11,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>Activity Timeline</div>
          {selected.history.map((h,i)=>(<div key={i} style={{display:"flex",gap:10,marginBottom:14}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:i===0?C.blue:C.amber,flexShrink:0,marginTop:3}}/>
              {i<selected.history.length-1&&<div style={{width:1.5,flex:1,background:C.gray200,margin:"2px 0"}}/>}
            </div>
            <div style={{flex:1,paddingBottom:4}}>
              <div style={{display:"flex",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                <span style={{fontSize:10,fontWeight:700,padding:"1px 7px",borderRadius:20,background:i===0?"#dbeafe":C.amberLight,color:i===0?C.blueDark:"#713f12"}}>{i===0?"Open Narrative":"Update"}</span>
                <span style={{fontSize:11,color:C.gray400,fontFamily:C.mono}}>{h.date} · {h.user}</span>
              </div>
              <div style={{fontSize:13,background:C.gray50,borderRadius:8,padding:"8px 10px",border:`1px solid ${C.gray200}`}}>{h.text}</div>
            </div>
          </div>))}
          {selected.status!=="Resolved"?(<div style={{display:"flex",gap:8}}>
            <textarea value={draft} onChange={e=>setDraft(e.target.value)} rows={2} placeholder="Add update or technician comment…" style={{...inputStyle,resize:"vertical",flex:1}}/>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              <Btn sm variant="primary" onClick={addUpdate}>+ Update</Btn>
              <Btn sm variant="success" onClick={close}>Resolve</Btn>
            </div>
          </div>):(<div style={{background:C.greenLight,border:`1px solid ${C.green}`,borderRadius:8,padding:"8px 12px",fontSize:12,fontWeight:600,color:"#166534"}}>Incident closed and resolved.</div>)}
        </div>):<div style={{padding:40,textAlign:"center",color:C.gray400}}>Select an SDR to view details.</div>}
      </div>
    </div>
    {showNew&&(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}}>
      <div style={{background:C.white,borderRadius:14,padding:24,maxWidth:420,width:"90%"}}>
        <div style={{fontSize:15,fontWeight:700,color:C.navy,marginBottom:14}}>New Discrepancy Report</div>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
          <Field label="Station ID *"><input value={newSt} onChange={e=>setNewSt(e.target.value)} placeholder="46402" style={inputStyle}/></Field>
          <Field label="Category"><select value={newType} onChange={e=>setNewType(e.target.value)} style={selectStyle}><option>Sensor Malfunction</option><option>Communication Error</option><option>Adrift Alert</option><option>Data Quality</option></select></Field>
          <Field label="Summary *"><textarea value={newSummary} onChange={e=>setNewSummary(e.target.value)} rows={3} style={{...inputStyle,resize:"none"}}/></Field>
        </div>
        <div style={{display:"flex",gap:10}}>
          <Btn variant="primary" full onClick={create}>Submit SDR</Btn>
          <Btn full onClick={()=>setShowNew(false)}>Cancel</Btn>
        </div>
      </div>
    </div>)}
  </div>);
}
