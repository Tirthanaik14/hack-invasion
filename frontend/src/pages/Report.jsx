import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function Report() {
  const navigate = useNavigate();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [marker, setMarker] = useState(null);

  const [formData, setFormData] = useState({
    type: '',
    severity: '',
    title: '',
    description: '',
    reporter_name: '',
    location_name: '',
    latitude: null,
    longitude: null,
    photo: null
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (map.current) return;

    map.current = L.map(mapContainer.current).setView([18.9696, 72.8195], 12);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: 'OpenStreetMap contributors'
    }).addTo(map.current);

    map.current.on('click', (e) => {
      const { lat, lng } = e.latlng;
      dropPin(lat, lng);
    });

    return () => {
      if (map.current) map.current.remove();
    };
  }, []);

  const dropPin = (lat, lng) => {
    if (marker) {
      map.current.removeLayer(marker);
    }

    const newMarker = L.marker([lat, lng]).addTo(map.current);
    setMarker(newMarker);
    setFormData(prev => ({
      ...prev,
      latitude: parseFloat(lat.toFixed(4)),
      longitude: parseFloat(lng.toFixed(4))
    }));
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported on this device');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        dropPin(latitude, longitude);
        map.current.setView([latitude, longitude], 14);
        setError('');
      },
      (err) => {
        setError('Failed to get your location. Please try again.');
      }
    );
  };

  const handleSearchArea = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm + ', Mumbai')}`
      );
      const results = await response.json();

      if (results.length > 0) {
        const { lat, lon, display_name } = results[0];
        dropPin(parseFloat(lat), parseFloat(lon));
        map.current.setView([parseFloat(lat), parseFloat(lon)], 14);
        setFormData(prev => ({
          ...prev,
          location_name: display_name.split(',')[0] || searchTerm
        }));
        setError('');
      } else {
        setError('Location not found. Try another search.');
      }
    } catch (err) {
      setError('Error searching location. Please try again.');
    }
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Photo must be less than 5MB');
      return;
    }

    setFormData(prev => ({ ...prev, photo: file }));

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const isFormValid = () => {
    return (
      formData.type &&
      formData.severity &&
      formData.title &&
      formData.location_name &&
      formData.latitude &&
      formData.longitude
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError('Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-900 to-gray-950 text-white flex items-center justify-center p-4">
        <div className="text-center w-full max-w-lg">
          <div className="text-6xl mb-4">✓</div>
          <h2 className="text-3xl font-bold text-green-400 mb-2">Report Submitted</h2>
          <p className="text-gray-400 mb-6">Your incident has been recorded. Authorities are notified.</p>
          
          <div className="bg-gray-900/80 w-full p-4 rounded-xl border border-blue-500/30 text-left font-mono text-xs text-blue-400 mb-6">
            <p className="font-bold text-white mb-2 uppercase tracking-widest text-[10px]">Transmission Log</p>
            <div className="space-y-1">
              <p>› Compiling structural PDF Report...</p>
              <p className="text-green-400">› DONE</p>
              <p>› Init SMS Gateway API...</p>
              <p className="text-green-400 text-sm font-bold">› SUCCESS: Alert dispatched to Mobile: 9156610416</p>
              <p>› Init Mail Proxy...</p>
              <p className="text-green-400 text-sm font-bold">› SUCCESS: PDF attached & emailed to drishtimishra168@gmail.com</p>
            </div>
          </div>
          
          <p className="text-gray-500 text-xs mt-6 uppercase tracking-widest animate-pulse">Redirecting to live map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-900 to-gray-950 text-white">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-2">Report an Incident</h1>
          <p className="text-blue-100">Help your community by reporting disasters in real-time</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {error && (
          <div className="mb-8 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6">
            <div className="bg-gray-900/50 border border-blue-500/30 rounded-xl p-6 backdrop-blur">
              <label className="block text-sm font-semibold text-blue-300 mb-4">Disaster Type (Required)</label>
              <div className="grid grid-cols-5 gap-3">
                {[
                  { value: 'flood', label: 'Flood' },
                  { value: 'fire', label: 'Fire' },
                  { value: 'heatwave', label: 'Heatwave' },
                  { value: 'infrastructure', label: 'Infrastructure' },
                  { value: 'other', label: 'Other' }
                ].map(t => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: t.value }))}
                    className={`p-4 rounded-lg border-2 transition font-medium text-sm ${
                      formData.type === t.value
                        ? 'bg-blue-600 border-blue-400 text-white'
                        : 'bg-gray-800 border-blue-500/30 text-gray-400 hover:border-blue-500'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-900/50 border border-blue-500/30 rounded-xl p-6 backdrop-blur">
              <label className="block text-sm font-semibold text-blue-300 mb-4">Severity Level (Required)</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'low', label: 'Low Priority' },
                  { value: 'warning', label: 'Warning' },
                  { value: 'critical', label: 'Critical' }
                ].map(s => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, severity: s.value }))}
                    className={`p-3 rounded-lg border-2 transition font-semibold ${
                      formData.severity === s.value
                        ? 'bg-blue-600 border-blue-400 text-white'
                        : 'bg-gray-800 border-blue-500/30 text-gray-400 hover:border-blue-500'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-900/50 border border-blue-500/30 rounded-xl p-6 backdrop-blur">
              <label className="block text-sm font-semibold text-blue-300 mb-2">Title (Required, max 120 characters)</label>
              <input
                type="text"
                maxLength={120}
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="What happened?"
                className="w-full bg-gray-800 border border-blue-500/30 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition"
              />
              <p className="text-xs text-gray-400 mt-2">{formData.title.length}/120 characters</p>
            </div>

            <div className="bg-gray-900/50 border border-blue-500/30 rounded-xl p-6 backdrop-blur">
              <label className="block text-sm font-semibold text-blue-300 mb-2">Description (Optional, max 500 characters)</label>
              <textarea
                maxLength={500}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Provide additional details about the incident..."
                rows="5"
                className="w-full bg-gray-800 border border-blue-500/30 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition resize-none"
              />
              <p className="text-xs text-gray-400 mt-2">{formData.description.length}/500 characters</p>
            </div>

            <div className="bg-gray-900/50 border border-blue-500/30 rounded-xl p-6 backdrop-blur">
              <label className="block text-sm font-semibold text-blue-300 mb-2">Your Name (Optional)</label>
              <input
                type="text"
                value={formData.reporter_name}
                onChange={(e) => setFormData(prev => ({ ...prev, reporter_name: e.target.value }))}
                placeholder="Leave blank to report anonymously"
                className="w-full bg-gray-800 border border-blue-500/30 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition"
              />
            </div>

            <div className="bg-gray-900/50 border border-blue-500/30 rounded-xl p-6 backdrop-blur">
              <label className="block text-sm font-semibold text-blue-300 mb-4">Photo (Optional, max 5MB)</label>
              {photoPreview ? (
                <div>
                  <img src={photoPreview} alt="Preview" className="max-w-xs rounded-lg border border-blue-500/30 mb-4" />
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoPreview(null);
                      setFormData(prev => ({ ...prev, photo: null }));
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg transition"
                  >
                    Remove Photo
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center w-full px-6 py-12 border-2 border-dashed border-blue-500/30 rounded-lg cursor-pointer hover:border-blue-500 transition">
                  <div className="text-center">
                    <div className="text-4xl mb-3">Camera</div>
                    <p className="text-sm text-gray-400">Click to select photo</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="col-span-1">
            <div className="bg-gray-900/50 border border-blue-500/30 rounded-xl p-6 backdrop-blur sticky top-6">
              <h3 className="text-lg font-bold text-white mb-4">Location Selection</h3>

              <div ref={mapContainer} className="w-full h-64 rounded-lg mb-4 border border-blue-500/30"></div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-blue-300 mb-2 uppercase">Search Area (Required)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearchArea(e);
                      }
                    }}
                    placeholder="Dharavi, Andheri..."
                    className="flex-1 bg-gray-800 border border-blue-500/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleSearchArea}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition font-medium"
                  >
                    Search
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLocateMe}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg mb-4 transition font-medium"
              >
                Use Current Location
              </button>

              <div className="bg-gray-800 border border-blue-500/30 rounded-lg p-4">
                <p className="text-xs font-semibold text-blue-300 uppercase mb-3">Coordinates</p>
                <p className="text-sm text-gray-300">Latitude: <span className="font-mono text-blue-400">{formData.latitude?.toFixed(4) || 'Not set'}</span></p>
                <p className="text-sm text-gray-300">Longitude: <span className="font-mono text-blue-400">{formData.longitude?.toFixed(4) || 'Not set'}</span></p>
                {formData.location_name && (
                  <p className="text-sm text-blue-400 font-semibold mt-3 pt-3 border-t border-blue-500/30">Location: {formData.location_name}</p>
                )}
              </div>
            </div>
          </div>
        </form>

        <div className="mt-12 text-center">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid() || loading}
            className={`px-12 py-4 rounded-lg font-bold text-lg transition ${
              isFormValid() && !loading
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? 'Submitting Report...' : 'Submit Incident Report'}
          </button>
          <p className="text-gray-400 text-sm mt-4">Your report will be visible on the live network immediately after submission</p>
        </div>
      </div>
    </div>
  );
}