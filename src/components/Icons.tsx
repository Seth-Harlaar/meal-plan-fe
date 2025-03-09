'use client'

function IconContainer({ src, className }: { src: string; className: string }) {
  return (
    <span className="icon-container">
      <img className={`icon ${className}`} src={src} />
    </span>
  );
}

export function IconButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <div className="icon-button-wrapper" onClick={onClick}>
      {children}
    </div>
  );
}

export function LinkWrapper({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a className="icon-link-wrapper" href={href}>
      {children}
    </a>
  );
}

export function ArrowIcon() {
  return <IconContainer src="/icons/arrow.svg" className="icon-arrow" />;
}

export function EditIcon() {
  return <IconContainer src="/icons/pencil.svg" className="icon-edit" />;
}

export function RefreshIcon() {
  return <IconContainer src="/icons/refresh.svg" className="icon-refresh" />;
}

export function HamburgerMenuIcon() {
  return <IconContainer src="/icons/hamburger.svg" className="icon-ham-menu" />;
}

export function PlusIcon() {
  return <IconContainer src="/icons/plus.svg" className="icon-plus" />;
}

export function StarIcon() {
  return <IconContainer src="/icons/star.svg" className="icon-star"/>;
}

export function XIcon() {
  return <IconContainer src="/icons/x.svg" className="icon-x" />;
}
