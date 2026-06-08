# Employee Salary Management Tool

## Trade-off Explanations

---

# Purpose

This document captures the key architectural and technical decisions made during the design of the Employee Salary Management Tool.

For each major decision, multiple alternatives were considered and evaluated against the project's goals:

* Simplicity
* Maintainability
* Scalability
* Testability
* Delivery Speed

The selected solutions intentionally balance engineering quality with the scope of an MVP supporting approximately 10,000 employees.

---

# 1. Express.js vs NestJS

## Options Considered

### Express.js

#### Pros

* Lightweight
* Flexible architecture
* Large ecosystem
* Minimal framework overhead
* Easy to understand

#### Cons

* Requires architectural discipline
* More conventions must be defined by the team

---

### NestJS

#### Pros

* Strong architectural conventions
* Built-in dependency injection
* Structured module system
* Rich ecosystem

#### Cons

* Additional complexity
* More boilerplate
* Steeper learning curve
* Features not required for the MVP

---

## Decision

### Selected: Express.js

### Reasoning

The application is relatively small and straightforward.

A modular architecture using:

```txt id="kx5kmc"
Controller
→ Service
→ Repository
```

provides sufficient structure without introducing framework-level complexity.

Express enables faster delivery while maintaining flexibility and testability.

---

# 2. PostgreSQL vs SQLite

## Options Considered

### SQLite

#### Pros

* Extremely simple setup
* File-based storage
* Minimal operational overhead

#### Cons

* Limited concurrency
* Less representative of production systems
* Limited scalability

---

### PostgreSQL

#### Pros

* Strong aggregation capabilities
* Advanced indexing support
* Production-grade reliability
* Excellent scalability

#### Cons

* Slightly more setup and configuration

---

## Decision

### Selected: PostgreSQL

### Reasoning

The application requires salary analytics based on aggregation queries.

Examples:

```sql id="nrm4tr"
AVG(salary)
MIN(salary)
MAX(salary)
COUNT(*)
GROUP BY country
```

PostgreSQL is better suited for these workloads and more closely reflects real-world production environments.

---

# 3. Prisma vs Raw SQL

## Options Considered

### Raw SQL

#### Pros

* Maximum control
* Full query visibility
* No abstraction layer

#### Cons

* More boilerplate
* Increased maintenance effort
* Reduced developer productivity

---

### Prisma

#### Pros

* Type safety
* Migration management
* Excellent TypeScript integration
* Improved developer experience

#### Cons

* Additional abstraction layer
* Complex queries may still require raw SQL

---

## Decision

### Selected: Prisma

### Reasoning

Prisma provides a strong balance between productivity and transparency.

Benefits include:

* Reduced boilerplate
* Safer refactoring
* Better developer experience
* Strong TypeScript support

For this project, the productivity gains outweigh the abstraction cost.

---

# 4. React + Vite vs Next.js

## Options Considered

### Next.js

#### Pros

* Server-side rendering
* Static site generation
* Built-in routing

#### Cons

* Additional complexity
* Features unnecessary for internal applications

---

### React + Vite

#### Pros

* Fast development workflow
* Fast builds
* Simpler deployment
* Lower complexity

#### Cons

* No built-in SSR

---

## Decision

### Selected: React + Vite

### Reasoning

The application is an internal HR tool.

SEO and server-side rendering provide little business value.

React + Vite offers a simpler and more efficient development experience.

---

# 5. TanStack Query vs Redux Toolkit

## Options Considered

### Redux Toolkit

#### Pros

* Centralized state management
* Mature ecosystem
* Predictable state transitions

#### Cons

* Additional boilerplate
* More complexity for server-state management

---

### TanStack Query

#### Pros

* Purpose-built for server state
* Request caching
* Background synchronization
* Request deduplication

#### Cons

* Not intended for complex client-side state

---

## Decision

### Selected: TanStack Query

### Reasoning

Most application data originates from APIs.

Examples:

* Employee listings
* Employee details
* Analytics data

TanStack Query provides a simpler solution with less boilerplate while delivering excellent server-state management capabilities.

---

# 6. Modular Monolith vs Microservices

## Options Considered

### Microservices

#### Pros

* Independent scaling
* Service autonomy
* Team-level ownership

#### Cons

* Operational complexity
* Distributed system challenges
* More infrastructure requirements
* Increased testing complexity

