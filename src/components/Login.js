import React, { useState } from 'react';
import './Login.css';
import { useDarkMode } from './DarkModeContext';
import { auth, googleProvider, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';

const Login = ({ onLoginSuccess }) => {
  const { dark } = useDarkMode();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false); // ✅ Toggle between Login & Signup
  const [form, setForm] = useState({ email: '', password: '', remember: false });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  // ✅ Handle Login or Signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        // SIGN-UP: Register new user
        const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
        console.log('User Registered:', userCredential.user);

        // Save to Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: userCredential.user.email,
          uid: userCredential.user.uid,
        });
      } else {
        // LOGIN: Sign in existing user
        const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
        console.log('Login Successful:', userCredential.user);
      }

      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google Sign-in
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      console.log('Google Sign-in Successful:', user);

      // Save Google user in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        uid: user.uid,
      });

      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      console.error('Google Sign-in Error:', error);
      setError(error.message);
    }
  };

  return (
    <div className={`Login-bg${dark ? ' dark' : ''}`}>
      <div className="Login-container">
        <h2 className="Login-headline">{isSignup ? 'Create an Account ✨' : 'Welcome back 👋'}</h2>
        <div className="Login-subline">
          {isSignup ? 'Sign up to get started' : 'Log in to continue exploring your personalized feed'}
        </div>

        {/* Email/Password Form */}
        <form className="Login-form" onSubmit={handleSubmit} autoComplete="on">
          <label className="Login-label">
            Email
            <input
              className="Login-input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="Login-label">
            Password
            <div className="Login-password-row">
              <input
                className="Login-input"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="Login-showhide"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          {!isSignup && (
            <div className="Login-row-between">
              <label className="Login-remember">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                />
                Remember me
              </label>
              <button type="button" className="Login-link Login-forgot">
                Forgot password?
              </button>
            </div>
          )}

          {error && <div className="Login-error">{error}</div>}

          <button className="Login-btn" type="submit" disabled={loading}>
            {loading ? <span className="Login-spinner" /> : isSignup ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="Login-divider"><span>or sign in with</span></div>
        <div className="Login-socials">
          <button className="Login-social Login-google" aria-label="Sign in with Google" onClick={handleGoogleSignIn}>
            G
          </button>
        </div>

        {/* Toggle between Sign In and Sign Up */}
        <p className="Login-toggle">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <button type="button" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
