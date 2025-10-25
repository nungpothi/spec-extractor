import React from 'react';
import { useNavigate } from 'react-router-dom';
import { kioskService } from '../services/kioskService';
import { useKioskStore } from '../stores/kioskStore';

const AppointmentPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    loading,
    error,
    availableSlots,
    selectedDate,
    selectedTime,
    selectedProduct,
    customer,
    setLoading,
    setError,
    setAvailableSlots,
    setSelectedDate,
    setSelectedTime,
    setRegistrationData,
  } = useKioskStore();

  React.useEffect(() => {
    if (!selectedProduct || !selectedProduct.require_booking) {
      navigate('/register');
      return;
    }

    const loadAvailableSlots = async () => {
      if (availableSlots.length > 0) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await kioskService.getAvailableSlots();

        if (response.status) {
          setAvailableSlots(response.results);
        } else {
          setError(response.message || 'Unable to load available slots.');
        }
      } catch (err) {
        setError('Failed to load available slots. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadAvailableSlots();
  }, [availableSlots.length, navigate, selectedProduct, setAvailableSlots, setError, setLoading]);

  const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedDate(value);
    setSelectedTime('');
  };

  const handleTimeSelection = (time: string) => {
    setSelectedTime(time);
  };

  const handleBack = () => {
    navigate('/register');
  };

  const handleSubmit = async () => {
    if (!selectedProduct) {
      setError('Please select a service before choosing your schedule.');
      navigate('/register');
      return;
    }

    if (!selectedDate || !selectedTime) {
      setError('Select both a date and time to continue.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await kioskService.register({
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        product_id: selectedProduct.id,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
      });

      if (response.status) {
        setRegistrationData(response.results);
        navigate('/confirmation');
      } else {
        setError(response.message || 'Unable to complete booking.');
      }
    } catch (err) {
      setError('Failed to confirm your schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getAvailableTimesForDate = (date: string) => {
    const slot = availableSlots.find((item) => item.date === date);
    return slot ? slot.time : [];
  };

  return (
    <div className="kiosk-container">
      <div className="kiosk-header">
        <h1 className="kiosk-title">Reserve Your Session</h1>
        <p className="kiosk-subtitle">Select a day and time that suits you best.</p>
      </div>

      <div className="kiosk-content">
        {selectedProduct && (
          <div className="inline-card" style={{ marginBottom: '20px', textAlign: 'left' }}>
            <div className="service-name" style={{ marginBottom: '6px' }}>{selectedProduct.name}</div>
            <div style={{ color: '#7b7b7b', fontSize: '0.9rem' }}>Booked under {customer.name || 'guest'} • {customer.phone || 'contact TBD'}</div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {loading && availableSlots.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <span className="loading-spinner" style={{ width: '32px', height: '32px' }}></span>
            <p style={{ marginTop: '16px', color: '#7b7b7b' }}>Loading available times...</p>
          </div>
        ) : (
          <>
            <div className="form-group">
              <label htmlFor="appointmentDate" className="form-label">
                Select Date
              </label>
              <select
                id="appointmentDate"
                className="form-select"
                value={selectedDate}
                onChange={handleDateChange}
                disabled={loading}
              >
                <option value="">Choose a date</option>
                {availableSlots.map((slot) => (
                  <option key={slot.date} value={slot.date}>
                    {new Date(slot.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </option>
                ))}
              </select>
            </div>

            {selectedDate && (
              <div className="form-group">
                <label className="form-label">Select Time</label>
                <div className="time-slots">
                  {getAvailableTimesForDate(selectedDate).map((time) => (
                    <button
                      key={time}
                      type="button"
                      className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                      onClick={() => handleTimeSelection(time)}
                      disabled={loading}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="button-group">
              <button
                className="btn btn-primary btn-full"
                onClick={handleSubmit}
                disabled={loading || !selectedDate || !selectedTime}
              >
                {loading && <span className="loading-spinner"></span>}
                Confirm booking
              </button>
              <button className="btn btn-secondary" onClick={handleBack} disabled={loading}>
                Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AppointmentPage;
