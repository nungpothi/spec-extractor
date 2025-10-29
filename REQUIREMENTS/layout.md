# Layout Requirements

## Navbar
- The application navbar spans the full viewport width with a translucent background and bottom border for separation from main content.
- Use an inner container (`max-w-6xl`) to keep content readable while allowing the bar itself to reach edge-to-edge.
- Keep the navbar fixed to the top edge (`fixed top-0 inset-x-0`) with a high stacking context so it remains visible during scrolling.
- Dropdown and submenu surfaces (e.g., JSON admin menu) must share the elevated z-index so they always float above page content.

## Responsive Navigation
- Provide a hamburger toggle on screens below the `md` breakpoint (`768px`) that reveals the navigation links in a stacked layout.
- The JSON admin menu must remain accessible on mobile by exposing sub-links inside the collapsed menu.
- Close both the primary and JSON menus when navigating so the interface always reflects the active route.

## General Layout
- Preserve existing vertical stacking on content pages and keep spacing utilities (`space-y-*`) consistent for both desktop and mobile experiences.
- Generated artifacts (`storage/pdfs`) and JSON samples should remain outside of the main layout flow and never appear in navigation links.
