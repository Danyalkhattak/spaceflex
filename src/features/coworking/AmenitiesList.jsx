import Icon from "../../components/ui/Icon.jsx";
import { amenityIcon } from "./coworkingMeta.js";

const AmenitiesList = ({ amenities }) => {
  if (!amenities || amenities.length === 0) {
    return <p className="text-sm text-slate-500">No amenities listed for this space.</p>;
  }
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {amenities.map((a) => (
        <li key={a} className="flex items-center gap-2.5 text-sm text-slate-700">
          <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <Icon name={amenityIcon(a)} className="w-4 h-4" />
          </span>
          {a}
        </li>
      ))}
    </ul>
  );
};

export default AmenitiesList;
