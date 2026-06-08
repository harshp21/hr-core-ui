import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EmployeeForm } from ".";

const emptyInitialValues = {
  employeeCode: "",
  firstName: "",
  lastName: "",
  email: "",
  country: "",
  department: "",
  jobTitle: "",
  salary: 0,
  currency: "",
  employmentType: "" as "FULL_TIME" | "PART_TIME" | "CONTRACT",
  dateOfJoining: "",
};

describe("EmployeeForm", () => {
  it("shows a date picker input for date of joining", () => {
    render(
      <EmployeeForm
        initialValues={emptyInitialValues}
        onSubmitEmployee={vi.fn().mockResolvedValue(undefined)}
        onCancel={vi.fn()}
        submitLabel="Create Employee"
      />,
    );

    const dateInput = screen.getByLabelText(/date of joining/i);
    expect(dateInput).toHaveAttribute("type", "date");
  });

  it("disables employee code and email fields in edit mode", () => {
    render(
      <EmployeeForm
        initialValues={emptyInitialValues}
        isEditMode
        onSubmitEmployee={vi.fn().mockResolvedValue(undefined)}
        onCancel={vi.fn()}
        submitLabel="Save Changes"
      />,
    );

    expect(screen.getByLabelText(/employee code/i)).toBeDisabled();
    expect(screen.getByLabelText(/email/i)).toBeDisabled();
  });

  it("calls onCancel when cancel is clicked", () => {
    const onCancel = vi.fn();

    render(
      <EmployeeForm
        initialValues={emptyInitialValues}
        onSubmitEmployee={vi.fn().mockResolvedValue(undefined)}
        onCancel={onCancel}
        submitLabel="Create Employee"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("shows validation errors and does not submit invalid form", async () => {
    const onSubmitEmployee = vi.fn().mockResolvedValue(undefined);

    render(
      <EmployeeForm
        initialValues={emptyInitialValues}
        onSubmitEmployee={onSubmitEmployee}
        onCancel={vi.fn()}
        submitLabel="Create Employee"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Create Employee" }));

    await waitFor(() => {
      expect(screen.getByText("Employee code is required")).toBeInTheDocument();
    });

    expect(onSubmitEmployee).not.toHaveBeenCalled();
  });
});
