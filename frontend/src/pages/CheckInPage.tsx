import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKioskStore } from '../stores/kioskStore';
import { kioskService } from '../services/kioskService';

const CheckInPage: React.FC = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const { 
    loading, 
    error, 
    setLoading, 
    setError, 
    setCheckInData 
  } = useKioskStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!identifier.trim()) {
      setError('Please enter your phone number or ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await kioskService.checkIn({ identifier: identifier.trim() });
      
      if (response.status) {
        setCheckInData(response.results);
        navigate('/confirmation');
      } else {
        setError(response.message || 'No appointment found.');
      }
    } catch (err) {
      setError('Failed to check in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="kiosk-container">
      <div className="kiosk-header">
        <h1 className="kiosk-title">Check-In</h1>
        <p className="kiosk-subtitle">Enter your National ID to check in</p>
      </div>

      <div className="kiosk-content">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="identifier" className="form-label">
              Phone number or ID
            </label>
            <input
              type="text"
              id="identifier"
              className="form-input"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter your registered detail"
              disabled={loading}
            />
          </div>

          <div className="button-group">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading && <span className="loading-spinner"></span>}
              Check In
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleBack}
              disabled={loading}
            >
              Back
            </button>
          </div>
        </form>

        <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
            <p>Demo credential: 0812345678</p>
        </div>
      </div>
    </div>
  );
};

export default CheckInPage;
