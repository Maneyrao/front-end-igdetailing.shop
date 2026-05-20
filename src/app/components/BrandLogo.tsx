import { STORE_NAME, STORE_TAGLINE } from '../../lib/business';

type BrandLogoProps = {
  variant?: 'header' | 'footer' | 'hero' | 'admin';
  showTagline?: boolean;
  className?: string;
};

const sizeClasses = {
  header: 'h-12 w-[188px] sm:h-[54px] sm:w-[220px]',
  footer: 'h-16 w-[258px]',
  hero: 'h-auto w-full max-w-[560px] sm:max-w-[640px]',
  admin: 'h-10 w-[166px]',
};

export function BrandLogo({ variant = 'header', showTagline = false, className = '' }: BrandLogoProps) {
  return (
    <div className={`flex min-w-0 items-center gap-3 ${className}`} aria-label={STORE_NAME}>
      <img
        src="/brand/ig-detailing-shop-logo.svg"
        alt={STORE_NAME}
        className={`${sizeClasses[variant]} shrink-0 object-contain`}
        draggable={false}
        decoding="async"
      />
      {showTagline && (
        <span className="hidden max-w-[9rem] text-[10px] font-semibold uppercase leading-tight text-slate-500 2xl:block">
          {STORE_TAGLINE}
        </span>
      )}
    </div>
  );
}
