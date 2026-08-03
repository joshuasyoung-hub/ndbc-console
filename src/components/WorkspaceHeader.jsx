import { C } from "../theme.js";
import { StationContextBanner } from "./StationContextBanner.jsx";

export function WorkspaceHeader({ module, viewLabel, stationId, onClearStation, onChangeStation, isFavorite, onToggleFavorite }) {
  return (
    <>
      <div style={{
        background:C.white,borderBottom:`1px solid ${C.gray200}`,
        padding:"12px 26px",flexShrink:0,
      }}>
        <div style={{fontSize:11,color:C.gray400,marginBottom:3}}>
          {module?.label} <span style={{margin:"0 5px"}}>›</span>
          <span style={{color:C.gray500,fontWeight:500}}>{viewLabel}</span>
        </div>
        <div style={{fontSize:18,fontWeight:700,color:C.navy,lineHeight:1.2}}>{viewLabel}</div>
      </div>
      {stationId&&(
        <StationContextBanner
          stationId={stationId}
          onClear={onClearStation}
          onChange={onChangeStation}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
        />
      )}
    </>
  );
}
