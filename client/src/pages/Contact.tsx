import { Clock3, Mail, MessageCircle } from "lucide-react";

import { MarketingFooter } from "../components/MarketingFooter";
import { MarketingNav } from "../components/MarketingNav";
import { Button } from "../components/ui/Button";

function ContactField({
	id,
	label,
	type = "text",
	autoComplete,
}: {
	id: string;
	label: string;
	type?: string;
	autoComplete?: string;
}) {
	return (
		<label
			htmlFor={id}
			className="grid gap-3 text-sm font-black text-(--landing-text)"
		>
			{label}
			<input
				id={id}
				name={id}
				type={type}
				autoComplete={autoComplete}
				required
				className="h-12 rounded-lg border border-(--landing-input-line) bg-(--landing-input-bg) px-4 text-base font-semibold text-(--landing-text) outline-none transition focus:border-(--landing-accent) focus:ring-2 focus:ring-(--landing-accent-ring)"
			/>
		</label>
	);
}

export function ContactPage() {
	return (
		<div className="landing-page min-h-screen bg-(--landing-bg) text-(--landing-text)">
			<MarketingNav />

			<main>
				<section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl gap-12 px-5 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
					<div>
						<div className="inline-flex items-center gap-2 rounded-full border border-(--landing-accent-ring) bg-(--landing-accent-soft) px-4 py-2 text-sm font-black text-(--landing-accent)">
							<MessageCircle size={16} strokeWidth={2.5} />
							Get in touch
						</div>

						<h1 className="mt-8 text-5xl font-black leading-tight tracking-normal sm:text-6xl">
							Contact us
						</h1>
						<p className="mt-6 max-w-md text-lg font-semibold leading-8 text-(--landing-muted)">
							Got a question, spotted a bug, or have a feature
							idea? Send a message and we will get back to you
							soon.
						</p>

						<div className="mt-8 grid gap-4 text-sm font-bold text-(--landing-muted)">
							<div className="flex items-center gap-3">
								<Clock3
									size={18}
									strokeWidth={2.5}
									className="text-(--landing-accent)"
								/>
								We will try to get back to you as soon as
								possible
							</div>
							<div className="flex items-center gap-3">
								<Mail
									size={18}
									strokeWidth={2.5}
									className="text-(--landing-accent)"
								/>
								support@jobmarkr.local
							</div>
						</div>
					</div>

					<form
						action="mailto:support@jobmarkr.local"
						method="post"
						encType="text/plain"
						className="grid gap-7"
					>
						<ContactField
							id="name"
							label="Name"
							autoComplete="name"
						/>
						<ContactField
							id="email"
							label="Email"
							type="email"
							autoComplete="email"
						/>

						<label
							htmlFor="message"
							className="grid gap-3 text-sm font-black text-(--landing-text)"
						>
							Message
							<textarea
								id="message"
								name="message"
								required
								rows={6}
								className="resize-y rounded-lg border border-(--landing-input-line) bg-(--landing-input-bg) px-4 py-3 text-base font-semibold text-(--landing-text) outline-none transition focus:border-(--landing-accent) focus:ring-2 focus:ring-(--landing-accent-ring)"
							/>
						</label>

						<div className="flex justify-end">
							<Button type="submit" variant="primary" size="lg">
								Send message
							</Button>
						</div>
					</form>
				</section>
			</main>

			<MarketingFooter />
		</div>
	);
}
