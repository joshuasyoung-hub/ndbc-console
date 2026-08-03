import { C } from "../../theme.js";

export function Table({cols,rows,onRow}){
  return(<div style={{border:`1px solid ${C.gray200}`,borderRadius:12,overflow:"hidden"}}>
    <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
      <thead>
        <tr style={{background:C.gray50}}>
          {cols.map(c=>(<th key={c.key||c.label} style={{padding:"8px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.05em",borderBottom:`1px solid ${C.gray200}`,whiteSpace:"nowrap"}}>{c.label}</th>))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row,i)=>(<tr key={i} onClick={onRow?()=>onRow(row):undefined} style={{borderBottom:i<rows.length-1?`1px solid ${C.gray100}`:"none",cursor:onRow?"pointer":"default"}} onMouseEnter={e=>{if(onRow)e.currentTarget.style.background=C.gray50;}} onMouseLeave={e=>{if(onRow)e.currentTarget.style.background="transparent";}}>
          {cols.map(c=>(<td key={c.key||c.label} style={{padding:"10px 14px",color:C.gray700,fontFamily:c.mono?C.mono:"inherit",fontWeight:c.bold?600:400}}>{c.render?c.render(row[c.key],row):(row[c.key]??"")}</td>))}
        </tr>))}
        {rows.length===0&&(<tr><td colSpan={cols.length} style={{padding:32,textAlign:"center",color:C.gray400,fontSize:13}}>No records found.</td></tr>)}
      </tbody>
    </table>
  </div>);
}
