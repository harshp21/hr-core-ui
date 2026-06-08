import { z } from "zod";

export const employeeSchema = z.object({
  employeeCode: z.string().trim().min(1, "Employee code is required"),
  firstName: z.string().trim().min(2, "First name is required"),
  lastName: z.string().trim().min(2, "Last name is required"),
  email: z.email("Enter a valid email address"),
  country: z.string().trim().min(1, "Country is required"),
  department: z.string().trim().min(1, "Department is required"),
  jobTitle: z.string().trim().min(1, "Job title is required"),
  salary: z
    .number({
      message: "Salary is required",
    })
    .positive("Salary must be greater than 0"),
  currency: z.string().trim().min(1, "Currency is required"),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT"]),
  dateOfJoining: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    "Invalid date format",
  ),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;