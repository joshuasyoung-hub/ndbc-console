import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Brush
} from "recharts";
import { SectionHeader, Field, Btn, Toggle, Card, CardTitle, selectStyle } from "../components/ui/index.js";
import { C } from "../theme.js";
import { ALL_STATIONS, STATION_SENSORS, SENSOR_SERIES } from "../data/stations.js";
import { PLOT_COLORS } from "../data/misc.js";
import { seed } from "../utils/helpers.js";

export function MultiPlotView(){
  const PARAMS=["PRES","WSPD","WDIR","ATMP","WTMP","WVHT","DPD","BARO"];
  const[series,setSeries]=useState([{loc:"46402",param:"WTMP"},{loc:"46403",param:"WTMP"}]);
  const[showGrid,setShowGrid]=useState(true);const[skipFlagged,setSkip]=useState(false);const[skip9999,setSkip9]=useState(true);const[diffMode,setDiff]=useState(false);const[newLoc,setNewLoc]=useState("46402");const[newParam,setNewParam]=useState("WTMP");
  const addSeries=()=>{if(!series.find(s=>s.loc===newLoc&&s.param===newParam))setSeries(prev=>[...prev,{loc:newLoc,param:newParam}]);};
  const removeSeries=idx=>setSeries(s=>s.filter((_,i)=>i!==idx));
  const chartData=Array.from({length:48},(_,i)=>{
    const t=`${String(Math.floor(i/2)).padStart(2,"0")}:${i%2===0?"00":"30"}`;
    const pt={t};
    series.forEach((s,si)=>{
      const stSensors=STATION_SENSORS[s.loc]||[];
      const sensorObj=stSensors.find(x=>x.param===s.param);
      const stSeries=SENSOR_SERIES[s.loc];
      const seriesData=sensorObj&&stSeries?.[sensorObj.id];
      if(seriesData){const pt2=seriesData[i];if(skipFlagged&&pt2?.flag==="fail")pt[`s${si}`]=null;else if(skip9999&&pt2?.v===9999)pt[`s${si}`]=null;else pt[`s${si}`]=pt2?.v??null;}
      else pt[`s${si}`]=seed(i+si*7,10,30);
    });
    if(diffMode&&series.length>=2)pt["diff"]=Math.abs((pt.s0||0)-(pt.s1||0));
    return pt;
  });
  return(<div>
    <SectionHeader title="Multi-Series Plot" sub="Plot multiple locations and measurements simultaneously with difference overlay and pan/zoom"/>
    <Card style={{marginBottom:14}}>
      <CardTitle>Series Configuration</CardTitle>
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
        {series.map((s,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 10px",background:PLOT_COLORS[i]+"18",border:`1px solid ${PLOT_COLORS[i]}44`,borderRadius:8}}>
          <span style={{width:10,height:10,borderRadius:"50%",background:PLOT_COLORS[i],flexShrink:0}}/>
          <span style={{fontSize:12,fontFamily:C.mono,color:PLOT_COLORS[i],fontWeight:700}}>{s.loc}/{s.param}</span>
          <button onClick={()=>removeSeries(i)} style={{background:"none",border:"none",cursor:"pointer",color:PLOT_COLORS[i],fontSize:14,lineHeight:1}}>×</button>
        </div>))}
      </div>
      <div style={{display:"flex",gap:8,alignItems:"flex-end",flexWrap:"wrap"}}>
        <Field label="Location"><select value={newLoc} onChange={e=>setNewLoc(e.target.value)} style={{...selectStyle,width:120}}>{ALL_STATIONS.filter(s=>s.type==="active").map(s=><option key={s.id} value={s.id}>{s.id}</option>)}</select></Field>
        <Field label="Parameter"><select value={newParam} onChange={e=>setNewParam(e.target.value)} style={{...selectStyle,width:100}}>{PARAMS.map(p=><option key={p}>{p}</option>)}</select></Field>
        <Btn variant="primary" sm onClick={addSeries}>+ Add Series</Btn>
      </div>
    </Card>
    <Card style={{marginBottom:14}}>
      <div style={{display:"flex",gap:20,flexWrap:"wrap",marginBottom:14}}>
        <label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,cursor:"pointer"}}><Toggle on={showGrid} onClick={()=>setShowGrid(v=>!v)}/> Show Grid</label>
        <label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,cursor:"pointer"}}><Toggle on={diffMode} onClick={()=>setDiff(v=>!v)}/> Plot Difference</label>
        <label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,cursor:"pointer"}}><input type="checkbox" checked={skipFlagged} onChange={e=>setSkip(e.target.checked)}/> Skip Flagged Data</label>
        <label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,cursor:"pointer"}}><input type="checkbox" checked={skip9999} onChange={e=>setSkip9(e.target.checked)}/> Skip 9999 Values</label>
      </div>
      <div style={{height:300}}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            {showGrid&&<CartesianGrid strokeDasharray="3 3" stroke={C.gray100}/>}
            <XAxis dataKey="t" tick={{fontSize:9,fill:C.gray400}} interval={7}/>
            <YAxis tick={{fontSize:10,fill:C.gray400}}/>
            <Tooltip contentStyle={{fontSize:12,borderRadius:8,border:`1px solid ${C.gray200}`}}/>
            <Legend/>
            <Brush dataKey="t" height={20} stroke={C.gray300}/>
            {series.map((s,i)=>(<Line key={i} type="monotone" dataKey={`s${i}`} name={`${s.loc}/${s.param}`} stroke={PLOT_COLORS[i]} strokeWidth={2} dot={false} connectNulls={false}/>))}
            {diffMode&&series.length>=2&&<Line type="monotone" dataKey="diff" name="Δ Difference" stroke="#6b7280" strokeWidth={1.5} strokeDasharray="5 3" dot={false}/>}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  </div>);
}
