import { useState, useCallback } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceArea, ReferenceLine,
} from "recharts";
import { C } from "../theme.js";
import { ALL_STATIONS, STATION_SENSORS, SENSOR_SERIES } from "../data/stations.js";
import {
  groupSensorsByMeasurement, findNearestWithMeasurement,
  generateModelBaseline, generateRawDiagnostic,
  CANONICAL_MEASUREMENTS,
} from "../data/measurements.js";
import { fmtNow } from "../utils/helpers.js";

// ── SHARED STYLE HELPERS ─────────────────────────────────────────
const toInputVal   = v => v ? v.replace(" ","T").slice(0,16) : "";
const fromInputVal = v => v ? v.replace("T"," ") : "";

const SENSOR_LINE_COLORS = [C.navy, C.blue, "#7c3aed", "#059669", "#d97706"];
const MODEL_COLOR = "#94a3b8";
const NEARBY_COLOR = "#0891b2";

function Label({ children }) {
  return (
    <div style={{fontSize:11,fontWeight:700,color:C.gray500,textTransform:"uppercase",
      letterSpacing:"0.06em",marginBottom:5}}>
      {children}
    </div>
  );
}

function PillBtn({ active, onClick, children, color, danger }) {
  const bg = active ? (danger ? C.red : color || C.blue) : C.gray100;
  return (
    <button onClick={onClick} style={{
      padding:"6px 14px",borderRadius:20,border:"none",cursor:"pointer",
      fontSize:12,fontWeight:600,
      background:bg, color:active?"#fff":C.gray500,
      transition:"all .15s",whiteSpace:"nowrap",
    }}>{children}</button>
  );
}

function ToggleSwitch({ on, onClick, label }) {
  return (
    <label style={{display:"flex",alignItems:"center",gap:8,fontSize:12,
      cursor:"pointer",color:on?C.navy:C.gray500,fontWeight:on?600:400}}>
      <button onClick={onClick} style={{
        width:36,height:20,borderRadius:20,border:"none",cursor:"pointer",
        background:on?C.blue:C.gray300,position:"relative",transition:"background .2s",flexShrink:0,
      }}>
        <span style={{position:"absolute",width:14,height:14,background:"#fff",
          borderRadius:"50%",top:3,left:on?19:3,
          boxShadow:"0 1px 3px rgba(0,0,0,.2)",transition:"left .2s"}}/>
      </button>
      {label}
    </label>
  );
}

