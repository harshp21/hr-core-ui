# Employee Salary Management Tool

## Architecture Diagrams

---

# Purpose

This document provides visual representations of the system architecture, application flow, database design, and deployment topology used by the Employee Salary Management Tool.

These diagrams illustrate how the system is organized and how different components interact with each other.

---

# 1. High-Level System Architecture

```mermaid
flowchart TD

    HR[HR Manager]

    WEB[React Frontend<br/>React + Vite + TypeScript]

    API[Express API<br/>Node.js + TypeScript]

    PRISMA[Prisma ORM]

    DB[(PostgreSQL)]

    HR --> WEB
    WEB --> API
    API --> PRISMA
    PRISMA --> DB
```

## Purpose

The architecture separates:

* Presentation Layer
* Business Logic Layer
* Data Access Layer

### Benefits

* Maintainability
* Scalability
* Independent deployments
* Clear separation of concerns

---

# 2. Backend Layered Architecture

```mermaid
flowchart TD

    REQUEST[HTTP Request]

    CONTROLLER[Controller<br/>Request / Response Handling]

    SERVICE[Service<br/>Business Logic]

    REPOSITORY[Repository<br/>Data Access Layer]

    PRISMA[Prisma ORM]

    DB[(PostgreSQL)]

    REQUEST --> CONTROLLER
    CONTROLLER --> SERVICE
    SERVICE --> REPOSITORY
    REPOSITORY --> PRISMA
    PRISMA --> DB
```

## Layer Responsibilities

### Controller

* Request parsing
* Response formatting
* HTTP concerns

### Service

* Business rules
* Application workflows
* Validation orchestration

### Repository

* Database access
* Query construction
* Aggregation queries

---

# 3. Backend Module Architecture

```mermaid
flowchart TD

    APP[src]

    MODULES[modules]

    EMPLOYEE[employee]

    ANALYTICS[analytics]

    HEALTH[health]

    SHARED[shared]

    CONFIG[config]

    APP --> MODULES
    APP --> SHARED
    APP --> CONFIG

    MODULES --> EMPLOYEE
    MODULES --> ANALYTICS
    MODULES --> HEALTH
```

## Directory Structure

```txt
src/
│
├── modules/
│   ├── employee/
│   ├── analytics/
│   └── health/
│
├── shared/
├── config/
├── app.ts
└── server.ts
```

## Benefits

* Feature ownership
* Reduced coupling
* Easier onboarding
* Better scalability

---

# 4. Frontend Architecture

```mermaid
flowchart TD

    APP[React Application]

    EMPLOYEES[Employees Feature]

    ANALYTICS[Analytics Feature]

    SHARED[Shared Components<br/>Shared Hooks<br/>Shared Utilities]

    APP --> EMPLOYEES
    APP --> ANALYTICS

    EMPLOYEES --> SHARED
    ANALYTICS --> SHARED
```

## Benefits

* Feature isolation
* Reusability
* Easier maintenance
* Scalability

---

# 5. Frontend Folder Structure

```txt
src/
│
├── app/
│   ├── providers/
│   ├── routes/
│   └── layouts/
│
├── features/
│   ├── employees/
│   └── analytics/
│
├── shared/
│   ├── api/
│   ├── components/
│   ├── hooks/
│   ├── types/
│   └── utils/
│
├── test/
│
├── App.tsx
└── main.tsx
```

---

# 6. Employee CRUD Request Flow

```mermaid
sequenceDiagram

    participant HR as HR Manager
    participant UI as React UI
    participant API as Employee Controller
    participant SERVICE as Employee Service
    participant REPO as Employee Repository
    participant DB as PostgreSQL

    HR->>UI: Submit Employee Form
    UI->>API: POST /employees

    API->>SERVICE: Create Employee

    SERVICE->>REPO: Persist Employee

    REPO->>DB: Insert Record

    DB-->>REPO: Success

    REPO-->>SERVICE: Employee Created

    SERVICE-->>API: Response DTO

    API-->>UI: 201 Created

    UI-->>HR: Refresh Employee List
```

## Purpose

Illustrates the complete employee creation workflow.

---

# 7. Employee Search Flow

```mermaid
sequenceDiagram

    participant HR as HR Manager
    participant UI as React UI
    participant API as Employee Controller
    participant SERVICE as Employee Service
    participant REPO as Employee Repository
    participant DB as PostgreSQL

    HR->>UI: Search Employees

    UI->>API: GET /employees

    API->>SERVICE: Search Request

    SERVICE->>REPO: Execute Search

    REPO->>DB: Query Employees

    DB-->>REPO: Results

    REPO-->>SERVICE: Employee List

    SERVICE-->>API: Response

    API-->>UI: Paginated Employees
```

