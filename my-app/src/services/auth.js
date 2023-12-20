import { auth, db } from './firebaseConfig';
import {
    sendEmailVerification,
    sendPasswordResetEmail,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
} from 'firebase/auth';

import { getFunctions, httpsCallable } from 'firebase/functions';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const functions = getFunctions();  // For local testing, use getFunctions(app, 'http://localhost:5001')

export const handleSendEmail = async (email, emailType) => {
    try {
        if (emailType === 'verification') {
            console.log('Sending verification email to: ', auth.currentUser.email);
            await sendEmailVerification(auth.currentUser);
            return '1 Please verify your email first. (user: ' + auth.currentUser.email + ')';
        }
        if (emailType === 'passwordReset') {
            console.log('User (for reset password):\n', auth);
            console.log('Sending password reset email to: ', email);
            await sendPasswordResetEmail(auth, email);
            return 'Please check your email. (email: ' + email + ')';
        }
    } catch (error) {
        console.log('Error:', error);
        return 'Error sending email.';
    }
}

// Reset password
export const resetPassword = async (email) => {
    try {
        await firebaseSignOut(auth);
        const currentUser = auth.currentUser;
        if (currentUser && !currentUser.emailVerified) {
            const responseMessage = await handleSendEmail(null, 'verification');
            await firebaseSignOut(auth); // Make it so that the user has to sign in again
            return responseMessage;
        }
        else {
            const responseMessage = await handleSendEmail(email, 'passwordReset');
            await firebaseSignOut(auth); // Make it so that the user has to sign in again
            return responseMessage;
        }
    } catch (error) {
        const currentUser = auth.currentUser;
        return 'Failed to send email. (' + currentUser.email + ')';
        throw new Error(error.message);
    }
};

// Sign in
export const signIn = async (email, password) => {
    try {
        await firebaseSignOut(auth);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        if (!user) {
            await firebaseSignOut(auth); // not sure if this sign out is necessary, cause error?
            return '2 Please sign up first.';
        }
        if (user && !user.emailVerified) {
            const responseMessage = await handleSendEmail(null, 'verification');
            await firebaseSignOut(auth); // Make it so that the user has to sign in again
            return responseMessage;
        }
        if (user.emailVerified) {
            return 'Logged in successfully!';
        } 
    } catch (error) {
        return '3 ' + error.message;
        return 'No user found, sign up first.';
        throw new Error(error.message);
    }
};

// Sign up
export const signUp = async (email, password) => {
    try {
        await firebaseSignOut(auth);
        const currentUser = auth.currentUser;
        console.log('User (sign up):\n', currentUser);
        if (currentUser && currentUser.emailVerified) {
            await firebaseSignOut(auth); // Make it so that the user has to sign in again
            return 'Already signed up successfully!';
        }
        if (!currentUser) {
            await createUserWithEmailAndPassword(auth, email, password);
            const responseMessage = await handleSendEmail(null, 'verification');
            await firebaseSignOut(auth); // Make it so that the user has to sign in again
            return responseMessage;
        }
        if (currentUser && !currentUser.emailVerified) {
            const responseMessage = await handleSendEmail(null, 'verification');
            await firebaseSignOut(auth); // Make it so that the user has to sign in again
            return responseMessage;
        }
    } catch (error) {
        return error.message;
        return 'Error signing up.';
    }
};

// Sign out
export const signOut = async () => {
    try {
        await firebaseSignOut(auth);
        return 'Successfully signed out.';
    } catch (error) {
        throw new Error(error.message);
    }
};

// Other methods, such as Google or Facebook login, can be added here