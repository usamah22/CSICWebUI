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
          {/* Conditional container width */}
          <div
            className={
              fullWidth
                ? "w-full px-4 sm:px-6 lg:px-8" // Full-width layout
                : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" // Constrained layout
            }
          >
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/" className="text-xl font-bold text-[#b05eb3]">
                    <img src={astonLogo} alt="Aston Logo" className="h-8" />
                  </Link>
                </div>
                <div className="hidden sm:flex sm:ml-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="inline-flex items-center text-[14px] font-medium hover:bg-[#d30063] hover:text-white sm:p-4 rounded-md"
                    >
                      <div>{item.name}</div>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {isAuthenticated ? (
                  <Menu as="div" className="ml-3 relative">
                    <MenuButton className="bg-white rounded-full flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        {user?.email?.[0].toUpperCase()}
                      </div>
                    </MenuButton>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <MenuItems className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <MenuItem>
                          {({ active }) => (
                            <button
                              onClick={logout}
                              className={`${
                                active ? "bg-gray-100" : ""
                              } block px-4 py-2 text-sm text-gray-700 w-full text-left`}
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
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#880090] hover:bg-[#b05eb3]"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
};