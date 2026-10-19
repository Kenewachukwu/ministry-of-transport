import type { HelpGuide } from "../types";

const reviewed = "2026-10-19";

export const startGuides: HelpGuide[] = [
  {
    slug: "accept-your-invitation",
    title: "Accept your invitation and sign in",
    summary: "Choose your password the first time, then sign in whenever you need to update the website.",
    area: "start",
    audience: "everyone",
    time: "3 minutes",
    steps: [
      {
        text: "Open the invitation email and click the link in it.",
        detail: "The email says you have been invited to manage content on the Ministry's website. The link works once and expires after 72 hours.",
      },
      {
        text: "On the Activate your account page, type a password in “Password”, then type it again in “Confirm password”.",
        detail: "Use at least 12 characters. A short sentence that only you would think of works well and is easy to remember.",
      },
      { text: "Press “Activate account”.", detail: "You are signed in and taken to your dashboard." },
      {
        text: "Next time, go to the admin address you were given, type your email in “Email” and your password in “Password”, then press “Sign in”.",
      },
    ],
    tips: [
      "Your sign-in lasts 12 hours. After that you sign in again. The admin warns you 15 minutes before it ends.",
      "Keep your password private. No one from the Ministry or the support team will ever ask for it.",
    ],
    problems: [
      {
        q: "The page says Invitation expired.",
        a: "Invitation links work once and last 72 hours. Ask a super administrator to open “Users & access”, choose “Manage” next to your name, and press “Send a new invitation”.",
      },
      {
        q: "I never received the email.",
        a: "Check your spam or junk folder first. If it is not there, ask a super administrator to send a new invitation. If email is not set up yet, they can give you the link directly.",
      },
    ],
    related: ["forgot-your-password", "finding-your-way-around"],
    reviewed,
  },
  {
    slug: "forgot-your-password",
    title: "Reset a password you have forgotten",
    summary: "Get an emailed link and choose a new password.",
    area: "start",
    audience: "everyone",
    time: "3 minutes",
    steps: [
      { text: "On the sign-in page, click “Forgot your password?”." },
      { text: "Type your email address in “Email” and press “Send reset link”." },
      {
        text: "Open the email and click the link.",
        detail: "The link works once and lasts 60 minutes. The page always says the same thing whether or not the address has an account, so check you typed it correctly.",
      },
      { text: "On the Choose a new password page, type a new password in “New password” and again in “Confirm new password”." },
      { text: "Press “Change password”, then sign in with the new password." },
    ],
    tips: ["If you can still sign in and just want a different password, use “My account” instead (see the guide Change your password)."],
    problems: [
      { q: "No email arrives.", a: "Check your spam folder, wait a few minutes, then try once more. If it still does not arrive, ask a super administrator to check “System status”." },
      { q: "The page says Link expired.", a: "Reset links last 60 minutes and work once. Start again from “Forgot your password?”." },
    ],
    related: ["change-your-password", "accept-your-invitation"],
    reviewed,
  },
  {
    slug: "finding-your-way-around",
    title: "Find your way around the admin",
    summary: "What each part of the screen is for, and what you can and cannot see.",
    area: "start",
    audience: "everyone",
    time: "3 minutes",
    steps: [
      {
        text: "Look at the menu on the left (on a phone, press “Menu” at the top).",
        detail: "It lists the parts of the website you are allowed to change under Content. Super administrators also see Administration, with “Users & access”, “Activity log” and “System status”.",
      },
      { text: "Press “Dashboard” at any time to come back to the start page.", link: { label: "Open the dashboard", href: "/admin" } },
      {
        text: "Open any section. Each one shows a list with two tabs, “Published” and “Archived”.",
        detail: "Published items are on the website now. Archived items are hidden but never deleted.",
      },
      { text: "Press the green Add button at the top of a list to create something new, or “Edit” beside an item to change it." },
      {
        text: "At the bottom of the menu you will find “Help”, “My account”, “View website” and “Sign out”.",
        detail: "“View website” opens the public site in a new tab so you can check your work.",
        link: { label: "My account", href: "/admin/account" },
      },
    ],
    tips: [
      "You only see the sections a super administrator has given you. If something is missing, ask them.",
      "A section you are not allowed to open takes you back to the dashboard with a short notice.",
    ],
    related: ["how-changes-reach-the-website", "archive-and-restore"],
    reviewed,
  },
  {
    slug: "change-your-password",
    title: "Change your password",
    summary: "Choose a new password while you are signed in.",
    area: "start",
    audience: "everyone",
    time: "2 minutes",
    steps: [
      { text: "Press “My account” in the menu.", link: { label: "Open My account", href: "/admin/account" } },
      { text: "In the Change password panel, type your present password in “Current password”." },
      { text: "Type the new one in “New password” and again in “Confirm new password”.", detail: "At least 12 characters. A short sentence works well." },
      { text: "Press “Change password”." },
    ],
    tips: ["Changing your password signs you out of any other browser you were using. You stay signed in here."],
    related: ["forgot-your-password"],
    reviewed,
  },
  {
    slug: "how-changes-reach-the-website",
    title: "How changes reach the website",
    summary: "When your changes go live, how to check them, and why nothing is ever lost.",
    area: "start",
    audience: "everyone",
    steps: [
      { text: "Make your change and press the save button (for example “Save changes”).", detail: "The change is live on the public website straight away." },
      {
        text: "To check it, press “View on website” on the item's page, or “View website” in the menu.",
        detail: "Both open the public site in a new tab. If you still see the old version, refresh the tab.",
      },
      {
        text: "To take something off the website, press “Archive”.",
        detail: "Archiving hides it immediately. It is not deleted, and you can bring it back with “Restore”.",
      },
    ],
    tips: [
      "Changing the order of a list only takes effect when you press “Save new order”.",
      "The “Activity log” (super administrators) records who changed what, and when.",
    ],
    related: ["archive-and-restore", "rearrange-the-order"],
    reviewed,
  },
];
