import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import { AuthContext } from "../../context/auth-context";
import { ThemeContext } from "../../context/theme-context";
import { MemoryRouter } from "react-router-dom";
import NavLinks from "./NavLinks";

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

describe("NavLinks Component", () => {
  it("devrait afficher le bouton logout uniquement si connecté", () => {
    const mockAuth = { isLoggedIn: true, logout: vi.fn() };
    const mockTheme = { theme: 'light', toggleTheme: vi.fn() };

    render(
      <AuthContext.Provider value={mockAuth}>
        <ThemeContext.Provider value={mockTheme}>
          <MemoryRouter><NavLinks /></MemoryRouter>
        </ThemeContext.Provider>
      </AuthContext.Provider>
    );

    expect(screen.getByText("navigation.bouton-deconnexion")).toBeInTheDocument();
  });
});