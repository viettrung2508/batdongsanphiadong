const contactItems = [
  {
    href: "https://www.facebook.com/profile.php?id=61585071675406",
    label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M13.5 21v-7h2.3l.4-2.8h-2.7V9.4c0-.8.2-1.4 1.4-1.4h1.5V5.5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.9v1.9H8V14h2.5v7h3Z" />
      </svg>
    ),
    bgClass: "bg-[#1877F2]",
    pulseClass: "before:bg-[#1877F2]/30"
  },
  {
    href: "tel:0377281119",
    label: "Phone",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[15px] w-[15px] fill-current">
        <path d="M6.6 10.8a15.6 15.6 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.4.6 3.7.6.6 0 1 .4 1 1V21c0 .6-.4 1-1 1C10.6 22 2 13.4 2 3c0-.6.4-1 1-1h4.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.7.1.4 0 .8-.3 1.1l-2.2 2Z" />
      </svg>
    ),
    bgClass: "bg-[#16a34a]",
    pulseClass: "before:bg-[#16a34a]/30"
  },
  {
    href: "https://zalo.me/0377281119",
    label: "Zalo",
    icon: <span className="text-base font-black leading-none">Z</span>,
    bgClass: "bg-[#0068ff]",
    pulseClass: "before:bg-[#0068ff]/30"
  }
];

export function FloatingContact() {
  return (
    <div className="fixed bottom-5 left-4 z-[70] flex flex-col gap-4 sm:bottom-6 sm:left-6">
      {contactItems.map((item, index) => (
        <a
          key={item.label}
          href={item.href}
          aria-label={item.label}
          target={item.href.startsWith("http") ? "_blank" : undefined}
          rel={item.href.startsWith("http") ? "noreferrer" : undefined}
          className={`contact-float ${item.bgClass} ${item.pulseClass}`}
          style={{ animationDelay: `${index * 0.18}s` }}
        >
          <span className="contact-float__icon">{item.icon}</span>
        </a>
      ))}
    </div>
  );
}
