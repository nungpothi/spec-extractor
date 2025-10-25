import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKioskStore } from '../stores/kioskStore';
import { kioskService } from '../services/kioskService';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [showRegistrationPrompt, setShowRegistrationPrompt] = useState(false);
  const {
    loading,
    error,
    setLoading,
    setError,
    setCheckInData,
    setRegistrationData,
    setCustomer,
    reset,
  } = useKioskStore();

  React.useEffect(() => {
    reset();
    setIdentifier('');
    setShowRegistrationPrompt(false);
  }, [reset]);

  const handleCheckIn = async (event: React.FormEvent) => {
    event.preventDefault();

    const value = identifier.trim();
    if (!value) {
      setError('Please enter your registered phone number or ID');
      return;
    }

    setLoading(true);
    setError(null);
    setRegistrationData(null);

    try {
      const response = await kioskService.checkIn({ identifier: value });

      if (response.status && response.results) {
        setCustomer({
          identifier: value,
          name: response.results.name,
          phone: value,
        });
        setCheckInData(response.results);
        navigate('/confirmation');
        return;
      }

      setCheckInData(null);
      setShowRegistrationPrompt(true);
      setError('We could not find a booking with that information.');
    } catch (err) {
      setError('Failed to check-in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartRegistration = () => {
    setError(null);
    setCustomer({ identifier: identifier.trim() });
    navigate('/register');
  };

  return (
    <div className="kiosk-container">
      <div className="kiosk-header">
        <h1 className="kiosk-title">Beauty & Wellness Check-in</h1>
        <p className="kiosk-subtitle">Please enter your registered phone number or ID</p>
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
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder="Enter phone or ID"
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

        {showRegistrationPrompt && (
          <div className="inline-card" style={{ marginTop: '20px' }}>
            <p style={{ marginBottom: '12px', color: '#555', fontWeight: 500 }}>
              No worries—let&apos;s set up your beauty visit together.
            </p>
            <button
              type="button"
              className="btn btn-secondary btn-full"
              onClick={handleStartRegistration}
              disabled={loading}
            >
              Start a new selection
            </button>
          </div>
        )}

        {!showRegistrationPrompt && (
          <p className="secondary-text">
            If you haven&apos;t registered, the system will guide you through product and schedule selection.
          </p>
        )}

        <div style={{ fontSize: '0.85rem', color: '#999', marginTop: '24px' }}>
          <p>Demo data: use 0812345678 to preview an existing booking.</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
