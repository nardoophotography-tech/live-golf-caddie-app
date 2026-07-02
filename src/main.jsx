import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { mountIsaCourse } from './data/mountIsaCourse';
import SatelliteHoleMap from './components/SatelliteHoleMap';
import { formatDistance, formatDistanceRange, formatSpeed, formatSpeedRange, formatTemp, mToYd } from './lib/units';
import { generateCaddieDecision } from './lib/proCaddieEngine';
import { getCurrentPosition, formatGpsAccuracy, haversineDistanceM } from './lib/gps';
import { mountIsaGpsData } from './data/mountIsaGpsData';
import './styles.css';

// Clean (UI-free) satellite crops go here as they become available.
// Holes not listed yet fall back to a dark placeholder inside SatelliteHoleMap.
// Holes 2, 3, 8, 14, 15: source screenshots were 0-byte / truncated (OneDrive sync
// gap) - no real imagery exists for them yet. See GOLF_CADDY_NEXT_STEPS.md.
const holeSatelliteImages = {
  1: '/course-maps/mount-isa/hole-1-satellite.jpg',
  4: '/course-maps/mount-isa/hole-4-satellite.jpg',
  5: '/course-maps/mount-isa/hole-5-satellite.jpg',
  6: '/course-maps/mount-isa/hole-6-satellite.jpg',
  7: '/course-maps/mount-isa/hole-7-satellite.jpg',
  9: '/course-maps/mount-isa/hole-9-satellite.jpg',
  10: '/course-maps/mount-isa/hole-10-satellite.jpg',
  11: '/course-maps/mount-isa/hole-11-satellite.jpg',
  12: '/course-maps/mount-isa/hole-12-satellite.jpg',
  13: '/course-maps/mount-isa/hole-13-satellite.jpg',
  16: '/course-maps/mount-isa/hole-16-satellite.jpg',
  17: '/course-maps/mount-isa/hole-17-satellite.jpg',
  18: '/course-maps/mount-isa/hole-18-satellite.jpg'
};
function getHoleImage(holeNumber) {
  return holeSatelliteImages[holeNumber] || null;
}

const defaultClubs = [
  { club: 'Driver', carry: 210, total: 225, miss: 'right' },
  { club: '3 Wood', carry: 190, total: 200, miss: 'right' },
  { club: '3 Hybrid', carry: 170, total: 180, miss: 'right' },
  { club: '4 Iron', carry: 160, total: 170, miss: 'right' },
  { club: '5 Iron', carry: 150, total: 160, miss: 'right' },
  { club: '6 Iron', carry: 140, total: 150, miss: 'right' },
  { club: '7 Iron', carry: 130, total: 140, miss: 'right' },
  { club: '8 Iron', carry: 120, total: 130, miss: 'right' },
  { club: '9 Iron', carry: 110, total: 120, miss: 'right' },
  { club: 'PW', carry: 100, total: 110, miss: 'right' },
  { club: 'SW', carry: 80, total: 85, miss: 'right' },
  { club: 'LW', carry: 70, total: 75, miss: 'right' },
  { club: '60° Wedge', carry: 60, total: 65, miss: 'right' },
  { club: 'Putter', carry: 0, total: 0, miss: 'short' }
];

function getInitialClubs() {
  try {
    const saved = localStorage.getItem('lgc_clubs_v3');
    if (saved) {
      return JSON.parse(saved);
    }
    return defaultClubs;
  } catch {
    return defaultClubs;
  }
}

function saveClubs(clubs) {
  localStorage.setItem('lgc_clubs_v3', JSON.stringify(clubs));
}

// Old caddie functions removed in favor of proCaddieEngine

