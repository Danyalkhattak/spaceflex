import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";

// Home
import HomePage from "./pages/HomePage.jsx";

// Admin panel (CRUD dashboard)
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProperties from "./pages/admin/AdminProperties.jsx";
import AdminPropertyForm from "./pages/admin/AdminPropertyForm.jsx";
import AdminBookings from "./pages/admin/AdminBookings.jsx";
import AdminInquiries from "./pages/admin/AdminInquiries.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";

// Enterprise Office Space Leasing pillar (Muhammad Hashim Bin Wali)
import EnterpriseOfficeHub from "./pages/enterprise/EnterpriseOfficeHub.jsx";
import CommercialOfficeFloors from "./pages/enterprise/CommercialOfficeFloors.jsx";
import ITParkTechSpace from "./pages/enterprise/ITParkTechSpace.jsx";
import CorporateHQLeasing from "./pages/enterprise/CorporateHQLeasing.jsx";
import PropertyDetail from "./pages/enterprise/PropertyDetail.jsx";
import MyInquiries from "./pages/MyInquiries.jsx";

// Coworking Spaces & Desk Rentals + Booking pillar (Uzair Aziz)
import CoworkingListPage from "./pages/CoworkingListPage.jsx";
import CoworkingDetailPage from "./pages/CoworkingDetailPage.jsx";
import BookingConfirmationPage from "./pages/BookingConfirmationPage.jsx";
import MyBookingsPage from "./pages/MyBookingsPage.jsx";

// Executive Hostels & Corporate Housing pillar (Raja Mubashir Azeem)
import HousingHub from "./pages/housing/HousingHub.jsx";
import ITHostels from "./pages/housing/ITHostels.jsx";
import StudioApartments from "./pages/housing/StudioApartments.jsx";
import CorporateGuestHouses from "./pages/housing/CorporateGuestHouses.jsx";
import HousingPropertyDetail from "./pages/housing/PropertyDetail.jsx";

import NotFoundPage from "./pages/NotFoundPage.jsx";

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />

        {/* Enterprise Office Space Leasing pillar (Muhammad Hashim Bin Wali) */}
        <Route path="/enterprise-office" element={<EnterpriseOfficeHub />} />
        <Route path="/enterprise-office/commercial-office-floors" element={<CommercialOfficeFloors />} />
        <Route path="/enterprise-office/it-park-tech-space" element={<ITParkTechSpace />} />
        <Route path="/enterprise-office/corporate-hq" element={<CorporateHQLeasing />} />
        <Route path="/enterprise-office/property/:slug" element={<PropertyDetail />} />

        <Route path="/my-inquiries" element={<MyInquiries />} />

        {/* Admin panel - AdminLayout gates every nested route on a verified
            admin profile; the server still enforces requireAdmin itself. */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="properties" element={<AdminProperties />} />
          <Route path="properties/new" element={<AdminPropertyForm />} />
          <Route path="properties/:propertyId/edit" element={<AdminPropertyForm />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        {/* Coworking Spaces & Desk Rentals + Booking (Uzair Aziz) */}
        <Route path="/coworking" element={<CoworkingListPage />} />
        <Route path="/coworking/:slug" element={<CoworkingDetailPage />} />
        <Route path="/bookings/:bookingId" element={<BookingConfirmationPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />

        {/* Executive Hostels & Corporate Housing pillar (Raja Mubashir Azeem) */}
        <Route path="/housing" element={<HousingHub />} />
        <Route path="/housing/it-hostels-g11-islamabad" element={<ITHostels />} />
        <Route path="/housing/studio-apartments-for-pros" element={<StudioApartments />} />
        <Route path="/housing/corporate-guest-house-rentals" element={<CorporateGuestHouses />} />
        <Route path="/housing/property/:slug" element={<HousingPropertyDetail />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;
