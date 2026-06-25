import React, { useState } from 'react';
import { Info } from 'lucide-react';
import GlassCard from './GlassCard';
import './Heatmap.css';

// Import map images
import AbyssMap from '../assets/maps/Abyss_minimap.webp';
import AscentMap from '../assets/maps/Ascent_minimap.webp';
import BindMap from '../assets/maps/Bind_minimap.webp';
import BreezeMap from '../assets/maps/Breeze_minimap.webp';
import CorrodeMap from '../assets/maps/Corrode_minimap.webp';
import FractureMap from '../assets/maps/Fracture_minimap.webp';
import HavenMap from '../assets/maps/Haven_minimap.webp';
import IceboxMap from '../assets/maps/Icebox_minimap.webp';
import LotusMap from '../assets/maps/Lotus_minimap.webp';
import PearlMap from '../assets/maps/Pearl_minimap.webp';
import SplitMap from '../assets/maps/Split_minimap.webp';
import SunsetMap from '../assets/maps/Sunset_minimap.webp';
import SummitMap from '../assets/maps/Summit_minimap.webp';

/**
 * Map image lookup by display name.
 */
const MAP_IMAGES = {
  Abyss: AbyssMap,
  Ascent: AscentMap,
  Bind: BindMap,
  Breeze: BreezeMap,
  Corrode: CorrodeMap,
  Fracture: FractureMap,
  Haven: HavenMap,
  Icebox: IceboxMap,
  Lotus: LotusMap,
  Pearl: PearlMap,
  Split: SplitMap,
  Sunset: SunsetMap,
  Summit: SummitMap,
};

/**
 * Per-map coordinate transform constants from the Valorant API.
 * Formula: minimapPercent = (gameCoord * multiplier) + scalarToAdd
 * Result is in 0–1 range (i.e. percentage of the minimap image).
 * Note: yMultiplier is negative because game Y increases upward but
 *       image Y increases downward.
 */
const MAP_TRANSFORMS = {
  Ascent:   { xMul: 7.0e-05, xAdd: 0.813895, yMul: -7.0e-05, yAdd: 0.573242 },
  Split:    { xMul: 7.8e-05, xAdd: 0.842188, yMul: -7.8e-05, yAdd: 0.697578 },
  Fracture: { xMul: 7.8e-05, xAdd: 0.556952, yMul: -7.8e-05, yAdd: 1.155886 },
  Bind:     { xMul: 5.9e-05, xAdd: 0.576941, yMul: -5.9e-05, yAdd: 0.967566 },
  Breeze:   { xMul: 7.0e-05, xAdd: 0.465123, yMul: -7.0e-05, yAdd: 0.833078 },
  Lotus:    { xMul: 7.2e-05, xAdd: 0.454789, yMul: -7.2e-05, yAdd: 0.917752 },
  Sunset:   { xMul: 7.8e-05, xAdd: 0.500000, yMul: -7.8e-05, yAdd: 0.515625 },
  Pearl:    { xMul: 7.8e-05, xAdd: 0.480469, yMul: -7.8e-05, yAdd: 0.916016 },
  Icebox:   { xMul: 7.2e-05, xAdd: 0.460214, yMul: -7.2e-05, yAdd: 0.304687 },
  Corrode:  { xMul: 7.0e-05, xAdd: 0.526158, yMul: -7.0e-05, yAdd: 0.500000 },
  Haven:    { xMul: 7.5e-05, xAdd: 1.093450, yMul: -7.5e-05, yAdd: 0.642728 },
  Abyss:    { xMul: 8.1e-05, xAdd: 0.500000, yMul: -8.1e-05, yAdd: 0.500000 },
  Summit:   { xMul: 7.5e-05, xAdd: 0.047401, yMul: -7.5e-05, yAdd: 0.978891 },
};

/**
 * Convert in-game coordinates to minimap percentage (0–100).
 */
