import HousingCategoryPage from "../../components/HousingCategoryPage.jsx";
import { HOUSING_CATEGORIES } from "../../features/housing/housingMeta.js";

export default function CorporateGuestHouses() {
  return <HousingCategoryPage config={HOUSING_CATEGORIES["corporate-guest-house-rentals"]} />;
}
