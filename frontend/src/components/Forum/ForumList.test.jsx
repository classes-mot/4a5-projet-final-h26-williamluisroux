import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import ForumList from "./ForumList";

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

describe("ForumList Component", () => {
  it("devrait afficher le message d'erreur lorsque la liste est vide", () => {
    render(<ForumList items={[]} />);
    
    expect(screen.getByText("messages-erreur.aucun-forum")).toBeInTheDocument();
  });
});