"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import DesktopOpenBetsRightNav from "./desktop-open-bets";

const DEFAULT_COLUMNS = [
  { label: "Selection", width: 100, align: "left" },
  { label: "Rate", width: 55, align: "left" },
  { label: "Amount", width: 100, align: "right" },
  { label: "Market Name", width: 110, align: "left" },
  { label: "Exposure", width: 100, align: "right" },
  { label: "Placed At", width: 195, align: "left" },
  { label: "IP", width: 80, align: "left" },
  { label: "Status", width: 80, align: "left" },
];

function PortalDropdown({ items, onClose, anchorRect }: {
  items: { icon?: React.ReactNode; label: React.ReactNode; dividerAfter?: boolean; selected?: boolean }[];
  onClose: () => void;
  anchorRect: DOMRect;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return createPortal(
    <div ref={ref} style={{
      position: "fixed",
      top: anchorRect.bottom + 2,
      left: anchorRect.left,
      zIndex: 9999,
      minWidth: "248px",
      borderRadius: "10px",
      padding: "4px 0",
      backdropFilter: "blur(20px)",
      backgroundColor: "color-mix(in srgb, var(--palette-background-paper, #1c252e) 92%, transparent)",
      boxShadow: "var(--customShadows-dropdown, 0 8px 32px rgba(0,0,0,0.5))",
      backgroundImage: `radial-gradient(circle at 100% 0%, rgba(0,184,217,0.1) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(255,86,48,0.1) 0%, transparent 50%)`,
      backgroundSize: "50% 50%, 50% 50%",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right top, left bottom",
    }}>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <div
            className={`flex items-center cursor-pointer text-[var(--palette-text-primary)] hover:bg-[var(--primary-hover)] rounded-[6px] mx-1 ${item.selected ? "bg-[var(--primary-hover)]" : ""}`}
            style={{ padding: "6px 8px", fontSize: "0.875rem", fontWeight: 600, lineHeight: "1.57143" }}
            onClick={onClose}
          >
            {item.icon && (
              <span style={{ width: "18px", height: "18px", marginRight: "16px", flexShrink: 0, display: "inline-flex", alignItems: "center" }}>
                {item.icon}
              </span>
            )}
            <span style={{ flex: 1 }}>{item.label}</span>
          </div>
          {item.dividerAfter && <hr style={{ margin: "4px 0", border: "none", borderTop: "1px solid rgba(145,158,171,0.2)" }} />}
        </React.Fragment>
      ))}
    </div>,
    document.body
  );
}

function DropdownMenu({ items, onClose, style }: {
  items: { icon?: React.ReactNode; label: React.ReactNode; dividerAfter?: boolean; selected?: boolean }[];
  onClose: () => void;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="absolute z-[9999] rounded-[10px] py-1"
      style={{ minWidth: "160px", backdropFilter: "blur(20px)", backgroundColor: "color-mix(in srgb, var(--palette-background-paper, #1c252e) 92%, transparent)", boxShadow: "var(--customShadows-dropdown, 0 8px 32px rgba(0,0,0,0.5))", ...style }}>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <div
            className={`flex items-center cursor-pointer text-[var(--palette-text-primary)] hover:bg-[var(--primary-hover)] rounded-[6px] mx-1 ${item.selected ? "bg-[var(--primary-hover)]" : ""}`}
            style={{ padding: "6px 8px", fontSize: "0.875rem", fontWeight: 600, gap: "12px" }}
            onClick={onClose}
          >
            {item.icon && <span className="w-[18px] h-[18px] flex-shrink-0 inline-flex items-center">{item.icon}</span>}
            <span>{item.label}</span>
          </div>
          {item.dividerAfter && <hr className="my-1" style={{ border: "none", borderTop: "1px solid rgba(145,158,171,0.2)" }} />}
        </React.Fragment>
      ))}
    </div>
  );
}

