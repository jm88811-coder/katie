import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: '대시보드', icon: '🏠', end: true },
  { to: '/transactions', label: '매출·지출', icon: '💰' },
  { to: '/documents', label: '견적·청구서', icon: '📄' },
  { to: '/clients', label: '고객 관리', icon: '👥' },
  { to: '/tasks', label: '할 일·일정', icon: '✅' },
  { to: '/settings', label: '설정', icon: '⚙️' },
];

export default function Layout() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 lg:flex">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 no-print lg:hidden">
        <span className="text-lg font-bold text-indigo-600">Katie</span>
        <button
          type="button"
          onClick={() => setNavOpen((v) => !v)}
          className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600"
        >
          메뉴
        </button>
      </header>

      <aside
        className={`no-print border-b border-slate-200 bg-white lg:block lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r lg:min-h-screen ${
          navOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="hidden px-6 py-6 lg:block">
          <p className="text-xl font-bold text-indigo-600">Katie</p>
          <p className="mt-1 text-xs text-slate-400">1인 사업가 비즈니스 매니저</p>
        </div>
        <nav className="flex flex-col gap-1 px-3 py-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setNavOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
