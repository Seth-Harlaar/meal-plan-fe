'use client'

function IconContainer({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <span className="icon-container" onClick={onClick}>
      {children}
    </span>
  );
}

function IconButton({ src, className, onClick }: { src: string; className: string; onClick?: () => void }) {
  return (
    <IconContainer onClick={onClick}>
      <img className={`icon ${className}`} src={src} />
    </IconContainer>
  );
}

// Define buttons using only image src and className
export function EditButton(props: { onClick?: () => void }) {
  return <IconButton src="/icons/pencil.svg" className="edit-button" {...props} />;
}

export function RefreshButton(props: { onClick?: () => void }) {
  return <IconButton src="/icons/refresh.svg" className="refresh-button" {...props} />;
}

export function HamburgerMenuButton(props: { onClick?: () => void }) {
  return <IconButton src="/icons/hamburger.svg" className="ham-menu-button" {...props} />;
}

export function PlusButton(props: { onClick?: () => void }) {
  return <IconButton src="/icons/plus.svg" className="plus-button" {...props} />;
}

export function XButton(props: { onClick?: () => void }) {
  return <IconButton src="/icons/x.svg" className="x-button" {...props} />;
}