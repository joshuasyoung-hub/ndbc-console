import { useState } from "react";
import { C } from "../../theme.js";

export function Card({children,style:st}){
  return(<div style={{background:C.white,border:`1px solid ${C.gray200}`,borderRadius:12,padding:"16px 20px",...st}}>{children}</div>);
}

export function CardTitle({children}){
  return(<div style={{fontSize:12,fontWeight:700,color:C.navy,marginBottom:12,textTransform:"uppercase",letterSpacing:"0.05em"}}>{children}</div>);
}

export function Tabs({tabs,active,onChange}){
  return(<div style={{display:"flex",borderBottom:`1px solid ${C.gray200}`,marginBottom:16}}>
    {tabs.map(t=>(<button key={t} onClick={()=>onChange(t)} style={{padding:"9px 18px",border:"none",background:"transparent",cursor:"pointer",fontSize:13,fontWeight:active===t?700:400,color:active===t?C.navy:C.gray500,borderBottom:active===t?`2px solid ${C.navy}`:"2px solid transparent",marginBottom:-1,fontFamily:"inherit"}}>{t}</button>))}
  </div>);
}

export function Accordion({title,children,defaultOpen}){
  const[open,setOpen]=useState(defaultOpen||false);
  return(<div style={{border:`1px solid ${C.gray200}`,borderRadius:8,marginBottom:10,overflow:"hidden"}}>
    <div onClick={()=>setOpen(o=>!o)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",cursor:"pointer",background:C.gray50,userSelect:"none"}}>
      <span style={{fontSize:12,fontWeight:600,color:C.gray700}}>{title}</span>
      <span style={{fontSize:12,color:C.gray400,transform:open?"rotate(180deg)":"none",transition:"transform .2s"}}>▾</span>
    </div>
    {open&&<div style={{padding:14,borderTop:`1px solid ${C.gray200}`}}>{children}</div>}
  </div>);
}

export function StatBox({label,value,color}){
  return(<Card style={{padding:"14px 16px",textAlign:"center"}}>
    <div style={{fontSize:24,fontWeight:700,color:color||C.navy}}>{value}</div>
    <div style={{fontSize:11,color:C.gray500,marginTop:2}}>{label}</div>
  </Card>);
}
