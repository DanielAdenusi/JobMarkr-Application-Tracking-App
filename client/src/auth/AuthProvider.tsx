import {
	type ReactNode,
	createContext,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { type User } from "firebase/auth";
import {
	beginEmailChange,
	changeCurrentPassword,
	completeGoogleRedirectLogin,
	deleteCurrentUser,
	listenToAuthChanges,
	loginWithEmail,
	loginWithGoogle,
	logout,
	reauthenticateCurrentUser,
	refreshCurrentUser,
	sendPasswordReset,
	sendVerificationEmail,
	signUpWithEmail,
} from "../services/authenticationApi";

type AuthContextValue = {
	user: User | null;
	isAuthLoading: boolean;
	loginWithEmail: (email: string, password: string) => Promise<void>;
	loginWithGoogle: () => Promise<User | null>;
	signUpWithEmail: (email: string, password: string) => Promise<void>;
	sendPasswordReset: (email: string) => Promise<void>;
	sendVerificationEmail: () => Promise<void>;
	refreshUser: () => Promise<void>;
	changePassword: (
		currentPassword: string,
		newPassword: string,
	) => Promise<void>;
	changeEmail: (newEmail: string, password?: string) => Promise<void>;
	reauthenticate: (password?: string) => Promise<void>;
	deleteAccount: () => Promise<void>;
	logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
	children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [isAuthLoading, setIsAuthLoading] = useState(true);

	useEffect(() => {
		void completeGoogleRedirectLogin();

		const unsubscribe = listenToAuthChanges((firebaseUser) => {
			setUser(firebaseUser);
			setIsAuthLoading(false);
		});

		return unsubscribe;
	}, []);

	const handleLoginWithEmail = useCallback(
		async (email: string, password: string) => {
			await loginWithEmail(email, password);
		},
		[],
	);

	const handleLoginWithGoogle = useCallback(async () => {
		return loginWithGoogle();
	}, []);

	const handleSignUpWithEmail = useCallback(
		async (email: string, password: string) => {
			await signUpWithEmail(email, password);
		},
		[],
	);

	const handleSendPasswordReset = useCallback(async (email: string) => {
		await sendPasswordReset(email);
	}, []);

	const handleSendVerificationEmail = useCallback(async () => {
		await sendVerificationEmail();
	}, []);

	const handleRefreshUser = useCallback(async () => {
		const refreshedUser = await refreshCurrentUser();
		setUser(refreshedUser);
	}, []);

	const handleChangePassword = useCallback(
		async (currentPassword: string, newPassword: string) => {
			await changeCurrentPassword(currentPassword, newPassword);
		},
		[],
	);

	const handleChangeEmail = useCallback(
		async (newEmail: string, password?: string) => {
			await beginEmailChange(newEmail, password);
		},
		[],
	);

	const handleReauthenticate = useCallback(async (password?: string) => {
		await reauthenticateCurrentUser(password);
	}, []);

	const handleDeleteAccount = useCallback(async () => {
		await deleteCurrentUser();
		setUser(null);
	}, []);

	const handleLogout = useCallback(async () => {
		await logout();
	}, []);

	const value = useMemo(
		() => ({
			user,
			isAuthLoading,
			loginWithEmail: handleLoginWithEmail,
			loginWithGoogle: handleLoginWithGoogle,
			signUpWithEmail: handleSignUpWithEmail,
			sendPasswordReset: handleSendPasswordReset,
			sendVerificationEmail: handleSendVerificationEmail,
			refreshUser: handleRefreshUser,
			changePassword: handleChangePassword,
			changeEmail: handleChangeEmail,
			reauthenticate: handleReauthenticate,
			deleteAccount: handleDeleteAccount,
			logout: handleLogout,
		}),
		[
			user,
			isAuthLoading,
			handleLoginWithEmail,
			handleLoginWithGoogle,
			handleSignUpWithEmail,
			handleSendPasswordReset,
			handleSendVerificationEmail,
			handleRefreshUser,
			handleChangePassword,
			handleChangeEmail,
			handleReauthenticate,
			handleDeleteAccount,
			handleLogout,
		],
	);

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}
