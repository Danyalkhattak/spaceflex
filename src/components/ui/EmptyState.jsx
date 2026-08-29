import Icon from "./Icon.jsx";

export const EmptyState = ({ icon = "building", title, message, action }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-20 text-center px-4 animate-fade-in">
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 ring-1 ring-brand-200/60 flex items-center justify-center text-brand-500">
      <Icon name={icon} className="w-8 h-8" />
    </div>
    <h3 className="text-base font-semibold text-slate-900">{title}</h3>
    {message && <p className="text-sm text-slate-500 max-w-sm leading-relaxed">{message}</p>}
    {action}
  </div>
);

export const ErrorState = ({ title = "Something went wrong", message, action }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-20 text-center px-4 animate-fade-in">
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 ring-1 ring-red-200/60 flex items-center justify-center text-red-500">
      <Icon name="close" className="w-8 h-8" />
    </div>
    <h3 className="text-base font-semibold text-slate-900">{title}</h3>
    {message && <p className="text-sm text-slate-500 max-w-sm leading-relaxed">{message}</p>}
    {action}
  </div>
);
