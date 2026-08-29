import Icon from "./Icon.jsx";

export const Spinner = ({ className = "w-5 h-5" }) => (
  <Icon name="spinner" className={`animate-spin text-brand-400 ${className}`} />
);

const LoadingState = ({ label = "Loading…" }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-500 animate-fade-in">
    <Spinner className="w-8 h-8" />
    <p className="text-sm">{label}</p>
  </div>
);

export default LoadingState;
