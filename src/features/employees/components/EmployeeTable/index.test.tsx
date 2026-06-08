import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EmployeeTable } from ".";

vi.mock("@mui/x-data-grid", () => ({
  DataGrid: vi.fn(() => <div data-testid="data-grid" />),
  GridActionsCellItem: () => null,
}));

const { DataGrid } = await import("@mui/x-data-grid");
const dataGridMock = vi.mocked(DataGrid);

function getDataGridProps() {
  const dataGridProps = dataGridMock.mock.lastCall?.[0];

  if (!dataGridProps) {
    throw new Error("Expected DataGrid props to be defined");
  }

  return dataGridProps;
}

const employees = [
  {
    id: "emp-1",
    employeeCode: "EMP001",
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
    country: "India",
    department: "Engineering",
    jobTitle: "Software Engineer",
    salary: 80000,
    currency: "USD",
    employmentType: "FULL_TIME" as const,
    dateOfJoining: "2024-01-01",
  },
];

describe("EmployeeTable", () => {
  it("only allows sorting by firstName and salary", () => {
    const onSortChange = vi.fn();

    render(
      <EmployeeTable
        employees={employees}
        page={1}
        pageSize={10}
        total={20}
        sortBy="salary"
        sortOrder="desc"
        onPageChange={vi.fn()}
        onSortChange={onSortChange}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    const dataGridProps = getDataGridProps();

    dataGridProps.onSortModelChange?.([{ field: "firstName", sort: "asc" }], {} as never);
    dataGridProps.onSortModelChange?.([{ field: "salary", sort: "desc" }], {} as never);

    expect(onSortChange).toHaveBeenNthCalledWith(1, {
      sortBy: "firstName",
      sortOrder: "asc",
    });
    expect(onSortChange).toHaveBeenNthCalledWith(2, {
      sortBy: "salary",
      sortOrder: "desc",
    });
  });

  it("handles repeated sort toggles for supported columns", () => {
    const onSortChange = vi.fn();

    render(
      <EmployeeTable
        employees={employees}
        page={1}
        pageSize={10}
        total={20}
        sortBy="salary"
        sortOrder="asc"
        onPageChange={vi.fn()}
        onSortChange={onSortChange}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    const dataGridProps = getDataGridProps();

    dataGridProps.onSortModelChange?.([{ field: "salary", sort: "asc" }], {} as never);
    dataGridProps.onSortModelChange?.([{ field: "salary", sort: "desc" }], {} as never);

    expect(onSortChange).toHaveBeenNthCalledWith(1, {
      sortBy: "salary",
      sortOrder: "asc",
    });
    expect(onSortChange).toHaveBeenNthCalledWith(2, {
      sortBy: "salary",
      sortOrder: "desc",
    });
  });

  it("keeps current sort unchanged when a non-supported field is requested", () => {
    const onSortChange = vi.fn();

    render(
      <EmployeeTable
        employees={employees}
        page={1}
        pageSize={10}
        total={20}
        sortBy="salary"
        sortOrder="desc"
        onPageChange={vi.fn()}
        onSortChange={onSortChange}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    const dataGridProps = getDataGridProps();

    dataGridProps.onSortModelChange?.([{ field: "employmentType", sort: "asc" }], {} as never);

    expect(onSortChange).toHaveBeenCalledWith({
      sortBy: "salary",
      sortOrder: "desc",
    });
  });

  it("falls back to default sort when sort model is cleared", () => {
    const onSortChange = vi.fn();

    render(
      <EmployeeTable
        employees={employees}
        page={1}
        pageSize={10}
        total={20}
        sortBy="firstName"
        sortOrder="asc"
        onPageChange={vi.fn()}
        onSortChange={onSortChange}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    const dataGridProps = getDataGridProps();

    dataGridProps.onSortModelChange?.([], {} as never);

    expect(onSortChange).toHaveBeenCalledWith({
      sortBy: "firstName",
      sortOrder: "asc",
    });
  });

  it("disables sorting for all non-supported columns", () => {
    render(
      <EmployeeTable
        employees={employees}
        page={1}
        pageSize={10}
        total={20}
        sortBy="firstName"
        sortOrder="asc"
        onPageChange={vi.fn()}
        onSortChange={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    const dataGridProps = getDataGridProps();

    const nonSortableFields = [
      "email",
      "department",
      "jobTitle",
      "country",
      "employmentType",
      "actions",
    ];

    nonSortableFields.forEach((field) => {
      const column = dataGridProps.columns.find(
        (item: { field: string }) => item.field === field,
      );

      if (!column) {
        throw new Error(`Expected ${field} column to be defined`);
      }

      expect(column.sortable).toBe(false);
    });

    const typeColumn = dataGridProps.columns.find(
      (column: { field: string }) => column.field === "employmentType",
    );

    if (!typeColumn) {
      throw new Error("Expected employmentType column to be defined");
    }

    expect(typeColumn.filterable).toBe(false);
  });

  it("disables previous on first page and advances on next", () => {
    const onPageChange = vi.fn();

    render(
      <EmployeeTable
        employees={employees}
        page={1}
        pageSize={10}
        total={20}
        sortBy="firstName"
        sortOrder="asc"
        onPageChange={onPageChange}
        onSortChange={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("disables next on last page and allows previous", () => {
    const onPageChange = vi.fn();

    render(
      <EmployeeTable
        employees={employees}
        page={2}
        pageSize={10}
        total={20}
        sortBy="firstName"
        sortOrder="asc"
        onPageChange={onPageChange}
        onSortChange={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Previous" }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("does not render pagination actions when there are no records", () => {
    render(
      <EmployeeTable
        employees={[]}
        page={1}
        pageSize={10}
        total={0}
        sortBy="firstName"
        sortOrder="asc"
        onPageChange={vi.fn()}
        onSortChange={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByTestId("data-grid")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Previous" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument();
  });
});
