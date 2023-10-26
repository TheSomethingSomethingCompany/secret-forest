import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "@/app/page";

describe("Home", () => {
  it("should have 'HelloWorld!' text", () => {
    // TRIPLE A PATTERN
    render(<Home />); // ARRANGE
    const el = screen.getByText("HelloWorld!"); // ACTION
    expect(el).toBeInTheDocument(); // ASSERTION
  });

  it("should contain the text 'eloooo'", () => {
    // TRIPLE A PATTERN
    render(<Home />); // ARRANGE
    const el = screen.getByText(/eloooo/i); // ACTION
    expect(el).toBeInTheDocument(); // ASSERTION
  });
});
