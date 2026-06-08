import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { Box, Button, Chip, Typography } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
} from "@mui/x-data-grid";
import { memo, useMemo } from "react";
import { isSortableEmployeeField } from "../../constants";
import type { Employee, SortableEmployeeField } from "../../types";

interface EmployeeTableProps {
  employees: readonly Employee[];
  page: number;
  pageSize: number;
  total: number;
  sortBy: SortableEmployeeField;
  sortOrder: "asc" | "desc";
  onPageChange: (nextPage: number) => void;
  onSortChange: (sort: { sortBy: SortableEmployeeField; sortOrder: "asc" | "desc" }) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

function EmployeeTableComponent({
  employees,
  page,
  pageSize,
  total,
  sortBy,
  sortOrder,
  onPageChange,
  onSortChange,
  onEdit,
  onDelete,
}: EmployeeTableProps) {
  const columns = useMemo<GridColDef<Employee>[]>(
    () => [
      {
        field: "firstName",
        headerName: "Name",
        flex: 1.2,
        minWidth: 180,
        valueGetter: (_, row) => `${row.firstName} ${row.lastName}`,
      },
      {
        field: "email",
        headerName: "Email",
        flex: 1.3,
        minWidth: 220,
        sortable: false,
      },
      {
        field: "department",
        headerName: "Department",
        flex: 1,
        minWidth: 140,
        sortable: false,
      },
      {
        field: "jobTitle",
        headerName: "Job Title",
        flex: 1.1,
        minWidth: 160,
        sortable: false,
      },
      {
        field: "country",
        headerName: "Country",
        flex: 0.8,
        minWidth: 120,
        sortable: false,
      },
      {
        field: "salary",
        headerName: "Salary",
        type: "number",
        minWidth: 150,
        align: "right",
        headerAlign: "right",
        valueFormatter: (value) =>
          Number(value).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2,
          }),
      },
      {
        field: "employmentType",
        headerName: "Type",
        minWidth: 140,
        sortable: false,
        filterable: false,
        renderCell: ({ row }) => (
          <Chip
            label={row.employmentType.replace("_", " ")}
            size="small"
            color={row.employmentType === "FULL_TIME" ? "success" : "default"}
          />
        ),
      },
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        minWidth: 110,
        sortable: false,
        filterable: false,
        getActions: ({ row }) => [
          <GridActionsCellItem
            key={`edit-${row.id}`}
            icon={<EditRoundedIcon fontSize="small" />}
            label="Edit"
            onClick={() => onEdit(row)}
            showInMenu
          />,
          <GridActionsCellItem
            key={`delete-${row.id}`}
            icon={<DeleteOutlineRoundedIcon fontSize="small" />}
            label="Delete"
            onClick={() => onDelete(row)}
            showInMenu
          />,
        ],
      },
    ],
    [onDelete, onEdit],
  );

  const paginationModel = useMemo<GridPaginationModel>(
    () => ({
      page: page - 1,
      pageSize,
    }),
    [page, pageSize],
  );

  const sortModel = useMemo<GridSortModel>(
    () => [{ field: sortBy, sort: sortOrder }],
    [sortBy, sortOrder],
  );

  return (
    <>
      <DataGrid
        rows={employees}
        columns={columns}
        disableRowSelectionOnClick
        rowHeight={56}
        autoHeight
        pagination
        paginationMode="server"
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={(model) => {
          const nextSort = model[0];

          if (!nextSort || !nextSort.sort) {
            onSortChange({ sortBy: "firstName", sortOrder: "asc" });
            return;
          }

          if (!isSortableEmployeeField(nextSort.field)) {
            onSortChange({ sortBy, sortOrder });
            return;
          }

          onSortChange({
            sortBy: nextSort.field,
            sortOrder: nextSort.sort,
          });
        }}
        rowCount={total}
        pageSizeOptions={[pageSize]}
        paginationModel={paginationModel}
        onPaginationModelChange={(model) => {
          onPageChange(model.page + 1);
        }}
        sx={{
          borderRadius: 1,
          borderColor: "divider",
          backgroundColor: "background.paper",
          "& .MuiDataGrid-main": {
            borderRadius: 1,
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#F7FAFD",
            borderBottom: "1px solid",
            borderColor: "divider",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 700,
            color: "text.secondary",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#F2F7FF",
          },
          "& .MuiDataGrid-cell": {
            borderColor: "#EDF2F7",
          },
        }}
      />
      {total > 0 ? (
        <Box
          sx={{
            pt: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Typography color="text.secondary" variant="body2">
            Showing {employees.length} of {total} employees
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              size="small"
              disabled={page * pageSize >= total}
              onClick={() => onPageChange(page + 1)}
            >
              Next
            </Button>
          </Box>
        </Box>
      ) : (
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          No employees found.
        </Typography>
      )}
    </>
  );
}

export const EmployeeTable = memo(EmployeeTableComponent);
