import {
	deleteUserAccount,
	revokeUserSessions,
} from "../services/account.service.js";

export async function revokeUserSessionsController(req, res, next) {
	try {
		await revokeUserSessions(req.user.firebase_uid);

		res.status(204).send();
	} catch (error) {
		next(error);
	}
}

export async function deleteUserAccountController(req, res, next) {
	try {
		const deleted = await deleteUserAccount(req.user.id);

		if (!deleted) {
			return res.status(404).json({
				message: "User account not found",
			});
		}

		res.status(204).send();
	} catch (error) {
		next(error);
	}
}
