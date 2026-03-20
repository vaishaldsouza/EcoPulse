import React, { useState, useEffect } from 'react';

// Badge tier config — based on total points earned
const BADGE_TIERS = [
  { min: 0,   emoji: '🌱', label: 'Seedling',  color: 'bg-green-100 text-green-700'   },
  { min: 10,  emoji: '🌿', label: 'Sprout',    color: 'bg-teal-100 text-teal-700'     },
  { min: 25,  emoji: '🌲', label: 'Sapling',   color: 'bg-emerald-100 text-emerald-700' },
  { min: 50,  emoji: '🌳', label: 'Guardian',  color: 'bg-lime-100 text-lime-800'     },
];

function getBadge(points) {
  // Walk tiers from highest to lowest and return first match
  return [...BADGE_TIERS].reverse().find(t => points >= t.min) || BADGE_TIERS[0];
}

const RANK_MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardTab({ currentUser }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/auth/leaderboard');
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data);
      }
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">

      {/* Header */}
      <div className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center">
        <h2 className="text-2xl font-black text-green-900">🌍 Eco Warriors Leaderboard</h2>
        <p className="text-green-700 text-sm mt-1">
          Earn points by reporting and resolving environmental issues.
        </p>

        {/* Badge legend */}
        <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
          {BADGE_TIERS.map(tier => (
            <span
              key={tier.label}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${tier.color}`}
            >
              {tier.emoji} {tier.label}
              <span className="opacity-60 font-normal">{tier.min}+ pts</span>
            </span>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs uppercase text-gray-500 border-b bg-gray-50">
              <th className="p-4 text-center w-16">Rank</th>
              <th className="p-4">Eco Warrior</th>
              <th className="p-4 text-center">Badge</th>
              <th className="p-4 text-right">Points</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-400">
                  Loading rankings...
                </td>
              </tr>
            ) : leaderboard.length > 0 ? (
              leaderboard.map((u, i) => {
                const badge = getBadge(u.points);
                const isCurrentUser = u.email === currentUser?.email;
                return (
                  <tr
                    key={u._id}
                    className={`transition-colors hover:bg-gray-50 ${isCurrentUser ? 'bg-green-50' : ''}`}
                  >
                    {/* Rank */}
                    <td className="p-4 text-center font-bold text-gray-400">
                      {i < 3 ? RANK_MEDALS[i] : <span className="text-gray-400">{i + 1}</span>}
                    </td>

                    {/* Name */}
                    <td className="p-4 font-bold text-gray-800">
                      {u.name}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </td>

                    {/* Badge */}
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${badge.color}`}>
                        {badge.emoji} {badge.label}
                      </span>
                    </td>

                    {/* Points */}
                    <td className="p-4 text-right font-mono font-bold text-green-700">
                      {u.points}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-400 italic">
                  No Eco Warriors yet — be the first to report an issue!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
