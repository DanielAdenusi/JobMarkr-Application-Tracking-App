import { apiFetch } from "../lib/api";

export async function signOutEverywhere() {
	await apiFetch<void>("/user/sessions", {
		method: "DELETE",
	});
}

export async function deleteBackendAccount() {
	await apiFetch<void>("/user/account", {
		method: "DELETE",
	});
}
