import {
  Button,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  Paper,
  FormControl,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import { COUNTRIES, DEPARTMENTS, JOB_TITLES } from "../../constants";
import type { EmployeeFilters as EmployeeFiltersType } from "../../types";

const SEARCH_DEBOUNCE_MS = 400;

interface EmployeeFiltersProps {
  readonly filters: EmployeeFiltersType;
  readonly onChange: (filters: EmployeeFiltersType) => void;
  readonly onReset: () => void;
}

export function EmployeeFiltersSection({
  filters,
  onChange,
  onReset,
}: EmployeeFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search);
  const searchTimeoutRef = useRef<number | null>(null);
  const filtersRef = useRef(filters);

  useEffect(
    () => () => {
      if (searchTimeoutRef.current !== null) {
        window.clearTimeout(searchTimeoutRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const selectedValueColor = "#334155d1";
  const selectedOutlineColor = "#334155d1";

  const controlTextSx = {
    fontSize: "14px",
    fontWeight: 500,
    color: selectedValueColor,
  };

  const placeholderTextSx = {
    color: "#94a3b8",
    fontSize: "14px",
    fontWeight: 500,
  };

  const outlinedInputSx = (hasValue: boolean) => {
    const activeOutlineColor = hasValue ? selectedOutlineColor : "#E2E8F0";

    return {
      backgroundColor: "#FFFFFF",
      borderRadius: "0.5rem",
      "& .MuiInputBase-input": controlTextSx,
      "& .MuiSelect-select": controlTextSx,
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: activeOutlineColor,
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: activeOutlineColor,
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: selectedOutlineColor,
      },
    };
  };

  const handleSearchChange = (nextSearch: string) => {
    setSearchValue(nextSearch);

    if (searchTimeoutRef.current !== null) {
      window.clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = window.setTimeout(() => {
      if (nextSearch !== filtersRef.current.search) {
        onChange({ ...filtersRef.current, search: nextSearch });
      }
    }, SEARCH_DEBOUNCE_MS);
  };

  const handleReset = () => {
    if (searchTimeoutRef.current !== null) {
      window.clearTimeout(searchTimeoutRef.current);
    }

    setSearchValue("");
    onReset();
  };

  return (
    <Paper
      sx={{
        p: { xs: 2, md: 2.5 },
        mb: 2.5,
        borderRadius: 1,
        border: "1px solid #E4EAF3",
        boxShadow: "0 0.0625rem 0.125rem rgba(15, 23, 42, 0.04),0 0.75rem 1.75rem rgba(15, 23, 42, 0.05)",
      }}
    >
      <Grid container spacing={1.8} sx={{ alignItems: "center" }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            placeholder="Search employees..."
            size="small"
            value={searchValue}
            onChange={(event) => handleSearchChange(event.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon sx={{ fontSize: 20, color: "#687A98" }} />
                  </InputAdornment>
                ),
                sx: {
                  "&::placeholder": placeholderTextSx,
                },
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": outlinedInputSx(
                Boolean(searchValue.trim()),
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 2.5 }}>
          <FormControl fullWidth size="small">
            <Select
              input={<OutlinedInput sx={outlinedInputSx(Boolean(filters.department))} />}
              displayEmpty
              fullWidth
              value={filters.department}
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: "#94a3b8" }}>Department</span>;
                }

                return selected;
              }}
              onChange={(event) =>
                onChange({ ...filters, department: event.target.value })
              }
              inputProps={{ "aria-label": "Department" }}
            >
              <MenuItem value="" sx={placeholderTextSx}>Department</MenuItem>
              {DEPARTMENTS.map((department) => (
                <MenuItem key={department} value={department}>
                  {department}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 2.5 }}>
          <FormControl fullWidth size="small">
            <Select
              input={<OutlinedInput sx={outlinedInputSx(Boolean(filters.country))} />}
              displayEmpty
              fullWidth
              value={filters.country}
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: "#94a3b8" }}>Country</span>;
                }

                return selected;
              }}
              onChange={(event) =>
                onChange({ ...filters, country: event.target.value })
              }
              inputProps={{ "aria-label": "Country" }}
            >
              <MenuItem value="" sx={placeholderTextSx}>Country</MenuItem>
              {COUNTRIES.map((country) => (
                <MenuItem key={country} value={country}>
                  {country}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 2.5 }}>
          <FormControl fullWidth size="small">
            <Select
              input={<OutlinedInput sx={outlinedInputSx(Boolean(filters.jobTitle))} />}
              displayEmpty
              fullWidth
              value={filters.jobTitle}
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: "#94a3b8" }}>Job Title</span>;
                }

                return selected;
              }}
              onChange={(event) =>
                onChange({ ...filters, jobTitle: event.target.value })
              }
              inputProps={{ "aria-label": "Job Title" }}
            >
              <MenuItem value="" sx={placeholderTextSx}>Job Title</MenuItem>
              {JOB_TITLES.map((jobTitle) => (
                <MenuItem key={jobTitle} value={jobTitle}>
                  {jobTitle}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 1.5 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleReset}
            startIcon={<FilterAltRoundedIcon sx={{ fontSize: 20 }} />}
            sx={{
              height: 40,
              fontWeight: 700,
              borderColor: "#3E6FEA",
              color: "#2960E2",
              borderRadius: 0.5,
              "&:hover": {
                borderColor: "#2A5AD2",
                backgroundColor: "rgba(41,96,226,0.04)",
              },
            }}
          >
            Reset
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
