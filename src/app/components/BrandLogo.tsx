import { STORE_NAME, STORE_TAGLINE } from '../../lib/business';

type BrandLogoProps = {
  variant?: 'header' | 'footer' | 'hero' | 'admin';
  showTagline?: boolean;
  className?: string;
};

const sizeClasses = {
  header: 'h-10 w-[168px] sm:w-[188px]',
  footer: 'h-12 w-[200px]',
  hero: 'h-20 w-[320px] max-w-full',
  admin: 'h-9 w-[150px]',
};

export function BrandLogo({ variant = 'header', showTagline = false, className = '' }: BrandLogoProps) {
  const gradientId = `ig-logo-gradient-${variant}`;
  const shineId = `ig-logo-shine-${variant}`;

  return (
    <div className={`flex items-center gap-3 ${className}`} aria-label={STORE_NAME}>
      <svg
        className={sizeClasses[variant]}
        viewBox="0 0 420 112"
        role="img"
        aria-labelledby={`${variant}-logo-title`}
      >
        <title id={`${variant}-logo-title`}>{STORE_NAME}</title>
        <defs>
          <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#E5E7EB" />
            <stop offset="48%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#8EA0AD" />
          </linearGradient>
          <linearGradient id={shineId} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="52%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#7DD3FC" />
          </linearGradient>
        </defs>

        <path
          d="M28 15h366c8 0 13 8 10 15l-13 34c-2 5-7 9-13 9H22c-8 0-13-8-10-15l13-34c2-5 7-9 13-9Z"
          fill="#030405"
          stroke="#38BDF8"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path d="M154 30h232l-8 20H146l8-20Z" fill={`url(#${shineId})`} />
        <path d="M38 30h32L56 59H25l13-29Z" fill={`url(#${gradientId})`} />
        <path
          d="M82 30h68l-10 21h-28l-3 7h22l-7 15H63l19-43Z"
          fill={`url(#${gradientId})`}
        />
        <text
          x="155"
          y="61"
          fill="#38BDF8"
          fontFamily="Arial Black, Arial, sans-serif"
          fontSize="39"
          fontWeight="900"
          fontStyle="italic"
        >
          DETAILING
        </text>
        <text
          x="164"
          y="103"
          fill="#38BDF8"
          fontFamily="Brush Script MT, Segoe Script, cursive"
          fontSize="50"
          fontWeight="700"
        >
          Shop
        </text>
      </svg>
      {showTagline && (
        <span className="hidden text-[10px] font-semibold uppercase text-slate-500 sm:block">
          {STORE_TAGLINE}
        </span>
      )}
    </div>
  );
}
