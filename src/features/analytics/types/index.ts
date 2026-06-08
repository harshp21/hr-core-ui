export type SalaryInsight = {
  label: string;
  averageSalary: number;
  totalSalary: number;
  employeeCount: number;
  minimumSalary?: number;
  maximumSalary?: number;
};

export type AnalyticsSummary = {
  totalEmployees: number;
  activeEmployees: number;
  averageSalary: number;
  totalPayroll: number;
};

export type AnalyticsData = {
  summary: AnalyticsSummary;
  byCountry: SalaryInsight[];
  byDepartment: SalaryInsight[];
  byJobTitle: SalaryInsight[];
};
