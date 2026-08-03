import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { SectionHeader, StatusPill, Chip, Btn, Table, Card, CardTitle, Field, DTInput, Tabs, inputStyle, selectStyle } from "../components/ui/index.js";
import { C } from "../theme.js";
import { ALL_STATIONS, STATION_SENSORS, SENSOR_SERIES } from "../data/stations.js";
import { ERMS_INVENTORY } from "../data/misc.js";

const ENG_TYPE_BADGE={active:{bg:C.greenLight,color:"#166534"},historic:{bg:C.gray100,color:C.gray500},testing:{bg:C.purpleLight,color:C.purple}};

export function EngineeringView(){
  const[typeFilter,setType]=useState("all");
  const[search,setSearch]=useState("");
  const[selectedSt,setStation]=useState(null);
  const[selectedSens,setSensor]=useState(null);
  const[sensTab,setSensTab]=useState("Data");
  const[qcFlag,setQcFlag]=useState("pass");
  const[qcComment,setQcComment]=useState("");
  const[qcDone,setQcDone]=useState(false);
  const[rfStart,setRfStart]=useState("");
  const[rfStop,setRfStop]=useState("");
  const[rfFlag,setRfFlag]=useState("fail");
  const[rfComment,setRfComment]=useState("");
  const[rfDone,setRfDone]=useState(false);
  const[engTab,setEngTab]=useState("Stations");

  const stations=ALL_STATIONS.filter(s=>(typeFilter==="all"||s.type===typeFilter)&&(search===""||s.id.toLowerCase().includes(search.toLowerCase())||s.name.toLowerCase().includes(search.toLowerCase())));
  const btnSt=(active,danger)=>({flex:1,padding:"9px 0",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer",border:active?`2px solid ${danger?C.red:C.green}`:`1px solid ${C.gray200}`,background:active?(danger?C.redLight:C.greenLight):C.gray50,color:active?(danger?"#991b1b":"#166534"):C.gray500});
  const submitQc=()=>{if(!qcComment.trim()){alert("Comment required.");return;}setQcDone(true);setTimeout(()=>{setQcDone(false);setQcComment("");},3000);};
  const submitRf=()=>{if(!rfStart||!rfStop||!rfComment.trim()){alert("All fields required.");return;}setRfDone(true);setTimeout(()=>{setRfDone(false);setRfComment("");setRfStart("");setRfStop("");},3000);};

  if(selectedSens&&selectedSt){
    const s=selectedSens;
    const ser=SENSOR_SERIES[selectedSt.id]?.[s.id]||[];
    const fl=ser.filter(d=>d.flag==="fail");
    return(<div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
        <Btn sm onClick={()=>{setSensor(null);setSensTab("Data");}}>← Back to {selectedSt.id}</Btn>
        <span style={{color:C.gray300}}>/</span>
        <span style={{fontSize:14,fontWeight:700,color:C.navy}}>{s.name}</span>
        <StatusPill status={s.status}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:16,alignItems:"start"}}>
        <Card>
          <div style={{fontSize:13,fontWeight:700,color:C.navy,marginBottom:3}}>{s.name}</div>
          <div style={{fontSize:11,color:C.gray400,fontFamily:C.mono,marginBottom:10}}>{s.id} · {s.param}</div>
          <StatusPill status={s.status}/>
          <div style={{marginTop:14}}>
            {[["Parameter",s.param],["Unit",s.unit],["Elevation",`${s.elev} m`],["Hierarchy",`Level ${s.hier}`],["Valid Range",`${s.range[0]}–${s.range[1]} ${s.unit}`],["Last Value",s.lastVal!=null?`${s.lastVal} ${s.unit}`:"No data"],["Last Report",s.lastTime]].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"5px 0",borderBottom:`1px solid ${C.gray100}`}}>
                <span style={{color:C.gray500}}>{k}</span><span style={{fontWeight:500}}>{v}</span>
              </div>
            ))}
          </div>
        </Card>
        <div style={{background:C.white,border:`1px solid ${C.gray200}`,borderRadius:12,overflow:"hidden"}}>
          <div style={{borderBottom:`1px solid ${C.gray200}`,padding:"0 4px"}}>
            <Tabs tabs={["Data","QC Flag","Range Flag"]} active={sensTab} onChange={setSensTab}/>
          </div>
          <div style={{padding:"0 20px 20px"}}>
            {sensTab==="Data"&&(<div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,marginTop:4}}>
                <div style={{fontSize:13,fontWeight:600,color:C.navy}}>{s.name} — last 48 obs</div>
                <Chip label={`${fl.length} flagged`} color={fl.length>0?"red":"green"}/>
              </div>
              <div style={{height:220}}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ser}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.gray100}/>
                    <XAxis dataKey="t" tick={{fontSize:9,fill:C.gray400}} interval={7}/>
                    <YAxis tick={{fontSize:10,fill:C.gray400}} unit={` ${s.unit}`} width={52} domain={["auto","auto"]}/>
                    <Tooltip contentStyle={{fontSize:12,borderRadius:8,border:`1px solid ${C.gray200}`}}/>
                    <Line type="monotone" dataKey="v" stroke={C.navy} strokeWidth={2}
                      dot={props=>props.payload.flag==="fail"
                        ?<circle key={`f${props.index}`} cx={props.cx} cy={props.cy} r={4} fill={C.red} stroke={C.white} strokeWidth={1.5}/>
                        :<circle key={`p${props.index}`} cx={props.cx} cy={props.cy} r={0}/>}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
              {fl.length>0&&fl.map(d=>(<div key={d.t} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 10px",background:C.redLight,border:`1px solid #fecaca`,borderRadius:7,marginBottom:5,marginTop:8}}>
                <span style={{fontSize:12,fontFamily:C.mono,color:"#7f1d1d"}}>{d.t}</span>
                <span style={{fontSize:12,color:"#7f1d1d"}}>{d.v} {s.unit}</span>
                <Chip label="FAIL" color="red"/>
              </div>))}
            </div>)}
            {sensTab==="QC Flag"&&(<div style={{maxWidth:420,paddingTop:4}}>
              <p style={{fontSize:12,color:C.gray500,marginBottom:16,lineHeight:1.5}}>Apply a Pass or Fail flag to this sensor's current record. A comment is required.</p>
              {qcDone&&<div style={{background:C.greenLight,border:`1px solid ${C.green}`,borderRadius:8,padding:"10px 14px",fontSize:12,fontWeight:600,color:"#166534",marginBottom:12}}>Flag submitted successfully.</div>}
              <div style={{display:"flex",gap:8,marginBottom:14}}>
                <button onClick={()=>setQcFlag("pass")} style={btnSt(qcFlag==="pass",false)}>Pass</button>
                <button onClick={()=>setQcFlag("fail")} style={btnSt(qcFlag==="fail",true)}>Fail</button>
              </div>
              <Field label="Inspector Comment *" style={{marginBottom:14}}>
                <textarea value={qcComment} onChange={e=>setQcComment(e.target.value)} rows={3}
                  placeholder="Describe the quality issue or reason for this flag…"
                  style={{width:"100%",border:`1px solid ${qcComment?C.gray200:"#fca5a5"}`,borderRadius:8,padding:"8px 10px",fontSize:13,resize:"vertical",fontFamily:"inherit",boxSizing:"border-box"}}/>
              </Field>
              <Btn variant={qcFlag==="pass"?"success":"danger"} full onClick={submitQc}>Submit {qcFlag==="pass"?"Pass":"Fail"} Flag</Btn>
            </div>)}
            {sensTab==="Range Flag"&&(<div style={{maxWidth:480,paddingTop:4}}>
              <p style={{fontSize:12,color:C.gray500,marginBottom:16,lineHeight:1.5}}>Flag all observations in a time window. All fields required.</p>
              {rfDone&&<div style={{background:C.greenLight,border:`1px solid ${C.green}`,borderRadius:8,padding:"10px 14px",fontSize:12,fontWeight:600,color:"#166534",marginBottom:12}}>Range flag applied: {rfStart} → {rfStop} — {rfFlag.toUpperCase()}.</div>}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                <DTInput label="Start DateTime" value={rfStart} onChange={setRfStart}/>
                <DTInput label="Stop DateTime"  value={rfStop}  onChange={setRfStop}/>
              </div>
              <div style={{display:"flex",gap:8,marginBottom:12}}>
                <button onClick={()=>setRfFlag("pass")} style={btnSt(rfFlag==="pass",false)}>Pass</button>
                <button onClick={()=>setRfFlag("fail")} style={btnSt(rfFlag==="fail",true)}>Fail</button>
              </div>
              <Field label="Comment *" style={{marginBottom:12}}>
                <textarea value={rfComment} onChange={e=>setRfComment(e.target.value)} rows={3}
                  placeholder="Reason for flagging this date range…"
                  style={{width:"100%",border:`1px solid ${rfComment?C.gray200:"#fca5a5"}`,borderRadius:8,padding:"8px 10px",fontSize:13,resize:"vertical",fontFamily:"inherit",boxSizing:"border-box"}}/>
              </Field>
              <Btn variant={rfFlag==="pass"?"success":"danger"} full onClick={submitRf}>Apply Range Flag</Btn>
            </div>)}
          </div>
        </div>
      </div>
    </div>);
  }

  if(selectedSt){
    const sensors=STATION_SENSORS[selectedSt.id]||[];
    const b=ENG_TYPE_BADGE[selectedSt.type];
    const faults=sensors.filter(s=>s.status==="fault").length;
    const degraded=sensors.filter(s=>s.status==="degraded").length;
    return(<div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:18}}>
        <Btn sm onClick={()=>setStation(null)}>← All Stations</Btn>
        <span style={{color:C.gray300}}>/</span>
        <span style={{fontSize:15,fontWeight:700,color:C.navy,fontFamily:C.mono}}>{selectedSt.id}</span>
        <span style={{color:C.gray500,fontSize:13}}>{selectedSt.name}</span>
        <Chip label={selectedSt.type.charAt(0).toUpperCase()+selectedSt.type.slice(1)} color={selectedSt.type==="active"?"green":selectedSt.type==="testing"?"blue":"gray"}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"280px 1fr",gap:14,marginBottom:14}}>
        <Card>
          <CardTitle>Buoy Information</CardTitle>
          {[["Station ID",selectedSt.id],["Name",selectedSt.name],["Type",selectedSt.type],["Hull",selectedSt.hull],["Latitude",`${selectedSt.lat}°N`],["Longitude",`${Math.abs(selectedSt.lon)}°W`],["Depth",`${selectedSt.depth} m`],["Deployed",selectedSt.deployed],["Payload",selectedSt.payload],["Program",selectedSt.program]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"5px 0",borderBottom:`1px solid ${C.gray100}`}}>
              <span style={{color:C.gray500}}>{k}</span>
              <span style={{fontWeight:500,fontFamily:k==="Station ID"||k==="Payload"?C.mono:"inherit"}}>{v}</span>
            </div>
          ))}
        </Card>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Card>
            <CardTitle>Sensor Health Summary</CardTitle>
            <div style={{display:"flex",gap:24}}>
              {[["Total",sensors.length,C.navy],["Active",sensors.filter(s=>s.status==="active").length,C.green],["Fault",faults,C.red],["Degraded",degraded,C.amber],["Historic",sensors.filter(s=>s.status==="historic").length,C.gray400]].map(([l,v,col])=>(
                <div key={l} style={{textAlign:"center"}}>
                  <div style={{fontSize:22,fontWeight:700,color:col}}>{v}</div>
                  <div style={{fontSize:11,color:C.gray500}}>{l}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardTitle>Quick Actions</CardTitle>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <Btn sm variant="primary" onClick={()=>alert("Releasing data to downstream models.")}>Release Data</Btn>
              <Btn sm variant="danger"  onClick={()=>alert("Data flagged and halted.")}>Stop / Flag Data</Btn>
              <Btn sm onClick={()=>alert("Position propagated to ingestion models.")}>Update Position</Btn>
            </div>
          </Card>
        </div>
      </div>
      <Card>
        <CardTitle>Sensors — click a row to inspect data and apply QC flags</CardTitle>
        <Table
          cols={[{key:"id",label:"ID",mono:true,bold:true},{key:"name",label:"Name"},{key:"param",label:"Param",mono:true},{key:"unit",label:"Unit"},{key:"elev",label:"Elevation",render:v=>`${v} m`},{key:"hier",label:"Hier",render:v=>`H${v}`},{key:"lastVal",label:"Last Value",render:(v,r)=>v!=null?`${v} ${r.unit}`:"—",mono:true},{key:"lastTime",label:"Last Report"},{key:"status",label:"Status",render:v=><StatusPill status={v}/>}]}
          rows={sensors}
          onRow={s=>{setSensor(s);setSensTab("Data");}}
        />
      </Card>
    </div>);
  }

  return(<div>
    <SectionHeader title="Engineering — Station Browser" sub="Browse all stations: active, historic, and test. Click a station to inspect sensors, view data, and apply QC flags."/>
    <Tabs tabs={["Stations","Component Search"]} active={engTab} onChange={setEngTab}/>
    {engTab==="Component Search"?(<div>
      <Field label="Search by Serial Number or Property Number" style={{marginBottom:14}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="e.g. SN-882110 or ERMS-9981" style={inputStyle}/>
      </Field>
      <Table
        cols={[{key:"propNum",label:"Property #",mono:true,bold:true},{key:"partNum",label:"Part Number",mono:true},{key:"serialNum",label:"Serial #",mono:true},{key:"desc",label:"Description"}]}
        rows={ERMS_INVENTORY.filter(i=>!search||i.serialNum.toLowerCase().includes(search.toLowerCase())||i.propNum.toLowerCase().includes(search.toLowerCase()))}
      />
    </div>):(<div>
      <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by ID or name…" style={{...inputStyle,width:220}}/>
        <div style={{display:"flex",gap:0,border:`1px solid ${C.gray200}`,borderRadius:8,overflow:"hidden"}}>
          {["all","active","historic","testing"].map(t=>(
            <button key={t} onClick={()=>setType(t)} style={{padding:"7px 14px",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:12,background:typeFilter===t?C.navy:C.white,color:typeFilter===t?C.white:C.gray500,fontWeight:typeFilter===t?700:400}}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
          ))}
        </div>
        <span style={{fontSize:12,color:C.gray400}}>{stations.length} station{stations.length!==1?"s":""}</span>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {stations.map(st=>{
          const b=ENG_TYPE_BADGE[st.type];
          const sens=STATION_SENSORS[st.id]||[];
          const faults=sens.filter(s=>s.status==="fault").length;
          const degraded=sens.filter(s=>s.status==="degraded").length;
          return(<div key={st.id} onClick={()=>setStation(st)} style={{background:C.white,border:`1px solid ${C.gray200}`,borderRadius:12,padding:"14px 20px",cursor:"pointer",display:"grid",gridTemplateColumns:"120px 1fr auto",gap:14,alignItems:"center"}}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 2px 10px rgba(0,0,0,.06)";e.currentTarget.style.borderColor=C.gray300;}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor=C.gray200;}}>
            <div>
              <div style={{fontSize:15,fontWeight:700,fontFamily:C.mono,color:C.navy,marginBottom:4}}>{st.id}</div>
              <span style={{fontSize:11,fontWeight:600,background:b.bg,color:b.color,borderRadius:20,padding:"2px 8px"}}>{st.type.charAt(0).toUpperCase()+st.type.slice(1)}</span>
            </div>
            <div>
              <div style={{fontSize:13,fontWeight:500,color:C.navy,marginBottom:3}}>{st.name}</div>
              <div style={{fontSize:12,color:C.gray500}}>{st.hull} · {st.lat}°N, {Math.abs(st.lon)}°W · {st.depth} m</div>
              <div style={{fontSize:12,color:C.gray500,marginTop:2}}>{sens.length} sensors · Deployed {st.deployed} · {st.program}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
              <span style={{color:C.gray300,fontSize:14}}>›</span>
              <div style={{display:"flex",gap:5}}>
                {faults>0&&<Chip label={`${faults} fault`} color="red"/>}
                {degraded>0&&<Chip label={`${degraded} degraded`} color="amber"/>}
                {faults===0&&degraded===0&&st.type==="active"&&<Chip label="All nominal" color="green"/>}
              </div>
            </div>
          </div>);
        })}
        {stations.length===0&&<div style={{padding:32,textAlign:"center",color:C.gray400,fontSize:13,background:C.white,border:`1px solid ${C.gray200}`,borderRadius:12}}>No stations match the current filter.</div>}
      </div>
    </div>)}
  </div>);
}
