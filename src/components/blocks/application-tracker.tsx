"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import {
  Briefcase,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Loader2,
  LogOut,
  Mail,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Status = "Wishlist" | "Applied" | "Interview" | "Offer" | "Rejected";
type Priority = "High" | "Medium" | "Low";

type Application = {
  id: number | string;
  company: string;
  role: string;
  status: Status;
  applied_date?: string;
  appliedDate?: string;
  next_step?: string;
  nextStep?: string;
  priority: Priority;
};

type FormState = {
  company: string;
  role: string;
  status: Status;
  nextStep: string;
  priority: Priority;
};

const statusOptions: Status[] = ["Wishlist", "Applied", "Interview", "Offer", "Rejected"];
const priorityOptions: Priority[] = ["Low", "Medium", "High"];

const statusTone: Record<Status, string> = {
  Wishlist: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
  Applied: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  Interview: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  Offer: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Rejected: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
};

const priorityTone: Record<Priority, string> = {
  High: "text-rose-600",
  Medium: "text-amber-600",
  Low: "text-slate-500",
};

const motivationalQuotes = [
  "You only need one clear next step right now.",
  "A calm system makes the search feel lighter.",
  "Small updates today still count as real progress.",
  "You are allowed to make this process gentler for yourself.",
  "One application handled well is enough for this moment.",
  "Keeping things organized is already helping future you.",
];

const defaultForm = (): FormState => ({
  company: "",
  role: "",
  status: "Applied",
  nextStep: "",
  priority: "Medium",
});

function normalizeApplication(app: Application): Application {
  return {
    ...app,
    appliedDate: app.appliedDate ?? app.applied_date ?? "",
    nextStep: app.nextStep ?? app.next_step ?? "",
    priority: app.priority ?? "Medium",
  };
}

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="block">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value as T)}
          className="w-full appearance-none rounded-2xl border border-pink-100 bg-gradient-to-br from-white to-rose-50/60 px-4 py-3 pr-11 text-sm text-slate-700 shadow-[0_10px_30px_-22px_rgba(244,114,182,0.28)] outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
}

