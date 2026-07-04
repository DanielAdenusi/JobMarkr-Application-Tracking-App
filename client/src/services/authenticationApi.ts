import {
	confirmPasswordReset,
	createUserWithEmailAndPassword,
	deleteUser,
	EmailAuthProvider,
	reauthenticateWithCredential,
	reauthenticateWithPopup,
	sendPasswordResetEmail,
	sendEmailVerification,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
	getRedirectResult,
	onAuthStateChanged,
	reload,
	updatePassword,
	verifyBeforeUpdateEmail,
	verifyPasswordResetCode,
	type User,
} from "firebase/auth";

import { auth, googleProvider } from "../lib/firebase";

export async function loginWithGoogle() {
	const result = await signInWithPopup(auth, googleProvider);
	return result.user;
}

export async function completeGoogleRedirectLogin() {
	const result = await getRedirectResult(auth);
	return result?.user ?? null;
}

export async function loginWithEmail(email: string, password: string) {
	const result = await signInWithEmailAndPassword(auth, email, password);
	return result.user;
}

export async function signUpWithGoogle() {
	const result = await signInWithPopup(auth, googleProvider);
	return result.user;
}

export async function signUpWithEmail(email: string, password: string) {
	const result = await createUserWithEmailAndPassword(auth, email, password);
	await sendEmailVerification(result.user);
	return result.user;
}

export async function sendVerificationEmail() {
	const user = auth.currentUser;

	if (!user) {
		throw new Error("You must be logged in to verify your email.");
	}

	await sendEmailVerification(user);
}

export async function sendPasswordReset(email: string) {
	await sendPasswordResetEmail(auth, email, {
		url: `${window.location.origin}/reset-password`,
	});
}

export async function verifyResetPasswordCode(code: string) {
	return verifyPasswordResetCode(auth, code);
}

export async function confirmResetPassword(code: string, password: string) {
	await confirmPasswordReset(auth, code, password);
}

export async function refreshCurrentUser() {
	const user = auth.currentUser;

	if (!user) {
		throw new Error("You must be logged in to refresh your account.");
	}

	await reload(user);
	return auth.currentUser;
}

export async function changeCurrentPassword(
	currentPassword: string,
	newPassword: string,
) {
	const user = auth.currentUser;

	if (!user?.email) {
		throw new Error("Password changes require an email account.");
	}

	const credential = EmailAuthProvider.credential(
		user.email,
		currentPassword,
	);

	await reauthenticateWithCredential(user, credential);
	await updatePassword(user, newPassword);
}

export async function beginEmailChange(newEmail: string, password?: string) {
	const user = auth.currentUser;

	if (!user) {
		throw new Error("You must be logged in to change your email.");
	}

	await reauthenticateCurrentUser(password);
	await verifyBeforeUpdateEmail(user, newEmail, {
		url: `${window.location.origin}/account/details`,
	});
}

export async function reauthenticateCurrentUser(password?: string) {
	const user = auth.currentUser;

	if (!user) {
		throw new Error("You must be logged in to continue.");
	}

	const providerIds = user.providerData.map((provider) => provider.providerId);

	if (providerIds.includes("password")) {
		if (!user.email || !password) {
			throw new Error("Enter your current password to continue.");
		}

		const credential = EmailAuthProvider.credential(user.email, password);
		await reauthenticateWithCredential(user, credential);
		return;
	}

	if (providerIds.includes("google.com")) {
		await reauthenticateWithPopup(user, googleProvider);
		return;
	}

	throw new Error("This sign-in provider cannot be reauthenticated here.");
}

export async function deleteCurrentUser() {
	const user = auth.currentUser;

	if (!user) {
		throw new Error("You must be logged in to delete your account.");
	}

	await deleteUser(user);
}

export async function logout() {
	await signOut(auth);
}

export function listenToAuthChanges(callback: (user: User | null) => void) {
	return onAuthStateChanged(auth, callback);
}
