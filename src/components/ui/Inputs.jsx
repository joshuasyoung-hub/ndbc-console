import { C } from "../../theme.js";
import { fmtNow, toInputVal, fromInputVal } from "../../utils/helpers.js";

export function DTInput({label,value,onChange,style:st}){
  return(<div style={st}>
    {label&&<label style={{fontSize:11,fontWeight:600,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:4}}>{label}</label>}
    <div style={{display:"flex",border:`1px solid ${C.gray200}`,borderRadius:8,overflow:"hidden",background:C.white,transition:"border-color .15s"}}>
      <input
        type="datetime-local"
        value={toInputVal(value)}
        onChange={e=>onChange(fromInputVal(e.target.value))}
        style={{
          flex:1,border:"none",outline:"none",padding:"6px 10px",fontSize:12,
          fontFamily:C.mono,background:"transparent",color:value?C.gray900:C.gray400,
          minWidth:0,cursor:"pointer",
        }}
      />
      <button
        onClick={()=>onChange(fmtNow())}
        style={{
          padding:"0 10px",border:"none",borderLeft:`1px solid ${C.gray200}`,
          background:C.blueLight,cursor:"pointer",fontSize:11,fontWeight:700,
          color:C.blueDark,flexShrink:0,whiteSpace:"nowrap",
        }}
      >Now</button>
    </div>
    {value&&<div style={{fontSize:10,color:C.gray400,marginTop:3,fontFamily:C.mono}}>{value}</div>}
  </div>);
}

export function Field({label,children,style:st}){
  return(<div style={st}>
    {label&&<label style={{fontSize:11,fontWeight:600,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:5}}>{label}</label>}
    {children}
  </div>);
}

export const inputStyle={width:"100%",border:`1px solid ${C.gray200}`,borderRadius:8,padding:"7px 10px",fontSize:13,background:C.white,color:C.gray900,fontFamily:"inherit",boxSizing:"border-box",outline:"none"};
export const selectStyle={...inputStyle};
