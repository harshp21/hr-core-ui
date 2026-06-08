import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { EMPLOYEE_PAGE_SIZE } from "@features/employees/constants";

const EmployeesPage = lazy(() =>
	import("../features/employees/pages/EmployeesPage").then((module) => ({
		default: module.EmployeesPage,
	})),
);

const AnalyticsPage = lazy(() =>
	import("../features/analytics/pages/AnalyticsPage").then((module) => ({
		default: module.AnalyticsPage,
	})),
);

export function AppRoutes() {
	return (
		<Routes>
			<Route path="/" element={<DashboardLayout />}>
				<Route index element={<Navigate to="overview" replace />} />
				<Route
					path="employees"
					element={
						<Suspense fallback={<LoadingSkeleton rows={EMPLOYEE_PAGE_SIZE} />}>
							<EmployeesPage />
						</Suspense>
					}
				/>
				<Route path="employee" element={<Navigate to="/employees" replace />} />
				<Route
					path="overview"
					element={
						<Suspense fallback={<LoadingSkeleton rows={EMPLOYEE_PAGE_SIZE} />}>
							<AnalyticsPage />
						</Suspense>
					}
				/>
				<Route path="analytics" element={<Navigate to="/overview" replace />} />
				<Route path="*" element={<Navigate to="/overview" replace />} />
			</Route>
		</Routes>
	);
}
