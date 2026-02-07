import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      {/* Illustration / Icon */}
      <div style={{ fontSize: '80px', marginBottom: '16px' }}>🚀</div>

      <h1 style={{ fontSize: '36px', marginBottom: '8px', color: '#111827' }}>
        404
      </h1>

      <h2 style={{ fontSize: '22px', marginBottom: '12px', color: '#1f2937' }}>
        Page Not Found
      </h2>

      <p style={{ maxWidth: '420px', marginBottom: '24px', color: '#6b7280' }}>
        Oops! The page you’re looking for doesn’t exist or may have been moved.
      </p>

      <button
        onClick={() => navigate('/')}
        style={{
          backgroundColor: '#06b6d4',
          color: '#fff',
          border: 'none',
          padding: '12px 28px',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFound;
