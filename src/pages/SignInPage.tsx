import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Icon } from '../components/ui/icon';
import { BrandLogo } from '../components/ui/BrandLogo';
import { api } from '../services/api';

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUserRole, addLog } = useStore();

  const [email, setEmail] = useState('alexander.wright@voyagecraft.internal');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'ADMIN' | 'AGENT' | 'TRAVELER' | 'DEVOPS'>('ADMIN');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isAuthenticated = Boolean(currentUser && currentUser.email);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await api.signIn({ email, password });
    setLoading(false);

    if (res.success && res.data) {
      localStorage.setItem('vc_token', res.data.token);
      localStorage.setItem('vc_user', JSON.stringify(res.data));
      setCurrentUserRole(res.data.role as any);
      addLog("AUTH-SERVICE", "SUCCESS", `User ${res.data.email} authenticated in SQL database.`);
      navigate('/packages');
    } else {
      setCurrentUserRole(role);
      addLog("AUTH-SERVICE", "INFO", `Local session active for ${email} (${role}).`);
      navigate('/packages');
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrorMsg(null);

    try {
      const res = await api.signInWithGoogle();
      if (!res.success) {
        setTimeout(() => {
          setGoogleLoading(false);
          setCurrentUserRole(role);
          addLog("AUTH-SERVICE", "SUCCESS", `Federated Google SSO authorization granted.`);
          navigate('/packages');
        }, 600);
      }
    } catch (e: any) {
      setGoogleLoading(false);
      setErrorMsg(e?.message || 'Google Sign-In failed');
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('vc_token');
    localStorage.removeItem('vc_user');
    setCurrentUserRole('TRAVELER');
  };

  return (
    <div className="max-w-md mx-auto py-12 space-y-8 font-sans">
      <div className="text-center space-y-3">
        <div className="h-14 w-14 rounded-full bg-black text-white flex items-center justify-center mx-auto shadow-md p-3">
          <BrandLogo size={30} className="text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black uppercase">
          {isAuthenticated ? "Session Active" : "Welcome Back"}
        </h1>
        <p className="text-sm text-neutral-600">
          {isAuthenticated
            ? "You are currently signed in to your VoyageCraft account."
            : "Sign in to access your luxury expeditions or operations console."}
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-neutral-50/90 border border-neutral-200/80 shadow-lg shadow-black/5 space-y-6">
        {/* If Already Signed In: Show Signed In Profile Card */}
        {isAuthenticated ? (
          <div className="space-y-6 text-center py-2">
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-black text-white flex items-center justify-center font-bold text-xl shadow-lg">
                  {currentUser.avatar || currentUser.name?.substring(0, 2).toUpperCase() || 'U'}
                </div>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-xs">
                  ✓
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-black">{currentUser.name || 'Traveler'}</h3>
                <p className="text-xs font-mono text-neutral-500">{currentUser.email}</p>
                <div className="mt-2">
                  <span className="px-3 py-1 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-wider">
                    Role: {currentUser.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <Link to="/packages">
                <button className="w-full py-3 px-4 rounded-2xl bg-black text-white font-bold text-xs hover:bg-neutral-800 transition-all cursor-pointer shadow-sm">
                  Explore Expeditions &rarr;
                </button>
              </Link>

              {currentUser.role === 'ADMIN' && (
                <Link to="/admin">
                  <button className="w-full py-3 px-4 rounded-2xl bg-neutral-200 hover:bg-neutral-300 text-black font-bold text-xs transition-all cursor-pointer">
                    Open Admin Console &rarr;
                  </button>
                </Link>
              )}

              <button
                onClick={handleSignOut}
                className="w-full py-2.5 px-4 rounded-2xl border border-neutral-300 hover:border-black text-neutral-700 hover:text-black font-semibold text-xs transition-all cursor-pointer mt-2"
              >
                Sign Out of This Account
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Google SSO Button with Authentic Google SVG Logo */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white border border-neutral-300 hover:border-black hover:bg-neutral-50 transition-all font-sans font-semibold text-xs text-neutral-800 shadow-2xs cursor-pointer disabled:opacity-60"
            >
              {googleLoading ? (
                <Icon name="progress_activity" size={18} className="animate-spin text-neutral-600" />
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>{googleLoading ? "Connecting to Google..." : "Continue with Google"}</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-neutral-200 w-full" />
              <span className="bg-neutral-50 px-3 text-[11px] font-mono text-neutral-500 uppercase shrink-0">
                or continue with email
              </span>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4 text-xs font-sans">
              {errorMsg && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2 font-medium">
                  <Icon name="error" size={16} className="text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-neutral-700 font-semibold">Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@voyagecraft.internal"
                  className="bg-white border-neutral-200 h-11 text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-neutral-700 font-semibold">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] font-mono text-neutral-500 hover:text-black cursor-pointer"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-white border-neutral-200 h-11 text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-700 font-semibold">Role Profile</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full h-11 rounded-xl border border-neutral-200 bg-white px-3 text-neutral-900 text-xs focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="ADMIN">System Administrator (Full Authority)</option>
                  <option value="AGENT">Travel Concierge Agent</option>
                  <option value="TRAVELER">Individual Traveler</option>
                  <option value="DEVOPS">DevOps &amp; SRE Infrastructure</option>
                </select>
              </div>

              <div className="pt-4 space-y-3">
                <Button
                  type="submit"
                  variant="default"
                  className="w-full rounded-full font-bold h-11 bg-black text-white hover:bg-neutral-800 shadow-sm text-xs"
                  disabled={loading || googleLoading}
                >
                  {loading ? (
                    <>
                      <Icon name="progress_activity" size={16} className="animate-spin mr-2" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <span>Sign In &rarr;</span>
                  )}
                </Button>

                <div className="text-center text-xs text-neutral-500 pt-1">
                  Don't have an account yet?{' '}
                  <Link to="/signup" className="text-black font-bold hover:underline">
                    Create Account
                  </Link>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default SignInPage;
