import React, { useEffect, useState } from 'react';
import { mToYd } from '../lib/units';
import { mountIsaHoleShapes } from '../data/mountIsaHoleShapes';
import { holeShapeBadge } from '../lib/holeShapeStatus';

// ---- Small inline icon set (no icon library in this project) ----
const IconWrap = ({ children, onClick, active }) => (
  <div
    onClick={onClick}
    style={{
      width: 40, height: 40, borderRadius: '50%',
      background: active ? 'rgba(59,130,246,0.9)' : 'rgba(17,24,39,0.78)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 4px 10px rgba(0,0,0,0.35)', cursor: onClick ? 'pointer' : 'default',
      backdropFilter: 'blur(2px)'
    }}
  >
    {children}
  </div>
);

const FlagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 21V4h14l-4 4 4 4H5" stroke="#fff" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" /></svg>
);
const NotesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="2" stroke="#fff" strokeWidth="2" /><path d="M8 8h8M8 12h8M8 16h5" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
);
const WifiIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M2 8.5a17 17 0 0 1 20 0M5.5 12.5a12 12 0 0 1 13 0M9 16.5a6.5 6.5 0 0 1 6 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" /><circle cx="12" cy="20" r="1.4" fill="#fff" /></svg>
);
const GearIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="#fff" strokeWidth="2" /><path d="M19.4 13.5a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V19.5a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H4.5a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1.1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H10a1.7 1.7 0 0 0 1-1.55V4.5a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V10a1.7 1.7 0 0 0 1.55 1H19.5a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1Z" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" /></svg>
);
const PeopleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3" stroke="#fff" strokeWidth="2" /><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" /><path d="M17 4v5M14.5 6.5h5" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
);
const TrophyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" stroke="#fff" strokeWidth="2" strokeLinejoin="round" /><path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" /><path d="M12 13v3m-3 3h6" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
);

const windLabel = (relation) => {
  if (relation === 'into') return { text: 'INTO', rotate: 180 };
  if (relation === 'helping') return { text: 'HELPING', rotate: 0 };
  if (relation === 'cross') return { text: 'CROSS', rotate: 90 };
  return { text: 'CALM', rotate: 0 };
};

