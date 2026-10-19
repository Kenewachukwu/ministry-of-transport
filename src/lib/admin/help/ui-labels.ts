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
  // Lists
  "Published", "Archived", "All", "Search", "Clear search", "Edit", "Archive", "Restore", "Older →", "← Newer", "Up", "Down", "Remove block", "Save new order",
  // Forms
  "Save changes", "Save heading", "Save access", "Upload a picture", "Upload a file", "Add a detail", "Add a target", "Add a block",
  // Site text and FCSSIP heading
  "Mandate", "Vision", "Mission", "Title", "Small heading above the title", "Introduction under the title",
  // Department blocks
  "Heading", "Lead-in sentence (optional)",
  // People
  "Full name", "Ministry email address", "Role", "Content editor", "Super administrator", "Sections this person can manage",
  "Send invitation", "Send a new invitation", "Manage", "Deactivate account", "Reactivate account",
  // Public wording quoted in guides (so staff can recognise it on the website)
  "Why we exist", "Where we are headed", "How we get there", "Name to be announced", "Available on request",
  // System status lines
  "Database", "Content seeded", "Website address",
];
