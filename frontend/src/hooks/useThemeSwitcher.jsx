import { useEffect, useState } from "react";

function useThemeSwitcher() {
  const prefersDarkQuery = "(prefers-color-scheme: dark)";
  const [mode, setMode] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("theme") ||
        (window.matchMedia(prefersDarkQuery).matches ? "dark" : "light")
      );
    }
    return "light";
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(prefersDarkQuery);

    const handleChange = () => {
      const userPref = localStorage.getItem("theme");
      const newMode = userPref || (mediaQuery.matches ? "dark" : "light");

      setMode(newMode);
      document.documentElement.classList.toggle("dark", newMode === "dark");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (mode) {
      localStorage.setItem("theme", mode);
      document.documentElement.classList.toggle("dark", mode === "dark");
    }
  }, [mode]);

  return [mode, setMode];
}

export default useThemeSwitcher;
