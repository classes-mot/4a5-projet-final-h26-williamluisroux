import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import MessageItem from "./MessageItem";

describe("MessageBubble Component", () => {
  it("devrait afficher le contenu du message et le nom de l'auteur", () => {
    const mockMsg = {
      contenu: "Bienvenue sur mon forum !",
      auteurId: { name: "Alice", profilePicture: "url-image" },
      dateEnvoi: new Date().toISOString()
    };

    render(<MessageItem msg={mockMsg} isMyMessage={false} />);

    expect(screen.getByText("Bienvenue sur mon forum !")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });
});