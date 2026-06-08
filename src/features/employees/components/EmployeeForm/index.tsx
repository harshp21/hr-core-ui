import {
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import type {
  EmployeeFormValues,
} from "../../schemas/employee.schema";
import {
  employeeSchema,
} from "../../schemas/employee.schema";
import { COUNTRIES, DEPARTMENTS, JOB_TITLES } from "../../constants";

interface EmployeeFormProps {
  readonly initialValues: Partial<EmployeeFormValues>;
  readonly isEditMode?: boolean;
  readonly onSubmitEmployee: (values: EmployeeFormValues) => Promise<void>;
  readonly onCancel: () => void;
  readonly submitLabel: string;
}

export function EmployeeForm({
  initialValues,
  isEditMode = false,
  onSubmitEmployee,
  onCancel,
  submitLabel,
}: EmployeeFormProps) {
  const labelTopSlotProps = {
    inputLabel: {
      shrink: true,
    },
  } as const;

  const fieldSx = {
    "& .MuiInputLabel-root": {
      fontSize: "0.8125rem",
      fontWeight: 600,
      color: "#475569",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#475569",
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "0.5rem",
      minHeight: "2.5rem",
      backgroundColor: "#FFFFFF",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#D7DFEA",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#C8D3E2",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#334155D1",
      },
      "& .MuiInputBase-input": {
        fontSize: "0.875rem",
        fontWeight: 500,
        color: "#334155D1",
      },
      "& .MuiInputBase-input::placeholder": {
        fontSize: "0.875rem",
        fontWeight: 500,
        color: "#94A3B8",
        opacity: 1,
      },
      "& .MuiSelect-select": {
        fontSize: "0.875rem",
        fontWeight: 500,
        color: "#334155D1",
      },
    },
    "& .MuiFormHelperText-root": {
      marginLeft: 0,
      marginTop: "0.25rem",
      fontSize: "0.75rem",
    },
  };

  const disabledFieldSx = {
    "& .MuiInputLabel-root.Mui-disabled": {
      cursor: "not-allowed",
    },
    "& .MuiInputBase-root.Mui-disabled": {
      cursor: "not-allowed",
    },
    "& .MuiInputBase-root.Mui-disabled .MuiInputBase-input": {
      cursor: "not-allowed",
      WebkitTextFillColor: "#64748B",
    },
  };

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const submitHandler = handleSubmit(async (values) => {
    await onSubmitEmployee(values);
  });

  const requiredLabel = (label: string) => (
    <>
      {label} <Typography component="span" sx={{ color: "#E33C4E" }}>*</Typography>
    </>
  );

  return (
    <Box
      component="form"
      sx={{ display: "flex", flexDirection: "column", gap: 1.3, pt: 0.1 }}
      onSubmit={submitHandler}
    >
      <Grid container spacing={2.25}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label={requiredLabel("Employee Code")}
            fullWidth
            placeholder="e.g. EMP001"
            disabled={isEditMode}
            slotProps={labelTopSlotProps}
            {...register("employeeCode")}
            error={Boolean(errors.employeeCode)}
            helperText={errors.employeeCode?.message}
            sx={isEditMode ? { ...fieldSx, ...disabledFieldSx } : fieldSx}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label={requiredLabel("First Name")}
            fullWidth
            placeholder="e.g. John"
            slotProps={labelTopSlotProps}
            {...register("firstName")}
            error={Boolean(errors.firstName)}
            helperText={errors.firstName?.message}
            sx={fieldSx}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label={requiredLabel("Last Name")}
            fullWidth
            placeholder="e.g. Doe"
            slotProps={labelTopSlotProps}
            {...register("lastName")}
            error={Boolean(errors.lastName)}
            helperText={errors.lastName?.message}
            sx={fieldSx}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label={requiredLabel("Email")}
            fullWidth
            placeholder="e.g. john.doe@example.com"
            disabled={isEditMode}
            slotProps={labelTopSlotProps}
            {...register("email")}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            sx={isEditMode ? { ...fieldSx, ...disabledFieldSx } : fieldSx}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="department"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label={requiredLabel("Department")}
                fullWidth
                slotProps={labelTopSlotProps}
                {...field}
                error={Boolean(errors.department)}
                helperText={errors.department?.message}
                sx={fieldSx}
              >
                <MenuItem value="">Select department</MenuItem>
                {DEPARTMENTS.map((department) => (
                  <MenuItem key={department} value={department}>
                    {department}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="jobTitle"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label={requiredLabel("Job Title")}
                fullWidth
                slotProps={labelTopSlotProps}
                {...field}
                error={Boolean(errors.jobTitle)}
                helperText={errors.jobTitle?.message}
                sx={fieldSx}
              >
                <MenuItem value="">Select job title</MenuItem>
                {JOB_TITLES.map((title) => (
                  <MenuItem key={title} value={title}>
                    {title}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label={requiredLabel("Country")}
                fullWidth
                slotProps={labelTopSlotProps}
                {...field}
                error={Boolean(errors.country)}
                helperText={errors.country?.message}
                sx={fieldSx}
              >
                <MenuItem value="">Select country</MenuItem>
                {COUNTRIES.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="dateOfJoining"
            control={control}
            render={({ field }) => (
              <TextField
                label={requiredLabel("Date of Joining")}
                fullWidth
                type="date"
                value={field.value ? field.value.slice(0, 10) : ""}
                onChange={(event) => field.onChange(event.target.value)}
                onBlur={field.onBlur}
                name={field.name}
                inputRef={field.ref}
                error={Boolean(errors.dateOfJoining)}
                helperText={errors.dateOfJoining?.message}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                sx={fieldSx}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label={requiredLabel("Salary")}
            fullWidth
            type="number"
            placeholder="e.g. 50000"
            slotProps={labelTopSlotProps}
            {...register("salary", { valueAsNumber: true })}
            error={Boolean(errors.salary)}
            helperText={errors.salary?.message}
            sx={fieldSx}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label={requiredLabel("Currency")}
                fullWidth
                slotProps={labelTopSlotProps}
                {...field}
                error={Boolean(errors.currency)}
                helperText={errors.currency?.message}
                placeholder="Select currency"
                sx={fieldSx}
              >
                <MenuItem value="">Select currency</MenuItem>
                <MenuItem value="INR">INR</MenuItem>
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="GBP">GBP</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
                <MenuItem value="CAD">CAD</MenuItem>
                <MenuItem value="AUD">AUD</MenuItem>
              </TextField>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="employmentType"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label={requiredLabel("Employment Type")}
                fullWidth
                slotProps={labelTopSlotProps}
                {...field}
                error={Boolean(errors.employmentType)}
                helperText={errors.employmentType?.message}
                sx={fieldSx}
              >
                <MenuItem value="">Select employment type</MenuItem>
                <MenuItem value="FULL_TIME">Full Time</MenuItem>
                <MenuItem value="PART_TIME">Part Time</MenuItem>
                <MenuItem value="CONTRACT">Contract</MenuItem>
              </TextField>
            )}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "space-between", pt: 0.6 }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          sx={{
            minWidth: "5.6rem",
            height: "2.25rem",
            borderRadius: "0.5rem",
            color: "#475569",
            fontWeight: 600,
            fontSize: "0.875rem",
            borderColor: "#D7DFEA",
            backgroundColor: "#FFFFFF",
            "&:hover": {
              borderColor: "#C8D3E2",
              backgroundColor: "#F8FAFC",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          startIcon={<SaveRoundedIcon sx={{ fontSize: 16 }} />}
          sx={{
            minWidth: "10rem",
            height: "2.25rem",
            borderRadius: "0.5rem",
            px: 1.5,
            fontWeight: 600,
            fontSize: "0.875rem",
            color: "#FFFFFF",
            backgroundColor: "#2F61EA",
            "&:hover": {
              backgroundColor: "#2754D7",
            },
          }}
        >
          {submitLabel}
        </Button>
      </Box>
    </Box>
  );
}