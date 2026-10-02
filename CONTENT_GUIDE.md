# TTA Website Operation Manual

This guide explains how to manage the schedule on your website without needing a developer.

---

## The Concept

The website is **smart**. You do not need to manually add events to specific pages.
Instead, you just create an event in the central list and add a **"Magic Tag"** to the description. The website sees this tag and automatically sends the event to the correct page.

---

## 1. Magic Tags

To send an event to a program page, simply paste one of these tags anywhere in the event description (usually at the end).

| **To send event to...**      | **Paste this tag in description** |
| :--------------------------- | :-------------------------------- |
| **Locked-IN (Current Year)** | `[program: locked-in-2026]`       |
| **Core Foundations**         | `[program: core-foundations]`     |

_(Note: These tags will be automatically hidden from visitors on the website.)_

---

## 2. How to Add a New Event

Events are the primary source of content. You manage them directly in the **Central Event Database**.

**Location:** `src/lib/program-mapper.ts`

### How to Add:

1.  Open `src/lib/program-mapper.ts`.
2.  Scroll to the list labeled `EVENT_REGISTRY`. (This is your Master Database).
3.  Add a new event object:

### Event Template (Copy This)

```typescript
{
    id: "unique-id-here",                 // give it a random unique number like "evt-099"
    title: "Title of Your Session",

    // PASTE YOUR MAGIC TAG INSIDE THE QUOTES BELOW ⬇️
    description: "Description of the session goes here. [program: locked-in-2026]",

    startDate: new Date("2026-05-20T18:00:00"), // Year-Month-Day T Hour:Minute:Second
    endDate: new Date("2026-05-20T20:00:00"),
    link: "https://lu.ma/your-event-link",
},
```

---

## 3. Dynamic Year Feature

You do **not** need to update the code next year.

- On **Jan 1, 2027**, the system will automatically start looking for tags like `[program: locked-in-2027]`.
- You just simply start using the new 2027 tag in your new events, and they will appear correctly.

---

## Summary

1. **Create Event** in the file.
2. **Add Tag** to the description.
3. **Save**.

---

## 4. Editing Program Text (Descriptions)

Since we removed the hardcoded text, the program pages are now clean. If you want to add text (like "Operational Updates" or "Curriculum Details") back onto a page:

1.  **Go to the page file:** `src/app/programs/lockedin-2026/page.tsx`
2.  **Type your text:** inside the main section.

Example:

```tsx
<div className="prose">
  <h2>Operational Update</h2>
  <p>Your description goes here...</p>
</div>
```

---

## 5. Adding a Brand New Program (Advanced)

If you invent a completely new course (e.g., "History of Form"), do this:

**Step 1: Register it**
Open `src/lib/program-mapper.ts` and add it to the top list:

```typescript
{
  slug: "history-of-form",
  name: "History of Form",
  keywords: [ /history of form/i ] // The "Magic Word" to look for
}
```

**Step 2: Create the Page**

1. Create a folder: `src/app/programs/history-of-form`
2. Create a file inside it called `page.tsx`.
3. Copy the code from `lockedin-2026/page.tsx` and paste it there to get started.
