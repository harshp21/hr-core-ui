import { render, screen } from "@testing-library/react";
import { MemoryRouter, Outlet } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { AppRoutes } from "./AppRoutes";

vi.mock("../layouts/DashboardLayout", () => ({
  DashboardLayout: () => (
    <div>
      <div>Dashboard Layout</div>
      <Outlet />
    </div>
  ),
}));

vi.mock("../features/employees/pages/EmployeesPage", () => ({
  EmployeesPage: () => <div>Employees Page</div>,
}));

vi.mock("../features/analytics/pages/AnalyticsPage", () => ({
  AnalyticsPage: () => <div>Overview Page</div>,
}));

describe("AppRoutes", () => {
  it("renders overview page on direct /overview navigation", async () => {
    render(
      <MemoryRouter initialEntries={["/overview"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Overview Page")).toBeInTheDocument();
  });

  it("renders employees page on direct /employees navigation", async () => {
    render(
      <MemoryRouter initialEntries={["/employees"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Employees Page")).toBeInTheDocument();
  });

  it("redirects /employee alias to /employees", async () => {
    render(
      <MemoryRouter initialEntries={["/employee"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Employees Page")).toBeInTheDocument();
  });

  it("redirects /analytics alias to /overview", async () => {
    render(
      <MemoryRouter initialEntries={["/analytics"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Overview Page")).toBeInTheDocument();
  });

  it("redirects unknown routes to /overview", async () => {
    render(
      <MemoryRouter initialEntries={["/unknown"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Overview Page")).toBeInTheDocument();
  });
});
