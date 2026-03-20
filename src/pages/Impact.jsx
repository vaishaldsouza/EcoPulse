import React, { useState, useEffect } from 'react';

const ECO_MULTIPLIERS = {
  'Deforestation / Tree Cutting':     { trees: 12, waste: 0,   water: 1, co2: 240 },
  'Water Pollution (River / Lake)':   { trees: 0,  waste: 0,   water: 1, co2: 30  },
  'Illegal Dumping / Waste':          { trees: 0,  waste: 80,  water: 0, co2: 15  },
  'Plastic / Litter on Beach / Park': { trees: 0,  waste: 40,  water: 0, co2: 8   },
  'Industrial Effluents':             { trees: 0,  waste: 200, water: 1, co2: 50  },
  'Air Pollution (Smoke / Burning)':  { trees: 0,  waste: 0,   water: 0, co2: 120 },
  'Noise Pollution':                  { trees: 0,  waste: 0,   water: 0, co2: 0   },
  'Stray Animal Welfare':             { trees: 0,  waste: 20,  water: 0, co2: 5   },
};

function StatCard({ emoji, value, unit, label, colorClass }) {
  return (
    <div className={`p-8 rounded-3xl border shadow-sm text-center ${colorClass}`}>
      <div className="text-4xl mb-3">{emoji}</div>
      <p className="text-5xl font-black">{value.toLocaleString()}</p>
      <p className="text-sm font-bold uppercase tracking-widest mt-1 opacity-70">{unit}</p>
      <p className="text-xs font-semibold uppercase tracking-widest mt-2">{label}</p>
    </div>
  );
}

export default function Impact() {
  const [stats, setStats] = useState({ total: 0, resolved: 0 });
  const [ecoStats, setEcoStats] = useState({ trees: 0, waste: 0, water: 0, co2: 0 });
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchImpactData = async () => {
      try {
        const res = await fetch('/api/issues/all');
        const data = await res.json();

        const resolved = data.filter(r => r.status === 'Resolved');
        setStats({ total: data.length, resolved: resolved.length });

        // Calculate eco impact from resolved issues only
        const eco = resolved.reduce(
          (acc, issue) => {
            const m = ECO_MULTIPLIERS[issue.category] || { trees: 0, waste: 0, water: 0, co2: 0 };
            return {
              trees: acc.trees + m.trees,
              waste: acc.waste + m.waste,
              water: acc.water + m.water,
              co2:   acc.co2   + m.co2,
            };
          },
          { trees: 0, waste: 0, water: 0, co2: 0 }
        );
        setEcoStats(eco);

        // Leaderboard — top reporters by resolved count
        const counts = resolved.reduce((acc, r) => {
          acc[r.reporter] = (acc[r.reporter] || 0) + 1;
          return acc;
        }, {});
        setLeaders(
          Object.entries(counts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
        );
      } catch (err) {
        console.error('Impact fetch error:', err);
      }
    };
    fetchImpactData();
  }, []);

  return (
    <div className="bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl font-black text-green-900 mb-2">Our Eco Impact</h2>
          <p className="text-gray-500 font-medium">
            Real environmental progress made by citizens like you.
          </p>
        </div>

        {/* Top-level numbers */}
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-8 bg-green-50 rounded-3xl border border-green-100 shadow-sm">
            <p className="text-5xl font-black text-green-600">{stats.total}</p>
            <p className="text-xs font-bold text-green-900 uppercase tracking-widest mt-2">Issues Reported</p>
          </div>
          <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-100 shadow-sm">
            <p className="text-5xl font-black text-emerald-600">{stats.resolved}</p>
            <p className="text-xs font-bold text-emerald-900 uppercase tracking-widest mt-2">Issues Resolved</p>
          </div>
          <div className="p-8 bg-teal-50 rounded-3xl border border-teal-100 shadow-sm">
            <p className="text-5xl font-black text-teal-600">
              {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
            </p>
            <p className="text-xs font-bold text-teal-900 uppercase tracking-widest mt-2">Resolution Rate</p>
          </div>
        </div>

        {/* Eco Metrics */}
        <div>
          <h3 className="text-center text-xl font-bold text-gray-700 mb-6">
            🌍 Environmental Impact from Resolved Reports
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              emoji="🌳"
              value={ecoStats.trees}
              unit="Trees"
              label="Saved from Deforestation"
              colorClass="bg-green-50 border-green-100 text-green-900"
            />
            <StatCard
              emoji="🗑️"
              value={ecoStats.waste}
              unit="Kg of Waste"
              label="Removed from Nature"
              colorClass="bg-orange-50 border-orange-100 text-orange-900"
            />
            <StatCard
              emoji="💧"
              value={ecoStats.water}
              unit="Water Bodies"
              label="Protected & Cleaned"
              colorClass="bg-blue-50 border-blue-100 text-blue-900"
            />
            <StatCard
              emoji="☁️"
              value={ecoStats.co2}
              unit="Kg CO₂"
              label="Equivalent Prevented"
              colorClass="bg-purple-50 border-purple-100 text-purple-900"
            />
          </div>
          <p className="text-center text-xs text-gray-400 mt-4 italic">
            * Estimates based on category averages. Figures apply to resolved reports only.
          </p>
        </div>

        {/* Leaderboard */}
        <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-[2rem] border border-gray-100 shadow-inner">
          <h3 className="text-xl font-bold text-center mb-6 flex items-center justify-center gap-2">
            <span>�</span> Eco Warriors
          </h3>
          <div className="space-y-3">
            {leaders.length > 0 ? leaders.map((hero, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:scale-[1.02] transition-transform"
              >
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full font-black text-xs
                    ${index === 0 ? 'bg-yellow-400 text-white' :
                      index === 1 ? 'bg-gray-300 text-gray-700' :
                      index === 2 ? 'bg-orange-300 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {index + 1}
                  </span>
                  <span className="font-bold text-gray-800">{hero.name}</span>
                </div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                  {hero.count} Resolved
                </span>
              </div>
            )) : (
              <p className="text-center text-gray-400 text-sm italic py-4">
                Be the first Eco Warrior!
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}