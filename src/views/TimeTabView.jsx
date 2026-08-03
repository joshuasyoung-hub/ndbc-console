import { useState } from "react";
import { SectionHeader, Field, DTInput, Btn, Chip, Card, CardTitle, inputStyle, selectStyle } from "../components/ui/index.js";
import { C } from "../theme.js";
import { ALL_PARAMS, PAYLOAD_MEAS } from "../data/misc.js";

export function TimeTabView(){
  const[stationId,setSt]=useState("46402");const[start,setStart]=useState("");const[stop,setStop]=useState("");const[payloadSel,setPL]=useState("");const[selected,setSel]=useState([]);const[paramSearch,setSearch]=useState("");const[showGaps,setGaps]=useState("no");const[headers,setHeaders]=useState("yes");const[blanks,setBlanks]=useState("no");const[digits,setDigits]=useState("4");
  const searchResults=paramSearch.length>0?ALL_PARAMS.filter(p=>p.toLowerCase().startsWith(paramSearch.toLowerCase())):[];
  const measOptions=payloadSel?(PAYLOAD_MEAS[payloadSel]||[]):[];
  const moveRight=m=>{if(!selected.includes(m))setSel(s=>[...s,m]);};
  const moveLeft=m=>setSel(s=>s.filter(i=>i!==m));
  const drStyle={border:`1px solid ${C.gray200}`,borderRadius:8,height:180,overflowY:"auto",background:C.white};
  return(<div>
    <SectionHeader title="Time Tabulation & Data Archives" sub="Unified parameter search with autocomplete, cascading dropdowns, and export formatting"/>
    <Card style={{marginBottom:14}}>
      <CardTitle>Query Parameters</CardTitle>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
        <Field label="Station ID"><input value={stationId} onChange={e=>setSt(e.target.value)} style={inputStyle}/></Field>
        <DTInput label="Start DateTime" value={start} onChange={setStart}/>
        <DTInput label="Stop DateTime" value={stop} onChange={setStop}/>
      </div>
    </Card>
    <Card style={{marginBottom:14}}>
      <CardTitle>Parameter Search & Cascading Selection</CardTitle>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
        <div>
          <Field label="Find Parameter (e.g. WSPD finds WSPD, WSPD1, WSPD11)">
            <input value={paramSearch} onChange={e=>setSearch(e.target.value)} placeholder="Type parameter root…" style={inputStyle}/>
          </Field>
          {searchResults.length>0&&(<div style={{border:`1px solid ${C.gray200}`,borderRadius:8,marginTop:4,background:C.white}}>{searchResults.map(p=>(<div key={p} onClick={()=>{moveRight(p);setSearch("");}} style={{padding:"6px 12px",fontSize:12,cursor:"pointer",display:"flex",justifyContent:"space-between"}} onMouseEnter={e=>e.currentTarget.style.background=C.gray50} onMouseLeave={e=>e.currentTarget.style.background="transparent"}><span style={{fontFamily:C.mono,fontWeight:600}}>{p}</span><Chip label="Add" color="blue"/></div>))}</div>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <Field label="Payload"><select value={payloadSel} onChange={e=>{setPL(e.target.value);}} style={selectStyle}><option value="">— Select Payload —</option>{Object.keys(PAYLOAD_MEAS).map(p=><option key={p}>{p}</option>)}</select></Field>
          <Field label="Measurement"><select onChange={e=>moveRight(e.target.value)} style={selectStyle} disabled={!payloadSel}><option value="">— Select Meas —</option>{measOptions.map(m=><option key={m}>{m}</option>)}</select></Field>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:10}}>
        <div>
          <div style={{fontSize:11,fontWeight:600,color:C.gray500,textTransform:"uppercase",marginBottom:5}}>Available</div>
          <div style={drStyle}>{ALL_PARAMS.filter(p=>!selected.includes(p)).map(m=>(<div key={m} onClick={()=>moveRight(m)} style={{padding:"5px 10px",fontSize:12,cursor:"pointer",fontFamily:C.mono}} onMouseEnter={e=>e.currentTarget.style.background=C.gray50} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>{m} →</div>))}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",color:C.gray300,fontSize:18}}>⇄</div>
        <div>
          <div style={{fontSize:11,fontWeight:600,color:C.gray500,textTransform:"uppercase",marginBottom:5}}>Selected ({selected.length})</div>
          <div style={{...drStyle,background:"#f0f9ff",border:`1px solid #bae6fd`}}>{selected.map(m=>(<div key={m} onClick={()=>moveLeft(m)} style={{padding:"5px 10px",fontSize:12,cursor:"pointer",fontFamily:C.mono,color:C.blueDark}} onMouseEnter={e=>e.currentTarget.style.background="#dbeafe"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>← {m}</div>))}</div>
        </div>
      </div>
    </Card>
    <Card style={{marginBottom:14}}>
      <CardTitle>Export Formatting Options</CardTitle>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12}}>
        <Field label="Show Data Gaps"><select value={showGaps} onChange={e=>setGaps(e.target.value)} style={selectStyle}><option>no</option><option>yes</option></select></Field>
        <Field label="Include Column Headers"><select value={headers} onChange={e=>setHeaders(e.target.value)} style={selectStyle}><option>yes</option><option>no</option></select></Field>
        <Field label="Replace Blanks with 9999"><select value={blanks} onChange={e=>setBlanks(e.target.value)} style={selectStyle}><option>no</option><option>yes</option></select></Field>
        <Field label="Significant Digits"><select value={digits} onChange={e=>setDigits(e.target.value)} style={selectStyle}>{[2,3,4,5,6].map(d=><option key={d}>{d}</option>)}</select></Field>
      </div>
    </Card>
    <Btn variant="primary" onClick={()=>alert(`Export: Station ${stationId} | ${selected.join(",")} | Gaps:${showGaps} | Headers:${headers} | Digits:${digits}`)}>Export Tabulation</Btn>
  </div>);
}
