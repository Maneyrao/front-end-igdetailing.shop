import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

type BackLinkProps = {
  fallback: string;
  label: string;
  className?: string;
};

export function BackLink({ fallback, label, className = '' }: BackLinkProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(fallback);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-2 text-gray-400 transition hover:text-white ${className}`}
    >
      <ArrowLeft className="h-5 w-5" />
      {label}
    </button>
  );
}
