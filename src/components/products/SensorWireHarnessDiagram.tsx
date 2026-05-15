/**
 * Standard Sensor Switch — Wire Harness Diagram
 *
 * Architecture (post-2026-05-15 rewrite to Option A — fixed canvas):
 *
 *   <section>
 *     <header>           shared title block (eyebrow / title / subtitle)
 *     <DesktopCanvas>    md+: fixed 1280x640 viewBox, every element
 *                              absolutely positioned in viewBox-% coords,
 *                              wires + cards + sensor share one coordinate
 *                              system so wires land on terminal dots exactly.
 *     <MobileStack>      <md: flowed HTML — sensor, wire-map list,
 *                              stacked cards, no SVG wires.
 *     <footer>           shared safety bar
 *   </section>
 *
 * Why a fixed canvas above md: SVG wire paths need to terminate on specific
 * DOM positions (the terminal dots). When the surrounding layout is
 * fluid (flex/grid), those positions drift as content reflows, and the
 * wires miss. Putting cards + dots + wires in the same coordinate system
 * (a fixed aspect-ratio container with everything positioned in
 * viewBox-% coords) guarantees they line up at every desktop width.
 *
 * The canvas is `container-type: inline-size`, so the text inside scales
 * with the canvas via `cqi` units. The whole composition scales as one
 * unit, like an SVG exported from Illustrator, while still being real
 * HTML for accessibility / theming / copy edits.
 *
 * Wire routing (in viewBox 1280x640):
 *   - All four wires exit the sensor base near (615..665, ~275).
 *   - Wire endpoints extend to the top edge of each terminal dot (y≈461.5
 *     in viewBox): card top y=440 + border/padding in cqi-mapped units.
 *   - Inner-target wires (Black, White) sit at the deeper horizontal
 *     level (y=415). Outer-target wires (Red, Yellow) sit at the
 *     shallower level (y=385). This avoids any wire crossings.
 *   - Wire endpoints land at x positions that match the terminal dots
 *     inside the cards (HOT=95, COMMON=245, SAFETY INPUT=1035,
 *     SAFETY COMMON=1185), so the wires visually plug into the dots.
 *
 * Mobile (<md) keeps the previous flowed layout for legibility on phones;
 * the SVG wires would be too thin to read at phone widths.
 */

