import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Menu, X, Mail, Lock, User,
  PlayCircle, Info, Truck, ShieldCheck,
  Target, HelpCircle, BookOpen, FileText,
  Cookie, ChevronRight, LayoutGrid,
  UserPlus2Icon, Search, Car, ClipboardCheck, Star, CreditCard
} from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useGlobalState } from "@/context/GlobalStateContext";
import { useAuth } from "@/context/AuthContext";
import { useLogout } from "@/hooks/useLogout";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { toast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { GoogleLogin } from "@react-oauth/google";
import { LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/lib/api";

import { CurrencySwitcher } from "@/components/CurrencySwitcher";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"signup" | "login">("signup");
  const { openShippingModal, openCookiesBanner, activeLang, handleLanguageSelect } = useGlobalState();
  const { user, isAuthenticated, checkAuth } = useAuth();
  const { logout } = useLogout();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleAuthMode = () => {
    setAuthMode(authMode === "signup" ? "login" : "signup");
  };

  useEffect(() => {
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [authMode, showAuthModal]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      
      if (authMode === "signup") {
        await authService.signup({ name, email, password, confirmPassword });
      } else {
        await authService.login({ email, password });
      }

      toast({
        title: authMode === "signup" ? "Account created" : "Signed in",
        description: "You're all set."
      });
      
      // Refresh auth state
      const userResult = await checkAuth();
      
      // If user is admin, redirect to admin panel
      if ((userResult as any)?.role === "admin" || (user as any)?.role === "admin") {
        navigate("/admin");
      }
      
      // Clear form fields
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setShowAuthModal(false);
    } catch (e: any) {
      toast({ title: "Error", description: e?.message ? String(e.message) : "Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

  const isAdmin = (user as any)?.role === "admin";
  const { data: notificationsData } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: () => getNotifications(1),
    enabled: isAdmin,
    refetchInterval: 30000,
  });
  const unreadCount = notificationsData?.unreadCount || 0;

  const handleGoogleSuccess = async (cred: any) => {

    const idToken = cred.credential;
    if (!idToken) {
      toast({ title: "Google login failed", description: "Missing token." });
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await fetch(`${API_BASE}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ idToken })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "google_login_failed");
      }
      toast({ title: "Signed in", description: "Welcome back!" });
      const userResult = await checkAuth();
      
      // If user is admin, redirect to admin panel
      if ((userResult as any)?.role === "admin" || (user as any)?.role === "admin") {
        navigate("/admin");
      }
      setShowAuthModal(false);
    } catch (e: any) {
      toast({
        title: "Google login failed",
        description: e?.message ? String(e.message) : "Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const menuSections = [
    {
      title: "Navigation",
      items: [
        { name: "How It Works", href: "/about#how-it-works", icon: PlayCircle },
        { name: "About", href: "/about", icon: Info },
        { name: "Blog", href: "/blog", icon: BookOpen },
        { name: "Our Mission", href: "/about#our-mission", icon: Target },
        { name: "SecurePay", href: "/secure-pay", icon: ShieldCheck },
        { name: "Watchlist", href: "/watchlist", icon: Star },
        ...((user as any)?.role === "admin" ? [{ name: "Admin Panel", href: "/admin", icon: LayoutGrid }] : []),
      ]
    },

    {
      title: "Support & Guides",
      items: [
        { name: "Shipping", onClick: openShippingModal, icon: Truck },
        { name: "Help Center", href: "/about#faq", icon: HelpCircle },
        { name: "Buying Guide", href: "/about#buying-a-car", icon: BookOpen },
        { name: "Contact Us", href: "/contact", icon: Mail },
      ]
    },
    {
      title: "Services",
      items: [
        { name: "Payment Options", href: "/payment-options", icon: CreditCard },
        { name: "Vehicle Arrival & Import Process in Europe", href: "/vehicle-arrival", icon: Truck },
        { name: "Vehicle Inspection", href: "/vehicle-inspection", icon: ClipboardCheck },
        { name: "Reserve a Vehicle", href: "/reserve-vehicle", icon: ShieldCheck },
        { name: "Find Your Vehicle", href: "/find-vehicle", icon: Search },
      ]
    },
    {
      title: "Legal",
      items: [
        { name: "Terms", href: "/about#terms", icon: FileText },
        { name: "Cookies", href: "/cookies", icon: Cookie },
      ]
    },
    {
      title: "Membership and Plans",
      items: [
        { name: "Subscriptions", href: "/membership", icon: UserPlus2Icon },
      ]
    }
  ];

  const renderMenuItem = (item: any) => {
    const content = (
      <div className="flex items-center gap-4 flex-1 min-w-0 mr-2">
        <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-[#2f884d] group-hover:border-[#2f884d]/20 transition-all shadow-sm shrink-0">
          <item.icon className="w-5 h-5" />
        </div>
        <span className="font-bold text-[#1b2533] text-[14px] sm:text-[15px] group-hover:text-[#2f884d] transition-colors leading-tight flex-1 break-words">
          {item.name}
        </span>
      </div>
    );

    if (item.onClick) {
      return (
          <button
            key={item.name}
            type="button"
            onClick={() => {
              item.onClick();
              setMenuOpen(false);
            }}
            className="group w-full flex items-center justify-between p-4 rounded-2xl hover:bg-[#f2f4f8] transition-all text-left cursor-pointer active:scale-[0.98]"
          >
            {content}
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#2f884d] group-hover:translate-x-1 transition-all" />
          </button>
      );
    }

    return (
      <Link
        key={item.name}
        to={item.href || "#"}
        className="group flex items-center justify-between p-4 rounded-2xl hover:bg-[#f2f4f8] transition-all"
        onClick={() => setMenuOpen(false)}
      >
        {content}
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#2f884d] group-hover:translate-x-1 transition-all" />
      </Link>
    );
  };

  return (
    <>
      <header className="bg-white sticky top-0 z-50 py-3 shadow-sm border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo Area */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link to="/" className="transition-transform hover:scale-105 duration-200">
                  <img
                    src="/logo.png"
                    alt="MADE-IN-US.COM"
                    className="h-auto w-[140px] sm:w-[180px] md:w-[200px] lg:w-[240px] xl:w-[280px] object-contain"
                  />
                </Link>
              </div>
            </div>

            {/* Right Side */}


            <div className="flex items-center gap-3 md:gap-5">
              {/* Desktop Switchers */}
              <div className="hidden xl:flex items-center gap-2">
                <LanguageSwitcher
                  variant="light"
                  direction="down"
                  activeLang={activeLang}
                  onSelect={handleLanguageSelect}
                />
                <CurrencySwitcher variant="light" direction="down" />
              </div>

              {isAuthenticated && user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden lg:flex flex-col items-end">
                    <p className="text-sm font-bold text-[#1b2533]">{user.name || user.email}</p>
                    <p className="text-xs text-gray-500">Signed in</p>
                  </div>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="relative flex items-center gap-2 bg-[#60E677]/10 hover:bg-[#60E677]/20 text-[#2F884D] px-3 sm:px-4 py-2 rounded-xl border border-[#60E677]/20 transition-all group shadow-sm active:scale-95"
                      title="Admin Panel"
                    >
                      <LayoutGrid className="w-5 h-5 sm:w-4 sm:h-4 group-hover:rotate-90 transition-transform duration-300" />
                      <span className="hidden lg:inline text-sm font-black tracking-tight">Admin Panel</span>
                      {unreadCount > 0 && (
                        <div className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white flex items-center justify-center min-w-[20px] shadow-sm">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </div>
                      )}
                    </Link>
                  )}

                  <button
                    onClick={() => logout()}
                    className="p-2 text-[#1b2533] hover:bg-red-50 rounded-[8px] transition-all"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5 text-red-500" />
                  </button>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    setAuthMode("signup");
                    setShowAuthModal(true);
                  }}
                  variant="default"
                  className="bg-[#2f884d] hover:bg-[#25733f] text-white rounded-[8px] border-none px-6 h-10 text-sm font-bold transition-all shadow-md active:scale-95"
                >
                  Sign Up
                </Button>
              )}

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1 px-2 text-[#1b2533] hover:bg-gray-100 rounded-[8px] transition-all active:bg-gray-200"
                aria-label="Toggle menu"
              >
                <Menu className="h-7 w-7" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal remains the same */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-y-auto max-h-[calc(100vh-8rem)] rounded-3xl border-none shadow-2xl bg-white/95 backdrop-blur-xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="p-8 sm:p-10 space-y-7">
            <DialogHeader className="space-y-3 text-center">
              <DialogTitle className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
                {authMode === "signup" ? "Create Account" : "Welcome Back"}
              </DialogTitle>
              <DialogDescription className="text-gray-500 text-[15px]">
                {authMode === "signup"
                  ? "Start your car enthusiast journey with us today."
                  : "Welcome back to MADE-IN-US.COM"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              {authMode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em] ml-1">Full Name</Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4.5 h-4.5 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-12 h-12 bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl font-medium"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em] ml-1">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4.5 h-4.5 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12 bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em] ml-1">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4.5 h-4.5 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 h-12 bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {authMode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em] ml-1">Confirm Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4.5 h-4.5 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-12 pr-12 h-12 bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4.5 h-4.5" />
                      ) : (
                        <Eye className="w-4.5 h-4.5" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full h-12 text-base font-bold rounded-2xl bg-[#60E677] hover:bg-[#52c967] text-[#003B21] shadow-xl shadow-green-100/50 transition-all active:scale-[0.98] mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {authMode === "signup" ? "Get Started" : "Continue"}
              </Button>

              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast({ title: "Google login failed", description: "Please try again." })}
                  theme="outline"
                  text="continue_with"
                  shape="pill"
                  logo_alignment="left"
                />
              </div>
            </div>

            <p className="text-center text-sm text-gray-500 font-semibold px-4 pt-4">
              {authMode === "signup" ? "Already a member?" : "New to the platform?"}{" "}
              <button
                onClick={toggleAuthMode}
                className="text-primary font-black hover:underline underline-offset-4 transition-all"
              >
                {authMode === "signup" ? "Log In" : "Register"}
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Premium Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-[#1b2533]/40 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setMenuOpen(false)}
          />

          {/* Slide-out Menu */}
          <div className="absolute inset-y-0 right-0 w-full sm:w-[380px] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out animate-in slide-in-from-right">
            {/* Menu Header — Language switcher lives here, outside scroll */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#f8f9fc]">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-[#2f884d]" />
                <span className="font-bold text-xl text-[#1b2533]">Menu</span>
              </div>
              <div className="flex items-center gap-3">
                {/* Switchers — inline, no overflow issues */}
                <div className="flex items-center gap-2">
                  <LanguageSwitcher
                    variant="light"
                    direction="down"
                    activeLang={activeLang}
                    onSelect={(lang) => { handleLanguageSelect(lang); setMenuOpen(false); }}
                  />
                  <CurrencySwitcher variant="light" direction="down" />
                </div>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="p-2 hover:bg-white rounded-full transition-all shadow-sm active:scale-90 cursor-pointer"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
              {menuSections.map((section) => (
                <div key={section.title} className="space-y-3">
                  <h3 className="px-4 text-[11px] font-extrabold text-[#64748b] uppercase tracking-[0.2em]">
                    {section.title}
                  </h3>
                  <div className="grid gap-1">
                    {section.items.map((item) => renderMenuItem(item))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer / Auth CTA */}
            <div className="p-6 border-t border-gray-100 bg-[#f8f9fc]">
              {isAuthenticated && user ? (
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 text-center">
                  <p className="font-bold text-[#1b2533]">Welcome, {user.name || user.email}!</p>
                  <p className="text-sm text-[#64748b]">You are currently signed in.</p>
                  <Button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="w-full h-12 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-base shadow-lg shadow-red-100"
                  >
                    Log Out
                  </Button>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <div className="space-y-1">
                    <p className="font-bold text-[#1b2533]">Ready to start?</p>
                    <p className="text-sm text-[#64748b]">Join our community of car enthusiasts.</p>
                  </div>
                  <Button
                    onClick={() => { setAuthMode("signup"); setShowAuthModal(true); setMenuOpen(false); }}
                    className="w-full h-12 bg-[#2f884d] hover:bg-[#25733f] text-white rounded-xl font-bold text-base shadow-lg shadow-green-100"
                  >
                    Create Account
                  </Button>
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={() => { setAuthMode("login"); setShowAuthModal(true); setMenuOpen(false); }}
                      className="text-sm font-bold text-[#2f884d] hover:underline"
                    >
                      Log in to your account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
