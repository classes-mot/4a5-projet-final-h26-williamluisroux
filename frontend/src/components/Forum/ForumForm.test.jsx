import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import ForumForm from "./ForumForm";

describe("ForumForm Component", () => {
  const mockProps = {
    title: "Mon super titre",
    setTitle: vi.fn(),
    description: "Ma description",
    setDescription: vi.fn(),
    onSubmit: vi.fn(),
    t: (key) => key,
  };

  it("devrait désactiver le bouton quand isLoading est vrai", () => {
    render(<ForumForm {...mockProps} isLoading={true} />);

    const submitBtn = screen.getByRole("button");
    
    expect(submitBtn).toBeDisabled();
    
    expect(submitBtn).toHaveTextContent("nouveau-forum.publier-forum-loading");
  });

  it("devrait être activé quand isLoading est faux", () => {
    render(<ForumForm {...mockProps} isLoading={false} />);

    const submitBtn = screen.getByRole("button");
    
    expect(submitBtn).not.toBeDisabled();
    expect(submitBtn).toHaveTextContent("nouveau-forum.bouton-publier-forum");
  });
});