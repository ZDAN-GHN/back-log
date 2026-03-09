import { Link, useLocation } from 'react-router-dom';
import { CheckSquare, Calendar, BarChart2 } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: CheckSquare, label: '任务' },
    { path: '/today', icon: Calendar, label: '今日' },
    { path: '/stats', icon: BarChart2, label: '统计' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-pink rounded-xl flex items-center justify-center text-white shadow-sm">
            <CheckSquare size={20} strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            Backlog
          </h1>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  "relative px-3 py-2 rounded-xl transition-colors duration-200 flex items-center gap-2",
                  isActive 
                    ? "text-brand-pink bg-brand-pink/10" 
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                )}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-sm font-medium hidden sm:block">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-brand-pink/10 rounded-xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
