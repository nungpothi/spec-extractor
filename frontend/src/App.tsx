import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import CheckInPage from './pages/CheckInPage';
import RegisterPage from './pages/RegisterPage';
import AppointmentPage from './pages/AppointmentPage';
import ConfirmationPage from './pages/ConfirmationPage';
import PrintPage from './pages/PrintPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/checkin" element={<CheckInPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/appointment" element={<AppointmentPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/print" element={<PrintPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;