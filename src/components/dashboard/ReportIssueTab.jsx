import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, X } from 'lucide-react';

// Fix Leaflet default icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

function MapController({ center }) {
    const map = useMap();
    useEffect(() => { if (center) map.flyTo(center, 14); }, [center, map]);
    return null;
}

function LocationPicker({ position, setPosition }) {
    useMapEvents({ click(e) { setPosition(e.latlng); } });
    return position ? <Marker position={position} /> : null;
}

export default function ReportIssueTab({ user, onReportSubmitted }) {
    const [title, setTitle]               = useState('');
    const [description, setDescription]   = useState('');
    const [category, setCategory]         = useState('Illegal Dumping / Waste');
    const [position, setPosition]         = useState(null);
    const [image, setImage]               = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mapCenter, setMapCenter]       = useState([12.2958, 76.6394]); // Mysuru default

    // Search state
    const [searchQuery, setSearchQuery]   = useState('');
    const [suggestions, setSuggestions]   = useState([]);
    const [isSearching, setIsSearching]   = useState(false);
    const [searchError, setSearchError]   = useState('');
    const searchRef                       = useRef(null);

    // Get user's live location on mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setMapCenter([pos.coords.latitude, pos.coords.longitude]),
                () => console.log('Location access denied, using Mysuru default.')
            );
        }
    }, []);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClick = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSuggestions([]);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleSearch = async () => {
        const q = searchQuery.trim();
        if (!q) return;
        setIsSearching(true);
        setSearchError('');
        setSuggestions([]);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&countrycodes=in`,
                { headers: { 'Accept-Language': 'en' } }
            );
            const data = await res.json();
            if (data.length === 0) {
                setSearchError('No locations found. Try a different search.');
            } else {
                setSuggestions(data);
            }
        } catch {
            setSearchError('Search failed. Check your internet connection.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectSuggestion = (place) => {
        const lat = parseFloat(place.lat);
        const lng = parseFloat(place.lon);
        setMapCenter([lat, lng]);
        setPosition({ lat, lng });
        setSearchQuery(place.display_name.split(',').slice(0, 2).join(','));
        setSuggestions([]);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setImage(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!position) return alert('Please select a location on the map.');
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/issues/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reporter: user.name,
                    email: user.email,
                    title, category, description, image,
                    location: { lat: position.lat, lng: position.lng }
                }),
            });
            if (res.ok) {
                alert('Report submitted successfully!');
                setTitle(''); setDescription(''); setPosition(null);
                setImage(''); setSearchQuery('');
                if (onReportSubmitted) onReportSubmitted();
            } else {
                const errorData = await res.json();
                alert(`Submission failed: ${errorData.msg || 'Unknown error'}`);
            }
        } catch (err) {
            console.error(err);
            alert('Submission failed. Check console for details.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="grid lg:grid-cols-3 gap-6">

            {/* ── Left panel: form ── */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
                <h2 className="font-bold text-xl text-green-900">Report an Eco Issue</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text" placeholder="Issue Title (e.g., River Pollution)" required
                        className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none transition-all font-bold"
                        value={title} onChange={e => setTitle(e.target.value)}
                    />
                    <select
                        className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none"
                        value={category} onChange={e => setCategory(e.target.value)}
                    >
                        <option>Illegal Dumping / Waste</option>
                        <option>Air Pollution (Smoke / Burning)</option>
                        <option>Water Pollution (River / Lake)</option>
                        <option>Deforestation / Tree Cutting</option>
                        <option>Stray Animal Welfare</option>
                        <option>Noise Pollution</option>
                        <option>Plastic / Litter on Beach / Park</option>
                        <option>Industrial Effluents</option>
                        <option>Other Environmental Issue</option>
                    </select>
                    {category === 'Other Environmental Issue' && (
                        <input
                            type="text" placeholder="Specify category..."
                            className="w-full p-3 border rounded-xl bg-gray-50"
                            onChange={e => setDescription(`[Category: ${e.target.value}] ${description.replace(/^\[Category: .*\] /, '')}`)}
                        />
                    )}
                    <textarea
                        className="w-full p-3 border rounded-xl bg-gray-50 h-28 focus:ring-2 focus:ring-green-500 outline-none"
                        placeholder="Describe the issue in detail..."
                        value={description} onChange={e => setDescription(e.target.value)} required
                    />
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase">Attach Evidence</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm" />
                    </div>

                    {/* Selected coordinates display */}
                    {position && (
                        <div className="text-xs bg-green-50 border border-green-100 rounded-xl px-3 py-2 text-green-700 font-medium">
                            📍 Pinned: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
                        </div>
                    )}

                    <button
                        type="submit" disabled={isSubmitting}
                        className="w-full bg-green-600 text-white p-4 rounded-xl font-bold shadow-lg shadow-green-100 hover:bg-green-700 transition-all disabled:opacity-60"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Report'}
                    </button>
                </form>
            </div>

            {/* ── Right panel: search + map ── */}
            <div className="lg:col-span-2 flex flex-col gap-3">

                {/* Search bar */}
                <div ref={searchRef} className="relative">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search a location (e.g. Kukkarahalli Lake, Mysuru)..."
                                className="w-full pl-10 pr-10 py-3 border rounded-xl bg-white shadow-sm text-sm outline-none focus:ring-2 focus:ring-green-400 transition-all"
                                value={searchQuery}
                                onChange={e => { setSearchQuery(e.target.value); setSearchError(''); }}
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => { setSearchQuery(''); setSuggestions([]); setSearchError(''); }}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={handleSearch}
                            disabled={isSearching}
                            className="px-5 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all disabled:opacity-60 shadow-sm"
                        >
                            {isSearching ? '...' : 'Search'}
                        </button>
                    </div>

                    {/* Suggestions dropdown */}
                    {suggestions.length > 0 && (
                        <ul className="absolute z-[1000] top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                            {suggestions.map((place) => (
                                <li
                                    key={place.place_id}
                                    className="px-4 py-3 text-sm hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
                                    onClick={() => handleSelectSuggestion(place)}
                                >
                                    <span className="font-semibold text-gray-800">
                                        {place.display_name.split(',')[0]}
                                    </span>
                                    <span className="text-gray-400 ml-1 text-xs">
                                        {place.display_name.split(',').slice(1, 3).join(',')}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Search error */}
                    {searchError && (
                        <p className="text-xs text-red-500 mt-1 ml-1">{searchError}</p>
                    )}
                </div>

                {/* Hint text */}
                <p className="text-xs text-gray-400 ml-1 -mt-1">
                    Search for a location above, or click directly on the map to drop a pin.
                </p>

                {/* Map */}
                <div className="flex-1 h-[460px] rounded-2xl overflow-hidden border shadow-sm" style={{ zIndex: 0 }}>
                    <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <MapController center={mapCenter} />
                        <LocationPicker position={position} setPosition={setPosition} />
                    </MapContainer>
                </div>
            </div>

        </div>
    );
}
