// make a landing page
import React from 'react';
import { useAuth } from '../components/AuthContext';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Home() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user && user.emailVerified) {
            setUser(user);
            navigate('/', { replace: true });
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
    }, []);
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    return (
        <div>
        <h1>Home</h1>
        <p>Welcome, to the himpagee peole {currentUser.email}</p>
        <button onClick={() => signOut(auth)}>Sign out</button>
        </div>
    );
    }

export default Home;