function generateShotAdvice(hole, shot, index) {
  let shotType = '';
  let target = '';
  let swing = 'normal tempo';
  let safeMiss = 'center of green';
  let goal = '';
  let riskWarning = 'none';

  if (hole.par === 3) {
    shotType = 'controlled approach';
    target = 'green target';
    goal = hole.mindset.includes('Up-and-down') ? 'play for safe leave' : 'green in regulation';
    safeMiss = shot.note || hole.mindset;
  } else if (hole.par === 4) {
    if (index === 0) {
      shotType = 'fairway finder';
      target = 'centre fairway';
      goal = 'leave a comfortable approach';
    } else {
      shotType = 'controlled approach';
      target = 'middle of green';
      goal = 'green in regulation';
      safeMiss = shot.note || 'front/middle of green';
    }
  } else if (hole.par === 5) {
    if (index === 0) {
      shotType = 'fairway finder';
      target = 'centre fairway';
      goal = 'advance up fairway';
    } else if (index === 1) {
      shotType = 'layup';
      target = 'safe layup zone';
      goal = 'leave a full wedge in';
    } else {
      shotType = 'controlled approach';
      target = 'middle of green';
      goal = 'green in regulation';
      safeMiss = shot.note || 'front/middle of green';
    }
  }

  const note = (shot.note || '').toLowerCase();
  if (note.includes('layup distance')) shotType = 'layup';
  if (note.includes('to centre')) target = 'centre of green';
  if (note.includes('higher flight')) shotType = 'higher flight approach';
  if (note.includes('soft 4h') || note.includes('soft hybrid')) { shotType = 'soft hybrid'; swing = 'smooth'; }
  if (note.includes('clear creek')) riskWarning = 'make sure to carry the creek';
  if (note.includes('front edge ok') || note.includes('front edge')) safeMiss = 'front edge is acceptable';
  if (note.includes('third shot')) shotType = 'short wedge third shot';
  if (note.includes('to pin')) target = 'pin if safe, otherwise middle of green';
  if (note.includes('smooth')) { shotType = 'smooth controlled swing'; swing = 'smooth, 80-90%'; }
  if (note.includes('full')) { shotType = 'full wedge'; swing = 'full swing'; }

  return { shotType, target, swing, safeMiss, goal, riskWarning };
}

function HoleCard({ hole, onUseHole, onUseShot, isActiveHole, ballVisualPct, onBallMove, targetType, onVisualDistanceUpdate, windSpeed, windDirection }) {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showGreenModal, setShowGreenModal] = useState(false);
  const [gpsData, setGpsData] = useState(() => {
    try {
      const saved = localStorage.getItem(`gps_hole_${hole.hole}`);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const handleSaveGps = (newData) => {
    localStorage.setItem(`gps_hole_${hole.hole}`, JSON.stringify(newData));
    setGpsData(newData);
    setShowAdmin(false);
  };

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(gpsData || {}, null, 2));
    alert("Copied to clipboard!");
  };

  return (
    <article className="holeCard" style={{ padding: 0, overflow: 'hidden', position: 'relative', borderRadius: '24px', background: '#111827', border: 'none' }}>
      <SatelliteHoleMap
        hole={hole}
        bgImage={getHoleImage(hole.hole)}
        gpsData={gpsData}
        ballPos={isActiveHole ? ballVisualPct : null}
        onBallMove={isActiveHole ? onBallMove : null}
        targetType={targetType}
        onVisualDistanceUpdate={isActiveHole ? onVisualDistanceUpdate : null}
        windSpeedKmh={windSpeed}
        windDirection={windDirection}
      />

      <div style={{ padding: '14px', background: '#fff' }}>
        <button onClick={() => onUseHole(hole)} style={{ marginTop: '4px', width: '100%', padding: '12px', borderRadius: '12px', background: '#143d2c', color: 'white', fontWeight: 'bold' }}>
          Load Hole {hole.hole} in Caddie
        </button>
        <button 
          onClick={() => setShowAdmin(!showAdmin)} 
          style={{ marginTop: '8px', width: '100%', padding: '8px', borderRadius: '8px', background: '#e5e7eb', color: '#374151', fontSize: '12px', fontWeight: 'bold' }}>
          {showAdmin ? 'Hide GPS Admin' : 'Dev: Edit GPS Data'}
        </button>

        {showAdmin && (
          <AdminGpsForm 
            hole={hole} 
            initialData={gpsData} 
            onSave={handleSaveGps} 
            onCopy={copyJson}
          />
        )}
      </div>
    </article>
  );
}

