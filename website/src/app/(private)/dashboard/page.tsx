import Link from 'next/link';
import React from 'react';

export default function DashboardPage() {
  return (
    <>
      <div className="pt-8 pb-20 px-6 max-w-7xl mx-auto">
        {/* ── Dashboard header ───────────────────────────────────── */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-primary font-bold tracking-widest text-xs uppercase font-headline">
              Dashboard Overview
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-primary mt-1 font-headline">
              Welcome back, Sarah.
            </h1>
            <p className="text-on-surface-variant mt-2 text-lg">
              Your health summary is up to date as of today.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="bg-surface-container-highest text-on-surface px-6 py-3 rounded-xl font-bold transition-all hover:bg-surface-variant text-sm">
              Request Records
            </button>
            <button
              className="text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/10 transition-all hover:scale-[1.02] text-sm"
              style={{ background: 'linear-gradient(135deg, #002976 0%, #003da6 100%)' }}
            >
              Book Appointment
            </button>
          </div>
        </header>

        {/* ── Bento grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* ── Patient Profile Card (col-span-4) ─────────────────── */}
          <div className="md:col-span-4 bg-surface-container-lowest rounded-2xl p-8 flex flex-col gap-6 shadow-sm">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 bg-surface-container">
                <img
                  alt="Sarah Jenkins"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9pPEMKMT3rFTF-DkjEPoTcq0ph89Kd7upWp6FDDFXrpPtjXjjIdQtG2DUPX1HXHEFPiTdfRAA2_u0-SBGMjupOXutZrUzCGgp76BmR8B5LC5fKxi-UKC7Wa0VPmqzxtMCy80CZl_IAFsYrCKgpHUyuCTSTJEC8yUsGol86lgNj3jKvJUO_IGxXVlWfxDLID06Ig4vmD2qqAiIMTnwf-gJTGA9coQzrC3GV9RyFgqWJ1s-Dp9ucbXEhk8JIkCBrz_egTJ2hkmO_LQ"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-primary font-headline">Sarah Jenkins</h2>
                <p className="text-on-surface-variant text-sm font-medium">Patient ID: #CC-88291</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-surface-container-low p-4 rounded-xl">
                <span className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1">
                  Blood Type
                </span>
                <p className="text-xl font-bold text-primary">A Positive (A+)</p>
              </div>
              <div className="bg-surface-container-low p-4 rounded-xl">
                <span className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1">
                  Primary Physician
                </span>
                <p className="text-xl font-bold text-primary">Dr. Elena Rossi</p>
              </div>
            </div>

            <div className="pt-4 border-t border-surface-container-highest flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Age</span>
                <span className="font-bold">34 years</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Weight</span>
                <span className="font-bold">64 kg</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Height</span>
                <span className="font-bold">168 cm</span>
              </div>
            </div>
          </div>

          {/* ── Vitals + Appointments (col-span-8) ────────────────── */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Heart Rate */}
            <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm border-l-4 border-primary">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-on-surface-variant font-medium">Heart Rate</p>
                  <h3 className="text-4xl font-extrabold text-primary font-headline">
                    72{' '}
                    <span className="text-lg font-medium text-on-surface-variant">bpm</span>
                  </h3>
                </div>
                <div className="bg-primary-fixed p-2 rounded-lg">
                  <span className="material-symbols-outlined text-primary">favorite</span>
                </div>
              </div>
              {/* Sparkline */}
              <div className="h-16 flex items-end gap-1">
                {[40, 60, 55, 80, 65, 95, 70, 50].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm"
                    style={{
                      height: `${h}%`,
                      background:
                        i === 5
                          ? 'linear-gradient(135deg,#002976,#003da6)'
                          : `rgba(0,41,118,${0.2 + i * 0.06})`,
                    }}
                  />
                ))}
              </div>
              <p className="text-xs text-on-surface-variant mt-4 font-medium italic">
                Normal range maintained for 48h
              </p>
            </div>

            {/* Blood Pressure */}
            <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm border-l-4 border-secondary">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-on-surface-variant font-medium">Blood Pressure</p>
                  <h3 className="text-4xl font-extrabold text-primary font-headline">
                    118/76{' '}
                    <span className="text-lg font-medium text-on-surface-variant">mmHg</span>
                  </h3>
                </div>
                <div className="bg-secondary-fixed p-2 rounded-lg">
                  <span className="material-symbols-outlined text-secondary">monitor_heart</span>
                </div>
              </div>
              <div className="space-y-3 mt-4">
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary w-[85%] h-full rounded-full" />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase">
                  <span>Optimal</span>
                  <span>Hypertension</span>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant mt-6 font-medium italic">
                Measured this morning at 8:15 AM
              </p>
            </div>

            {/* Next Appointments (full row) */}
            <div className="bg-surface-container-low rounded-2xl p-8 shadow-sm sm:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-primary font-headline">Next Appointments</h3>
                <Link
                  href="/appointments"
                  className="text-sm font-bold text-secondary hover:underline"
                >
                  View Calendar
                </Link>
              </div>
              <div className="space-y-4">
                {/* Appointment 1 */}
                <div className="bg-surface-container-lowest p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-transform hover:translate-x-1">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary-fixed-dim w-14 h-14 rounded-full flex flex-col items-center justify-center text-primary flex-shrink-0">
                      <span className="text-xs font-bold uppercase">Oct</span>
                      <span className="text-xl font-extrabold leading-none">24</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-primary">Annual Physical Examination</h4>
                      <p className="text-sm text-on-surface-variant">Dr. Elena Rossi • General Medicine</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">09:30 AM</p>
                      <p className="text-xs text-on-surface-variant">In-Person Visit</p>
                    </div>
                    <button className="text-primary hover:bg-primary-fixed p-2 rounded-lg transition-colors">
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </div>
                </div>

                {/* Appointment 2 */}
                <div className="bg-surface-container-lowest p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-transform hover:translate-x-1">
                  <div className="flex items-center gap-4">
                    <div className="bg-tertiary-fixed w-14 h-14 rounded-full flex flex-col items-center justify-center text-on-tertiary-fixed-variant flex-shrink-0">
                      <span className="text-xs font-bold uppercase">Nov</span>
                      <span className="text-xl font-extrabold leading-none">02</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-primary">Dermatology Consultation</h4>
                      <p className="text-sm text-on-surface-variant">Dr. Marcus Thorne • Skin Clinic</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">02:15 PM</p>
                      <p className="text-xs text-on-surface-variant">Video Call</p>
                    </div>
                    <button className="text-primary hover:bg-primary-fixed p-2 rounded-lg transition-colors">
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Recent Health Records (full width) ────────────────── */}
          <div className="md:col-span-12">
            <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-primary font-headline">Recent Health Records</h3>
                  <p className="text-on-surface-variant">Laboratory results and clinical summaries</p>
                </div>
                <div className="flex gap-2">
                  <button className="bg-surface-container-low px-4 py-2 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors">
                    Lab Results
                  </button>
                  <button className="bg-surface-container-low px-4 py-2 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors">
                    Radiology
                  </button>
                  <button className="bg-surface-container-low px-4 py-2 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors">
                    Prescriptions
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Record 1 */}
                <div className="group border border-transparent hover:border-outline-variant/30 bg-surface-container-low p-6 rounded-2xl transition-all hover:bg-surface-container-high">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-white p-3 rounded-xl shadow-sm">
                      <span className="material-symbols-outlined text-secondary">lab_profile</span>
                    </div>
                    <span className="text-xs font-bold text-secondary uppercase tracking-widest">
                      Completed
                    </span>
                  </div>
                  <h4 className="font-bold text-primary text-lg mb-1">Comprehensive Metabolic Panel</h4>
                  <p className="text-sm text-on-surface-variant mb-4">Updated 14 days ago</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-tertiary-fixed text-on-tertiary-fixed-variant px-2 py-1 rounded-md font-bold italic">
                      Requires Review
                    </span>
                    <button className="text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      View Report{' '}
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>

                {/* Record 2 */}
                <div className="group border border-transparent hover:border-outline-variant/30 bg-surface-container-low p-6 rounded-2xl transition-all hover:bg-surface-container-high">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-white p-3 rounded-xl shadow-sm">
                      <span className="material-symbols-outlined text-secondary">medication</span>
                    </div>
                    <span className="text-xs font-bold text-secondary uppercase tracking-widest">
                      Active
                    </span>
                  </div>
                  <h4 className="font-bold text-primary text-lg mb-1">Lisinopril 10mg</h4>
                  <p className="text-sm text-on-surface-variant mb-4">Daily oral prescription</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-secondary-container/30 text-secondary px-2 py-1 rounded-md font-bold">
                      2 Refills Left
                    </span>
                    <Link
                      href="/prescriptions"
                      className="text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all"
                    >
                      Manage{' '}
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>
                </div>

                {/* Record 3 */}
                <div className="group border border-transparent hover:border-outline-variant/30 bg-surface-container-low p-6 rounded-2xl transition-all hover:bg-surface-container-high">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-white p-3 rounded-xl shadow-sm">
                      <span className="material-symbols-outlined text-secondary">radiology</span>
                    </div>
                    <span className="text-xs font-bold text-secondary uppercase tracking-widest">
                      Historical
                    </span>
                  </div>
                  <h4 className="font-bold text-primary text-lg mb-1">Chest X-Ray Digital Copy</h4>
                  <p className="text-sm text-on-surface-variant mb-4">Conducted Aug 12, 2024</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-surface-container-highest text-on-surface px-2 py-1 rounded-md font-bold">
                      Archive
                    </span>
                    <button className="text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Download{' '}
                      <span className="material-symbols-outlined text-sm">download</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="bg-slate-50 border-t border-slate-200/40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full px-8 py-12 max-w-7xl mx-auto">
          <div className="space-y-4">
            <span className="text-lg font-bold text-primary font-headline">
              Clinical Curator Health Systems
            </span>
            <p className="text-sm font-medium text-slate-500 max-w-sm leading-relaxed">
              Empowering patients through curated health intelligence and premium clinical care
              coordination.
            </p>
            <p className="text-sm font-medium text-slate-500">
              © 2024 Clinical Curator Health Systems. All rights reserved.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-primary font-bold text-sm uppercase tracking-widest mb-2">
                Patient Services
              </span>
              <a className="text-slate-500 hover:underline decoration-primary underline-offset-4 text-sm" href="#">
                Find a Clinic
              </a>
              <a className="text-slate-500 hover:underline decoration-primary underline-offset-4 text-sm" href="#">
                Contact Support
              </a>
              <a className="text-sm font-bold text-error" href="#">
                Emergency: 911
              </a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-primary font-bold text-sm uppercase tracking-widest mb-2">
                Legal
              </span>
              <a className="text-slate-500 hover:underline decoration-primary underline-offset-4 text-sm" href="#">
                Privacy Policy
              </a>
              <a className="text-slate-500 hover:underline decoration-primary underline-offset-4 text-sm" href="#">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