// ── INLINE FLAG MODAL (click-drag on chart → appears inline) ─────
function InlineFlagModal({ selection, stationId, measurementLabel, unit, onSubmit, onCancel }) {
  const [flag,    setFlag]    = useState("fail");
  const [comment, setComment] = useState("");
  const [nemisStatus, setNemisStatus] = useState(null); // null | "sending" | "done"

  const submit = () => {
    if (!comment.trim()) { alert("Comment required."); return; }
    setNemisStatus("sending");
    setTimeout(() => {
      setNemisStatus("done");
      setTimeout(() => onSubmit({ flag, comment, ...selection }), 1200);
    }, 900);
  };

  const btnSt = (active, danger) => ({
    flex:1, padding:"9px 0", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer",
    border:active?`2px solid ${danger?C.red:C.green}`:`1px solid ${C.gray200}`,
    background:active?(danger?C.redLight:C.greenLight):C.gray50,
    color:active?(danger?"#991b1b":"#166534"):C.gray500,
  });

  return (
    <div style={{
      position:"absolute", top:8, left:"50%", transform:"translateX(-50%)",
      width:380, background:C.white, borderRadius:14,
      boxShadow:"0 20px 60px rgba(0,0,0,.2)", border:`1px solid ${C.gray200}`,
      zIndex:50, overflow:"hidden",
    }}>
      {/* Header */}
      <div style={{background:C.navy,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontSize:13,fontWeight:700,color:"#fff"}}>Flag Selected Range</div>
          <div style={{fontSize:11,color:"#7d96b8",marginTop:1}}>{measurementLabel} · Station {stationId}</div>
        </div>
        <button onClick={onCancel} style={{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:18,lineHeight:1}}>×</button>
      </div>

      <div style={{padding:16}}>
        {/* Time range selected */}
        <div style={{
          background:C.gray50, borderRadius:8, padding:"8px 12px",
          fontSize:12, color:C.gray700, marginBottom:14,
          display:"flex", justifyContent:"space-between",
          border:`1px solid ${C.gray200}`,
        }}>
          <span style={{fontFamily:C.mono}}>{selection.start}</span>
          <span style={{color:C.gray400}}>→</span>
          <span style={{fontFamily:C.mono}}>{selection.end}</span>
        </div>

        <Label>Flag Type</Label>
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          <button onClick={()=>setFlag("pass")} style={btnSt(flag==="pass",false)}>✓ Pass</button>
          <button onClick={()=>setFlag("fail")} style={btnSt(flag==="fail",true)}>✕ Fail</button>
        </div>

        <Label>Inspector Comment *</Label>
        <textarea
          value={comment} onChange={e=>setComment(e.target.value)}
          rows={3} autoFocus
          placeholder="Describe the data quality issue — e.g. barometric spike, icing event, sensor swap…"
          style={{
            width:"100%", border:`1px solid ${comment?C.gray200:"#fca5a5"}`,
            borderRadius:8, padding:"8px 10px", fontSize:12,
            resize:"vertical", fontFamily:"inherit", boxSizing:"border-box",
            marginBottom:14, outline:"none",
          }}
        />

        {/* NEMIS status */}
        {nemisStatus === "sending" && (
          <div style={{background:C.blueLight,border:`1px solid ${C.blue}`,borderRadius:8,
            padding:"8px 12px",fontSize:12,color:C.blueDark,marginBottom:12,fontWeight:600}}>
            ⟳ Submitting to NEMIS flag database…
          </div>
        )}
        {nemisStatus === "done" && (
          <div style={{background:C.greenLight,border:`1px solid ${C.green}`,borderRadius:8,
            padding:"8px 12px",fontSize:12,color:"#166534",marginBottom:12,fontWeight:600}}>
            ✓ NEMIS flag committed — no tab switch required.
          </div>
        )}

        <div style={{display:"flex",gap:8}}>
          <button onClick={submit} disabled={!!nemisStatus} style={{
            flex:1,padding:"10px",borderRadius:8,border:"none",
            background:flag==="fail"?C.red:C.green,color:"#fff",
            fontSize:13,fontWeight:700,cursor:nemisStatus?"not-allowed":"pointer",
            opacity:nemisStatus?0.6:1,
          }}>
            Apply {flag==="fail"?"Fail":"Pass"} Flag in NEMIS
          </button>
          <button onClick={onCancel} style={{
            padding:"10px 14px",borderRadius:8,border:`1px solid ${C.gray200}`,
            background:C.white,cursor:"pointer",fontSize:13,color:C.gray500,
          }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN QC PLOT VIEW ─────────────────────────────────────────────
export function QCPlotView() {
  const [stationId,    setSt]         = useState("46402");
  const [measurementId,setMeasurement]= useState("BARO_PRESS");
  const [mainTab,      setMainTab]    = useState("plot");   // "plot" | "raw"

  // Intelligent overlay state
  const [showNearby,   setNearby]     = useState(false);
  const [showModel,    setModel]      = useState(false);
  const [skipFlagged,  setSkipFlagged]= useState(false);
  const [showGrid,     setShowGrid]   = useState(true);

  // Click-drag selection for inline flagging
  const [dragStart,    setDragStart]  = useState(null);
  const [dragEnd,      setDragEnd]    = useState(null);
  const [flagModal,    setFlagModal]  = useState(null);  // {start, end}
  const [flaggedRanges,setFlaggedRanges] = useState([]);

  // Flag success banner
  const [successMsg,   setSuccess]    = useState("");

  const station   = ALL_STATIONS.find(s => s.id === stationId) || ALL_STATIONS[0];
  const sensors   = STATION_SENSORS[stationId] || [];
  const groups    = groupSensorsByMeasurement(sensors);
  const mGroup    = groups[measurementId];
  const nearby    = findNearestWithMeasurement(station, ALL_STATIONS, measurementId);

  // Build chart data — merge all redundant sensors for this measurement
  const buildChartData = () => {
    if (!mGroup) return [];
    const base = Array.from({length:48},(_,i)=>({
      t:`${String(Math.floor(i/2)).padStart(2,"0")}:${i%2===0?"00":"30"}`,
    }));

    mGroup.sensors.forEach((s, si) => {
      const ser = SENSOR_SERIES[stationId]?.[s.id] || [];
      ser.forEach((pt, i) => {
        if (skipFlagged && pt.flag === "fail") base[i][`s${si}`] = null;
        else base[i][`s${si}`] = pt.v;
        base[i][`flag${si}`] = pt.flag;
      });
    });

    // Nearby station overlay — first matching sensor
    if (showNearby && nearby) {
      const nearbySensors = STATION_SENSORS[nearby.id] || [];
      const nearbyGroups  = groupSensorsByMeasurement(nearbySensors);
      const nearbyGroup   = nearbyGroups[measurementId];
      if (nearbyGroup?.sensors[0]) {
        const ns  = nearbyGroup.sensors[0];
        const ser = SENSOR_SERIES[nearby.id]?.[ns.id] || [];
        ser.forEach((pt, i) => { base[i]["nearby"] = pt.v; });
      }
    }

    // Model baseline overlay
    if (showModel && mGroup.sensors[0]) {
      const firstSer = SENSOR_SERIES[stationId]?.[mGroup.sensors[0].id] || [];
      const modelData = generateModelBaseline(firstSer, measurementId);
      modelData.forEach((pt, i) => { base[i]["model"] = pt.model; });
    }

    return base;
  };

  const chartData = buildChartData();
  const modelData = showModel ? chartData : [];

  // Click-drag flagging handlers
  const onMouseDown = e => {
    if (e?.activeLabel) setDragStart(e.activeLabel);
  };
  const onMouseMove = e => {
    if (dragStart && e?.activeLabel) setDragEnd(e.activeLabel);
  };
  const onMouseUp = () => {
    if (dragStart && dragEnd && dragStart !== dragEnd) {
      setFlagModal({ start: dragStart, end: dragEnd });
    }
    setDragStart(null);
    setDragEnd(null);
  };

  const handleFlagSubmit = ({ flag, comment, start, end }) => {
    setFlaggedRanges(prev => [...prev, { start, end, flag }]);
    setFlagModal(null);
    setSuccess(`${flag === "fail" ? "Fail" : "Pass"} flag applied (${start} → ${end}) and committed to NEMIS.`);
    setTimeout(() => setSuccess(""), 5000);
  };

  const allSensorCount  = mGroup?.sensors.length || 0;
  const allFlaggedCount = mGroup?.sensors.reduce((acc, s) => {
    const ser = SENSOR_SERIES[stationId]?.[s.id] || [];
    return acc + ser.filter(d => d.flag === "fail").length;
  }, 0) || 0;

  const rawText = generateRawDiagnostic(stationId);

  // Highlight voltages in raw text
  const highlightRaw = (text) => {
    return text.split("\n").map((line, i) => {
      const isVoltage = /BATT|VOLT|CURRENT|POWER|SOLAR|LOW_BATT/.test(line);
      const isFail    = /FAIL|ERROR|WARN/.test(line);
      const isPass    = /✓/.test(line);
      return (
        <div key={i} style={{
          fontFamily: C.mono, fontSize: 11.5, lineHeight: "1.7",
          color: isFail ? C.red : isVoltage ? "#b45309" : isPass ? C.green : "#e2e8f0",
          background: isVoltage ? "rgba(251,191,36,.08)" : "transparent",
          padding: isVoltage ? "1px 6px" : "0 6px",
          borderRadius: 3,
        }}>{line || " "}</div>
      );
    });
  };

  return (
    <div style={{position:"relative"}}>

      {/* ── PAGE HEADER ───────────────────────────────────────── */}
      <div style={{marginBottom:18}}>
        <h2 style={{fontSize:20,fontWeight:800,color:C.navy,margin:"0 0 4px",letterSpacing:"-0.3px"}}>
          QC Plot — Parameter-Centric Workspace
        </h2>
        <p style={{fontSize:13,color:C.gray500,margin:0}}>
          All redundant sensors grouped by measurement · Hardware-agnostic · Inline NEMIS flagging
        </p>
      </div>

      {/* ── SUCCESS BANNER ────────────────────────────────────── */}
      {successMsg && (
        <div style={{
          background:C.greenLight,border:`1px solid ${C.green}`,borderRadius:8,
          padding:"10px 16px",marginBottom:14,fontSize:13,fontWeight:600,color:"#166534",
          display:"flex",alignItems:"center",gap:10,
        }}>
          <span style={{fontSize:16}}>✓</span> {successMsg}
        </div>
      )}

      {/* ── STATION + MEASUREMENT SELECTOR BAR ───────────────── */}
      <div style={{
        background:C.white, border:`1px solid ${C.gray200}`, borderRadius:12,
        padding:"14px 20px", marginBottom:14,
        display:"flex", gap:20, flexWrap:"wrap", alignItems:"flex-end",
      }}>
        <div style={{minWidth:130}}>
          <Label>Station</Label>
          <select value={stationId} onChange={e=>{setSt(e.target.value);setFlaggedRanges([]);setFlagModal(null);}} style={{
            border:`1px solid ${C.gray200}`,borderRadius:8,padding:"7px 10px",
            fontSize:13,background:C.white,color:C.navy,fontFamily:"inherit",
            outline:"none",width:"100%",fontWeight:600,fontFamily:C.mono,
          }}>
            {ALL_STATIONS.filter(s=>s.type==="active").map(s=>(
              <option key={s.id} value={s.id}>{s.id} — {s.name}</option>
            ))}
          </select>
        </div>

        <div style={{flex:1,minWidth:200}}>
          <Label>Measurement Type (Universal — hardware-agnostic)</Label>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {Object.values(groups).map(g=>(
              <button key={g.id} onClick={()=>{setMeasurement(g.id);setFlagModal(null);setFlaggedRanges([]);}} style={{
                padding:"6px 14px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,
                background:measurementId===g.id?C.navy:C.gray100,
                color:measurementId===g.id?"#fff":C.gray500,
                transition:"all .15s",
              }}>
                {g.icon} {g.label}
                {groups[g.id]?.sensors.length > 1 && (
                  <span style={{
                    marginLeft:6,fontSize:10,background:measurementId===g.id?"rgba(255,255,255,.25)":"#e2e8f0",
                    borderRadius:10,padding:"1px 6px",
                  }}>{groups[g.id].sensors.length}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{display:"flex",border:`1px solid ${C.gray200}`,borderRadius:8,overflow:"hidden",flexShrink:0}}>
          {[["plot","📈 Plot"],["raw","🔧 Raw Diagnostic"]].map(([k,l])=>(
            <button key={k} onClick={()=>setMainTab(k)} style={{
              padding:"7px 14px",border:"none",cursor:"pointer",fontSize:12,fontWeight:600,
              background:mainTab===k?C.navy:C.white,color:mainTab===k?"#fff":C.gray500,
            }}>{l}</button>
          ))}
        </div>
      </div>

      {mainTab === "raw" ? (
        /* ── RAW DIAGNOSTIC TAB ─────────────────────────────── */
        <div style={{background:"#0d1117",borderRadius:12,overflow:"hidden"}}>
          <div style={{
            background:"#161b22",padding:"10px 16px",
            display:"flex",alignItems:"center",justifyContent:"space-between",
            borderBottom:"1px solid #30363d",
          }}>
            <span style={{fontSize:12,fontWeight:700,color:"#7d96b8",fontFamily:C.mono}}>
              RUDICS RAW DIAGNOSTIC — {stationId}
            </span>
            <div style={{display:"flex",gap:8}}>
              <span style={{width:12,height:12,borderRadius:"50%",background:"#ff5f57"}}/>
              <span style={{width:12,height:12,borderRadius:"50%",background:"#febc2e"}}/>
              <span style={{width:12,height:12,borderRadius:"50%",background:"#28c840"}}/>
            </div>
          </div>
          <div style={{padding:"16px 20px",maxHeight:480,overflowY:"auto"}}>
            {highlightRaw(rawText)}
          </div>
          <div style={{
            background:"#161b22",padding:"8px 16px",borderTop:"1px solid #30363d",
            fontSize:11,color:"#7d96b8",fontFamily:C.mono,
          }}>
            ⚡ Voltage values highlighted in amber · ✓ PASS in green · ✗ FAIL in red
          </div>
        </div>
      ) : (
        /* ── PLOT TAB ────────────────────────────────────────── */
        <>
          {/* ── INTELLIGENT OVERLAY TOOLBAR ─────────────────── */}
          <div style={{
            background:C.white,border:`1px solid ${C.gray200}`,borderRadius:12,
            padding:"12px 20px",marginBottom:14,
            display:"flex",alignItems:"center",gap:16,flexWrap:"wrap",
          }}>
            <div style={{fontSize:11,fontWeight:700,color:C.gray400,textTransform:"uppercase",letterSpacing:"0.07em",flexShrink:0}}>
              Intelligent Overlay
            </div>
            <div style={{width:1,height:20,background:C.gray200,flexShrink:0}}/>

            {/* Nearby station */}
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <ToggleSwitch on={showNearby} onClick={()=>setNearby(v=>!v)}
                label={showNearby && nearby
                  ? `Nearest valid: ${nearby.id} (${nearby.name})`
                  : "Compare Nearest Valid Station"}
              />
              {showNearby && nearby && (
                <span style={{
                  fontSize:11,background:"#e0f2fe",color:"#0369a1",
                  borderRadius:20,padding:"2px 8px",fontWeight:600,
                }}>
                  {nearby.id} · {Math.round(Math.sqrt(Math.pow(nearby.lat-station.lat,2)+Math.pow(nearby.lon-station.lon,2))*111)} km away
                </span>
              )}
            </div>

            <div style={{width:1,height:20,background:C.gray200,flexShrink:0}}/>

            {/* Model overlay */}
            <ToggleSwitch on={showModel} onClick={()=>setModel(v=>!v)}
              label="Overlay GFS/NAM Model Baseline"/>

            <div style={{width:1,height:20,background:C.gray200,flexShrink:0}}/>

            {/* Filter toggles */}
            <ToggleSwitch on={skipFlagged} onClick={()=>setSkipFlagged(v=>!v)} label="Skip Flagged"/>
            <ToggleSwitch on={showGrid}    onClick={()=>setShowGrid(v=>!v)}    label="Grid"/>

            <div style={{flex:1}}/>

            {/* Drag-to-flag hint */}
            <div style={{
              display:"flex",alignItems:"center",gap:6,fontSize:11,color:C.gray400,
              background:C.gray50,borderRadius:8,padding:"5px 10px",
              border:`1px solid ${C.gray200}`,flexShrink:0,
            }}>
              <span>🖱</span> Click + drag on chart to flag a range inline
            </div>
          </div>

          {/* ── SENSOR LEGEND STRIP ─────────────────────────── */}
          {mGroup && (
            <div style={{
              display:"flex",gap:10,marginBottom:10,flexWrap:"wrap",alignItems:"center",
            }}>
              <span style={{fontSize:11,color:C.gray400,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em"}}>
                Sensors on plot:
              </span>
              {mGroup.sensors.map((s,i)=>(
                <div key={s.id} style={{
                  display:"flex",alignItems:"center",gap:6,
                  background:C.white,border:`1px solid ${C.gray200}`,
                  borderRadius:8,padding:"4px 10px",fontSize:11,
                }}>
                  <span style={{width:18,height:3,background:SENSOR_LINE_COLORS[i]||C.navy,borderRadius:2,flexShrink:0}}/>
                  <span style={{fontFamily:C.mono,fontWeight:700,color:SENSOR_LINE_COLORS[i]||C.navy}}>{s.id}</span>
                  <span style={{color:C.gray500}}>{s.param}</span>
                  {s.status==="degraded"&&<span style={{fontSize:9,background:C.amberLight,color:C.amber,borderRadius:4,padding:"1px 5px",fontWeight:700}}>DEGRADED</span>}
                  {s.status==="fault"&&<span style={{fontSize:9,background:C.redLight,color:C.red,borderRadius:4,padding:"1px 5px",fontWeight:700}}>FAULT</span>}
                </div>
              ))}
              {showNearby && nearby && (
                <div style={{display:"flex",alignItems:"center",gap:6,background:C.white,border:`1px solid ${C.gray200}`,borderRadius:8,padding:"4px 10px",fontSize:11}}>
                  <span style={{width:18,height:3,background:NEARBY_COLOR,borderRadius:2,borderTop:"2px dashed "+NEARBY_COLOR,flexShrink:0}}/>
                  <span style={{fontFamily:C.mono,fontWeight:700,color:NEARBY_COLOR}}>{nearby.id}</span>
                  <span style={{color:C.gray500}}>nearby</span>
                </div>
              )}
              {showModel && (
                <div style={{display:"flex",alignItems:"center",gap:6,background:C.white,border:`1px solid ${C.gray200}`,borderRadius:8,padding:"4px 10px",fontSize:11}}>
                  <span style={{width:18,height:3,background:MODEL_COLOR,borderRadius:2,borderTop:"2px dashed "+MODEL_COLOR,flexShrink:0}}/>
                  <span style={{color:MODEL_COLOR,fontWeight:700}}>GFS/NAM Model</span>
                </div>
              )}
              <div style={{marginLeft:"auto",display:"flex",gap:10,alignItems:"center"}}>
                {allFlaggedCount>0&&(
                  <span style={{fontSize:12,background:C.redLight,color:C.red,borderRadius:8,padding:"3px 10px",fontWeight:600}}>
                    {allFlaggedCount} flagged observations
                  </span>
                )}
                <span style={{fontSize:12,color:C.gray500}}>
                  {allSensorCount} sensor{allSensorCount!==1?"s":""}
                </span>
              </div>
            </div>
          )}

          {/* ── MAIN CHART ───────────────────────────────────── */}
          <div style={{
            background:C.white,border:`1px solid ${C.gray200}`,borderRadius:12,
            padding:"20px 16px 10px",marginBottom:14,
            position:"relative",
          }}>
            {!mGroup ? (
              <div style={{height:320,display:"flex",alignItems:"center",justifyContent:"center",color:C.gray400,fontSize:14}}>
                No sensors found for this measurement type on station {stationId}.
              </div>
            ) : (
              <div style={{height:320,cursor:"crosshair",userSelect:"none"}}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                  >
                    {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={C.gray100} vertical={false}/>}
                    <XAxis dataKey="t" tick={{fontSize:9,fill:C.gray400}} tickLine={false} axisLine={false} interval={7}/>
                    <YAxis tick={{fontSize:10,fill:C.gray400}} tickLine={false} axisLine={false}
                      unit={mGroup ? ` ${mGroup.unit}` : ""} width={54} domain={["auto","auto"]}/>
                    <Tooltip
                      contentStyle={{fontSize:11,borderRadius:10,border:`1px solid ${C.gray200}`,boxShadow:"0 4px 16px rgba(0,0,0,.1)"}}
                      cursor={{stroke:C.blueLight,strokeWidth:2}}
                    />
                    <Legend wrapperStyle={{fontSize:11,paddingTop:8}}/>

                    {/* One line per redundant sensor */}
                    {mGroup.sensors.map((s, si) => (
                      <Line key={s.id} type="monotone" dataKey={`s${si}`}
                        name={`${s.id} (${s.param})`}
                        stroke={SENSOR_LINE_COLORS[si] || C.navy}
                        strokeWidth={si===0?2.5:1.8}
                        dot={props => props.payload[`flag${si}`] === "fail"
                          ? <circle key={`f${props.index}`} cx={props.cx} cy={props.cy} r={5}
                              fill={C.red} stroke={C.white} strokeWidth={1.5}/>
                          : <circle key={`p${props.index}`} cx={props.cx} cy={props.cy} r={0}/>}
                        connectNulls={false}
                        activeDot={{r:4,stroke:C.white,strokeWidth:2}}
                      />
                    ))}

                    {/* Nearby station overlay */}
                    {showNearby && nearby && (
                      <Line type="monotone" dataKey="nearby"
                        name={`${nearby.id} (nearby)`}
                        stroke={NEARBY_COLOR} strokeWidth={1.5}
                        strokeDasharray="6 3" dot={false}
                        activeDot={{r:3}}
                      />
                    )}

                    {/* Model overlay */}
                    {showModel && (
                      <Line type="monotone" dataKey="model"
                        name="GFS/NAM Model" stroke={MODEL_COLOR}
                        strokeWidth={1.5} strokeDasharray="4 4"
                        dot={false} activeDot={{r:3}}
                      />
                    )}

                    {/* Active drag selection highlight */}
                    {dragStart && dragEnd && (
                      <ReferenceArea x1={dragStart} x2={dragEnd}
                        fill={C.red} fillOpacity={0.12}
                        stroke={C.red} strokeOpacity={0.4}/>
                    )}

                    {/* Previously submitted flag ranges */}
                    {flaggedRanges.map((r,i) => (
                      <ReferenceArea key={i} x1={r.start} x2={r.end}
                        fill={r.flag==="fail"?C.red:C.green}
                        fillOpacity={0.08}
                        stroke={r.flag==="fail"?C.red:C.green}
                        strokeOpacity={0.3}
                        label={{value:r.flag.toUpperCase(),position:"insideTopLeft",fontSize:9,fill:r.flag==="fail"?C.red:C.green}}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Inline flag modal — appears over chart */}
            {flagModal && (
              <InlineFlagModal
                selection={flagModal}
                stationId={stationId}
                measurementLabel={mGroup?.label || ""}
                unit={mGroup?.unit || ""}
                onSubmit={handleFlagSubmit}
                onCancel={()=>setFlagModal(null)}
              />
            )}
          </div>

          {/* ── FLAGGED OBSERVATION SUMMARY ──────────────────── */}
          {allFlaggedCount > 0 && (
            <div style={{
              background:C.white,border:`1px solid ${C.gray200}`,borderRadius:12,
              padding:"14px 18px",marginBottom:14,
            }}>
              <div style={{fontSize:12,fontWeight:700,color:C.navy,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.04em"}}>
                Flagged Observations — {mGroup?.label}
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {mGroup?.sensors.map((s,si) => {
                  const ser = SENSOR_SERIES[stationId]?.[s.id] || [];
                  return ser.filter(d=>d.flag==="fail").map(d=>(
                    <div key={`${s.id}-${d.t}`} style={{
                      display:"inline-flex",alignItems:"center",gap:6,
                      background:C.redLight,border:"1px solid #fecaca",
                      borderRadius:8,padding:"4px 10px",
                    }}>
                      <span style={{width:8,height:8,borderRadius:"50%",background:SENSOR_LINE_COLORS[si]||C.red,flexShrink:0}}/>
                      <span style={{fontSize:11,fontFamily:C.mono,color:"#7f1d1d",fontWeight:700}}>{d.t}</span>
                      <span style={{fontSize:11,color:"#991b1b"}}>{d.v} {mGroup.unit}</span>
                      <span style={{fontSize:10,color:"#b91c1c",fontStyle:"italic"}}>{s.id}</span>
                    </div>
                  ));
                })}
              </div>
            </div>
          )}

          {/* ── SUBMITTED FLAG LOG ───────────────────────────── */}
          {flaggedRanges.length > 0 && (
            <div style={{
              background:C.white,border:`1px solid ${C.gray200}`,borderRadius:12,
              padding:"14px 18px",
            }}>
              <div style={{fontSize:12,fontWeight:700,color:C.navy,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.04em"}}>
                NEMIS Flag Log — This Session
              </div>
              {flaggedRanges.map((r,i)=>(
                <div key={i} style={{
                  display:"flex",alignItems:"center",gap:12,padding:"7px 0",
                  borderBottom:i<flaggedRanges.length-1?`1px solid ${C.gray100}`:"none",fontSize:12,
                }}>
                  <span style={{
                    fontSize:10,fontWeight:700,background:r.flag==="fail"?C.redLight:C.greenLight,
                    color:r.flag==="fail"?C.red:C.green,borderRadius:4,padding:"2px 7px",
                  }}>{r.flag.toUpperCase()}</span>
                  <span style={{fontFamily:C.mono,color:C.gray500}}>{r.start}</span>
                  <span style={{color:C.gray400}}>→</span>
                  <span style={{fontFamily:C.mono,color:C.gray500}}>{r.end}</span>
                  <span style={{color:C.gray500}}>· {mGroup?.label} · {stationId}</span>
                  <span style={{marginLeft:"auto",fontSize:11,color:C.green,fontWeight:600}}>✓ committed to NEMIS</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
