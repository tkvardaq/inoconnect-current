import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * InoConnect AdvancedBentoGrid Component
 * Asymmetric responsive bento grid with dynamic col/row spans,
 * luminous accent hover outlines, background image zooms,
 * and category filtering.
 */
export default function AdvancedBentoGrid({
    items = null,
    gridGap = 16,
    rowHeight = 155,
    cornerRadius = 24,
    globalBackground = "#080A11",
    borderColor = "rgba(255, 255, 255, 0.08)",
    accentColor = "#4169E1",
    showFilterTabs = true,
    fontFamily = "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif"
}) {
    const defaultItems = [
        {
            id: "ai-auto",
            title: "Autonomous AI Agents & Pipelines",
            description: "Full-funnel 24/7 lead qualification, multi-agent CRM orchestration, and automated deal pipeline routing.",
            badge: "Operational 24/7",
            imageUrl: "/images/stock/1551288049-bebda4e38f71.webp",
            accentColor: "#44D7A8",
            statValue: "+318%",
            statLabel: "Pipeline Velocity",
            colSpan: 2,
            rowSpan: 2,
            category: "ai",
            href: "/services/ai-automation"
        },
        {
            id: "seo",
            title: "Enterprise SEO & Generative Engine (AEO)",
            description: "Dominate Google AI Overviews, Perplexity, and Claude with semantic topic authority and entity-first schema.",
            badge: "Search Dominance",
            imageUrl: "/images/stock/1562577309-4932fdd64cd1.webp",
            accentColor: "#4169E1",
            statValue: "84%",
            statLabel: "Top 3 Rank Rate",
            colSpan: 2,
            rowSpan: 1,
            category: "organic",
            href: "/services/seo"
        },
        {
            id: "ppc",
            title: "Predictive PPC & Media",
            description: "Algorithmic bidding across Google, Meta, and LinkedIn with predictive CAC modeling.",
            badge: "Target ROAS",
            imageUrl: "/images/stock/1460925895917-afdab827c52f.webp",
            accentColor: "#FF7518",
            statValue: "4.2x",
            statLabel: "ROAS Floor",
            colSpan: 1,
            rowSpan: 1,
            category: "media",
            href: "/services/ppc"
        },
        {
            id: "webdev",
            title: "Sub-Second Web Speed",
            description: "Core Web Vitals architecture engineered for conversion velocity.",
            badge: "< 0.4s LCP",
            imageUrl: "/images/stock/1581291518857-4e27b48ff24e.webp",
            accentColor: "#8DA7F5",
            statValue: "99+",
            statLabel: "Lighthouse Score",
            colSpan: 1,
            rowSpan: 1,
            category: "ai",
            href: "/services/web-development"
        },
        {
            id: "data",
            title: "100% Data Sovereignty Nexus",
            description: "You own all ad accounts, conversion data, and tracking pixels with zero vendor lock-in.",
            badge: "Full Ownership",
            imageUrl: "",
            accentColor: "#00FFFF",
            statValue: "100%",
            statLabel: "Client Sovereignty",
            colSpan: 2,
            rowSpan: 1,
            category: "media",
            href: "/about"
        },
        {
            id: "content",
            title: "Authority Content Velocity",
            description: "High-conviction technical articles, whitepapers, and viral video assets that convert B2B buyers.",
            badge: "Demand Gen",
            imageUrl: "/images/stock/1542744094-3a31f272c490.webp",
            accentColor: "#FF7518",
            statValue: "+190%",
            statLabel: "Organic Pipeline",
            colSpan: 2,
            rowSpan: 1,
            category: "organic",
            href: "/services/content-marketing"
        }
    ];

    const safeItems = Array.isArray(items) && items.length > 0 ? items : defaultItems;
    const [hoveredId, setHoveredId] = useState(null);
    const [activeFilter, setActiveFilter] = useState("all");

    const categories = [
        { id: "all", label: "All Capabilities" },
        { id: "ai", label: "AI & Automation" },
        { id: "media", label: "Paid Media & PPC" },
        { id: "organic", label: "Organic & Content" }
    ];

    const filteredItems = safeItems.filter(item => {
        if (activeFilter === "all") return true;
        return item.category === activeFilter;
    });

    return (
        <div
            style={{
                width: "100%",
                backgroundColor: globalBackground,
                borderRadius: `${cornerRadius + 8}px`,
                border: `1px solid ${borderColor}`,
                padding: "2.5rem",
                boxSizing: "border-box",
                fontFamily,
                boxShadow: "0 25px 80px -20px rgba(0,0,0,0.85)"
            }}
        >
            {/* Header / Filter Tabs */}
            {showFilterTabs && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "2.5rem" }}>
                    <div
                        style={{
                            display: "flex",
                            gap: "0.5rem",
                            background: "rgba(255,255,255,0.04)",
                            padding: "0.35rem",
                            borderRadius: "9999px",
                            border: `1px solid ${borderColor}`,
                            flexWrap: "wrap",
                            justifyContent: "center"
                        }}
                    >
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveFilter(cat.id)}
                                style={{
                                    border: "none",
                                    background: activeFilter === cat.id ? accentColor : "transparent",
                                    color: activeFilter === cat.id ? "#ffffff" : "#94a3b8",
                                    padding: "0.5rem 1.25rem",
                                    borderRadius: "9999px",
                                    fontSize: "0.82rem",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    transition: "all 0.25s ease",
                                    boxShadow: activeFilter === cat.id ? `0 4px 20px ${accentColor}66` : "none"
                                }}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Bento Grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gridAutoRows: `${rowHeight}px`,
                    gap: `${gridGap}px`
                }}
            >
                <AnimatePresence>
                    {filteredItems.map(item => {
                        const isHovered = hoveredId === item.id;
                        const cardAccent = item.accentColor || accentColor;
                        const colSpan = Math.min(Math.max(item.colSpan || 2, 1), 4);
                        const rowSpan = Math.min(Math.max(item.rowSpan || 1, 1), 3);
                        const isWide = colSpan >= 2;

                        return (
                            <motion.a
                                key={item.id}
                                href={item.href || "#"}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                onMouseEnter={() => setHoveredId(item.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                style={{
                                    gridColumn: `span ${colSpan}`,
                                    gridRow: `span ${rowSpan}`,
                                    backgroundColor: "#101422",
                                    borderRadius: `${cornerRadius}px`,
                                    border: `1px solid ${borderColor}`,
                                    position: "relative",
                                    overflow: "hidden",
                                    cursor: "pointer",
                                    boxSizing: "border-box",
                                    textDecoration: "none",
                                    color: "#ffffff"
                                }}
                            >
                                {/* Background Image & Zoom */}
                                {item.imageUrl && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            inset: 0,
                                            backgroundImage: `url(${item.imageUrl})`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            opacity: isHovered ? 0.45 : 0.28,
                                            transform: isHovered ? "scale(1.06)" : "scale(1)",
                                            transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease",
                                            zIndex: 0
                                        }}
                                    />
                                )}

                                {/* Gradient Scrim */}
                                <div
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        background: "linear-gradient(180deg, rgba(16, 20, 34, 0.35) 0%, rgba(10, 14, 25, 0.95) 100%)",
                                        zIndex: 1
                                    }}
                                />

                                {/* Accent Wash on Hover */}
                                <div
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        backgroundColor: cardAccent,
                                        opacity: isHovered ? 0.12 : 0,
                                        transition: "opacity 0.3s ease",
                                        pointerEvents: "none",
                                        zIndex: 2
                                    }}
                                />

                                {/* Glowing Accent Border on Hover */}
                                <div
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        border: `1.5px solid ${cardAccent}`,
                                        borderRadius: `${cornerRadius}px`,
                                        boxShadow: `inset 0 0 20px ${cardAccent}40, 0 0 25px ${cardAccent}40`,
                                        opacity: isHovered ? 1 : 0,
                                        transition: "opacity 0.3s ease",
                                        pointerEvents: "none",
                                        zIndex: 4
                                    }}
                                />

                                {/* Content Layer */}
                                <div
                                    style={{
                                        position: "relative",
                                        zIndex: 3,
                                        width: "100%",
                                        height: "100%",
                                        padding: isWide ? "1.5rem" : "1.25rem",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        boxSizing: "border-box"
                                    }}
                                >
                                    {/* Top Bar: Badge & Action Arrow */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                        {item.badge && (
                                            <span
                                                style={{
                                                    fontSize: "0.68rem",
                                                    fontWeight: 800,
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.08em",
                                                    color: cardAccent,
                                                    background: "rgba(255,255,255,0.06)",
                                                    padding: "0.25rem 0.65rem",
                                                    borderRadius: "9999px",
                                                    border: `1px solid ${cardAccent}40`
                                                }}
                                            >
                                                {item.badge}
                                            </span>
                                        )}
                                        <div
                                            style={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: "50%",
                                                background: isHovered ? cardAccent : "rgba(255,255,255,0.06)",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#ffffff",
                                                fontSize: "0.95rem",
                                                transform: isHovered ? "translate(3px, -3px) rotate(-45deg)" : "none",
                                                boxShadow: isHovered ? `0 0 15px ${cardAccent}` : "none",
                                                transition: "all 0.3s ease"
                                            }}
                                        >
                                            →
                                        </div>
                                    </div>

                                    {/* Bottom Area: Title, Description & Stat */}
                                    <div style={{ marginTop: "auto" }}>
                                        {item.statValue && (
                                            <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.4rem" }}>
                                                <span style={{ fontSize: isWide ? "1.75rem" : "1.4rem", fontWeight: 900, color: cardAccent }}>
                                                    {item.statValue}
                                                </span>
                                                {item.statLabel && (
                                                    <span style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                                        {item.statLabel}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        <h3
                                            style={{
                                                margin: 0,
                                                fontSize: isWide ? "1.25rem" : "1.05rem",
                                                fontWeight: 800,
                                                color: "#ffffff",
                                                lineHeight: 1.3,
                                                letterSpacing: "-0.01em"
                                            }}
                                        >
                                            {item.title}
                                        </h3>
                                        {item.description && (
                                            <p
                                                style={{
                                                    margin: "0.35rem 0 0 0",
                                                    fontSize: "0.82rem",
                                                    color: "#94a3b8",
                                                    lineHeight: 1.45,
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: isWide ? 2 : 1,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden"
                                                }}
                                            >
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.a>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
