export const EMPLOYEE_PAGE_SIZE = 10;

export const DEPARTMENTS = [
  "Engineering",
  "HR",
  "Finance",
  "Marketing",
  "Sales",
] as const;

export const COUNTRIES = [
   "India",
  "United States",
  "United Kingdom",
  "Germany",
  "Canada",
  "Australia",
] as const;

export const JOB_TITLES = [
  "Software Engineer",
  "Senior Software Engineer",
  "Engineering Manager",
  "HR Manager",
  "Financial Analyst",
  "Marketing Specialist",
  "Sales Executive",
] as const;

export const EMPLOYMENT_TYPES = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
] as const;

export const SORTABLE_EMPLOYEE_FIELDS = [
  "firstName",
  "salary",
] as const;

export function isSortableEmployeeField(
  value: string,
): value is (typeof SORTABLE_EMPLOYEE_FIELDS)[number] {
  return (SORTABLE_EMPLOYEE_FIELDS as readonly string[]).includes(value);
}
