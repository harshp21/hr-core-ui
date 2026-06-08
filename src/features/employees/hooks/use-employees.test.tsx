import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createEmployee,
  deleteEmployee,
  listEmployees,
  updateEmployee,
} from "../api/employees-api";
import {
  useCreateEmployeeMutation,
  useDeleteEmployeeMutation,
  useEmployeesQuery,
  useUpdateEmployeeMutation,
} from "./use-employees";
import type { PaginatedEmployees, UpsertEmployeeInput } from "../types";

vi.mock("../api/employees-api", () => ({
  listEmployees: vi.fn(),
  createEmployee: vi.fn(),
  updateEmployee: vi.fn(),
  deleteEmployee: vi.fn(),
}));

const baseInput: UpsertEmployeeInput = {
  employeeCode: "EMP001",
  firstName: "Jane",
  lastName: "Doe",
  email: "jane.doe@example.com",
  country: "India",
  department: "Engineering",
  jobTitle: "Software Engineer",
  salary: 85000,
  currency: "USD",
  employmentType: "FULL_TIME",
  dateOfJoining: "2024-01-01",
};

function createDeferred<T>() {
  let resolve: (value: T) => void = () => {};
  const promise = new Promise<T>((resolver) => {
    resolve = resolver;
  });

  return { promise, resolve };
}

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { readonly children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("use-employees hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads employees with the expected list params", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    const params = {
      search: "Jane",
      department: "Engineering",
      country: "India",
      jobTitle: "Software Engineer",
      page: 1,
      pageSize: 10,
    };

    vi.mocked(listEmployees).mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      pageSize: 10,
    });

    const { result } = renderHook(() => useEmployeesQuery(params), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(listEmployees).toHaveBeenCalledWith(params);
  });

  it("invalidates employee and analytics queries after create", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        mutations: { retry: false },
      },
    });
    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    vi.mocked(createEmployee).mockResolvedValue({
      id: "emp-1",
      ...baseInput,
    });

    const { result } = renderHook(() => useCreateEmployeeMutation(), {
      wrapper: createWrapper(queryClient),
    });

    await result.current.mutateAsync(baseInput);

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["employees"],
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["analytics"],
    });
  });

  it("invalidates employee and analytics queries after update", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        mutations: { retry: false },
      },
    });
    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    vi.mocked(updateEmployee).mockResolvedValue({
      id: "emp-1",
      ...baseInput,
    });

    const { result } = renderHook(() => useUpdateEmployeeMutation(), {
      wrapper: createWrapper(queryClient),
    });

    await result.current.mutateAsync({
      employeeId: "emp-1",
      input: baseInput,
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["employees"],
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["analytics"],
    });
  });

  it("invalidates employee and analytics queries after delete", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        mutations: { retry: false },
      },
    });
    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    vi.mocked(deleteEmployee).mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteEmployeeMutation(), {
      wrapper: createWrapper(queryClient),
    });

    await result.current.mutateAsync("emp-1");

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["employees"],
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["analytics"],
    });
  });

  it("keeps previous list data while fetching next sorted result", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    const sortedListDeferred = createDeferred<PaginatedEmployees>();
    let requestedSortedList = false;

    vi.mocked(listEmployees).mockImplementation(async (params) => {
      if (params.sortBy === "salary") {
        requestedSortedList = true;
        return sortedListDeferred.promise;
      }

      return {
        items: [
          {
            id: "emp-1",
            ...baseInput,
          },
        ],
        total: 1,
        page: 1,
        pageSize: 10,
      };
    });

    const initialProps: { sortBy: "firstName" | "salary" } = {
      sortBy: "firstName",
    };

    const { result, rerender } = renderHook(
      ({ sortBy }: { sortBy: "firstName" | "salary" }) =>
        useEmployeesQuery({
          search: "",
          department: "",
          country: "",
          jobTitle: "",
          page: 1,
          pageSize: 10,
          sortBy,
          sortOrder: "asc",
        }),
      {
        initialProps,
        wrapper: createWrapper(queryClient),
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.items[0]?.id).toBe("emp-1");

    rerender({ sortBy: "salary" });

    await waitFor(() => {
      expect(result.current.isFetching).toBe(true);
    });
    expect(result.current.data?.items[0]?.id).toBe("emp-1");

    expect(requestedSortedList).toBe(true);

    sortedListDeferred.resolve({
      items: [
        {
          id: "emp-2",
          ...baseInput,
          firstName: "Sorted",
        },
      ],
      total: 1,
      page: 1,
      pageSize: 10,
    });

    await waitFor(() => {
      expect(result.current.data?.items[0]?.id).toBe("emp-2");
    });
  });
});
