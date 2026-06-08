import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EmployeeDialog } from ".";

vi.mock("../EmployeeForm", () => ({
  EmployeeForm: ({
    onCancel,
    onSubmitEmployee,
  }: {
    onCancel: () => void;
    onSubmitEmployee: (values: {
      employeeCode: string;
      firstName: string;
      lastName: string;
      email: string;
      country: string;
      department: string;
      jobTitle: string;
      salary: number;
      currency: string;
      employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT";
      dateOfJoining: string;
    }) => Promise<void>;
  }) => (
    <div>
      <button type="button" onClick={onCancel}>
        Mock Cancel
      </button>
      <button
        type="button"
        onClick={() => {
          void onSubmitEmployee({
            employeeCode: "EMP001",
            firstName: "Jane",
            lastName: "Doe",
            email: "jane@example.com",
            country: "India",
            department: "Engineering",
            jobTitle: "Software Engineer",
            salary: 80000,
            currency: "USD",
            employmentType: "FULL_TIME",
            dateOfJoining: "2024-01-01",
          });
        }}
      >
        Mock Submit
      </button>
    </div>
  ),
}));

describe("EmployeeDialog", () => {
  it("renders provided title", () => {
    render(
      <EmployeeDialog
        open
        title="Add Employee"
        submitLabel="Create Employee"
        initialValues={{}}
        onClose={vi.fn()}
        onSubmitEmployee={vi.fn().mockResolvedValue(undefined)}
      />,
    );

    expect(screen.getByText("Add Employee")).toBeInTheDocument();
  });

  it("wires cancel to onClose", () => {
    const onClose = vi.fn();

    render(
      <EmployeeDialog
        open
        title="Add Employee"
        submitLabel="Create Employee"
        initialValues={{}}
        onClose={onClose}
        onSubmitEmployee={vi.fn().mockResolvedValue(undefined)}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Mock Cancel" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("forwards submit handler to form", () => {
    const onSubmitEmployee = vi.fn().mockResolvedValue(undefined);

    render(
      <EmployeeDialog
        open
        title="Add Employee"
        submitLabel="Create Employee"
        initialValues={{}}
        onClose={vi.fn()}
        onSubmitEmployee={onSubmitEmployee}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Mock Submit" }));

    expect(onSubmitEmployee).toHaveBeenCalledWith(
      expect.objectContaining({
        employeeCode: "EMP001",
        firstName: "Jane",
      }),
    );
  });
});
