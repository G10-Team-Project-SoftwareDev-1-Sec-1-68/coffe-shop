import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "@/app/components/Header";

describe("Header", () => {
  it("renders brand name KAFUNG", () => {
    render(<Header />);
    expect(screen.getByText(/KAFUNG/i)).toBeDefined();
  });

  it("renders coffee bar subtitle", () => {
    render(<Header />);
    expect(screen.getByText(/coffee bar/i)).toBeDefined();
  });

  it("renders LOGIN button", () => {
    render(<Header />);
    expect(screen.getByRole("button", { name: /login/i })).toBeDefined();
  });

  it("renders cart button with aria-label", () => {
    render(<Header />);
    expect(screen.getByRole("button", { name: /cart/i })).toBeDefined();
  });
});
