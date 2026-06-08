import { useQuery } from "@tanstack/react-query";
import { roundToTwo } from "@utils/number";
import {
  getCountrySalaryInsights,
  getDepartmentSalaryInsights,
  getJobTitleSalaryInsights,
} from "../api/analytics-api";
import type { AnalyticsData } from "../types";

export function useAnalyticsQuery() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: async (): Promise<AnalyticsData> => {
      const [byCountry, byDepartment, byJobTitle] = await Promise.all([
        getCountrySalaryInsights(),
        getDepartmentSalaryInsights(),
        getJobTitleSalaryInsights("India"),
      ]);

      const totalEmployees = byCountry.reduce(
        (sum, country) => sum + country.employeeCount,
        0,
      );
      const totalPayroll = byCountry.reduce(
        (sum, country) => sum + country.totalSalary,
        0,
      );

      return {
        summary: {
          totalEmployees,
          activeEmployees: totalEmployees,
          averageSalary:
            totalEmployees === 0 ? 0 : roundToTwo(totalPayroll / totalEmployees),
          totalPayroll: roundToTwo(totalPayroll),
        },
        byCountry: [...byCountry],
        byDepartment: [...byDepartment],
        byJobTitle: [...byJobTitle],
      };
    },
  });
}

export function useAnalyticsSummaryQuery() {
  return useQuery({
    queryKey: ["analytics", "summary"],
    queryFn: async () => {
      const countries = await getCountrySalaryInsights();
      const totalEmployees = countries.reduce(
        (sum, country) => sum + country.employeeCount,
        0,
      );
      const totalPayroll = countries.reduce(
        (sum, country) => sum + country.totalSalary,
        0,
      );

      return {
        totalEmployees,
        activeEmployees: totalEmployees,
        totalPayroll: roundToTwo(totalPayroll),
        averageSalary:
          totalEmployees === 0 ? 0 : roundToTwo(totalPayroll / totalEmployees),
      };
    },
  });
}

export function useCountrySalaryInsightsQuery() {
  return useQuery({
    queryKey: ["analytics", "countries"],
    queryFn: getCountrySalaryInsights,
  });
}

export function useDepartmentSalaryInsightsQuery() {
  return useQuery({
    queryKey: ["analytics", "departments"],
    queryFn: getDepartmentSalaryInsights,
  });
}

export function useJobTitleSalaryInsightsQuery(country: string) {
  return useQuery({
    queryKey: ["analytics", "job-titles", country],
    queryFn: () => getJobTitleSalaryInsights(country),
    enabled: !!country,
  });
}