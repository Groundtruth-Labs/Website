"use client";

import Avatar from "boring-avatars";

const AVATAR_COLORS = ["#0e7490", "#0f172a", "#f59e0b", "#e2e8f0", "#f8fafc"];

const members = [
  {
    name: "Tahan B.",
    role: "Co-Founder",
    bio: "Tahan is a student at Punahou School with a focus on sustainability, data science, and environmental technology. He was part of Punahou's inaugural Sustainability Fellowship cohort, where he analyzed wave energy data using acoustic profiling instruments at the University of Hawaiʻi Wave Energy Lab. His science fair project on automated coral reef health evaluation using CNNs and hyperspectral analysis was recognized at the Hawaii State Science & Engineering Fair.",
  },
  {
    name: "Josh Z.",
    role: "Co-Founder",
    bio: "Josh is a student at Punahou School in Hawaiʻi with a background in computer science and applied AI research. He has spent the past two years working with the University of Hawaiʻi AI Transportation Lab, where he became a first author on a paper on nighttime pedestrian behavior recognition submitted to the AI for Transportation journal and contributed to several of the lab's IEEE papers. In his free time, he builds apps and websites.",
  },
];

export function TeamSection() {
  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <span className="font-mono text-xs font-semibold text-cyan-700 uppercase tracking-widest">
          The team
        </span>
        <h2 className="font-mono text-3xl font-bold text-slate-900 mt-3 mb-12">
          Who we are.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
          {members.map((member) => (
            <div
              key={member.name}
              className="border border-slate-200 bg-white rounded p-6 shadow-sm"
            >
              <div className="mb-4">
                <Avatar
                  name={member.name}
                  variant="bauhaus"
                  size={48}
                  colors={AVATAR_COLORS}
                />
              </div>
              <h3 className="font-mono text-base font-semibold text-slate-900">
                {member.name}
              </h3>
              <p className="font-mono text-xs text-cyan-700 uppercase tracking-widest mt-1 mb-3">
                {member.role}
              </p>
              <p className="font-sans text-sm text-slate-600 leading-relaxed">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
