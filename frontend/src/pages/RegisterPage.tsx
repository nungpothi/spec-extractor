import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKioskStore } from '../stores/kioskStore';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    nationalId: '',
    phone: ''
  });
  
  const { error, setError } = useKioskStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return;
    }
    
    if (!formData.nationalId.trim()) {
      setError('Please enter your National ID');
      return;
    }
    
    if (!formData.phone.trim()) {
      setError('Please enter your phone number');
      return;
    }

    setError(null);
    // Navigate to appointment selection
    navigate('/appointment');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="kiosk-container">
      <div className="kiosk-header">
        <h1 className="kiosk-title">Register</h1>
        <p className="kiosk-subtitle">Enter your information to register for an appointment</p>
      </div>

      <div className="kiosk-content">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="nationalId" className="form-label">
              National ID
            </label>
            <input
              type="text"
              id="nationalId"
              name="nationalId"
              className="form-input"
              value={formData.nationalId}
              onChange={handleInputChange}
              placeholder="Enter your 13-digit National ID"
              maxLength={13}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="form-input"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="button-group">
            <button type="submit" className="btn btn-primary btn-full">
              Continue
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleBack}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;