import EnterpriseCategoryPage from "../../components/EnterpriseCategoryPage.jsx";
import { ENTERPRISE_CATEGORIES } from "../../data/enterpriseConfig.js";

export default function ITParkTechSpace() {
  return <EnterpriseCategoryPage config={ENTERPRISE_CATEGORIES["it-park-tech-space"]} />;
}
