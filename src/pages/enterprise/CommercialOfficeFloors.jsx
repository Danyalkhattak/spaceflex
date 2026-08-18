import EnterpriseCategoryPage from "../../components/EnterpriseCategoryPage.jsx";
import { ENTERPRISE_CATEGORIES } from "../../data/enterpriseConfig.js";

export default function CommercialOfficeFloors() {
  return <EnterpriseCategoryPage config={ENTERPRISE_CATEGORIES["commercial-office-floors"]} />;
}
