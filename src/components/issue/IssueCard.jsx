import React, { useState } from 'react';
import { ThumbsUp, MapPin, Calendar, User } from 'lucide-react';

function StatusBadge({ status }) {
  const statusConfig = {
    Pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
    'In Progress': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Progress' },
    Resolved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Resolved' }
  };
  const config = statusConfig[status] || statusConfig.Pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}

function SeverityBadge({ severity }) {
  const config = {
    Low:      { bg: 'bg-green-100',  text: 'text-green-800',  dot: '🟢' },
    Moderate: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: '🟡' },
    High:     { bg: 'bg-orange-100', text: 'text-orange-800', dot: '🟠' },
    Critical: { bg: 'bg-red-100',    text: 'text-red-800',    dot: '🔴' },
  };
  const c = config[severity] || config.Moderate;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${c.bg} ${c.text}`}>
      {c.dot} {severity || 'Moderate'}
    </span>
  );
}

function UpvoteButton({ count = 0, isUpvoted = false, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${isUpvoted
        ? 'bg-blue-600 text-white hover:bg-blue-700'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
    >
      <ThumbsUp className={`w-4 h-4 ${isUpvoted ? 'fill-current' : ''}`} />
      <span>{count}</span>
    </button>
  );
}

export default function IssueCard({ issue, onUpvote, currentUserId }) {
  const {
    _id, title, description, category, status, upvotes,
    location, createdAt, reporter, likedBy, severity, environmentalImpact
  } = issue;

  const isUpvoted = likedBy?.includes(currentUserId);
  const locationText = location?.lat ? `Lat: ${location.lat.toFixed(2)}, Lng: ${location.lng.toFixed(2)}` : 'Unknown Location';

  const categoryColors = {
    Infrastructure: 'bg-orange-100 text-orange-800',
    Lighting: 'bg-yellow-100 text-yellow-800',
    Sanitation: 'bg-green-100 text-green-800',
    'Water Supply': 'bg-blue-100 text-blue-800',
    'Public Amenities': 'bg-indigo-100 text-indigo-800',
    Other: 'bg-gray-100 text-gray-800'
  };

  const categoryColor = categoryColors[category] || categoryColors.Other;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StatusBadge status={status} />
          <SeverityBadge severity={severity} />
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColor}`}>
          {category}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
        {title || "Untitled Issue"}
      </h3>

      <p className="text-sm text-gray-600 mb-3 line-clamp-3 whitespace-pre-wrap">
        {description}
      </p>
      {environmentalImpact && (
        <div className="flex items-start gap-1.5 bg-green-50 border border-green-100 rounded-xl px-3 py-2 mb-4">
          <span className="text-green-500 mt-0.5 text-xs">🌿</span>
          <p className="text-xs text-green-700 font-medium leading-snug">{environmentalImpact}</p>
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
        {location && (
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{locationText}</span>
          </div>
        )}
        {createdAt && (
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(createdAt).toLocaleDateString()}</span>
          </div>
        )}
        {reporter && (
          <div className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            <span>{reporter}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex gap-4">
          <UpvoteButton count={upvotes || 0} isUpvoted={isUpvoted} onToggle={() => onUpvote(_id)} />
          <div className="flex items-center gap-2 text-gray-400">
            <button
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=Check out this issue on CivicPulse: ${title}`, '_blank')}
              className="hover:text-blue-400 transition-colors"
              title="Share on Twitter"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
            </button>
            <button
              onClick={() => window.open(`https://wa.me/?text=Check out this issue: ${title}`, '_blank')}
              className="hover:text-green-500 transition-colors"
              title="Share on WhatsApp"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            </button>
            <button
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}
              className="hover:text-blue-600 transition-colors"
              title="Share on Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </button>
          </div>
        </div>
        {/* Detail view not implemented yet */}
      </div>
    </div>
  );
}