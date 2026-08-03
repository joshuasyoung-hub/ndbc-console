import { useState, useEffect } from "react";
import { C } from "../theme.js";
import { ALL_STATIONS, STATION_SENSORS } from "../data/stations.js";
import { INITIAL_SDRS } from "../data/misc.js";
import { MODULES, FLEET_STATS } from "../nav.js";
import { StatusPill, Chip } from "./ui/index.js";
import { WorldMap } from "./WorldMap.jsx";

export function LandingPage({ onModule, onView, globalSearch, setGlobalSearch, onLocate, recentIds=[], favoriteIds=[], onToggleFavorite, onJumpToStation }) {
  const [stSearch, setStSearch] = useState(globalSearch||"");
  const [stResults, setStResults] = useState([]);

  useEffect(()=>{
    if(stSearch.trim().length>0){
      setStResults(ALL_STATIONS.filter(s=>
        s.id.toLowerCase().includes(stSearch.toLowerCase())||
        s.name.toLowerCase().includes(stSearch.toLowerCase())||
        s.region.toLowerCase().includes(stSearch.toLowerCase())
      ));
    } else {
      setStResults([]);
    }
  },[stSearch]);

  return (
    <div style={{overflowY:"auto",flex:1,background:"#eef1f5"}}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div style={{
        background:`linear-gradient(135deg, #061a30 0%, #0A2540 45%, #123a63 100%)`,
        padding:"48px 40px 40px",
        position:"relative",overflow:"hidden",
      }}>
        {/* subtle texture overlay */}
        <div style={{
          position:"absolute",inset:0,opacity:.08,
          backgroundImage:"radial-gradient(circle at 15% 85%, #60a5fa 0%, transparent 45%), radial-gradient(circle at 85% 15%, #34d399 0%, transparent 45%)",
          pointerEvents:"none",
        }}/>

        <div style={{maxWidth:1180,margin:"0 auto",position:"relative"}}>
          <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) 460px",gap:40,alignItems:"center"}}>

            {/* ── Left: headline + search ── */}
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 0 4px rgba(34,197,94,.22)"}}/>
                <span style={{fontSize:11,fontWeight:700,color:"#60a5fa",letterSpacing:"0.15em",textTransform:"uppercase"}}>
                  National Data Buoy Center · NOAA
                </span>
              </div>
              <h1 style={{fontSize:42,fontWeight:800,color:C.white,margin:"0 0 12px",lineHeight:1.08,letterSpacing:"-1px"}}>
                One Console<br/>System
              </h1>
              <p style={{fontSize:15,color:"#9fb3cc",margin:"0 0 28px",lineHeight:1.65,maxWidth:440}}>
                A unified operational platform for oceanographic data management, quality control, and real-time fleet monitoring across the global buoy network.
              </p>

              {/* Station search hero */}
              <div style={{position:"relative",maxWidth:480,marginBottom:30}}>
                <div style={{
                  display:"flex",background:"rgba(255,255,255,.09)",border:"1px solid rgba(255,255,255,.18)",
                  borderRadius:12,overflow:"hidden",transition:"border-color .15s",
                }}>
                  <span style={{display:"flex",alignItems:"center",paddingLeft:16,color:"rgba(255,255,255,.5)",fontSize:16,flexShrink:0}}>⌕</span>
                  <input
                    value={stSearch}
                    onChange={e=>setStSearch(e.target.value)}
                    placeholder="Search station ID, name, or region…"
                    style={{
                      flex:1,background:"transparent",border:"none",outline:"none",
                      padding:"14px 16px",fontSize:14,color:C.white,
                    }}
                  />
                  {stSearch&&<button onClick={()=>setStSearch("")} style={{background:"transparent",border:"none",color:"rgba(255,255,255,.5)",cursor:"pointer",padding:"0 14px",fontSize:18}}>✕</button>}
                </div>

                {/* Search results dropdown */}
                {stResults.length>0&&(
                  <div style={{
                    position:"absolute",top:"calc(100% + 8px)",left:0,right:0,zIndex:50,
                    background:C.white,borderRadius:10,border:`1px solid ${C.gray200}`,
                    boxShadow:"0 8px 32px rgba(10,37,64,.18)",overflow:"hidden",maxHeight:280,overflowY:"auto",
                  }}>
                    {stResults.map(st=>(
                      <div key={st.id} onClick={()=>{ setStSearch(""); onView("engineering"); }}
                        style={{display:"grid",gridTemplateColumns:"90px 1fr auto",gap:12,padding:"11px 16px",cursor:"pointer",alignItems:"center",borderBottom:`1px solid ${C.gray100}`}}
                        onMouseEnter={e=>e.currentTarget.style.background=C.gray50}
                        onMouseLeave={e=>e.currentTarget.style.background=C.white}>
                        <span style={{fontSize:13,fontWeight:700,fontFamily:C.mono,color:C.navy}}>{st.id}</span>
                        <span style={{fontSize:13,color:C.gray700}}>{st.name} <span style={{color:C.gray400,fontSize:11}}>· {st.region}</span></span>
                        <StatusPill status={st.type}/>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick stat strip */}
              <div style={{display:"flex",gap:28}}>
                {[
                  ["Stations Online", FLEET_STATS.online, "#4ade80"],
                  ["TAO Nodes", FLEET_STATS.nodes, "#60a5fa"],
                  ["Active Anomalies", FLEET_STATS.anomalies, "#f87171"],
                ].map(([label,val,color])=>(
                  <div key={label}>
                    <div style={{fontSize:24,fontWeight:800,color,lineHeight:1}}>{val}</div>
                    <div style={{fontSize:11,color:"#7d96b8",marginTop:4}}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: interactive world map ── */}
            <div style={{
              background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.12)",
              borderRadius:16,padding:14,
            }}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10,padding:"0 4px"}}>
                <span style={{fontSize:11,fontWeight:700,color:"#93c5fd",letterSpacing:"0.06em",textTransform:"uppercase"}}>Live Fleet Map</span>
                <span style={{fontSize:10,color:"#7d96b8"}}>{ALL_STATIONS.length} stations · sample view</span>
              </div>
              <WorldMap stations={ALL_STATIONS} onPick={(sid)=>onView("engineering")} height={300} />
            </div>

          </div>
        </div>
      </div>

      {(favoriteIds.length>0 || recentIds.length>0) && (
        <div style={{maxWidth:1180,margin:"0 auto",padding:"20px 24px 0"}}>
          <div style={{
            background:C.white,border:`1px solid ${C.gray200}`,borderRadius:12,
            padding:"14px 18px",display:"flex",alignItems:"center",gap:18,flexWrap:"wrap",
          }}>
            {favoriteIds.length>0 && (
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <span style={{fontSize:11,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.06em",flexShrink:0}}>★ Favorites</span>
                {favoriteIds.map(id=>{
                  const st = ALL_STATIONS.find(s=>s.id===id);
                  if(!st) return null;
                  return (
                    <button key={id} onClick={()=>onJumpToStation(id)} style={{
                      display:"flex",alignItems:"center",gap:6,padding:"5px 11px",
                      background:"#fffbeb",border:"1px solid #fde68a",borderRadius:20,
                      cursor:"pointer",fontFamily:"inherit",
                    }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor="#eab308"}
                    onMouseLeave={e=>e.currentTarget.style.borderColor="#fde68a"}>
                      <span style={{fontSize:11,color:"#eab308"}}>★</span>
                      <span style={{fontSize:12,fontWeight:700,fontFamily:C.mono,color:C.navy}}>{st.id}</span>
                      <span style={{fontSize:11,color:C.gray500}}>{st.name}</span>
                      <button onClick={e=>{e.stopPropagation();onToggleFavorite(id);}} style={{
                        background:"none",border:"none",cursor:"pointer",color:C.gray400,
                        fontSize:12,padding:0,marginLeft:2,lineHeight:1,
                      }} title="Remove from favorites">✕</button>
                    </button>
                  );
                })}
              </div>
            )}

            {favoriteIds.length>0 && recentIds.filter(id=>!favoriteIds.includes(id)).length>0 && (
              <div style={{width:1,height:22,background:C.gray200,flexShrink:0}}/>
            )}

            {recentIds.filter(id=>!favoriteIds.includes(id)).length>0 && (
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <span style={{fontSize:11,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.06em",flexShrink:0}}>Recently Viewed</span>
                {recentIds.filter(id=>!favoriteIds.includes(id)).slice(0,6).map(id=>{
                  const st = ALL_STATIONS.find(s=>s.id===id);
                  if(!st) return null;
                  return (
                    <button key={id} onClick={()=>onJumpToStation(id)} style={{
                      display:"flex",alignItems:"center",gap:6,padding:"5px 11px",
                      background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:20,
                      cursor:"pointer",fontFamily:"inherit",
                    }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=C.gray300}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=C.gray200}>
                      <span style={{fontSize:12,fontWeight:700,fontFamily:C.mono,color:C.navy}}>{st.id}</span>
                      <span style={{fontSize:11,color:C.gray500}}>{st.name}</span>
                      <button onClick={e=>{e.stopPropagation();onToggleFavorite(id);}} style={{
                        background:"none",border:"none",cursor:"pointer",color:C.gray300,
                        fontSize:12,padding:0,marginLeft:2,lineHeight:1,
                      }} title="Add to favorites">☆</button>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{maxWidth:1180,margin:"0 auto",padding:"36px 24px 48px"}}>

        {/* ── Module cards ──────────────────────────────────── */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:16,marginBottom:36}}>
          {MODULES.map(m=>(
            <button key={m.id} onClick={()=>onModule(m)} style={{
              background:C.white,border:`1px solid ${C.gray200}`,borderRadius:14,
              padding:"26px 28px",textAlign:"left",cursor:"pointer",
              transition:"all .18s",display:"block",width:"100%",
              borderTop:`4px solid ${m.color}`,
            }}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 6px 28px rgba(10,37,64,.10)";e.currentTarget.style.borderColor=m.color;e.currentTarget.style.transform="translateY(-2px)";}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor=C.gray200;e.currentTarget.style.transform="translateY(0)";}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14}}>
                <div style={{
                  width:46,height:46,borderRadius:11,background:m.colorLight,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:22,color:m.color,fontWeight:700,
                }}>{m.icon}</div>
                <span style={{fontSize:11,fontWeight:600,background:m.colorLight,color:m.color,borderRadius:20,padding:"3px 10px"}}>{m.stat}</span>
              </div>
              <div style={{fontSize:17,fontWeight:700,color:C.navy,marginBottom:6,lineHeight:1.3}}>{m.label}</div>
              <div style={{fontSize:12,color:C.gray500,lineHeight:1.6}}>{m.desc}</div>
              <div style={{marginTop:16,fontSize:12,fontWeight:600,color:m.color,display:"flex",alignItems:"center",gap:5}}>
                Open module <span>→</span>
              </div>
            </button>
          ))}
        </div>

        {/* ── Fleet health widgets ───────────────────────────── */}
        <div style={{marginBottom:8}}>
          <h2 style={{fontSize:16,fontWeight:700,color:C.navy,margin:"0 0 16px"}}>Fleet Health At-a-Glance</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:32}}>
          {[
            {label:"Stations Online",  value:FLEET_STATS.online,    color:C.green,  sub:"of "+ALL_STATIONS.length+" total"},
            {label:"Active Anomalies", value:FLEET_STATS.anomalies, color:C.red,    sub:"require attention"},
            {label:"Open SDRs",        value:FLEET_STATS.sdrs,      color:C.amber,  sub:"awaiting resolution"},
            {label:"TAO Nodes",        value:FLEET_STATS.nodes,     color:C.blue,   sub:"in array"},
            {label:"TAO Healthy",      value:FLEET_STATS.healthy,   color:C.green,  sub:Math.round(FLEET_STATS.healthy/FLEET_STATS.nodes*100)+"% of array"},
          ].map(s=>(
            <div key={s.label} style={{background:C.white,border:`1px solid ${C.gray200}`,borderRadius:12,padding:"16px 18px"}}>
              <div style={{fontSize:28,fontWeight:800,color:s.color,lineHeight:1}}>{s.value}</div>
              <div style={{fontSize:12,fontWeight:600,color:C.navy,margin:"5px 0 2px"}}>{s.label}</div>
              <div style={{fontSize:11,color:C.gray400}}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Recent SDRs ────────────────────────────────────── */}
        <div style={{background:C.white,border:`1px solid ${C.gray200}`,borderRadius:12,overflow:"hidden",marginBottom:24}}>
          <div style={{
            padding:"14px 20px",borderBottom:`1px solid ${C.gray200}`,
            display:"flex",justifyContent:"space-between",alignItems:"center",
          }}>
            <div style={{fontSize:14,fontWeight:700,color:C.navy}}>Recent SDR Logs</div>
            <button onClick={()=>onView("sdr")} style={{fontSize:12,color:C.blue,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>View all →</button>
          </div>
          {INITIAL_SDRS.map((sdr,i)=>(
            <div key={sdr.id} style={{
              display:"grid",gridTemplateColumns:"140px 80px 1fr auto",gap:16,
              padding:"12px 20px",alignItems:"center",
              borderBottom:i<INITIAL_SDRS.length-1?`1px solid ${C.gray100}`:"none",
            }}>
              <span style={{fontFamily:C.mono,fontSize:12,fontWeight:700,color:C.blueDark}}>{sdr.id}</span>
              <span style={{fontFamily:C.mono,fontSize:12,color:C.gray400}}>#{sdr.station}</span>
              <span style={{fontSize:13,color:C.gray700}}>{sdr.summary}</span>
              <StatusPill status={sdr.status.toLowerCase()}/>
            </div>
          ))}
        </div>

        {/* ── Active station cards ───────────────────────────── */}
        <div style={{marginBottom:8}}>
          <h2 style={{fontSize:16,fontWeight:700,color:C.navy,margin:"0 0 16px"}}>Active Stations</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          {ALL_STATIONS.filter(s=>s.type==="active").map(st=>{
            const sens=STATION_SENSORS[st.id]||[];
            const faults=sens.filter(s=>s.status==="fault").length;
            const degraded=sens.filter(s=>s.status==="degraded").length;
            return(
              <div key={st.id} onClick={()=>onView("engineering")} style={{
                background:C.white,border:`1px solid ${C.gray200}`,borderRadius:10,
                padding:"14px 16px",cursor:"pointer",transition:"all .12s",
              }}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 14px rgba(0,0,0,.07)";e.currentTarget.style.borderColor=C.gray300;}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor=C.gray200;}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <span style={{fontSize:14,fontWeight:700,fontFamily:C.mono,color:C.navy}}>{st.id}</span>
                  {faults>0?<Chip label={`${faults} fault`} color="red"/>:degraded>0?<Chip label={`${degraded} degraded`} color="amber"/>:<Chip label="Nominal" color="green"/>}
                </div>
                <div style={{fontSize:12,color:C.gray700,marginBottom:3}}>{st.name}</div>
                <div style={{fontSize:11,color:C.gray400}}>{st.hull} · {st.region} · {st.depth} m</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
