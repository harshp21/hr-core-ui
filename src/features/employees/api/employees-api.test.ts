import { describe, expect, it, vi } from "vitest";
import { api } from "@api/axios";
import {
  createEmployee,
  deleteEmployee,
  getEmployeeById,
  listEmployees,
  updateEmployee,
} from "./employees-api";
import type { EmployeeListParams } from "../types";

vi.mock("@api/axios", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("employees-api adapters", () => {
  it("normalizes list response from envelope + data/totalCount shape", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        response: {
          data: [
            {
              id: "emp-1",
              employeeCode: "EMP001",
              firstName: "Jane",
              lastName: "Doe",
              email: "jane@example.com",
              country: "India",
              department: "Engineering",
              jobTitle: "Software Engineer",
              salary: "12345.678",
              currency: "USD",
              dateOfJoining: "2024-01-01",
            },
          ],
          totalCount: 1,
          page: 2,
          pageSize: 5,
        },
      },
    });

    const result = await listEmployees({
      search: "",
      department: "",
      country: "",
      jobTitle: "",
      page: 2,
      pageSize: 5,
      sortBy: "firstName",
      sortOrder: "asc",
    });

    expect(api.get).toHaveBeenCalledWith("/api/v1/employees", {
      params: {
        page: 2,
        pageSize: 5,
        search: "",
        country: "",
        department: "",
        jobTitle: "",
        sortBy: "firstName",
        sortOrder: "asc",
      },
    });

    expect(result.total).toBe(1);
    expect(result.page).toBe(2);
    expect(result.pageSize).toBe(5);
    expect(result.items[0]).toEqual(
      expect.objectContaining({
        id: "emp-1",
        salary: 12345.68,
        employmentType: "FULL_TIME",
      }),
    );
  });

  it("normalizes create response when backend wraps payload", async () => {
    vi.mocked(api.post).mockResolvedValue({
      data: {
        response: {
          id: "emp-2",
          employeeCode: "EMP002",
          firstName: "John",
          lastName: "Smith",
          email: "john@example.com",
          country: "United States",
          department: "HR",
          jobTitle: "HR Manager",
          salary: 50000,
          currency: "USD",
          employmentType: "PART_TIME",
          dateOfJoining: "2024-02-01",
        },
      },
    });

    const result = await createEmployee({
      employeeCode: "EMP002",
      firstName: "John",
      lastName: "Smith",
      email: "john@example.com",
      country: "United States",
      department: "HR",
      jobTitle: "HR Manager",
      salary: 50000,
      currency: "USD",
      employmentType: "PART_TIME",
      dateOfJoining: "2024-02-01",
    });

    expect(result).toEqual(
      expect.objectContaining({
        id: "emp-2",
        employmentType: "PART_TIME",
      }),
    );
  });

  it("uses default sortBy and sortOrder when omitted", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        response: {
          data: [],
          total: 0,
        },
      },
    });

    await listEmployees({
      search: "",
      department: "",
      country: "",
      jobTitle: "",
      page: 1,
      pageSize: 10,
    });

    expect(api.get).toHaveBeenCalledWith("/api/v1/employees", {
      params: {
        page: 1,
        pageSize: 10,
        search: "",
        country: "",
        department: "",
        jobTitle: "",
        sortBy: "firstName",
        sortOrder: "asc",
      },
    });
  });

  it("normalizes non-envelope payload and falls back page/pageSize from params", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        items: [
          {
            id: "emp-10",
            firstName: "Noah",
            salary: "9000.129",
          },
        ],
        total: 12,
      },
    });

    const result = await listEmployees({
      search: "",
      department: "",
      country: "",
      jobTitle: "",
      page: 3,
      pageSize: 25,
      sortBy: "salary",
      sortOrder: "desc",
    });

    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toEqual(
      expect.objectContaining({
        id: "emp-10",
        salary: 9000.13,
      }),
    );
    expect(result.total).toBe(12);
    expect(result.page).toBe(3);
    expect(result.pageSize).toBe(25);
  });

  it("prefers items over data when both keys are present", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        response: {
          items: [{ id: "items-1", firstName: "Items" }],
          data: [{ id: "data-1", firstName: "Data" }],
          total: 1,
          page: 1,
          pageSize: 10,
        },
      },
    });

    const result = await listEmployees({
      search: "",
      department: "",
      country: "",
      jobTitle: "",
      page: 1,
      pageSize: 10,
      sortBy: "firstName",
      sortOrder: "asc",
    });

    expect(result.items).toHaveLength(1);
    expect(result.items[0].id).toBe("items-1");
  });

  it("defaults total to 0 when total and totalCount are missing", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        response: {
          data: [{ id: "emp-1", firstName: "Jane" }],
          page: 1,
          pageSize: 10,
        },
      },
    });

    const result = await listEmployees({
      search: "",
      department: "",
      country: "",
      jobTitle: "",
      page: 1,
      pageSize: 10,
      sortBy: "firstName",
      sortOrder: "asc",
    });

    expect(result.total).toBe(0);
  });

  it("sanitizes unsupported sortBy values to firstName", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        response: {
          data: [],
          total: 0,
          page: 1,
          pageSize: 10,
        },
      },
    });

    const unsafeParams = {
      search: "",
      department: "",
      country: "",
      jobTitle: "",
      page: 1,
      pageSize: 10,
      sortBy: "employmentType",
      sortOrder: "desc",
    } as unknown as EmployeeListParams;

    await listEmployees(unsafeParams);

    expect(api.get).toHaveBeenCalledWith("/api/v1/employees", {
      params: {
        page: 1,
        pageSize: 10,
        search: "",
        country: "",
        department: "",
        jobTitle: "",
        sortBy: "firstName",
        sortOrder: "desc",
      },
    });
  });

  it("normalizes getEmployeeById response and defaults missing employmentType", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        response: {
          id: "emp-3",
          firstName: "Ava",
          salary: "200.556",
        },
      },
    });

    const result = await getEmployeeById("emp-3");

    expect(api.get).toHaveBeenCalledWith("/api/v1/employees/emp-3");
    expect(result).toEqual(
      expect.objectContaining({
        id: "emp-3",
        salary: 200.56,
        employmentType: "FULL_TIME",
      }),
    );
  });

  it("normalizes update response from envelope", async () => {
    vi.mocked(api.put).mockResolvedValue({
      data: {
        response: {
          id: "emp-4",
          firstName: "Noah",
          employmentType: "CONTRACT",
          salary: 1000,
        },
      },
    });

    const result = await updateEmployee("emp-4", {
      employeeCode: "EMP004",
      firstName: "Noah",
      lastName: "Hill",
      email: "noah@example.com",
      country: "India",
      department: "Engineering",
      jobTitle: "Consultant",
      salary: 1000,
      currency: "USD",
      employmentType: "CONTRACT",
      dateOfJoining: "2024-03-01",
    });

    expect(api.put).toHaveBeenCalledWith(
      "/api/v1/employees/emp-4",
      expect.objectContaining({ firstName: "Noah" }),
    );
    expect(result).toEqual(
      expect.objectContaining({
        id: "emp-4",
        employmentType: "CONTRACT",
      }),
    );
  });

  it("calls delete endpoint with employee id", async () => {
    vi.mocked(api.delete).mockResolvedValue({});

    await deleteEmployee("emp-5");

    expect(api.delete).toHaveBeenCalledWith("/api/v1/employees/emp-5");
  });
});
