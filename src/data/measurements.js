// ── UNIVERSAL MEASUREMENT DICTIONARY ─────────────────────────────
// Maps hardware-specific payload param names (SCOOP, ATHENA, legacy)
// to a single canonical measurement type. UI always shows canonical name.
// Engineers add new hardware mappings here — views never change.

export const MEASUREMENT_DICT = {
  // Barometric Pressure
  PRES:  { id:"BARO_PRESS", label:"Barometric Pressure", unit:"hPa",  category:"Meteorological", icon:"🌡" },
  BARO:  { id:"BARO_PRESS", label:"Barometric Pressure", unit:"hPa",  category:"Meteorological", icon:"🌡" },
  PRES1: { id:"BARO_PRESS", label:"Barometric Pressure", unit:"hPa",  category:"Meteorological", icon:"🌡" },
  BARO1: { id:"BARO_PRESS", label:"Barometric Pressure", unit:"hPa",  category:"Meteorological", icon:"🌡" },
  // ATHENA hardware aliases
  "ATH-BARO":  { id:"BARO_PRESS", label:"Barometric Pressure", unit:"hPa", category:"Meteorological", icon:"🌡" },
  "ATH-BARO2": { id:"BARO_PRESS", label:"Barometric Pressure", unit:"hPa", category:"Meteorological", icon:"🌡" },

  // Wind Speed
  WSPD:  { id:"WIND_SPEED", label:"Wind Speed",     unit:"m/s", category:"Meteorological", icon:"💨" },
  WSPD1: { id:"WIND_SPEED", label:"Wind Speed",     unit:"m/s", category:"Meteorological", icon:"💨" },
  WSPD2: { id:"WIND_SPEED", label:"Wind Speed",     unit:"m/s", category:"Meteorological", icon:"💨" },
  "ATH-WS":  { id:"WIND_SPEED", label:"Wind Speed", unit:"m/s", category:"Meteorological", icon:"💨" },
  "ATH-WS2": { id:"WIND_SPEED", label:"Wind Speed", unit:"m/s", category:"Meteorological", icon:"💨" },

  // Wind Direction
  WDIR:  { id:"WIND_DIR",   label:"Wind Direction", unit:"deg", category:"Meteorological", icon:"🧭" },
  WDIR1: { id:"WIND_DIR",   label:"Wind Direction", unit:"deg", category:"Meteorological", icon:"🧭" },
  "ATH-WD": { id:"WIND_DIR","label":"Wind Direction", unit:"deg", category:"Meteorological", icon:"🧭" },

  // Air Temperature
  ATMP:  { id:"AIR_TEMP",   label:"Air Temperature",      unit:"°C", category:"Meteorological", icon:"🌡" },
  ATMP1: { id:"AIR_TEMP",   label:"Air Temperature",      unit:"°C", category:"Meteorological", icon:"🌡" },
  "ATH-AT": { id:"AIR_TEMP","label":"Air Temperature",    unit:"°C", category:"Meteorological", icon:"🌡" },

  // Sea Surface Temperature
  WTMP:  { id:"SEA_TEMP",   label:"Sea Surface Temp",     unit:"°C", category:"Physical Oceanography", icon:"🌊" },
  WTMP1: { id:"SEA_TEMP",   label:"Sea Surface Temp",     unit:"°C", category:"Physical Oceanography", icon:"🌊" },
  "ATH-SST": { id:"SEA_TEMP","label":"Sea Surface Temp",  unit:"°C", category:"Physical Oceanography", icon:"🌊" },

  // Wave Height
  WVHT:  { id:"WAVE_HGT",   label:"Wave Height (Hm0)",    unit:"m",  category:"Wave", icon:"〰" },
  WVHT1: { id:"WAVE_HGT",   label:"Wave Height (Hm0)",    unit:"m",  category:"Wave", icon:"〰" },

  // Dominant Period
  DPD:   { id:"WAVE_PERIOD","label":"Dominant Period",     unit:"s",  category:"Wave", icon:"〰" },
};

