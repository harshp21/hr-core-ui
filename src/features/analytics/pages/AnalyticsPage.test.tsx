import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { AnalyticsPage } from "./AnalyticsPage";
import { useAnalyticsQuery } from "../hooks/use-analytics";

vi.mock("../hooks/use-analytics", () => ({
  useAnalyticsQuery: vi.fn(),
}));

vi.mock("../../../components/common/LoadingSkeleton", () => ({
  LoadingSkeleton: () => <div data-testid="loading-skeleton" />,
}));

vi.mock("../components/SummaryCards", () => ({
  SummaryCards: () => <div data-testid="summary-cards" />,
}));

vi.mock("../components/CountryInsights", () => ({
  CountryInsights: () => <div data-testid="country-insights" />,
}));

vi.mock("../components/DepartmentInsights", () => ({
  DepartmentInsights: () => <div data-testid="department-insights" />,
}));

vi.mock("../components/JobTitleInsights", () => ({
  JobTitleInsights: () => <div data-testid="job-title-insights" />,
}));

describe("AnalyticsPage", () => {
  it("renders loading state", () => {
    vi.mocked(useAnalyticsQuery).mockReturnValue({
      isLoading: true,
      data: undefined,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useAnalyticsQuery>);

    render(
      <MemoryRouter>
        <AnalyticsPage />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
  });

  it("renders analytics widgets when data exists", () => {
    vi.mocked(useAnalyticsQuery).mockReturnValue({
      isLoading: false,
      data: {
        summary: {
          totalEmployees: 10,
          activeEmployees: 10,
          averageSalary: 100,
          totalPayroll: 1000,
        },
        byCountry: [],
        byDepartment: [],
        byJobTitle: [],
      },
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useAnalyticsQuery>);

    render(
      <MemoryRouter>
        <AnalyticsPage />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("summary-cards")).toBeInTheDocument();
    expect(screen.getByTestId("country-insights")).toBeInTheDocument();
    expect(screen.getByTestId("department-insights")).toBeInTheDocument();
    expect(screen.getByTestId("job-title-insights")).toBeInTheDocument();
  });

  it("shows retry state and calls refetch", () => {
    const refetch = vi.fn();
    vi.mocked(useAnalyticsQuery).mockReturnValue({
      isLoading: false,
      data: undefined,
      refetch,
    } as unknown as ReturnType<typeof useAnalyticsQuery>);

    render(
      <MemoryRouter>
        <AnalyticsPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });
});
