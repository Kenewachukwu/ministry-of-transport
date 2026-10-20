# Hosting decision: where the website and admin run

**Status:** needs a decision from the Ministry before launch. **Prepared:** 20 October 2026.

## The question

The project proposal promised hosting on federal infrastructure (Galaxy Backbone) with data residency in line with the Nigeria Data Protection Act (NDPA). The admin was built and tested on commercial cloud services, because that is the quickest way to a working, reviewable site. The two need reconciling before real people's data is stored.

**What is stored that matters:** staff names and work email addresses (admin accounts), and, since the contact form was added, the **name, email address, optional telephone number and message of members of the public**. Pictures and documents are published material.

## What the code runs on today

| Part | Used now | Can run elsewhere? |
|---|---|---|
| Web app | Next.js on Vercel | Yes: `next build` and `next start` run on any Node 20+ server (a VM or container behind a reverse proxy). One instance is simplest; several instances need a shared cache so edits appear everywhere at once. |
| Database | Neon Postgres | Yes: any PostgreSQL 15+ through `DATABASE_URL`. Migrations are plain SQL (`npm run db:migrate`). |
| File uploads | Vercel Blob | **Not yet.** Outside Vercel there is no production storage driver: a local-disk mode exists only for development. A driver for a mounted disk or any S3-compatible store is needed (about 1 to 2 days). |
| Email | Resend (HTTP API) | **Not yet.** Galaxy Backbone or a Ministry mail server would need an SMTP driver (about 1 day). |
| Sign-in, sessions, audit | In the app and database | Yes. |

## The options

| | A. Stay on the commercial services | B. Federal infrastructure (Galaxy Backbone) | C. Start on A, designed to move to B |
|---|---|---|---|
| Speed to launch | Fastest: nothing more to build | Slowest: provisioning, security review, two missing drivers | Fast |
| Where data sits | Whichever region the Ministry chooses at the provider (not Nigeria unless the provider offers it) | In Nigeria, under the Ministry's control | Starts at the provider, moves later |
| NDPA position | Needs the Ministry's legal view on storing public enquiries and staff data abroad (cross-border transfer rules) | Simplest to defend | Same as A until the move |
| Running cost and effort | Monthly provider fees; the provider runs the servers | Ministry or Galaxy Backbone staff run servers, backups, patching and monitoring | As A, then as B |
| Main risk | Data residency objection | Slower, and day-to-day operations fall to a team that must be named | The move is a project of its own |

## Recommendation

**Option C, once the Ministry has answered the questions below.** Launch on managed services in the region the Ministry's legal advisers accept, and spend the 2 to 3 days it takes to add an SMTP driver and an S3-compatible or disk storage driver, so that moving to Galaxy Backbone is an operations task, not a rewrite. If the Ministry's answer to question 1 is that public enquiries and staff data **must** stay in Nigeria from day one, choose B and plan the extra time.

## Questions only the Ministry can answer

1. Must personal data of staff and the public be stored **in Nigeria** from launch? (Ask the Ministry's legal unit and, if needed, the Nigeria Data Protection Commission.)
2. If Galaxy Backbone: who will run it (patching, backups, monitoring), what do they offer (virtual machines, containers, managed PostgreSQL, object storage, outbound email), and what is the lead time?
3. Which email address will the website send from (for example `no-reply@transportation.gov.ng`), and who can add the DNS records that prove it?
4. How long may contact-form messages be kept, and who may ask for them to be deleted? (The privacy policy says this is being confirmed.)
5. Who is responsible for backups and for restoring the site, and how quickly must it come back after a failure?

## Whichever option is chosen

- Backups of the database (point-in-time if possible) and of uploaded files, with a restore tested once before launch.
- `SESSION_SECRET`, database and email credentials held by the Ministry, not only by the developers.
- DNS for the website address, and a plan for the old WordPress site's addresses (redirects need the list of old addresses worth keeping).
