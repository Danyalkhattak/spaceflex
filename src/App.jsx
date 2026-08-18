import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";

// Home
import HomePage from "./pages/HomePage.jsx";

// Enterprise Office Space Leasing pillar (Muhammad Hashim Bin Wali)
import EnterpriseOfficeHub from "./pages/enterprise/EnterpriseOfficeHub.jsx";
import CommercialOfficeFloors from "./pages/enterprise/CommercialOfficeFloors.jsx";
import ITParkTechSpace from "./pages/enterprise/ITParkTechSpace.jsx";
import CorporateHQLeasing from "./pages/enterprise/CorporateHQLeasing.jsx";
import PropertyDetail from "./pages/enterprise/PropertyDetail.jsx";
import MyInquiries from "./pages/MyInquiries.jsx";
import AdminInquiries from "./pages/admin/AdminInquiries.jsx";

// Coworking Spaces & Desk Rentals + Booking pillar (Uzair Aziz)
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

        {/* Enterprise Office Space Leasing pillar (Muhammad Hashim Bin Wali) */}
        <Route path="/enterprise-office" element={<EnterpriseOfficeHub />} />
        <Route path="/enterprise-office/commercial-office-floors" element={<CommercialOfficeFloors />} />
        <Route path="/enterprise-office/it-park-tech-space" element={<ITParkTechSpace />} />
        <Route path="/enterprise-office/corporate-hq" element={<CorporateHQLeasing />} />
        <Route path="/enterprise-office/property/:slug" element={<PropertyDetail />} />

        <Route path="/my-inquiries" element={<MyInquiries />} />
        <Route path="/admin/inquiries" element={<AdminInquiries />} />

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
