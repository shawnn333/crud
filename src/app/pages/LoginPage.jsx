import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginAsync, registerAsync, clearError, clearRegistrationSuccess } from '../redux/auth/auth.slice';

export const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user, registrationSuccess } = useSelector((state) => state.auth);

  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (registrationSuccess) {
      setMode('login');
      setEmail('');
      setPassword('');
      setTimeout(() => {
        dispatch(clearRegistrationSuccess());
      }, 3000);
    }
  }, [registrationSuccess, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (mode === 'login') {
      try {
        await dispatch(loginAsync({ email, password })).unwrap();
        navigate('/');
      } catch (error) {
        console.error('Login failed:', error);
      }
    } else {
      try {
        await dispatch(registerAsync({ email, password })).unwrap();
        dispatch(clearError());
      } catch (error) {
        console.error('Registration failed:', error);
      }
    }
  };

  const switchMode = () => {
    dispatch(clearError());
    dispatch(clearRegistrationSuccess());
    setMode((m) => (m === 'login' ? 'register' : 'login'));
    setEmail('');
    setPassword('');
    setShowPassword(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: 400 }}>
        <div className="text-center mb-4">
          <div className="sidebar-brand justify-content-center" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <i className="fas fa-check-circle brand-icon" style={{ fontSize: '2rem', color: '#4f8cf7' }}></i>
            <span className="brand-text" style={{ fontSize: '1.5rem', fontWeight: 700 }}>TaskFlow</span>
            <span className="brand-badge" style={{ fontSize: '0.6rem', background: '#4f8cf7', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '20px' }}>PRO</span>
          </div>
          <p className="text-muted mt-2" style={{ fontSize: '0.9rem' }}>
            {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        {registrationSuccess && (
          <div className="alert alert-success py-2" role="alert">
            <i className="fas fa-check-circle me-2"></i>
            Registration successful! Please sign in below.
          </div>
        )}

        {error && (
          <div className="alert alert-danger py-2" role="alert">
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email-input" className="form-label fw-semibold" style={{ fontSize: '0.85rem', color: '#1e293b' }}>
              <i className="fas fa-envelope me-2" style={{ color: '#4f8cf7' }}></i>
              Email Address
            </label>
            <input
              id="email-input"
              name="email"
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{ 
                borderRadius: '8px', 
                padding: '0.6rem 1rem',
                border: '2px solid #e2e8f0',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#4f8cf7'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password-input" className="form-label fw-semibold" style={{ fontSize: '0.85rem', color: '#1e293b' }}>
              <i className="fas fa-lock me-2" style={{ color: '#4f8cf7' }}></i>
              Password
            </label>
            <div className="position-relative">
              <input
                id="password-input"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder={mode === 'login' ? 'Enter your password' : 'Create a password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={mode === 'register' ? 6 : undefined}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                style={{ 
                  borderRadius: '8px', 
                  padding: '0.6rem 1rem',
                  border: '2px solid #e2e8f0',
                  transition: 'border-color 0.2s',
                  paddingRight: '3rem'
                }}
                onFocus={(e) => e.target.style.borderColor = '#4f8cf7'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
              <button
                type="button"
                className="btn btn-link position-absolute"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  textDecoration: 'none',
                  padding: '0',
                  border: 'none',
                  background: 'transparent'
                }}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            {mode === 'register' && (
              <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                <i className="fas fa-info-circle me-1"></i>
                Password must be at least 6 characters
              </small>
            )}
          </div>

          {mode === 'login' && (
            <div className="mb-3 text-end">
              <button
                type="button"
                className="btn btn-link btn-sm p-0"
                style={{ fontSize: '0.85rem', color: '#4f8cf7', textDecoration: 'none' }}
                onClick={() => alert('Password reset feature coming soon!')}
              >
                Forgot password?
              </button>
            </div>
          )}

          <button 
            type="submit" 
            className="btn w-100" 
            disabled={loading}
            style={{
              background: '#4f8cf7',
              color: 'white',
              padding: '0.7rem',
              borderRadius: '8px',
              fontWeight: 600,
              border: 'none',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#3b7de8'}
            onMouseLeave={(e) => e.target.style.background = '#4f8cf7'}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Please wait...
              </>
            ) : (
              <>
                <i className={`fas ${mode === 'login' ? 'fa-sign-in-alt' : 'fa-user-plus'} me-2`}></i>
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-3">
          <button 
            className="btn btn-link" 
            onClick={switchMode}
            disabled={loading}
            style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem' }}
          >
            {mode === 'login' ? (
              <>
                Don't have an account? <span style={{ color: '#4f8cf7', fontWeight: 600 }}>Register</span>
              </>
            ) : (
              <>
                Already have an account? <span style={{ color: '#4f8cf7', fontWeight: 600 }}>Sign in</span>
              </>
            )}
          </button>
        </div>

        <div className="text-center mt-3">
          <small className="text-muted" style={{ fontSize: '0.7rem' }}>
            <i className="fas fa-shield-alt me-1"></i>
            Your data is secure and encrypted
          </small>
        </div>
      </div>
    </div>
  );
};