import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
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
} from '@heroicons/react/24/outline';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { TeamSelector } from '../components/dashboard/TeamSelector';
import { AuthGuard } from '../components/auth/AuthGuard';

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

  return (
    <AuthGuard>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
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
                  </Transition.Child>
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
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

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
