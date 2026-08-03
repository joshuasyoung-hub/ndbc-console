import { C } from "../theme.js";

export function ContextualSidebar({ module, activeView, onView, onHome }) {
  return (
    <div style={{
      width:220,background:C.navy,overflowY:"auto",display:"flex",
      flexDirection:"column",flexShrink:0,borderRight:`1px solid ${C.navyMid}`,
    }}>
      {/* Back button */}
      <button onClick={onHome} style={{
        display:"flex",alignItems:"center",gap:8,width:"100%",background:"none",
        border:"none",borderBottom:`1px solid ${C.navyMid}`,cursor:"pointer",
        padding:"14px 16px",color:"#93c5fd",fontSize:12,fontWeight:600,textAlign:"left",
      }}
      onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.05)"}
      onMouseLeave={e=>e.currentTarget.style.background="none"}>
        <span style={{fontSize:14}}>←</span> Back to Home
      </button>

      {/* Module label */}
      <div style={{padding:"14px 16px 8px"}}>
        <div style={{
          fontSize:9,fontWeight:700,color:"#64748b",textTransform:"uppercase",
          letterSpacing:"0.1em",marginBottom:2,
        }}>{module.label}</div>
      </div>

      {/* Nav items */}
      {module.items.map(item => {
        const active = activeView === item.id;
        return (
          <button key={item.id} onClick={()=>onView(item.id)} style={{
            display:"block",width:"100%",textAlign:"left",padding:"9px 16px 9px 18px",
            fontSize:13,fontWeight:active?600:400,
            color:active?C.white:"#a8b8cc",
            background:active?C.navyMid:"transparent",
            border:"none",cursor:"pointer",
            borderLeft:active?`3px solid ${module.color}`:"3px solid transparent",
            transition:"all .12s",
          }}
          onMouseEnter={e=>{ if(!active) e.currentTarget.style.background="rgba(255,255,255,.06)"; }}
          onMouseLeave={e=>{ if(!active) e.currentTarget.style.background="transparent"; }}>
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
