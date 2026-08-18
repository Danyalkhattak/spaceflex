import { Link } from "react-router-dom";
import heroImage from "../assets/hero.png";
import Button from "../components/ui/Button.jsx";
import Icon from "../components/ui/Icon.jsx";
import { COWORKING_PROPERTY_TYPES } from "../features/coworking/coworkingMeta.js";

const HomePage = () => (
  <div>
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
          Flexible coworking spaces, booked in minutes.
        </h1>
        <p className="mt-4 text-lg text-slate-500 max-w-xl">
          Shared desks, private cabins for startups, and 24/7 night-shift coworking floors
          across Pakistan — browse, compare, and book instantly with SpaceFlex.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button as={Link} to="/coworking" size="lg">
            Browse coworking spaces
          </Button>
        </div>
      </div>
      <img
        src={heroImage}
        alt="SpaceFlex coworking"
        className="w-full max-w-sm mx-auto lg:max-w-none"
      />
    </section>

    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">Coworking plans we offer</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {COWORKING_PROPERTY_TYPES.map((type) => (
          <Link
            key={type.value}
            to={`/coworking?type=${type.value}`}
            className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-3">
              <Icon name="building" className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900">{type.label}</h3>
            <p className="text-sm text-slate-500 mt-1.5">{type.description}</p>
          </Link>
        ))}
      </div>
    </section>
  </div>
);

export default HomePage;
