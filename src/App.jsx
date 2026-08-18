import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import CoworkingListPage from "./pages/CoworkingListPage.jsx";
import CoworkingDetailPage from "./pages/CoworkingDetailPage.jsx";
import BookingConfirmationPage from "./pages/BookingConfirmationPage.jsx";
import MyBookingsPage from "./pages/MyBookingsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />

        {/* Coworking Spaces & Desk Rentals + Booking (Uzair Aziz) */}
        <Route path="/coworking" element={<CoworkingListPage />} />
        <Route path="/coworking/:slug" element={<CoworkingDetailPage />} />
        <Route path="/bookings/:bookingId" element={<BookingConfirmationPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;