function AdminGpsForm({ hole, initialData, onSave, onCopy }) {
  const [tee, setTee] = useState(initialData?.tee || { lat: '', lng: '' });
  const [green, setGreen] = useState(initialData?.green || { lat: '', lng: '' });
  const [plan, setPlan] = useState(initialData?.plan || hole.plan.map(() => ({ landing: { lat: '', lng: '' } })));

  const handleSave = () => {
    onSave({ tee, green, plan });
  };

  const inputStyle = { padding: '4px', margin: '2px', width: '80px', fontSize: '12px' };

  return (
    <div style={{ marginTop: '16px', padding: '12px', background: '#222', borderRadius: '8px', fontSize: '12px' }}>
      <h4 style={{ margin: '0 0 8px 0', color: '#fff' }}>GPS Coordinate Editor (Hole {hole.hole})</h4>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Tee: </strong>
        <input style={inputStyle} placeholder="Lat" value={tee.lat} onChange={e => setTee({...tee, lat: e.target.value})} />
        <input style={inputStyle} placeholder="Lng" value={tee.lng} onChange={e => setTee({...tee, lng: e.target.value})} />
      </div>

      <div style={{ marginBottom: '8px' }}>
        <strong>Green: </strong>
        <input style={inputStyle} placeholder="Lat" value={green.lat} onChange={e => setGreen({...green, lat: e.target.value})} />
        <input style={inputStyle} placeholder="Lng" value={green.lng} onChange={e => setGreen({...green, lng: e.target.value})} />
      </div>

      {plan.map((p, i) => (
        <div key={i} style={{ marginBottom: '8px', paddingLeft: '8px', borderLeft: '2px solid #555' }}>
          <strong>Shot {i+1} ({hole.plan[i].club}) Landing: </strong><br/>
          <input style={inputStyle} placeholder="Lat" value={p.landing.lat} onChange={e => {
            const newPlan = [...plan];
            newPlan[i].landing.lat = e.target.value;
            setPlan(newPlan);
          }} />
          <input style={inputStyle} placeholder="Lng" value={p.landing.lng} onChange={e => {
            const newPlan = [...plan];
            newPlan[i].landing.lng = e.target.value;
            setPlan(newPlan);
          }} />
        </div>
      ))}

      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <button onClick={handleSave} style={{ flex: 1, padding: '6px', background: '#4a8f42' }}>Save to Browser</button>
        <button onClick={onCopy} style={{ flex: 1, padding: '6px', background: '#444' }}>Export JSON</button>
      </div>
    </div>
  );
}

