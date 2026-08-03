import { useState, useEffect, Fragment } from "react";
import { SectionHeader, Field, DTInput, Btn, Toggle, Chip, Accordion, Table, selectStyle, inputStyle } from "../components/ui/index.js";
import { C } from "../theme.js";
import { decToDMS, fmtNow } from "../utils/helpers.js";

const STEPS_NDBC=["Location","Station","Payload","Suites","Meas","Waves","Position","Admin"];
const STEPS_PARTNER=["Location","Payload","Suites","Meas","Waves","Position","Admin"];

export function WizardView(){
  const[step,setStep]=useState(0);
  const[isPartner,setIsPartner]=useState(false);
  const[pushed,setPushed]=useState(false);
  const[pushing,setPushing]=useState(false);
  const[txLog,setTxLog]=useState([]);
  const[form,setForm]=useState({
    locId:"PAC-A20P",siteName:"South Dutch Harbor",elevation:"4715.2",bufferFmt:"",
    program:"Moored Buoy",ndbcStation:true,reportWeekly:false,
    dateEst:"",dateDis:"",contactName:"",contactNum:"",
    stationId:"46402",hullId:"NMC-3M-24",magBey:"0.01229",magBez:"-0.04412",serviceDate:"",notes:"",
    payloadId:"PL-4500A",stormRelease:false,siSat:"GOES-West",swRev:"NEMIS-V4.12",baud:"9600",
    asciiId:"WX-4500",scalingMethod:"Linear",coeffs:["0.0012","1.022","-0.00004","0.0","0.0","0.0"],
    platformType:"NMC-3M-24",waterDepth:"4715.0",
    latDec:"52.8310",lonDec:"-168.2345",latDms:"",lonDms:"",mooringType:"Taut Deep Sea",watchCircle:"3500",gpsInstalled:true,
    adminUser:"mcc_admin",adminSig:"CERT-2026",
    suitesList:[{suiteId:"SUITE-MET-A",desc:"Standard Meteorological Telemetry",status:"Active"},{suiteId:"SUITE-WAVE-ADV",desc:"Directional Spectral Wave Processing",status:"Active"}],
  });
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const STEPS=isPartner?STEPS_PARTNER:STEPS_NDBC;
  const curStep=STEPS[step];
  useEffect(()=>{if(step>STEPS.length-1)setStep(STEPS.length-1);},[STEPS.length,step]);

  const updateCoord=(k,v,isLat)=>{
    set(k,v);
    const dms=decToDMS(parseFloat(v),isLat);
    set(k==="latDec"?"latDms":"lonDms",dms?`${dms}` :"");
  };
  const push=()=>{
    setPushing(true);
    setTimeout(()=>{
      setPushing(false);setPushed(true);
      setTxLog(l=>[...l,{t:new Date().toLocaleTimeString(),st:form.stationId||"NEW",user:form.adminUser}]);
    },1800);
  };

  const g2={display:"grid",gridTemplateColumns:"1fr 1fr",gap:12};
  const g3={display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12};

  return(<div>
    <SectionHeader title="Station Setup Wizard" sub="Configure and commit a new station deployment to NEMIS"/>
    {/* Step breadcrumb */}
    <div style={{display:"flex",alignItems:"center",overflowX:"auto",gap:0,background:C.white,border:`1px solid ${C.gray200}`,borderRadius:12,padding:"10px 16px",marginBottom:14}}>
      {STEPS.map((s,i)=>(<Fragment key={s}>
        {i>0&&<div style={{width:16,height:0.5,background:C.gray200,flexShrink:0}}/>}
        <button onClick={()=>setStep(i)} style={{display:"flex",alignItems:"center",gap:5,background:"none",border:"none",cursor:"pointer",padding:0,flexShrink:0}}>
          <div style={{width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0,border:`1.5px solid ${i<step?C.green:i===step?C.blue:C.gray300}`,background:i<step?C.greenLight:i===step?C.blueLight:"transparent",color:i<step?"#166534":i===step?C.blueDark:C.gray400}}>
            {i<step?"✓":i+1}
          </div>
          <span style={{fontSize:11,whiteSpace:"nowrap",fontWeight:i===step?600:400,color:i===step?C.navy:i<step?C.green:C.gray400}}>{s}</span>
        </button>
      </Fragment>))}
    </div>
    {isPartner&&<div style={{background:C.amberLight,border:`1px solid ${C.amber}`,borderRadius:8,padding:"7px 14px",marginBottom:12,fontSize:12,color:"#713f12"}}>Partner Buoy: Station step skipped. 7-step workflow active.</div>}
    <div style={{background:C.white,border:`1px solid ${C.gray200}`,borderRadius:12,padding:"16px 20px",minHeight:300}}>
      {curStep==="Location"&&(<div>
        <div style={{...g2,marginBottom:14}}>
          <div onClick={()=>{setIsPartner(false);set("ndbcStation",true);}} style={{border:`2px solid ${!isPartner?C.green:C.gray200}`,borderRadius:10,padding:14,cursor:"pointer",background:!isPartner?C.greenLight:C.white}}>
            <div style={{fontWeight:700,color:!isPartner?C.green:C.gray700,marginBottom:3}}>NDBC Buoy — 8 steps</div>
            <div style={{fontSize:11,color:C.gray500}}>Includes Station and Waves steps.</div>
            {!isPartner&&<Chip label="Selected" color="green"/>}
          </div>
          <div onClick={()=>{setIsPartner(true);set("ndbcStation",false);}} style={{border:`2px solid ${isPartner?C.blue:C.gray200}`,borderRadius:10,padding:14,cursor:"pointer",background:isPartner?C.blueLight:C.white}}>
            <div style={{fontWeight:700,color:isPartner?C.blue:C.gray700,marginBottom:3}}>Partner Buoy — 7 steps</div>
            <div style={{fontSize:11,color:C.gray500}}>Station step skipped.</div>
            {isPartner&&<Chip label="Selected" color="blue"/>}
          </div>
        </div>
        <div style={{...g3,marginBottom:12}}>
          <Field label="Location ID"><input value={form.locId} onChange={e=>set("locId",e.target.value)} style={inputStyle}/></Field>
          <Field label="Site Name"><input value={form.siteName} onChange={e=>set("siteName",e.target.value)} style={inputStyle}/></Field>
          <Field label="Elevation (m)"><input value={form.elevation} onChange={e=>set("elevation",e.target.value)} style={inputStyle}/></Field>
        </div>
        <div style={{...g3,marginBottom:12}}>
          <Field label="Program Classification">
            <select value={form.program} onChange={e=>set("program",e.target.value)} style={selectStyle}>
              {["CMAN","Drifting Buoy","Moored Buoy","Unmanned Vessel","UMS"].map(p=><option key={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Contact Name"><input value={form.contactName} onChange={e=>set("contactName",e.target.value)} style={inputStyle}/></Field>
          <Field label="Contact Number"><input value={form.contactNum} onChange={e=>set("contactNum",e.target.value)} style={inputStyle}/></Field>
        </div>
        <div style={{...g2,marginBottom:12}}>
          <DTInput label="Date Established" value={form.dateEst} onChange={v=>set("dateEst",v)}/>
          <DTInput label="Date Disestablished" value={form.dateDis} onChange={v=>set("dateDis",v)}/>
        </div>
        <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
          <label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,cursor:"pointer"}}>
            <Toggle on={form.ndbcStation} onClick={()=>{set("ndbcStation",!form.ndbcStation);setIsPartner(form.ndbcStation);}}/> NDBC Station
          </label>
          <label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,cursor:"pointer",opacity:["Weather","CMAN"].includes(form.program)?1:0.4}}>
            <input type="checkbox" checked={form.reportWeekly} disabled={!["Weather","CMAN"].includes(form.program)} onChange={e=>set("reportWeekly",e.target.checked)}/> Report Weekly Stats
          </label>
        </div>
      </div>)}

      {curStep==="Station"&&(<div>
        <div style={{...g3,marginBottom:12}}>
          <Field label="Station ID"><input value={form.stationId} onChange={e=>set("stationId",e.target.value)} style={inputStyle}/></Field>
          <Field label="Hull ID"><input value={form.hullId} onChange={e=>set("hullId",e.target.value)} style={inputStyle}/></Field>
          <DTInput label="Service Date" value={form.serviceDate} onChange={v=>set("serviceDate",v)}/>
        </div>
        <Accordion title="Advanced Calibration Parameters">
          <div style={{...g2}}>
            <Field label="Mag BEY"><input value={form.magBey} onChange={e=>set("magBey",e.target.value)} style={inputStyle}/></Field>
            <Field label="Mag BEZ"><input value={form.magBez} onChange={e=>set("magBez",e.target.value)} style={inputStyle}/></Field>
          </div>
        </Accordion>
        <Field label="General Notes"><textarea value={form.notes} onChange={e=>set("notes",e.target.value)} rows={3} style={{...inputStyle,resize:"vertical"}}/></Field>
      </div>)}

      {curStep==="Payload"&&(<div>
        <div style={{...g2,marginBottom:12}}>
          <Field label="Payload Module ID"><input value={form.payloadId} onChange={e=>set("payloadId",e.target.value)} style={inputStyle}/></Field>
          <div style={{background:form.stormRelease?"#fff7ed":C.gray50,padding:12,borderRadius:8,border:`1px solid ${form.stormRelease?"#fed7aa":C.gray200}`}}>
            <label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,fontWeight:700,color:form.stormRelease?"#ea580c":C.gray700,cursor:"pointer"}}>
              <Toggle on={form.stormRelease} onClick={()=>set("stormRelease",!form.stormRelease)} warn/> Storm Release
            </label>
            {form.stormRelease&&<div style={{fontSize:11,color:"#ea580c",marginTop:6}}>Armed — confirm intent before next tx cycle.</div>}
          </div>
        </div>
        <div style={{...g3}}>
          <Field label="Satellite"><select value={form.siSat} onChange={e=>set("siSat",e.target.value)} style={selectStyle}>{["GOES-West","GOES-East","Iridium","Argos"].map(o=><option key={o}>{o}</option>)}</select></Field>
          <Field label="Software Rev"><input value={form.swRev} onChange={e=>set("swRev",e.target.value)} style={inputStyle}/></Field>
          <Field label="Baud Rate"><select value={form.baud} onChange={e=>set("baud",e.target.value)} style={selectStyle}>{["300","600","1200","9600","19200"].map(o=><option key={o}>{o}</option>)}</select></Field>
        </div>
      </div>)}

      {curStep==="Suites"&&(<div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <span style={{fontSize:13,fontWeight:600,color:C.navy}}>Sensor Suite Configuration</span>
          <Btn sm variant="primary" onClick={()=>set("suitesList",[...form.suitesList,{suiteId:"SUITE-NEW",desc:"",status:"Pending"}])}>+ Add Suite Row</Btn>
        </div>
        <Table
          cols={[{key:"suiteId",label:"Suite ID",mono:true,bold:true},{key:"desc",label:"Description"},{key:"status",label:"Status"}]}
          rows={form.suitesList}
        />
      </div>)}

      {curStep==="Meas"&&(<div>
        <div style={{...g2,marginBottom:12}}>
          <Field label="ASCII ID">
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <select value={form.asciiId} onChange={e=>set("asciiId",e.target.value)} style={{...selectStyle,flex:1}}>
                <option>WX-4500</option><option>WX-4501</option><option>BP-1122</option>
              </select>
              <span style={{width:10,height:10,borderRadius:"50%",background:form.asciiId==="WX-4500"?C.green:C.amber,flexShrink:0}}/>
            </div>
          </Field>
          <Field label="Scaling Method">
            <select value={form.scalingMethod} onChange={e=>set("scalingMethod",e.target.value)} style={selectStyle}>
              {["Linear","Polynomial","Logarithmic"].map(m=><option key={m}>{m}</option>)}
            </select>
          </Field>
        </div>
        <div style={{fontSize:11,fontWeight:700,color:C.gray500,textTransform:"uppercase",marginBottom:8}}>Scaling Coefficients (C1–C6)</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8}}>
          {form.coeffs.map((c,i)=>(
            <Field key={i} label={`C${i+1}`}>
              <input value={c} onChange={e=>{const nc=[...form.coeffs];nc[i]=e.target.value;set("coeffs",nc);}} style={{...inputStyle,fontFamily:C.mono,textAlign:"center"}}/>
            </Field>
          ))}
        </div>
      </div>)}

      {curStep==="Waves"&&(<div style={{...g2}}>
        <Field label="Platform Type (auto from Hull)"><input value={form.platformType} readOnly style={{...inputStyle,background:C.gray50}}/></Field>
        <Field label="Water Depth (m)"><input value={form.waterDepth} onChange={e=>set("waterDepth",e.target.value)} style={{...inputStyle,border:`1.5px solid ${C.green}`}}/></Field>
      </div>)}

      {curStep==="Position"&&(<div>
        <div style={{...g2,marginBottom:12}}>
          <div>
            <Field label="Latitude (decimal °)"><input value={form.latDec} onChange={e=>updateCoord("latDec",e.target.value,true)} style={inputStyle}/></Field>
            <div style={{fontSize:11,color:C.blue,marginTop:4,fontFamily:C.mono}}>{form.latDms||"Enter decimal degrees"}</div>
          </div>
          <div>
            <Field label="Longitude (decimal °)"><input value={form.lonDec} onChange={e=>updateCoord("lonDec",e.target.value,false)} style={inputStyle}/></Field>
            <div style={{fontSize:11,color:C.blue,marginTop:4,fontFamily:C.mono}}>{form.lonDms||"Enter decimal degrees"}</div>
          </div>
        </div>
        <div style={{...g3}}>
          <Field label="Mooring Type">
            <select value={form.mooringType} onChange={e=>set("mooringType",e.target.value)} style={selectStyle}>
              {["Taut Deep Sea","Fixed Moored","Drifting","DART","Coastal Platform"].map(m=><option key={m}>{m}</option>)}
            </select>
          </Field>
          <Field label="Watch Circle (yds)"><input value={form.watchCircle} onChange={e=>set("watchCircle",e.target.value)} style={inputStyle}/></Field>
          <div style={{display:"flex",alignItems:"flex-end",paddingBottom:2}}>
            <label style={{display:"flex",alignItems:"center",gap:7,fontSize:13,cursor:"pointer"}}><Toggle on={form.gpsInstalled} onClick={()=>set("gpsInstalled",!form.gpsInstalled)}/> GPS Installed</label>
          </div>
        </div>
      </div>)}

      {curStep==="Admin"&&(<div>
        <div style={{...g2,marginBottom:16}}>
          <Field label="Admin Username"><input value={form.adminUser} onChange={e=>set("adminUser",e.target.value)} style={inputStyle}/></Field>
          <Field label="DO Signature / Approval"><input value={form.adminSig} onChange={e=>set("adminSig",e.target.value)} style={inputStyle}/></Field>
        </div>
        {!pushed?(
          <button onClick={push} disabled={pushing} style={{width:"100%",padding:"13px 0",borderRadius:10,border:"none",fontSize:15,fontWeight:800,cursor:pushing?"wait":"pointer",background:pushing?C.gray400:C.green,color:C.white}}>
            {pushing?"Committing to database…":"Approve & Push Code to Production Database"}
          </button>
        ):(
          <div style={{background:C.greenLight,border:`1px solid ${C.green}`,borderRadius:10,padding:14}}>
            <div style={{fontWeight:700,color:"#166534",fontSize:14,marginBottom:8}}>Station committed successfully.</div>
            <div style={{background:"#0d1117",borderRadius:8,padding:"10px 12px",fontFamily:C.mono,fontSize:11,color:"#adbac7",maxHeight:120,overflowY:"auto"}}>
              {txLog.map((t,i)=>(<div key={i}><span style={{color:"#6e7681"}}>{t.t}</span>  <span style={{color:"#3fb950"}}>✓</span> Station {t.st} pushed by {t.user}</div>))}
            </div>
          </div>
        )}
      </div>)}
    </div>

    <div style={{display:"flex",justifyContent:"space-between",marginTop:12,alignItems:"center"}}>
      <Btn onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0}>← Back</Btn>
      <span style={{fontSize:12,color:C.gray400}}>Step {step+1} of {STEPS.length}</span>
      <Btn variant="primary" onClick={()=>setStep(s=>Math.min(STEPS.length-1,s+1))} disabled={step===STEPS.length-1}>Next →</Btn>
    </div>
  </div>);
}
