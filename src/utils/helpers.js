// ── HELPERS ───────────────────────────────────────────────────────
export const fmtNow = () => {
  const n = new Date(), p = v => String(v).padStart(2,"0");
  return `${n.getFullYear()}-${p(n.getMonth()+1)}-${p(n.getDate())} ${p(n.getHours())}:${p(n.getMinutes())}`;
};

export const seed = (i,lo,hi) => +(lo+Math.abs(Math.sin(i*1.7+0.3))*(hi-lo)).toFixed(2);

export const decToDMS = (dec, isLat) => {
  if(!dec||isNaN(parseFloat(dec))) return "";
  const d=Math.abs(dec),deg=Math.floor(d),min=Math.floor((d-deg)*60);
  const sec=(((d-deg)*60-min)*60).toFixed(2);
  const dir=isLat?(dec>=0?"N":"S"):(dec>=0?"E":"W");
  return `${deg}° ${min}' ${sec}" ${dir}`;
};

// Convert between "YYYY-MM-DD HH:mm" (display) and "YYYY-MM-DDTHH:mm" (datetime-local input value)
export const toInputVal   = v => v ? v.replace(" ","T").slice(0,16) : "";
export const fromInputVal = v => v ? v.replace("T"," ") : "";

// Equirectangular map projection: x = (lon+180)/360 * W, y = (90-lat)/180 * H
export const PROJ_W = 520, PROJ_H = 290;
export function project(lat, lon) {
  const x = ((lon + 180) / 360) * PROJ_W;
  const y = ((90 - lat) / 180) * PROJ_H;
  return [x, y];
}