function AuthScreen({
  mode,
  email,
  password,
  authLoading,
  authError,
  onModeChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: {
  mode: "sign-in" | "sign-up";
  email: string;
  password: string;
  authLoading: boolean;
  authError: string | null;
  onModeChange: (mode: "sign-in" | "sign-up") => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
}) {
  const isSignUp = mode === "sign-up";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(244,114,182,0.18),_transparent_34%),radial-gradient(circle_at_100%_0%,_rgba(251,191,36,0.12),_transparent_20%),linear-gradient(180deg,_#fffdfd_0%,_#fff6fa_42%,_#fef2f6_100%)] px-4 py-6 text-slate-700 sm:px-6 sm:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-5xl items-center gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[32px] border border-white/70 bg-white/82 p-6 shadow-[0_22px_50px_-34px_rgba(244,114,182,0.36)] sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-3 py-1 text-sm text-pink-600">
            <Sparkles className="h-4 w-4" />
            Personal job tracker
          </div>
          <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Keep your applications private, synced, and easy to manage on any device.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Sign in once and your tracker stays with your account, not with one browser. That means she can open it on her
            phone, tablet, or laptop and still see only her own applications.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { title: "Private", note: "Each account only sees its own entries." },
              { title: "Synced", note: "Changes follow the account across devices." },
              { title: "Simple", note: "One calm place for roles, status, and next steps." },
            ].map((item) => (
              <div key={item.title} className="rounded-[24px] border border-white/80 bg-white/92 p-4 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                <div className="mt-1 text-sm leading-6 text-slate-500">{item.note}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-white/70 bg-white/90 p-5 shadow-[0_22px_50px_-34px_rgba(244,114,182,0.36)] sm:p-6">
          <div className="flex gap-2 rounded-full bg-rose-50 p-1">
            {[
              { id: "sign-in" as const, label: "Sign in" },
              { id: "sign-up" as const, label: "Create account" },
            ].map((item) => {
              const active = mode === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onModeChange(item.id)}
                  className={`flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition ${
                    active ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="mt-5 space-y-3">
            <label className="block">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Email
              </span>
              <div className="flex items-center gap-2 rounded-2xl border border-white/70 bg-white/95 px-4 py-3 shadow-sm">
                <Mail className="h-4 w-4 text-pink-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => onEmailChange(event.target.value)}
                  placeholder="name@example.com"
                  className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Password
              </span>
              <div className="flex items-center gap-2 rounded-2xl border border-white/70 bg-white/95 px-4 py-3 shadow-sm">
                <UserRound className="h-4 w-4 text-pink-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => onPasswordChange(event.target.value)}
                  placeholder="At least 6 characters"
                  className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
            </label>

            {authError ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">{authError}</div>
            ) : null}

            <button
              type="button"
              onClick={onSubmit}
              disabled={authLoading || !email.trim() || password.length < 6}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#f43f8e_0%,#fb7185_55%,#f97316_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_42px_-22px_rgba(244,63,94,0.7)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-20px_rgba(244,63,94,0.78)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {authLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserRound className="h-4 w-4" />}
              {isSignUp ? "Create private tracker" : "Open my tracker"}
            </button>

            <p className="text-sm leading-6 text-slate-500">
              {isSignUp
                ? "If email confirmation is enabled in Supabase, confirm the email first and then sign in."
                : "Use the same email on another device and the same tracker will be there for that account."}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export function ApplicationTracker() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authMode, setAuthMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [applications, setApplications] = useState<Application[]>([]);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [editId, setEditId] = useState<number | string | null>(null);
  const [editForm, setEditForm] = useState<FormState>(defaultForm);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [draftSearch, setDraftSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [quote, setQuote] = useState<string | null>(null);

  const quoteTimeoutRef = useRef<number | null>(null);
  const feedbackTimeoutRef = useRef<number | null>(null);
  const deferredSearch = useDeferredValue(draftSearch.trim().toLowerCase());

  const setTransientFeedback = (message: string) => {
    setFeedback(message);

    if (feedbackTimeoutRef.current) {
      window.clearTimeout(feedbackTimeoutRef.current);
    }

    feedbackTimeoutRef.current = window.setTimeout(() => setFeedback(null), 3200);
  };

  const showMotivationQuote = (customQuote?: string) => {
    const nextQuote = customQuote ?? motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setQuote(nextQuote);

    if (quoteTimeoutRef.current) {
      window.clearTimeout(quoteTimeoutRef.current);
    }

    quoteTimeoutRef.current = window.setTimeout(() => setQuote(null), 3200);
  };

  const getAuthHeaders = () => {
    if (!session?.access_token) return null;

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    };
  };

  const loadApplications = async (activeSession: Session) => {
    const headers = {
      Authorization: `Bearer ${activeSession.access_token}`,
    };

    const response = await fetch("/api/applications", {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(body?.error || "Unable to load applications");
    }

    const data = (await response.json()) as Application[];
    setApplications(Array.isArray(data) ? data.map(normalizeApplication) : []);
  };

  useEffect(() => {
    let mounted = true;

    const boot = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        setAuthError(error.message);
      }

      setSession(data.session ?? null);
      setAuthReady(true);
    };

    void boot();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setApplications([]);
      setEditId(null);
      setLoading(true);
      setAuthError(null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();

      if (quoteTimeoutRef.current) {
        window.clearTimeout(quoteTimeoutRef.current);
      }

      if (feedbackTimeoutRef.current) {
        window.clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!session) {
      return;
    }

    const initialQuoteHandle = window.setTimeout(() => {
      showMotivationQuote();
    }, 250);

    const run = async () => {
      setLoading(true);

      try {
        await loadApplications(session);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load applications";
        setTransientFeedback(message);
      } finally {
        setLoading(false);
      }
    };

    void run();

    return () => {
      window.clearTimeout(initialQuoteHandle);
    };
  }, [session]);

  const counts = useMemo(() => {
    return applications.reduce(
      (acc, app) => {
        acc.total += 1;
        if (app.status === "Interview") acc.interviews += 1;
        if (app.status === "Offer") acc.offers += 1;
        if (app.status === "Applied") acc.applied += 1;
        if (app.status === "Wishlist") acc.wishlist += 1;
        return acc;
      },
      { total: 0, interviews: 0, offers: 0, applied: 0, wishlist: 0 },
    );
  }, [applications]);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesStatus = statusFilter === "All" || app.status === statusFilter;

      const haystack = [
        app.company,
        app.role,
        app.status,
        app.nextStep ?? "",
        app.priority,
        app.appliedDate ?? "",
        app.applied_date ?? "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !deferredSearch || haystack.includes(deferredSearch);
      return matchesStatus && matchesSearch;
    });
  }, [applications, deferredSearch, statusFilter]);

  const handleAuthSubmit = async () => {
    if (!authEmail.trim() || authPassword.length < 6 || authLoading) return;

    setAuthLoading(true);
    setAuthError(null);

    try {
      if (authMode === "sign-up") {
        const { error } = await supabase.auth.signUp({
          email: authEmail.trim(),
          password: authPassword,
        });

        if (error) throw error;

        setTransientFeedback("Account created. If confirmation is required, check email before signing in.");
        showMotivationQuote("Your tracker now has a private home.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: authEmail.trim(),
          password: authPassword,
        });

        if (error) throw error;

        setTransientFeedback("Welcome back. Your tracker is ready.");
      }
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Unable to continue");
    } finally {
      setAuthLoading(false);
    }
  };

  const submitNewApplication = async () => {
    if (!form.company.trim() || !form.role.trim() || isSaving) return;

    const headers = getAuthHeaders();
    if (!headers) {
      setTransientFeedback("Please sign in again.");
      return;
    }

    const payload = {
      company: form.company.trim(),
      role: form.role.trim(),
      status: form.status,
      nextStep: form.nextStep.trim() || "Follow up thoughtfully",
      priority: form.priority,
      appliedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };

    setIsSaving(true);
    setTransientFeedback("Saving your application...");

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || "Unable to save application");
      }

      const saved = normalizeApplication((await response.json()) as Application);
      setApplications((prev) => [saved, ...prev]);
      setForm(defaultForm());
      setTransientFeedback("Application saved successfully.");
      showMotivationQuote("That is one more step handled.");
    } catch (error) {
      setTransientFeedback(error instanceof Error ? error.message : "Unable to save application");
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (app: Application) => {
    setEditId(app.id);
    setEditForm({
      company: app.company,
      role: app.role,
      status: app.status,
      nextStep: app.nextStep ?? "",
      priority: app.priority,
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm(defaultForm());
  };

  const saveEdit = async () => {
    if (!editId) return;

    const headers = getAuthHeaders();
    if (!headers) {
      setTransientFeedback("Please sign in again.");
      return;
    }

    const payload = {
      company: editForm.company.trim(),
      role: editForm.role.trim(),
      status: editForm.status,
      nextStep: editForm.nextStep.trim() || "Follow up thoughtfully",
      priority: editForm.priority,
    };

    try {
      const response = await fetch(`/api/applications/${editId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || "Unable to update application");
      }

      const saved = normalizeApplication((await response.json()) as Application);
      setApplications((prev) => prev.map((item) => (item.id === editId ? saved : item)));
      setEditId(null);
      setTransientFeedback("Application updated.");
      showMotivationQuote("Keeping things updated is caring for your future self.");
    } catch (error) {
      setTransientFeedback(error instanceof Error ? error.message : "Unable to update application");
    }
  };

  const deleteApplication = async (id: number | string) => {
    const headers = getAuthHeaders();
    if (!headers) {
      setTransientFeedback("Please sign in again.");
      return;
    }

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || "Unable to delete application");
      }

      setApplications((prev) => prev.filter((item) => item.id !== id));
      setTransientFeedback("Application removed.");
      showMotivationQuote("Clearing something out can make the rest feel lighter.");
    } catch (error) {
      setTransientFeedback(error instanceof Error ? error.message : "Unable to delete application");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setTransientFeedback("Signed out.");
  };

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,_#fffdfd_0%,_#fff6fa_42%,_#fef2f6_100%)] px-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin text-pink-500" />
          Preparing your tracker...
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <AuthScreen
        mode={authMode}
        email={authEmail}
        password={authPassword}
        authLoading={authLoading}
        authError={authError}
        onModeChange={setAuthMode}
        onEmailChange={setAuthEmail}
        onPasswordChange={setAuthPassword}
        onSubmit={handleAuthSubmit}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(244,114,182,0.18),_transparent_34%),radial-gradient(circle_at_100%_0%,_rgba(251,191,36,0.12),_transparent_20%),linear-gradient(180deg,_#fffdfd_0%,_#fff6fa_42%,_#fef2f6_100%)] px-3 py-4 text-slate-700 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:gap-6">
        {quote ? (
          <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-3xl border border-white/80 bg-white/96 px-4 py-3 shadow-[0_18px_40px_-28px_rgba(244,114,182,0.4)]">
            <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-pink-500">A small reminder</div>
            <div className="mt-1 text-sm font-medium text-slate-700">{quote}</div>
          </div>
        ) : null}

        <header className="rounded-[32px] border border-white/70 bg-white/80 p-5 shadow-[0_22px_50px_-34px_rgba(244,114,182,0.36)] sm:p-6">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-3 py-1 text-sm text-pink-600">
                  <Sparkles className="h-4 w-4" />
                  Job tracker
                </div>
                <h1 className="max-w-3xl text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                  Track applications, interviews, and next steps in one calm place
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  Private to {session.user.email} and available anywhere this account signs in.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center justify-center gap-2 self-start rounded-full border border-pink-200 bg-white/90 px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:border-pink-300 hover:text-slate-900"
              >
                <LogOut className="h-4 w-4 text-pink-500" />
                Sign out
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Total", value: counts.total, note: "saved" },
                { label: "Applied", value: counts.applied, note: "in progress" },
                { label: "Interviews", value: counts.interviews, note: "scheduled" },
                { label: "Offers", value: counts.offers, note: "received" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[26px] border border-white/80 bg-white/90 px-4 py-4 shadow-[0_14px_30px_-24px_rgba(15,23,42,0.18)]"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{item.label}</div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{item.value}</div>
                  <div className="mt-1 text-xs text-slate-500 sm:text-sm">{item.note}</div>
                </div>
              ))}
            </div>
          </div>
        </header>

        {feedback ? (
          <div className="rounded-2xl border border-pink-200/80 bg-white/90 px-4 py-3 text-sm text-slate-600 shadow-sm">
            {feedback}
          </div>
        ) : null}

        <section className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div className="xl:sticky xl:top-6 xl:self-start">
            <div className="rounded-[30px] border border-white/80 bg-white/88 p-4 shadow-[0_18px_36px_-28px_rgba(236,72,153,0.24)] sm:p-5">
              <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <Plus className="h-5 w-5 text-pink-500" />
                Add application
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Save a company, role, status, priority, and next step.
              </p>

              <div className="mt-4 space-y-3">
                <label className="block">
                  <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Company
                  </span>
                  <input
                    value={form.company}
                    onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
                    placeholder="Notion"
                    className="w-full rounded-2xl border border-white/70 bg-white/95 px-4 py-3 text-sm text-slate-700 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.55)] outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Role
                  </span>
                  <input
                    value={form.role}
                    onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
                    placeholder="Graduate Product Analyst"
                    className="w-full rounded-2xl border border-white/70 bg-white/95 px-4 py-3 text-sm text-slate-700 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.55)] outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
                  />
                </label>

                <div className="space-y-3">
                  <SelectField
                    label="Status"
                    value={form.status}
                    options={statusOptions}
                    onChange={(value) => setForm((prev) => ({ ...prev, status: value }))}
                  />
                  <SelectField
                    label="Priority"
                    value={form.priority}
                    options={priorityOptions}
                    onChange={(value) => setForm((prev) => ({ ...prev, priority: value }))}
                  />
                </div>

                <label className="block">
                  <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Next step
                  </span>
                  <input
                    value={form.nextStep}
                    onChange={(event) => setForm((prev) => ({ ...prev, nextStep: event.target.value }))}
                    placeholder="Send a follow-up on Thursday"
                    className="w-full rounded-2xl border border-white/70 bg-white/95 px-4 py-3 text-sm text-slate-700 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.55)] outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
                  />
                </label>

                <button
                  type="button"
                  onClick={submitNewApplication}
                  disabled={isSaving || !form.company.trim() || !form.role.trim()}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#f43f8e_0%,#fb7185_55%,#f97316_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_42px_-22px_rgba(244,63,94,0.7)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-20px_rgba(244,63,94,0.78)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Save application
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/80 bg-white/88 p-4 shadow-[0_18px_36px_-28px_rgba(236,72,153,0.24)] sm:p-5">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="text-lg font-semibold text-slate-900">Applications</div>
                  <p className="text-sm text-slate-500">
                    Search, filter, edit, and update everything from here.
                  </p>
                </div>

                <label className="flex w-full min-w-0 items-center gap-2 rounded-2xl border border-white/70 bg-white/95 px-3 py-3 text-sm text-slate-600 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.55)] lg:max-w-sm">
                  <Search className="h-4 w-4 text-pink-500" />
                  <input
                    value={draftSearch}
                    onChange={(event) => setDraftSearch(event.target.value)}
                    placeholder="Search company, role, status, priority, or next step"
                    className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-400"
                  />
                  {draftSearch ? (
                    <button
                      type="button"
                      onClick={() => setDraftSearch("")}
                      className="rounded-full p-1 text-slate-400 transition hover:bg-pink-50 hover:text-pink-500"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : null}
                </label>
              </div>

              <div className="flex flex-wrap gap-2 pb-1">
                {(["All", ...statusOptions] as const).map((status) => {
                  const active = statusFilter === status;
                  const count =
                    status === "All"
                      ? applications.length
                      : applications.filter((app) => app.status === status).length;

                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setStatusFilter(status)}
                      className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                        active
                          ? "bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-[0_14px_30px_-18px_rgba(244,114,182,0.5)]"
                          : "border border-slate-200/80 bg-white/90 text-slate-600 hover:border-pink-200 hover:text-slate-900"
                      }`}
                    >
                      {status} {count}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {loading ? (
                <div className="rounded-3xl border border-pink-200/70 bg-pink-50/70 p-5 text-sm text-slate-600 shadow-sm">
                  Loading your applications...
                </div>
              ) : filteredApplications.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-pink-200 bg-gradient-to-br from-pink-50/70 to-rose-50/70 p-8 text-center text-sm text-slate-600 shadow-sm">
                  {applications.length === 0
                    ? "No applications yet. Add your first one to start building momentum."
                    : "No matches for that filter yet. Try another status or a simpler search."}
                </div>
              ) : (
                filteredApplications.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-[26px] border border-white/80 bg-white/94 p-4 shadow-[0_14px_28px_-24px_rgba(15,23,42,0.16)] sm:p-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="rounded-2xl bg-pink-50 p-2 text-pink-500">
                            <Briefcase className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-base font-semibold text-slate-900">{app.company}</div>
                            <div className="truncate text-sm text-slate-500">{app.role}</div>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-600">
                            <div className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                              <CalendarDays className="h-3.5 w-3.5" />
                              Applied
                            </div>
                            <div className="font-medium text-slate-700">{app.appliedDate || "Today"}</div>
                          </div>
                          <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-600">
                            <div className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                              <Clock3 className="h-3.5 w-3.5" />
                              Next
                            </div>
                            <div className="line-clamp-2 font-medium text-slate-700">
                              {app.nextStep || "No next step yet"}
                            </div>
                          </div>
                          <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-600">
                            <div className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Priority
                            </div>
                            <div className={`font-semibold ${priorityTone[app.priority]}`}>{app.priority}</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid w-full grid-cols-1 gap-2 self-start sm:w-auto sm:grid-cols-[auto_auto_auto] sm:items-center">
                        <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${statusTone[app.status]}`}>
                          {app.status}
                        </span>
                        <button
                          type="button"
                          onClick={() => startEdit(app)}
                          className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm transition hover:border-pink-200 hover:text-pink-600 sm:w-auto"
                          aria-label="Edit application"
                        >
                          <Pencil className="h-4 w-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteApplication(app.id)}
                          className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm transition hover:border-rose-200 hover:text-rose-500 sm:w-auto"
                          aria-label="Delete application"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    {editId === app.id ? (
                      <div className="mt-4">
                        <div className="overflow-hidden rounded-[24px] border border-pink-200/70 bg-gradient-to-br from-pink-50/85 to-rose-50/75 p-3 shadow-sm sm:p-4">
                          <div className="grid gap-3">
                            <input
                              value={editForm.company}
                              onChange={(event) => setEditForm((prev) => ({ ...prev, company: event.target.value }))}
                              className="rounded-2xl border border-white/80 bg-white/95 px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-pink-400"
                              placeholder="Company"
                            />
                            <input
                              value={editForm.role}
                              onChange={(event) => setEditForm((prev) => ({ ...prev, role: event.target.value }))}
                              className="rounded-2xl border border-white/80 bg-white/95 px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-pink-400"
                              placeholder="Role"
                            />
                          </div>

                          <div className="mt-3 space-y-3">
                            <SelectField
                              label="Status"
                              value={editForm.status}
                              options={statusOptions}
                              onChange={(value) => setEditForm((prev) => ({ ...prev, status: value }))}
                            />
                            <SelectField
                              label="Priority"
                              value={editForm.priority}
                              options={priorityOptions}
                              onChange={(value) => setEditForm((prev) => ({ ...prev, priority: value }))}
                            />
                          </div>

                          <input
                            value={editForm.nextStep}
                            onChange={(event) => setEditForm((prev) => ({ ...prev, nextStep: event.target.value }))}
                            className="mt-3 w-full rounded-2xl border border-white/80 bg-white/95 px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-pink-400"
                            placeholder="Next step"
                          />

                          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="rounded-full border border-white/80 bg-white/90 px-4 py-2.5 text-sm text-slate-600 shadow-sm transition hover:border-pink-200"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={saveEdit}
                              className="rounded-full bg-[linear-gradient(135deg,#f43f8e_0%,#fb7185_55%,#f97316_100%)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_36px_-22px_rgba(244,63,94,0.72)]"
                            >
                              Save changes
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
