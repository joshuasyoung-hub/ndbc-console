import { useState, Fragment } from "react";
import { SectionHeader, Chip } from "../components/ui/index.js";
import { C } from "../theme.js";
import { TAO_LATS, TAO_LONS, TAO_NODES, TAO_STATUS_META } from "../data/tao.js";

export function TAOGridView(){
  const[hovered,setHovered]=useState(null);
  return(<div>
    <SectionHeader title="TAO Interactive Grid Map" sub="Equatorial Pacific array — hover nodes for station detail. 8°N to 8°S × 95°W to 180°W"/>
    <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}>
      {Object.entries(TAO_STATUS_META).map(([k,m])=>(
        <Chip key={k} label={`${m.label} · ${TAO_NODES.filter(n=>n.status===k).length}`} color={k==="green"?"green":k==="yellow"?"amber":"red"}/>
      ))}
    </div>
    <div style={{background:C.white,border:`1px solid ${C.gray200}`,borderRadius:12,padding:20,overflowX:"auto"}}>
      <div style={{display:"grid",gridTemplateColumns:`54px repeat(${TAO_LONS.length},1fr)`,gap:6,minWidth:660}}>
        <div/>
        {TAO_LONS.map(lon=>(<div key={lon} style={{textAlign:"center",fontSize:9,color:C.gray400,fontWeight:600}}>{Math.abs(lon)}°W</div>))}
        {TAO_LATS.map(lat=>(
          <Fragment key={lat}>
            <div style={{display:"flex",alignItems:"center",fontSize:9,color:C.gray400,fontWeight:600}}>{Math.abs(lat)}°{lat>=0?"N":"S"}</div>
            {TAO_LONS.map(lon=>{
              const node=TAO_NODES.find(n=>n.lat===lat&&n.lon===lon);
              if(!node)return <div key={`${lat}-${lon}`}/>;
              const meta=TAO_STATUS_META[node.status];
              return(
                <div key={node.id} style={{display:"flex",justifyContent:"center",position:"relative"}}
                  onMouseEnter={()=>setHovered(node)} onMouseLeave={()=>setHovered(h=>h?.id===node.id?null:h)}>
                  <div style={{width:30,height:30,borderRadius:"50%",background:meta.color,color:C.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,cursor:"pointer",border:node.adrift?"2px solid #1e293b":"2px solid transparent",boxShadow:hovered?.id===node.id?`0 0 0 4px ${meta.color}33`:"none",transition:"box-shadow .12s"}}>
                    {meta.mark||""}
                  </div>
                  {hovered?.id===node.id&&(
                    <div style={{position:"absolute",top:36,zIndex:20,background:C.navy,color:C.gray200,borderRadius:8,padding:"10px 12px",fontSize:11,width:180,boxShadow:"0 8px 24px rgba(0,0,0,.25)"}}>
                      <div style={{fontWeight:700,marginBottom:4,fontFamily:C.mono}}>{node.id}</div>
                      {[["Coverage",node.pct+"%"],["Deployed",node.deploy],["Last",node.last],["Watch","3 NM"]].map(([k,v])=>(
                        <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"2px 0"}}>
                          <span style={{color:C.gray400}}>{k}</span><span>{v}</span>
                        </div>
                      ))}
                      {node.adrift&&<div style={{marginTop:4,color:"#fb923c",fontWeight:600}}>Outside watch circle</div>}
                    </div>
                  )}
                </div>
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  </div>);
}