const getColMenuItems = (colLabel: string) => [
  { icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="m8.303 11.596l3.327-3.431a.499.499 0 0 1 .74 0l6.43 6.63c.401.414.158 1.205-.37 1.205h-5.723z"/><path d="M11.293 16H5.57c-.528 0-.771-.791-.37-1.205l2.406-2.482z" opacity="0.5"/></svg>, label: "Sort by ASC" },
  { icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="m8.303 12.404l3.327 3.431c.213.22.527.22.74 0l6.43-6.63C19.201 8.79 18.958 8 18.43 8h-5.723z"/><path d="M11.293 8H5.57c-.528 0-.771.79-.37 1.205l2.406 2.481z" opacity="0.5"/></svg>, label: "Sort by DESC", dividerAfter: true },
  { icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><g transform="rotate(30 8 12)"><path d="M16,9V4l1,0c0.55,0,1-0.45,1-1v0c0-0.55-0.45-1-1-1H7C6.45,2,6,2.45,6,3v0c0,0.55,0.45,1,1,1l1,0v5c0,1.66-1.34,3-3,3h0v2h5.97v7l1,1l1-1v-7H19v-2h0C17.34,12,16,10.66,16,9z" fillRule="evenodd"/></g></svg>, label: "Pin to left" },
  { icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><g transform="rotate(-30 15 10)"><path d="M16,9V4l1,0c0.55,0,1-0.45,1-1v0c0-0.55-0.45-1-1-1H7C6.45,2,6,2.45,6,3v0c0,0.55,0.45,1,1,1l1,0v5c0,1.66-1.34,3-3,3h0v2h5.97v7l1,1l1-1v-7H19v-2h0C17.34,12,16,10.66,16,9z" fillRule="evenodd"/></g></svg>, label: "Pin to right", dividerAfter: true },
  { icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19 3H5c-1.414 0-2.121 0-2.56.412C2 3.824 2 4.488 2 5.815v.69c0 1.037 0 1.556.26 1.986c.26.43.733.698 1.682 1.232l2.913 1.64c.636.358.955.537 1.183.735c.474.411.766.895.898 1.49c.064.284.064.618.064 1.285v2.67c0 .909 0 1.364.252 1.718c.252.355.7.53 1.594.88c1.879.734 2.818 1.101 3.486.683c.668-.417.668-1.372.668-3.282v-2.67c0-.666 0-1 .064-1.285a2.68 2.68 0 0 1 .899-1.49c.227-.197.546-.376 1.182-.735l2.913-1.64c.948-.533 1.423-.8 1.682-1.23c.26-.43.26-.95.26-1.988v-.69c0-1.326 0-1.99-.44-2.402C21.122 3 20.415 3 19 3"/></svg>, label: "Filter", dividerAfter: true },
  { icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8 17.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM9.5 8c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5S9.5 9.38 9.5 8zm6.5 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>, label: `Group by ${colLabel}`, dividerAfter: true },
  { icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path fillRule="evenodd" d="M1.606 6.08a1 1 0 0 1 1.313.526L2 7l.92-.394v-.001l.003.009l.021.045c.02.042.051.108.094.194c.086.172.219.424.4.729a13.37 13.37 0 0 0 1.67 2.237c.186.214.384.41.59.592C7.18 11.8 9.251 13 12 13a8.706 8.706 0 0 0 3.22-.602c1.227-.483 2.254-1.21 3.096-1.998a13.053 13.053 0 0 0 2.733-3.725l.027-.058l.005-.011a1 1 0 0 1 1.838.788L22 7l.92.394-.003.005-.004.008-.011.026-.04.087a14.045 14.045 0 0 1-.741 1.348a15.368 15.368 0 0 1-1.711 2.256l.797.797a1 1 0 0 1-1.414 1.415l-.84-.84a11.81 11.81 0 0 1-1.897 1.256l.782 1.202a1 1 0 1 1-1.676 1.091l-.986-1.514c-.679.208-1.404.355-2.176.424V16.5a1 1 0 0 1-2 0v-1.544c-.775-.07-1.5-.217-2.177-.425l-.985 1.514a1 1 0 0 1-1.676-1.09l.782-1.203c-.7-.37-1.332-.8-1.897-1.257l-.84.84a1 1 0 0 1-1.414-1.414l.797-.797a15.406 15.406 0 0 1-1.87-2.519a13.457 13.457 0 0 1-.591-1.107l-.033-.072-.01-.021-.002-.007v-.003C1.08 7.395 1.08 7.394 2 7l-.919.395a1 1 0 0 1 .525-1.314" clipRule="evenodd"/></svg>, label: "Hide column" },
  { icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M9.75 12a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0"/><path fillRule="evenodd" d="M2 12c0 1.64.425 2.191 1.275 3.296C4.972 17.5 7.818 20 12 20c4.182 0 7.028-2.5 8.725-4.704C21.575 14.192 22 13.639 22 12c0-1.64-.425-2.191-1.275-3.296C19.028 6.5 16.182 4 12 4C7.818 4 4.972 6.5 3.275 8.704C2.425 9.81 2 10.361 2 12m10-3.75a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5" clipRule="evenodd"/></svg>, label: "Manage columns" },
];

type SortState = { col: string; dir: "asc" | "desc" } | null;

export default function BetsTable() {
  const [search, setSearch] = useState("");
  const [hoveredCol, setHoveredCol] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [colMenuRect, setColMenuRect] = useState<DOMRect | null>(null);
  const [density, setDensity] = useState("Compact");
  const [sortState, setSortState] = useState<SortState>(null);
  const [colWidths, setColWidths] = useState<Record<string, number>>(
    Object.fromEntries(DEFAULT_COLUMNS.map(c => [c.label, c.width]))
  );

  // ✅ Column resize drag
  const resizingRef = useRef<{ col: string; startX: number; startW: number } | null>(null);

  const onResizeStart = useCallback((e: React.MouseEvent, colLabel: string) => {
    e.preventDefault();
    e.stopPropagation();
    resizingRef.current = { col: colLabel, startX: e.clientX, startW: colWidths[colLabel] };

    const onMove = (me: MouseEvent) => {
      if (!resizingRef.current) return;
      const delta = me.clientX - resizingRef.current.startX;
      const newW = Math.max(40, resizingRef.current.startW + delta);
      setColWidths(prev => ({ ...prev, [resizingRef.current!.col]: newW }));
    };
    const onUp = () => {
      resizingRef.current = null;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [colWidths]);

  // ✅ Sort toggle
  const handleSortClick = (colLabel: string) => {
    setSortState(prev => {
      if (!prev || prev.col !== colLabel) return { col: colLabel, dir: "asc" };
      if (prev.dir === "asc") return { col: colLabel, dir: "desc" };
      return null; // 3rd click removes sort
    });
  };

  const densityItems = [
    { icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M4 15.5q-.425 0-.712-.288T3 14.5V14q0-.425.288-.712T4 13h16q.425 0 .713.288T21 14v.5q0 .425-.288.713T20 15.5zM4 11q-.425 0-.712-.288T3 10v-.5q0-.425.288-.712T4 8.5h16q.425 0 .713.288T21 9.5v.5q0 .425-.288.713T20 11zm0-4.5q-.425 0-.712-.288T3 5.5V5q0-.425.288-.712T4 4h16q.425 0 .713.288T21 5v.5q0 .425-.288.713T20 6.5zM4 20q-.425 0-.712-.288T3 19v-.5q0-.425.288-.712T4 17.5h16q.425 0 .713.288T21 18.5v.5q0 .425-.288.713T20 20z"/></svg>, label: "Compact", selected: density === "Compact" },
    { icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path fill="currentColor" d="M21 16v3a2 2 0 0 1-1.85 1.995L19 21H5a2 2 0 0 1-1.995-1.85L3 19v-3zm0-6v4H3v-4zm-2-7a2 2 0 0 1 2 2v3H3V5a2 2 0 0 1 2-2z"/></svg>, label: "Standard", selected: density === "Standard" },
    { icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path fill="currentColor" d="M5 3a2 2 0 0 0-2 2v6h18V5a2 2 0 0 0-2-2zm16 10H3v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"/></svg>, label: "Comfortable", selected: density === "Comfortable" },
  ];
  const exportItems = [{ label: "Download as CSV" }, { label: "Download as Excel" }];

  // ✅ Column header renderer — showControls = only in modal
  const renderColumns = (showControls = false) => (
    <div className="flex bg-[rgba(145,158,171,0.08)]" style={{ minWidth: "max-content" }}>
      {DEFAULT_COLUMNS.map((col, idx) => {
        const isActive = sortState?.col === col.label;
        const isDesc = isActive && sortState?.dir === "desc";
        const w = colWidths[col.label];

        return (
          <div
            key={col.label}
            onMouseEnter={() => setHoveredCol(col.label)}
            onMouseLeave={() => setHoveredCol(null)}
            onClick={() => handleSortClick(col.label)}
            className={`relative flex items-center gap-0.5 px-[6px] h-[39px] text-[13px] tracking-[-0.5px] font-semibold cursor-pointer select-none ${
              col.align === "right" ? "justify-end" : "justify-start"
            } ${isActive ? "text-white" : "text-[var(--palette-text-secondary)]"}`}
            style={{
              width: `${w}px`,
              minWidth: `${w}px`,
              flexShrink: 0,
              // ✅ Active sort: border b1 all around
              ...(isActive ? {
                outline: "1px solid rgba(145,158,171,0.5)",
                outlineOffset: "-1px",
              } : {}),
            }}
          >
            <span style={{ whiteSpace: "nowrap" }}>{col.label}</span>

            <svg
              className="w-[18px] h-[18px] flex-shrink-0 transition-opacity duration-200"
              style={{
                opacity: isActive ? 1 : (hoveredCol === col.label ? 1 : 0),
                color: isActive ? "#fff" : "var(--palette-text-disabled)",
                transform: isDesc ? "scaleY(-1)" : "none",
              }}
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="m8.303 11.596l3.327-3.431a.499.499 0 0 1 .74 0l6.43 6.63c.401.414.158 1.205-.37 1.205h-5.723z"/>
              <path fill="currentColor" d="M11.293 16H5.57c-.528 0-.771-.791-.37-1.205l2.406-2.482z" opacity="0.5"/>
            </svg>

            {/* ✅ 3-dot — ONLY in modal */}
            {showControls && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (openMenu === col.label) { setOpenMenu(null); setColMenuRect(null); }
                  else { setOpenMenu(col.label); setColMenuRect((e.currentTarget as HTMLElement).getBoundingClientRect()); }
                }}
                className="transition-opacity duration-200 flex items-center justify-center w-5 h-5 rounded hover:bg-[rgba(145,158,171,0.2)] text-[var(--palette-text-secondary)]"
                style={{ opacity: hoveredCol === col.label ? 1 : 0 }}
              >
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor">
                  <path d="M5 10a2 2 0 1 1 0 4a2 2 0 0 1 0-4m7 0a2 2 0 1 1 0 4a2 2 0 0 1 0-4m7 0a2 2 0 1 1 0 4a2 2 0 0 1 0-4"/>
                </svg>
              </button>
            )}

            {/* ✅ Resize handle — drag to resize */}
            <div
              onMouseDown={(e) => onResizeStart(e, col.label)}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 h-full flex items-center justify-center z-10"
              style={{  cursor: "col-resize" }}
            >
              <div style={{ width: "1px", height: "100%", backgroundColor: hoveredCol === col.label ? "rgba(145,158,171,0.5)" : "rgba(145,158,171,0.2)" }} />
            </div>
          </div>
        );
      })}
      <div className="flex-1" />
    </div>
  );

  return (
    <>
      {/* ===== COMPACT TABLE ===== */}
      <div id="betsTable.tsx">
      <div className="w-full flex flex-col border-b border-dashed border-(--dotted-line)">
        <div className="flex items-center gap-4 px-4 py-2 flex-wrap">
          <button onClick={() => setIsFullScreen(true)}
            className="inline-flex items-center gap-1.5 h-[30px] px-2 text-[0.8125rem] font-bold border border-[rgba(145,158,171,0.32)] rounded-[8px] text-[var(--palette-text-primary)] bg-transparent hover:bg-[var(--primary-hover)] transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="currentColor" d="M7 14H5v5h5v-2H7zm-2-4h2V7h3V5H5zm12 7h-3v2h5v-5h-2zM14 5v2h3v3h2V5z"/>
            </svg>
            Bets
          </button>
          <div className="relative flex-1 min-w-0">
            <input type="search" id="search" name="search-input" placeholder="Search bets..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 text-[0.9375rem] bg-transparent pl-3 pr-3 rounded-[8px] border border-[rgba(145,158,171,0.2)] text-[var(--palette-text-primary)] placeholder:text-[var(--palette-text-secondary)] focus:outline-none focus:border-[rgba(145,158,171,0.4)] transition-colors" />
          </div>
        </div>
{/* 
        <div className="w-full overflow-x-auto [scrollbar-width:thin] pl-1 border-b border-dashed border-(--dotted-line)">
          <div className="flex border-b border-dashed border-(--dotted-line) bg-[rgba(145,158,171,0.08)]" style={{ minWidth: "max-content" }}>
            {renderColumns(false)}
          </div>
          <div className="flex items-center justify-center min-h-[196px] text-[var(--palette-text-secondary)] text-[0.875rem]"
            style={{ position: "sticky", left: 0, width: "100vw", maxWidth: "100%" }}>
            No rows
          </div>
        </div> */}
        {/* ✅ Below your SAME header bar */}
<div className="border-b border-dashed border-(--dotted-line)" />

<div className="px-4 py-2 text-[0.875rem] font-bold text-[var(--palette-text-primary)]">
  Open Bets
</div>

<DesktopOpenBetsRightNav />
      </div>
</div>
      {/* ===== FULL SCREEN MODAL ===== */}
      {isFullScreen && (
        <div className="fixed inset-0 z-[1300] flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsFullScreen(false)} />
          <div className="relative w-full h-full bg-[var(--palette-background-default)] flex flex-col">
            <div className="flex items-center justify-between p-2">
              <h2 className="text-[18px] font-semibold p-6"><span className="text-(--primary-color)">Bets</span></h2>
              <button onClick={() => setIsFullScreen(false)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--primary-hover)] transition-colors text-[var(--palette-text-primary)]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                  <path fill="currentColor" d="m12 13.414l5.657 5.657a1 1 0 0 0 1.414-1.414L13.414 12l5.657-5.657a1 1 0 0 0-1.414-1.414L12 10.586L6.343 4.929A1 1 0 0 0 4.93 6.343L10.586 12l-5.657 5.657a1 1 0 1 0 1.414 1.414z"/>
                </svg>
              </button>
            </div>
            <div className="border-b border-dashed border-(--dotted-line)" />
<div className="px-4 py-2 text-[0.875rem] font-bold text-[var(--palette-text-primary)]">
  Open Bets
</div>

{/* Open Bets RightNav (old flow) */}
<DesktopOpenBetsRightNav />

          </div>
        </div>
      )}

      {/* Portal column dropdown */}
      {openMenu && !["density", "export"].includes(openMenu) && colMenuRect && (
        <PortalDropdown items={getColMenuItems(openMenu)} onClose={() => { setOpenMenu(null); setColMenuRect(null); }} anchorRect={colMenuRect} />
      )}
    </>
  );
}