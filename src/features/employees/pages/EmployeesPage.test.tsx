import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EmployeesPage } from "./EmployeesPage";
import {
  useCreateEmployeeMutation,
  useDeleteEmployeeMutation,
  useEmployeesQuery,
  useUpdateEmployeeMutation,
} from "../hooks/use-employees";

vi.mock("../hooks/use-employees", () => ({
  useEmployeesQuery: vi.fn(),
  useCreateEmployeeMutation: vi.fn(),
  useUpdateEmployeeMutation: vi.fn(),
  useDeleteEmployeeMutation: vi.fn(),
}));

vi.mock("../components/EmployeeFilters", () => ({
  EmployeeFiltersSection: ({
    onChange,
    onReset,
  }: {
    onChange: (filters: {
      search: string;
      department: string;
      country: string;
      jobTitle: string;
    }) => void;
    onReset: () => void;
  }) => (
    <div>
      <button
        type="button"
        onClick={() =>
          onChange({
            search: "Jane",
            department: "Engineering",
            country: "India",
            jobTitle: "Software Engineer",
          })
        }
      >
        Apply Filters
      </button>
      <button type="button" onClick={onReset}>
        Reset Filters
      </button>
    </div>
  ),
}));

vi.mock("../components/EmployeeTable", () => ({
  EmployeeTable: ({
    employees,
    page,
    onPageChange,
    onSortChange,
    onEdit,
    onDelete,
  }: {
    employees: Array<{ firstName: string }>;
    page: number;
    onPageChange: (page: number) => void;
    onSortChange: (sort: { sortBy: string; sortOrder: "asc" | "desc" }) => void;
    onEdit: (employee: { id: string }) => void;
    onDelete: (employee: { id: string }) => void;
  }) => (
    <div>
      <div data-testid="current-page">{String(page)}</div>
      <button type="button" onClick={() => onPageChange(2)}>
        Table Go Page 2
      </button>
      <button type="button" onClick={() => onEdit({ id: "emp-1" })}>
        Table Edit
      </button>
      <button type="button" onClick={() => onDelete({ id: "emp-1" })}>
        Table Delete
      </button>
      <button
        type="button"
        onClick={() => onSortChange({ sortBy: "salary", sortOrder: "desc" })}
      >
        Table Sort Salary Desc
      </button>
      <button
        type="button"
        onClick={() => onSortChange({ sortBy: "firstName", sortOrder: "asc" })}
      >
        Table Sort Name Asc
      </button>
      <div data-testid="first-employee-name">{employees[0]?.firstName ?? ""}</div>
    </div>
  ),
}));

vi.mock("../components/EmployeeDialog", () => ({
  EmployeeDialog: ({
    open,
    title,
    onClose,
    onSubmitEmployee,
  }: {
    open: boolean;
    title: string;
    onClose: () => void;
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
  }) =>
    open ? (
      <div>
        <div>{title}</div>
        <button type="button" onClick={onClose}>
          Close {title}
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
              salary: 90000,
              currency: "USD",
              employmentType: "FULL_TIME",
              dateOfJoining: "2024-01-01",
            });
          }}
        >
          Submit {title}
        </button>
      </div>
    ) : null,
}));

vi.mock("../../../components/common/ConfirmDialog", () => ({
  ConfirmDialog: ({
    open,
    onConfirm,
  }: {
    open: boolean;
    onConfirm: () => Promise<void>;
  }) =>
    open ? (
      <button
        type="button"
        onClick={() => {
          void onConfirm();
        }}
      >
        Confirm Delete
      </button>
    ) : null,
}));

const baseQueryData = {
  items: [
    {
      id: "emp-1",
      employeeCode: "EMP001",
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      country: "India",
      department: "Engineering",
      jobTitle: "Software Engineer",
      salary: 90000,
      currency: "USD",
      employmentType: "FULL_TIME" as const,
      dateOfJoining: "2024-01-01",
    },
  ],
  total: 1,
  page: 1,
  pageSize: 10,
};

