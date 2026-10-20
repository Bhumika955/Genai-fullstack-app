
import { useTheme } from "../context/ThemeContext.jsx";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <span aria-hidden="true">
        {theme === "light" ? "🌙" : "☀️"}
      </span>
      <span>{theme === "light" ? "Dark" : "Light"} Mode</span>
    </button>
  );
}

export default ThemeToggle;
