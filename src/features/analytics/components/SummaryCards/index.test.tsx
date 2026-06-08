import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SummaryCards } from ".";

describe("SummaryCards", () => {
  it("renders all KPI labels and formatted values", () => {
    render(
      <SummaryCards
        summary={{
          totalEmployees: 150,
          activeEmployees: 145,
          averageSalary: 62500.5,
          totalPayroll: 9375075,
        }}
      />,
    );

    expect(screen.getByText("Total Employees")).toBeInTheDocument();
    expect(screen.getByText("Active Employees")).toBeInTheDocument();
    expect(screen.getByText("Average Salary")).toBeInTheDocument();
    expect(screen.getByText("Total Payroll")).toBeInTheDocument();

    expect(screen.getByText("150")).toBeInTheDocument();
    expect(screen.getByText("145")).toBeInTheDocument();
    expect(screen.getByText("$62,500.50")).toBeInTheDocument();
    expect(screen.getByText("$9,375,075.00")).toBeInTheDocument();
  });
});
