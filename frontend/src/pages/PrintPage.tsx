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
    // If no data, redirect to home
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
            <p style={{ marginTop: '20px', fontSize: '1.1rem' }}>
              🖨️ Printing queue ticket...
            </p>
            <p style={{ color: '#666' }}>
              Please wait while we prepare your ticket
            </p>
          </div>
        )}

        {printStatus === 'success' && (
          <>
            <div className="success-message">
              {printMessage}
            </div>
            
            <div className="info-card">
              <h3>🎫 Your Queue Ticket</h3>
              <div style={{ 
                textAlign: 'center', 
                padding: '20px',
                backgroundColor: 'white',
                border: '2px dashed #ddd',
                borderRadius: '8px',
                margin: '20px 0'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff' }}>
                  {queueNo}
                </div>
                <div style={{ marginTop: '10px', color: '#666' }}>
                  Queue Number
                </div>
                <div style={{ marginTop: '15px', fontSize: '0.9rem', color: '#333' }}>
                  Date: {data && new Date(data.appointment_date).toLocaleDateString()}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#333' }}>
                  Time: {data?.appointment_time}
                </div>
              </div>
            </div>

            <div style={{ 
              background: '#e8f5e8', 
              padding: '15px', 
              borderRadius: '8px', 
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <p style={{ margin: 0, color: '#2d5e2d', fontWeight: '600' }}>
                ✅ Please take your printed ticket and wait for your number to be called.
              </p>
            </div>
          </>
        )}

        {printStatus === 'error' && (
          <>
            <div className="error-message">
              {printMessage}
            </div>
            
            <div className="info-card">
              <h3>⚠️ Printing Issue</h3>
              <p>Your queue number is: <strong>{queueNo}</strong></p>
              <p>Please note this number and contact staff for assistance, or try printing again.</p>
            </div>
          </>
        )}

        <div className="button-group">
          {printStatus === 'error' && (
            <button 
              className="btn btn-primary"
              onClick={handleRetryPrint}
              disabled={loading}
            >
              {loading && <span className="loading-spinner"></span>}
              Try Again
            </button>
          )}
          <button 
            className="btn btn-success"
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