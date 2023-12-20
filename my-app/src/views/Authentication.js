import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import { useAuth } from '../components/AuthContext';
import { signUp, signIn, resetPassword} from '../services/auth';
import Button from '../components/Button';


const Authentication = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [capsLockOn, setCapsLockOn] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    // ---- Checking for capslock functions ---- //
    // const handleKeyDown = (e) => {
    //     if (e.getModifierState && e.getModifierState("CapsLock")) {
    //         setCapsLockOn(true);
    //     }
    // };

    // const handleKeyUp = (e) => {
    //     if (e.getModifierState && !e.getModifierState("CapsLock")) {
    //         setCapsLockOn(false);
    //     }
    // };

    useEffect(() => {
        const handleGlobalKeyDown = (e) => {
            if (e.getModifierState && e.getModifierState("CapsLock")) {
                setCapsLockOn(true);
            }
        };

        const handleGlobalKeyUp = (e) => {
            if (e.getModifierState && !e.getModifierState("CapsLock")) {
                setCapsLockOn(false);
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        window.addEventListener('keyup', handleGlobalKeyUp);

        return () => {
            // Cleanup when the component is unmounted
            window.removeEventListener('keydown', handleGlobalKeyDown);
            window.removeEventListener('keyup', handleGlobalKeyUp);
        };
    }, []);

    // ---- Reset password function ---- //
    const handleForgotPassword = async () => {
        if (!email) {
            setFeedbackMessage('Please enter your email address.');
            return;
        }
        try {
            const responseMessage = await resetPassword(email);
            setFeedbackMessage(responseMessage);  // Set the message state
        } catch (error) {
            setFeedbackMessage('Error resetting password.');
        }
    };

    // ---- Sign in and sign up functions ---- //
    const handleSignIn = async () => {
        try {
            const responseMessage = await signIn(email, password);
            setFeedbackMessage(responseMessage);
            // if (responseMessage === 'Logged in successfully!') navigate('/home');
        } catch (error) {
            setFeedbackMessage("1 " + error.message);
            // setFeedbackMessage('Error signing in.');
        }
    };

    const handleSignUp = async () => {
        try {
            const responseMessage = await signUp(email, password);
            setFeedbackMessage(responseMessage);  // Set the message state
        } catch (error) {
            setFeedbackMessage("2 " + error.message);
            // setFeedbackMessage('Error signing up.');
        }
    };
    
    // ---- Optional handle form submit function ---- //
    const handleSubmit = async (e) => {
        e.preventDefault(); // This prevents the default form submit action which refreshes the page
        if (isSignUp) {
            await handleSignUp();
        } else {
            await handleSignIn();
        }
    };

    // ---- Navigate to home page if user is already logged in ---- //
    useEffect(() => {
        // If already logged in and user tries to access the sign-in page, redirect to home page
        if (currentUser && currentUser.emailVerified) {
            navigate("/", { replace: true });
            setLoading(false);
        } else {
            setLoading(false);  // if there is no user, set loading to false
        }
    }, [currentUser, navigate]);

    if (loading) {
        return <div>Loading...</div>;  // You can replace this with a loading spinner or similar if you have one
    }

    return (
        <div className="auth-container">
            <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
            <form>
                {feedbackMessage && <p className="message-box">{feedbackMessage}</p>}
                <input
                    type="email"
                    className="input-email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div className="password-container">
                    <input
                        type={showPassword ? "text" : "password"}
                        className="input-password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={{ paddingRight: capsLockOn ? "30px" : "initial" }}
                    />
                    {capsLockOn && <span className="caps-indicator">🔒</span>}
                </div>
                <div className="password-actions">
                    <span onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? "Hide Password" : "Show Password"}
                    </span>
                    
                    <span onClick={handleForgotPassword} className="reset-resend-text">Forgot Password</span>
                </div>
                <div className="main-btns">
                    <Button onClick={handleSignIn} label="Sign In" className="primary-btn" />
                    <Button onClick={handleSignUp} label="Sign Up" className="secondary-btn" />
                </div>
                {/* <div className="password-actions">
                    <span onClick={handleForgotPassword} className="reset-resend-text">Forgot Password</span>
                    <span onClick={handleResendEmail} className="reset-resend-text">Resend Verification Email</span>
                </div> */}
                {/* <div className="separator">OR</div>
                <div className="social-btns">
                    <Button onClick={() => handleSocialLogin('google')} label="Google" className="secondary-btn" />
                    <Button onClick={() => handleSocialLogin('facebook')} label="Facebook" className="secondary-btn" />
                    <Button onClick={() => handleSocialLogin('linkedin')} label="LinkedIn" className="secondary-btn" />
                </div> */}
                {error && <p className="error-message">{error}</p>}
            </form>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            /> 
        </div>
    );
}

export default Authentication;