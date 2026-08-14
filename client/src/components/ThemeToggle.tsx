/* Shared Assuredia theme switch: compact, accessible, and available in every control surface. */
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return <button type="button" className={`icon-button ${className}`.trim()} onClick={toggleTheme} aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"} aria-pressed={isDark} title={isDark ? "Switch to light mode" : "Switch to dark mode"}>{isDark ? <Sun size={18} /> : <Moon size={18} />}</button>;
}
