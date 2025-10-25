import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKioskStore } from '../stores/kioskStore';
import { kioskService } from '../services/kioskService';

const PrintPage: React.FC = () => {
  const navigate = useNavigate();
  const [printStatus, setPrintStatus] = useState<'printing' | 'success' | 'error'>('printing');
  const [printMessage, setPrintMessage] = useState('');

  const { checkInData, registrationData, loading, setLoading } = useKioskStore();

  useEffect(() => {
    if (!checkInData && !registrationData) {
      navigate('/');
      return;
    }

    const queueNo = checkInData?.queue_no || registrationData?.queue_no;
    if (queueNo) {
      printQueueTicket(queueNo);
    }
  }, [checkInData, registrationData, navigate]);

  const printQueueTicket = async (queueNo: string) => {
    setLoading(true);
    setPrintStatus('printing');

    try {
      const response = await kioskService.printQueue({ queue_no: queueNo });

      if (response.status && response.results.printer_status === 'ok') {
        setPrintStatus('success');
        setPrintMessage('Queue ticket printed successfully!');
      } else {
        setPrintStatus('error');
        setPrintMessage('Failed to print queue ticket. Please contact staff.');
      }
    } catch (err) {
      setPrintStatus('error');
      setPrintMessage('Printer error. Please contact staff for assistance.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetryPrint = () => {
    const queueNo = checkInData?.queue_no || registrationData?.queue_no;
    if (queueNo) {
      printQueueTicket(queueNo);
    }
  };

  const handleFinish = () => {
    navigate('/');
  };

  const data = checkInData || registrationData;
  const queueNo = data?.queue_no;
  const isWalkIn = data?.appointment_time === 'Walk-in';

  return (
    <div className="kiosk-container">
      <div className="kiosk-header">
        <h1 className="kiosk-title">Print Queue Ticket</h1>
        <p className="kiosk-subtitle">
          {printStatus === 'printing' && 'Printing your queue ticket...'}
          {printStatus === 'success' && 'Queue ticket printed successfully!'}
          {printStatus === 'error' && 'Printing failed'}
        </p>
      </div>

      <div className="kiosk-content">
        {printStatus === 'printing' && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <span className="loading-spinner" style={{ width: '40px', height: '40px' }}></span>
            <p style={{ marginTop: '20px', fontSize: '1.1rem' }}>🖨️ Printing queue ticket...</p>
            <p style={{ color: '#666' }}>Please wait while we prepare your ticket</p>
          </div>
        )}

        {printStatus === 'success' && data && (
          <>
            <div className="success-message">{printMessage}</div>

            <div className="info-card">
              <h3>🎫 Your Queue Ticket</h3>
              <div
                style={{
                  textAlign: 'center',
                  padding: '24px',
                  backgroundColor: 'white',
                  border: '2px dashed #c8e6c9',
                  borderRadius: '16px',
                  margin: '20px 0',
                  background: 'linear-gradient(135deg, #fdfbfb 0%, #f9fafb 100%)',
                }}
              >
                <div
                  style={{ fontSize: '2.5rem', fontWeight: 700, color: '#7bb8a8', marginBottom: '8px' }}
                >
                  {queueNo}
                </div>
                <div
                  style={{ marginBottom: '16px', color: '#7b7b7b', fontSize: '0.9rem', fontWeight: 500 }}
                >
                  Queue Number
                </div>
                <div style={{ fontSize: '0.95rem', color: '#3c3c3c', marginBottom: '6px', fontWeight: 600 }}>
                  {data.product_name}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#3c3c3c', marginBottom: '4px' }}>
                  {new Date(data.appointment_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#3c3c3c', fontWeight: 500 }}>
                  {isWalkIn ? 'Immediate service' : data.appointment_time}
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'linear-gradient(90deg, #e8f5e8 0%, #d4f1d4 100%)',
                padding: '16px',
                borderRadius: '14px',
                marginBottom: '20px',
                textAlign: 'center',
                border: '1px solid #c8e6c9',
              }}
            >
              <p style={{ margin: 0, color: '#2d5e2d', fontWeight: 500, fontSize: '0.95rem' }}>
                ✅ Please take your printed ticket and wait for your number to be called.
              </p>
            </div>
          </>
        )}

        {printStatus === 'error' && (
          <>
            <div className="error-message">{printMessage}</div>

            <div className="info-card">
              <h3>⚠️ Printing Issue</h3>
              <p>
                Your queue number is: <strong>{queueNo}</strong>
              </p>
              <p>Please note this number and contact staff for assistance, or try printing again.</p>
            </div>
          </>
        )}

        <div className="button-group">
          {printStatus === 'error' && (
            <button className="btn btn-primary" onClick={handleRetryPrint} disabled={loading}>
              {loading && <span className="loading-spinner"></span>}
              Try Again
            </button>
          )}
          <button
            className="btn btn-success btn-full"
            onClick={handleFinish}
            disabled={loading && printStatus === 'printing'}
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintPage;
