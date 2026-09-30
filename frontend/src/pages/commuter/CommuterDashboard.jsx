import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Navigation, Search, CheckCircle2, User, ChevronLeft } from 'lucide-react';
import { apiClient } from '../../api/client';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer, Autocomplete } from '@react-google-maps/api';

const libraries = ['places', 'visualization'];
const mapContainerStyle = { width: '100%', height: '100%' };
const defaultCenter = { lat: 23.2599, lng: 77.4126 }; // Bhopal

const CommuterDashboard = () => {
  const { user } = useAuth();
  
  // Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  const [map, setMap] = useState(null);
  
  // State Machine
  // 'IDLE' -> 'RIDE_OPTIONS' -> 'CONFIRMING' -> 'REQUESTED' -> 'ACTIVE'
  const [step, setStep] = useState('IDLE');
  
  // Booking Data
  const [pickup, setPickup] = useState(null); // { lat, lng, address }
  const [destination, setDestination] = useState(null);
  const [passengerCount, setPassengerCount] = useState(1);
  const [rideOptions, setRideOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [directions, setDirections] = useState(null);
  const [activeRide, setActiveRide] = useState(null);

  // Refs for Autocomplete
  const pickupAutocompleteRef = useRef(null);
  const destinationAutocompleteRef = useRef(null);
  const pickupInputRef = useRef(null);
  const destInputRef = useRef(null);

  const [loading, setLoading] = useState(false);

  // Load current active ride on mount
  useEffect(() => {
    fetchActiveRide();
  }, []);

  const fetchActiveRide = async () => {
    try {
      const res = await apiClient.get('/rides/history'); // Use history but find active
      if (res.data?.success) {
        const active = res.data.data.find(r => ['pending', 'accepted', 'in_progress'].includes(r.status));
        if (active) {
          setActiveRide(active);
          setStep('ACTIVE');
        }
      }
    } catch (e) {
      console.error('Failed to fetch active ride', e);
    }
  };

  const onLoadMap = useCallback((mapInstance) => {
    setMap(mapInstance);
    // Try to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const currentLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        mapInstance.panTo(currentLoc);
        
        // Reverse geocode
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: currentLoc }, (results, status) => {
          if (status === 'OK' && results[0]) {
            setPickup({ lat: currentLoc.lat, lng: currentLoc.lng, address: results[0].formatted_address });
            if (pickupInputRef.current) pickupInputRef.current.value = results[0].formatted_address;
          }
        });
      }, () => {
        console.warn('Geolocation blocked or failed.');
      });
    }
  }, []);

  const calculateRoute = async (origin, dest) => {
    if (!origin || !dest || !window.google) return;
    const directionsService = new window.google.maps.DirectionsService();
    try {
      const result = await directionsService.route({
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: dest.lat, lng: dest.lng },
        travelMode: window.google.maps.TravelMode.DRIVING,
      });
      setDirections(result);
      // Get distance and time
      const route = result.routes[0].legs[0];
      const distanceText = route.distance.text;
      const durationText = route.duration.text;
      
      // Calculate dummy fare for MVP based on distance
      const distanceKm = route.distance.value / 1000;
      
      setRideOptions([
        {
          id: 'shared',
          name: 'Shared Auto',
          fare: Math.round(15 + (distanceKm * 10 * passengerCount)),
          eta: durationText,
          capacity: 4,
          recommended: true
        },
        {
          id: 'direct',
          name: 'Direct Auto',
          fare: Math.round(40 + (distanceKm * 20)),
          eta: durationText,
          capacity: 4,
          recommended: false
        }
      ]);
      setStep('RIDE_OPTIONS');
      
    } catch (error) {
      console.error('Error calculating route:', error);
      alert('Could not calculate route. Please try different locations.');
    }
  };

  const onPickupPlaceChanged = () => {
    if (pickupAutocompleteRef.current) {
      const place = pickupAutocompleteRef.current.getPlace();
      if (place.geometry) {
        const loc = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), address: place.formatted_address };
        setPickup(loc);
        map?.panTo(loc);
        if (destination) calculateRoute(loc, destination);
      }
    }
  };

  const onDestPlaceChanged = () => {
    if (destinationAutocompleteRef.current) {
      const place = destinationAutocompleteRef.current.getPlace();
      if (place.geometry) {
        const loc = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), address: place.formatted_address };
        setDestination(loc);
        if (pickup) calculateRoute(pickup, loc);
      }
    }
  };

  const handleBookRide = async () => {
    if (!pickup || !destination || !selectedOption) return;
    
    setLoading(true);
    try {
      const payload = {
        pickup_lat: pickup.lat,
        pickup_lng: pickup.lng,
        pickup_address: pickup.address,
        destination_lat: destination.lat,
        destination_lng: destination.lng,
        destination_address: destination.address,
        passenger_count: passengerCount,
        ride_type: selectedOption.id,
        estimated_fare: selectedOption.fare
      };
      
      const res = await apiClient.post('/rides/requests', payload);
      
      if (res.data?.success) {
        setActiveRide(res.data.data.rideRequest);
        setStep('REQUESTED');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to request ride.');
    } finally {
      setLoading(false);
    }
  };

  const cancelRide = async () => {
    if (!activeRide) return;
    try {
      await apiClient.post(`/rides/requests/${activeRide.id}/decline`); // Using existing driver decline endpoint or create a passenger cancel one
      setActiveRide(null);
      setStep('IDLE');
      setDirections(null);
      setDestination(null);
      if (destInputRef.current) destInputRef.current.value = '';
    } catch (error) {
      console.error('Failed to cancel ride', error);
      alert('Failed to cancel ride');
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div className="p-4">Loading Map...</div>;

  return (
    <div className="flex-1 flex flex-col bg-gray-50 relative h-full w-full max-w-md mx-auto">
      
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={14}
          onLoad={onLoadMap}
          options={{ disableDefaultUI: true, zoomControl: false }}
        >
          {pickup && !directions && <Marker position={pickup} icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' }} />}
          {destination && !directions && <Marker position={destination} icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' }} />}
          {directions && <DirectionsRenderer directions={directions} options={{ suppressMarkers: false, polylineOptions: { strokeColor: '#2563EB', strokeWeight: 4 } }} />}
        </GoogleMap>
      </div>

      {/* Foreground UI */}
      <div className="relative z-10 flex flex-col h-full pointer-events-none">
        
        {/* Top Spacer to push content down */}
        <div className="flex-1"></div>

        {/* Bottom Panel */}
        <div className="bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pointer-events-auto flex flex-col transition-all duration-300">
          
          {step === 'IDLE' && (
            <div className="p-6">
              <h2 className="text-xl font-black text-gray-900 mb-4">Where to, {user?.name?.split(' ')[0] || 'Commuter'}?</h2>
              
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm relative p-2">
                <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200"></div>
                
                {/* Pickup */}
                <div className="flex items-center gap-3 p-2 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                    <Navigation className="w-3 h-3 text-blue-500" />
                  </div>
                  <Autocomplete
                    onLoad={auto => (pickupAutocompleteRef.current = auto)}
                    onPlaceChanged={onPickupPlaceChanged}
                    className="flex-1"
                  >
                    <input 
                      ref={pickupInputRef}
                      type="text" 
                      placeholder="Current Location" 
                      className="w-full text-sm font-medium text-gray-900 bg-transparent outline-none" 
                    />
                  </Autocomplete>
                </div>

                <div className="border-t border-gray-100 my-1 mx-10"></div>

                {/* Destination */}
                <div className="flex items-center gap-3 p-2 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-brand-50 flex items-center justify-center border border-brand-100">
                    <MapPin className="w-3 h-3 text-brand" />
                  </div>
                  <Autocomplete
                    onLoad={auto => (destinationAutocompleteRef.current = auto)}
                    onPlaceChanged={onDestPlaceChanged}
                    className="flex-1"
                  >
                    <input 
                      ref={destInputRef}
                      type="text" 
                      placeholder="Search destination..." 
                      className="w-full text-sm font-medium text-gray-900 bg-transparent outline-none" 
                    />
                  </Autocomplete>
                </div>
              </div>
            </div>
          )}

          {step === 'RIDE_OPTIONS' && (
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="flex items-center gap-3 mb-4">
                <button onClick={() => setStep('IDLE')} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <h2 className="text-xl font-black text-gray-900">Select a Ride</h2>
              </div>

              {/* Passengers Count */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-gray-700">Passengers</span>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setPassengerCount(Math.max(1, passengerCount - 1))}
                    className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full text-gray-700 font-bold"
                  >-</button>
                  <span className="font-bold text-lg w-4 text-center">{passengerCount}</span>
                  <button 
                    onClick={() => {
                      setPassengerCount(Math.min(4, passengerCount + 1));
                      // Recalculate options
                      calculateRoute(pickup, destination);
                    }}
                    className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full text-gray-700 font-bold"
                  >+</button>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {rideOptions.map(option => (
                  <div 
                    key={option.id}
                    onClick={() => setSelectedOption(option)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${selectedOption?.id === option.id ? 'border-brand bg-brand-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">{option.name}</h3>
                        {option.recommended && <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Recommended</span>}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{option.eta} • Max {option.capacity} seats</p>
                    </div>
                    <div className="text-xl font-black text-gray-900">₹{option.fare}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep('CONFIRMING')}
                disabled={!selectedOption}
                className="w-full py-4 bg-brand text-white font-bold rounded-2xl shadow-lg hover:bg-brand-dark transition-colors disabled:opacity-50"
              >
                Confirm {selectedOption?.name || 'Ride'}
              </button>
            </div>
          )}

          {step === 'CONFIRMING' && (
            <div className="p-6">
               <div className="flex items-center gap-3 mb-4">
                <button onClick={() => setStep('RIDE_OPTIONS')} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <h2 className="text-xl font-black text-gray-900">Confirm Request</h2>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl mb-6 text-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Pickup</span>
                  <span className="font-medium text-gray-900 truncate max-w-[200px] text-right">{pickup?.address}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Drop</span>
                  <span className="font-medium text-gray-900 truncate max-w-[200px] text-right">{destination?.address}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium text-gray-900">{selectedOption?.name} ({passengerCount} pax)</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                  <span className="font-bold text-gray-900">Total Fare</span>
                  <span className="font-black text-brand text-lg">₹{selectedOption?.fare}</span>
                </div>
              </div>

              <button
                onClick={handleBookRide}
                disabled={loading}
                className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-lg hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Requesting...' : 'Send Request to Drivers'}
              </button>
            </div>
          )}

          {step === 'REQUESTED' && (
            <div className="p-8 text-center bg-white rounded-t-3xl flex flex-col items-center shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
              <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mb-4 relative">
                 <div className="absolute inset-0 bg-brand-100 rounded-full animate-ping opacity-75"></div>
                 <Search className="w-8 h-8 text-brand relative z-10 animate-pulse" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Finding your ride...</h2>
              <p className="text-gray-500 text-sm mb-8 font-medium">Matching you with the nearest {selectedOption?.name || 'auto'} for {passengerCount} passenger(s).</p>
              
              <button 
                onClick={cancelRide}
                className="w-full py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
              >
                Cancel Request
              </button>
            </div>
          )}

          {step === 'ACTIVE' && activeRide && (
            <div className="p-6 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
               <div className="flex justify-between items-start mb-4">
                 <div>
                   <h2 className="text-2xl font-black text-gray-900">
                     {activeRide.status === 'accepted' || activeRide.status === 'in_progress' ? 'Driver is on the way!' : 'Ride in progress'}
                   </h2>
                   <p className="text-gray-500 text-sm font-medium">ETA: ~4 mins</p>
                 </div>
                 <div className="bg-brand-50 text-brand px-3 py-1 rounded-full font-bold text-sm border border-brand-100">
                   ₹{activeRide.fare || activeRide.estimated_fare || selectedOption?.fare}
                 </div>
               </div>
               
               <div className="bg-gray-50 p-4 rounded-2xl mb-6 flex items-center gap-4 border border-gray-100">
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-xl font-bold">
                   🚗
                 </div>
                 <div>
                   <p className="font-bold text-gray-900">{activeRide.driver?.profiles?.name || 'Assigned Driver'}</p>
                   <p className="text-xs text-gray-500 font-medium">Auto Rickshaw • MP04 AB 1234</p>
                 </div>
               </div>

               <button 
                onClick={cancelRide}
                className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors border border-red-100"
              >
                Cancel Ride
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CommuterDashboard;
