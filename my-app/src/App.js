import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebaseConfig';
import { AuthContext, useAuth } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './views/Home';
import ActivityDetails from './views/ActivityDetails';
import Ladder from './views/Ladder';
import Profile from './views/Profile';
import Trends from './views/Trends';
import FriendsFeed from './views/FriendsFeed';
import Authentication from './views/Authentication';
import ProfileSetup from './views/ProfileSetup';

function AuthWrapper({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // useEffect(() => {
  //   if (!isLoggedIn(user)) {
  //     navigate('/auth');
  //     setLoading(false);
  //   }
  // }, [user, navigate]);

  // +  The useEffect hook with an empty dependency array [] runs 
  // once when the component mounts, similar to componentDidMount 
  // in class components. It does not run on subsequent renders 
  // unless the component is unmounted and then remounted.
  // +  Inside this useEffect, the onAuthStateChanged function is 
  // called which sets up a listener for authentication state changes. 
  // This listener is active as long as the component remains mounted.
  // +  When the onAuthStateChanged callback is triggered (e.g., a 
  // user logs in or logs out), it calls setUser, which updates the 
  // user state variable and triggers a re-render of the AuthProvider 
  // component.
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

//   if (!user) {
//     return <Authentication onLogin={setUser} />;
//   }

  // -  The AuthContext.Provider component is a part of the Context 
  // API in React. It allows you to pass down a value (user in this case) 
  // to all descendants in the component tree without having to pass it 
  // down explicitly via props.
  // -  The value prop of AuthContext.Provider is where the current 
  // value of the context is set. When the value prop changes (due to 
  // a re-render triggered by setUser), the new value is passed down 
  // to all components that consume this context via the useAuth hook or 
  // the AuthContext.Consumer component.
  // -  So yes, <AuthContext.Provider value={user}> {children} 
  // </AuthContext.Provider> indeed updates the AuthContext values for 
  // all consuming components whenever user changes and the AuthProvider 
  // component re-renders.
  // -  resetUser is defined inline as an arrow function
  return (
    <AuthContext.Provider value={{ currentUser: user, resetUser: () => setUser(null) }}>
      {children}
    </AuthContext.Provider>
  );
}

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <AuthWrapper>
          <Routes>
            <Route path="/" element={<ProtectedRoute />}> {/* Use "/" for the home path */}
              <Route index element={<Home />} /> {/* Use index prop for the default route */}
              <Route path="/activity-details" element={<ActivityDetails />} />
              <Route path="ladder" element={<Ladder />} />
              <Route path="profile" element={<Profile />} />
              <Route path="trends" element={<Trends />} />
              <Route path="friends-feed" element={<FriendsFeed />} />
            </Route>
            <Route path="auth" element={<Authentication />} />
            <Route path="profile-setup" element={<ProfileSetup />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthWrapper>
      </div>
    </Router>
  );
}

export default App;