---

### Modular Monolith

#### Pros

* Simpler deployment
* Easier testing
* Lower operational overhead
* Faster development

#### Cons

* Shared deployment lifecycle

---

## Decision

### Selected: Modular Monolith

### Reasoning

The application currently consists of a small number of closely related business domains:

```txt id="llc3ah"
Employee
Analytics
Health
```

Microservices would introduce unnecessary complexity without meaningful business value.

The modular monolith approach provides clear separation while remaining operationally simple.

---

# 7. Soft Delete vs Hard Delete

## Options Considered

### Hard Delete

#### Pros

* Simpler implementation
* Smaller database size

#### Cons

* Permanent data loss
* Higher operational risk

---

### Soft Delete

#### Pros

* Recoverability
* Historical consistency
* Operational safety

#### Cons

* Slightly more query complexity

---

## Decision

### Selected: Soft Delete

### Reasoning

Employee records are business-critical data.

The ability to recover records is more valuable than the minor increase in implementation complexity.

Implementation:

```txt id="h5ktyv"
isDeleted = true
```

instead of physical deletion.

---

# 8. Normalized vs Denormalized Reference Data

## Options Considered

### Normalized Design

Separate tables:

```txt id="g8up8t"
Country
Department
JobTitle
```

#### Pros

* Better consistency
* Reduced duplication
* Easier governance

#### Cons

* Additional joins
* More implementation effort
* Increased complexity

---

### Denormalized Design

Store values directly:

```txt id="d4gjdv"
country
department
jobTitle
```

#### Pros

* Simpler implementation
* Faster delivery
* Fewer joins

#### Cons

* Potential duplication

---

## Decision

### Selected: Denormalized Strings

### Reasoning

For approximately 10,000 employees:

* Simpler architecture
* Lower implementation complexity
* Adequate performance

Future versions can normalize these entities if business complexity increases.

---

# 9. Minimal Indexing vs Aggressive Indexing

## Options Considered

### Aggressive Indexing

Indexes on:

```txt id="6g9r2v"
salary
department
country
jobTitle
dateOfJoining
```

#### Pros

* Potentially faster reads

#### Cons

* Increased write costs
* Additional storage requirements
* More maintenance overhead

---

### Query-Driven Indexing

Indexes only where required.

#### Pros

* Balanced performance
* Lower maintenance cost
* Better write performance

#### Cons

* Requires understanding query patterns

---

## Decision

### Selected: Query-Driven Indexing

Indexes:

```txt id="a7f9cq"
UNIQUE(employeeCode)

UNIQUE(email)

INDEX(country)

INDEX(country, jobTitle)
```

### Reasoning

Indexes should support actual business queries rather than hypothetical future scenarios.

This approach balances read performance and write performance.

---

# 10. Backend First vs Frontend First

## Options Considered

### Frontend First

#### Pros

* Early UI feedback
* Faster visual progress

#### Cons

* Frequent API contract changes
* Mock data maintenance

---

### Backend First

#### Pros

* Stable API contracts
* Easier testing
* Better TDD workflow

#### Cons

* Slower visual progress initially

---

## Decision

### Selected: Backend First

### Reasoning

The assessment emphasizes:

* TDD
* Engineering practices
* Architecture
* API design

Completing backend modules first establishes stable contracts before frontend implementation begins.

---

# 11. Analytics Module vs Employee Module Reporting

## Options Considered

### Salary Reporting Inside Employee Module

#### Pros

* Faster initial implementation

#### Cons

* Mixed responsibilities
* Poor separation of concerns
* Harder future maintenance

---

### Dedicated Analytics Module

#### Pros

* Clear ownership
* Better scalability
* Cleaner architecture

#### Cons

* Additional module creation

---

## Decision

### Selected: Dedicated Analytics Module

### Reasoning

The Employee module owns:

* Employee CRUD
* Search
* Filtering

The Analytics module owns:

* Salary insights
* Aggregations
* Workforce reporting

This separation follows the Single Responsibility Principle and improves maintainability.

---

# Summary

The overall design intentionally prioritizes:

* Simplicity
* Maintainability
* Testability
* Delivery speed

while remaining scalable enough to support future growth.

The chosen solutions avoid unnecessary complexity while providing a strong foundation for future enhancements and additional HR-related capabilities.
