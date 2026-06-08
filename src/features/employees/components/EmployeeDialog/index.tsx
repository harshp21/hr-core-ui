import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import type { EmployeeFormValues } from "../../schemas/employee.schema";
import { EmployeeForm } from "../EmployeeForm";

interface EmployeeDialogProps {
  readonly open: boolean;
  readonly title: string;
  readonly submitLabel: string;
  readonly initialValues: Partial<EmployeeFormValues>;
  readonly isEditMode?: boolean;
  readonly onClose: () => void;
  readonly onSubmitEmployee: (values: EmployeeFormValues) => Promise<void>;
}

export function EmployeeDialog({
  open,
  title,
  submitLabel,
  initialValues,
  isEditMode = false,
  onClose,
  onSubmitEmployee,
}: EmployeeDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{
        paper: {
          sx: {
            borderRadius: "0.75rem",
            maxWidth: "55rem",
            width: "100%",
            maxHeight: "90vh",
            border: "1px solid #E2E8F0",
            boxShadow: "0 1.125rem 3.25rem rgba(15, 23, 42, 0.22)",
          },
        },
        backdrop: {
          sx: {
            backgroundColor: "rgba(15, 23, 42, 0.4)",
            backdropFilter: "blur(0.15rem)",
          },
        },
      }}
    >
      <DialogContent sx={{ pt: 2.1, px: { xs: 1.6, md: 1.6 }, pb: 1.5, overflowY: "auto" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.3 }}>
          <Box sx={{ display: "flex", gap: 1.2 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: "#ECF2FF",
                color: "#3668E8",
              }}
            >
              <PersonAddAlt1RoundedIcon sx={{ fontSize: 17 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontSize: "1rem", fontWeight: 700, color: "#0F172A" }}>
                {title}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.1, fontSize: "0.75rem", color: "#64748B" }}>
                Fill in the details to add a new employee
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} sx={{ alignSelf: "flex-start", color: "#64748B", p: 0.4 }}>
            <CloseRoundedIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </Box>

        <EmployeeForm
          initialValues={initialValues}
          isEditMode={isEditMode}
          submitLabel={submitLabel}
          onCancel={onClose}
          onSubmitEmployee={onSubmitEmployee}
        />
      </DialogContent>
    </Dialog>
  );
}
