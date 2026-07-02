import React, { useEffect, useState } from 'react';
import { mToYd } from '../lib/units';

export default function SatelliteHoleOneMap({ 
  hole, 
  ballPos, 
  onBallMove, 
  targetType = 'centre', 
  onVisualDistanceUpdate
}) {
  const W = 360;
  const H = 640;
  
  // Use straight vertical line for ALL holes now as per style guide
  const teePx = { x: W/2, y: H * 0.88 };
  const greenPx = { x: W/2, y: H * 0.12 };
  
  const getLength = (p1, p2) => Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  const totalPixelLen = getLength(teePx, greenPx);

  const getPointOnPath = (distanceFromTee) => {
    const percent = Math.min(1, Math.max(0, distanceFromTee / hole.distanceM));
    return {
      x: teePx.x + (greenPx.x - teePx.x) * percent,
      y: teePx.y + (greenPx.y - teePx.y) * percent,
      percent
    };
  };

  const targetPx = { ...greenPx };
  if (targetType === 'front') targetPx.y += 20;
  if (targetType === 'back') targetPx.y -= 20;

  const getPixel = (pctPoint) => ({ x: (pctPoint.x / 100) * W, y: (pctPoint.y / 100) * H });
  const actualBallPos = ballPos || { x: (teePx.x / W) * 100, y: (teePx.y / H) * 100 };
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

  // Generate distance arcs (every 20m)
  const distanceArcs = [];
  for (let d = 20; d < hole.distanceM - 10; d += 20) {
    const pt = getPointOnPath(hole.distanceM - d); // Arcs denote distance TO green
    distanceArcs.push({ m: d, yd: mToYd(d), y: pt.y });
  }

  // Load the satellite image for Hole 1
  const bgImage = `/course-maps/mount-isa/hole1.png`;

  return (
    <div style={{
      width: '100%',
      maxWidth: '430px',
      margin: '0 auto',
      background: '#111827', 
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      borderRadius: '24px',
      position: 'relative',
      overflow: 'hidden',
      color: 'white',
      fontFamily: 'sans-serif',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      touchAction: 'none'
    }}>
      
      {/* Interactive Overlay Layer ONLY - NO DUPLICATE UI */}
      <svg 
        width="100%" height="auto" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', cursor: 'crosshair', position: 'relative', zIndex: 1 }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Distance Arcs (Every 20m) */}
        {distanceArcs.map((arc, i) => (
          <g key={`arc-${i}`}>
            <line x1={W/2 - 40} y1={arc.y} x2={W/2 + 40} y2={arc.y} stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            <text x={W/2 - 45} y={arc.y - 2} fill="white" fontSize="9" textAnchor="end" opacity="0.9" fontWeight="bold" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>{arc.m} m</text>
            <text x={W/2 - 45} y={arc.y + 8} fill="white" fontSize="8" textAnchor="end" opacity="0.7" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>{arc.yd} yd</text>
          </g>
        ))}

        {/* Dashed Line up the middle */}
        <line x1={teePx.x} y1={teePx.y} x2={greenPx.x} y2={greenPx.y} stroke="#fff" strokeWidth="2" strokeDasharray="6 6" opacity="0.8" style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.8))' }} />

        {/* Dynamic Target Line */}
        {ballPos && (
          <line x1={ballPx.x} y1={ballPx.y} x2={targetPx.x} y2={targetPx.y} stroke="#eab308" strokeWidth="3" strokeDasharray="8 4" opacity="0.9" style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.8))' }} />
        )}

        {/* Ball Marker */}
        {ballPos && (
          <g transform={`translate(${ballPx.x}, ${ballPx.y})`}>
            <circle cx="0" cy="0" r="14" fill="#fff" stroke="#333" strokeWidth="2" style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))' }} />
            <circle cx="0" cy="0" r="4" fill="#f00" />
            <text x="0" y="24" fill="white" fontSize="11" textAnchor="middle" fontWeight="bold" stroke="#000" strokeWidth="3" paintOrder="stroke">BALL</text>
            <text x="0" y="24" fill="white" fontSize="11" textAnchor="middle" fontWeight="bold">BALL</text>
          </g>
        )}
        
        {/* Target Marker */}
        <g transform={`translate(${targetPx.x}, ${targetPx.y})`}>
          <path d="M 0 0 L -6 -12 L 6 -12 Z" fill="#fff" style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))' }} />
          <circle cx="0" cy="-16" r="5" fill="#fff" style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))' }} />
        </g>
      </svg>
    </div>
  );
}
