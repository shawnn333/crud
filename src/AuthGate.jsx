import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { setUser } from './app/redux/auth/auth.slice';
import { fetchTasksAsync } from './app/redux/task/task.slice';
import { authRepository } from './app/boot';
import App from './App';
import { LoginPage } from './app/pages/LoginPage';

export default function AuthGate() {
  const dispatch = useDispatch();
  const { user, initializing } = useSelector((state) => state.auth);
  const hasFetched = useRef(false);

  useEffect(() => {
    const unsubscribe = authRepository.onAuthStateChanged((currentUser) => {
      dispatch(setUser(currentUser));
      if (!currentUser) {
        hasFetched.current = false;
      }
    });
    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  useEffect(() => {
    if (user && !initializing && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(fetchTasksAsync());
    }
  }, [user, initializing, dispatch]);

  if (initializing) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" /> : <LoginPage />} 
        />
        <Route 
          path="/" 
          element={user ? <App /> : <Navigate to="/login" />} 
        />
        <Route 
          path="*" 
          element={<Navigate to={user ? "/" : "/login"} />} 
        />
      </Routes>
    </HashRouter>
  );
}