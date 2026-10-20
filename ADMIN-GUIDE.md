# Website admin — guide

The Federal Ministry of Transportation website has an administrative area at **`/admin`** where designated Ministry staff manage the website's content without needing the development team for routine updates.

This guide has two parts: **[Part A](#part-a--for-ministry-administrators-and-editors)** for the people who use the admin, and **[Part B](#part-b--for-the-technical-team)** for whoever deploys and maintains it.

---

## Part A — For Ministry administrators and editors

> **The same help is built into the admin.** Press **Help** in the menu for step-by-step guides (searchable, with the exact names of the buttons and fields), a glossary, and a printable quick reference for your role. People who cannot sign in can read the sign-in guides at `/admin/sign-in-help`. The guides live in `src/lib/admin/help/` and a test fails if one mentions a button or field that no longer exists.

### Signing in

Go to `https://<the-website>/admin` and sign in with your Ministry email address and password.

- **First time:** a super administrator invites you. You receive an email with a link; open it, choose a password, and you're in. The link works **once** and expires after **72 hours**. If it expires, ask for a new invitation.
- **Forgot your password:** use *Forgot your password?* on the sign-in page. You'll get a link that works once and lasts 60 minutes.
- Sessions last 12 hours. Changing your password (*My account*) signs you out of every other browser.

### Two kinds of people

| | Can do |
|---|---|
| **Super administrator** | Everything: all content, **Users & access**, the **Activity log**, and **System status**. |
| **Content editor** | Only the sections a super administrator has ticked for them (for example just *News*). Other sections don't appear for them, and typing the address takes them back to the dashboard. For each section they get **Edit** (write drafts, propose changes) and/or **Publish** (approve work, put changes on the website, archive, re-arrange). |

A super administrator invites people from **Users & access**, chooses their role and ticks, per section, **Edit** and **Publish**, and can change that at any time (it takes effect on the person's next page load). People are **deactivated, never deleted**, and the last active super administrator can't be deactivated.

### What you can manage

| Section | What it controls on the website |
|---|---|
| **Home page hero** | The carousel at the top of the home page: picture, small heading, main heading, paragraph, and the link button. Slides rotate in the order shown. |
| **Mandate, Mission & Vision** | The "Why we exist / Where we are headed / How we get there" block, and the About Us introduction. |
| **News, Photo News & Events** | Online news (shows on *Online News Sector*), photo news (*Photo News*) and events (*Events*). Choose the **kind** when you create an item. Latest items also appear on the home page. |
| **Departments** | The department cards and each department's own page (introduction, structure, functions). Re-arrange the order; add a picture. |
| **Leadership** | The Minister, Permanent Secretary and directors. **Leave the name empty to show "Name to be announced"** until it is confirmed. Add biography details if you want a fuller profile page. |
| **The Road Ahead** | The goals and measurable targets on the home page. |
| **FCSSIP 25 page** | The page's heading and its content, block by block (paragraph, heading, link, picture). Links next to each other appear together as one list. |
| **E-Services** | The online-services cards and the footer links. |
| **Resources & documents** | Documents for download, and NCT Communiques. Upload a PDF/Word/Excel file or paste a link. |
| **Contact details & links** | The address, hours, email, telephone number and social links in the footer and on the Contact page. Goes live when saved, so it needs the Publish permission. |
| **Enquiries** | Messages sent through the website's contact form. Each is stored here and also emailed to the team for its topic; mark them handled or spam, and reply from your own email. A super administrator chooses which email address each topic goes to (**Enquiries → Where enquiries go**). The form only appears on the website once a database is connected. Nothing is deleted; how long messages are kept is for the Ministry to decide. |

### Archiving instead of deleting

Nothing is ever deleted. **Archive** hides an item from the website straight away; it stays in the **Archived** tab, and **Restore** publishes it again (it rejoins at the **end** of the list, so re-arrange it afterwards if needed). A URL for an archived item shows "page not found" to the public. The home page hero always keeps at least one slide.

### Drafts and approval

Someone who can **Edit** but not **Publish** in a section never changes the website directly:

- A new item starts as a **Draft** (not on the website). **Submit for approval** puts it in the publishers' queue.
- Changes to something already published are saved as **proposed changes** beside it; the website keeps the published version until a publisher approves them.
- A **publisher** (someone with **Publish** for the section, or a super administrator) finds the work under **Approvals** in the menu (the number is how many items wait), sees exactly what would change, and presses **Approve and publish** or **Send back** with a note the author sees.
- **Archive**, **Restore** and re-arranging need **Publish**. So do the Mandate/Mission/Vision and Contact details pages, which have no drafts: a save is live at once.
- When existing accounts were upgraded to this version every editor kept their old ability to publish in their sections, so nothing changed for them; a super administrator can tighten it under **Users & access**.
- Every submission, approval and return is written to the **Activity log**.

### Editing and re-arranging

- Open any section, then **Edit** an item or **Add** a new one. Press **Save changes** — **for publishers the change is live on the website immediately** (editors: see *Drafts and approval*).
- To re-arrange (hero, departments, leadership, road ahead, FCSSIP blocks, e-services, resources): use the **↑ / ↓** buttons, then **Save new order**. Nothing changes publicly until you save.
- If a colleague saved the same item while you were editing it, your save is refused with a message (so nobody's work is overwritten silently). Reload the page and repeat your change.

### Pictures and files

- **Upload** a picture (JPG, PNG, WebP or AVIF, up to 8 MB), or paste a link from Unsplash/Pexels. SVG and other types are not accepted.
- Sizes that look best: **hero** landscape ≥ 1600 px wide; **department / news cards** about 1200 × 750; **leader photos** portrait (4:5).
- Always fill in the **picture description** where asked — it is read aloud to people using screen readers.
- Documents: PDF, Word (.docx) or Excel (.xlsx), up to 25 MB.

### The Activity log

Super administrators can see who signed in, edited, archived, restored, re-ordered or changed access, and when (**Activity log**). It cannot be edited.

### What the admin does **not** manage (yet)

Agencies, stakeholders, the headline figures (except the department count, which is automatic), the top menu and footer links, contact details and the legal pages (privacy, terms, FOI) are still maintained in the code. They can be added to the admin later using the same building blocks.

---

## Part B — For the technical team

### How it fits together

- The public site is the same Next.js app. Content comes from **PostgreSQL** when `DATABASE_URL` is set, and from the files in `src/content/` otherwise. **With no database configured the website works exactly as it did before the admin existed**, and `/admin` shows "Admin not set up yet".
- After a content change, the admin expires exactly the cached pages built from that content, so edits are live immediately (a one-hour safety-net revalidation also exists).
- Passwords are argon2id hashes. Sessions are a signed cookie carrying only a session id; the database row is re-checked on every request (so deactivation and permission changes apply immediately). Invitation/reset links are single-use, stored only as hashes, and never consumed by merely opening them.

### Provisioning checklist (what you must create)

You (or the Ministry) must create these — they involve accounts, billing and DNS that the code cannot do for you:

1. **Neon Postgres** — add from the *Vercel Marketplace* to the Vercel project. Use a separate database (or Neon branch) for **Preview** and **Production**. Copy the **pooled** connection string to `DATABASE_URL`. Optionally put the direct (non-pooled) string in `DATABASE_URL_UNPOOLED`; migrations prefer it.
2. **Vercel Blob** — create a **Public** store in the project. This sets `BLOB_READ_WRITE_TOKEN`.
3. **Resend** — create an account and **verify the sending domain** (add the SPF/DKIM DNS records Resend shows; this needs access to the Ministry's DNS and can take time). Set `RESEND_API_KEY` and `EMAIL_FROM` (e.g. `Federal Ministry of Transportation <no-reply@transportation.gov.ng>`). Without these, the admin still works: invitation links are shown on screen for a super administrator to pass on by hand.
4. **Environment variables** (Vercel → Settings → Environment Variables; see `.env.example`):
   - `SESSION_SECRET` — 32+ random bytes: `openssl rand -base64 32`. **Different per environment.** Changing it signs everyone out.
   - `SITE_URL` — the public origin, e.g. `https://www.transportation.gov.ng`. Used for links in emails (never taken from a request header).
   - `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `RESEND_API_KEY`, `EMAIL_FROM` as above.
5. Decide **data residency and backups** with the Ministry (Neon and Blob regions; Neon point-in-time-recovery retention depends on the plan).

### First deployment

From a machine with the repository and the `DATABASE_URL` for the target database:

```bash
npm install
npm run db:migrate     # creates the tables (re-runnable; applies only new migrations)
npm run db:seed        # loads the current website content (only into EMPTY tables; never overwrites edits)
npm run admin:bootstrap -- --email first.admin@transportation.gov.ng --name "Full Name"
```

`admin:bootstrap` prints a one-time invitation link (valid 72 hours) for the **first super administrator**. Open it, choose a password, then invite everyone else from **Users & access**. Re-running it for someone who hasn't signed in yet issues a fresh link, so it is also the **break-glass recovery** route (database credentials are the root of trust).

Until `db:seed` has run, the public site keeps serving its built-in content, so connecting a database never blanks the site.

### Schema changes later

Edit `src/db/schema/*`, run `npm run db:generate` (writes SQL into `drizzle/`, commit it), then `npm run db:migrate` against each database **before** deploying code that needs it.

### Local development (no cloud accounts needed)

```bash
npm run dev          # public site only, from src/content (admin says "not set up")
npm run dev:db       # site + admin on an embedded database under .data/ (LOCAL_DB=pglite)
npm run db:reset-local   # wipe the embedded database (it can be damaged if killed abruptly)
npm test             # unit tests (real migrations on an in-memory database)
```

On first `dev:db` start a local admin (`admin@localhost.test`) is created and its invitation link is printed in the terminal; uploads are stored under `.data/uploads` and emails are printed to the terminal.

### Security notes

- `/admin` and `/api/admin/*` are never cached or indexed (`no-store`, `noindex`, no framing, no referrer). `proxy.ts` only checks the cookie's signature; every page and Server Action re-checks the session **and the person's permissions** itself.
- Upload endpoints require a signed-in user, a same-origin request and pass a rate limit; files are checked by their actual contents, not just their name, and SVG is rejected.
- Sign-in, reset and token use are rate limited per email and per IP; all sign-in failures give the same message.
- **Not implemented in v1:** multi-factor authentication. For a government admin this is worth adding (TOTP). Until then: strong-password rule (12+ characters), rate limits, 12-hour sessions and the activity log.

### Troubleshooting

| Symptom | Likely cause |
|---|---|
| `/admin` says "Admin not set up yet" | `DATABASE_URL` or `SESSION_SECRET` missing/short in that environment. |
| Public site shows old content after adding the database | `db:seed` hasn't been run for that database yet. |
| Invitation says "no email could be sent" | `RESEND_API_KEY`/`EMAIL_FROM` missing, or the sending domain isn't verified yet. Copy the on-screen link and send it yourself. |
| "Uploading isn't set up yet" | `BLOB_READ_WRITE_TOKEN` missing. Pictures can still be linked. |
| Pictures from another site won't save | Only uploads and Unsplash/Pexels links are accepted (the hosts `next/image` is configured for). |
| A change isn't visible | It is applied immediately; check the item is not archived and that you edited the right section/kind. |
