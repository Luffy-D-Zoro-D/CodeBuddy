# Frontend Structure & UI Explanation

This document breaks down how the HTML, CSS, and interactive features (like dropdowns) are built in CodeBuddy. You can use these concepts to explain the UI to your teacher in terms of HTML, CSS, and basic JavaScript.

## 1. CSS & Styling (Tailwind CSS)
Instead of having a massive, separate `style.css` file where we have to constantly invent class names like `.header-container` or `.dropdown-box`, we used a framework called **Tailwind CSS**.

Tailwind lets us write our CSS directly inside our HTML elements using special class names. 
For example, if we want a blue button with white text and rounded corners, instead of writing CSS, our HTML looks like this:
`<button class="bg-blue-500 text-white rounded-md p-2">Click Me</button>`

This makes the code much easier to read because you can see exactly what an element will look like just by looking at the HTML structure. We also used CSS variables for colors (like `bg-background` and `text-foreground`) so the app can easily switch between light mode and dark mode.

## 2. Interactive Elements (State)
In basic JavaScript, if you want to make a folder click open, you have to do something like:
1. `document.getElementById('folder-btn')`
2. `addEventListener('click', ...)`
3. `folderContent.style.display = 'block'`

Because this gets very messy for big apps, we used a concept called **State** (via React variables).
In the `TopicNode` and `DayNode` components (in `src/routes/index.tsx`), we create a simple variable called `open` which starts as `false`.

When you click the folder button, it simply changes `open` to `true`.
The HTML is programmed to say: *"If `open` is true, show the inner HTML `<ul>` list. If it is false, don't show it."* 
We don't need to manually hide or show the HTML with `display: none`; the variable controls the HTML directly.

## 3. Dropdowns & Complex UI (Radix UI)
Creating accessible dropdown menus, accordions, or modal pop-ups from scratch with plain HTML and JavaScript is extremely hard. You have to handle things like:
- What happens if the user clicks outside the dropdown?
- Can a screen reader understand it?
- Can a user navigate it with the `Tab` and `Arrow` keys on their keyboard?

To solve this properly, we used a library called **Radix UI** (accessible inside `package.json`). Radix gives us the raw, unstyled HTML structure and JavaScript logic for complex items.

**How a Dropdown Works in CodeBuddy:**
1. We use a Radix `<DropdownMenu.Root>` wrapper to group the HTML.
2. Inside, we have a `<DropdownMenu.Trigger>` which acts as the button. Radix automatically handles the JavaScript click events for this button.
3. We have a `<DropdownMenu.Content>` which is the actual popup box. Radix handles positioning it correctly on the screen so it doesn't get cut off.
4. We then use our Tailwind CSS classes to paint it and make it look beautiful!

By letting the library handle the complex keyboard math, we get a professional-grade UI while only having to write the visual HTML structure!