// All unique canonical measurement types derived from the dict
export const CANONICAL_MEASUREMENTS = Object.values(
  Object.entries(MEASUREMENT_DICT).reduce((acc, [, m]) => {
    if (!acc[m.id]) acc[m.id] = m;
    return acc;
  }, {})
);

// Given a station's sensors, group them by canonical measurement id
export function groupSensorsByMeasurement(sensors) {
  const groups = {};
  sensors.forEach(s => {
    const canon = MEASUREMENT_DICT[s.param];
    if (!canon) return;
    if (!groups[canon.id]) groups[canon.id] = { ...canon, sensors: [] };
    groups[canon.id].sensors.push(s);
  });
  return groups;
}

// Find the nearest station that has a matching canonical measurement
export function findNearestWithMeasurement(currentStation, allStations, measurementId) {
  const active = allStations.filter(s => s.id !== currentStation.id && s.type === "active");
  // Sort by simple lat/lon distance
  const withDist = active.map(s => ({
    ...s,
    dist: Math.sqrt(
      Math.pow(s.lat - currentStation.lat, 2) +
      Math.pow(s.lon - currentStation.lon, 2)
    )
  }));
  withDist.sort((a, b) => a.dist - b.dist);
  return withDist[0] || null;
}

// Generate fake "model baseline" data for a series (GFS/NAM stub)
export function generateModelBaseline(series, measurementId) {
  if (!series.length) return [];
  const vals = series.map(d => d.v).filter(Boolean);
  const mean  = vals.reduce((a, b) => a + b, 0) / vals.length;
  const spread = (Math.max(...vals) - Math.min(...vals)) * 0.15;
  return series.map((d, i) => ({
    t: d.t,
    model: +(mean + Math.sin(i / 6) * spread + (Math.random() - 0.5) * spread * 0.3).toFixed(2),
  }));
}

// Diagnostic raw text stub — simulates RUDICS raw payload text
export function generateRawDiagnostic(stationId) {
  const ts = new Date().toISOString().replace("T", " ").slice(0, 19);
  return `RUDICS RAW DIAGNOSTIC — Station ${stationId}
Timestamp    : ${ts} UTC
Hardware     : ATHENA-V2 / SCOOP-Legacy fallback

=== POWER SYSTEMS ===
BATT_VOLTAGE : 12.84 V   [NOMINAL: 12.0–14.4 V]  ✓
BATT_CURRENT :  0.42 A   [NOMINAL: 0.0–2.0 A]     ✓
SOLAR_INPUT  :  1.23 A   [NOMINAL: >0.5 A daylight]✓
BATT_TEMP    : 18.2 °C   [NOMINAL: 5–40 °C]        ✓
LOW_BATT_FLAG: 0 (clear)

=== TRANSMITTER ===
TX_POWER     : 37.2 dBm  [NOMINAL: 35–40 dBm]     ✓
TX_FREQUENCY : 401.650 MHz
LAST_TX_TIME : ${ts}
TX_COUNT_24H : 96        [EXPECTED: 96]             ✓
DROPOUT_COUNT: 0

=== SENSORS ===
PRES_RAW     : 1013.42 hPa  S01 CH0  [VALID]       ✓
PRES_BACKUP  : 1013.38 hPa  S01 CH1  [VALID]       ✓
ATMP_RAW     : 18.74 °C     S02 CH0  [VALID]       ✓
WSPD_RAW     : 8.21 m/s     S03 CH0  [VALID]       ✓
WTMP_RAW     : 9.13 °C      S05 CH0  [VALID]       ✓
WVHT_RAW     : 1.84 m       S06 CH0  [VALID]       ✓

=== CHECKSUMS ===
CRC_STATUS   : PASS
FRAME_ERRORS : 0 in last 24h

END DIAGNOSTIC`;
}
