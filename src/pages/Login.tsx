import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/admin/dashboard';
  const isEmailValid = /\S+@\S+\.\S+/.test(email);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await login({ email, password, rememberMe });

    setIsSubmitting(false);
    if (result.success) {
      navigate(redirectTo, { replace: true });
    } else {
      setError(result.error ?? 'Unable to sign in.');
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel — brand */}
      <div className="hidden w-[45%] flex-col justify-between bg-navy p-10 lg:flex">
        <div>
          <div className="font-display text-2xl font-bold text-white">YBS</div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.15em] text-white/40">Admin Panel</div>
        </div>
        <div>
          <h2 className="font-display text-3xl font-bold leading-tight text-white">
            Run your entire<br />startup services<br />business from here.
          </h2>
          <p className="mt-4 max-w-sm text-[13px] text-white/50">
            Orders, providers, billing, and books — one platform for your whole operation.
          </p>
        </div>
        <div className="text-[11px] text-white/30">© 2026 YBS. All rights reserved.</div>
      </div>

      {/* Right panel — login form */}
      <div className="flex flex-1 items-center justify-center bg-canvas p-6">
        <div className="w-full max-w-[380px]">
          <h1 className="font-display text-3xl font-bold text-text-primary">Welcome back</h1>
          <p className="mt-1.5 text-[13px] text-text-muted">Sign in to your admin account</p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ybs.in"
                  required
                  className="w-full border-b-2 border-border-subtle bg-transparent pb-2 pr-7 text-[14px] text-text-primary outline-none focus:border-gold"
                />
                {isEmailValid && (
                  <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-white">
                    <Check size={11} strokeWidth={3} />
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border-b-2 border-border-subtle bg-transparent pb-2 text-[14px] text-text-primary outline-none focus:border-gold"
              />
            </div>

            <div className="flex items-center justify-between text-[12px]">
              <label className="flex cursor-pointer items-center gap-2 text-text-muted">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3.5 w-3.5 cursor-pointer accent-gold"
                />
                Remember me
              </label>
              <a href="#" className="font-medium text-gold hover:underline">
                Forgot password?
              </a>
            </div>

            {error && <p className="text-[12px] text-danger">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-navy py-3 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? 'Signing in…' : 'Login'}
            </button>
          </form>

          <p className="mt-8 rounded-lg border border-border-subtle bg-surface p-3 text-center text-[11px] text-text-muted">
            Demo credentials — <strong className="text-text-primary">admin@ybs.in</strong> / <strong className="text-text-primary">Admin@123</strong>
          </p>
        </div>
      </div>
    </div>
  );
}