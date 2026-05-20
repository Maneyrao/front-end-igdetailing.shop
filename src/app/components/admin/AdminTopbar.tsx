import { ReactNode } from 'react';

interface AdminTopbarProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function AdminTopbar({ title, subtitle, action }: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#1E2030] bg-[#060608]/80 backdrop-blur px-4 lg:px-6">
      <div className="pl-10 lg:pl-0">
        <h1 className="text-base font-semibold text-white">{title}</h1>
        {subtitle && <p className="text-xs text-[#64748B]">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </header>
  );
}
