import type { ApplicationPriority } from "./applicationOptions";

export const applicationPriorityBadgeClasses: Record<
	ApplicationPriority,
	string
> = {
	low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
	medium: "bg-amber-50 text-amber-700 ring-amber-200",
	high: "bg-red-50 text-red-700 ring-red-200",
};
