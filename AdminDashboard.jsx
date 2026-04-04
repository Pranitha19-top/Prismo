import React, { useEffect, useState } from 'react'
import { getAllZones } from '../utils/api'
import { Card, RiskBadge, Spinner } from '../components/UI'
import RiskMap from '../components/RiskMap'

export default function RiskMapPage() {
  const [zones, setZones] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    getAllZones().then(setZones).finally(() => setLoading(false))
  }, [])

  const riskCounts = {
    LOW: zones.filter(z => z.risk_level === 'LOW').length,
    MEDIUM: zones.filter(z => z.risk_level === 'MEDIUM').length,
    HIGH: zones.filter(z => z.risk_level === 'HIGH').length,
  }

  if (loading) return <div className="pt-20"><Spinner /></div>

  return (
    <div className="pt-20 pb-6 px-4 max-w-5xl mx-auto fade-in">
      <div className="mb-4">
        <h1 className="font-display font-bold text-xl text-text">Live Risk Map</h1>
        <p className="text-text-dim text-sm">Bangalore delivery zones — updated today</p>
      </div>

      {/* Legend */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {[
          { level: 'LOW', count: riskCounts.LOW, color: 'text-green-400' },
          { level: 'MEDIUM', count: riskCounts.MEDIUM, color: 'text-yellow-400' },
          { level: 'HIGH', count: riskCounts.HIGH, color: 'text-red-400' },
        ].map(({ level, count, color }) => (
          <div key={level} className="flex items-center gap-2 bg-panel border border-border rounded-lg px-3 py-1.5">
            <RiskBadge level={level} size="xs" />
            <span className={`font-mono font-bold ${color}`}>{count}</span>
            <span className="text-text-dim text-xs">zones</span>
          </div>
        ))}
        <div className="ml-auto text-text-dim text-xs flex items-center">
          Click a zone for details
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card className="p-0 overflow-hidden" style={{ height: '480px' }}>
            <div style={{ height: '480px' }}>
              <RiskMap zones={zones} onZoneClick={setSelected} />
            </div>
          </Card>
        </div>

        {/* Zone list */}
        <div className="flex flex-col gap-2">
          {zones.map(zone => (
            <button
              key={zone.zone}
              onClick={() => setSelected(zone)}
              className={`w-full text-left p-3 rounded-xl border transition-all ${
                selected?.zone === zone.zone
                  ? 'border-accent bg-accent/10'
                  : 'border-border bg-panel hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-text text-sm">{zone.zone}</span>
                <RiskBadge level={zone.risk_level} size="xs" />
              </div>
              <div className="text-text-dim text-xs flex gap-2">
                <span>🌧 {zone.rain}mm</span>
                <span>💨 {zone.aqi?.toFixed(0)}</span>
                <span>🚦 {zone.traffic_level}/5</span>
                {zone.curfew && <span className="text-red-400">🚫</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected zone detail */}
      {selected && (
        <Card className="mt-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-text-dim text-xs font-mono mb-1">SELECTED ZONE</div>
              <div className="font-display font-bold text-xl text-text">{selected.zone}</div>
            </div>
            <RiskBadge level={selected.risk_level} size="md" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {[
              { label: 'Risk Score', value: selected.risk_score?.toFixed(1) },
              { label: 'Rainfall', value: `${selected.rain}mm` },
              { label: 'AQI', value: selected.aqi?.toFixed(0) },
              { label: 'Traffic', value: `${selected.traffic_level}/5` },
              { label: 'Temperature', value: `${selected.temperature}°C` },
              { label: 'Curfew', value: selected.curfew ? '🚫 Active' : '✓ None' },
            ].map(item => (
              <div key={item.label} className="bg-surface rounded-lg p-3">
                <div className="text-text-dim text-xs">{item.label}</div>
                <div className="font-mono font-semibold text-text mt-0.5">{item.value}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
