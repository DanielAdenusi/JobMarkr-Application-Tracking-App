import { adminAuth } from "../config/firebaseAdmin.js";
import { pool } from "../db/pool.js";

export async function revokeUserSessions(firebaseUid) {
	await adminAuth.revokeRefreshTokens(firebaseUid);
}

export async function deleteUserAccount(userId) {
	const result = await pool.query(
		`
    DELETE FROM users
    WHERE id = $1
    RETURNING id
    `,
		[userId],
	);

	return result.rowCount > 0;
}
