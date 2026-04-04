@tailwind base;
@tailwind components;
@tailwind utilities;

* { box-sizing: border-box; }

body {
  background: #0d0f14;
  color: #e2e8f0;
  font-family: 'DM Sans', sans-serif;
  margin: 0;
  padding: 0;
}

.font-display { font-family: 'Syne', sans-serif; }
.font-mono { font-family: 'JetBrains Mono', monospace; }

/* Risk badge */
.badge-low { @apply bg-green-900/40 text-green-400 border border-green-700/50; }
.badge-medium { @apply bg-yellow-900/40 text-yellow-400 border border-yellow-700/50; }
.badge-high { @apply bg-red-900/40 text-red-400 border border-red-700/50; }
.badge-critical { @apply bg-red-950 text-red-300 border border-red-600; }

/* Pulse animation for high risk */
@keyframes risk-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.risk-pulse { animation: risk-pulse 2s ease-in-out infinite; }

/* Scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: #0d0f14; }
::-webkit-scrollbar-thumb { background: #1e2330; border-radius: 2px; }

/* Card hover */
.card-hover {
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.card-hover:hover {
  border-color: #374151;
  box-shadow: 0 4px 24px rgba(0,0,0,0.4);
}

/* Leaflet overrides */
.leaflet-container {
  background: #141720 !important;
  font-family: 'DM Sans', sans-serif;
}
.leaflet-popup-content-wrapper {
  background: #1e2330;
  color: #e2e8f0;
  border: 1px solid #374151;
  border-radius: 8px;
}
.leaflet-popup-tip { background: #1e2330; }

@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.fade-in { animation: fade-in 0.4s ease forwards; }

@keyframes slide-in {
  from { opacity: 0; transform: translateX(-12px); }
  to { opacity: 1; transform: translateX(0); }
}
.slide-in { animation: slide-in 0.3s ease forwards; }
