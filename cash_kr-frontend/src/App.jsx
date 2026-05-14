import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar.jsx';
import Footer from './components/footer.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute';
import './index.css';

// Pages
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import BrandSelectionPage from './pages/BrandSelectionPage.jsx';
import ModelSelectionPage from './pages/ModelSelectionPage.jsx';
import ConditionQuizPage from './pages/ConditionQuizPage.jsx';
import SchedulePickupPage from './pages/SchedulePickupPage.jsx';
import OrderConfirmationPage from './pages/OrderConfirmationPage.jsx';
import OrderTrackingPage from './pages/OrderTrackingPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/sell-old-mobile-phones/brand" element={<BrandSelectionPage />} />
          <Route path="/sell-old-mobile-phones/:brand" element={<ModelSelectionPage />} />
          <Route path="/sell-old-mobile-phones/:brand/:slug" element={<ConditionQuizPage />} />
          <Route path="/schedule-pickup" element={<ProtectedRoute><SchedulePickupPage /></ProtectedRoute>} />
          <Route path="/order-confirmation/:orderId" element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} />
          <Route path="/orders/:orderId" element={<ProtectedRoute><OrderTrackingPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;