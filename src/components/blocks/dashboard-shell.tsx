"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";

const stats = [
  { label: "Applications Sent", value: "128", delta: "+12%", icon: Briefcase },
  { label: "Interviews", value: "24", delta: "+4", icon: CalendarDays },
  { label: "Offers", value: "3", delta: "+1", icon: CheckCircle2 },
  { label: "Rejected", value: "18", delta: "-2", icon: XCircle },
];

const activity = [
  { title: "Follow-up sent to Notion Labs", time: "15 min ago", tone: "positive" },
  { title: "Interview scheduled with Stripe", time: "1 hour ago", tone: "neutral" },
  { title: "Resume updated for Data Analyst roles", time: "3 hours ago", tone: "positive" },
];

export function DashboardShell() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_35%),linear-gradient(135deg,_#07111f_0%,_#0f172a_45%,_#111827_100%)] text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/8 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-sm text-violet-200">
              <Sparkles className="h-4 w-4" />
              Graduate Career OS
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Job Application CRM for ambitious graduates
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
              Keep every application, recruiter touchpoint, and interview in one elegant command center.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
            <Search className="h-5 w-5 text-slate-400" />
            <div>
              <div className="text-sm font-medium">Global search</div>
              <div className="text-xs text-slate-400">Companies, recruiters, resumes, tags</div>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.article
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/20"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                    <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-2.5 text-violet-300">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-4 text-sm text-emerald-400">{stat.delta} from last week</p>
              </motion.article>
            );
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Weekly momentum</p>
                <h2 className="text-xl font-semibold">Interview chance accelerator</h2>
              </div>
              <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">
                83% response rate
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Waiting Response", value: "41", icon: Clock3 },
                { label: "Average Response Rate", value: "83%", icon: TrendingUp },
                { label: "Current Streak", value: "8 days", icon: Target },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-sm text-slate-400">{item.label}</p>
                    <p className="mt-1 text-2xl font-semibold">{item.value}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-3xl border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Recent activities</p>
                <h2 className="text-xl font-semibold">Pulse feed</h2>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {activity.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">{item.title}</p>
                    <span className={`rounded-full px-2 py-1 text-xs ${item.tone === "positive" ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-700/70 text-slate-300"}`}>
                      {item.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
