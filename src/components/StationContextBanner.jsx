import { C } from "../theme.js";
import { ALL_STATIONS } from "../data/stations.js";
import { StatusPill } from "./ui/index.js";

export function StationContextBanner({ stationId, onClear, onChange, isFavorite, onToggleFavorite }) {
  const st = ALL_STATIONS.find(s=>s.id===stationId);
  if(!stationId || !st) return null;
  return (
    <div style={{
      background:"#f0f9ff",borderBottom:`1px solid #bae6fd`,
      padding:"8px 24px",display:"flex",alignItems:"center",gap:12,flexShrink:0,
    }}>
      <div style={{
        background:C.blue,color:C.white,fontSize:10,fontWeight:700,
        borderRadius:4,padding:"2px 7px",letterSpacing:"0.05em",flexShrink:0,
      }}>STATION</div>
      <span style={{fontSize:13,fontWeight:700,color:C.navy,fontFamily:C.mono}}>{st.id}</span>
      <span style={{fontSize:13,color:C.gray500}}>{st.name}</span>
      <span style={{fontSize:11,color:C.gray400}}>·</span>
      <span style={{fontSize:12,color:C.gray500}}>{st.hull} · {st.lat}°N, {Math.abs(st.lon)}°W · {st.depth} m</span>
      <StatusPill status={st.type}/>
      <button
        onClick={()=>onToggleFavorite && onToggleFavorite(st.id)}
        title={isFavorite?"Remove from favorites":"Add to favorites"}
        style={{
          background:"none",border:"none",cursor:"pointer",fontSize:15,padding:0,
          color:isFavorite?"#eab308":C.gray300,flexShrink:0,
        }}
      >{isFavorite?"★":"☆"}</button>
      <div style={{flex:1}}/>
      <button onClick={onChange} style={{
        fontSize:12,color:C.blue,background:"none",border:`1px solid #bae6fd`,
        borderRadius:6,padding:"3px 10px",cursor:"pointer",fontFamily:"inherit",
      }}>Change</button>
      <button onClick={onClear} style={{
        fontSize:12,color:C.gray400,background:"none",border:"none",
        cursor:"pointer",fontFamily:"inherit",padding:"3px 6px",
      }}>✕</button>
    </div>
  );
}
