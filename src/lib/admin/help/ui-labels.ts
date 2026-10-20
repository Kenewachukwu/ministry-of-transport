/**
 * Buttons, links, panels and fields that the guides quote in “curly quotes” and
 * that are NOT derived from the content registry, the menu or the section names.
 * A test checks every quoted label in every guide against this list plus those
 * sources, so renaming something in the admin without updating its guide fails
 * the build instead of quietly misleading people.
 *
 * When you change wording in the admin, change it here and in the guides together.
 */
export const UI_LABELS: string[] = [
  // Sign-in and account
  "Sign in", "Email", "Password", "Confirm password", "Activate account", "Forgot your password?", "Send reset link",
  "Current password", "New password", "Confirm new password", "Change password", "My account", "Sign out", "Sign in again in a new tab",
  // Menu and navigation
  "Menu", "Dashboard", "Help", "View website", "View on website", "Users & access", "Activity log", "System status",
  // Approval workflow
  "Drafts", "Waiting for approval", "Approvals", "Approval", "Review", "Save as draft", "Save draft", "Save proposed changes", "Submit for approval",
  "Save and resubmit for approval", "Publish now", "Publish", "Approve and publish", "Send back", "Note to the author", "Discard draft", "Discard proposed changes",
  "On the website now", "Proposed", "Draft",
  // Lists
  "Published", "Archived", "All", "Search", "Clear search", "Edit", "Archive", "Restore", "Cancel", "Older →", "← Newer", "Up", "Down", "Remove", "Remove block", "Save new order",
  // Forms
  "Save changes", "Save heading", "Save access", "Upload a picture", "Upload a file", "Add a detail", "Add a target", "Add a block", "More pictures", "Add a picture", "Caption (optional)",
  // Site text and FCSSIP heading
  "Mandate", "Vision", "Mission", "Title", "Small heading above the title", "Introduction under the title",
  // Contact details
  "Address", "Opening hours", "Email address", "Telephone number", "X (Twitter) link", "Instagram link", "Facebook link", "YouTube link",
  // Department blocks
  "Heading", "Lead-in sentence (optional)",
  // People
  "Full name", "Ministry email address", "Role", "Content editor", "Super administrator", "Sections this person can manage",
  "Send invitation", "Send a new invitation", "Manage", "Deactivate account", "Reactivate account", "Sign-in email address", "Change email address",
  // Public wording quoted in guides (so staff can recognise it on the website)
  "Why we exist", "Where we are headed", "How we get there", "Name to be announced", "Available on request",
  // System status lines
  "Database", "Content seeded", "Website address",
];
