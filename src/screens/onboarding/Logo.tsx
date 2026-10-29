export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`logo ${className}`} aria-label="NYFW Style">
      <div className="mark">NYFW</div>
      <div className="gold-rule" style={{ margin: '12px 0 0 2px' }} />
      <div className="word">STYLE</div>
    </div>
  );
}
