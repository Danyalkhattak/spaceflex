import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import Home from './pages/Home.jsx'
import EnterpriseOfficeHub from './pages/enterprise/EnterpriseOfficeHub.jsx'
import CommercialOfficeFloors from './pages/enterprise/CommercialOfficeFloors.jsx'
import ITParkTechSpace from './pages/enterprise/ITParkTechSpace.jsx'
import CorporateHQLeasing from './pages/enterprise/CorporateHQLeasing.jsx'
import PropertyDetail from './pages/enterprise/PropertyDetail.jsx'
import MyInquiries from './pages/MyInquiries.jsx'
import AdminInquiries from './pages/admin/AdminInquiries.jsx'
import NotFound from './pages/NotFound.jsx'

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

        {/* Enterprise Office Space Leasing pillar (Muhammad Hashim Bin Wali) */}
        <Route path="/enterprise-office" element={<EnterpriseOfficeHub />} />
        <Route path="/enterprise-office/commercial-office-floors" element={<CommercialOfficeFloors />} />
        <Route path="/enterprise-office/it-park-tech-space" element={<ITParkTechSpace />} />
        <Route path="/enterprise-office/corporate-hq" element={<CorporateHQLeasing />} />
        <Route path="/enterprise-office/property/:slug" element={<PropertyDetail />} />

        <Route path="/my-inquiries" element={<MyInquiries />} />
        <Route path="/admin/inquiries" element={<AdminInquiries />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
