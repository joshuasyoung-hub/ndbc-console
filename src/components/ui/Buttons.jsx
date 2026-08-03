import { C } from "../../theme.js";

export function Btn({children,onClick,variant="default",sm,disabled,full,style:extra}){
  const base={display:"inline-flex",alignItems:"center",justifyContent:"center",gap:5,padding:sm?"5px 12px":"8px 16px",borderRadius:8,border:`1px solid ${C.gray200}`,background:C.white,cursor:disabled?"not-allowed":"pointer",fontSize:sm?11:13,color:C.gray700,fontFamily:"inherit",whiteSpace:"nowrap",opacity:disabled?0.45:1,width:full?"100%":"auto"};
  const v={primary:{background:C.blue,borderColor:"#1d4ed8",color:C.white},success:{background:C.green,borderColor:"#15803d",color:C.white},danger:{background:C.red,borderColor:"#b91c1c",color:C.white}}[variant]||{};
  return(<button onClick={disabled?undefined:onClick} disabled={disabled} style={{...base,...v,...extra}}>{children}</button>);
}

export function Toggle({on,onClick,warn}){
  return(<button onClick={onClick} style={{width:38,height:21,borderRadius:21,border:"none",cursor:"pointer",position:"relative",background:on?(warn?"#ea580c":C.blue):C.gray300,transition:"background .2s",flexShrink:0}}>
    <span style={{position:"absolute",width:15,height:15,background:C.white,borderRadius:"50%",top:3,left:on?20:3,boxShadow:"0 1px 3px rgba(0,0,0,.2)",transition:"left .2s"}}/>
  </button>);
}