function setupHookMocks(options?: { isLoading?: boolean; total?: number }) {
  const createMutate = vi.fn().mockResolvedValue(undefined);
  const updateMutate = vi.fn().mockResolvedValue(undefined);
  const deleteMutate = vi.fn().mockResolvedValue(undefined);
  const refetch = vi.fn().mockResolvedValue(undefined);

  vi.mocked(useEmployeesQuery).mockReturnValue({
    isLoading: options?.isLoading ?? false,
    isError: false,
    refetch,
    data: {
      ...baseQueryData,
      total: options?.total ?? baseQueryData.total,
      items: (options?.total ?? baseQueryData.total) > 0 ? baseQueryData.items : [],
    },
  } as unknown as ReturnType<typeof useEmployeesQuery>);

  vi.mocked(useCreateEmployeeMutation).mockReturnValue({
    mutateAsync: createMutate,
  } as unknown as ReturnType<typeof useCreateEmployeeMutation>);

  vi.mocked(useUpdateEmployeeMutation).mockReturnValue({
    mutateAsync: updateMutate,
  } as unknown as ReturnType<typeof useUpdateEmployeeMutation>);

  vi.mocked(useDeleteEmployeeMutation).mockReturnValue({
    mutateAsync: deleteMutate,
  } as unknown as ReturnType<typeof useDeleteEmployeeMutation>);

  return { createMutate, updateMutate, deleteMutate, refetch };
}

