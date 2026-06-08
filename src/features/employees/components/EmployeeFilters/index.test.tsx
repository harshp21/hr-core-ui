import type { ChangeEvent, ReactNode } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EmployeeFiltersSection } from ".";

vi.mock("@mui/icons-material/SearchRounded", () => ({
  default: () => null,
}));

vi.mock("@mui/icons-material/FilterAltRounded", () => ({
  default: () => null,
}));

vi.mock("@mui/material", () => ({
  Button: ({ children, onClick }: { children: ReactNode; onClick?: () => void }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
  Grid: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  InputAdornment: ({ children }: { children: ReactNode }) => <span>{children}</span>,
  MenuItem: ({ children, value }: { children: ReactNode; value: string }) => (
    <option value={value}>{children}</option>
  ),
  Select: ({
    children,
    value,
    onChange,
    inputProps,
  }: {
    children: ReactNode;
    value: string;
    onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
    inputProps?: { "aria-label"?: string };
  }) => (
    <select aria-label={inputProps?.["aria-label"]} value={value} onChange={onChange}>
      {children}
    </select>
  ),
  Paper: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  FormControl: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  OutlinedInput: () => null,
  TextField: ({
    placeholder,
    value,
    onChange,
  }: {
    placeholder?: string;
    value?: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  }) => <input placeholder={placeholder} value={value ?? ""} onChange={onChange} />,
}));

describe("EmployeeFiltersSection", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("debounces search input before calling onChange", () => {
    const onChange = vi.fn();

    render(
      <EmployeeFiltersSection
        filters={{ search: "", department: "", country: "", jobTitle: "" }}
        onChange={onChange}
        onReset={vi.fn()}
      />,
    );

    const searchInput = screen.getByPlaceholderText("Search employees...");
    fireEvent.change(searchInput, { target: { value: "Jane" } });

    act(() => {
      vi.advanceTimersByTime(399);
    });
    expect(onChange).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onChange).toHaveBeenCalledWith({
      search: "Jane",
      department: "",
      country: "",
      jobTitle: "",
    });
  });

  it("calls onReset when reset button is clicked", () => {
    const onReset = vi.fn();

    render(
      <EmployeeFiltersSection
        filters={{
          search: "john",
          department: "Engineering",
          country: "India",
          jobTitle: "Software Engineer",
        }}
        onChange={vi.fn()}
        onReset={onReset}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it("cancels pending debounce when reset is clicked", () => {
    const onChange = vi.fn();

    render(
      <EmployeeFiltersSection
        filters={{ search: "", department: "", country: "", jobTitle: "" }}
        onChange={onChange}
        onReset={vi.fn()}
      />,
    );

    const searchInput = screen.getByPlaceholderText("Search employees...");
    fireEvent.change(searchInput, { target: { value: "Jane" } });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  it("uses latest filters after rerender when debounce fires", () => {
    const onChange = vi.fn();

    const { rerender } = render(
      <EmployeeFiltersSection
        filters={{ search: "", department: "Engineering", country: "", jobTitle: "" }}
        onChange={onChange}
        onReset={vi.fn()}
      />,
    );

    const searchInput = screen.getByPlaceholderText("Search employees...");
    fireEvent.change(searchInput, { target: { value: "Alice" } });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender(
      <EmployeeFiltersSection
        filters={{ search: "", department: "Sales", country: "", jobTitle: "" }}
        onChange={onChange}
        onReset={vi.fn()}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onChange).toHaveBeenCalledWith({
      search: "Alice",
      department: "Sales",
      country: "",
      jobTitle: "",
    });
  });
});
