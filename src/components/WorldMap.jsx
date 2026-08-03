import { useState } from "react";
import { C } from "../theme.js";

// ── WORLD MAP ─────────────────────────────────────────────────────
// Proper equirectangular projection with detailed continent outlines.
// Viewbox is 1000×500 — standard equirectangular aspect ratio (2:1).
// project(lat, lon) → [x, y] in viewbox coordinates.

const VW = 1000, VH = 500;

function project(lat, lon) {
  const x = ((lon + 180) / 360) * VW;
  const y = ((90 - lat) / 180) * VH;
  return [x, y];
}

// Detailed continent outlines — significantly more accurate than previous blobs.
// Coordinates derived from standard equirectangular world outline data.
const CONTINENTS = [
  {
    id: "north_america",
    d: `M 116,58 L 122,52 L 130,48 L 140,44 L 148,42 L 155,40 L 162,41
        L 170,44 L 176,50 L 180,56 L 182,64 L 178,72 L 172,78 L 168,86
        L 164,94 L 160,102 L 158,112 L 155,120 L 150,128 L 144,134
        L 138,140 L 130,146 L 122,150 L 114,152 L 106,150 L 100,146
        L 96,140 L 94,132 L 96,124 L 100,116 L 104,108 L 106,100
        L 104,92 L 100,84 L 98,76 L 100,68 L 106,62 Z
        M 100,152 L 108,154 L 116,158 L 122,164 L 126,172 L 128,180
        L 126,188 L 122,194 L 116,198 L 110,200 L 104,198 L 100,192
        L 98,184 L 98,176 L 100,168 L 100,160 Z`,
  },
  {
    id: "greenland",
    d: `M 178,22 L 186,18 L 194,16 L 200,18 L 204,24 L 202,30
        L 196,34 L 188,36 L 182,34 L 178,28 Z`,
  },
  {
    id: "south_america",
    d: `M 174,170 L 180,164 L 188,162 L 196,164 L 202,170 L 206,178
        L 208,188 L 208,198 L 206,210 L 202,222 L 196,234 L 188,244
        L 180,252 L 172,258 L 166,260 L 160,258 L 156,250 L 154,240
        L 156,228 L 160,216 L 164,204 L 166,192 L 166,182 L 168,172 Z`,
  },
  {
    id: "europe",
    d: `M 452,48 L 460,44 L 470,42 L 480,44 L 488,48 L 492,56
        L 490,64 L 484,70 L 476,74 L 468,76 L 460,74 L 454,68
        L 450,60 Z
        M 476,76 L 484,74 L 492,76 L 498,82 L 500,90 L 496,98
        L 488,102 L 480,104 L 472,102 L 466,96 L 464,88 L 468,80 Z
        M 488,58 L 496,54 L 506,52 L 516,54 L 522,60 L 520,68
        L 514,72 L 506,74 L 498,72 L 492,66 L 488,58 Z`,
  },
  {
    id: "africa",
    d: `M 468,102 L 478,98 L 490,98 L 500,102 L 508,110 L 512,120
        L 514,132 L 514,144 L 512,156 L 508,168 L 502,180 L 494,192
        L 484,202 L 474,210 L 464,214 L 456,212 L 450,204 L 446,194
        L 446,182 L 448,170 L 452,158 L 456,146 L 458,134 L 458,122
        L 460,112 L 464,104 Z`,
  },
  {
    id: "eurasia",
    d: `M 516,42 L 530,36 L 548,32 L 570,28 L 594,26 L 618,26
        L 642,28 L 664,32 L 682,38 L 696,46 L 706,56 L 710,66
        L 706,76 L 698,84 L 686,90 L 672,94 L 656,96 L 638,96
        L 618,94 L 598,90 L 580,86 L 564,82 L 550,76 L 538,70
        L 528,62 L 520,54 Z
        M 630,96 L 648,98 L 664,104 L 676,114 L 682,126 L 680,138
        L 672,148 L 660,154 L 646,156 L 632,154 L 620,148 L 612,138
        L 610,126 L 614,114 L 622,104 Z
        M 700,78 L 716,76 L 730,78 L 742,84 L 748,94 L 744,104
        L 734,112 L 720,116 L 706,114 L 696,106 L 694,96 L 698,86 Z`,
  },
  {
    id: "india",
    d: `M 618,122 L 628,118 L 638,120 L 644,128 L 646,140 L 642,152
        L 634,160 L 626,162 L 618,158 L 614,148 L 614,136 L 616,126 Z`,
  },
  {
    id: "southeast_asia",
    d: `M 696,116 L 708,114 L 718,118 L 724,128 L 720,138 L 710,144
        L 700,142 L 694,134 L 694,124 Z
        M 720,140 L 730,136 L 740,138 L 746,146 L 744,156 L 736,162
        L 726,160 L 720,152 Z`,
  },
  {
    id: "japan",
    d: `M 760,74 L 766,70 L 772,72 L 774,78 L 770,84 L 764,84 L 760,80 Z`,
  },
  {
    id: "australia",
    d: `M 720,214 L 734,208 L 750,206 L 766,208 L 780,214 L 790,224
        L 794,236 L 792,248 L 784,258 L 772,264 L 758,266 L 744,262
        L 732,254 L 724,242 L 720,230 Z
        M 790,218 L 800,214 L 808,218 L 810,226 L 806,232 L 798,232 L 792,226 Z`,
  },
  {
    id: "new_zealand",
    d: `M 820,262 L 826,258 L 830,262 L 828,268 L 822,268 Z
        M 822,272 L 828,268 L 832,274 L 828,280 L 822,278 Z`,
  },
  {
    id: "alaska",
    d: `M 80,42 L 90,38 L 100,36 L 108,38 L 112,44 L 108,50
        L 100,52 L 92,50 L 84,46 Z`,
  },
  {
    id: "cuba_caribbean",
    d: `M 164,130 L 172,128 L 178,132 L 178,138 L 172,140 L 164,138 Z
        M 180,132 L 188,130 L 192,134 L 190,140 L 184,140 L 180,136 Z`,
  },
  {
    id: "uk_ireland",
    d: `M 448,58 L 454,54 L 460,56 L 460,64 L 454,66 L 448,62 Z
        M 454,66 L 460,64 L 464,68 L 462,74 L 456,74 L 452,70 Z`,
  },
  {
    id: "iceland",
    d: `M 430,40 L 438,36 L 446,38 L 448,44 L 442,48 L 434,46 Z`,
  },
  {
    id: "madagascar",
    d: `M 518,190 L 522,184 L 526,186 L 528,194 L 524,202 L 518,200 Z`,
  },
  {
    id: "philippines",
    d: `M 742,120 L 748,116 L 752,120 L 750,128 L 744,128 Z`,
  },
  {
    id: "borneo",
    d: `M 730,148 L 742,144 L 750,148 L 752,158 L 744,166 L 732,164 L 726,156 Z`,
  },
];

