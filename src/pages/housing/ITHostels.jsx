import HousingCategoryPage from "../../components/HousingCategoryPage.jsx";
import { HOUSING_CATEGORIES } from "../../features/housing/housingMeta.js";

export default function ITHostels() {
  return <HousingCategoryPage config={HOUSING_CATEGORIES["it-hostels-g11-islamabad"]} />;
}
