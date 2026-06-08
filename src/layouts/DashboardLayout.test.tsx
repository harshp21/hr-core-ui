import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { DashboardLayout } from "./DashboardLayout";

vi.mock("./Sidebar", () => ({
  Sidebar: () => <div>Sidebar</div>,
}));

function renderWithPath(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route path="overview" element={<div>Overview Content</div>} />
          <Route path="employees" element={<div>Employees Content</div>} />
          <Route path="analytics" element={<div>Analytics Content</div>} />
          <Route path="employee" element={<div>Employee Alias Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("DashboardLayout", () => {
  it("shows analytics title on /overview", () => {
    renderWithPath("/overview");

    expect(screen.getByText("Analytics Dashboard")).toBeInTheDocument();
  });

  it("shows employee management title on /employees", () => {
    renderWithPath("/employees");

    expect(screen.getByText("Employee Management")).toBeInTheDocument();
  });

  it("shows analytics title on /analytics", () => {
    renderWithPath("/analytics");

    expect(screen.getByText("Analytics Dashboard")).toBeInTheDocument();
  });

  it("shows employee management title on /employee alias", () => {
    renderWithPath("/employee");

    expect(screen.getByText("Employee Management")).toBeInTheDocument();
  });
});
