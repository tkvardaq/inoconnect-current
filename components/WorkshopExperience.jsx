import { useEffect, useRef, useState, useMemo, useCallback, startTransition } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

/**
 * InoConnect WorkshopExperience Component
 * Cyber-futuristic interactive workshop engine with dark glassmorphism,
 * dynamic magnetic lighting, 3D tilt cards, rotating conic gradient border beam,
 * and central holographic nexus core.
 */
export default function WorkshopExperience({
    primaryColor = "#4169E1",
    accentColor = "#FF7518",
    glowColor = "#44D7A8",
    backgroundColor = "#07090E",
    particleCount = 30,
    enableSphere = true,
    headingFont = { fontFamily: "'Outfit', sans-serif", fontWeight: 800 },
    bodyFont = { fontFamily: "'Outfit', sans-serif", fontWeight: 400 },
    cards = null
}) {
    const containerRef = useRef(null);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [sphereHovered, setSphereHovered] = useState(false);
    const [activeModeIndex, setActiveModeIndex] = useState(0);
    const [particles, setParticles] = useState([]);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 200 });
    const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 200 });

    const modes = [
        { label: "Active Nexus: 99.4% Attribution Confidence", color: glowColor },
        { label: "Agentic Loop: 24/7 Autonomous Pipeline", color: primaryColor },
        { label: "Predictive Bidding: Sub-Second ML Routing", color: accentColor }
    ];

    // Initialize floating particles
    useEffect(() => {
        const newParticles = Array.from({ length: particleCount }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2.5 + 1.2,
            delay: Math.random() * 5
        }));
        startTransition(() => setParticles(newParticles));
    }, [particleCount]);

    // Track mouse movement for magnetic spotlight
    const handleMouseMove = useCallback((e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    }, [mouseX, mouseY]);

    // Default InoConnect strategic cards
    const defaultCards = useMemo(() => [
        {
            id: 1,
            tag: "Algorithmic Search",
            title: "Neural SEO & AEO",
            subtitle: "Autonomous Entity & Knowledge Graph Dominance",
            icon: "◈",
            color: primaryColor,
            metric: "99.8% Indexing Rate",
            actionPill: "✨ Generative Engine Optimization",
            href: "/services/seo"
        },
        {
            id: 2,
            tag: "Machine Learning",
            title: "Predictive PPC",
            subtitle: "Sub-Second Automated Bidding & Target ROAS Routing",
            icon: "◊",
            color: accentColor,
            metric: "4.2x ROAS Floor",
            actionPill: "⚡ Real-Time ML Bid Router",
            href: "/services/ppc"
        },
        {
            id: 3,
            tag: "Pipeline Automation",
            title: "Autonomous AI Agents",
            subtitle: "24/7 Agentic Lead Qualification & CRM Orchestration",
            icon: "◉",
            color: glowColor,
            metric: "2.4s Response Time",
            actionPill: "🤖 24/7 Multi-Agent Worker",
            href: "/services/ai-automation"
        },
        {
            id: 4,
            tag: "Conversion Science",
            title: "Neuro-CRO Engine",
            subtitle: "Dynamic Personalization & Frictionless Funnel Flows",
            icon: "◭",
            color: "#8DA7F5",
            metric: "+68% Funnel Velocity",
            actionPill: "🚀 Dynamic Conversion Flow",
            href: "/services/web-development"
        },
        {
            id: 5,
            tag: "Data Sovereignty",
            title: "Attribution Nexus",
            subtitle: "100% Owned Accounts, Multi-Touch Causal Modeling",
            icon: "◬",
            color: "#00FFFF",
            metric: "100% Client Sovereignty",
            actionPill: "🔒 Zero Vendor Lock-in",
            href: "/about"
        }
    ], [primaryColor, accentColor, glowColor]);

    const activeCards = cards || defaultCards;

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            style={{
                width: "100%",
                minHeight: "780px",
                position: "relative",
                overflow: "hidden",
                backgroundColor,
                borderRadius: "2.5rem",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 25px 80px -20px rgba(0,0,0,0.85)",
                fontFamily: bodyFont.fontFamily,
                padding: "3rem 1.5rem"
            }}
        >
            {/* Ambient Shifting Background Glow */}
            <motion.div
                animate={{
                    background: [
                        `radial-gradient(circle at 20% 30%, ${primaryColor}18 0%, transparent 60%)`,
                        `radial-gradient(circle at 80% 70%, ${accentColor}15 0%, transparent 60%)`,
                        `radial-gradient(circle at 50% 50%, ${glowColor}18 0%, transparent 60%)`,
                        `radial-gradient(circle at 20% 30%, ${primaryColor}18 0%, transparent 60%)`
                    ]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                style={{ position: "absolute", inset: 0, opacity: 0.7, pointerEvents: "none" }}
            />

            {/* Magnetic Spotlight Cursor Follower */}
            <motion.div
                style={{
                    position: "absolute",
                    width: 500,
                    height: 500,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${glowColor}12 0%, ${primaryColor}06 40%, transparent 70%)`,
                    pointerEvents: "none",
                    x: smoothMouseX,
                    y: smoothMouseY,
                    translateX: "-50%",
                    translateY: "-50%",
                    zIndex: 1
                }}
            />

            {/* Floating Particle Field */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: [0, 0.85, 0],
                        y: ["0%", "-100%"],
                        x: [0, Math.sin(p.id) * 45]
                    }}
                    transition={{
                        duration: 8 + Math.random() * 4,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "linear"
                    }}
                    style={{
                        position: "absolute",
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        borderRadius: "50%",
                        background: glowColor,
                        boxShadow: `0 0 ${p.size * 3}px ${glowColor}`,
                        pointerEvents: "none",
                        zIndex: 2
                    }}
                />
            ))}

            {/* Central Interactive Holographic Core / Sphere */}
            {enableSphere && (
                <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "3rem" }}>
                    <motion.div
                        onHoverStart={() => startTransition(() => setSphereHovered(true))}
                        onHoverEnd={() => startTransition(() => setSphereHovered(false))}
                        onClick={() => setActiveModeIndex((prev) => (prev + 1) % modes.length)}
                        style={{
                            position: "relative",
                            width: 130,
                            height: 130,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        {/* Core Sphere Body */}
                        <motion.div
                            animate={{
                                scale: sphereHovered ? 1.18 : 1,
                                rotate: sphereHovered ? 180 : 0
                            }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                                background: `radial-gradient(circle at 35% 35%, ${glowColor}40, ${primaryColor}25, rgba(10, 15, 30, 0.9))`,
                                backdropFilter: "blur(24px)",
                                WebkitBackdropFilter: "blur(24px)",
                                border: `2px solid ${glowColor}70`,
                                boxShadow: `0 0 50px ${glowColor}70, inset 0 0 35px ${glowColor}40, 0 0 90px ${primaryColor}40`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "relative"
                            }}
                        >
                            {/* Inner spinning geometry */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                                style={{
                                    position: "absolute",
                                    inset: 12,
                                    borderRadius: "50%",
                                    border: `1.5px dashed ${accentColor}80`
                                }}
                            />
                            <motion.div
                                animate={{ scale: [0.9, 1.2, 0.9] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                style={{
                                    width: 22,
                                    height: 22,
                                    borderRadius: "50%",
                                    background: "#ffffff",
                                    boxShadow: `0 0 25px ${glowColor}, 0 0 45px ${primaryColor}`
                                }}
                            />
                        </motion.div>

                        {/* Expanding Shockwaves on Hover */}
                        <AnimatePresence>
                            {sphereHovered && [0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 1, opacity: 0.85 }}
                                    animate={{ scale: 2.8, opacity: 0 }}
                                    exit={{ scale: 1, opacity: 0 }}
                                    transition={{ duration: 1.6, delay: i * 0.3, repeat: Infinity }}
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        borderRadius: "50%",
                                        border: `2px solid ${glowColor}`,
                                        pointerEvents: "none"
                                    }}
                                />
                            ))}
                        </AnimatePresence>

                        {/* Orbiting Satellites on Hover */}
                        <AnimatePresence>
                            {sphereHovered && [0, 1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 3.5, repeat: Infinity, ease: "linear", delay: i * 0.25 }}
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        width: 220,
                                        height: 220,
                                        x: "-50%",
                                        y: "-50%",
                                        pointerEvents: "none"
                                    }}
                                >
                                    <motion.div
                                        animate={{ scale: [1, 1.3, 1] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: "50%",
                                            x: "-50%",
                                            width: 14,
                                            height: 14,
                                            borderRadius: "50%",
                                            background: i % 2 === 0 ? accentColor : glowColor,
                                            boxShadow: `0 0 20px ${i % 2 === 0 ? accentColor : glowColor}`
                                        }}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {/* Mode Status Badge */}
                    <div
                        style={{
                            marginTop: "1.25rem",
                            padding: "0.4rem 1.2rem",
                            borderRadius: "9999px",
                            background: "rgba(255,255,255,0.05)",
                            border: `1px solid ${modes[activeModeIndex].color}80`,
                            color: modes[activeModeIndex].color,
                            fontSize: "0.82rem",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            boxShadow: `0 0 25px ${modes[activeModeIndex].color}40`,
                            transition: "all 0.3s ease"
                        }}
                    >
                        {modes[activeModeIndex].label}
                    </div>
                </div>
            )}

            {/* 3D Modular Cards Grid */}
            <div
                style={{
                    position: "relative",
                    zIndex: 10,
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "1.5rem",
                    maxWidth: "1400px",
                    margin: "0 auto"
                }}
            >
                {activeCards.map((card) => {
                    const isHovered = hoveredCard === card.id;

                    return (
                        <motion.a
                            key={card.id}
                            href={card.href}
                            onHoverStart={() => startTransition(() => setHoveredCard(card.id))}
                            onHoverEnd={() => startTransition(() => setHoveredCard(null))}
                            animate={{
                                y: isHovered ? -8 : 0,
                                scale: isHovered ? 1.04 : 1,
                                rotateY: isHovered ? 6 : 0,
                                rotateX: isHovered ? -6 : 0
                            }}
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                            style={{
                                position: "relative",
                                height: "350px",
                                cursor: "pointer",
                                transformStyle: "preserve-3d",
                                perspective: 1000,
                                textDecoration: "none",
                                outline: "none"
                            }}
                        >
                            {/* Card Background & Borders */}
                            <div
                                style={{
                                    position: "relative",
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "1.5rem",
                                    background: `linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(10, 15, 30, 0.92) 100%)`,
                                    backdropFilter: "blur(20px)",
                                    WebkitBackdropFilter: "blur(20px)",
                                    border: `1px solid ${isHovered ? card.color : "rgba(255,255,255,0.08)"}`,
                                    boxShadow: isHovered
                                        ? `0 25px 60px -10px rgba(0,0,0,0.7), 0 0 50px -5px ${card.color}50`
                                        : "0 10px 30px rgba(0,0,0,0.4)",
                                    padding: "1.75rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    boxSizing: "border-box",
                                    overflow: "hidden",
                                    transition: "border 0.3s ease, box-shadow 0.3s ease"
                                }}
                            >
                                {/* Top Area: Icon and Tag */}
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                                        <motion.div
                                            animate={{
                                                rotateY: isHovered ? 360 : 0,
                                                scale: isHovered ? 1.15 : 1
                                            }}
                                            transition={{ duration: 0.6 }}
                                            style={{
                                                fontSize: "2.5rem",
                                                color: card.color,
                                                textShadow: `0 0 20px ${card.color}`
                                            }}
                                        >
                                            {card.icon}
                                        </motion.div>
                                        <span
                                            style={{
                                                fontSize: "0.68rem",
                                                fontWeight: 800,
                                                textTransform: "uppercase",
                                                letterSpacing: "0.1em",
                                                color: card.color,
                                                background: "rgba(255,255,255,0.05)",
                                                padding: "0.25rem 0.65rem",
                                                borderRadius: "9999px",
                                                border: "1px solid rgba(255,255,255,0.08)"
                                            }}
                                        >
                                            {card.tag}
                                        </span>
                                    </div>

                                    <h3
                                        style={{
                                            margin: 0,
                                            fontSize: "1.3rem",
                                            fontWeight: 800,
                                            color: "#ffffff",
                                            letterSpacing: isHovered ? "0.02em" : "-0.01em",
                                            textShadow: isHovered ? `0 0 12px ${card.color}` : "none",
                                            transition: "all 0.3s ease",
                                            ...headingFont
                                        }}
                                    >
                                        {card.title}
                                    </h3>
                                    <p
                                        style={{
                                            margin: "0.5rem 0 0 0",
                                            fontSize: "0.85rem",
                                            color: isHovered ? "#cbd5e1" : "#94a3b8",
                                            lineHeight: 1.45,
                                            transition: "color 0.3s ease"
                                        }}
                                    >
                                        {card.subtitle}
                                    </p>
                                </div>

                                {/* Bottom Area: Metric & Energy Bar */}
                                <div>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            fontSize: "0.75rem",
                                            fontWeight: 700,
                                            color: "#e2e8f0",
                                            marginBottom: "0.6rem"
                                        }}
                                    >
                                        <span>Capacity Meter</span>
                                        <span style={{ color: card.color }}>{card.metric}</span>
                                    </div>
                                    <div
                                        style={{
                                            width: "100%",
                                            height: 4,
                                            borderRadius: 2,
                                            background: "rgba(255,255,255,0.1)",
                                            overflow: "hidden"
                                        }}
                                    >
                                        <motion.div
                                            animate={{ width: isHovered ? "100%" : "45%" }}
                                            transition={{ duration: 0.6 }}
                                            style={{
                                                height: "100%",
                                                background: card.color,
                                                boxShadow: `0 0 12px ${card.color}`
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Floating Action Badge on Hover */}
                            <AnimatePresence>
                                {isHovered && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 0, scale: 0.85 }}
                                        animate={{ opacity: 1, y: -30, scale: 1 }}
                                        exit={{ opacity: 0, y: 0, scale: 0.85 }}
                                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: "50%",
                                            x: "-50%",
                                            background: "linear-gradient(135deg, rgba(20, 25, 45, 0.98), rgba(10, 15, 30, 0.98))",
                                            border: `1px solid ${card.color}`,
                                            borderRadius: "9999px",
                                            padding: "0.35rem 0.9rem",
                                            fontSize: "0.72rem",
                                            fontWeight: 800,
                                            color: "#ffffff",
                                            boxShadow: `0 10px 30px rgba(0,0,0,0.8), 0 0 25px ${card.color}50`,
                                            whiteSpace: "nowrap",
                                            pointerEvents: "none",
                                            zIndex: 20
                                        }}
                                    >
                                        {card.actionPill}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.a>
                    );
                })}
            </div>
        </div>
    );
}
