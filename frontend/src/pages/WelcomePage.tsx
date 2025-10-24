import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useKioskStore } from '../stores/kioskStore';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const reset = useKioskStore(state => state.reset);

  React.useEffect(() => {
    // Reset store when returning to welcome page
    reset();
  }, [reset]);

  const handleCheckIn = () => {
    navigate('/checkin');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="kiosk-container">
      <div className="kiosk-header">
        <h1 className="kiosk-title">Self-Service Kiosk</h1>
        <p className="kiosk-subtitle">Check-in or register your appointment quickly.</p>
      </div>

      <div className="kiosk-content">
        <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '30px' }}>
          Welcome! Please select an option to continue:
        </p>

        <div className="button-group">
          <button 
            className="btn btn-primary"
            onClick={handleCheckIn}
          >
            Check-In
          </button>
          <button 
            className="btn btn-secondary"
            onClick={handleRegister}
          >
            Register New Appointment
          </button>
        </div>
      </div>

      <div style={{ fontSize: '0.9rem', color: '#888' }}>
        Touch any button to get started
      </div>
    </div>
  );
};

export default WelcomePage;