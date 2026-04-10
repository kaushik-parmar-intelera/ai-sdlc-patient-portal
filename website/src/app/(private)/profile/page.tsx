'use client';

import React from 'react';

import { useUserDetail } from '@/hooks/user/use-user-detail';

export default function ProfilePage() {
  const { userDetail, isLoading } = useUserDetail();

  const displayName = isLoading
    ? null
    : `${userDetail?.firstName ?? ''} ${userDetail?.lastName ?? ''}`.trim() || 'Patient';
  const displayEmail = isLoading ? null : (userDetail?.email ?? '');

  return (
    <>
      <div className="flex-grow pt-8 pb-12 bg-surface">
        <div className="max-w-7xl mx-auto px-8">

          {/* ── Profile header ───────────────────────────────────── */}
          <section className="mb-12 bg-surface-container-lowest rounded-xl p-8 shadow-sm flex flex-col md:flex-row items-center md:items-end gap-8 relative overflow-hidden">
            {/* Subtle gradient accent */}
            <div
              className="absolute top-0 right-0 w-1/3 h-full opacity-5 -skew-x-12 translate-x-1/4"
              style={{ background: 'linear-gradient(135deg, #002976 0%, #003da6 100%)' }}
            />

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-40 h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100">
                <img
                  alt={displayName ?? 'Patient'}
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1ravwuTZbWQUAkvCuVFLdiFWJhxPx4qxeBX4g8LHJ0RNKp5Q1jvyjy8sirwhRly_uEc9e2rJLS6aOC-v8xNU2sG7npyR-2sHgAB5dLLtTR5OFMW1W58v9j3Km_GIf7sh16DgVGMmFQJwkq3tx0gqZbNbsweKX_h-g2O33kz9JRTgj3fIp4po5nIHSUkG_JFe1oG4Kny_f5N0IDY3Ia592zJR-fsPAVYAiPRAW_obWcY25pfxt3jyk9NZ0w1Sz3j9PeX9Nrp9sroQ"
                />
              </div>
              <button className="absolute bottom-2 right-2 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-sm">photo_camera</span>
              </button>
            </div>

            {/* Info */}
            <div className="flex-grow text-center md:text-left z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container text-on-secondary-fixed-variant rounded-full text-xs font-bold mb-3 tracking-wide">
                <span className="material-symbols-outlined text-sm">verified</span>
                PREMIUM MEMBER
              </div>
              <h1 className="text-4xl font-headline font-extrabold text-primary tracking-tight mb-1">
                {isLoading ? (
                  <span
                    aria-busy="true"
                    aria-label="Loading patient name"
                    className="inline-block h-10 w-52 animate-pulse rounded-md bg-slate-200"
                  />
                ) : (
                  displayName
                )}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-on-surface-variant font-medium text-sm">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-lg">fingerprint</span>
                  PID: 882-901-CC
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-lg">calendar_today</span>
                  Joined March 2021
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 z-10">
              <button className="px-6 py-3 bg-surface-container-highest text-on-surface rounded-xl font-bold hover:bg-surface-variant transition-colors text-sm">
                Edit Profile
              </button>
              <button
                className="px-8 py-3 text-white rounded-xl font-bold shadow-lg hover:opacity-90 transition-opacity text-sm"
                style={{ background: 'linear-gradient(135deg, #002976 0%, #003da6 100%)' }}
              >
                Book Appointment
              </button>
            </div>
          </section>

          {/* ── Main content grid ────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left column: Contact + Billing ───────────────────── */}
            <div className="lg:col-span-4 flex flex-col gap-8">

              {/* Contact Details */}
              <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
                <h3 className="text-xl font-headline font-bold text-primary mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined">contact_page</span>
                  Contact Details
                </h3>
                <div className="space-y-6">
                  <div className="group">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-1">
                      Email Address
                    </label>
                    <p className="text-primary font-semibold flex items-center gap-2">
                      {isLoading ? (
                        <span
                          aria-busy="true"
                          aria-label="Loading email"
                          className="inline-block h-5 w-48 animate-pulse rounded-md bg-slate-200"
                        />
                      ) : (
                        <>
                          {displayEmail}
                          <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            content_copy
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-1">
                      Mobile Phone
                    </label>
                    <p className="text-on-surface font-semibold">+1 (555) 012-3456</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-1">
                      Residential Address
                    </label>
                    <p className="text-on-surface leading-relaxed">
                      742 Evergreen Terrace<br />
                      Suite 400, North District<br />
                      Portland, OR 97201
                    </p>
                  </div>
                </div>
              </div>

              {/* Billing & Insurance */}
              <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border-b-2 border-primary">
                <h3 className="text-xl font-headline font-bold text-primary mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined">payments</span>
                  Billing &amp; Insurance
                </h3>
                <div className="space-y-4">
                  {/* Visa card */}
                  <div className="p-4 bg-surface-container-low rounded-xl flex items-center gap-4">
                    <div className="w-12 h-8 bg-on-background rounded flex items-center justify-center text-white font-bold italic text-[10px] flex-shrink-0">
                      VISA
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-bold text-on-surface">•••• 4412</p>
                      <p className="text-xs text-on-surface-variant">Expires 12/26</p>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary">
                      more_vert
                    </span>
                  </div>

                  {/* Insurance */}
                  <div className="p-4 bg-primary-fixed/20 border border-primary-fixed/30 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-primary uppercase">Active Insurance</span>
                      <span className="text-[10px] px-2 py-0.5 bg-primary text-white rounded-full font-bold">
                        PRIMARY
                      </span>
                    </div>
                    <p className="text-sm font-bold text-primary mb-1">Blue Shield Premier PPO</p>
                    <p className="text-xs text-on-surface-variant">ID: CC-4829-XJ-21</p>
                  </div>

                  <button className="w-full py-3 rounded-xl border-2 border-dashed border-outline-variant text-on-surface-variant font-bold text-sm hover:border-primary hover:text-primary transition-all">
                    + Add Payment Method
                  </button>
                </div>
              </div>
            </div>

            {/* Right column: Clinical History ───────────────────── */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-headline font-bold text-primary flex items-center gap-3">
                    <span className="material-symbols-outlined">history_edu</span>
                    Clinical History
                  </h3>
                  <button className="text-primary font-bold text-sm hover:underline">
                    Download Full Records
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Chronic Conditions */}
                  <div className="bg-surface rounded-xl p-6 border-l-4 border-primary">
                    <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">
                      Chronic Conditions
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <span className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
                        <div>
                          <p className="font-bold text-sm">Type 2 Diabetes Mellitus</p>
                          <p className="text-xs text-on-surface-variant">Diagnosed Jan 2019 • Managed</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
                        <div>
                          <p className="font-bold text-sm">Hypertension</p>
                          <p className="text-xs text-on-surface-variant">Diagnosed Oct 2020 • Controlled</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Known Allergies */}
                  <div className="bg-error-container/20 rounded-xl p-6 border-l-4 border-error">
                    <h4 className="text-xs font-bold text-error uppercase tracking-widest mb-4">
                      Known Allergies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {['Penicillin', 'Latex', 'Peanuts'].map((allergy) => (
                        <span
                          key={allergy}
                          className="px-3 py-1 bg-white text-error border border-error/30 rounded-full text-xs font-bold"
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Active Medications (full width) */}
                  <div className="md:col-span-2 bg-surface-container-low rounded-xl p-6">
                    <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-6">
                      Active Medications
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { name: 'Metformin HCl', dose: '500mg • Twice Daily' },
                        { name: 'Lisinopril', dose: '10mg • Once Daily (Morning)' },
                      ].map((med) => (
                        <div
                          key={med.name}
                          className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm"
                        >
                          <div className="w-12 h-12 bg-secondary-container rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                            <span className="material-symbols-outlined">medication</span>
                          </div>
                          <div>
                            <p className="font-bold text-sm">{med.name}</p>
                            <p className="text-xs text-on-surface-variant">{med.dose}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Procedures (full width) */}
                  <div className="md:col-span-2 mt-4">
                    <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-6">
                      Recent Procedures
                    </h4>
                    <div className="space-y-4">
                      {[
                        {
                          day: '12',
                          month: 'Nov 23',
                          title: 'Annual Comprehensive Physical',
                          provider: 'Dr. Aris Thorne • Central Wellness Center',
                        },
                        {
                          day: '04',
                          month: 'Aug 23',
                          title: 'Dermatological Screening',
                          provider: 'Dr. Sarah Miller • Skin Health Assoc.',
                        },
                      ].map((proc) => (
                        <div
                          key={proc.title}
                          className="flex items-center gap-6 p-4 hover:bg-surface transition-colors rounded-xl"
                        >
                          <div className="text-center min-w-[60px]">
                            <p className="text-lg font-headline font-black text-primary">{proc.day}</p>
                            <p className="text-[10px] font-bold text-on-surface-variant uppercase">
                              {proc.month}
                            </p>
                          </div>
                          <div className="h-10 w-[2px] bg-primary-fixed flex-shrink-0" />
                          <div className="flex-grow">
                            <p className="font-bold text-on-surface">{proc.title}</p>
                            <p className="text-xs text-on-surface-variant">{proc.provider}</p>
                          </div>
                          <span className="material-symbols-outlined text-primary-container cursor-pointer">
                            chevron_right
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="w-full py-12 mt-auto bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <span className="font-headline font-bold text-primary text-lg">Clinical Curator</span>
            <p className="text-slate-500 text-sm mt-2">
              © 2024 Clinical Curator. All rights reserved. Precision Healthcare Excellence.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {['Privacy Policy', 'Terms of Service', 'Help Center', 'Security'].map((link) => (
              <a
                key={link}
                href="#"
                className="text-slate-500 hover:text-primary transition-colors text-sm"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