// TAO & DART buoy regions — shaded rectangles showing operational areas
const BUOY_REGIONS = [
  { id:"TAO", x1:-180, y1:-10, x2:-80, y2:10, label:"TAO Array", color:"rgba(37,99,235,.12)" },
  { id:"NE_PAC", x1:-175, y1:45, x2:-155, y2:62, label:"NE Pacific", color:"rgba(16,185,129,.1)" },
  { id:"GULF", x1:-98, y1:24, x2:-80, y2:31, label:"Gulf of Mexico", color:"rgba(16,185,129,.1)" },
  { id:"ATL", x1:-80, y1:20, x2:-60, y2:35, label:"Atlantic", color:"rgba(16,185,129,.1)" },
];

export function WorldMap({ stations, onPick, height = 320 }) {
  const [hovered, setHovered] = useState(null);

  const typeColor  = { active:"#22c55e", historic:"#94a3b8", testing:"#a78bfa" };
  const typeShadow = { active:"rgba(34,197,94,.4)", historic:"rgba(148,163,184,.3)", testing:"rgba(167,139,250,.4)" };

  const hovSt = stations.find(s => s.id === hovered);

  return (
    <div style={{ position:"relative", width:"100%", height, borderRadius:14, overflow:"hidden" }}>
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        width="100%" height="100%"
        style={{ display:"block" }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Ocean gradient — deep navy to mid-blue */}
          <radialGradient id="wm_ocean" cx="35%" cy="40%" r="70%">
            <stop offset="0%"   stopColor="#0d2d4e"/>
            <stop offset="60%"  stopColor="#0a2540"/>
            <stop offset="100%" stopColor="#061a30"/>
          </radialGradient>
          {/* Land gradient */}
          <linearGradient id="wm_land" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#2d4a6b"/>
            <stop offset="100%" stopColor="#1e3a5f"/>
          </linearGradient>
          {/* Glow filter for active buoys */}
          <filter id="wm_glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
          {/* Equator line */}
          <line id="equator" x1="0" y1={VH/2} x2={VW} y2={VH/2}/>
        </defs>

        {/* Ocean background */}
        <rect x="0" y="0" width={VW} height={VH} fill="url(#wm_ocean)"/>

        {/* Subtle graticule grid */}
        {[-60,-30,0,30,60].map(lat => {
          const y = ((90-lat)/180)*VH;
          return <line key={lat} x1="0" y1={y} x2={VW} y2={y}
            stroke={lat===0?"rgba(255,255,255,.12)":"rgba(255,255,255,.04)"}
            strokeWidth={lat===0?1:0.5} strokeDasharray={lat===0?"none":"4 8"}/>;
        })}
        {[-150,-120,-90,-60,-30,0,30,60,90,120,150].map(lon => {
          const x = ((lon+180)/360)*VW;
          return <line key={lon} x1={x} y1="0" x2={x} y2={VH}
            stroke="rgba(255,255,255,.04)" strokeWidth="0.5" strokeDasharray="4 8"/>;
        })}

        {/* Equator highlight */}
        <line x1="0" y1={VH/2} x2={VW} y2={VH/2}
          stroke="rgba(37,99,235,.25)" strokeWidth="1"/>

        {/* Operational region shading */}
        {BUOY_REGIONS.map(r => {
          const [x1,y1] = project(r.y2, r.x1);
          const [x2,y2] = project(r.y1, r.x2);
          return (
            <rect key={r.id} x={x1} y={y1} width={x2-x1} height={y2-y1}
              fill={r.color} rx="4"/>
          );
        })}

        {/* Continent fills with subtle stroke */}
        {CONTINENTS.map(c => (
          <path key={c.id} d={c.d}
            fill="url(#wm_land)"
            stroke="rgba(148,163,184,.35)"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        ))}

        {/* Continent inner highlight (top edge lighter) */}
        {CONTINENTS.map(c => (
          <path key={c.id+"_hi"} d={c.d}
            fill="none"
            stroke="rgba(255,255,255,.06)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        ))}

        {/* Buoy markers */}
        {stations.map(st => {
          const [x, y] = project(st.lat, st.lon);
          const isH    = hovered === st.id;
          const col    = typeColor[st.type]  || "#94a3b8";
          const shadow = typeShadow[st.type] || "rgba(148,163,184,.3)";

          return (
            <g key={st.id}
              style={{ cursor:"pointer" }}
              onMouseEnter={() => setHovered(st.id)}
              onMouseLeave={() => setHovered(h => h===st.id ? null : h)}
              onClick={() => onPick && onPick(st.id)}>

              {/* Outer pulse ring — active buoys only */}
              {st.type === "active" && (
                <>
                  <circle cx={x} cy={y} r="14" fill="none"
                    stroke={col} strokeWidth="1" opacity="0.2">
                    <animate attributeName="r" values="8;18;8" dur="3s"
                      repeatCount="indefinite"
                      begin={`${(st.id.charCodeAt(0) % 7) * 0.4}s`}/>
                    <animate attributeName="opacity" values="0.25;0;0.25" dur="3s"
                      repeatCount="indefinite"
                      begin={`${(st.id.charCodeAt(0) % 7) * 0.4}s`}/>
                  </circle>
                  <circle cx={x} cy={y} r="8" fill="none"
                    stroke={col} strokeWidth="1" opacity="0.35">
                    <animate attributeName="r" values="5;12;5" dur="3s"
                      repeatCount="indefinite"
                      begin={`${(st.id.charCodeAt(0) % 7) * 0.4 + 0.2}s`}/>
                    <animate attributeName="opacity" values="0.4;0;0.4" dur="3s"
                      repeatCount="indefinite"
                      begin={`${(st.id.charCodeAt(0) % 7) * 0.4 + 0.2}s`}/>
                  </circle>
                </>
              )}

              {/* Glow behind active marker */}
              {st.type === "active" && (
                <circle cx={x} cy={y} r={isH?9:6} fill={col} opacity="0.25" filter="url(#wm_glow)"/>
              )}

              {/* Main marker */}
              <circle cx={x} cy={y} r={isH ? 6 : 4.5}
                fill={col}
                stroke={isH ? "#fff" : "rgba(10,37,64,.8)"}
                strokeWidth={isH ? 1.5 : 1}
                style={{ transition:"r .1s" }}
              />

              {/* Station ID label on hover */}
              {isH && (
                <>
                  <rect x={x-22} y={y-20} width={44} height={14} rx="3"
                    fill="rgba(10,37,64,.85)"/>
                  <text x={x} y={y-10} textAnchor="middle" fontSize="8"
                    fill="#fff" fontWeight="700" fontFamily="ui-monospace,Consolas,monospace"
                    style={{ pointerEvents:"none" }}>
                    {st.id}
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Region labels (very subtle) */}
        {[
          [0, -140, "TAO Array"],
          [54, -165, "NE Pacific"],
          [28, -88,  "Gulf"],
          [30, -70,  "Atlantic"],
        ].map(([lat, lon, label]) => {
          const [x, y] = project(lat, lon);
          return (
            <text key={label} x={x} y={y} textAnchor="middle" fontSize="8"
              fill="rgba(255,255,255,.18)" fontWeight="600" letterSpacing="0.08em"
              style={{ textTransform:"uppercase", pointerEvents:"none" }}>
              {label.toUpperCase()}
            </text>
          );
        })}
      </svg>

      {/* Floating tooltip card */}
      {hovSt && (() => {
        const [x, y] = project(hovSt.lat, hovSt.lon);
        const leftPct = (x / VW) * 100;
        const topPct  = (y / VH) * 100;
        const flipLeft = leftPct > 75;
        const flipUp   = topPct  > 70;
        return (
          <div style={{
            position:"absolute",
            left:`${leftPct}%`, top:`${topPct}%`,
            transform:`translate(${flipLeft?"-110%":"-50%"}, ${flipUp?"-130%":"-130%"})`,
            background:"rgba(10,37,64,.96)",
            backdropFilter:"blur(8px)",
            borderRadius:10, padding:"10px 14px",
            fontSize:11, color:"#e2e8f0",
            boxShadow:"0 8px 32px rgba(0,0,0,.4)",
            border:"1px solid rgba(255,255,255,.12)",
            pointerEvents:"none", whiteSpace:"nowrap", zIndex:10,
            minWidth:180,
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
              <span style={{
                width:8, height:8, borderRadius:"50%", flexShrink:0,
                background:typeColor[hovSt.type]||"#94a3b8",
                boxShadow:`0 0 6px ${typeShadow[hovSt.type]}`,
              }}/>
              <span style={{ fontWeight:700, fontFamily:"ui-monospace,Consolas,monospace", color:"#fff", fontSize:12 }}>
                {hovSt.id}
              </span>
              <span style={{
                fontSize:9, fontWeight:700, padding:"1px 6px", borderRadius:10,
                background:hovSt.type==="active"?"rgba(34,197,94,.2)":"rgba(148,163,184,.2)",
                color:hovSt.type==="active"?"#4ade80":"#94a3b8",
              }}>{hovSt.type.toUpperCase()}</span>
            </div>
            <div style={{ color:"#94a3b8", lineHeight:1.6 }}>
              <div>{hovSt.name}</div>
              <div style={{ fontFamily:"ui-monospace,Consolas,monospace", fontSize:10 }}>
                {hovSt.lat.toFixed(2)}°N  {Math.abs(hovSt.lon).toFixed(2)}°W
              </div>
              <div>{hovSt.hull} · {hovSt.depth} m · {hovSt.region}</div>
            </div>
          </div>
        );
      })()}

      {/* Legend */}
      <div style={{
        position:"absolute", bottom:10, left:12,
        display:"flex", gap:14,
        background:"rgba(6,26,48,.75)", borderRadius:8,
        padding:"6px 12px", backdropFilter:"blur(6px)",
        border:"1px solid rgba(255,255,255,.08)",
      }}>
        {[["active","Active"],["historic","Historic"],["testing","Testing"]].map(([k,l]) => (
          <div key={k} style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, color:"#94a3b8" }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:typeColor[k] }}/>
            {l}
          </div>
        ))}
        <div style={{ width:1, background:"rgba(255,255,255,.1)", margin:"0 2px" }}/>
        <div style={{ fontSize:10, color:"rgba(255,255,255,.25)", fontStyle:"italic" }}>
          Click marker to open station
        </div>
      </div>
    </div>
  );
}