function App() {
  const [clubs, setClubs] = useState(getInitialClubs);
  const [tab, setTab] = useState('course');
  const [selectedHole, setSelectedHole] = useState(1);
  const [distance, setDistance] = useState(145);
  const [currentShotNum, setCurrentShotNum] = useState('1');
  const [selectedShot, setSelectedShot] = useState(null);
  const [windRelation, setWindRelation] = useState('into');
  const [windSpeedKmh, setWindSpeedKmh] = useState(15);
  const [slope, setSlope] = useState('flat');
  const [lie, setLie] = useState('fairway');
  const [trouble, setTrouble] = useState('short');
  const [targetType, setTargetType] = useState('green');
  const [weather, setWeather] = useState(null);
  const [weatherStatus, setWeatherStatus] = useState('Weather not loaded yet.');
  const [coords, setCoords] = useState(null);

  // New GPS and Ball State
  const [ballMode, setBallMode] = useState('tee'); // 'tee', 'manual', 'gps'
  const [gpsAccuracyM, setGpsAccuracyM] = useState(null);
  const [ballVisualPct, setBallVisualPct] = useState(null); // {x, y} for map
  const [gpsTargetMsg, setGpsTargetMsg] = useState('');

  const currentHole = mountIsaCourse.find(h => h.hole === Number(selectedHole)) || mountIsaCourse[0];

  useEffect(() => saveClubs(clubs), [clubs]);

  const suggestion = useMemo(() => generateCaddieDecision({
    hole: currentHole,
    shotNumber: currentShotNum,
    distanceM: Number(distance),
    windSpeedKmh: weather?.windSpeedKmh ?? windSpeedKmh,
    windDirection: windRelation,
    slope,
    lie,
    danger: trouble,
    targetType,
    playerClubs: clubs
  }), [currentHole, currentShotNum, distance, windSpeedKmh, weather, windRelation, slope, lie, trouble, targetType, clubs]);

  async function loadWeather() {
    setWeatherStatus('Getting phone GPS location...');
    if (!navigator.geolocation) {
      setWeatherStatus('GPS is not available in this browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(async pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      setCoords({ lat, lon });
      setWeatherStatus('Loading live weather...');
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,wind_speed_10m,wind_direction_10m&wind_speed_unit=kmh&timezone=auto`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Weather request failed');
        const data = await res.json();
        setWeather({
          tempC: data.current.temperature_2m,
          rainMm: data.current.precipitation,
          windSpeedKmh: data.current.wind_speed_10m,
          windDirection: data.current.wind_direction_10m,
          time: data.current.time
        });
        setWeatherStatus('Live weather loaded.');
      } catch (err) {
        setWeatherStatus('Could not load live weather. Check internet connection.');
      }
    }, () => setWeatherStatus('GPS permission was blocked. Allow location to use live local weather.'));
  }

  function updateClub(index, field, value) {
    setClubs(current => current.map((c, i) => i === index ? { ...c, [field]: field === 'carry' || field === 'total' ? Number(value) : value } : c));
  }

  const handleGpsPosition = async () => {
    setGpsTargetMsg('Getting location...');
    try {
      const pos = await getCurrentPosition();
      const accuracy = pos.coords.accuracy;
      setGpsAccuracyM(accuracy);
      
      const holeGps = mountIsaGpsData[currentHole.hole];
      if (!holeGps || !holeGps.green) {
        setGpsTargetMsg('GPS target data needed for this hole.');
        setBallMode('manual');
        return;
      }
      
      setBallMode('gps');
      // Resolve target GeoPoint
      const t = targetType === 'green' ? 'centre' : targetType; // fallback mapping
      const targetGeo = holeGps.green[t] || holeGps.green.centre;
      
      const dist = haversineDistanceM(
        { lat: pos.coords.latitude, lng: pos.coords.longitude },
        targetGeo
      );
      
      setDistance(dist);
      setGpsTargetMsg(`Distance updated via GPS.`);
      if (accuracy > 50) {
        setGpsTargetMsg('GPS accuracy poor. Move to open sky or manually drag ball marker.');
      } else if (accuracy > 20) {
        setGpsTargetMsg('GPS accuracy is low. Distance may be off.');
      }
    } catch (e) {
      setGpsTargetMsg('Could not get GPS position.');
      setBallMode('manual');
    }
  };

  function useHole(hole) {
    setSelectedHole(hole.hole);
    setDistance(hole.distanceM);
    setLie(hole.par === 3 ? 'tee' : 'fairway');
    setSelectedShot(null);
    setBallMode('tee');
    setBallVisualPct(null);
    setGpsTargetMsg('');
    setGpsAccuracyM(null);
    setTab('caddie');
  }

  function useShot(hole, shot) {
    setSelectedHole(hole.hole);
    setDistance(shot.carryM);
    setLie(hole.par === 3 ? 'tee' : 'fairway');
    setSelectedShot(shot);
    setBallMode('landing');
    setBallVisualPct(null);
    setGpsTargetMsg('');
    setGpsAccuracyM(null);
    setTab('caddie');
  }

  return (
    <main className="app">
      <header className="hero">
        <div>
          <p className="eyebrow">Mount Isa Golf • Phone GPS + Live Weather</p>
          <h1>Live Golf Caddie</h1>
          <p className="sub">18-hole shot plan loaded. Simple on-course shot helper. No launch monitor needed.</p>
        </div>
      </header>

      <nav className="tabs">
        <button className={tab === 'course' ? 'active' : ''} onClick={() => setTab('course')}>Course</button>
        <button className={tab === 'caddie' ? 'active' : ''} onClick={() => setTab('caddie')}>Caddie</button>
        <button className={tab === 'clubs' ? 'active' : ''} onClick={() => setTab('clubs')}>Clubs</button>
        <button className={tab === 'weather' ? 'active' : ''} onClick={() => setTab('weather')}>Weather</button>
      </nav>

      {tab === 'course' && (
        <section className="card">
          <h2>Mount Isa Golf — 18-hole shot plan</h2>
          <div className="courseSummary">
            <span><strong>Tap a shot:</strong> sends it to the caddie</span>
          </div>
          <h3>Front 9</h3>
          <div className="holeGrid" style={{ marginBottom: '24px' }}>
            {mountIsaCourse.filter(h => h.hole <= 9).map(hole => (
              <HoleCard 
                key={hole.hole} 
                hole={hole} 
                onUseHole={useHole} 
                onUseShot={useShot} 
                isActiveHole={hole.hole === Number(selectedHole)}
                ballVisualPct={ballVisualPct}
                onBallMove={pct => {
                  setSelectedHole(hole.hole);
                  setBallVisualPct(pct);
                  setBallMode('manual');
                  setTargetType('centre'); // default
                }}
                targetType={targetType}
                onVisualDistanceUpdate={dist => {
                  if (ballMode === 'manual') setDistance(dist);
                }}
                windSpeed={windSpeedKmh}
                windDirection={windRelation}
              />
            ))}
          </div>
          <h3>Back 9</h3>
          <div className="holeGrid">
            {mountIsaCourse.filter(h => h.hole > 9).map(hole => (
              <HoleCard 
                key={hole.hole} 
                hole={hole} 
                onUseHole={useHole} 
                onUseShot={useShot}
                isActiveHole={hole.hole === Number(selectedHole)}
                ballVisualPct={ballVisualPct}
                onBallMove={pct => {
                  setSelectedHole(hole.hole);
                  setBallVisualPct(pct);
                  setBallMode('manual');
                  setTargetType('centre');
                }}
                targetType={targetType}
                onVisualDistanceUpdate={dist => {
                  if (ballMode === 'manual') setDistance(dist);
                }}
                windSpeed={windSpeedKmh}
                windDirection={windRelation}
              />
            ))}
          </div>
        </section>
      )}

      {tab === 'caddie' && (
        <section className="grid">
          <div className="card">
            <h2>Shot details</h2>
            <label>Hole</label>
            <select value={selectedHole} onChange={e => {
              const hole = mountIsaCourse.find(h => h.hole === Number(e.target.value));
              setSelectedHole(e.target.value);
              setSelectedShot(null);
              if (hole) setDistance(hole.distanceM);
            }}>
              {mountIsaCourse.map(h => <option key={h.hole} value={h.hole}>Hole {h.hole} • Par {h.par} • {formatDistance(h.distanceM)}</option>)}
            </select>

            <label>Current shot number</label>
            <select value={currentShotNum} onChange={e => setCurrentShotNum(e.target.value)}>
              <option value="1">Shot 1</option>
              <option value="2">Shot 2</option>
              <option value="3">Shot 3</option>
              <option value="recovery">Recovery / layup</option>
            </select>

            <div style={{ marginBottom: '16px', padding: '12px', background: '#2c4a3d', borderRadius: '8px' }}>
              <button 
                onClick={handleGpsPosition} 
                style={{ width: '100%', padding: '10px', background: '#3b82f6', color: 'white', fontWeight: 'bold', marginBottom: '8px' }}>
                Use my GPS position
              </button>
              {gpsTargetMsg && <div style={{ fontSize: '12px', color: '#ffcc00', marginBottom: '8px' }}>{gpsTargetMsg}</div>}
              {gpsAccuracyM !== null && (
                <div style={{ fontSize: '12px', color: '#a4e895' }}>
                  GPS accuracy: {formatGpsAccuracy(gpsAccuracyM)}
                </div>
              )}
            </div>

            <label>Distance to target (metres / yards)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <input type="number" value={distance} onChange={e => { setDistance(e.target.value); setBallMode('manual'); }} style={{ width: '100px' }} />
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>m / {mToYd(distance || 0)} yd</span>
            </div>
            
            <label>Target type</label>
            <select value={targetType} onChange={e => setTargetType(e.target.value)}>
              <option value="green">Green (Attack)</option>
              <option value="fairway">Fairway (Position)</option>
              <option value="layup">Layup</option>
              <option value="recovery">Recovery</option>
            </select>

            <label>Wind direction against your shot</label>
            <select value={windRelation} onChange={e => setWindRelation(e.target.value)}>
              <option value="none">No real wind</option>
              <option value="into">Into wind</option>
              <option value="helping">Helping wind</option>
              <option value="cross">Cross wind</option>
            </select>

            {windRelation !== 'none' && (
              <>
                <label>Wind speed (km/h)</label>
                <input type="number" value={windSpeedKmh} onChange={e => setWindSpeedKmh(e.target.value)} />
              </>
            )}

            <label>Slope</label>
            <select value={slope} onChange={e => setSlope(e.target.value)}>
              <option value="flat">Flat</option>
              <option value="uphill">Uphill</option>
              <option value="downhill">Downhill</option>
            </select>

            <label>Lie</label>
            <select value={lie} onChange={e => setLie(e.target.value)}>
              <option value="tee">Tee</option>
              <option value="fairway">Fairway</option>
              <option value="rough">Rough</option>
              <option value="sand">Sand</option>
              <option value="bad">Bad lie</option>
            </select>

            <label>Main danger</label>
            <select value={trouble} onChange={e => setTrouble(e.target.value)}>
              <option value="none">None</option>
              <option value="short">Short</option>
              <option value="long">Long</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
            
            <button style={{ marginTop: '16px', width: '100%', background: '#143d2c', color: 'white' }}>Get Caddie Advice</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="card result">
              <h2 style={{ marginBottom: '4px' }}>Decision-Based Caddie Plan</h2>
              <p style={{ fontSize: '11px', color: '#666', marginTop: 0, marginBottom: '16px' }}>Decision-based caddie guidance. Not professional coaching.</p>
              
              {!weather && <p className="notice">Load live weather for automatic wind adjustment, or enter it manually.</p>}
              {suggestion && (
                <>
                  <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '4px', marginBottom: '12px' }}>Live Shot Decision</h3>
                  <p className="holeBadge">Hole {currentHole.hole} • Par {currentHole.par} • {formatDistance(currentHole.distanceM)}</p>
                  
                  <div style={{ background: '#eef6ed', padding: '14px', borderRadius: '8px', marginBottom: '16px' }}>
                    <p style={{ margin: '4px 0' }}><strong>Recommended club:</strong><br/><span style={{ fontSize: '18px', fontWeight: 'bold', color: '#143d2c' }}>{suggestion.recommendedClub}</span></p>
                    {suggestion.backupClub && <p style={{ margin: '8px 0 4px' }}><strong>Backup club:</strong><br/>{suggestion.backupClub}</p>}
                    <p style={{ margin: '8px 0 4px' }}><strong>Shot type:</strong><br/>{suggestion.shotType}</p>
                    <p style={{ margin: '8px 0 4px' }}><strong>Swing feel:</strong><br/>{suggestion.swingFeel}</p>
                    <p style={{ margin: '8px 0 4px' }}><strong>Adjusted playing distance:</strong><br/>{suggestion.adjustedDistanceM} m / {mToYd(suggestion.adjustedDistanceM)} yd</p>
                    <p style={{ margin: '8px 0 4px' }}><strong>Carry needed:</strong><br/>{suggestion.carryNeededM} m / {mToYd(suggestion.carryNeededM)} yd</p>
                  </div>
                  
                  <p style={{ margin: '8px 0' }}><strong>Why this club:</strong><br/>{suggestion.reason}</p>
                  <p style={{ margin: '8px 0' }}><strong>Aim point:</strong><br/>{suggestion.aimPoint}</p>
                  <p style={{ margin: '8px 0' }}><strong>Safe miss:</strong><br/>{suggestion.safeMiss}</p>
                  <p style={{ margin: '8px 0' }}><strong>Avoid:</strong><br/>{suggestion.avoid}</p>
                  <p style={{ margin: '8px 0' }}><strong>Risk level:</strong><br/>
                    <span style={{ color: suggestion.riskLevel === 'high' ? '#d32f2f' : suggestion.riskLevel === 'medium' ? '#ed6c02' : '#2e7d32', fontWeight: 'bold', textTransform: 'capitalize' }}>
                      {suggestion.riskLevel}
                    </span>
                  </p>
                  <p style={{ margin: '8px 0' }}><strong>Next-shot goal:</strong><br/>{suggestion.nextShotGoal}</p>
                  <p style={{ margin: '8px 0', fontSize: '12px', color: '#555' }}><strong>Inputs used:</strong><br/>{suggestion.inputsUsed.join(', ')}</p>
                  <p style={{ margin: '8px 0', fontSize: '12px', color: '#555' }}><strong>Rules applied:</strong><br/>{suggestion.rulesUsed.join(' • ')}</p>
                </>
              )}
            </div>

            <div className="card result" style={{ background: '#fff' }}>
              <h2>Hole overview strategy</h2>
              <p className="holeBadge">Hole {currentHole.hole} — Par {currentHole.par} — {formatDistance(currentHole.distanceM)}</p>
              <div className="shotList">
                {currentHole.plan.map((shot, i) => {
                  const isLast = i === currentHole.plan.length - 1;
                  const isTee = i === 0;
                  const strategyLabel = isTee ? "Tee Strategy" : isLast ? "Short-game / Green Strategy" : "Approach Strategy";
                  
                  const advice = generateCaddieDecision({
                    hole: currentHole,
                    shotNumber: i + 1,
                    distanceM: shot.totalM,
                    windSpeedKmh: weather?.windSpeedKmh ?? windSpeedKmh,
                    windDirection: windRelation,
                    slope: 'flat',
                    lie: i === 0 ? 'tee' : 'fairway',
                    danger: isLast ? 'short' : 'none',
                    targetType: isLast ? 'green' : 'fairway',
                    playerClubs: clubs
                  });
                  return (
                    <div key={i} className="miniPlan" style={{ marginBottom: '16px', padding: '14px', background: '#fcfcfc', border: '1px solid #eaeaea', borderRadius: '8px' }}>
                      <h4 style={{ margin: '0 0 12px 0', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>{strategyLabel}</h4>
                      
                      <div style={{ background: '#eef6ed', padding: '10px', borderRadius: '6px', marginBottom: '12px' }}>
                        <p style={{ margin: '4px 0' }}><strong>Recommended club:</strong><br/><span style={{ fontSize: '16px', fontWeight: 'bold', color: '#143d2c' }}>{advice.recommendedClub}</span></p>
                        {advice.backupClub && <p style={{ margin: '8px 0 4px' }}><strong>Backup club:</strong><br/>{advice.backupClub}</p>}
                        <p style={{ margin: '8px 0 4px' }}><strong>Shot type:</strong><br/>{advice.shotType}</p>
                        <p style={{ margin: '8px 0 4px' }}><strong>Swing feel:</strong><br/>{advice.swingFeel}</p>
                        <p style={{ margin: '8px 0 4px' }}><strong>Adjusted playing distance:</strong><br/>{advice.adjustedDistanceM} m / {mToYd(advice.adjustedDistanceM)} yd</p>
                        <p style={{ margin: '8px 0 4px' }}><strong>Carry needed:</strong><br/>{advice.carryNeededM} m / {mToYd(advice.carryNeededM)} yd</p>
                      </div>

                      <p style={{ margin: '8px 0' }}><strong>Why this club:</strong><br/>{advice.reason}</p>
                      <p style={{ margin: '8px 0' }}><strong>Aim point:</strong><br/>{advice.aimPoint}</p>
                      <p style={{ margin: '8px 0' }}><strong>Safe miss:</strong><br/>{advice.safeMiss}</p>
                      <p style={{ margin: '8px 0' }}><strong>Avoid:</strong><br/>{advice.avoid}</p>
                      <p style={{ margin: '8px 0' }}><strong>Risk level:</strong><br/>
                        <span style={{ color: advice.riskLevel === 'high' ? '#d32f2f' : advice.riskLevel === 'medium' ? '#ed6c02' : '#2e7d32', fontWeight: 'bold', textTransform: 'capitalize' }}>
                          {advice.riskLevel}
                        </span>
                      </p>
                      <p style={{ margin: '8px 0' }}><strong>Scoring goal:</strong><br/>{advice.nextShotGoal}</p>
                      <p style={{ margin: '8px 0', fontSize: '12px', color: '#555' }}><strong>Rules applied:</strong><br/>{advice.rulesUsed.join(' • ')}</p>
                    </div>
                  );
                })}
                <div style={{ marginTop: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '8px', fontSize: '12px', color: '#444' }}>
                  <strong>Source Note:</strong> Based on general course-management principles: use real carry distance, avoid the big miss, aim away from danger, and choose enough club when short is dangerous.
                </div>
                <p style={{ marginTop: '12px', fontSize: '11px', textAlign: 'center', color: '#666' }}>
                  Decision-based caddie advice — not professional coaching.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {tab === 'clubs' && (
        <section className="card">
          <h2>My club distances</h2>
          <p className="muted">You can edit your base club distances below. (Input base values in metres)</p>
          <div className="club-grid">
            {clubs.map((c, i) => (
              <div className="club-card" key={`${c.club}-${i}`}>
                <input 
                  value={c.club} 
                  onChange={e => updateClub(i, 'club', e.target.value)} 
                  style={{ width: '100%', fontSize: '18px', fontWeight: 'bold', border: 'none', background: 'transparent', padding: '0 0 8px 0', borderBottom: '2px solid #e5ddc8', borderRadius: 0 }} 
                />
                
                <div className="club-field">
                  <label style={{ fontSize: '12px', margin: 0, fontWeight: 'bold', opacity: 0.7 }}>Carry</label>
                  <div className="distance-row">
                    <input type="number" value={c.carry} onChange={e => updateClub(i, 'carry', e.target.value)} />
                    <span className="unit-text">m / {mToYd(c.carry || 0)} yd</span>
                  </div>
                </div>

                <div className="club-field">
                  <label style={{ fontSize: '12px', margin: 0, fontWeight: 'bold', opacity: 0.7 }}>Total</label>
                  <div className="distance-row">
                    <input type="number" value={c.total ?? c.carry} onChange={e => updateClub(i, 'total', e.target.value)} />
                    <span className="unit-text">m / {mToYd((c.total ?? c.carry) || 0)} yd</span>
                  </div>
                </div>

                <div className="club-field">
                  <label style={{ fontSize: '12px', margin: 0, fontWeight: 'bold', opacity: 0.7 }}>Usual miss</label>
                  <select value={c.miss} onChange={e => updateClub(i, 'miss', e.target.value)}>
                    <option value="short">Miss short</option>
                    <option value="long">Miss long</option>
                    <option value="left">Miss left</option>
                    <option value="right">Miss right</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button style={{ flex: 1 }} onClick={() => setClubs([...clubs, { club: 'New Club', carry: 100, total: 105, miss: 'short' }])}>Add club</button>
            <button style={{ flex: 1, background: '#e5ddc8' }} onClick={() => setClubs(defaultClubs)}>Reset to Default set</button>
          </div>
        </section>
      )}

      {tab === 'weather' && (
        <section className="card">
          <h2>Live weather</h2>
          <button onClick={loadWeather}>Use phone GPS and load live weather</button>
          <p className="notice">{weatherStatus}</p>
          {coords && <p className="muted">Location: {coords.lat.toFixed(5)}, {coords.lon.toFixed(5)}</p>}
          {weather && (
            <div className="weatherBox">
              <p><strong>Temperature:</strong> {formatTemp(weather.tempC)}</p>
              <p><strong>Wind:</strong> {formatSpeed(weather.windSpeedKmh)}</p>
              <p><strong>Wind direction:</strong> {weather.windDirection}°</p>
              <p><strong>Rain:</strong> {weather.rainMm} mm</p>
              <p><strong>Updated:</strong> {weather.time}</p>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
