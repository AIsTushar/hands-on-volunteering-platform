import { Link, NavLink } from "react-router-dom";
import { MoonIcon, SunIcon } from "./icons";
import { useState } from "react";
import useThemeSwitcher from "../hooks/useThemeSwitcher";
import { useAuthStore } from "../store/authStore";

const CustomLinks = ({ href, title, className = "" }) => {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        `${className} group relative ${isActive ? "font-semibold" : ""}`
      }
    >
      {({ isActive }) => (
        <>
          {title}
          <span
            className={`ease absolute -bottom-0.5 left-0 h-[1px] bg-black transition-[width] duration-300 group-hover:w-full dark:bg-white ${
              isActive ? "w-full" : "w-0"
            }`}
          >
            &nbsp;
          </span>
        </>
      )}
    </NavLink>
  );
};

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useThemeSwitcher();
  const { isAuthenticated, logout, user } = useAuthStore();
  console.log(isAuthenticated, user);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  return (
    <header className="font-Poppins flex items-center justify-between border-b border-gray-300 px-16 py-6 dark:border-gray-100 dark:bg-black dark:text-white">
      <Link to={"/"}>
        <img
          src={`${mode === "light" ? "/HandsOn.png" : "/HandsOn_white.png"}`}
          alt="logo"
          className="h-12 w-auto"
        />
      </Link>

      <nav className="hidden items-center justify-center gap-4 text-lg md:flex">
        <CustomLinks title="Home" href="/" />
        <CustomLinks title="Events" href="/events" />
        <CustomLinks title="Community" href="/community-requests" />
        <CustomLinks title="Teams" href="/teams" />
      </nav>

      <nav className="hidden items-center justify-center gap-4 text-lg md:flex">
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <span className="cursor-pointer" onClick={logout}>
              Logout
            </span>
            <Link to="/profile">
              <img
                className="h-8 w-8 rounded-full"
                src={
                  user?.profileImage ? user?.profileImage : "/user/default.jpg"
                }
              />
            </Link>
          </div>
        ) : (
          <>
            <CustomLinks title="Login" href="/login" />
            <CustomLinks title="SignUp" href="/signup" />
          </>
        )}

        <button
          className={`ml-3 flex w-6 cursor-pointer items-center justify-center rounded-full ${
            mode === "light" ? "bg-black text-white" : "bg-white text-black"
          }`}
          onClick={toggleTheme}
        >
          {mode === "dark" ? (
            <SunIcon className={"fill-black"} />
          ) : (
            <MoonIcon className={"fill-dark"} />
          )}
        </button>
      </nav>

      {/* Hamburger */}
      <button
        className="relative flex h-6 w-6 flex-col md:hidden"
        onClick={handleClick}
      >
        <span
          className={`absolute h-0.5 w-full rounded-md bg-black transition-all duration-300 dark:bg-white ${
            isOpen ? "rotate-45" : "-translate-y-2"
          }`}
        ></span>

        <span
          className={`absolute h-0.5 w-full rounded-md bg-black transition-all duration-300 dark:bg-white ${
            isOpen ? "translate-x-2 opacity-0" : "opacity-100"
          }`}
        ></span>

        <span
          className={`absolute h-0.5 w-full rounded-md bg-black transition-all duration-300 dark:bg-white ${
            isOpen ? "-rotate-45" : "translate-y-2"
          }`}
        ></span>
      </button>

      {isOpen && (
        <div className="fixed top-1/2 left-1/2 z-30 flex min-w-[70vw] -translate-x-[50%] -translate-y-[50%] flex-col items-center justify-between rounded-lg bg-black/75 py-32 backdrop-blur-md md:hidden">
          <nav className="mb-6 flex flex-col items-center justify-center gap-4 text-lg">
            <CustomLinks title="Home" href="/" />
            <CustomLinks title="Events" href="/events" />
            <CustomLinks title="Community" href="/community-requests" />
            <CustomLinks title="Teams" href="/teams" />
          </nav>

          <nav className="flex items-center justify-center gap-4 text-lg">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="cursor-pointer" onClick={logout}>
                  Logout
                </span>
                <Link to="/profile">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={
                      user?.profileImage
                        ? user?.profileImage
                        : "/user/default.jpg"
                    }
                  />
                </Link>
              </div>
            ) : (
              <>
                <CustomLinks title="Login" href="/login" />
                <CustomLinks title="SignUp" href="/signup" />
              </>
            )}

            <button
              className={`ml-3 flex w-6 items-center justify-center rounded-full ${
                mode === "light" ? "bg-black text-white" : "bg-white text-black"
              }`}
              onClick={toggleTheme}
            >
              {mode === "dark" ? (
                <SunIcon className={"fill-black"} />
              ) : (
                <MoonIcon className={"fill-dark"} />
              )}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
