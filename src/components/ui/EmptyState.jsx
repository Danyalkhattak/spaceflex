import Icon from "./Icon.jsx";

export const EmptyState = ({ icon = "building", title, message, action }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-20 text-center px-4">
    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
      <Icon name={icon} className="w-7 h-7" />
    </div>
    <h3 className="text-base font-semibold text-slate-900">{title}</h3>
    {message && <p className="text-sm text-slate-500 max-w-sm">{message}</p>}
    {action}
  </div>
);

export const ErrorState = ({ title = "Something went wrong", message, action }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-20 text-center px-4">
    <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-red-500">
      <Icon name="close" className="w-7 h-7" />
    </div>
    <h3 className="text-base font-semibold text-slate-900">{title}</h3>
    {message && <p className="text-sm text-slate-500 max-w-sm">{message}</p>}
    {action}
  </div>
);
