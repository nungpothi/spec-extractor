import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useKioskStore } from '../stores/kioskStore';

const ConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const { checkInData, registrationData } = useKioskStore();

  const handlePrintQueue = () => {
    navigate('/print');
  };

  const handleHome = () => {
    navigate('/');
  };

  // If no data, redirect to home
  React.useEffect(() => {
    if (!checkInData && !registrationData) {
      navigate('/');
    }
  }, [checkInData, registrationData, navigate]);

  const isCheckIn = !!checkInData;
  const data = checkInData || registrationData;

  if (!data) {
    return null;
  }

  return (
    <div className="kiosk-container">
      <div className="kiosk-header">
        <h1 className="kiosk-title">
          {isCheckIn ? 'Check-In Successful' : 'Registration Successful'}
        </h1>
        <p className="kiosk-subtitle">
          {isCheckIn ? 'Welcome back!' : 'Your appointment has been booked'}
        </p>
      </div>

      <div className="kiosk-content">
        <div className="success-message">
          {isCheckIn ? 
            'Your appointment details have been found and confirmed.' :
            'Your new appointment has been registered successfully.'
          }
        </div>

        <div className="info-card">
          <h3>Appointment Details</h3>
          
          {isCheckIn && checkInData && (
            <div className="info-row">
              <span className="info-label">Name:</span>
              <span className="info-value">{checkInData.name}</span>
            </div>
          )}
          
          <div className="info-row">
            <span className="info-label">Queue Number:</span>
            <span className="info-value" style={{ 
              fontSize: '1.2rem', 
              fontWeight: 'bold', 
              color: '#007bff' 
            }}>
              {data.queue_no}
            </span>
          </div>
          
          <div className="info-row">
            <span className="info-label">Date:</span>
            <span className="info-value">
              {new Date(data.appointment_date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          
          <div className="info-row">
            <span className="info-label">Time:</span>
            <span className="info-value">{data.appointment_time}</span>
          </div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #f0fffe 0%, #e8f9f8 100%)', 
          padding: '16px', 
          borderRadius: '14px', 
          marginBottom: '20px',
          border: '1px solid #c8e6c9'
        }}>
          <p style={{ margin: 0, color: '#2d5e2d', fontWeight: '500', fontSize: '0.95rem' }}>
            📋 Please print your queue ticket and wait for your number to be called.
          </p>
        </div>

        <div className="button-group">
          <button 
            className="btn btn-success btn-full"
            onClick={handlePrintQueue}
          >
            Print Queue Ticket
          </button>
          <button 
            className="btn btn-secondary"
            onClick={handleHome}
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;