function toMinimapCoords(gameX, gameY, mapName) {
  const t = MAP_TRANSFORMS[mapName];
  if (!t) {
    // Fallback: crude normalize for unknown maps
    return { x: ((gameY + 10000) / 20000) * 100, y: ((gameX + 10000) / 20000) * 100 };
  }
  // In Valorant API location data, X and Y are often swapped relative to the minimap transform multipliers
  // Minimap X corresponds to Game Y, and Minimap Y corresponds to Game X
  const x = (gameY * t.xMul + t.xAdd) * 100;
  const y = (gameX * t.yMul + t.yAdd) * 100;
  return { x, y };
}

/**
 * Engagement Heatmap — shows kill/death coordinates per match
 * overlaid on the actual minimap image.
 */
const Heatmap = ({ data }) => {
  const matches = data?.matches || [];
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (matches.length === 0) {
    return (
      <GlassCard glowColor="cyan" className="heatmap-container">
        <div className="heatmap-header">
          <h3>Engagement Heatmap</h3>
        </div>
        <div className="heatmap-empty">No heatmap data available.</div>
      </GlassCard>
    );
  }

  const selected = matches[selectedIdx] || matches[0];
  const mapImage = MAP_IMAGES[selected.map] || null;

  return (
    <GlassCard glowColor="cyan" className="heatmap-container">
      <div className="heatmap-header">
        <div className="card-title-row">
          <h3>Engagement Heatmap</h3>
          <div className="info-tooltip-container">
            <Info size={14} className="info-icon" />
            <div className="info-tooltip-content heatmap-tooltip">
              Visualizes where you engage enemies. Circles are kills, diamonds are deaths. Colors denote Attack vs Defense.
            </div>
          </div>
        </div>

        {/* Match Dropdown */}
        <select
          className="match-dropdown"
          value={selectedIdx}
          onChange={(e) => setSelectedIdx(Number(e.target.value))}
        >
          {matches.map((m, i) => (
            <option key={m.match_id} value={i}>
              Match {i + 1} — {m.map}
            </option>
          ))}
        </select>
      </div>

      {/* Legend */}
      <div className="heatmap-legend">
        <div className="legend-item">
          <span className="legend-marker kill-attack-marker"></span>
          Kill (Attack)
        </div>
        <div className="legend-item">
          <span className="legend-marker kill-defense-marker"></span>
          Kill (Defense)
        </div>
        <div className="legend-item">
          <span className="legend-marker death-attack-marker"></span>
          Death (Attack)
        </div>
        <div className="legend-item">
          <span className="legend-marker death-defense-marker"></span>
          Death (Defense)
        </div>
      </div>

      {/* Map Area */}
      <div className="heatmap-map">
        {mapImage && (
          <img src={mapImage} alt={selected.map} className="minimap-image" />
        )}
        {!mapImage && <div className="map-label">{selected.map}</div>}
        <div className="map-surface">
          {/* Kill dots */}
          {(selected.kills || []).map((k, i) => {
            const pos = toMinimapCoords(k.x, k.y, selected.map);
            return (
              <div
                key={`k-${i}`}
                className={`heatmap-dot ${k.side === 'attack' ? 'kill-attack-dot' : 'kill-defense-dot'}`}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                title={`Kill (${k.side})`}
              ></div>
            );
          })}
          {/* Death dots */}
          {(selected.deaths || []).map((d, i) => {
            const pos = toMinimapCoords(d.x, d.y, selected.map);
            return (
              <div
                key={`d-${i}`}
                className={`heatmap-dot ${d.side === 'attack' ? 'death-attack-dot' : 'death-defense-dot'}`}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                title={`Death (${d.side})`}
              ></div>
            );
          })}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="heatmap-stats">
        <span className="stat-kills">{(selected.kills || []).length} Kills</span>
        <span className="stat-deaths">{(selected.deaths || []).length} Deaths</span>
      </div>
    </GlassCard>
  );
};

export default Heatmap;
