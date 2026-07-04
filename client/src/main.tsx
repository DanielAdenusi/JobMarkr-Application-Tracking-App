import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./auth/AuthProvider";
import { ToastProvider } from "./components/ToastProvider";
import { AccountSettingsProvider } from "./context/AccountSettingsContext";
import { PageTitle } from "./components/PageTitle";

import App from "./App";
import "./main.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<PageTitle />

			<AuthProvider>
				<AccountSettingsProvider>
					<ToastProvider>
						<App />
					</ToastProvider>
				</AccountSettingsProvider>
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>,
);

if (import.meta.env.PROD && "serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker.register("/service-worker.js").catch(() => {
			// The app remains usable if browser policy or local dev blocks registration.
		});
	});
}
