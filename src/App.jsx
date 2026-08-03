import { useState } from "react";
import { C } from "./theme.js";
import { MODULES, VIEW_MODULE, VIEW_LABEL, STATION_GATED_VIEWS } from "./nav.js";

import { TopNav }              from "./components/TopNav.jsx";
import { AdriftBanner }        from "./components/AdriftBanner.jsx";
import { ContextualSidebar }   from "./components/ContextualSidebar.jsx";
import { WorkspaceHeader }     from "./components/WorkspaceHeader.jsx";
import { StationSelector }     from "./components/StationSelector.jsx";
import { LandingPage }         from "./components/LandingPage.jsx";

import { DQAView }         from "./views/DQAView.jsx";
import { RawDataView }     from "./views/RawDataView.jsx";
import { TimeTabView }     from "./views/TimeTabView.jsx";
import { WaveView }        from "./views/WaveView.jsx";
import { CommsView }       from "./views/CommsView.jsx";
import { MultiPlotView }   from "./views/MultiPlotView.jsx";
import { RUDICSView }      from "./views/RUDICSView.jsx";
import { CommandMapView }  from "./views/CommandMapView.jsx";
import { TAOGridView }     from "./views/TAOGridView.jsx";
import { TAOReportsView }  from "./views/TAOReportsView.jsx";
import { QCPlotView }      from "./views/QCPlotView.jsx";
import { EngineeringView } from "./views/EngineeringView.jsx";
import { SDRView }         from "./views/SDRView.jsx";
import { EquipmentView }   from "./views/EquipmentView.jsx";
import { HierarchyView }   from "./views/HierarchyView.jsx";
import { WizardView }      from "./views/WizardView.jsx";

function renderTool(view) {
  switch(view) {
    case "dqa":         return <DQAView/>;
    case "rawdata":     return <RawDataView/>;
    case "timetab":     return <TimeTabView/>;
    case "wave":        return <WaveView/>;
    case "comms":       return <CommsView/>;
    case "multiplot":   return <MultiPlotView/>;
    case "rudics":      return <RUDICSView/>;
    case "cmdmap":      return <CommandMapView/>;
    case "taogrid":     return <TAOGridView/>;
    case "taoreports":  return <TAOReportsView/>;
    case "qcplot":      return <QCPlotView/>;
    case "engineering": return <EngineeringView/>;
    case "sdr":         return <SDRView/>;
    case "equipment":   return <EquipmentView/>;
    case "hierswap":    return <HierarchyView/>;
    case "wizard":      return <WizardView/>;
    default:            return (
      <div style={{padding:40,textAlign:"center",color:C.gray400,fontSize:14}}>
        Select a tool from the sidebar.
      </div>
    );
  }
}

export default function App() {
  // ── Routing state ─────────────────────────────────────────────
  const [page,   setPage]   = useState("home");   // "home" | "module"
  const [module, setModule] = useState(null);     // current MODULES entry
  const [view,   setView]   = useState(null);     // current tool id

  // ── Global UI state ───────────────────────────────────────────
  const [adrift,       setAdrift]       = useState(true);
  const [globalSearch, setGlobalSearch] = useState("");

  // ── Station context ───────────────────────────────────────────
  const [stationId,    setStation]      = useState(null);
  const [pickingStation, setPicking]    = useState(false);

  // ── Favorites & recents (seeded for demo) ─────────────────────
  const [recentStations,   setRecentStations]   = useState(["46402","46403"]);
  const [favoriteStations, setFavoriteStations] = useState(["46402"]);

  // ── Handlers ─────────────────────────────────────────────────
  const recordVisit = (sid) => {
    setRecentStations(prev => [sid, ...prev.filter(id => id !== sid)].slice(0, 6));
  };

  const toggleFavorite = (sid) => {
    setFavoriteStations(prev =>
      prev.includes(sid) ? prev.filter(id => id !== sid) : [sid, ...prev]
    );
  };

  const goHome = () => {
    setPage("home"); setModule(null); setView(null);
    setStation(null); setPicking(false);
  };

  const openModule = (m) => {
    setModule(m);
    setView(m.items[0].id);
    setPage("module");
    setStation(null);
    setPicking(false);
  };

  const openView = (vid) => {
    const m = VIEW_MODULE[vid];
    if (m && m.id !== module?.id) {
      setModule(m);
      setPage("module");
    }
    setView(vid);
    if (STATION_GATED_VIEWS.has(vid) && !stationId) {
      setPicking(true);
    } else {
      setPicking(false);
    }
  };

  const handleStationSelect = (sid) => {
    setStation(sid);
    setPicking(false);
    recordVisit(sid);
  };

  // Jump from landing page favorites/recents → Engineering Browser
  const jumpToStation = (sid) => {
    setStation(sid);
    recordVisit(sid);
    openView("engineering");
  };

  // ── Breadcrumbs ───────────────────────────────────────────────
  const breadcrumbs = page === "home"
    ? []
    : [module?.label, VIEW_LABEL[view] || view].filter(Boolean);

  return (
    <div style={{
      display:"flex", flexDirection:"column", height:"100vh",
      fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
      background:"#eef1f5", overflow:"hidden",
    }}>
      <style>{`
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: ${C.blue} !important;
          box-shadow: 0 0 0 3px ${C.blueLight};
        }
        ::-webkit-scrollbar { width: 7px; height: 7px; }
        ::-webkit-scrollbar-thumb { background: ${C.gray300}; border-radius: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
      `}</style>

      {/* TOP NAV — persistent */}
      <TopNav
        breadcrumbs={breadcrumbs}
        onHome={goHome}
        globalSearch={globalSearch}
        setGlobalSearch={setGlobalSearch}
      />

      {/* ADRIFT BANNER — sits directly below top nav */}
      {adrift && (
        <AdriftBanner
          onDismiss={() => setAdrift(false)}
          onLocate={() => { openView("taogrid"); setAdrift(false); }}
        />
      )}

      {page === "home" ? (
        // ── LANDING PAGE ────────────────────────────────────────
        <LandingPage
          onModule={openModule}
          onView={openView}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
          onLocate={() => openView("taogrid")}
          recentIds={recentStations}
          favoriteIds={favoriteStations}
          onToggleFavorite={toggleFavorite}
          onJumpToStation={jumpToStation}
        />
      ) : (
        // ── MODULE WORKSPACE ────────────────────────────────────
        <div style={{ display:"flex", flex:1, overflow:"hidden" }}>

          {/* Contextual sidebar — only shows current module's tools */}
          <ContextualSidebar
            module={module}
            activeView={view}
            onView={openView}
            onHome={goHome}
          />

          {/* Content area */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

            {/* Breadcrumb header + station context banner */}
            <WorkspaceHeader
              module={module}
              viewLabel={VIEW_LABEL[view] || ""}
              stationId={stationId}
              onClearStation={() => setStation(null)}
              onChangeStation={() => setPicking(true)}
              isFavorite={favoriteStations.includes(stationId)}
              onToggleFavorite={toggleFavorite}
            />

            {/* Scrollable tool content */}
            <div style={{ flex:1, overflowY:"auto" }}>
              {pickingStation ? (
                <StationSelector
                  onSelect={handleStationSelect}
                  moduleName={module?.label || ""}
                  recentIds={recentStations}
                  favoriteIds={favoriteStations}
                  onToggleFavorite={toggleFavorite}
                />
              ) : (
                <div style={{
                  padding:"24px 28px",
                  maxWidth:1280, width:"100%",
                  margin:"0 auto",
                  boxSizing:"border-box",
                }}>
                  {renderTool(view)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
