// We typically define your AuthContext here and any utility hooks 
// related to it, and any other related utilities. By moving the context 
// and related hooks to a separate file, you've created a dedicated 
// space for all authentication-related utilities, making it easier to 
// expand or modify later if needed.

// We're setting up a special object (using React's createContext method) 
// that will allow child components to access authentication-related data 
// (like currentUser) without it being passed down explicitly through props. 
// This makes it easier to manage and access globally relevant data across 
// different parts of your application.
// In essence, the context acts as a kind of global state manager for 
// components that subscribe to it. Components can either provide values 
// to this context (using a Provider) or consume values from this context.

import React from 'react';

// Create the context for authentication
export const AuthContext = React.createContext({
  currentUser: null,
  resetUser: () => {},
  profileCompleted: false,
  setProfileCompleted: () => {},
});

// A custom hook to access the authentication context easily from any component
export const useAuth = () => {
  return React.useContext(AuthContext);
};