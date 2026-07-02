import type { ApplicationStatus } from "./applicationOptions";

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
	wishlist: "Wishlist",
	saved: "Saved",
	applied: "Applied",
	assessment: "Assessment",
	interviewing: "Interviewing",
	offer: "Offer",
	rejected: "Rejected",
	withdrawn: "Withdrawn",
};

export const applicationStatusBadgeClasses: Record<ApplicationStatus, string> =
	{
		wishlist: "bg-sky-50 text-sky-700 ring-sky-200",
		saved: "bg-cyan-50 text-cyan-700 ring-cyan-200",
		applied: "bg-indigo-50 text-indigo-700 ring-indigo-200",
		assessment: "bg-violet-50 text-violet-700 ring-violet-200",
		interviewing: "bg-amber-50 text-amber-700 ring-amber-200",
		offer: "bg-emerald-50 text-emerald-700 ring-emerald-200",
		rejected: "bg-rose-50 text-rose-700 ring-rose-200",
		withdrawn: "bg-zinc-50 text-zinc-700 ring-zinc-200",
	};

export const applicationStatusColumnClasses: Record<ApplicationStatus, string> =
	{
		wishlist: "border-slate-200 border-t-4 border-t-sky-300 bg-white",
		saved: "border-slate-200 border-t-4 border-t-cyan-300 bg-white",
		applied: "border-slate-200 border-t-4 border-t-indigo-300 bg-white",
		assessment:
			"border-slate-200 border-t-4 border-t-violet-400 bg-white",
		interviewing: "border-slate-200 border-t-4 border-t-amber-300 bg-white",
		offer: "border-slate-200 border-t-4 border-t-emerald-300 bg-white",
		rejected: "border-slate-200 border-t-4 border-t-rose-300 bg-white",
		withdrawn: "border-slate-200 border-t-4 border-t-zinc-300 bg-white",
	};
