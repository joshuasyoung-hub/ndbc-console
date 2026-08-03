import { C } from "../../theme.js";

export function SectionHeader({title,sub}){
  return(<div style={{marginBottom:20}}>
    <h2 style={{fontSize:17,fontWeight:700,color:C.navy,margin:"0 0 4px"}}>{title}</h2>
    {sub&&<p style={{fontSize:12,color:C.gray500,margin:0}}>{sub}</p>}
  </div>);
}

export function Chip({label,color="blue",onRemove}){
  const s={blue:{bg:"#dbeafe",text:C.blueDark},green:{bg:C.greenLight,text:"#166534"},red:{bg:C.redLight,text:"#991b1b"},amber:{bg:C.amberLight,text:"#713f12"},gray:{bg:C.gray100,text:C.gray700}}[color]||{bg:"#dbeafe",text:C.blueDark};
  return(<span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:600,background:s.bg,color:s.text,whiteSpace:"nowrap"}}>
    {label}{onRemove&&<button onClick={onRemove} style={{background:"none",border:"none",cursor:"pointer",color:s.text,lineHeight:1,padding:0,fontSize:13}}>×</button>}
  </span>);
}

export function StatusPill({status}){
  const m={active:{l:"Active",c:"green"},fault:{l:"Fault",c:"red"},degraded:{l:"Degraded",c:"amber"},historic:{l:"Historic",c:"gray"},testing:{l:"Testing",c:"blue"},open:{l:"Open",c:"red"},resolved:{l:"Resolved",c:"green"}}[status?.toLowerCase()]||{l:status,c:"gray"};
  return <Chip label={m.l} color={m.c}/>;
}
