import { useState } from "react";
import { useNavigate } from "react-router";
import { ApplicationForm } from "../components/ApplicationForm";
import { createApplication } from "../services/applicationsApi";
import type { CreateApplicationInput } from "../types/application";
import { PageHeading } from "../components/PageHeading";

export function NewApplicationPage() {
	const navigate = useNavigate();

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(data: CreateApplicationInput) {
		try {
			setError(null);
			setIsSubmitting(true);

			const application = await createApplication(data);

			navigate(`/applications/${application.id}`);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Failed to create application",
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<section className="grid gap-6">
			<PageHeading
				eyebrow="Applications"
				title="New application"
				description="Add a new job application to your tracker."
			/>
			<ApplicationForm
				mode="create"
				error={error}
				isSubmitting={isSubmitting}
				onSubmit={handleSubmit}
			/>
		</section>
	);
}
