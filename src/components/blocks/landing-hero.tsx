"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, BarChart3, CalendarClock, Sparkles } from "lucide-react";

const pillars = [
  { title: "Mission", description: "Help graduates stay calm, organized, and intentional while navigating a stressful job search." },
  { title: "Vision", description: "Create a simple CRM that turns scattered applications into a clear, confidence-building system." },
  { title: "How it works", description: "Save each application, update its stage, and keep your next step visible without the chaos." },
];

export function LandingHero() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(244,114,182,0.26),_transparent_32%),linear-gradient(135deg,_#fff7fb_0%,_#ffe4f0_45%,_#fdf2f8_100%)] text-slate-700">
      <main className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-20">
        <nav className="flex flex-wrap items-center justify-between gap-3 rounded-full border border-pink-200/80 bg-white/80 px-4 py-3 shadow-sm shadow-pink-100 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-lg font-semibold text-pink-600">
            <Sparkles className="h-5 w-5 text-pink-500" />
            GradCRM
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <a href="#mission" className="transition hover:text-pink-600">Mission</a>
            <a href="#how-it-works" className="transition hover:text-pink-600">How it works</a>
            <Link href="/dashboard" className="rounded-full bg-pink-500 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-pink-400">Launch tracker</Link>
          </div>
        </nav>

        <section className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-3 py-1 text-sm text-pink-600">
              <BadgeCheck className="h-4 w-4" />
              Built for fresh graduates managing a real job search
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-800 sm:text-5xl lg:text-6xl">
              Make your job search feel clear, focused, and under control.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              GradCRM is a calm, beautiful tracker for saving applications, updating progress, and keeping your next step visible without the stress of scattered notes.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-full bg-pink-500 px-6 py-3 font-medium text-white shadow-sm transition hover:bg-pink-400">
                Open tracker <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#mission" className="inline-flex items-center justify-center rounded-full border border-pink-200 bg-white/70 px-6 py-3 font-medium text-slate-700 transition hover:bg-white">
                See the vision
              </a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.45 }} className="rounded-3xl border border-pink-100 bg-white/80 p-6 shadow-xl shadow-pink-100/70 backdrop-blur-xl">
            <div className="grid gap-4">
              {[
                { icon: BarChart3, title: "Applications per month", value: "48" },
                { icon: CalendarClock, title: "Upcoming interviews", value: "6" },
                { icon: Sparkles, title: "Best resume version", value: "Business Analyst" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-4">
                    <div>
                      <p className="text-sm text-slate-400">{item.title}</p>
                      <p className="mt-1 text-xl font-semibold">{item.value}</p>
                    </div>
                    <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-300">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </section>

        <section id="mission" className="grid gap-4 md:grid-cols-3">
          {pillars.map((pillar, index) => (
            <motion.article key={pillar.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="rounded-3xl border border-pink-100 bg-white/80 p-6 shadow-sm shadow-pink-100">
              <h3 className="text-xl font-semibold text-slate-800">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{pillar.description}</p>
            </motion.article>
          ))}
        </section>

        <section id="how-it-works" className="rounded-3xl border border-pink-100 bg-white/85 p-6 text-sm text-slate-600 shadow-sm shadow-pink-100">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-pink-500">Why it matters</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-800">One place to save, update, and move forward.</h2>
          <p className="mt-3 max-w-3xl leading-7">After she saves an application, she can update its stage, change the next step, and keep everything in one clear workflow instead of losing track across messages, spreadsheets, and memory.</p>
        </section>
      </main>
    </div>
  );
}
