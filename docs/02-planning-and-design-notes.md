# Employee Salary Management Tool

## Planning and Design Notes

---

# Purpose

This document captures the planning process, architectural reasoning, design decisions, and implementation strategy used while designing the Employee Salary Management Tool.

The goal is to demonstrate how business requirements were translated into a maintainable, scalable, and testable software solution.

This document focuses on the reasoning behind decisions rather than implementation details.

---

# 1. Understanding the Problem

The business problem extends beyond simply storing employee records.

The current spreadsheet-based process creates operational challenges for HR teams:

* Employee data is difficult to maintain consistently.
* Reporting requires significant manual effort.
* Compensation analysis is time-consuming.
* Workforce insights are difficult to generate quickly.
* Data becomes increasingly difficult to manage as the organization grows.

The system therefore needs to support two primary workflows.

---

## Workflow 1: Employee Management

HR Managers must be able to:

* Create employee records.
* View employee information.
* Update employee information.
* Remove employees from active records.
* Search employees efficiently.
* Filter employee records.

This workflow focuses on operational data management.

---

## Workflow 2: Compensation Analytics

HR Managers must be able to answer questions such as:

* What is the average salary in a country?
* What is the minimum salary in a country?
* What is the maximum salary in a country?
* How do salaries compare between countries?
* What is the average salary for a specific job title?
* Which job titles receive the highest compensation?

This workflow focuses on business intelligence and reporting.

---

# 2. Product Design Approach

The objective was to build the smallest solution that effectively solves the business problem while maintaining a clear path for future expansion.

The MVP focuses on:

* Employee management
* Compensation analytics
* Usability
* Performance
* Maintainability

The MVP intentionally excludes features that increase complexity without directly supporting the core business goals.

Examples include:

* Authentication
* Payroll processing
* Employee self-service
* Approval workflows
* Audit history
* Notifications

These features are valuable but do not contribute directly to the primary objective of managing employee compensation data.

---

# 3. Architectural Principles

The following principles guided all technical decisions.

---

## Simplicity Over Complexity

The system should be easy to understand and maintain.

Avoid:

* Unnecessary abstractions
* Premature optimization
* Over-engineering

The architecture should remain approachable for future contributors.

---

## Separation of Concerns

Each layer should have a single responsibility.

### Controller

Responsible for:

* Request parsing
* Response formatting
* HTTP concerns

### Service

Responsible for:

* Business rules
* Validation orchestration
* Application workflows

### Repository

Responsible for:

* Data persistence
* Query construction
* Database interaction

This separation improves maintainability and testability.

---

## Feature-Oriented Design

The application is organized around business capabilities rather than technical layers.

Examples:

```txt
employee/
analytics/
shared/
```

Benefits:

* Better discoverability
* Reduced coupling
* Easier ownership
* Improved scalability

---

## Testability First

Every design decision should support automated testing.

Business logic should be testable independently from:

* Databases
* APIs
* User interfaces

This principle directly supports Test Driven Development (TDD).

---

# 4. Technology Selection Process

Several alternatives were evaluated before selecting the final technology stack.

---

## Backend Framework

### Considered

* Express.js
* NestJS

### Selected

Express.js

### Reasoning

The application is relatively small and does not require framework-level complexity.

Benefits:

* Lightweight
* Flexible
* Familiar ecosystem
* Easy to structure using modular architecture
* Well suited for TDD

---

## Database

### Considered

* SQLite
* PostgreSQL

### Selected

PostgreSQL

### Reasoning

The application requires aggregation-heavy analytics.

PostgreSQL provides:

* Strong aggregation support
* Advanced indexing
* Production-grade reliability
* Better scalability

---

## ORM

### Considered

* TypeORM
* Sequelize
* Prisma

### Selected

Prisma

### Reasoning

Benefits:

* Type safety
* Migration management
* Excellent developer experience
* Reduced boilerplate
* Strong TypeScript integration

---

## Frontend Framework

### Considered

* Next.js
* React + Vite

### Selected

React + Vite

### Reasoning

This is an internal business application.

Benefits:

* Faster development
* Simpler deployment
* Reduced complexity
* No need for server-side rendering

---

## State Management

### Considered

* Redux Toolkit
* TanStack Query

### Selected

TanStack Query

### Reasoning

Most application state originates from APIs.

Benefits:

