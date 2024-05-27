import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

function Home() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // Google Maps settings
    const mapContainerStyle = {
      height: "400px",
      width: "100%"
    };
    const center = {
      lat: -34.397,
      lng: 150.644,
    };
    const apiKey = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace this with your actual Google Maps API key

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user && user.emailVerified) {
                setUser(user);
                // No need to navigate to '/' since we're already there
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
            <LoadScript googleMapsApiKey={apiKey}>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={8}
                >
                    {/* Example Marker */}
                    <Marker
                        position={center}
                        // Optional: Customize your marker icon
                        // icon={{
                        //     url: "/path/to/custom/icon.png",
                        //     scaledSize: new window.google.maps.Size(50, 50),
                        // }}
                    />
                    {/* Add more markers or other components here */}
                </GoogleMap>
            </LoadScript>
        </div>
    );
}

export default Home;