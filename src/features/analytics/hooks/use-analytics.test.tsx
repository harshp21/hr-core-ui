import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getCountrySalaryInsights,
  getDepartmentSalaryInsights,
  getJobTitleSalaryInsights,
} from "../api/analytics-api";
import {
  useAnalyticsQuery,
  useAnalyticsSummaryQuery,
  useCountrySalaryInsightsQuery,
  useDepartmentSalaryInsightsQuery,
  useJobTitleSalaryInsightsQuery,
} from "./use-analytics";

vi.mock("../api/analytics-api", () => ({
  getCountrySalaryInsights: vi.fn(),
  getDepartmentSalaryInsights: vi.fn(),
  getJobTitleSalaryInsights: vi.fn(),
}));

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { readonly children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useAnalyticsQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("builds summary data from analytics endpoints", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    vi.mocked(getCountrySalaryInsights).mockResolvedValue([
      {
        label: "India",
        averageSalary: 100,
        totalSalary: 200,
        employeeCount: 2,
      },
      {
        label: "United States",
        averageSalary: 150,
        totalSalary: 150,
        employeeCount: 1,
      },
    ]);

    vi.mocked(getDepartmentSalaryInsights).mockResolvedValue([
      {
        label: "Engineering",
        averageSalary: 120,
        totalSalary: 240,
        employeeCount: 2,
      },
    ]);

    vi.mocked(getJobTitleSalaryInsights).mockResolvedValue([
      {
        label: "Software Engineer",
        averageSalary: 110,
        totalSalary: 220,
        employeeCount: 2,
      },
    ]);

    const { result } = renderHook(() => useAnalyticsQuery(), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getJobTitleSalaryInsights).toHaveBeenCalledWith("India");

    expect(result.current.data?.summary).toEqual({
      totalEmployees: 3,
      activeEmployees: 3,
      averageSalary: 116.67,
      totalPayroll: 350,
    });
  });

  it("builds summary query with zero employees average as 0", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    vi.mocked(getCountrySalaryInsights).mockResolvedValue([]);

    const { result } = renderHook(() => useAnalyticsSummaryQuery(), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual({
      totalEmployees: 0,
      activeEmployees: 0,
      totalPayroll: 0,
      averageSalary: 0,
    });
  });

  it("loads country and department insights with dedicated hooks", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    vi.mocked(getCountrySalaryInsights).mockResolvedValue([
      {
        label: "India",
        averageSalary: 100,
        totalSalary: 200,
        employeeCount: 2,
      },
    ]);
    vi.mocked(getDepartmentSalaryInsights).mockResolvedValue([
      {
        label: "Engineering",
        averageSalary: 100,
        totalSalary: 200,
        employeeCount: 2,
      },
    ]);

    const { result: countryResult } = renderHook(() => useCountrySalaryInsightsQuery(), {
      wrapper: createWrapper(queryClient),
    });
    const { result: departmentResult } = renderHook(
      () => useDepartmentSalaryInsightsQuery(),
      {
        wrapper: createWrapper(queryClient),
      },
    );

    await waitFor(() => {
      expect(countryResult.current.isSuccess).toBe(true);
      expect(departmentResult.current.isSuccess).toBe(true);
    });

    expect(getCountrySalaryInsights).toHaveBeenCalled();
    expect(getDepartmentSalaryInsights).toHaveBeenCalled();
  });

  it("does not call job title insights API when country is empty", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    renderHook(() => useJobTitleSalaryInsightsQuery(""), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(getJobTitleSalaryInsights).not.toHaveBeenCalled();
    });
  });
});