* Built-in caching
* Request deduplication
* Background synchronization
* Reduced boilerplate

---

# 5. Domain Modeling Decisions

The Employee entity serves as the central business object.

Required attributes include:

* Personal information
* Organizational information
* Compensation information

The initial domain model intentionally remains simple.

The design favors clarity and maintainability over excessive normalization.

---

# 6. Database Design Decisions

---

## Employee as Primary Entity

The majority of business requirements revolve around employee compensation information.

A single Employee entity satisfies current requirements while remaining extensible.

---

## Denormalization Decision

Fields such as:

* Country
* Department
* Job Title

are stored as strings.

### Alternative

Separate lookup tables.

### Decision

Store as strings.

### Reasoning

For approximately 10,000 employees:

* Simpler implementation
* Fewer joins
* Faster delivery
* Reduced complexity

Future versions can normalize these entities if business requirements evolve.

---

## Soft Delete Strategy

### Decision

Use soft delete.

### Implementation

```txt
isDeleted = true
```

instead of physical deletion.

### Reasoning

Benefits:

* Data recoverability
* Operational safety
* Historical consistency
* Reduced risk of accidental data loss

---

# 7. Analytics Design Decisions

The analytics requirements are aggregation-focused.

Examples:

* Average salary
* Minimum salary
* Maximum salary
* Employee counts

These calculations are performed directly in PostgreSQL.

### Reasoning

Benefits:

* Better performance
* Reduced memory usage
* Simpler application logic
* Leverages database optimizations

Avoiding application-level aggregation improves scalability.

---

# 8. Indexing Strategy

Indexes should be driven by actual query requirements.

Selected indexes:

```txt
UNIQUE(employeeCode)

UNIQUE(email)

INDEX(country)

INDEX(country, jobTitle)
```

These support:

* Employee lookup
* Country analytics
* Job title analytics

The design intentionally avoids excessive indexing.

Benefits:

* Lower write overhead
* Reduced storage requirements
* Simpler maintenance

---

# 9. Scalability Considerations

The current requirement is approximately 10,000 employees.

However, architectural decisions were evaluated against future growth.

Target scale:

```txt
100,000+ employees
```

Key scalability considerations:

* Server-side pagination
* Database-level filtering
* Query-driven indexing
* Modular architecture
* Independent frontend/backend deployment

The solution should support significant growth without requiring major redesign.

---

# 10. Testing Strategy

The project follows strict Test Driven Development (TDD).

Development workflow:

```txt
RED
↓
GREEN
↓
REFACTOR
```

For every feature:

1. Write a failing test.
2. Implement the smallest solution.
3. Refactor while preserving behavior.

Benefits:

* Higher confidence
* Simpler designs
* Better maintainability
* Improved documentation through tests

---

# 11. AI-Assisted Development Strategy

AI is treated as an engineering assistant rather than a decision-maker.

AI was used for:

* Architecture brainstorming
* Documentation assistance
* Test case generation
* Boilerplate generation

AI was not trusted for:

* Business decisions
* Final architecture choices
* Code reviews
* Validation

All generated outputs require human review and verification.

---

# 12. Delivery Plan

Implementation is planned as incremental vertical slices.

---

## Phase 1

Project setup and tooling.

Deliverables:

* TypeScript setup
* Express setup
* Prisma setup
* Testing setup
* CI foundation

---

## Phase 2

Employee module backend.

Deliverables:

* Employee CRUD
* Search
* Filtering
* Pagination
* Sorting
* Validation
* Tests

---

## Phase 3

Analytics module backend.

Deliverables:

* Country salary analytics
* Job title analytics
* Workforce analytics
* Tests

---

## Phase 4

Data seeding.

Deliverables:

* 10,000 employee records
* Batch insertion strategy

---

## Phase 5

Frontend implementation.

Deliverables:

* Employee management UI
* Analytics dashboard
* API integration

---

## Phase 6

Performance optimization and final review.

Deliverables:

* Query optimization
* Documentation
* Deployment preparation

---

# 13. Final Design Summary

The final design intentionally prioritizes:

* Simplicity
* Maintainability
* Testability
* Product-focused delivery

over architectural complexity.

The resulting solution provides:

* Clear separation of concerns
* Scalable modular architecture
* Strong TDD support
* Efficient analytics processing
* A solid foundation for future growth

The architecture is sufficiently robust for current requirements while remaining adaptable to future business needs.
