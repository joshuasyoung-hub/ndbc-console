import { Fragment } from "react";
import { C } from "../theme.js";

export function TopNav({ breadcrumbs, onHome, globalSearch, setGlobalSearch }) {
  return (
    <div style={{
      background:C.navy,color:C.white,height:58,padding:"0 24px",
      display:"flex",alignItems:"center",gap:16,flexShrink:0,
      borderBottom:`1px solid ${C.navyMid}`,zIndex:20,
    }}>
      {/* Logo */}
      <button onClick={onHome} style={{
        display:"flex",alignItems:"center",gap:10,background:"none",
        border:"none",cursor:"pointer",color:C.white,padding:0,flexShrink:0,
      }}>
        <div style={{
          width:34,height:34,borderRadius:9,background:C.blue,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:15,fontWeight:900,
        }}>N</div>
        <div style={{textAlign:"left"}}>
          <div style={{fontSize:13,fontWeight:700,lineHeight:1.2,letterSpacing:"-0.2px"}}>NDBC One Console</div>
          <div style={{fontSize:9,color:"#7d96b8",lineHeight:1.2,letterSpacing:"0.05em",textTransform:"uppercase"}}>National Data Buoy Center</div>
        </div>
      </button>

      {/* Breadcrumbs */}
      <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#94a3b8",flexShrink:0}}>
        <button onClick={onHome} style={{background:"none",border:"none",cursor:"pointer",color:"#93c5fd",fontSize:12,padding:0}}>Home</button>
        {breadcrumbs.map((b,i) => (
          <Fragment key={i}>
            <span style={{opacity:.5}}>›</span>
            <span style={{color:i===breadcrumbs.length-1?C.white:"#93c5fd"}}>{b}</span>
          </Fragment>
        ))}
      </div>

      {/* Global search */}
      <div style={{flex:1,maxWidth:340,position:"relative"}}>
        <input
          value={globalSearch}
          onChange={e=>setGlobalSearch(e.target.value)}
          placeholder="Search stations, tools, parameters…"
          style={{
            width:"100%",background:"rgba(255,255,255,.08)",border:`1px solid ${C.navyMid}`,
            borderRadius:8,padding:"7px 12px 7px 34px",fontSize:12,color:C.white,
            outline:"none",boxSizing:"border-box",
          }}
        />
        <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",fontSize:13,opacity:.5}}>⌕</span>
      </div>

      <div style={{flex:1}}/>

      {/* Status */}
      <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:"#94a3b8",flexShrink:0}}>
        <span style={{width:7,height:7,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 0 3px rgba(34,197,94,.2)"}}/>
        NEMIS live
      </div>
      <div style={{width:1,height:22,background:C.navyMid,flexShrink:0}}/>
      {/* User */}
      <div style={{display:"flex",alignItems:"center",gap:9,flexShrink:0}}>
        <div style={{
          width:30,height:30,borderRadius:"50%",background:C.navyMid,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:11,fontWeight:700,color:"#93c5fd",
        }}>OA</div>
        <div style={{fontSize:12}}>
          <div style={{fontWeight:600,lineHeight:1.2}}>ops.admin</div>
          <div style={{fontSize:10,color:"#7d96b8",lineHeight:1.2}}>Console Administrator</div>
        </div>
      </div>
    </div>
  );
}
