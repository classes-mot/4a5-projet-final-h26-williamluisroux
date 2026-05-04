import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ForumCard from "./ForumCard";

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: () => Promise.resolve(),
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  }
}));

describe("Integration: ForumCard Actions", () => {
  it("devrait appeler onDelete lors du clic sur le bouton supprimer", () => {
    const mockDelete = vi.fn();
    const forum = { id: "123", titre: "Test", description: "Desc" };

    render(
      <MemoryRouter>
        <ForumCard forum={forum} isMine={true} onDelete={mockDelete} />
      </MemoryRouter>
    );

    const btn = screen.getByRole("button");
    fireEvent.click(btn);

    expect(mockDelete).toHaveBeenCalled();
  });
});