---

# 8. Analytics Request Flow

```mermaid
sequenceDiagram

    participant HR as HR Manager
    participant UI as Analytics Dashboard
    participant API as Analytics Controller
    participant SERVICE as Analytics Service
    participant REPO as Analytics Repository
    participant DB as PostgreSQL

    HR->>UI: Open Analytics Dashboard

    UI->>API: GET /analytics/countries

    API->>SERVICE: Analytics Request

    SERVICE->>REPO: Aggregate Salaries

    REPO->>DB: GROUP BY Country

    DB-->>REPO: Aggregated Results

    REPO-->>SERVICE: Analytics Data

    SERVICE-->>API: Response DTO

    API-->>UI: Analytics Response
```

## Purpose

Illustrates how salary analytics are generated using database aggregations.

---

# 9. Validation Flow

```mermaid
flowchart TD

    REQUEST[Incoming Request]

    VALIDATION[Zod Validation]

    CONTROLLER[Controller]

    SERVICE[Service]

    REPOSITORY[Repository]

    DB[(Database)]

    REQUEST --> VALIDATION

    VALIDATION --> CONTROLLER

    CONTROLLER --> SERVICE

    SERVICE --> REPOSITORY

    REPOSITORY --> DB
```

## Purpose

Separates:

### Transport Validation

Performed by:

* Zod schemas
* Request validation middleware

### Business Validation

Performed by:

* Service layer
* Domain rules

---

# 10. Error Handling Flow

```mermaid
flowchart TD

    REQUEST[Request]

    CONTROLLER[Controller]

    SERVICE[Service]

    ERROR[Domain Error]

    HANDLER[Global Error Handler]

    RESPONSE[HTTP Response]

    REQUEST --> CONTROLLER

    CONTROLLER --> SERVICE

    SERVICE --> ERROR

    ERROR --> HANDLER

    HANDLER --> RESPONSE
```

## Error Mapping

| Error Type      | HTTP Status |
| --------------- | ----------- |
| ValidationError | 400         |
| NotFoundError   | 404         |
| ConflictError   | 409         |
| InternalError   | 500         |

---

# 11. Database Entity Diagram

```mermaid
erDiagram

    EMPLOYEE {

        UUID id PK

        string employeeCode UK

        string email UK

        string firstName

        string lastName

        string country

        string department

        string jobTitle

        decimal salary

        string currency

        string employmentType

        datetime dateOfJoining

        boolean isDeleted

        datetime createdAt

        datetime updatedAt
    }
```

## Notes

Country, Department, and Job Title are intentionally denormalized for MVP simplicity.

---

# 12. Database Indexing Strategy

```mermaid
flowchart TD

    EMPLOYEE[Employee Table]

    PK[Primary Key id]

    CODE[Unique employeeCode]

    EMAIL[Unique email]

    COUNTRY[Index country]

    COUNTRY_JOB[Index country + jobTitle]

    EMPLOYEE --> PK

    EMPLOYEE --> CODE

    EMPLOYEE --> EMAIL

    EMPLOYEE --> COUNTRY

    EMPLOYEE --> COUNTRY_JOB
```

## Supported Queries

### Country Analytics

* AVG(salary)
* MIN(salary)
* MAX(salary)
* COUNT(*)

Grouped by country.

### Job Title Analytics

* AVG(salary)

Grouped by country and job title.

---

# 13. TDD Development Workflow

```mermaid
flowchart TD

    RED[Write Failing Test]

    GREEN[Implement Feature]

    REFACTOR[Refactor Code]

    COMMIT[Commit Changes]

    RED --> GREEN

    GREEN --> REFACTOR

    REFACTOR --> COMMIT
```

## Example Commit Flow

```txt
test(employee): add create employee tests

feat(employee): implement create employee service

refactor(employee): simplify employee validation
```

---

# 14. Deployment Architecture

```mermaid
flowchart TD

    USER[HR Manager]

    FRONTEND[React Frontend]

    API[Express API]

    DATABASE[(PostgreSQL)]

    USER --> FRONTEND

    FRONTEND --> API

    API --> DATABASE
```

## Deployment Characteristics

Frontend and backend are deployed independently.

Benefits:

* Independent releases
* Easier scaling
* Clear separation of concerns
* Reduced deployment risk

---

# Architecture Summary

The architecture is designed around the following principles:

* Simplicity
* Maintainability
* Testability
* Scalability
* Clear separation of concerns

The modular monolith approach provides a strong foundation for the current requirements while supporting future growth and additional HR-related modules.
