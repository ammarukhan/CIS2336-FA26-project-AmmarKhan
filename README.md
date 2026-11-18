# UH Sugar Land Student Center — CIS 2336 (Fall 2026)

**Developer:** Ammar Khan  
**Phase:** 2 — Front-end implementation  
**Project type:** Academic prototype for a proposed UH Sugar Land Student Center (not an official university site)

## Run the front end

The Phase 2 site uses only HTML, CSS, and JavaScript, so no `npm install` is required yet.

1. Open the `CIS2336-FA26-project-AmmarKhan` project folder in Visual Studio Code.
2. Use the **Live Server** extension on `frontend/index.html`; or, from the project root, run:
   ```bash
   python3 -m http.server 5500 --directory frontend
   ```
3. Open **http://localhost:5500** in a browser. The website's six pages are linked in the navigation and footer.
4. Internet access is necessary for the remotely hosted UH images and YouTube video.

## File structure

```text
CIS2336-FA26-project-AmmarKhan/
├── .gitignore
├── README.md
├── frontend/
│   ├── index.html           # Home, campus image, CTA and Developer Contact overview
│   ├── faq.html             # Five collapsible FAQs
│   ├── roombooking.html     # Five-room booking form
│   ├── about.html           # Mission, proposed spaces, campus video and hours/location
│   ├── contact.html         # Developer Contact and support
│   ├── reference.html       # Source credits and AI prompts
│   ├── styles.css           # Shared responsive design based on Phase 1
│   ├── script.js            # JavaScript-generated navigation, menu, FAQ behavior
│   ├── booking.js           # Form validation and demo availability logic
│   └── assets/
│       └── favicon.svg      # Original simple project favicon
└── backend/
    └── app.js               # Professor's placeholder; implement in Phase 3
```

## How the features work

- **Home:** A UH-red header, embedded external campus photo, booking link, developer information, and footer links.
- **Navigation:** `script.js` creates page links dynamically, marks the active page, and toggles the responsive mobile menu using `aria-expanded`.
- **FAQ:** Exactly five keyboard-accessible expandable questions use native HTML `<details>`. JavaScript closes other answers when one is expanded.
- **Booking:** Five selectable room options. The form checks name, email, room, date (today through 90 days ahead), start time, duration (30–120 minutes), purpose, and the demo's 8 AM–8 PM time window.
- **Availability:** `booking.js` checks whether a requested interval overlaps sample reservations **for that particular room and date**. Requests can be accepted or declined in the browser tab only. There is no server call, persistent storage, or real reservation in Phase 2.
- **Multimedia:** Externally hosted images and an embedded UH Sugar Land campus video, credited on `reference.html`.
- **Responsive/accessibility:** Mobile menu, layouts for small screens, associated form labels, status messages, keyboard focus styles, semantic landmarks and alt text.

## Try the booking form

1. Choose **Group Study Room B**.
2. For **tomorrow**, choose **10:00 AM** and **1 hour**, then click **Check Availability**. It should report **unavailable** due to a sample booking.
3. Change the start time to **11:00 AM**: the adjacent time slot should be **available**.
4. Add your name, a correctly formatted email, and booking purpose; then submit. You should see a **demo request accepted** message.
5. Check the same room and time again: the new in-memory request will conflict, demonstrating the decline case.
6. Reload the page to reset all demo reservations. Try the other four rooms and invalid forms as additional test cases.

## Before submitting to GitHub

**Developer contact:** Ammar Khan — aukhan6@cougarnet.uh.edu. The contact information is already populated on the Home and Contact / Help pages.

1. Open the whole project folder in VS Code.
2. Use **Source Control → Publish to GitHub → Publish to GitHub Public repository**.
3. Copy the public repository URL and submit that link in Canvas. Confirm the repo is publicly visible in a private/incognito browser session.
4. Continue committing updates to the **same repository** as you implement Phase 3 and Phase 4.

## Phase 3 integration plan

`backend/app.js` is the original placeholder from the professor's starter ZIP. In Phase 3, implement Node.js + Express, accept GET and POST booking requests, and store reservations in a server-side JavaScript object (in memory, as required). Replace `checkDemoAvailability()` and the demo submission in `booking.js` with `fetch()` calls to these endpoints. The frontend already defines the booking fields and checks overlapping date/time intervals.

## AI and sources

The user-provided project instructions allow AI-assisted development **only when prompts appear on the References page**. The `frontend/reference.html` page transparently lists ChatGPT usage, actual student prompts, and content/media sources. Source images/video belong to their respective owners. This is an academic prototype and is not affiliated with official UH booking services.
