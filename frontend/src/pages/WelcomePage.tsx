import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKioskStore } from '../stores/kioskStore';
import { kioskService } from '../services/kioskService';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const { loading, error, setLoading, setError, setCheckInData, reset } = useKioskStore();

  React.useEffect(() => {
    // Reset store when returning to welcome page
    reset();
  }, [reset]);

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!identifier.trim()) {
      setError('Please enter your National ID or Phone Number');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await kioskService.checkIn({ national_id: identifier });
      
      if (response.status) {
        setCheckInData(response.results);
        navigate('/confirmation');
      } else {
        setError('Appointment not found. Please check your information.');
      }
    } catch (err) {
      setError('Failed to check in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="kiosk-container">
      <div className="kiosk-header">
        <h1 className="kiosk-title">Self-Service Kiosk</h1>
        <p className="kiosk-subtitle">Check-in or register your appointment easily.</p>
      </div>

      <div className="kiosk-content">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleCheckIn}>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter National ID or Phone Number"
              disabled={loading}
            />
          </div>

          <button 
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading && <span className="loading-spinner"></span>}
            Check-in
          </button>
        </form>

        <p className="secondary-text">
          Need to register?{' '}
          <button 
            type="button"
            onClick={handleRegister}
            className="link-text"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            disabled={loading}
          >
            Tap here
          </button>
        </p>

        <div style={{ fontSize: '0.85rem', color: '#999', marginTop: '24px' }}>
          <p>For demo purposes, try National ID: 1234567890123</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;