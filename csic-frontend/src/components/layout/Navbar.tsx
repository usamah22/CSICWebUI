import { Fragment } from "react";
import {
  Disclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import astonLogo from "../../assets/astonLogo.png";

const navigation = [
  { name: "Home", href: "/home" },
  { name: "Events", href: "/events" },
  { name: "Partners", href: "/partners" },
  { name: "My Bookings", href: "/bookings" },
  { name: "Feedback", href: "/feedback" },
  { name: "Contact", href: "/contact" },
];

interface NavbarProps {
  fullWidth?: boolean;
}

export const Navbar = ({ fullWidth }: NavbarProps) => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          {/* Navbar Container */}
          <div className={`container mx-auto px-4 ${fullWidth ? "" : "max-w-7xl"}`}>
            {/* Mobile View */}
            <div className="flex flex-col sm:hidden">
              <div className="flex justify-between items-center py-4">
                {/* Mobile Menu Button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>

                {/* Logo (Centered on Mobile) */}
                <Link to="/" className="text-xl font-bold text-[#b05eb3]">
                  <img src={astonLogo} alt="Aston Logo" className="h-8" />
                </Link>

                {/* User Menu */}
                <div className="flex items-center">
                  {isAuthenticated ? (
                    <Menu as="div" className="relative ml-3">
                      <MenuButton className="flex rounded-full bg-none  border-1 border-black">
                        <span className="sr-only">Open user menu</span>
                        <span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-indigo-100">
                          <span className="flex h-full w-full items-center justify-center text-gray-600">
                            {user?.email?.[0]?.toUpperCase() || "?"}
                          </span>
                        </span>
                      </MenuButton>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <MenuItem>
                            {({ active }) => (
                              <button
                                onClick={logout}
                                className={`block w-full text-left px-4 py-2 text-sm text-gray-700 ${
                                  active ? "bg-gray-100" : ""
                                }`}
                              >
                                Sign out
                              </button>
                            )}
                          </MenuItem>
                        </MenuItems>
                      </Transition>
                    </Menu>
                  ) : (
                    <Link
                      to="/login"
                      className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Sign in
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden sm:flex flex-col sm:flex-row justify-between items-center py-4">
              {/* Logo (Centered Above Navigation Links) */}
              <div className="flex justify-center w-full sm:w-auto mb-4 sm:mb-0">
                <Link to="/" className="text-xl font-bold text-[#b05eb3]">
                  <img src={astonLogo} alt="Aston Logo" className="h-8" />
                </Link>
              </div>

              {/* Navigation Links */}
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-gray-700 hover:bg-[#d30063] hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* User Menu */}
              <div className="flex items-center">
                {isAuthenticated ? (
                  <Menu as="div" className="relative ml-3">
                    <MenuButton className="flex rounded-full bg-none    border- border-black 800">
                      <span className="sr-only">Open user menu</span>
                      <span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-indigo-100">
                        <span className="flex h-full w-full items-center justify-center text-gray-600">
                          {user?.email?.[0]?.toUpperCase() || "?"}
                        </span>
                      </span>
                    </MenuButton>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <MenuItem>
                          {({ active }) => (
                            <button
                              onClick={logout}
                              className={`block w-full text-left px-4 py-2 text-sm text-gray-700 ${
                                active ? "bg-gray-100" : ""
                              }`}
                            >
                              Sign out
                            </button>
                          )}
                        </MenuItem>
                      </MenuItems>
                    </Transition>
                  </Menu>
                ) : (
                  <Link
                    to="/login"
                    className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className="text-gray-700 hover:bg-[#d30063] hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};