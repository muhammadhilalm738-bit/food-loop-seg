import { useState } from 'react';
import { Leaf, Users, Wheat, Menu, X, BarChart3, LayoutDashboard, LogIn } from 'lucide-react';
import type { UserRole } from '@/types';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onJoin: () => void;
}

export default function Navbar({ currentPage, onNavigate, onJoin }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Leaf },
    { id: 'donor', label: 'Donor Dashboard', icon: LayoutDashboard },
    { id: 'ngo', label: 'NGO Feed', icon: Users },
    { id: 'farm', label: 'Farm & Energy', icon: Wheat },
    { id: 'analytics', label: 'Impact', icon: BarChart3 },
  ];

  const handleNav = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => handleNav('landing')}
            className="flex items-center gap-2 font-bold text-lg text-stone-900"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-forest-500 to-earth-500 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="hidden sm:block">FoodLoop</span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-stone-100 text-stone-900'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onJoin}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 text-white text-sm font-semibold hover:bg-stone-800 transition-all duration-200 active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              Join the Loop
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-3 border-t border-stone-200 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-stone-100 text-stone-900'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
              <button
                onClick={() => {
                  onJoin();
                  setMobileOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold bg-stone-900 text-white mt-1"
              >
                <LogIn className="w-4 h-4" />
                Join the Loop
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

interface RoleModalProps {
  open: boolean;
  onClose: () => void;
  onSelectRole: (role: UserRole) => void;
}

export function RoleModal({ open, onClose, onSelectRole }: RoleModalProps) {
  if (!open) return null;

  const roles: { role: UserRole; title: string; desc: string; icon: typeof Leaf; color: string }[] = [
    {
      role: 'donor',
      title: 'Donor',
      desc: 'Restaurants, caterers, grocery stores & markets listing surplus food',
      icon: LayoutDashboard,
      color: 'forest',
    },
    {
      role: 'ngo',
      title: 'NGO / Food Shelter',
      desc: 'Receive edible food for distribution to people in need',
      icon: Users,
      color: 'forest',
    },
    {
      role: 'farm',
      title: 'Farm / Biogas',
      desc: 'Dairy farmers, poultry farms & biogas plants receiving scraps',
      icon: Wheat,
      color: 'earth',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-stone-900">Join the Loop</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-stone-600" />
          </button>
        </div>
        <p className="text-stone-600 text-sm mb-6">
          Select your role to get started. You can always switch from the navigation bar.
        </p>
        <div className="flex flex-col gap-3">
          {roles.map(({ role, title, desc, icon: Icon, color }) => (
            <button
              key={role}
              onClick={() => {
                onSelectRole(role);
                onClose();
              }}
              className={`flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md active:scale-[0.98] ${
                color === 'forest'
                  ? 'border-forest-200 hover:border-forest-400 bg-forest-50/50'
                  : 'border-earth-200 hover:border-earth-400 bg-earth-50/50'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  color === 'forest' ? 'bg-forest-500' : 'bg-earth-500'
                }`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-900 mb-0.5">{title}</h3>
                <p className="text-sm text-stone-500 leading-snug">{desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
