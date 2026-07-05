"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  HeartHandshake,
  Search,
  Sparkles,
} from "lucide-react";

const pillars = [
  {
    title: "Clear overview",
    description:
      "See where each application stands, what needs attention next, and what is already moving forward.",
  },
  {
    title: "Fast to use",
    description:
      "Adding, searching, and updating should feel quick so the tracker stays useful every day.",
  },
  {
    title: "Works on every screen",
    description:
      "The layout adapts cleanly across phone, tablet, and laptop screens without losing clarity.",
  },
];

const highlights = [
  {
    icon: Search,
    title: "Fast search",
    description: "Find companies, roles, and next steps quickly without extra steps.",
  },
  {
    icon: CheckCircle2,
    title: "Clear progress",
    description: "Statuses and priorities stay visible so updates are easier to manage.",
  },
  {
    icon: HeartHandshake,
    title: "Simple workflow",
    description: "Everything important stays in one place so the job search is easier to manage.",
  },
];

export function LandingHero() {
  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(244,114,182,0.26),_transparent_30%),radial-gradient(circle_at_88%_12%,_rgba(251,191,36,0.16),_transparent_22%),linear-gradient(180deg,_#fffdfd_0%,_#fff7fb_35%,_#fef2f6_100%)] text-slate-700">
      <main className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <motion.nav
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-3 rounded-full border border-white/80 bg-white/78 px-4 py-3 shadow-[0_18px_45px_-28px_rgba(244,114,182,0.55)] backdrop-blur-xl"
        >
          <div className="flex items-center gap-2 text-lg font-semibold text-pink-600">
            <Sparkles className="h-5 w-5 text-pink-500" />
            GradCRM
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <a href="#features" className="transition hover:text-pink-600">
              Features
            </a>
            <a href="#how-it-works" className="transition hover:text-pink-600">
              How it works
            </a>
            <Link
              href="/dashboard"
              className="rounded-full bg-slate-950 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-slate-800"
            >
              Launch tracker
            </Link>
          </div>
        </motion.nav>

        <section className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-3 py-1 text-sm text-pink-600">
              <BadgeCheck className="h-4 w-4" />
              Built for managing a real job search
            </div>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              A job tracker that keeps everything clear and easy to update.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Keep applications, follow-ups, interviews, and next steps in one place with a layout that works cleanly across phone, tablet, and laptop screens.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#f43f8e_0%,#fb7185_55%,#f97316_100%)] px-6 py-3 font-medium text-white shadow-[0_18px_42px_-22px_rgba(244,63,94,0.7)] transition hover:-translate-y-0.5"
              >
                Open tracker <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-white/80 bg-white/78 px-6 py-3 font-medium text-slate-700 transition hover:bg-white"
              >
                Explore the product
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {highlights.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 * index }}
                    className="rounded-[24px] border border-white/80 bg-white/78 px-4 py-4 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.4)] backdrop-blur"
                  >
                    <Icon className="mb-3 h-5 w-5 text-pink-500" />
                    <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                    <div className="mt-1 text-sm leading-6 text-slate-600">{item.description}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.45 }}
            className="rounded-[34px] border border-white/80 bg-white/78 p-5 shadow-[0_30px_80px_-34px_rgba(244,114,182,0.55)] backdrop-blur-xl sm:p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-500">Overview</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Built for real use</h2>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                Mobile friendly
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              {[
                { icon: BarChart3, title: "Applications this month", value: "48" },
                { icon: CalendarClock, title: "Upcoming interviews", value: "6" },
                { icon: Search, title: "Roles found in seconds", value: "Instant" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex items-center justify-between rounded-[24px] border border-white/10 bg-slate-950 px-4 py-4 text-white"
                  >
                    <div>
                      <p className="text-sm text-slate-400">{item.title}</p>
                      <p className="mt-1 text-xl font-semibold">{item.value}</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-3 text-pink-300">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 rounded-[24px] border border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50 px-4 py-4">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-white p-2 text-pink-500 shadow-sm">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Focused on usability</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    The goal is to make tracking applications quicker and easier, not add extra work.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="features" className="grid gap-4 md:grid-cols-3">
          {pillars.map((pillar, index) => (
            <motion.article
              key={pillar.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * index }}
              className="rounded-[28px] border border-white/80 bg-white/80 p-6 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.35)]"
            >
              <h3 className="text-xl font-semibold text-slate-900">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{pillar.description}</p>
            </motion.article>
          ))}
        </section>

        <motion.section
          id="how-it-works"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[30px] border border-white/80 bg-white/84 p-6 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.35)]"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-pink-500">How it works</p>
          <h2 className="mt-2 max-w-3xl text-2xl font-semibold text-slate-900">
            Add the role, update the status, and keep the next step visible.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            GradCRM is built for quick capture, simple editing, and a responsive layout that stays clear on smaller and larger screens.
          </p>
        </motion.section>
      </main>
    </div>
  );
}
