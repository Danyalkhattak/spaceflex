import HousingCategoryPage from "../../components/HousingCategoryPage.jsx";
import { HOUSING_CATEGORIES } from "../../features/housing/housingMeta.js";

export default function StudioApartments() {
  return <HousingCategoryPage config={HOUSING_CATEGORIES["studio-apartments-for-pros"]} />;
}
