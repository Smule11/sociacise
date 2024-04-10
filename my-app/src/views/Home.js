// make a landing page
import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function Home() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // Define the position for the map center
    const position = [51.505, -0.09]; // Example coordinates (latitude, longitude)
    
    // Custom marker icon
    const customIcon = new L.Icon({
        iconUrl: 'path/to/your/custom/icon.png',
        iconSize: [35, 35], // Size of the icon
        iconAnchor: [17, 35], // Point of the icon which will correspond to marker's location
        popupAnchor: [0, -35], // Point from which the popup should open relative to the iconAnchor
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user && user.emailVerified) {
            setUser(user);
            navigate('/', { replace: true }); // No need to navigate to '/' since we're already there
        } else {
            setUser(null);
            navigate('/auth', { replace: true });
        }
        setLoading(false);
        }, (error) => {
        console.error("Error observing auth state:", error);
        setLoading(false);
        });
    
        return () => unsubscribe();
    }, [navigate]);
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    return (
        <div>
            <h1>Home</h1>
            <p>Welcome, {currentUser.email}</p>
            <button onClick={() => signOut(auth)}>Sign out</button>
            <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {/* Example Marker */}
                <Marker position={position} icon={customIcon}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}

export default Home;