describe("EmployeesPage", () => {
  it("renders loading state", () => {
    setupHookMocks({ isLoading: true });

    render(<EmployeesPage />);

    expect(screen.getByText("Total Records:")).toBeInTheDocument();
  });

  it("renders empty state when no employees are returned", () => {
    setupHookMocks({ total: 0 });

    render(<EmployeesPage />);

    expect(screen.getByText("No employees found")).toBeInTheDocument();
  });

  it("runs create, edit, and delete flows", async () => {
    const { createMutate, updateMutate, deleteMutate } = setupHookMocks();

    render(<EmployeesPage />);

    fireEvent.click(screen.getByRole("button", { name: "Add Employee" }));
    fireEvent.click(screen.getByRole("button", { name: "Submit Add Employee" }));

    await waitFor(() => {
      expect(createMutate).toHaveBeenCalledTimes(1);
    });

    fireEvent.click(screen.getByRole("button", { name: "Table Edit" }));
    fireEvent.click(screen.getByRole("button", { name: "Submit Edit Employee" }));

    await waitFor(() => {
      expect(updateMutate).toHaveBeenCalledWith(
        expect.objectContaining({ employeeId: "emp-1" }),
      );
    });

    fireEvent.click(screen.getByRole("button", { name: "Table Delete" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm Delete" }));

    await waitFor(() => {
      expect(deleteMutate).toHaveBeenCalledWith("emp-1");
    });
  });

  it("resets page to 1 when filters change", () => {
    setupHookMocks();

    render(<EmployeesPage />);

    expect(screen.getByTestId("current-page")).toHaveTextContent("1");

    fireEvent.click(screen.getByRole("button", { name: "Table Go Page 2" }));
    expect(screen.getByTestId("current-page")).toHaveTextContent("2");

    fireEvent.click(screen.getByRole("button", { name: "Apply Filters" }));
    expect(screen.getByTestId("current-page")).toHaveTextContent("1");
  });

  it("resets sorting to firstName asc after reset", () => {
    setupHookMocks();

    render(<EmployeesPage />);

    fireEvent.click(screen.getByRole("button", { name: "Table Sort Salary Desc" }));

    expect(vi.mocked(useEmployeesQuery)).toHaveBeenLastCalledWith(
      expect.objectContaining({
        sortBy: "salary",
        sortOrder: "desc",
      }),
    );

    fireEvent.click(screen.getByRole("button", { name: "Reset Filters" }));

    expect(vi.mocked(useEmployeesQuery)).toHaveBeenLastCalledWith(
      expect.objectContaining({
        sortBy: "firstName",
        sortOrder: "asc",
      }),
    );
  });

  it("calls query with name/salary sort and updates rendered records", () => {
    vi.mocked(useEmployeesQuery).mockImplementation((params) => {
      const firstName =
        params.sortBy === "salary" && params.sortOrder === "desc"
          ? "Zara"
          : "Alice";

      return {
        isLoading: false,
        isError: false,
        refetch: vi.fn().mockResolvedValue(undefined),
        data: {
          ...baseQueryData,
          items: [
            {
              ...baseQueryData.items[0],
              firstName,
            },
          ],
        },
      } as unknown as ReturnType<typeof useEmployeesQuery>;
    });

    vi.mocked(useCreateEmployeeMutation).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
    } as unknown as ReturnType<typeof useCreateEmployeeMutation>);

    vi.mocked(useUpdateEmployeeMutation).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
    } as unknown as ReturnType<typeof useUpdateEmployeeMutation>);

    vi.mocked(useDeleteEmployeeMutation).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
    } as unknown as ReturnType<typeof useDeleteEmployeeMutation>);

    render(<EmployeesPage />);

    expect(screen.getByTestId("first-employee-name")).toHaveTextContent("Alice");

    fireEvent.click(screen.getByRole("button", { name: "Table Sort Salary Desc" }));

    expect(vi.mocked(useEmployeesQuery)).toHaveBeenLastCalledWith(
      expect.objectContaining({
        sortBy: "salary",
        sortOrder: "desc",
      }),
    );
    expect(screen.getByTestId("first-employee-name")).toHaveTextContent("Zara");

    fireEvent.click(screen.getByRole("button", { name: "Table Sort Name Asc" }));

    expect(vi.mocked(useEmployeesQuery)).toHaveBeenLastCalledWith(
      expect.objectContaining({
        sortBy: "firstName",
        sortOrder: "asc",
      }),
    );
    expect(screen.getByTestId("first-employee-name")).toHaveTextContent("Alice");
  });

  it("resets page to 1 when sorting changes", () => {
    setupHookMocks();

    render(<EmployeesPage />);

    fireEvent.click(screen.getByRole("button", { name: "Table Go Page 2" }));
    expect(screen.getByTestId("current-page")).toHaveTextContent("2");

    fireEvent.click(screen.getByRole("button", { name: "Table Sort Salary Desc" }));
    expect(screen.getByTestId("current-page")).toHaveTextContent("1");
  });

  it("shows empty state when sorted response has no records", () => {
    vi.mocked(useEmployeesQuery).mockImplementation((params) => {
      const hasRecords = !(params.sortBy === "salary" && params.sortOrder === "desc");

      return {
        isLoading: false,
        isError: false,
        refetch: vi.fn().mockResolvedValue(undefined),
        data: {
          ...baseQueryData,
          total: hasRecords ? 1 : 0,
          items: hasRecords ? baseQueryData.items : [],
        },
      } as unknown as ReturnType<typeof useEmployeesQuery>;
    });

    vi.mocked(useCreateEmployeeMutation).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
    } as unknown as ReturnType<typeof useCreateEmployeeMutation>);
    vi.mocked(useUpdateEmployeeMutation).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
    } as unknown as ReturnType<typeof useUpdateEmployeeMutation>);
    vi.mocked(useDeleteEmployeeMutation).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
    } as unknown as ReturnType<typeof useDeleteEmployeeMutation>);

    render(<EmployeesPage />);

    expect(screen.queryByText("No employees found")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Table Sort Salary Desc" }));

    expect(screen.getByText("No employees found")).toBeInTheDocument();
  });

  it("shows retry UI when query fails and calls refetch", async () => {
    const { refetch } = setupHookMocks();

    vi.mocked(useEmployeesQuery).mockReturnValue({
      isLoading: false,
      isError: true,
      refetch,
      data: undefined,
    } as unknown as ReturnType<typeof useEmployeesQuery>);

    render(<EmployeesPage />);

    expect(screen.getByText("Unable to load employees")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));

    await waitFor(() => {
      expect(refetch).toHaveBeenCalledTimes(1);
    });
  });
});
