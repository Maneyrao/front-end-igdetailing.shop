import { STORE_NAME, STORE_TAGLINE } from '../../lib/business';

type BrandLogoProps = {
  variant?: 'header' | 'footer' | 'hero' | 'admin';
  showTagline?: boolean;
  className?: string;
};

const sizeClasses = {
  header: 'h-12 w-[186px] sm:h-[54px] sm:w-[208px]',
  footer: 'h-16 w-[248px]',
  hero: 'h-28 w-full max-w-[500px] sm:h-32 sm:max-w-[560px]',
  admin: 'h-10 w-[154px]',
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
