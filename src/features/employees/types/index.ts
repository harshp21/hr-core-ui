import { SORTABLE_EMPLOYEE_FIELDS } from "../constants";

export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT";
export type SortableEmployeeField = (typeof SORTABLE_EMPLOYEE_FIELDS)[number];

export interface Employee {
  readonly id: string;
  readonly employeeCode: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly country: string;
  readonly department: string;
  readonly jobTitle: string;
  readonly salary: number;
  readonly currency: string;
  readonly employmentType: EmploymentType;
  readonly dateOfJoining: string;
}

export interface EmployeeFilters {
  readonly search: string;
  readonly department: string;
  readonly country: string;
  readonly jobTitle: string;
}

export interface EmployeeListParams extends EmployeeFilters {
  readonly page: number;
  readonly pageSize: number;
  readonly sortBy?: SortableEmployeeField;
  readonly sortOrder?: "asc" | "desc";
}

export interface PaginatedEmployees {
  readonly items: readonly Employee[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}

export type UpsertEmployeeInput = Omit<Employee, "id">;