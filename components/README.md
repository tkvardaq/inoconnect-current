# InoConnect Interactive UI Components

This library contains the customized implementations of two Framer interactive systems:
1. **`WorkshopExperience`** (`components/WorkshopExperience.jsx`)
2. **`AdvancedBentoGrid`** (`components/AdvancedBentoGrid.jsx`)

Both components are also compiled into pure, zero-dependency HTML5/CSS3/Vanilla JS equivalents in `/assets/framer-components.css` and `/assets/framer-components.js` so they can run directly on static pages without a build server!

---

## 1. WorkshopExperience

An interactive, cyber-futuristic workshop environment featuring:
- **Magnetic Spotlight**: 500px glowing cursor follower tracking mouse coordinates with spring damping.
- **Floating Particle Field**: Ambient particles drifting with sinusoidal sway and neon drop-shadows.
- **Holographic Core Nexus**: Central glowing orb with counter-rotating geometric rings, expanding shockwaves on hover, and 4 orbiting satellites. Clicking the sphere cycles through operational modes.
- **3D Modular Cards**: Interactive cards that tilt with 3D perspective, dynamic conic gradient rotating border beams, 3D rotating icons, expanding capacity energy meters, and floating action badges.

### Props & Customization

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `primaryColor` | `string` | `"#4169E1"` | Royal Blue theme accent |
| `accentColor` | `string` | `"#FF7518"` | Vibrant Orange highlight |
| `glowColor` | `string` | `"#44D7A8"` | Neon Mint / Cyan glow |
| `backgroundColor` | `string` | `"#07090E"` | Deep space dark background |
| `particleCount` | `number` | `30` | Number of floating particles |
| `enableSphere` | `boolean` | `true` | Show/hide the central holographic sphere |
| `cards` | `Array<Card>` | Default cards | Array of custom card objects |

### Card Object Schema

```js
{
  id: 1,
  tag: "Algorithmic Search",
  title: "Neural SEO & AEO",
  subtitle: "Autonomous Entity & Knowledge Graph Dominance",
  icon: "◈",
  color: "#4169E1",
  metric: "99.8% Indexing Rate",
  actionPill: "✨ Generative Engine Optimization",
  href: "/services/seo"
}
```

---

## 2. AdvancedBentoGrid

An asymmetric, modern Bento Grid layout featuring:
- **Asymmetric Grid Spans**: 4-column layout with 2x2 hero feature cards, 2x1 wide cards, and 1x1 high-density metric cards.
- **Luminous Hover Highlights**: 1.5px glowing accent border with dual inner/outer neon box-shadows.
- **Dynamic Background Zoom**: Background imagery scales smoothly on cursor hover with gradient scrim contrast preservation.
- **Category Filter Tabs**: Instant filtering by category ("AI & Automation", "Paid Media & PPC", "Organic & Content").

### Props & Customization

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `gridGap` | `number` | `16` | Gap in pixels between cards |
| `rowHeight` | `number` | `155` | Base row height in pixels |
| `cornerRadius` | `number` | `24` | Border radius in pixels |
| `globalBackground`| `string` | `"#080A11"` | Container background |
| `accentColor` | `string` | `"#4169E1"` | Default accent glow |
| `showFilterTabs` | `boolean` | `true` | Show/hide category filters |
| `items` | `Array<Item>` | Default items | Array of Bento card items |

---

## Native HTML / Vanilla JS Usage

On any HTML page, simply include:

```html
<link rel="stylesheet" href="/assets/framer-components.css" />

<!-- Add Workshop Container or Bento Showcase -->
...

<script src="/assets/framer-components.js" defer></script>
```
