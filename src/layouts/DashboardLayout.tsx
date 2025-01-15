import {useState } from 'react';
import {
  Bars3Icon,
  ChartBarIcon,
  HomeIcon,
  XMarkIcon,
  BeakerIcon,
  KeyIcon,
  Cog6ToothIcon,
  ClockIcon,
  UserIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { TeamSelector } from '../components/dashboard/TeamSelector';
import { AuthGuard } from '../components/auth/AuthGuard';
import { useTheme } from '../contexts/ThemeContext';
import {APP_VERSION} from '../utils/env';
import { useSettings } from '../contexts/SettingsProvider';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, end: true },
  { name: 'Playground', href: '/dashboard/playground', icon: BeakerIcon },
  { name: 'Activity Logs', href: '/dashboard/logs', icon: ClockIcon },
  { name: 'Usage', href: '/dashboard/usage', icon: ChartBarIcon },
  { name: 'API Keys', href: '/dashboard/api-keys', icon: KeyIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
  { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
];

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const {settings} = useSettings();

  return (
    <AuthGuard>
      <div>
        {/* Mobile menu */}
        <div 
          className={classNames(
            'lg:hidden fixed inset-0 z-50 transition-all duration-200 ease-in-out',
            sidebarOpen ? 'visible' : 'invisible'
          )}
        >
          {/* Backdrop */}
          <div 
            className={classNames(
              'fixed inset-0 bg-gray-900/80 transition-opacity duration-200 ease-in-out',
              sidebarOpen ? 'opacity-100' : 'opacity-0'
            )}
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}
          <div 
            className={classNames(
              'fixed inset-y-0 left-0 flex w-full max-w-xs transform transition-transform duration-200 ease-in-out',
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            )}
          >
            <div className="relative mr-16 flex w-full max-w-xs flex-1">
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                <button
                  type="button"
                  className="-m-2.5 p-2.5"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-blue-950 to-blue-900 px-6 pb-4">
                <div className="flex h-16 shrink-0 items-center">
                  <Link to="/dashboard" className="flex items-center space-x-2">
                    <span className="text-2xl">💦</span>
                    <span className="text-lg font-semibold bg-gradient-to-r from-blue-200 to-blue-100 bg-clip-text text-transparent">
                      WaterCrawl
                    </span>
                  </Link>
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <NavLink
                              to={item.href}
                              end={item.end}
                              onClick={() => setSidebarOpen(false)}
                              className={({ isActive }) =>
                                classNames(
                                  isActive
                                    ? 'bg-blue-800/50 text-blue-100'
                                    : 'text-blue-200 hover:text-blue-100 hover:bg-blue-800/30',
                                  'group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6'
                                )
                              }
                            >
                              <item.icon
                                className="h-5 w-5 shrink-0"
                                aria-hidden="true"
                              />
                              {item.name}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </nav>
                <div className="text-blue-200/60 text-xs text-center pb-2">
                  Frontend Version: <b>{APP_VERSION}</b> <br />
                  Backend Version: <b>{settings?.api_version}</b>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-blue-950 to-blue-900 px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <span className="text-2xl">💦</span>
                <span className="text-lg font-semibold bg-gradient-to-r from-blue-200 to-blue-100 bg-clip-text text-transparent">
                  WaterCrawl
                </span>
              </Link>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <NavLink
                          to={item.href}
                          end={item.end}
                          className={({ isActive }) =>
                            classNames(
                              isActive
                                ? 'bg-blue-800/50 text-blue-100'
                                : 'text-blue-200 hover:text-blue-100 hover:bg-blue-800/30',
                              'group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6'
                            )
                          }
                        >
                          <item.icon
                            className="h-5 w-5 shrink-0"
                            aria-hidden="true"
                          />
                          {item.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
            <div className="text-blue-200/60 text-xs text-center pb-2">
              Frontend Version: <b>{APP_VERSION}</b> <br />
              Backend Version: <b>{settings?.api_version}</b>
              {/* Copyright */}
              <p className="text-xs leading-6 text-blue-200/60 pt-2">
                &copy;{new Date().getFullYear()} - Made with ❤️ by{' '}
                <a
                  href="https://watercrawl.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200/60 hover:text-blue-100"
                >
                  <b>WaterCrawl</b>
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-200 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 lg:hidden" aria-hidden="true" />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <TeamSelector />
                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <SunIcon className="h-5 w-5" />
                  ) : (
                    <MoonIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Outlet />
          </main>
        </div>
      </div>
    </AuthGuard>
  );
};
