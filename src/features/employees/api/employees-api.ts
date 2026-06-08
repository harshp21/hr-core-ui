import { api } from "@api/axios";
import { roundToTwo } from "@utils/number";
import { isSortableEmployeeField } from "../constants";
import type {
  Employee,
  EmployeeListParams,
  PaginatedEmployees,
  UpsertEmployeeInput,
} from "../types";

interface ApiEnvelope<T> {
  readonly success?: boolean;
  readonly message?: string;
  readonly response?: T;
}

interface RawEmployee {
  readonly id?: string;
  readonly employeeCode?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly email?: string;
  readonly country?: string;
  readonly department?: string;
  readonly jobTitle?: string;
  readonly salary?: number | string;
  readonly currency?: string;
  readonly employmentType?: Employee["employmentType"];
  readonly dateOfJoining?: string;
}

interface RawPaginatedEmployees {
  readonly items?: readonly RawEmployee[];
  readonly data?: readonly RawEmployee[];
  readonly total?: number;
  readonly totalCount?: number;
  readonly page?: number;
  readonly pageSize?: number;
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

function normalizeEmployee(raw: RawEmployee): Employee {
  return {
    id: raw.id ?? "",
    employeeCode: raw.employeeCode ?? "",
    firstName: raw.firstName ?? "",
    lastName: raw.lastName ?? "",
    email: raw.email ?? "",
    country: raw.country ?? "",
    department: raw.department ?? "",
    jobTitle: raw.jobTitle ?? "",
    salary: roundToTwo(Number(raw.salary ?? 0)),
    currency: raw.currency ?? "",
    employmentType: raw.employmentType ?? "FULL_TIME",
    dateOfJoining: raw.dateOfJoining ?? "",
  };
}

export async function listEmployees(
  params: EmployeeListParams,
): Promise<PaginatedEmployees> {
  const requestedSortBy = params.sortBy as string | undefined;
  const normalizedSortBy =
    requestedSortBy && isSortableEmployeeField(requestedSortBy)
      ? requestedSortBy
      : "firstName";

  const response = await api.get<
    RawPaginatedEmployees | ApiEnvelope<RawPaginatedEmployees>
  >(
    "/api/v1/employees",
    {
      params: {
        page: params.page,
        pageSize: params.pageSize,
        search: params.search,
        country: params.country,
        department: params.department,
        jobTitle: params.jobTitle,
        sortBy: normalizedSortBy,
        sortOrder: params.sortOrder ?? "asc",
      },
    },
  );

  const payload = extractResponse(response.data);

  return {
    items: (payload.items ?? payload.data ?? []).map(normalizeEmployee),
    total: payload.total ?? payload.totalCount ?? 0,
    page: payload.page ?? params.page,
    pageSize: payload.pageSize ?? params.pageSize,
  };
}

export async function getEmployeeById(employeeId: string): Promise<Employee> {
  const response = await api.get<RawEmployee | ApiEnvelope<RawEmployee>>(
    `/api/v1/employees/${employeeId}`,
  );
  return normalizeEmployee(extractResponse(response.data));
}

export async function createEmployee(
  input: UpsertEmployeeInput,
): Promise<Employee> {
  const response = await api.post<RawEmployee | ApiEnvelope<RawEmployee>>(
    "/api/v1/employees",
    input,
  );
  return normalizeEmployee(extractResponse(response.data));
}

export async function updateEmployee(
  employeeId: string,
  input: UpsertEmployeeInput,
): Promise<Employee> {
  const response = await api.put<RawEmployee | ApiEnvelope<RawEmployee>>(
    `/api/v1/employees/${employeeId}`,
    input,
  );
  return normalizeEmployee(extractResponse(response.data));
}

export async function deleteEmployee(employeeId: string): Promise<void> {
  await api.delete(`/api/v1/employees/${employeeId}`);
}