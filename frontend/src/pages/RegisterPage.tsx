import React from 'react';
import { useNavigate } from 'react-router-dom';
import { kioskService } from '../services/kioskService';
import { useKioskStore } from '../stores/kioskStore';
import { ProductCategory } from '../types';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    loading,
    error,
    products,
    selectedProduct,
    customer,
    setError,
    setLoading,
    setProducts,
    setCustomer,
    setSelectedProduct,
    setSelectedDate,
    setSelectedTime,
    setRegistrationData,
  } = useKioskStore();

  const [catalogLoaded, setCatalogLoaded] = React.useState(false);

  const ensureSelectedProduct = React.useCallback(
    (catalog: ProductCategory[]) => {
      if (selectedProduct) {
        return;
      }

      const firstCategory = catalog[0];
      const firstItem = firstCategory?.items[0];
      if (firstItem) {
        setSelectedProduct(firstItem);
      }
    },
    [selectedProduct, setSelectedProduct],
  );

  React.useEffect(() => {
    const initialiseCatalog = async () => {
      if (products.length > 0) {
        ensureSelectedProduct(products);
        setCatalogLoaded(true);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await kioskService.getProducts();
        if (response.status) {
          setProducts(response.results);
          ensureSelectedProduct(response.results);
        } else {
          setError(response.message || 'Unable to load services at the moment.');
        }
      } catch (err) {
        setError('Failed to load beauty services. Please try again.');
      } finally {
        setCatalogLoaded(true);
        setLoading(false);
      }
    };

    initialiseCatalog();
  }, [ensureSelectedProduct, products, setError, setLoading, setProducts]);

  React.useEffect(() => {
    if (!customer.phone && customer.identifier) {
      setCustomer({ phone: customer.identifier });
    }
  }, [customer.identifier, customer.phone, setCustomer]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === 'name') {
      setCustomer({ name: value });
    }

    if (name === 'phone') {
      setCustomer({ phone: value });
    }
  };

  const handleProductSelect = (productId: string) => {
    const product = products
      .flatMap((category) => category.items)
      .find((item) => item.id === productId) || null;

    setSelectedProduct(product);
    setError(null);
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedName = customer.name.trim();
    const trimmedPhone = customer.phone.trim();

    if (!trimmedName) {
      setError('Please enter your full name.');
      return;
    }

    if (!trimmedPhone) {
      setError('Please enter a contact number.');
      return;
    }

    if (!selectedProduct) {
      setError('Select a beauty service to continue.');
      return;
    }

    setCustomer({ name: trimmedName, phone: trimmedPhone });
    setError(null);

    if (selectedProduct.require_booking) {
      setSelectedDate('');
      setSelectedTime('');
      navigate('/appointment');
      return;
    }

    setLoading(true);

    try {
      const response = await kioskService.register({
        name: trimmedName,
        phone: trimmedPhone,
        product_id: selectedProduct.id,
      });

      if (response.status) {
        setRegistrationData(response.results);
        navigate('/confirmation');
      } else {
        setError(response.message || 'Unable to register. Please try again.');
      }
    } catch (err) {
      setError('Could not complete registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kiosk-container">
      <div className="kiosk-header">
        <h1 className="kiosk-title">Create Your Beauty Visit</h1>
        <p className="kiosk-subtitle">Tell us who you are and choose the treatment you&apos;d love today.</p>
      </div>

      <div className="kiosk-content">
        {error && (
          <div className="error-message">{error}</div>
        )}

        {!catalogLoaded ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <span className="loading-spinner" style={{ width: '32px', height: '32px' }}></span>
            <p style={{ marginTop: '16px', color: '#7b7b7b' }}>Loading services...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h2 className="section-title">Guest Details</h2>
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  value={customer.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Contact Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-input"
                  value={customer.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">Choose a Service</h2>
              <p className="section-helper">Please select a beauty service below.</p>

              <select
                className="form-select form-select-large"
                value={selectedProduct?.id ?? ''}
                onChange={(event) => handleProductSelect(event.target.value)}
                disabled={loading}
              >
                {products.map((category) => (
                  <optgroup key={category.category} label={category.category}>
                    {category.items.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} {item.require_booking ? '(Booking Required)' : '(Walk-in OK)'}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              {selectedProduct && (
                <div className="selection-note">
                  {selectedProduct.require_booking ? (
                    <>
                      <strong>Booking required.</strong> We&apos;ll help you pick a date and time next.
                    </>
                  ) : (
                    <>
                      <strong>Walk-in friendly.</strong> We&apos;ll issue your queue ticket right away.
                    </>
                  )}
                </div>
              )}

              <p className="section-disclaimer">
                Services marked with “Booking Required” must be reserved in advance.
              </p>
            </div>

            <div className="button-group">
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                Next
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
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
