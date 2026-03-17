"use client";

import { useState, useEffect, useRef } from "react";
import { PROJECTS } from "@/lib/data";
import { GitHubIcon, ExternalIcon } from "@/components/Icons";

// ─── Live preview ──────────────────────────────────────────────────────────
// ResizeObserver measures the actual wrapper width every time the layout
// changes and recomputes `scale = containerWidth / 1200` so the iframe
// always fits exactly — no hardcoded breakpoint magic.
function LivePreview({ url, title }: { url: string; title: string }) {
	const [blocked, setBlocked] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const [scale, setScale] = useState(0.25); // initial desktop guess
	const wrapRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!wrapRef.current) return;
		const ro = new ResizeObserver((entries) => {
			const w = entries[0].contentRect.width;
			if (w > 0) setScale(w / 1200); // 1200 = iframe rendered width
		});
		ro.observe(wrapRef.current);
		return () => ro.disconnect();
	}, []);

	// visible height tracks the scale so there's no dead space below
	const visibleH = Math.max(160, Math.round(scale * 960));

	// ── No URL ──
	if (url === "#") {
		return (
			<div ref={wrapRef} style={{ width: "100%" }}>
				<div
					style={{
						width: "100%",
						height: visibleH,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						gap: 10,
						background: "var(--bg3)",
						border: "1px dashed rgba(255,255,255,0.12)",
						borderRadius: 12,
						padding: "2rem",
					}}
				>
					<span style={{ fontSize: "1.6rem" }}>🚧</span>
					<p
						style={{
							fontFamily: "var(--FM)",
							fontSize: "0.65rem",
							color: "var(--faint)",
							letterSpacing: "0.08em",
							textAlign: "center",
						}}
					>
						Live demo coming soon
					</p>
				</div>
			</div>
		);
	}

	// ── Blocked by X-Frame-Options ──
	if (blocked) {
		return (
			<div ref={wrapRef} style={{ width: "100%" }}>
				<a
					href={url}
					target="_blank"
					rel="noreferrer"
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						gap: 12,
						width: "100%",
						height: visibleH,
						background: "var(--bg3)",
						border: "1px solid var(--bdr2)",
						borderRadius: 12,
						textDecoration: "none",
						padding: "2rem",
						transition: "border-color .2s",
					}}
					onMouseEnter={(e) =>
						((e.currentTarget as HTMLElement).style.borderColor =
							"rgba(34,211,238,0.35)")
					}
					onMouseLeave={(e) =>
						((e.currentTarget as HTMLElement).style.borderColor = "var(--bdr2)")
					}
				>
					<span style={{ fontSize: "2rem" }}>🔗</span>
					<p
						style={{
							fontFamily: "var(--FM)",
							fontSize: "0.7rem",
							color: "var(--cyan)",
							textAlign: "center",
						}}
					>
						Click to open live site
					</p>
					<p
						style={{
							fontFamily: "var(--FM)",
							fontSize: "0.6rem",
							color: "var(--faint)",
							textAlign: "center",
						}}
					>
						{new URL(url).hostname}
					</p>
				</a>
			</div>
		);
	}

	// ── Live iframe ──
	return (
		<div ref={wrapRef} style={{ width: "100%" }}>
			<div
				style={{
					width: "100%",
					height: visibleH, // exact: no dead space, no overflow
					borderRadius: 12,
					overflow: "hidden",
					border: "1px solid var(--bdr2)",
					background: "var(--bg3)",
					position: "relative",
				}}
			>
				{/* Skeleton shimmer while loading */}
				{!loaded && (
					<div
						style={{
							position: "absolute",
							inset: 0,
							background:
								"linear-gradient(90deg, var(--bg2) 0%, var(--bg3) 50%, var(--bg2) 100%)",
							backgroundSize: "200% 100%",
							animation: "skeletonSlide 1.4s ease infinite",
							zIndex: 2,
						}}
					/>
				)}

				{/*
          iframe: always rendered at 1200×960. Scaled down by ResizeObserver-
          computed value so it fills the container width exactly.
          transformOrigin: top left is essential — without it the iframe
          scales from centre and bleeds outside the box.
        */}
				<iframe
					src={url}
					title={`${title} live preview`}
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: 1200,
						height: 960,
						border: "none",
						transformOrigin: "top left",
						transform: `scale(${scale})`,
						pointerEvents: "none",
					}}
					sandbox="allow-scripts allow-same-origin"
					loading="lazy"
					onLoad={() => setLoaded(true)}
					onError={() => setBlocked(true)}
				/>

				{/* Transparent click overlay — opens the live site */}
				<a
					href={url}
					target="_blank"
					rel="noreferrer"
					style={{
						position: "absolute",
						inset: 0,
						zIndex: 3,
						display: "block",
					}}
					aria-label={`Open ${title} live`}
				/>

				{/* LIVE badge */}
				<div
					style={{
						position: "absolute",
						bottom: 8,
						right: 8,
						zIndex: 4,
						display: "flex",
						alignItems: "center",
						gap: 5,
						fontFamily: "var(--FM)",
						fontSize: "0.56rem",
						letterSpacing: "0.1em",
						color: "var(--green)",
						background: "rgba(6,10,17,0.88)",
						border: "1px solid rgba(74,222,128,0.25)",
						padding: "3px 8px",
						borderRadius: 100,
						backdropFilter: "blur(6px)",
					}}
				>
					<span
						style={{
							width: 5,
							height: 5,
							borderRadius: "50%",
							background: "var(--green)",
							display: "block",
						}}
					/>
					LIVE
				</div>
			</div>

			<style>{`
        @keyframes skeletonSlide {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
		</div>
	);
}

// ─── Main component ────────────────────────────────────────────────────────
export default function Projects() {
	return (
		<section className="section" id="projects">
			<p className="eyebrow rv">// selected work</p>
			<h2 className="s-title rv">Projects</h2>
			<div className="s-bar rv" />

			<div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
				{PROJECTS.map((p, i) => (
					<div
						key={p.num}
						className={`card rv d${(i % 3) + 1}`}
						style={{ padding: 0, overflow: "hidden" }}
					>
						<div className="card-shimmer" />

						<div className="proj-layout">
							{/* ── Info column ── */}
							<div style={{ padding: "1.75rem 2rem", flex: 1, minWidth: 0 }}>
								{/* header */}
								<div
									style={{
										display: "flex",
										alignItems: "baseline",
										gap: 10,
										flexWrap: "wrap",
										marginBottom: "0.5rem",
									}}
								>
									<span
										style={{
											fontFamily: "var(--FM)",
											fontSize: "0.65rem",
											color: "var(--sub)",
											fontWeight: 400,
										}}
									>
										{p.num}
									</span>
									<span
										style={{
											fontFamily: "'Syne',sans-serif",
											fontSize: "1.12rem",
											fontWeight: 700,
											color: "var(--text)",
										}}
									>
										{p.title}
									</span>
									<span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
										— {p.subtitle}
									</span>
									{p.featured && (
										<span
											style={{
												fontFamily: "var(--FM)",
												fontSize: "0.6rem",
												letterSpacing: "0.1em",
												padding: "2px 10px",
												borderRadius: 100,
												background: "var(--cyan10)",
												border: "1px solid var(--cyan20)",
												color: "var(--cyan)",
											}}
										>
											FEATURED
										</span>
									)}
								</div>

								<p
									style={{
										fontSize: "0.87rem",
										lineHeight: 1.8,
										color: "var(--sub)",
										fontWeight: 300,
										marginBottom: "1rem",
									}}
								>
									{p.longDesc}
								</p>

								<div
									style={{
										display: "flex",
										flexWrap: "wrap",
										gap: 6,
										marginBottom: "1rem",
									}}
								>
									{p.stack.map((s) => (
										<span
											key={s}
											className="skill-pill"
											style={{ fontSize: "0.63rem", padding: "3px 10px" }}
										>
											{s}
										</span>
									))}
								</div>

								<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
									<span
										style={{
											fontFamily: "var(--FM)",
											fontSize: "0.63rem",
											color: "var(--muted)",
										}}
									>
										{p.date}
									</span>
									<a
										href={p.githubUrl}
										target="_blank"
										rel="noreferrer"
										className="icon-btn"
										title="GitHub"
										style={{ width: 30, height: 30 }}
									>
										<GitHubIcon size={13} />
									</a>
									<a
										href={p.liveUrl}
										target="_blank"
										rel="noreferrer"
										className="icon-btn"
										title="Live Demo"
										style={{ width: 30, height: 30 }}
									>
										<ExternalIcon size={12} />
									</a>
								</div>
							</div>

							{/* ── Preview column — visible on ALL screen sizes ── */}
							<div className="proj-preview-col">
								<LivePreview url={p.liveUrl} title={p.title} />
							</div>
						</div>
					</div>
				))}
			</div>

			<style>{`
        /* Desktop: info left, preview right */
        .proj-layout {
          display: grid;
          grid-template-columns: 1fr 300px;
          align-items: stretch;
        }
        .proj-preview-col {
          padding: 1.5rem 1.5rem 1.5rem 0;
          display: flex;
          align-items: center;
        }

        /* Tablet / mobile: stack, preview goes below info.
           ResizeObserver measures the new full width and rescales the
           iframe automatically — no extra code needed.              */
        @media (max-width: 860px) {
          .proj-layout          { grid-template-columns: 1fr; }
          .proj-preview-col     { padding: 0 1.5rem 1.5rem !important; width: 100%; }
        }
      `}</style>
		</section>
	);
}