import {
  ArrowDownTrayIcon,
  BoltIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'

const STANDARD_SENSOR_WIRE_HARNESS_DIAGRAM_PDF =
  '/downloads/acdw-sensor-standard-wire-harness-diagram.pdf' as const

export function SensorWireHarnessDiagram() {
  return (
    <section
      className="sensor-wire-diagram"
      aria-labelledby="sensor-wire-diagram-title"
    >
      <div className="sensor-wire-diagram-inner">
        <TitleBlock />
        <DesktopCanvas />
        <MobileStack />
        <SafetyBar />
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   Title block (shared between desktop and mobile)
   ────────────────────────────────────────────────────────────────────── */
function TitleBlock() {
  return (
    <header className="sensor-wire-diagram-header">
      <h2 id="sensor-wire-diagram-title" className="product-section-title">
        Wire harness diagram
      </h2>
      <p className="sensor-product-section-subtitle sensor-wire-diagram-intro">
        Know where power ends and the control circuit begins before you land
        terminals—faster installs, fewer wiring mix-ups, and a clean reference
        your crew can use on the truck or mid-job.
      </p>
      <div className="sensor-wire-diagram-download-wrap">
        <a
          href={STANDARD_SENSOR_WIRE_HARNESS_DIAGRAM_PDF}
          className="sensor-wire-diagram-download"
          download="acdw-sensor-standard-wire-harness-diagram.pdf"
        >
          <ArrowDownTrayIcon
            className="sensor-wire-diagram-download-icon"
            aria-hidden
          />
          <span>Download full diagram (PDF)</span>
        </a>
        <p className="sensor-wire-diagram-download-hint">
          Larger, print-ready version for the shop, truck, or job folder.
        </p>
      </div>
    </header>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   Desktop canvas (md+) — fixed 1280x640 viewBox, everything absolutely
   positioned. Wires share the same coordinate system as the cards so
   they terminate precisely on the terminal dots.
   ────────────────────────────────────────────────────────────────────── */
function DesktopCanvas() {
  return (
    <div className="sensor-wire-diagram-canvas" aria-hidden="false">
      {/* Sensor PNG — centered top */}
      <img
        src="/images/acdw-sensor-standard-on-manifold.png"
        alt=""
        className="sensor-wire-diagram-canvas-sensor"
        width={1672}
        height={941}
        loading="lazy"
        decoding="async"
      />

      {/* Left callouts (educational) */}
      <div className="sensor-wire-diagram-canvas-callout sensor-wire-diagram-canvas-callout--tl1">
        <span className="sensor-wire-diagram-canvas-chip" aria-hidden="true">
          <BoltIcon className="sensor-wire-diagram-canvas-chip-icon" />
        </span>
        <p className="sensor-wire-diagram-canvas-callout-text">
          This wiring diagram is for a 24-volt AC control circuit.
        </p>
      </div>

      <div className="sensor-wire-diagram-canvas-callout sensor-wire-diagram-canvas-callout--tl2">
        <span className="sensor-wire-diagram-canvas-chip" aria-hidden="true">
          <FourDotsIcon />
        </span>
        <p className="sensor-wire-diagram-canvas-callout-text">
          4 wires exit the main housing toward the bottom of the sensor.
        </p>
      </div>

      {/* Right callouts (wire-color swatches) */}
      <div className="sensor-wire-diagram-canvas-callout sensor-wire-diagram-canvas-callout--tr1">
        <span className="sensor-wire-diagram-canvas-swatch" aria-hidden="true">
          <span className="sensor-wire-diagram-canvas-swatch-block sensor-wire-diagram-canvas-swatch-block--black" />
          <span className="sensor-wire-diagram-canvas-swatch-block sensor-wire-diagram-canvas-swatch-block--red" />
        </span>
        <p className="sensor-wire-diagram-canvas-callout-text">
          <strong>Black and red</strong> wires are used for power.
        </p>
      </div>

      <div className="sensor-wire-diagram-canvas-callout sensor-wire-diagram-canvas-callout--tr2">
        <span className="sensor-wire-diagram-canvas-swatch" aria-hidden="true">
          <span className="sensor-wire-diagram-canvas-swatch-block sensor-wire-diagram-canvas-swatch-block--white" />
          <span className="sensor-wire-diagram-canvas-swatch-block sensor-wire-diagram-canvas-swatch-block--yellow" />
        </span>
        <p className="sensor-wire-diagram-canvas-callout-text">
          <strong>White and yellow</strong> wires are used for control.
        </p>
      </div>

      {/* POWER instruction */}
      <div className="sensor-wire-diagram-canvas-instruction sensor-wire-diagram-canvas-instruction--left">
        <p className="sensor-wire-diagram-canvas-section-label sensor-wire-diagram-canvas-section-label--power">
          Power (24V AC)
        </p>
        <p className="sensor-wire-diagram-canvas-instruction-text">
          Connect the black and red wires to the 24-volt AC power source as
          shown.
        </p>
      </div>

      {/* CONTROL instruction */}
      <div className="sensor-wire-diagram-canvas-instruction sensor-wire-diagram-canvas-instruction--right">
        <p className="sensor-wire-diagram-canvas-section-label sensor-wire-diagram-canvas-section-label--control">
          Control (24V AC)
        </p>
        <p className="sensor-wire-diagram-canvas-instruction-text">
          Connect the white and yellow wires into the AC unit's control
          circuit.
        </p>
      </div>

      {/* Wire SVG overlay — same viewBox as the canvas, paths in viewBox
          coords. Z-shape (vertical -> horizontal -> vertical). Final
          vertical ends at y≈461.5: card top is y=440 (68.75% of 640);
          border + padding + dot top (3.2cqi dot, 1.5cqi pad, 0.18cqi border,
          mapped with cqi∝width & uniform viewBox scale) meets the wire
          stroke at the top of each terminal circle. */}
      <svg
        className="sensor-wire-diagram-canvas-wires"
        viewBox="0 0 1280 640"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        {/* Red wire -> POWER HOT (left terminal of LEFT card, x=95).
            Shallow horizontal at y=385 (every wire Y shifted by +60 in
            step with the sensor and the cards, so the upper area could
            grow room for the callouts without touching wire geometry). */}
        <path
          d="M 632 275 V 370 Q 632 385 617 385 H 110 Q 95 385 95 400 V 461.5"
          className="sensor-wire-diagram-canvas-wire sensor-wire-diagram-canvas-wire--red"
          vectorEffect="non-scaling-stroke"
        />
        {/* Black wire -> POWER COMMON (right terminal of LEFT card, x=245).
            Deep horizontal at y=415 (shifted +60 in step with shallow). */}
        <path
          d="M 615 275 V 400 Q 615 415 600 415 H 260 Q 245 415 245 430 V 461.5"
          className="sensor-wire-diagram-canvas-wire sensor-wire-diagram-canvas-wire--black"
          vectorEffect="non-scaling-stroke"
        />
        {/* White wire -> CONTROL SAFETY INPUT (left terminal of RIGHT card,
            x=1035). Deep horizontal at y=415. */}
        <path
          d="M 648 275 V 400 Q 648 415 663 415 H 1020 Q 1035 415 1035 430 V 461.5"
          className="sensor-wire-diagram-canvas-wire sensor-wire-diagram-canvas-wire--white"
          vectorEffect="non-scaling-stroke"
        />
        {/* Yellow wire -> CONTROL SAFETY COMMON (right terminal of RIGHT
            card, x=1185). Shallow horizontal at y=385. */}
        <path
          d="M 665 275 V 370 Q 665 385 680 385 H 1170 Q 1185 385 1185 400 V 461.5"
          className="sensor-wire-diagram-canvas-wire sensor-wire-diagram-canvas-wire--yellow"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Safety-only dot overlays: same z-layer as wires but painted after the
          SVG so white/yellow strokes tuck behind these circles only. In-card
          safety dots are opacity:0 (layout preserved). Power Hot/Common
          unchanged — strokes stay on top of those dots. */}
      <div
        className="sensor-wire-diagram-canvas-safety-dot-overlays"
        aria-hidden="true"
      >
        <span
          className="sensor-wire-diagram-canvas-terminal-dot sensor-wire-diagram-canvas-terminal-dot--safety sensor-wire-diagram-canvas-safety-dot-overlay sensor-wire-diagram-canvas-safety-dot-overlay--input"
        >
          −
        </span>
        <span
          className="sensor-wire-diagram-canvas-terminal-dot sensor-wire-diagram-canvas-terminal-dot--safety sensor-wire-diagram-canvas-safety-dot-overlay sensor-wire-diagram-canvas-safety-dot-overlay--common"
        >
          −
        </span>
      </div>

      {/* POWER terminal card (left). Terminals come FIRST in markup so
          they sit at the top of the card visually, where the Red/Black
          wires land. Their centers are at 25%/75% of the card width,
          which maps to viewBox x=95 (HOT) / x=245 (COMMON) — the exact
          x's the wire paths terminate at. */}
      <div className="sensor-wire-diagram-canvas-card sensor-wire-diagram-canvas-card--power">
        <div className="sensor-wire-diagram-canvas-card-terminals">
          <div className="sensor-wire-diagram-canvas-terminal">
            <span
              className="sensor-wire-diagram-canvas-terminal-dot sensor-wire-diagram-canvas-terminal-dot--hot"
              aria-hidden="true"
            >
              +
            </span>
            <span className="sensor-wire-diagram-canvas-terminal-strong">
              Hot
            </span>
            <span className="sensor-wire-diagram-canvas-terminal-sub">
              24V AC
            </span>
          </div>
          <div className="sensor-wire-diagram-canvas-terminal">
            <span
              className="sensor-wire-diagram-canvas-terminal-dot sensor-wire-diagram-canvas-terminal-dot--common"
              aria-hidden="true"
            >
              −
            </span>
            <span className="sensor-wire-diagram-canvas-terminal-strong">
              Common
            </span>
            <span className="sensor-wire-diagram-canvas-terminal-sub">
              24V AC
            </span>
          </div>
        </div>
        <p className="sensor-wire-diagram-canvas-card-label">
          24-Volt AC Power Source
        </p>
      </div>

      {/* CONTROL terminal card (right). Centers at 25%/75% of card width
          map to viewBox x=1035 (SAFETY INPUT) and x=1185 (SAFETY COMMON). */}
      <div className="sensor-wire-diagram-canvas-card sensor-wire-diagram-canvas-card--control">
        <div className="sensor-wire-diagram-canvas-card-terminals">
          <div className="sensor-wire-diagram-canvas-terminal">
            <span
              className="sensor-wire-diagram-canvas-terminal-dot sensor-wire-diagram-canvas-terminal-dot--safety"
              aria-hidden="true"
            >
              −
            </span>
            <span className="sensor-wire-diagram-canvas-terminal-strong">
              Safety
            </span>
            <span className="sensor-wire-diagram-canvas-terminal-sub">
              Input
            </span>
          </div>
          <div className="sensor-wire-diagram-canvas-terminal">
            <span
              className="sensor-wire-diagram-canvas-terminal-dot sensor-wire-diagram-canvas-terminal-dot--safety"
              aria-hidden="true"
            >
              −
            </span>
            <span className="sensor-wire-diagram-canvas-terminal-strong">
              Safety
            </span>
            <span className="sensor-wire-diagram-canvas-terminal-sub">
              Common
            </span>
          </div>
        </div>
        <p className="sensor-wire-diagram-canvas-card-label">
          AC Unit Control Circuit
        </p>
        <p className="sensor-wire-diagram-canvas-card-sub">
          Condensate Overflow Safety Circuit
        </p>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   Mobile stack (<md) — normal flow, no SVG wires.
   ────────────────────────────────────────────────────────────────────── */
function MobileStack() {
  return (
    <div className="sensor-wire-diagram-mobile">
      <div className="sensor-wire-diagram-mobile-hero">
        <img
          src="/images/acdw-sensor-standard-on-manifold.png"
          alt=""
          className="sensor-wire-diagram-mobile-sensor"
          width={1672}
          height={941}
          loading="lazy"
          decoding="async"
        />

        {/* Harness fan-out — wires sit z-below the PNG so they read as
            sliding out from under the back of the housing (needs transparent
            PNG at the wire-exit zone; same as desktop). */}
        <div className="sensor-wire-diagram-mobile-fanout" aria-hidden="true">
        <svg
          className="sensor-wire-diagram-mobile-fanout-svg"
          viewBox="0 0 400 130"
          preserveAspectRatio="none"
          focusable="false"
        >
          <path
            d="M 190 8 C 190 35 60 45 60 72"
            className="sensor-wire-diagram-mobile-fanout-wire sensor-wire-diagram-mobile-fanout-wire--red"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 197 8 C 197 42 140 58 140 72"
            className="sensor-wire-diagram-mobile-fanout-wire sensor-wire-diagram-mobile-fanout-wire--black"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 203 8 C 203 42 260 58 260 72"
            className="sensor-wire-diagram-mobile-fanout-wire sensor-wire-diagram-mobile-fanout-wire--white"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 210 8 C 210 35 340 45 340 72"
            className="sensor-wire-diagram-mobile-fanout-wire sensor-wire-diagram-mobile-fanout-wire--yellow"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <span className="sensor-wire-diagram-mobile-fanout-tag sensor-wire-diagram-mobile-fanout-tag--hot">
          <span className="sensor-wire-diagram-mobile-fanout-tag-dot sensor-wire-diagram-mobile-fanout-tag-dot--red" />
          <span className="sensor-wire-diagram-mobile-fanout-tag-text">
            Hot
          </span>
        </span>
        <span className="sensor-wire-diagram-mobile-fanout-tag sensor-wire-diagram-mobile-fanout-tag--common">
          <span className="sensor-wire-diagram-mobile-fanout-tag-dot sensor-wire-diagram-mobile-fanout-tag-dot--black" />
          <span className="sensor-wire-diagram-mobile-fanout-tag-text">
            Common
          </span>
        </span>
        <span className="sensor-wire-diagram-mobile-fanout-tag sensor-wire-diagram-mobile-fanout-tag--safety-in">
          <span className="sensor-wire-diagram-mobile-fanout-tag-dot sensor-wire-diagram-mobile-fanout-tag-dot--white" />
          <span className="sensor-wire-diagram-mobile-fanout-tag-text">
            Safety
            <br />
            Input
          </span>
        </span>
        <span className="sensor-wire-diagram-mobile-fanout-tag sensor-wire-diagram-mobile-fanout-tag--safety-com">
          <span className="sensor-wire-diagram-mobile-fanout-tag-dot sensor-wire-diagram-mobile-fanout-tag-dot--yellow" />
          <span className="sensor-wire-diagram-mobile-fanout-tag-text">
            Safety
            <br />
            Common
          </span>
        </span>
        </div>
      </div>

      <div className="sensor-wire-diagram-mobile-callouts">
        <div className="sensor-wire-diagram-callout">
          <span className="sensor-wire-diagram-chip" aria-hidden="true">
            <BoltIcon className="sensor-wire-diagram-chip-icon" />
          </span>
          <p className="sensor-wire-diagram-callout-text">
            This wiring diagram is for a 24-volt AC control circuit.
          </p>
        </div>
        <div className="sensor-wire-diagram-callout">
          <span className="sensor-wire-diagram-chip" aria-hidden="true">
            <FourDotsIcon />
          </span>
          <p className="sensor-wire-diagram-callout-text">
            4 wires exit the main housing toward the bottom of the sensor.
          </p>
        </div>
      </div>

      <ul
        className="sensor-wire-diagram-wire-map"
        aria-label="Wire-to-terminal mapping"
      >
        <li className="sensor-wire-diagram-wire-map-row">
          <span
            className="sensor-wire-diagram-swatch sensor-wire-diagram-swatch--map"
            aria-hidden="true"
          >
            <span className="sensor-wire-diagram-swatch-block sensor-wire-diagram-swatch-block--red" />
            <span className="sensor-wire-diagram-swatch-block sensor-wire-diagram-swatch-block--black" />
          </span>
          <span>
            <strong>Red + Black</strong> → 24V AC power source
            <span className="sensor-wire-diagram-wire-map-targets">
              (Red → Hot, Black → Common)
            </span>
          </span>
        </li>
        <li className="sensor-wire-diagram-wire-map-row">
          <span
            className="sensor-wire-diagram-swatch sensor-wire-diagram-swatch--map"
            aria-hidden="true"
          >
            <span className="sensor-wire-diagram-swatch-block sensor-wire-diagram-swatch-block--white" />
            <span className="sensor-wire-diagram-swatch-block sensor-wire-diagram-swatch-block--yellow" />
          </span>
          <span>
            <strong>White + Yellow</strong> → AC unit safety circuit
            <span className="sensor-wire-diagram-wire-map-targets">
              (White → Safety Input, Yellow → Safety Common)
            </span>
          </span>
        </li>
      </ul>

      <div className="sensor-wire-diagram-mobile-blocks">
        <div className="sensor-wire-diagram-mobile-block">
          <p className="sensor-wire-diagram-section-label sensor-wire-diagram-section-label--power">
            Power (24V AC)
          </p>
          <p className="sensor-wire-diagram-instruction-text">
            Connect the black and red wires to the 24-volt AC power source as
            shown.
          </p>
          <div className="sensor-wire-diagram-mobile-card sensor-wire-diagram-mobile-card--power">
            <p className="sensor-wire-diagram-mobile-card-label">
              24-Volt AC Power Source
            </p>
            {/* Mobile: stacked terminals with a colored "wire stub" on the
                left of each row — the visual link from the wire-map list
                above to the specific terminal that wire lands on. */}
            <div className="sensor-wire-diagram-mobile-card-terminals">
              <div className="sensor-wire-diagram-mobile-terminal">
                <span
                  className="sensor-wire-diagram-mobile-terminal-stub sensor-wire-diagram-mobile-terminal-stub--red"
                  aria-hidden="true"
                />
                <span className="sensor-wire-diagram-canvas-terminal-dot sensor-wire-diagram-canvas-terminal-dot--hot">
                  +
                </span>
                <div>
                  <strong>Hot</strong>
                  <span>24V AC</span>
                </div>
              </div>
              <div className="sensor-wire-diagram-mobile-terminal">
                <span
                  className="sensor-wire-diagram-mobile-terminal-stub sensor-wire-diagram-mobile-terminal-stub--black"
                  aria-hidden="true"
                />
                <span className="sensor-wire-diagram-canvas-terminal-dot sensor-wire-diagram-canvas-terminal-dot--common">
                  −
                </span>
                <div>
                  <strong>Common</strong>
                  <span>24V AC</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sensor-wire-diagram-mobile-block">
          <p className="sensor-wire-diagram-section-label sensor-wire-diagram-section-label--control">
            Control (24V AC)
          </p>
          <p className="sensor-wire-diagram-instruction-text">
            Connect the white and yellow wires into the AC unit's control
            circuit.
          </p>
          <div className="sensor-wire-diagram-mobile-card sensor-wire-diagram-mobile-card--control">
            <p className="sensor-wire-diagram-mobile-card-label">
              AC Unit Control Circuit
            </p>
            <p className="sensor-wire-diagram-mobile-card-sub">
              Condensate Overflow Safety Circuit
            </p>
            <div className="sensor-wire-diagram-mobile-card-terminals">
              <div className="sensor-wire-diagram-mobile-terminal">
                <span
                  className="sensor-wire-diagram-mobile-terminal-stub sensor-wire-diagram-mobile-terminal-stub--white"
                  aria-hidden="true"
                />
                <span className="sensor-wire-diagram-canvas-terminal-dot sensor-wire-diagram-canvas-terminal-dot--safety">
                  −
                </span>
                <div>
                  <strong>Safety</strong>
                  <span>Input</span>
                </div>
              </div>
              <div className="sensor-wire-diagram-mobile-terminal">
                <span
                  className="sensor-wire-diagram-mobile-terminal-stub sensor-wire-diagram-mobile-terminal-stub--yellow"
                  aria-hidden="true"
                />
                <span className="sensor-wire-diagram-canvas-terminal-dot sensor-wire-diagram-canvas-terminal-dot--safety">
                  −
                </span>
                <div>
                  <strong>Safety</strong>
                  <span>Common</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   Safety bar (shared)
   ────────────────────────────────────────────────────────────────────── */
function SafetyBar() {
  return (
    <div className="sensor-wire-diagram-safety" role="note">
      <p className="sensor-wire-diagram-safety-heading">
        <ShieldCheckIcon
          className="sensor-wire-diagram-safety-shield"
          aria-hidden="true"
        />
        Important Safety Instructions
      </p>
      <div className="sensor-wire-diagram-safety-grid">
        <div className="sensor-wire-diagram-safety-item">
          <span className="sensor-wire-diagram-safety-chip" aria-hidden="true">
            <BoltIcon className="sensor-wire-diagram-safety-chip-icon" />
          </span>
          <div>
            <p className="sensor-wire-diagram-safety-step">
              1. Turn off power
            </p>
            <p className="sensor-wire-diagram-safety-text">
              Turn off power before installation.
            </p>
          </div>
        </div>
        <div className="sensor-wire-diagram-safety-item">
          <span className="sensor-wire-diagram-safety-chip" aria-hidden="true">
            <ShieldCheckIcon className="sensor-wire-diagram-safety-chip-icon" />
          </span>
          <div>
            <p className="sensor-wire-diagram-safety-step">
              2. Confirm all connections
            </p>
            <p className="sensor-wire-diagram-safety-text">
              Confirm all connections are tight, insulated, and wired
              according to the diagram before powering the system.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * 4-dot icon used in the second educational callout — Heroicons has no
 * exact match, and this is the simplest possible inline shape.
 */
function FourDotsIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="sensor-wire-diagram-chip-icon"
      aria-hidden="true"
    >
      <circle cx="5" cy="5" r="1.6" fill="currentColor" />
      <circle cx="11" cy="5" r="1.6" fill="currentColor" />
      <circle cx="5" cy="11" r="1.6" fill="currentColor" />
      <circle cx="11" cy="11" r="1.6" fill="currentColor" />
    </svg>
  )
}

export default SensorWireHarnessDiagram
