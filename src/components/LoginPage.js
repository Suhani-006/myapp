import React, { useState } from 'react';
import './LoginPage.css';
import { useDarkMode } from './DarkModeContext';

const logoSVG = (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <defs>
      <linearGradient id="login-logo-gradient" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#a259ff"/>
        <stop offset="1" stopColor="#f24e1e"/>
      </linearGradient>
    </defs>
    <rect width="44" height="44" rx="14" fill="url(#login-logo-gradient)" />
    <circle cx="22" cy="22" r="10" fill="#fff"/>
    <polygon points="20,17 28,22 20,27" fill="#a259ff"/>
    <circle cx="22" cy="22" r="2.2" fill="#fff" opacity="0.7"/>
  </svg>
);

export default function LoginPage() {
  const { dark } = useDarkMode();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        setError('');
        // Simulate login success
        alert('Logged in!');
      }
    }, 1200);
  };

  return (
    <div className={`LoginPage-bg${dark ? ' dark' : ''}`}>
      <div className="LoginPage-blur-bg" />
      <main className="LoginPage-center">
        <section className="LoginPage-card" tabIndex={0}>
          <div className="LoginPage-logo">{logoSVG}</div>
          <h2 className="LoginPage-title">Welcome back!</h2>
          <div className="LoginPage-subtitle">Sign in to continue your personalized feed.</div>
          <form className="LoginPage-form" onSubmit={handleSubmit} autoComplete="on">
            <label className="LoginPage-label">
              Email or Username
              <input
                className="LoginPage-input"
                type="text"
                name="email"
                autoComplete="username"
                placeholder="Enter your email or username"
                value={form.email}
                onChange={handleChange}
                required
                aria-label="Email or Username"
              />
            </label>
            <label className="LoginPage-label">
              Password
              <div className="LoginPage-password-row">
                <input
                  className="LoginPage-input"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  aria-label="Password"
                />
                <button
                  type="button"
                  className="LoginPage-showhide"
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={0}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>
            <div className="LoginPage-row-between">
              <label className="LoginPage-remember">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                />
                Remember me
              </label>
              <a href="#" className="LoginPage-link LoginPage-forgot">Forgot password?</a>
            </div>
            {error && <div className="LoginPage-error" role="alert">{error}</div>}
            <button className="LoginPage-btn" type="submit" disabled={loading}>
              {loading ? <span className="LoginPage-spinner" /> : 'Log In'}
            </button>
          </form>
          <div className="LoginPage-divider"><span>or continue with</span></div>
          <div className="LoginPage-socials">
            <button className="LoginPage-social LoginPage-google" aria-label="Sign in with Google">G</button>
            <button className="LoginPage-social LoginPage-github" aria-label="Sign in with GitHub">&#xF09B;</button>
          </div>
          <div className="LoginPage-bottom-links">
            <span>Don’t have an account?</span> <a href="#" className="LoginPage-link">Sign Up</a>
          </div>
          <footer className="LoginPage-footer">
            By logging in, you agree to our <a href="#" className="LoginPage-link">Terms</a> &amp; <a href="#" className="LoginPage-link">Privacy Policy</a>
          </footer>
        </section>
      </main>
    </div>
  );
}
