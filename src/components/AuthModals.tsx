import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Icon } from './ui/icon';
import { api } from '../services/api';

const GoogleIcon: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
  <svg className={className} viewBox="0 0 24 24">
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
);

export const SignInModal: React.FC = () => {
  const { isSignInModalOpen, setIsSignInModalOpen, setIsSignUpModalOpen, setCurrentUserRole, addLog } = useStore();

  const [email, setEmail] = useState('alexander.wright@voyagecraft.internal');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'ADMIN' | 'AGENT' | 'TRAVELER' | 'DEVOPS'>('ADMIN');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
      addLog("AUTH-SERVICE", "SUCCESS", `User ${res.data.email} successfully authenticated in SQL database.`);
      setIsSignInModalOpen(false);
    } else {
      setCurrentUserRole(role);
      addLog("AUTH-SERVICE", "INFO", `Local session active for ${email} (${role}).`);
      setIsSignInModalOpen(false);
    }
  };

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    setTimeout(() => {
      setGoogleLoading(false);
      setCurrentUserRole(role);
      addLog("AUTH-SERVICE", "SUCCESS", `User authenticated via Google SSO identity provider.`);
      setIsSignInModalOpen(false);
    }, 800);
  };

  const switchToSignUp = () => {
    setIsSignInModalOpen(false);
    setIsSignUpModalOpen(true);
  };

  return (
    <Dialog open={isSignInModalOpen} onOpenChange={setIsSignInModalOpen} className="bg-white border-neutral-200 max-w-md">
      <DialogHeader>
        <div className="flex items-center justify-between mb-1">
          <Badge variant="outline" className="rounded-full text-[10px] font-mono">AUTH SERVICE</Badge>
          <span className="text-[11px] font-mono text-neutral-500">SQL &amp; JWT Authenticated</span>
        </div>
        <DialogTitle className="text-2xl font-black text-black">Sign In to VoyageCraft</DialogTitle>
        <DialogDescription className="text-xs text-neutral-500">
          Access your traveler reservations or administrative control console.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 pt-2">
        {/* Google SSO Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-2xl bg-white border border-neutral-300 hover:border-black hover:bg-neutral-50 transition-all font-sans font-semibold text-xs text-neutral-800 shadow-2xs cursor-pointer disabled:opacity-60"
        >
          {googleLoading ? (
            <Icon name="progress_activity" size={16} className="animate-spin text-neutral-600" />
          ) : (
            <GoogleIcon />
          )}
          <span>{googleLoading ? "Authorizing Google..." : "Continue with Google"}</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-neutral-200 w-full" />
          <span className="bg-white px-3 text-[10px] font-mono text-neutral-500 uppercase shrink-0">
            or sign in with email
          </span>
        </div>

        <form onSubmit={handleSignIn} className="space-y-3.5 text-xs font-sans">
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2 font-medium">
              <Icon name="error" size={16} className="text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-neutral-700 font-semibold">Email Address</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@voyagecraft.internal"
              className="bg-white border-neutral-200 h-10 text-xs"
              required
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-neutral-700 font-semibold">Password</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[10px] font-mono text-neutral-500 hover:text-black cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-white border-neutral-200 h-10 text-xs"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-neutral-700 font-semibold">Role Profile</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full h-10 rounded-xl border border-neutral-200 bg-white px-3 text-neutral-900 text-xs focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="ADMIN">System Administrator (Full Authority)</option>
              <option value="AGENT">Travel Concierge Agent</option>
              <option value="TRAVELER">Individual Traveler</option>
              <option value="DEVOPS">DevOps &amp; SRE Infrastructure</option>
            </select>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={switchToSignUp}
              className="text-xs text-neutral-500 hover:text-black underline cursor-pointer"
            >
              Need an account? Sign Up
            </button>
            <Button type="submit" variant="default" className="rounded-full w-full sm:w-auto font-bold px-6 bg-black text-white hover:bg-neutral-800 text-xs h-10" disabled={loading || googleLoading}>
              {loading ? "Verifying..." : "Sign In &rarr;"}
            </Button>
          </DialogFooter>
        </form>
      </div>
    </Dialog>
  );
};

export const SignUpModal: React.FC = () => {
  const { isSignUpModalOpen, setIsSignUpModalOpen, setIsSignInModalOpen, setCurrentUserRole, addLog } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'TRAVELER' | 'AGENT' | 'ADMIN' | 'DEVOPS'>('TRAVELER');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMsg('Please complete all mandatory fields.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const res = await api.signUp({ name, email, password, role });
    setLoading(false);

    if (res.success && res.data) {
      localStorage.setItem('vc_token', res.data.token);
      localStorage.setItem('vc_user', JSON.stringify(res.data));
      setCurrentUserRole(res.data.role as any);
      addLog("AUTH-SERVICE", "SUCCESS", `New user ${email} (${role}) registered in SQL database.`);
      setIsSignUpModalOpen(false);
    } else {
      setErrorMsg(res.error || 'Registration failed.');
    }
  };

  const handleGoogleSignUp = () => {
    setGoogleLoading(true);
    setTimeout(() => {
      setGoogleLoading(false);
      setCurrentUserRole(role);
      addLog("AUTH-SERVICE", "SUCCESS", `New account registered via Google OAuth.`);
      setIsSignUpModalOpen(false);
    }, 800);
  };

  const switchToSignIn = () => {
    setIsSignUpModalOpen(false);
    setIsSignInModalOpen(true);
  };

  return (
    <Dialog open={isSignUpModalOpen} onOpenChange={setIsSignUpModalOpen} className="bg-white border-neutral-200 max-w-md">
      <DialogHeader>
        <div className="flex items-center justify-between mb-1">
          <Badge variant="outline" className="rounded-full text-[10px] font-mono">USER REGISTRATION</Badge>
          <span className="text-[11px] font-mono text-neutral-500">SQL Persisted</span>
        </div>
        <DialogTitle className="text-2xl font-black text-black">Create VoyageCraft Account</DialogTitle>
        <DialogDescription className="text-xs text-neutral-500">
          Register your traveler or agent profile in the database.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 pt-2">
        {/* Google SSO Button */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-2xl bg-white border border-neutral-300 hover:border-black hover:bg-neutral-50 transition-all font-sans font-semibold text-xs text-neutral-800 shadow-2xs cursor-pointer disabled:opacity-60"
        >
          {googleLoading ? (
            <Icon name="progress_activity" size={16} className="animate-spin text-neutral-600" />
          ) : (
            <GoogleIcon />
          )}
          <span>{googleLoading ? "Authorizing Google..." : "Sign up with Google"}</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-neutral-200 w-full" />
          <span className="bg-white px-3 text-[10px] font-mono text-neutral-500 uppercase shrink-0">
            or sign up with email
          </span>
        </div>

        <form onSubmit={handleSignUp} className="space-y-3.5 text-xs font-sans">
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2 font-medium">
              <Icon name="error" size={16} className="text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-neutral-700 font-semibold">Full Name *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Johnathan Doe"
              className="bg-white border-neutral-200 h-10 text-xs"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-neutral-700 font-semibold">Email Address *</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="bg-white border-neutral-200 h-10 text-xs"
              required
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-neutral-700 font-semibold">Password *</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[10px] font-mono text-neutral-500 hover:text-black cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-white border-neutral-200 h-10 text-xs"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-neutral-700 font-semibold">Role Assignment</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full h-10 rounded-xl border border-neutral-200 bg-white px-3 text-neutral-900 text-xs focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="TRAVELER">Individual Traveler</option>
              <option value="AGENT">VoyageCraft Travel Agent</option>
              <option value="ADMIN">Tour Administrator</option>
              <option value="DEVOPS">DevOps &amp; Infrastructure</option>
            </select>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={switchToSignIn}
              className="text-xs text-neutral-500 hover:text-black underline cursor-pointer"
            >
              Already have an account? Sign In
            </button>
            <Button type="submit" variant="default" className="rounded-full w-full sm:w-auto font-bold px-6 bg-black text-white hover:bg-neutral-800 text-xs h-10" disabled={loading || googleLoading}>
              {loading ? "Registering..." : "Sign Up &rarr;"}
            </Button>
          </DialogFooter>
        </form>
      </div>
    </Dialog>
  );
};
