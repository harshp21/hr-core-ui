# HR Core UI - Copilot Instructions

## Project Overview

HR Core UI is a professional Employee Management and Analytics Dashboard built using:

- React
- TypeScript
- Vite
- Material UI (MUI)
- TanStack Query (React Query)
- React Hook Form
- Zod
- Axios
- Recharts
- React Router DOM

The application consumes APIs from the HR Core API backend.

---

## Engineering Principles

### General

- Write production-quality code.
- Prioritize readability over cleverness.
- Follow SOLID principles where applicable.
- Prefer composition over inheritance.
- Avoid code duplication.
- Keep components small and focused.
- Use strict TypeScript typing.
- Never use `any`.
- Prefer explicit types.
- Use named exports unless there is a strong reason for default exports.
- Prefer functional components.

---

## Folder Structure

Follow the existing project structure.

```txt
src/
├── api/
├── assets/
├── components/
├── constants/
├── features/
├── hooks/
├── layouts/
├── routes/
├── theme/
├── types/
├── utils/
├── App.tsx
└── main.tsx
```

Feature modules must remain self-contained.

Example:

```txt
features/employees/
├── api/
├── components/
├── hooks/
├── pages/
├── schemas/
├── types/
└── constants/
```

---

## Component Guidelines

### Preferred Structure

```tsx
type EmployeeTableProps = {
  employees: Employee[];
};

export function EmployeeTable({
  employees,
}: EmployeeTableProps) {
  return (
    <div />
  );
}
```

### Avoid

```tsx
export default function EmployeeTable() {}
```

### Rules

- One responsibility per component.
- Extract reusable UI into shared components.
- Avoid deeply nested JSX.
- Keep components under ~200 lines where possible.
- Create hooks when logic becomes complex.

---

## TypeScript Rules

### Always

Use interfaces for object contracts.

```ts
export interface Employee {
  id: string;
  employeeCode: string;
}
```

Use type aliases for unions.

```ts
export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT";
```

### Never

```ts
const data: any
```

or

```ts
function process(value: any)
```

---

## API Layer

All API communication must be inside feature api folders.

Example:

```txt
features/employees/api/
```

Use Axios instance from:

```ts
src/api/axios.ts
```

Example:

```ts
import { api } from "@api/axios";

export async function getEmployees() {
  const response =
    await api.get("/employees");

  return response.data;
}
```

Never call Axios directly inside components.

---

## React Query

Always use React Query for server state.

Example:

```ts
export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });
}
```

### Avoid

```ts
useEffect(() => {
  fetchEmployees();
}, []);
```

for server data.

---

## Forms

Use:

- React Hook Form
- Zod
- @hookform/resolvers

Validation must be schema-driven.

Example:

```ts
export const employeeSchema =
  z.object({
    firstName:
      z.string().min(1),
  });
```

---

## Material UI

Use Material UI components whenever possible.

Preferred:

- Card
- Paper
- Stack
- Grid
- DataGrid
- Dialog
- Snackbar

Avoid excessive custom CSS.

Use:

```tsx
sx={{}}
```

for component styling.

Create reusable theme values instead of hardcoding styles repeatedly.

---

## Styling

Preferred order:

1. Material UI theme
2. sx prop
3. Reusable styled components

Avoid:

- Inline style objects
- Magic numbers
- Repeated colors

---

## Analytics Dashboard

Analytics pages should use:

- Cards for KPIs
- Recharts for visualizations
- Responsive layouts

Supported analytics:

- Country Salary Insights
- Department Salary Insights
- Job Title Salary Insights

---

## Employee Module

Supported functionality:

- List employees
- Create employee
- Edit employee
- Delete employee
- Search
- Filters
- Pagination

Use dialogs for create/edit flows.

Use confirmation dialogs before deletion.

---

## Error Handling

Handle API errors gracefully.

Use user-friendly messages.

Preferred:

```ts
try {
  ...
} catch (error) {
  ...
}
```

Show feedback using Snackbar notifications.

---

## Accessibility

Always:

- Provide labels for inputs
- Use semantic HTML
- Use accessible button text
- Ensure keyboard navigation works

---

## Performance

- Memoize expensive computations.
- Avoid unnecessary re-renders.
- Use React Query caching.
- Lazy load routes when appropriate.

---

## Testing Readiness

Write components that are easy to test.

Avoid tightly coupling business logic to UI.

Keep side effects inside hooks or service functions.

---

## Naming Conventions

Components:

```txt
EmployeeTable.tsx
EmployeeForm.tsx
```

Hooks:

```txt
useEmployees.ts
useAnalytics.ts
```

API:

```txt
employee.api.ts
analytics.api.ts
```

Pages:

```txt
EmployeesPage.tsx
AnalyticsPage.tsx
```

Types:

```txt
employee.types.ts
analytics.types.ts
```

---

## Expected UI Quality

The application should resemble a modern enterprise HR dashboard.

Prioritize:

- Clean layout
- Consistent spacing
- Professional typography
- Responsive design
- Clear data presentation

Avoid creating a basic CRUD-style interface.