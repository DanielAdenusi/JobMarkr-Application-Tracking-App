import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../auth/useAuth";
import { Spinner } from "./ui/Surface";

export function ProtectedRoute() {
	const { user, isAuthLoading } = useAuth();
	const location = useLocation();

	if (isAuthLoading) {
		return (
			<main className="grid min-h-screen place-items-center bg-slate-50 p-5">
				<Spinner label="Checking session..." />
			</main>
		);
	}

	if (!user) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}

	return <Outlet />;
}
