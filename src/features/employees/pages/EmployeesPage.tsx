import { Box, Button, Chip, Paper, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
// import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import Groups2SharpIcon from '@mui/icons-material/Groups2Sharp';
import { ConfirmDialog } from "../../../components/common/ConfirmDialog";
import { EmptyState } from "../../../components/common/EmptyState";
import { LoadingSkeleton } from "../../../components/common/LoadingSkeleton";
import { EMPLOYEE_PAGE_SIZE } from "../constants";
import type {
  EmployeeFormValues,
} from "../schemas/employee.schema";
import type { Employee, EmployeeFilters, SortableEmployeeField } from "../types";
import { EmployeeDialog } from "../components/EmployeeDialog";
import { EmployeeFiltersSection } from "../components/EmployeeFilters";
import { EmployeeTable } from "../components/EmployeeTable";
import {
  useCreateEmployeeMutation,
  useDeleteEmployeeMutation,
  useEmployeesQuery,
  useUpdateEmployeeMutation,
} from "../hooks/use-employees";

const defaultEmployeeValues: Partial<EmployeeFormValues> = {
  employeeCode: "",
  firstName: "",
  lastName: "",
  email: "",
  country: "",
  department: "",
  jobTitle: "",
  currency: "",
  dateOfJoining: "",
};

function toFormValues(employee: Employee): EmployeeFormValues {
  return {
    employeeCode: employee.employeeCode,
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    country: employee.country,
    department: employee.department,
    jobTitle: employee.jobTitle,
    salary: employee.salary,
    currency: employee.currency,
    employmentType: employee.employmentType,
    dateOfJoining: employee.dateOfJoining,
  };
}

export function EmployeesPage() {
  const [filters, setFilters] = useState<EmployeeFilters>({
    search: "",
    department: "",
    country: "",
    jobTitle: "",
  });
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortableEmployeeField>("firstName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [createOpen, setCreateOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  const query = useEmployeesQuery({
    ...filters,
    page,
    pageSize: EMPLOYEE_PAGE_SIZE,
    sortBy,
    sortOrder,
  });
  const createMutation = useCreateEmployeeMutation();
  const updateMutation = useUpdateEmployeeMutation();
  const deleteMutation = useDeleteEmployeeMutation();

  const items = query.data?.items ?? [];
  const total = query.data?.total ?? 0;

  const editInitialValues = useMemo(
    () => (editingEmployee ? toFormValues(editingEmployee) : defaultEmployeeValues),
    [editingEmployee],
  );

  const resetFilters = () => {
    setFilters({ search: "", department: "", country: "", jobTitle: "" });
    setSortBy("firstName");
    setSortOrder("asc");
    setPage(1);
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          borderRadius: 1,
          border: "1px solid",
          borderColor: "#E4EAF3",
          background: "linear-gradient(180deg, #EFF4FF 0%, #EEF3FF 100%)",
          p: { xs: 2.25, md: 3.25 },
          mb: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            right: { xs: 15, md: 235 },
            bottom: -25,
            color: "#C9D7FA",
            opacity: 0.65,
            pointerEvents: "none",
          }}
        >
          <Groups2SharpIcon sx={{ fontSize: 180 }} />
        </Box>

        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            gap: 2,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box>
            <Typography
              variant="overline"
              sx={{ color: "#5C6B86", letterSpacing: 1.2, fontWeight: 700 }}
            >
              HR CORE PLATFORM
            </Typography>
            <Typography
              variant="h4"
              sx={{ mt: 0.2, fontSize: { xs: "1.8rem", md: "1.8rem" } }}
            >
              Employees
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              Manage workforce records, compensation, and employment details
            </Typography>
          </Box>

          <Button
            variant="contained"
            // size="large"
            startIcon={<AddRoundedIcon />}
            onClick={() => setCreateOpen(true)}
            sx={{ px: 2.5, py: 1.1, minWidth: 160, borderRadius: 0.5 }}
          >
            Add Employee
          </Button>
        </Box>
      </Box>

      <EmployeeFiltersSection
        filters={filters}
        onChange={(nextFilters) => {
          setFilters(nextFilters);
          setPage(1);
        }}
        onReset={resetFilters}
      />

      <Box sx={{ display: "flex", gap: 1.25, mb: 2, flexWrap: "wrap", alignItems: "center" }}>
        <Typography sx={{ color: "#405069", fontWeight: 650, fontSize: "1rem" }}>
          Total Records: <Box component="span" sx={{ color: "#111827" }}>{total}</Box>
        </Typography>
        <Typography sx={{ color: "#CDD5E0" }}>|</Typography>
        <Typography sx={{ color: "#405069", fontWeight: 650, fontSize: "1rem" }}>
          Page:
        </Typography>
        <Chip label={String(page)} variant="outlined" sx={{ minWidth: 34 }} />
      </Box>

      {query.isLoading ? (
        <LoadingSkeleton rows={EMPLOYEE_PAGE_SIZE} />
      ) : query.isError && !query.data ? (
        <Paper sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 1 }}>
          <Typography variant="h6">Unable to load employees</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Please try again.
          </Typography>
          <Button sx={{ mt: 1.5 }} variant="outlined" onClick={() => void query.refetch()}>
            Retry
          </Button>
        </Paper>
      ) : total === 0 ? (
        <EmptyState title="No employees found" message="Try changing your search or filters." />
      ) : (
        <Paper sx={{ p: { xs: 1.5, md: 2 }, borderRadius: 1 }}>
          <Box sx={{ mb: 1.5 }}>
            <Typography variant="h6">Employee Directory</Typography>
            <Typography variant="body2" color="text.secondary">
              Search, filter, and manage your organization workforce.
            </Typography>
          </Box>
          <EmployeeTable
            employees={items}
            page={page}
            pageSize={EMPLOYEE_PAGE_SIZE}
            total={total}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onPageChange={setPage}
            onSortChange={({ sortBy: nextSortBy, sortOrder: nextSortOrder }) => {
              setSortBy(nextSortBy);
              setSortOrder(nextSortOrder);
              setPage(1);
            }}
            onEdit={setEditingEmployee}
            onDelete={setEmployeeToDelete}
          />
        </Paper>
      )}

      <EmployeeDialog
        open={createOpen}
        title="Add Employee"
        submitLabel="Create Employee"
        initialValues={defaultEmployeeValues}
        onClose={() => setCreateOpen(false)}
        onSubmitEmployee={async (values) => {
          await createMutation.mutateAsync(values);
          setCreateOpen(false);
        }}
      />

      <EmployeeDialog
        open={Boolean(editingEmployee)}
        title="Edit Employee"
        submitLabel="Save Changes"
        initialValues={editInitialValues}
        isEditMode
        onClose={() => setEditingEmployee(null)}
        onSubmitEmployee={async (values) => {
          if (!editingEmployee) {
            return;
          }
          await updateMutation.mutateAsync({
            employeeId: editingEmployee.id,
            input: values,
          });
          setEditingEmployee(null);
        }}
      />

      <ConfirmDialog
        open={Boolean(employeeToDelete)}
        title="Delete Employee"
        message="This action cannot be undone."
        confirmText="Delete"
        onCancel={() => setEmployeeToDelete(null)}
        onConfirm={async () => {
          if (!employeeToDelete) {
            return;
          }
          await deleteMutation.mutateAsync(employeeToDelete.id);
          setEmployeeToDelete(null);
        }}
      />
    </>
  );
}