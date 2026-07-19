import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";

type Props = {
  value: string;
  language: string;
  readOnly?: boolean;
  onChange?: (v: string) => void;
  height?: number | string;
};

export function CodeViewer({ value, language, readOnly = true, onChange, height = 520 }: Props) {
  // Avoid SSR mismatch: Monaco is client-only.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className="flex items-center justify-center rounded-md border border-border bg-secondary/40 text-sm text-muted-foreground"
        style={{ height }}
      >
        Loading editor…
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden rounded-md border border-border"
      style={typeof height === "string" ? { height } : undefined}
    >
      <Editor
        height={height}
        language={language}
        value={value}
        theme="vs"
        onChange={(v) => onChange?.(v ?? "")}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineHeight: 22,
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          renderLineHighlight: readOnly ? "none" : "line",
          padding: { top: 16, bottom: 16 },
          contextmenu: !readOnly,
          wordWrap: "on",
        }}
      />
    </div>
  );
}
