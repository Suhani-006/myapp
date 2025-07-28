import React, { useState } from 'react';
import './Login.css';
import { useDarkMode } from './DarkModeContext';

const logoSVG = (
  <svg width="40" height="40" viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="11" r="11" fill="#fff" />
    <polygon points="9,7 16,11 9,15" fill="#a259ff" />
  </svg>
);

const Login = () => {
  const { dark } = useDarkMode();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '', remember: false });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (!form.email || !form.password) {
        setError('Please enter your email and password.');
      } else {
        // Simulate login success
        setError('');
        alert('Logged in!');
      }
    }, 1200);
  };

  return (
    <div className={`Login-bg${dark ? ' dark' : ''}`}> 
      <div className="Login-container" tabIndex={0}>
        <div className="Login-logo">{logoSVG}</div>
        <h2 className="Login-headline">Welcome back <span role="img" aria-label="wave">👋</span></h2>
        <div className="Login-subline">Log in to continue exploring your personalized feed</div>
        <form className="Login-form" onSubmit={handleSubmit} autoComplete="on">
          <label className="Login-label">
            Email or Username
            <input
              className="Login-input"
              type="text"
              name="email"
              autoComplete="username"
              value={form.email}
              onChange={handleChange}
              required
              aria-label="Email or Username"
            />
          </label>
          <label className="Login-label">
            Password
            <div className="Login-password-row">
              <input
                className="Login-input"
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                required
                aria-label="Password"
              />
              <button
                type="button"
                className="Login-showhide"
                onClick={() => setShowPassword(v => !v)}
                tabIndex={0}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>
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
            <a href="#" className="Login-link Login-forgot">Forgot password?</a>
          </div>
          {error && <div className="Login-error" role="alert">{error}</div>}
          <button className="Login-btn" type="submit" disabled={loading}>
            {loading ? <span className="Login-spinner" /> : 'Sign In'}
          </button>
        </form>
        <div className="Login-divider"><span>or sign in with</span></div>
        <div className="Login-socials">
          <button className="Login-social Login-google" aria-label="Sign in with Google">G</button>
          {/* Only Google button shown */}
        </div>
        <div className="Login-bottom-links">
          <span>Don’t have an account?</span> <a href="#" className="Login-link">Sign up</a>
        </div>
        <footer className="Login-footer">
          &copy; {new Date().getFullYear()} Infiscroll &middot; <a href="#" className="Login-link">Privacy</a>
        </footer>
      </div>
    </div>
  );
};

export default Login;