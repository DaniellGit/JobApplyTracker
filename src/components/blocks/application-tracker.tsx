"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
  Clock3,
  Trash2,
  Pencil,
} from "lucide-react";

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

const STORAGE_KEY = "gradcrm-applications-v1";

const statusColors: Record<Status, string> = {
  Wishlist: "bg-slate-700/70 text-slate-200",
  Applied: "bg-blue-500/15 text-blue-200",
  Interview: "bg-violet-500/15 text-violet-200",
  Offer: "bg-emerald-500/15 text-emerald-200",
  Rejected: "bg-rose-500/15 text-rose-200",
};

const getStoredApplications = (): Application[] => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Application[]) : [];
  } catch {
    return [];
  }
};

const saveStoredApplications = (items: Application[]) => {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export function ApplicationTracker() {
  const [query, setQuery] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [form, setForm] = useState({ company: "", role: "", status: "Applied" as Status });
  const [loading, setLoading] = useState(true);
  const [storageMode, setStorageMode] = useState<"cloud" | "local">("cloud");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | string | null>(null);
  const [editForm, setEditForm] = useState({
    company: "",
    role: "",
    status: "Applied" as Status,
    nextStep: "",
    priority: "Medium" as Priority,
  });

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const response = await fetch("/api/applications");
        if (!response.ok) throw new Error("Unable to load applications");

        const data = await response.json();
        const nextApps = Array.isArray(data) ? data : [];
        setApplications(nextApps);
        setStorageMode("cloud");
        saveStoredApplications(nextApps);
      } catch {
        const storedApps = getStoredApplications();
        setApplications(storedApps);
        setStorageMode("local");
        setFeedback("Using local browser storage for now. Your entries stay on this device.");
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const haystack = `${app.company} ${app.role} ${app.status}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    });
  }, [applications, query]);

  const addApplication = async () => {
    if (!form.company || !form.role) return;

    const payload = {
      company: form.company,
      role: form.role,
      status: form.status,
      appliedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      nextStep: "Keep going",
      priority: "Medium",
    };

    const optimisticApp: Application = {
      id: `${Date.now()}`,
      company: form.company,
      role: form.role,
      status: form.status,
      appliedDate: payload.appliedDate,
      nextStep: payload.nextStep,
      priority: "Medium",
    };

    setApplications((prev) => {
      const next = [optimisticApp, ...prev];
      saveStoredApplications(next);
      return next;
    });
    setForm({ company: "", role: "", status: "Applied" });
    setFeedback("Saving your application...");

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Unable to save");

      const saved = await response.json();
      const finalizedApp = {
        ...optimisticApp,
        ...saved,
        appliedDate: saved.applied_date || payload.appliedDate,
        nextStep: saved.next_step || payload.nextStep,
      };

      setApplications((prev) => {
        const next = prev.map((item) => (item.id === optimisticApp.id ? finalizedApp : item));
        saveStoredApplications(next);
        return next;
      });
      setStorageMode("cloud");
      setFeedback("Application saved successfully.");
    } catch {
      setStorageMode("local");
      setFeedback("Saved locally in this browser. Connect Supabase later for sync.");
    }
  };

  const startEdit = (app: Application) => {
    setEditId(app.id);
    setEditForm({
      company: app.company,
      role: app.role,
      status: app.status,
      nextStep: app.nextStep || app.next_step || "",
      priority: app.priority,
    });
  };

  const saveEdit = async () => {
    if (!editId) return;

    const payload = {
      company: editForm.company,
      role: editForm.role,
      status: editForm.status,
      nextStep: editForm.nextStep,
      priority: editForm.priority,
    };

    const updatedApp = {
      id: editId,
      ...payload,
      appliedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };

    setApplications((prev) => {
      const next = prev.map((item) => (item.id === editId ? { ...item, ...updatedApp } : item));
      saveStoredApplications(next);
      return next;
    });
    setEditId(null);
    setFeedback("Application updated.");

    try {
      const response = await fetch(`/api/applications/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Unable to update");
      setStorageMode("cloud");
    } catch {
      setStorageMode("local");
      setFeedback("Updated locally in this browser. Connect Supabase later for sync.");
    }
  };

  const deleteApplication = async (id: number | string) => {
    const previous = applications;
    setApplications((prev) => {
      const next = prev.filter((item) => item.id !== id);
      saveStoredApplications(next);
      return next;
    });

    try {
      const response = await fetch(`/api/applications/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Unable to delete");
      setFeedback("Application removed.");
    } catch {
      setApplications(previous);
      setStorageMode("local");
      setFeedback("Local-only update kept for this browser. The item is still available.");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(244,114,182,0.16),_transparent_32%),linear-gradient(135deg,_#fff7fb_0%,_#ffe4f0_38%,_#fffafc_100%)] p-3 text-slate-700 sm:p-6 lg:p-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:gap-6">
        <header className="rounded-[28px] border border-pink-100 bg-white/85 p-4 shadow-lg shadow-pink-100/70 backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-3 py-1 text-sm text-pink-600">
                <Sparkles className="h-4 w-4" />
                Soft job tracker
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-800 sm:text-3xl lg:text-4xl">
                Keep every application calm and organized
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                A beautiful, lightweight space to track applications, follow-ups, and interviews without feeling overwhelmed.
              </p>
            </div>
            <div className="rounded-2xl border border-pink-100 bg-pink-50/70 px-4 py-3 text-sm text-slate-600">
              <div className="flex items-center gap-2 font-medium text-slate-800">
                <TrendingUp className="h-4 w-4 text-pink-500" />
                {applications.length} active opportunities
              </div>
              <div className="mt-1">{storageMode === "cloud" ? "Cloud sync ready." : "Local browser mode active."}</div>
            </div>
          </div>
        </header>

        {feedback ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-700">
            {feedback}
          </div>
        ) : null}

        <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[24px] border border-pink-100 bg-white/85 p-4 shadow-md shadow-pink-100/70 sm:p-5">
            <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
              <Plus className="h-5 w-5 text-pink-500" />
              Quick add
            </div>
            <div className="mt-4 space-y-3">
              <input
                value={form.company}
                onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
                placeholder="Company name"
                className="w-full rounded-2xl border border-pink-100 bg-pink-50/70 px-4 py-3 text-sm text-slate-700 outline-none ring-0"
              />
              <input
                value={form.role}
                onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                placeholder="Job title"
                className="w-full rounded-2xl border border-pink-100 bg-pink-50/70 px-4 py-3 text-sm text-slate-700 outline-none ring-0"
              />
              <select
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as Status }))}
                className="w-full rounded-2xl border border-pink-100 bg-pink-50/70 px-4 py-3 text-sm text-slate-700 outline-none"
              >
                <option value="Wishlist">Wishlist</option>
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
              <button onClick={addApplication} className="w-full rounded-2xl bg-pink-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-pink-400">
                Save application
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-[24px] border border-pink-100 bg-white/85 p-4 shadow-md shadow-pink-100/70 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-lg font-semibold text-slate-800">Applications</div>
                <p className="text-sm text-slate-500">A calm view of what matters next.</p>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-pink-100 bg-pink-50/70 px-3 py-2 text-sm text-slate-600">
                <Search className="h-4 w-4" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  className="bg-transparent outline-none"
                />
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {loading ? (
                <div className="rounded-2xl border border-pink-100 bg-pink-50/60 p-4 text-sm text-slate-600">
                  Loading your applications...
                </div>
              ) : filteredApplications.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-pink-200 bg-pink-50/50 p-6 text-center text-sm text-slate-600">
                  No applications yet. Add your first one to get started.
                </div>
              ) : (
                filteredApplications.map((app) => (
                  <div key={app.id} className="rounded-2xl border border-pink-100 bg-white/85 p-4 shadow-sm shadow-pink-100/60">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-pink-500" />
                          <span className="font-semibold text-slate-800">{app.company}</span>
                        </div>
                        <div className="mt-1 text-sm text-slate-600">{app.role}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusColors[app.status]}`}>
                          {app.status}
                        </span>
                        <button
                          onClick={() => startEdit(app)}
                          className="rounded-full border border-pink-100 p-2 text-slate-500 transition hover:text-pink-500"
                          aria-label="Edit application"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteApplication(app.id)}
                          className="rounded-full border border-pink-100 p-2 text-slate-500 transition hover:text-rose-400"
                          aria-label="Delete application"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" /> {app.appliedDate || app.applied_date}</span>
                      <span className="inline-flex items-center gap-1"><Clock3 className="h-4 w-4" /> {app.nextStep || app.next_step}</span>
                      <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> {app.priority} priority</span>
                    </div>

                    {editId === app.id ? (
                      <div className="mt-4 rounded-2xl border border-pink-100 bg-pink-50/70 p-3">
                        <div className="grid gap-2 sm:grid-cols-2">
                          <input
                            value={editForm.company}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, company: e.target.value }))}
                            className="rounded-xl border border-pink-100 bg-white px-3 py-2 text-sm text-slate-700"
                            placeholder="Company"
                          />
                          <input
                            value={editForm.role}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, role: e.target.value }))}
                            className="rounded-xl border border-pink-100 bg-white px-3 py-2 text-sm text-slate-700"
                            placeholder="Role"
                          />
                          <select
                            value={editForm.status}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value as Status }))}
                            className="rounded-xl border border-pink-100 bg-white px-3 py-2 text-sm text-slate-700"
                          >
                            <option value="Wishlist">Wishlist</option>
                            <option value="Applied">Applied</option>
                            <option value="Interview">Interview</option>
                            <option value="Offer">Offer</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                          <select
                            value={editForm.priority}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, priority: e.target.value as Priority }))}
                            className="rounded-xl border border-pink-100 bg-white px-3 py-2 text-sm text-slate-700"
                          >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                          </select>
                        </div>
                        <input
                          value={editForm.nextStep}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, nextStep: e.target.value }))}
                          className="mt-2 w-full rounded-xl border border-pink-100 bg-white px-3 py-2 text-sm text-slate-700"
                          placeholder="Next step"
                        />
                        <div className="mt-3 flex justify-end gap-2">
                          <button onClick={() => setEditId(null)} className="rounded-full border border-pink-100 px-3 py-2 text-sm text-slate-600">Cancel</button>
                          <button onClick={saveEdit} className="rounded-full bg-pink-500 px-3 py-2 text-sm font-medium text-white">Save changes</button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
