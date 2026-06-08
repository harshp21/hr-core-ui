import { api } from "@api/axios";
import { roundToTwo } from "@utils/number";
import type { AnalyticsSummary, SalaryInsight } from "../types";

interface ApiEnvelope<T> {
  readonly success?: boolean;
  readonly message?: string;
  readonly response?: T;
}

interface RawSalaryInsight {
  readonly label?: string;
  readonly country?: string;
  readonly department?: string;
  readonly jobTitle?: string;
  readonly name?: string;
  readonly averageSalary?: number;
  readonly avgSalary?: number;
  readonly totalSalary?: number;
  readonly employeeCount?: number;
  readonly count?: number;
  readonly minimumSalary?: number;
  readonly minSalary?: number;
  readonly maximumSalary?: number;
  readonly maxSalary?: number;
}

function extractResponse<T>(payload: T | ApiEnvelope<T>): T {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "response" in payload
  ) {
    const wrapped = payload as ApiEnvelope<T>;
    if (wrapped.response !== undefined) {
      return wrapped.response;
    }
  }

  return payload as T;
}

function normalizeSalaryInsight(raw: RawSalaryInsight): SalaryInsight {
  const employeeCount = raw.employeeCount ?? raw.count ?? 0;
  const averageSalary = roundToTwo(raw.averageSalary ?? raw.avgSalary ?? 0);
  const totalSalary = roundToTwo(raw.totalSalary ?? averageSalary * employeeCount);
  const minimumSalary = raw.minimumSalary ?? raw.minSalary;
  const maximumSalary = raw.maximumSalary ?? raw.maxSalary;

  return {
    label:
      raw.label ??
      raw.country ??
      raw.department ??
      raw.jobTitle ??
      raw.name ??
      "Unknown",
    averageSalary,
    totalSalary,
    employeeCount,
    minimumSalary: minimumSalary === undefined ? undefined : roundToTwo(minimumSalary),
    maximumSalary: maximumSalary === undefined ? undefined : roundToTwo(maximumSalary),
  };
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
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
}

export async function getCountrySalaryInsights(): Promise<
  readonly SalaryInsight[]
> {
  const response = await api.get<
    readonly RawSalaryInsight[] | ApiEnvelope<readonly RawSalaryInsight[]>
  >(
    "/api/v1/analytics/countries",
  );
  return extractResponse(response.data).map(normalizeSalaryInsight);
}

export async function getDepartmentSalaryInsights(): Promise<
  readonly SalaryInsight[]
> {
  const response = await api.get<
    readonly RawSalaryInsight[] | ApiEnvelope<readonly RawSalaryInsight[]>
  >(
    "/api/v1/analytics/departments",
  );
  return extractResponse(response.data).map(normalizeSalaryInsight);
}

export async function getJobTitleSalaryInsights(
  country: string,
): Promise<readonly SalaryInsight[]> {
  const response = await api.get<
    readonly RawSalaryInsight[] | ApiEnvelope<readonly RawSalaryInsight[]>
  >(
    "/api/v1/analytics/job-titles",
    {
      params: { country },
    },
  );
  return extractResponse(response.data).map(normalizeSalaryInsight);
}