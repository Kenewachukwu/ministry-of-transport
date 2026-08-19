import { siteMeta } from "@/content/siteMeta";

/**
 * lucide-react dropped brand/logo icons (trademark reasons), so these four
 * are minimal hand-drawn glyphs rather than an import.
 */
const XIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M18.9 2H22l-7.1 8.1L23 22h-7l-5.5-7.2L4 22H1l7.6-8.6L1 2h7l5 6.6L18.9 2Zm-2.5 18h1.9L7.7 4H5.7l10.7 16Z" />
  </svg>
);

const FacebookIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M13.5 21v-7.5h2.5l.5-3H13.5V8.2c0-.87.24-1.46 1.5-1.46H16.5V4.14C16.03 4.08 14.87 4 13.5 4c-2.7 0-4.5 1.65-4.5 4.68V10.5H6.5v3H9V21h4.5Z" />
  </svg>
);

const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const YoutubeIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M22 8.2s-.2-1.6-.8-2.3c-.8-.9-1.7-.9-2.1-1C16.4 4.6 12 4.6 12 4.6h0s-4.4 0-7.1.3c-.4 0-1.3.1-2.1 1-.6.7-.8 2.3-.8 2.3S1.8 10 1.8 11.8v1.4C1.8 15 2 16.8 2 16.8s.2 1.6.8 2.3c.8.9 1.9.9 2.4 1 1.7.2 7.1.3 7.1.3s4.4 0 7.1-.3c.4 0 1.3-.1 2.1-1 .6-.7.8-2.3.8-2.3s.2-1.8.2-3.6v-1.4C22.2 10 22 8.2 22 8.2ZM9.9 15V9l6 3-6 3Z" />
  </svg>
);

const links = [
  { label: "X (Twitter)", href: siteMeta.social.x, Icon: XIcon },
  { label: "Instagram", href: siteMeta.social.instagram, Icon: InstagramIcon },
  { label: "Facebook", href: siteMeta.social.facebook, Icon: FacebookIcon },
  { label: "YouTube", href: siteMeta.social.youtube, Icon: YoutubeIcon },
];

export function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={className}>
      {links.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-cta hover:text-white"
        >
          <Icon size={16} />
        </a>
      ))}
    </div>
  );
}
