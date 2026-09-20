import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";

// Sagan's voice. Variable weight (200–800) covers the 300 display line and the
// 400 body reading; `opsz` lets the browser optically size the large pull
// quotes, and italic carries the emphasis in the original text.
// The two families land on `-latin` variables rather than on --font-serif /
// --font-mono directly. globals.css then composes the real variables from them, which
// is what lets `:lang(ja)` append a Japanese stack WITHOUT the Latin face dropping
// out — a var() cannot reference the custom property it is defining, so the Latin
// list has to have a name of its own to be appended to.
const newsreader = Newsreader({
  variable: "--font-serif-latin",
  // latin-ext as well as latin: the first localisation batch brings French œ,
  // Portuguese ã/õ, German umlauts and ß, and Spanish accents. The base latin subset
  // covers most of those but not all of them, and a missing glyph in a display
  // heading is a hole in the middle of the piece rather than a small blemish.
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  // No generic `serif` at the end of this list, and that omission is load-bearing.
  // globals.css composes the CJK stacks as `var(--font-serif-latin), <CJK faces>,
  // serif`, and a generic family stops the fallback chain for every character it can
  // render. With `serif` inside the variable, Windows resolved Hangul to Batang from
  // the generic and never reached AppleMyungjo, Nanum Myeongjo or Noto Serif KR —
  // and on macOS, where generic serif is Times and has no CJK at all, the choice of
  // face would have fallen to the OS instead of to this file. The generic is added
  // once, at the very end of each composed stack, where it belongs.
  fallback: ["Iowan Old Style", "Georgia"],
});

// Instrument telemetry. Normal style only — HUD chrome never leans.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-latin",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  // Same reason as above: the generic goes at the end of the composed stack, not
  // inside the variable the CJK stacks are built from.
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo"],
});

const DESCRIPTION =
  "On 14 February 1990, at the edge of the solar system, Voyager 1 turned its camera back toward home and photographed Earth as a single point of light 6.06 billion kilometres away. An interactive reading of Carl Sagan's Pale Blue Dot.";

export const metadata: Metadata = {
  title: "Pale Blue Dot",
  description: DESCRIPTION,
  applicationName: "Pale Blue Dot",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Pale Blue Dot",
    title: "Pale Blue Dot — Voyager 1, 14 February 1990",
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#05070c",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // Browser extensions and IDE preview bridges write their own attributes onto
    // <html> before React hydrates — a markdown-preview bridge adding
    // `data-mdv-preview-bridge="ready"` was the one seen here. React compares the
    // server markup against that already-mutated DOM and reports a mismatch the
    // app can do nothing about. The flag silences the comparison for this element's
    // own attributes only; children are still fully checked, so real mismatches
    // inside the tree keep surfacing.
    <html
      lang="en"
      className={`${newsreader.variable} ${jetbrainsMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
