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

  React.useEffect(() => {
    if (!checkInData && !registrationData) {
      navigate('/');
    }
  }, [checkInData, registrationData, navigate]);

  const isCheckIn = Boolean(checkInData);
  const data = checkInData || registrationData;

  if (!data) {
    return null;
  }

  const isWalkIn = data.appointment_time === 'Walk-in';

  return (
    <div className="kiosk-container">
      <div className="kiosk-header">
        <h1 className="kiosk-title">{isCheckIn ? 'You&apos;re all set!' : 'Booking confirmed'}</h1>
        <p className="kiosk-subtitle">
          {isCheckIn
            ? 'Welcome back to your beauty session.'
            : 'We have reserved your treatment slot.'}
        </p>
      </div>

      <div className="kiosk-content">
        <div className="success-message">
          {isCheckIn
            ? 'We found your pre-booked treatment. Please print your ticket below.'
            : 'Thank you! Your beauty visit is confirmed. Grab your queue ticket to begin.'}
        </div>

        <div className="info-card" style={{ textAlign: 'left' }}>
          <h3>Your Visit</h3>
          <div className="info-row">
            <span className="info-label">Treatment</span>
            <span className="info-value">{data.product_name}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Queue Number</span>
            <span
              className="info-value"
              style={{ fontSize: '1.2rem', fontWeight: 700, color: '#5e7d7d' }}
            >
              {data.queue_no}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Date</span>
            <span className="info-value">
              {new Date(data.appointment_date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Time</span>
            <span className="info-value">{isWalkIn ? 'Immediate service' : data.appointment_time}</span>
          </div>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, #f0fffe 0%, #e8f9f8 100%)',
            padding: '16px',
            borderRadius: '14px',
            marginBottom: '20px',
            border: '1px solid #c8e6c9',
          }}
        >
          <p style={{ margin: 0, color: '#2d5e2d', fontWeight: 500, fontSize: '0.95rem' }}>
            📋 Please print your queue ticket and take a seat in the lounge.
          </p>
        </div>

        <div className="button-group">
          <button className="btn btn-success btn-full" onClick={handlePrintQueue}>
            Print queue ticket
          </button>
          <button className="btn btn-secondary" onClick={handleHome}>
            Finish
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
