# Lumina Sounds Redesign: Concept & Design System

## 1. Concept Summary
*   **Brand Tone**: "Editorial Tech" — A blend of high-end music boutique aesthetics and modern digital precision.
*   **Visual Direction**: High-contrast editorial layout on a Warm Paper background. Minimalist but with "technical" overlays (IDs, dates, specs).
*   **Emotional Impression**: Sophisticated, immersive, and authentic. It feels like a premium physical music catalog brought to life.
*   **Target Audience**: Audiophiles, creators, and fans of the Lumina ecosystem who value both art and technical quality.

## 2. Design System Proposal
*   **Color Palette**:
    *   **Primary (Text)**: `#1a1a1a` (Deep Carbon) - For strong visual hierarchy and readability.
    *   **Background**: `#f6f5f3` (Warm Paper) - Provides a tactile, "physical" feel compared to pure white.
    *   **Accent**: `#2563eb` (Lumina Blue) - Used for technical highlights, active states, and focus indicators.
    *   **Secondary (Metadata)**: `#6b6b6b` (Slate) - For labels, IDs, and less critical information.
*   **Typography Pairing**:
    *   **Headings/Concept**: *Shippori Mincho B1* (Serif) - Evokes a poetic, human, and artistic texture.
    *   **UI/Technical Data**: *Inter* (Sans-serif) - Ensures clarity for functional elements and product specs.
*   **Button Styles**:
    *   **Main CTA**: Thin `1px` border that "fills" on hover. Includes a technical prefix (e.g., `[+]`).
    *   **Ghost**: Text-only with a subtle underline animation.
*   **Card Styles**:
    *   Editorial layout with strict internal grids.
    *   Metadata placed in corners to resemble industrial labeling.
    *   Large, high-quality product imagery with subtle zoom effects.
*   **Hover / Animation Philosophy**:
    *   **Revealing Data**: Interactions should feel like uncovering deeper layers of information.
    *   **Weight & Inertia**: Animations should be smooth but have a sense of "physicality" (using cubic-bezier easing).
*   **Spacing Rules**:
    *   Based on an 8px/16px system.
    *   Generous white space between sections to maintain an "Editorial" feel.

## 3. Interaction Design
*   **Hover Effects**: Magnetic buttons, image scaling, and color-shift metadata.
*   **Scroll Animations**: Staggered entry for grid items and "reveal" effects for typography.
*   **Micro-interactions**: Small UI cues when a product is clicked or a technical spec is expanded.

## 4. Accessibility Considerations
*   **Contrast**: Ensuring all text meets WCAG AA standards against the Warm Paper background.
*   **Focus States**: High-visibility Lumina Blue outlines for keyboard navigation.
*   **Reduced Motion**: Respecting system preferences by disabling heavy animations if requested.
