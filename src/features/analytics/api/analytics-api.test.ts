import { describe, expect, it, vi } from "vitest";
import { api } from "@api/axios";
import {
  getAnalyticsSummary,
  getCountrySalaryInsights,
  getJobTitleSalaryInsights,
} from "./analytics-api";

vi.mock("@api/axios", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("analytics-api adapters", () => {
  it("normalizes country insights from alternate field names", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: [
        {
          country: "India",
          avgSalary: 1234.567,
          count: 2,
          minimumSalary: 1000,
          maximumSalary: 1500,
        },
      ],
    });

    const result = await getCountrySalaryInsights();

    expect(result).toEqual([
      {
        label: "India",
        averageSalary: 1234.57,
        totalSalary: 2469.14,
        employeeCount: 2,
        minimumSalary: 1000,
        maximumSalary: 1500,
      },
    ]);
  });

  it("passes country param for job title insights", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: [] });

    await getJobTitleSalaryInsights("India");

    expect(api.get).toHaveBeenCalledWith("/api/v1/analytics/job-titles", {
      params: { country: "India" },
    });
  });

  it("builds analytics summary from normalized country data", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: {
        response: [
          { label: "India", totalSalary: 200, employeeCount: 2, averageSalary: 100 },
          { label: "US", totalSalary: 100, employeeCount: 1, averageSalary: 100 },
        ],
      },
    });

    const result = await getAnalyticsSummary();

    expect(result).toEqual({
      totalEmployees: 3,
      activeEmployees: 3,
      totalPayroll: 300,
      averageSalary: 100,
    });
  });

  it("maps minSalary/maxSalary aliases and falls back label to name", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: [
        {
          name: "France",
          avgSalary: 5000.123,
          count: 3,
          minSalary: 4500.999,
          maxSalary: 5500.456,
        },
      ],
    });

    const result = await getCountrySalaryInsights();

    expect(result).toEqual([
      {
        label: "France",
        averageSalary: 5000.12,
        totalSalary: 15000.36,
        employeeCount: 3,
        minimumSalary: 4501,
        maximumSalary: 5500.46,
      },
    ]);
  });

  it("returns zero summary for empty country response", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: {
        response: [],
      },
    });

    const result = await getAnalyticsSummary();

    expect(result).toEqual({
      totalEmployees: 0,
      activeEmployees: 0,
      totalPayroll: 0,
      averageSalary: 0,
    });
  });

  it("rounds summary values for fractional totals", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: {
        response: [
          { label: "UK", totalSalary: 333.335, employeeCount: 3, averageSalary: 111.11 },
          { label: "AU", totalSalary: 200.005, employeeCount: 2, averageSalary: 100.0 },
        ],
      },
    });

    const result = await getAnalyticsSummary();

    expect(result).toEqual({
      totalEmployees: 5,
      activeEmployees: 5,
      totalPayroll: 533.35,
      averageSalary: 106.67,
    });
  });
});
