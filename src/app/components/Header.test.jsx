import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Header from "@/app/components/Header";

// Mock fetch to simulate unauthenticated state
beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(() =>
    Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
  ));
});

describe("Header", () => {
  it("renders brand name KAFUNG", async () => {
    render(<Header />);
    expect(screen.getByText(/KAFUNG/i)).toBeDefined();
  });

  it("renders coffee bar subtitle", async () => {
    render(<Header />);
    expect(screen.getByText(/coffee bar/i)).toBeDefined();
  });

  it("renders LOGIN button", async () => {
    render(<Header />);
    await waitFor(() => {
      expect(screen.getByRole("link", { name: /log in/i })).toBeDefined();
    });
  });

  it("renders cart button with aria-label", async () => {
    render(<Header />);
    await waitFor(() => {
      expect(screen.getByRole("link", { name: /cart/i })).toBeDefined();
    });
  });
});
