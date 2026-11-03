import AIChatCardDemo from "@/components/ui/demo";

export const metadata = {
  title: "AI Chat Card Demo | SalesGarners",
  description: "Interactive preview of the SalesGarners AI Chat Card component with typewriter micro-interactions.",
};

/**
 * Interactive preview page showcasing the AIChatCard component.
 * @returns {JSX.Element}
 */
export default function ChatbotDemoPage() {
  return (
    <div className="sec wrap" style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div className="center stack" style={{ marginBottom: "32px", textAlign: "center" }}>
        <span className="eyebrow">Component Preview</span>
        <h1 className="h2 gt">AI Chat Card Interface</h1>
        <p className="lead">
          Interactive shadcn-compatible AI chat card featuring looping typewriter animations, micro-interactions, and glassmorphic styling.
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: "520px" }}>
        <AIChatCardDemo />
      </div>
    </div>
  );
}

