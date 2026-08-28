import React from 'react';

export default function ToggleSwitch({ checked, onChange, label, description, id }) {
  // Check if reduced motion is globally applied
  const isReducedMotion = document.body.classList.contains('reduced-motion');

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div 
      className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors w-full min-h-[44px] cursor-pointer"
      onClick={() => onChange(!checked)}
    >
      <div className="flex-1 pr-4 text-left">
        {label && (
          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block select-none">
            {label}
          </span>
        )}
        {description && (
          <p className="text-[10px] text-slate-450 dark:text-slate-500 leading-normal mt-0.5 select-none">
            {description}
          </p>
        )}
      </div>

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={(e) => {
          e.stopPropagation(); // Avoid double toggling from row click
          onChange(!checked);
        }}
        onKeyDown={handleKeyDown}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 items-center ${
          checked ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'
        } ${isReducedMotion ? '' : 'transition-colors duration-200'}`}
        aria-label={label}
        style={{ minHeight: '24px' }}
      >
        <span
          className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          } ${isReducedMotion ? '' : 'transition-transform duration-200'}`}
        />
      </button>
    </div>
  );
}
