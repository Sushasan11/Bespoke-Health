import { BrainCircuit, ShoppingCart, Stethoscope } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { getMyProfile } from "../../services/KycService";
import NotificationService from "../../services/NotificationService";
import NotificationDrawer from "../notifications/NotificationDrawer";

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profile, setProfile] = useState({});
  const { totalUnread } = useChat();

  
  useEffect(() => {
    if (user && user.role !== "Admin") {
      const fetchUnreadCount = async () => {
        try {
          const count = await NotificationService.getUnreadCount();
          setUnreadCount(count);
        } catch (error) {
          console.error("Failed to fetch notification count:", error);
        }
      };

      const fetchProfile = async () => {
        try {
          const profile = await getMyProfile();
          console.log("User profile:", profile);
          setProfile(profile);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      };
      fetchUnreadCount();
      fetchProfile();
      const intervalId = setInterval(fetchUnreadCount, 60000);
      return () => clearInterval(intervalId);
    }
  }, [user]);

  
  useEffect(() => {
    if (!isNotificationsOpen && user && user.role !== "Admin") {
      NotificationService.getUnreadCount().then((count) =>
        setUnreadCount(count)
      );
    }
  }, [isNotificationsOpen, user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  const getInitial = () => {
    if (!profile || !profile.name) return "U";
    return profile.name.charAt(0).toUpperCase();
  };

  const getFirstName = () => {
    if (!profile || !profile.name) return "User";
    return profile.name.split(" ")[0];
  };

  
  const NotificationBadge = ({ onClick }) => {
    return (
      <button
        className="p-2 rounded-full text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative"
        onClick={onClick}
      >
        <span className="sr-only">View notifications</span>
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-gray-600 bg-opacity-50 z-10"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <nav className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            <div className="flex items-center">
              
              <button
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              
              <div className="flex-shrink-0 flex items-center ml-2 md:ml-0">
                <Link to="/dashboard" className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span className="ml-2 text-xl font-bold text-gray-800 hidden sm:block">
                    Bespoke Health
                  </span>
                </Link>
              </div>
            </div>

            
            <div className="flex items-center">
              
              {user?.role !== "Admin" && (
                <div className="relative">
                  <NotificationBadge
                    onClick={() => setIsNotificationsOpen(true)}
                  />
                </div>
              )}

              
              <div className="ml-3 relative" ref={profileDropdownRef}>
                <div>
                  <button
                    className="flex items-center max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    id="user-menu-button"
                    aria-expanded={isProfileMenuOpen}
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="flex items-center">
                      <div className="hidden sm:block mr-3 text-right">
                        <p className="text-sm font-medium text-gray-700">
                          Hi, {getFirstName()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user?.role || "User"}
                        </p>
                      </div>
                      <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-medium shadow-sm">
                        {getInitial()}
                      </div>
                    </div>
                  </button>
                </div>

                
                {isProfileMenuOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex="-1"
                  >
                    <div className="block px-4 py-2 text-xs text-gray-500 border-b border-gray-100 sm:hidden">
                      Hi, {getFirstName()}
                      <p className="font-medium text-gray-700">
                        {user?.role || "User"}
                      </p>
                    </div>

                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex="-1"
                      id="user-menu-item-2"
                      onClick={handleLogout}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      
      <div className="flex">
        {" "}
        
        
        <aside
          className={`bg-white w-64 shadow-md fixed top-16 bottom-0 transition-all duration-300 ease-in-out z-20
            ${isSidebarOpen ? "left-0" : "-left-64 md:left-0"}`}
        >
          <div className="h-full overflow-y-auto">
            {" "}
            
            <div className="p-6">
              <p className="text-lg font-semibold text-gray-600">Dashboard</p>

              {user?.role !== "Admin" &&
                profile &&
                profile.kyc_status !== "Approved" && (
                  <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
                    <p className="text-sm text-yellow-700">
                      Your KYC is {profile.kyc_status}. Some features may be
                      restricted.
                    </p>
                    <Link
                      to="/kyc-verification"
                      className="mt-2 inline-block text-xs font-medium text-yellow-700 underline"
                    >
                      Complete KYC verification
                    </Link>
                  </div>
                )}

              <nav className="mt-6 space-y-1">
                <SidebarLink
                  to="/dashboard"
                  label="Overview"
                  icon="home"
                  currentPath={location.pathname}
                />

                {user?.role === "Patient" && (
                  <>
                    <SidebarLink
                      to="/dashboard/appointments"
                      label="My Appointments"
                      icon="calendar"
                      currentPath={location.pathname}
                    />
                  
                    <SidebarLink
                      to="/dashboard/prescriptions"
                      label="Prescriptions"
                      icon="clipboard"
                      currentPath={location.pathname}
                    />
                    <SidebarLink
                      to="/dashboard/disease-prediction"
                      label="Disease Prediction"
                      icon="prediction"
                      currentPath={location.pathname}
                    />
                    <SidebarLink
                      to="/dashboard/medicines"
                      label="Medicine Store"
                      icon="shop"
                      currentPath={location.pathname}
                    />
                    <SidebarLink
                      to="/dashboard/chat"
                      label="Messages"
                      icon="chat"
                      currentPath={location.pathname}
                      notificationCount={totalUnread}
                    />
                  </>
                )}

                {user?.role === "Doctor" && (
                  <>
                    <SidebarLink
                      to="/dashboard/schedule"
                      label="My Schedule"
                      icon="calendar"
                      currentPath={location.pathname}
                    />
                    <SidebarLink
                      to="/dashboard/availability"
                      label="My Availability"
                      icon="clock"
                      currentPath={location.pathname}
                    />

                    <SidebarLink
                      to="/dashboard/consultations"
                      label="Consultations"
                      icon="consultation"
                      currentPath={location.pathname}
                    />
                      <SidebarLink
                      to="/dashboard/chat"
                      label="Messages"
                      icon="chat"
                      currentPath={location.pathname}
                      notificationCount={totalUnread}
                    />
                  </>
                )}

                {user?.role === "Admin" && (
                  <>
                    <SidebarLink
                      to="/dashboard/kyc-requests"
                      label="KYC Requests"
                      icon="shield-check"
                      currentPath={location.pathname}
                    />
                    <SidebarLink
                      to="/dashboard/customers"
                      label="Customers"
                      icon="users"
                      currentPath={location.pathname}
                    />
                    <SidebarLink
                      to="/dashboard/doctors"
                      label="Doctors"
                      icon="user-md"
                      currentPath={location.pathname}
                    />
                    <SidebarLink
                      to="/dashboard/payments"
                      label="Payments"
                      icon="credit-card"
                      currentPath={location.pathname}
                    />
                    <SidebarLink
                      to="/dashboard/analytics"
                      label="System Analytics"
                      icon="chart-bar"
                      currentPath={location.pathname}
                    />
                    <SidebarLink
                      to="/dashboard/admin/medicines"
                      label="Manage Store"
                      icon="shop"
                      currentPath={location.pathname}
                    />
                  </>
                )}

            
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="w-full mt-2 flex items-center px-2 py-3 text-gray-600 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors group"
                  >
                    <div className="mr-3 text-gray-400 group-hover:text-red-500">
                      <svg
                        className="w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                    </div>
                    <span>Sign Out</span>
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </aside>
        <div className="flex-1 md:ml-64 overflow-auto min-h-[calc(100vh-4rem)]">
          {user?.role !== "Admin" &&
            profile &&
            profile.kyc_status !== "Approved" &&
            profile.role !== "admin" && (
              <div className="p-4 sm:p-6 md:p-8">
                <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-yellow-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        KYC Status: {profile.kyc_status}
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          Some features are restricted until your KYC is
                          approved.
                        </p>
                      </div>
                      <div className="mt-3">
                        <Link
                          to="/kyc-verification"
                          className="text-sm font-medium text-yellow-800 hover:text-yellow-900 inline-flex items-center"
                        >
                          Complete verification
                          <svg
                            className="ml-1 h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          
          <div className="p-4 sm:p-6 md:p-8">{children}</div>
        </div>
      </div>

      
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
};

const SidebarLink = ({ to, label, icon, currentPath, notificationCount }) => {
  const isActive =
    currentPath === to || (to !== "/dashboard" && currentPath.startsWith(to));

  const iconMap = {
    home: (
      <svg
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
    prediction: <BrainCircuit />,
    shop: <ShoppingCart />,
    calendar: (
      <svg
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
    document: (
      <svg
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    users: (
      <svg
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
    chat: (
      <svg
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    ),
    settings: (
      <svg
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    clipboard: (
      <svg
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
    check: (
      <svg
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    chart: (
      <svg
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    consultation: <Stethoscope />,
    profile: (
      <svg
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    "user-md": (
      <svg
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    "credit-card": (
      <svg
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    ),
    "chart-bar": (
      <svg
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    "shield-check": (
      <svg
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    clock: (
      <svg
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  return (
    <Link
      to={to}
      className={`group flex items-center px-2 py-3 rounded-md transition-colors ${
        isActive
          ? "bg-blue-50 text-blue-700"
          : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      <div
        className={`mr-3 ${
          isActive ? "text-blue-700" : "text-gray-400 group-hover:text-blue-500"
        }`}
      >
        {iconMap[icon]}
      </div>
      <span className="font-medium">{label}</span>
      {isActive && (
        <span className="ml-auto h-2 w-2 rounded-full bg-blue-600"></span>
      )}

       {notificationCount > 0 && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {notificationCount > 9 ? '9+' : notificationCount}
        </span>
      )}
    </Link>
  );
};

export default DashboardLayout;
