import React, { useEffect, useState } from 'react';
import { mountIsaHoleShapes } from '../data/mountIsaHoleShapes';
import { holeShapeBadge } from '../lib/holeShapeStatus';
import { formatDistance, mToYd } from '../lib/units';

export default function OriginalTwoDRenderedHoleMap({ 
  hole, 
  gpsData, 
  ballPos, 
  onBallMove, 
  targetType = 'centre', 
  onVisualDistanceUpdate,
  showPlan = true
}) {
  const W = 360;
  const H = 640;
  
  const shapeData = mountIsaHoleShapes[hole.hole] || {};
  
  const teePct = shapeData.tee || { x: 50, y: 88 };
  const greenPct = shapeData.green || { x: 50, y: 12 };
  
  const getLength = (p1, p2) => Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  
  const getPixel = (pctPoint) => ({ x: (pctPoint.x / 100) * W, y: (pctPoint.y / 100) * H });
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

  useEffect(() => {
    if (onVisualDistanceUpdate) {
      onVisualDistanceUpdate(currentVisualDistanceM);
    }
  }, [ballPos, targetType, hole.distanceM, totalPixelLen]);

  const [isDragging, setIsDragging] = useState(false);
  const handlePointerDown = (e) => {
    if (!onBallMove) return;
    e.target.setPointerCapture(e.pointerId);
    setIsDragging(true);
    updateBallPos(e);
  };
  const handlePointerMove = (e) => {
    if (isDragging) updateBallPos(e);
  };
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

  // Generate distance arcs (every 40m as per original design)
  const distanceArcs = [];
  for (let d = 40; d < hole.distanceM - 10; d += 40) {
    const pt = getPointOnPath(hole.distanceM - d);
    distanceArcs.push({ m: d, yd: mToYd(d), y: pt.y });
  }

  const fairwayPath = shapeData.fairwayPath || [teePct, greenPct];
  const fwWidth = shapeData.fairwayWidth || 20;

  const getPathStr = (pts) => {
    if (!pts || pts.length === 0) return '';
    const mapped = pts.map(getPixel);
    let d = `M ${mapped[0].x} ${mapped[0].y} `;
    for (let i = 1; i < mapped.length; i++) d += `L ${mapped[i].x} ${mapped[i].y} `;
    return d;
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '430px',
      margin: '0 auto',
      background: '#1c3829', 
      borderRadius: '24px',
      position: 'relative',
      overflow: 'hidden',
      color: 'white',
      fontFamily: 'sans-serif',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      touchAction: 'none'
    }}>
      
      {/* Interactive Overlay Layer */}
      <svg 
        width="100%" height="auto" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', cursor: 'crosshair', position: 'relative', zIndex: 1 }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Fairway Base */}
        <path d={getPathStr(fairwayPath)} stroke="#366b44" strokeWidth={(fwWidth/100)*W} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={getPathStr(fairwayPath)} stroke="#408051" strokeWidth={((fwWidth-4)/100)*W} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Green */}
        <ellipse cx={greenPx.x} cy={greenPx.y} rx="20" ry="26" fill="#4ade80" />

        {/* Distance Arcs (Every 40m) */}
        {distanceArcs.map((arc, i) => (
          <g key={`arc-${i}`}>
            <line x1={W/2 - 40} y1={arc.y} x2={W/2 + 40} y2={arc.y} stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            <text x={W/2 - 45} y={arc.y + 4} fill="white" fontSize="11" textAnchor="end" opacity="0.8">{arc.m}m</text>
          </g>
        ))}

        {/* Target Line */}
        {ballPos && (
          <line x1={ballPx.x} y1={ballPx.y} x2={targetPx.x} y2={targetPx.y} stroke="#eab308" strokeWidth="2" strokeDasharray="4 2" opacity="0.9" />
        )}

        {/* Ball Marker */}
        {ballPos && (
          <g transform={`translate(${ballPx.x}, ${ballPx.y})`}>
            <circle cx="0" cy="0" r="10" fill="#fff" stroke="#333" strokeWidth="1" />
            <circle cx="0" cy="0" r="3" fill="#f00" />
            <text x="0" y="20" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">BALL</text>
          </g>
        )}
        
        {/* Target Marker */}
        <g transform={`translate(${targetPx.x}, ${targetPx.y})`}>
          <circle cx="0" cy="0" r="6" fill="#fff" />
          <circle cx="0" cy="0" r="3" fill="#000" />
        </g>
      </svg>

      {/* Top Header */}
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: 900, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Hole {hole.hole}</h2>
        <div style={{ fontSize: '13px', fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.8)', marginBottom: '8px' }}>
          Par {hole.par} • {hole.distanceM} m / {mToYd(hole.distanceM)} yd
        </div>
        <div style={{
          background: 'rgba(74, 143, 66, 0.9)', padding: '4px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold', display: 'inline-block', boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}>
          {holeShapeBadge(gpsData ? { ...shapeData, status: 'gps' } : shapeData)}
        </div>
      </div>

    </div>
  );
}
