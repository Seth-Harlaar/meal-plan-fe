'use client'

function IconContainer({ children }: { children: React.ReactNode}) {
  return (
    <span className="icon-container">
      {children}
    </span>
  );
}

function IconButton({ src, className }: { src: string; className: string }) {
  return (
    <IconContainer>
      <img className={`icon ${className}`} src={src} />
    </IconContainer>
  );
}


export function StarIcon() {
  return <IconButton src="/icons/star.svg" className="icon-star"/>;
}
