import { C } from "../theme.js";

export function AdriftBanner({ onDismiss, onLocate }) {
  return (
    <div style={{
      background:"linear-gradient(90deg,#7f1d1d,#991b1b)",color:C.white,
      padding:"10px 24px",display:"flex",alignItems:"center",gap:14,
      fontSize:13,flexShrink:0,borderBottom:"1px solid #450a0a",
    }}>
      <span style={{fontSize:16,flexShrink:0}}>⚠</span>
      <div style={{flex:1,minWidth:0}}>
        <strong>Critical anomaly.</strong>{" "}
        <span style={{color:"#fecaca"}}>TAO Station 4N_125W has drifted outside the 3 NM watch circle (Region A20P).</span>
      </div>
      <button onClick={onLocate} style={{
        background:"rgba(255,255,255,.12)",border:"1px solid rgba(255,255,255,.3)",
        color:C.white,borderRadius:6,padding:"5px 14px",fontSize:12,fontWeight:600,
        cursor:"pointer",flexShrink:0,whiteSpace:"nowrap",
      }}>View on map</button>
      <button onClick={onDismiss} style={{
        background:"transparent",border:"none",color:"#fecaca",
        cursor:"pointer",fontSize:20,lineHeight:1,flexShrink:0,padding:0,
      }}>✕</button>
    </div>
  );
}
