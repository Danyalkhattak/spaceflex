import EnterpriseCategoryPage from "../../components/EnterpriseCategoryPage.jsx";
import { ENTERPRISE_CATEGORIES } from "../../data/enterpriseConfig.js";

export default function CorporateHQLeasing() {
  return <EnterpriseCategoryPage config={ENTERPRISE_CATEGORIES["corporate-hq"]} />;
}
