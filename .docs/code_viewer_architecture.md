# CodeViewer Implementation

The `CodeViewer` component (`src/components/CodeViewer.tsx`) is the core engine for displaying and editing code inside CodeBuddy. It serves dual purposes: providing a read-only, pristine viewing experience for students, and an interactive, real-time editing interface for teachers.

## 1. Core Technology
We use **Monaco Editor** via the `@monaco-editor/react` package. This is the exact same underlying editor that powers VS Code, which gives us enterprise-grade syntax highlighting, indentation parsing, and performance right out of the box.

## 2. SSR (Server-Side Rendering) & Hydration Safety
TanStack Start uses Server-Side Rendering to deliver fast HTML to the browser. However, Monaco Editor is deeply tied to browser-only APIs (`window`, `document`, `navigator`) and will completely crash if you try to render it on a Node.js server.

To solve this, `CodeViewer` uses a standard **Client-Only Mounting Pattern**:
```typescript
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);

if (!mounted) {
  return <div>Loading editor…</div>;
}
```
* **Server pass**: Renders the "Loading editor..." div.
* **Client pass (Hydration)**: Hydrates the "Loading editor..." div.
* **Client pass (Post-Hydration)**: `useEffect` fires, setting `mounted` to true, which seamlessly swaps out the placeholder for the actual Monaco Editor instance.

## 3. Dynamic Layout & Scrolling
The editor accepts a `height` prop which can be a number (like `520`) or a string (like `"100%"`).
* **Fixed Height (`520`)**: Historically used to lock the editor height and force internal scrolling.
* **Flex Height (`"100%"`)**: Used in our new layout architectures (`browse.$category.$topic.$day.tsx` and `dashboard.tsx`). By passing `height="100%"`, the editor perfectly fills its flex-parent. This is what allows the page title and tab bars to remain "sticky" at the top of the screen while only the code inside the Monaco editor scrolls.

## 4. Custom Configuration & UX
We override Monaco's default behavior by passing a custom `options` object to ensure it fits the clean aesthetic of CodeBuddy:

- **`readOnly: boolean`**: Flips the editor between Student Mode (`true`) and Teacher Mode (`false`).
- **`minimap: { enabled: false }`**: The VS Code minimap is disabled because it consumes too much valuable horizontal space in a web layout.
- **`wordWrap: "on"`**: Crucial for student readability. It forces long lines of code (like base64 strings or long paragraphs in HTML) to wrap to the next line rather than requiring horizontal scrolling.
- **`scrollBeyondLastLine: false`**: Prevents the editor from allowing the user to scroll far past the bottom of the file into empty space.
- **Context Menus & Highlights**: Right-click menus (`contextmenu`) and the line-highlight background (`renderLineHighlight`) are intentionally disabled when in `readOnly` mode so students have a distraction-free reading environment without accidental UI popups.
