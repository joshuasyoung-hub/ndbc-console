import { useState } from "react";
import { C } from "../theme.js";
import { ALL_STATIONS } from "../data/stations.js";
import { StatusPill } from "./ui/index.js";

export function StationSelector({ onSelect, moduleName, recentIds = [], favoriteIds = [], onToggleFavorite }) {
  const [search, setSearch] = useState("");
  const [hovered, setHovered] = useState(null);
  const matches = ALL_STATIONS.filter(s =>
    s.id.toLowerCase().includes(search.toLowerCase()) ||
    s.name.toLowerCase().includes(search.toLowerCase())
  );
  const favStations    = favoriteIds.map(id=>ALL_STATIONS.find(s=>s.id===id)).filter(Boolean);
  const recentStations = recentIds
    .filter(id=>!favoriteIds.includes(id))
    .map(id=>ALL_STATIONS.find(s=>s.id===id)).filter(Boolean);

  return (
    <div style={{
      display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",minHeight:420,padding:32,
    }}>
      <div style={{
        background:C.white,border:`1px solid ${C.gray200}`,borderRadius:16,
        padding:"36px 40px",maxWidth:560,width:"100%",
        boxShadow:"0 4px 24px rgba(10,37,64,.08)",
      }}>
        <div style={{fontSize:11,fontWeight:700,color:C.blue,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>
          {moduleName}
        </div>
        <h2 style={{fontSize:22,fontWeight:700,color:C.navy,margin:"0 0 6px"}}>Select a Station</h2>
        <p style={{fontSize:13,color:C.gray500,margin:"0 0 18px",lineHeight:1.6}}>
          Choose the station you want to work with. All tools in this module will anchor to that station context.
        </p>

        {(favStations.length>0 || recentStations.length>0) && (
          <div style={{marginBottom:18}}>
            {favStations.length>0 && (
              <div style={{marginBottom:10}}>
                <div style={{fontSize:10,fontWeight:700,color:C.gray400,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>★ Favorites</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {favStations.map(st=>(
                    <button key={st.id} onClick={()=>onSelect(st.id)} style={{
                      display:"flex",alignItems:"center",gap:6,padding:"5px 10px",
                      background:"#fffbeb",border:"1px solid #fde68a",borderRadius:20,
                      cursor:"pointer",fontFamily:"inherit",
                    }}>
                      <span style={{fontSize:11}}>★</span>
                      <span style={{fontSize:12,fontWeight:700,fontFamily:C.mono,color:C.navy}}>{st.id}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {recentStations.length>0 && (
              <div>
                <div style={{fontSize:10,fontWeight:700,color:C.gray400,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Recently Viewed</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {recentStations.slice(0,4).map(st=>(
                    <button key={st.id} onClick={()=>onSelect(st.id)} style={{
                      display:"flex",alignItems:"center",gap:6,padding:"5px 10px",
                      background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:20,
                      cursor:"pointer",fontFamily:"inherit",
                    }}>
                      <span style={{fontSize:12,fontWeight:700,fontFamily:C.mono,color:C.navy}}>{st.id}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <input
          autoFocus
          value={search}
          onChange={e=>setSearch(e.target.value)}
          placeholder="Search by station ID or name…"
          style={{
            width:"100%",border:`1px solid ${C.gray200}`,borderRadius:9,
            padding:"10px 14px",fontSize:14,outline:"none",marginBottom:10,
            boxSizing:"border-box",
          }}
        />
        <div style={{maxHeight:240,overflowY:"auto",borderRadius:8,border:`1px solid ${C.gray200}`}}>
          {matches.map(st => {
            const isFav = favoriteIds.includes(st.id);
            return (
              <div key={st.id}
                onClick={()=>onSelect(st.id)}
                onMouseEnter={()=>setHovered(st.id)}
                onMouseLeave={()=>setHovered(null)}
                style={{
                  display:"grid",gridTemplateColumns:"28px 80px 1fr auto",gap:12,
                  padding:"11px 14px",cursor:"pointer",alignItems:"center",
                  borderBottom:`1px solid ${C.gray100}`,
                  background:hovered===st.id?"#f0f9ff":"transparent",
                  transition:"background .1s",
                }}>
                <button
                  onClick={e=>{ e.stopPropagation(); onToggleFavorite && onToggleFavorite(st.id); }}
                  style={{
                    background:"none",border:"none",cursor:"pointer",fontSize:14,padding:0,
                    color:isFav?"#eab308":C.gray300,
                  }}
                  title={isFav?"Remove from favorites":"Add to favorites"}
                >{isFav?"★":"☆"}</button>
                <span style={{fontSize:13,fontWeight:700,fontFamily:C.mono,color:C.navy}}>{st.id}</span>
                <span style={{fontSize:13,color:C.gray700}}>{st.name}</span>
                <StatusPill status={st.type}/>
              </div>
            );
          })}
          {matches.length===0&&(
            <div style={{padding:24,textAlign:"center",color:C.gray400,fontSize:13}}>No stations match.</div>
          )}
        </div>
      </div>
    </div>
  );
}