export default function SatelliteHoleMap({
  hole,
  bgImage,
  gpsData,
  ballPos,
  onBallMove,
  targetType = 'centre',
  onVisualDistanceUpdate,
  windSpeedKmh,
  windDirection = 'none'
}) {
  const W = 360;
  const H = 640;

  const shapeData = mountIsaHoleShapes[hole.hole] || {};
  const teePct = shapeData.tee || { x: 50, y: 88 };
  const greenPct = shapeData.green || { x: 50, y: 12 };

  const getLength = (p1, p2) => Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  const getPixel = (pctPoint) => ({ x: (pctPoint.x / 100) * W, y: (pctPoint.y / 100) * H });
  const getPct = (pxPoint) => ({ x: (pxPoint.x / W) * 100, y: (pxPoint.y / H) * 100 });

  const teePx = getPixel(teePct);
  const greenPx = getPixel(greenPct);
  const totalPixelLen = getLength(teePx, greenPx);

  const getPointOnPath = (distanceFromTee) => {
    const percent = Math.min(1, Math.max(0, distanceFromTee / hole.distanceM));
    return {
      x: teePx.x + (greenPx.x - teePx.x) * percent,
      y: teePx.y + (greenPx.y - teePx.y) * percent,
      percent
    };
  };

  const targetPct = { ...greenPct };
  if (targetType === 'front') targetPct.y += 2;
  if (targetType === 'back') targetPct.y -= 2;
  const targetPx = getPixel(targetPct);

  const actualBallPos = ballPos || teePct;
  const ballPx = getPixel(actualBallPos);

  const mPerPixel = hole.distanceM / totalPixelLen;
  const currentVisualDistanceM = Math.round(getLength(ballPx, targetPx) * mPerPixel);
  const centreDistanceM = Math.round(getLength(ballPx, greenPx) * mPerPixel);

  const plan = hole.plan || [];
  const hasLayup = plan.length >= 3;
  const layupShot = hasLayup ? plan[plan.length - 2] : null;
  const layupPt = layupShot ? getPointOnPath(hole.distanceM - layupShot.totalM) : null;
  const layupDistanceM = layupPt ? Math.round(getLength(ballPx, getPixel(layupPt)) * mPerPixel) : null;

  useEffect(() => {
    if (onVisualDistanceUpdate) onVisualDistanceUpdate(currentVisualDistanceM);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ballPos, targetType, hole.distanceM, totalPixelLen]);

  const [isDragging, setIsDragging] = useState(false);
  const handlePointerDown = (e) => {
    if (!onBallMove) return;
    e.target.setPointerCapture(e.pointerId);
    setIsDragging(true);
    updateBallPos(e);
  };
  const handlePointerMove = (e) => { if (isDragging) updateBallPos(e); };
  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);
  };
  const updateBallPos = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    let cx = ((e.clientX - rect.left) / rect.width) * 100;
    let cy = ((e.clientY - rect.top) / rect.height) * 100;
    cx = Math.max(0, Math.min(100, cx));
    cy = Math.max(0, Math.min(100, cy));
    if (onBallMove) onBallMove({ x: cx, y: cy });
  };

  // Distance arcs every 20m (measured back from the green)
  const distanceArcs = [];
  for (let d = 20; d < hole.distanceM - 10; d += 20) {
    const pt = getPointOnPath(hole.distanceM - d);
    distanceArcs.push({ m: d, yd: mToYd(d), y: pt.y });
  }

  // Club plan labels, positioned by distance-from-green (shot.totalM)
  const clubLabels = plan.map((shot, i) => {
    const pt = getPointOnPath(hole.distanceM - shot.totalM);
    return { ...shot, pct: getPct(getPixel(pt)), key: `${shot.club}-${i}` };
  });

  const wind = windLabel(windDirection);
  const badge = holeShapeBadge(gpsData ? { ...shapeData, status: 'gps' } : shapeData);

  const boxStyle = {
    background: 'rgba(15,23,42,0.82)',
    borderRadius: '12px',
    padding: '8px 12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.35)',
    minWidth: '86px'
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '430px',
      margin: '0 auto',
      background: bgImage
        ? `#111827 url(${bgImage}) center / cover no-repeat`
        : 'radial-gradient(ellipse at 50% 30%, #1c3829 0%, #0f1f17 60%, #0b1712 100%)',
      borderRadius: '24px',
      position: 'relative',
      overflow: 'hidden',
      color: 'white',
      fontFamily: 'sans-serif',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      touchAction: 'none'
    }}>

      {/* Contrast gradient so overlay text stays legible on any photo */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 22%, rgba(0,0,0,0.05) 68%, rgba(0,0,0,0.55) 100%)'
      }} />

      {!bgImage && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 0, textAlign: 'center', padding: '0 40px'
        }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.5px' }}>
            Satellite imagery coming soon
          </span>
        </div>
      )}

      {/* Interactive Overlay Layer */}
      <svg
        width="100%" height="auto" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', cursor: 'crosshair', position: 'relative', zIndex: 1 }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {distanceArcs.map((arc, i) => (
          <g key={`arc-${i}`}>
            <line x1={W / 2 - 40} y1={arc.y} x2={W / 2 + 40} y2={arc.y} stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            <text x={W / 2 - 45} y={arc.y - 2} fill="white" fontSize="9" textAnchor="end" opacity="0.9" fontWeight="bold" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>{arc.m} m</text>
            <text x={W / 2 - 45} y={arc.y + 8} fill="white" fontSize="8" textAnchor="end" opacity="0.7" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>{arc.yd} yd</text>
          </g>
        ))}

        <line x1={teePx.x} y1={teePx.y} x2={greenPx.x} y2={greenPx.y} stroke="#fff" strokeWidth="2" strokeDasharray="6 6" opacity="0.8" style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.8))' }} />

        {ballPos && (
          <line x1={ballPx.x} y1={ballPx.y} x2={targetPx.x} y2={targetPx.y} stroke="#eab308" strokeWidth="3" strokeDasharray="8 4" opacity="0.9" style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.8))' }} />
        )}

        <text x={teePx.x} y={teePx.y + 22} fill="white" fontSize="10" textAnchor="middle" fontWeight="bold" opacity="0.85" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>TEE</text>

        {ballPos && (
          <g transform={`translate(${ballPx.x}, ${ballPx.y})`}>
            <circle cx="0" cy="0" r="12" fill="#fff" stroke="#333" strokeWidth="2" style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))' }} />
            <circle cx="0" cy="0" r="4" fill="#f00" />
          </g>
        )}

        <g transform={`translate(${targetPx.x}, ${targetPx.y})`}>
          <path d="M 0 0 L -6 -12 L 6 -12 Z" fill="#fff" style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))' }} />
          <circle cx="0" cy="-16" r="5" fill="#fff" style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))' }} />
        </g>
      </svg>

      {/* Club plan labels */}
      {clubLabels.map(label => (
        <div key={label.key} style={{
          position: 'absolute',
          left: `calc(${label.pct.x}% + 22px)`,
          top: `${label.pct.y}%`,
          transform: 'translateY(-50%)',
          zIndex: 5,
          background: 'rgba(20,61,44,0.92)',
          borderRadius: '8px',
          padding: '4px 8px',
          boxShadow: '0 3px 8px rgba(0,0,0,0.4)',
          whiteSpace: 'nowrap'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 800 }}>{label.club}</div>
          <div style={{ fontSize: '9px', opacity: 0.85 }}>{label.totalM} m / {mToYd(label.totalM)} yd</div>
        </div>
      ))}

      {/* Top header */}
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, maxWidth: '62%' }}>
        <h2 style={{ margin: '0 0 2px 0', fontSize: '26px', fontWeight: 900, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Hole {hole.hole}</h2>
        <div style={{ fontSize: '13px', fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.8)', marginBottom: '8px' }}>
          Par {hole.par} • {hole.distanceM} m / {mToYd(hole.distanceM)} yd
        </div>
        <div style={{
          background: 'rgba(74, 143, 66, 0.9)', padding: '4px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold', display: 'inline-block', boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}>
          {badge}
        </div>
      </div>

      {/* Distance-to-target boxes */}
      <div style={{ position: 'absolute', top: 108, left: 16, zIndex: 10, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={boxStyle}>
          <div style={{ fontSize: '24px', fontWeight: 900, lineHeight: 1 }}>{currentVisualDistanceM}<span style={{ fontSize: '12px', fontWeight: 700 }}> m</span></div>
          <div style={{ fontSize: '10px', color: '#86efac', fontWeight: 700 }}>To Green</div>
        </div>
        <div style={boxStyle}>
          <div style={{ fontSize: '18px', fontWeight: 800, lineHeight: 1 }}>{centreDistanceM}<span style={{ fontSize: '11px', fontWeight: 700 }}> m</span></div>
          <div style={{ fontSize: '10px', color: '#86efac', fontWeight: 700 }}>To Centre</div>
        </div>
        {hasLayup && (
          <div style={boxStyle}>
            <div style={{ fontSize: '18px', fontWeight: 800, lineHeight: 1 }}>{layupDistanceM}<span style={{ fontSize: '11px', fontWeight: 700 }}> m</span></div>
            <div style={{ fontSize: '10px', color: '#86efac', fontWeight: 700 }}>To Layup</div>
          </div>
        )}
      </div>

      {/* Right-side icon toolbar */}
      <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <IconWrap active><FlagIcon /></IconWrap>
        <IconWrap><NotesIcon /></IconWrap>
        <IconWrap><WifiIcon /></IconWrap>
        <IconWrap><GearIcon /></IconWrap>
        <div style={{
          width: 40, height: 32, borderRadius: '10px', background: 'rgba(255,255,255,0.95)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: 900, color: '#111827', boxShadow: '0 4px 10px rgba(0,0,0,0.35)'
        }}>18</div>
      </div>
      <div style={{ position: 'absolute', bottom: 96, right: 16, zIndex: 10, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <IconWrap><PeopleIcon /></IconWrap>
        <IconWrap><TrophyIcon /></IconWrap>
      </div>

      {/* Wind widget */}
      <div style={{
        position: 'absolute', bottom: 96, left: 16, zIndex: 10,
        background: 'rgba(15,23,42,0.82)', borderRadius: '12px', padding: '8px 12px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.35)', textAlign: 'center', minWidth: '68px'
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ transform: `rotate(${wind.rotate}deg)`, marginBottom: '2px' }}>
          <path d="M12 4v16M12 4l-5 5M12 4l5 5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ fontSize: '13px', fontWeight: 900 }}>{Math.round(windSpeedKmh || 0)}<span style={{ fontSize: '9px', fontWeight: 700 }}> km/h</span></div>
        <div style={{ fontSize: '9px', color: '#86efac', fontWeight: 700 }}>{wind.text}</div>
      </div>

      {/* Bottom nav */}
      <div style={{
        position: 'absolute', bottom: 16, left: 16, right: 16, zIndex: 10,
        padding: '14px 16px', background: '#fff', borderRadius: '20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)', color: '#111827'
      }}>
        <span style={{ color: '#3b82f6', fontSize: '22px', fontWeight: 700 }}>&lt;</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '12px', height: '6px', background: '#3b82f6', borderRadius: '4px', transform: 'skewX(-20deg)' }}></div>
            <span style={{ fontSize: '26px', fontWeight: 900 }}>{String(hole.hole).padStart(2, '0')}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', fontWeight: 'bold', color: '#4b5563' }}>
            <span>PAR {hole.par}</span>
            <span>S.I. {hole.si ?? '—'}</span>
          </div>
        </div>
        <span style={{ color: '#3b82f6', fontSize: '22px', fontWeight: 700 }}>&gt;</span>
      </div>
    </div>
  );
}
