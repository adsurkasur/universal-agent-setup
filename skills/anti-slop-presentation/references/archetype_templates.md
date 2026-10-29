# Archetype Layout Templates (HTML / Tailwind CSS)

Gunakan template-template dasar ini untuk merakit deck yang bebas dari klise AI. Setiap slide memiliki rasio `1920x1080` (`.slide`).

---

## 1. Mode A: The Keynote / Live Presentation (Gaya Steve Jobs)

```html
<div class="slide bg-slate-950 text-white flex flex-col justify-between p-24">
  <div class="text-xs font-mono tracking-widest text-emerald-400 uppercase">
    01 / THE UNCOMFORTABLE TRUTH
  </div>
  
  <div class="max-w-4xl space-y-6">
    <h1 class="text-7xl font-extrabold tracking-tight text-white leading-tight">
      We spent $4.2M on cloud compute last quarter.
    </h1>
    <p class="text-2xl text-slate-400 font-light">
      82% of it was idle standby capacity.
    </p>
  </div>

  <div class="text-xs font-mono text-slate-500">
    OCTOBER 2026 &bull; ALL-HANDS MEMO
  </div>
</div>
```

---

## 2. Mode B: The Executive Memo (Gaya Editorial Monocle)

```html
<div class="slide bg-stone-50 text-stone-900 flex flex-col justify-between p-20 border-b border-stone-200">
  <div class="flex justify-between items-baseline border-b border-stone-300 pb-4">
    <span class="font-serif font-bold text-xl text-stone-900">STRATEGY DOSSIER</span>
    <span class="text-xs font-mono text-stone-500">SECTION 02 &bull; AUTONOMOUS OPS</span>
  </div>

  <div class="grid grid-cols-12 gap-16 my-auto">
    <div class="col-span-5 space-y-4">
      <div class="text-xs font-bold text-stone-500 uppercase tracking-wider">EXECUTIVE FINDING</div>
      <h2 class="font-serif text-4xl font-bold text-stone-950 leading-snug">
        Why Traditional CI/CD Pipelines Break Under Scale.
      </h2>
      <p class="text-stone-700 text-base leading-relaxed">
        Modern distributed systems cannot rely on human on-call rotations. When failure happens in milliseconds, human reaction times are an existential vulnerability.
      </p>
    </div>

    <div class="col-span-7 border-l border-stone-300 pl-12 space-y-8">
      <div class="border-b border-stone-200 pb-4">
        <div class="text-xs font-mono text-stone-500">OBSERVATION 01</div>
        <div class="text-lg font-bold text-stone-900">Cascading Retry Storms</div>
        <div class="text-stone-600 text-sm mt-1">94% of Sev-1 outages were triggered by automated clients hammering recovering microservices simultaneously.</div>
      </div>
      <div class="border-b border-stone-200 pb-4">
        <div class="text-xs font-mono text-stone-500">OBSERVATION 02</div>
        <div class="text-lg font-bold text-stone-900">Telemetry Saturation</div>
        <div class="text-stone-600 text-sm mt-1">Engineers spend 40% of their incident response time simply querying dashboards instead of resolving the root cause.</div>
      </div>
    </div>
  </div>

  <div class="flex justify-between text-xs font-mono text-stone-400 border-t border-stone-300 pt-4">
    <span>CONFIDENTIAL &bull; FOR INTERNAL LEADERSHIP ONLY</span>
    <span>PAGE 04</span>
  </div>
</div>
```

---

## 3. Mode C: The Dialectic / Challenger Deck (Tesis vs. Antitesis)

```html
<div class="slide bg-slate-900 text-white flex flex-col justify-between p-20">
  <div class="space-y-2">
    <span class="text-xs font-mono text-indigo-400 uppercase tracking-widest">THE PARADIGM SHIFT</span>
    <h2 class="text-4xl font-extrabold text-white">The Industry Standard vs. The Unfair Advantage</h2>
  </div>

  <div class="grid grid-cols-2 gap-12 my-auto">
    <!-- Status Quo (Left) -->
    <div class="bg-slate-950/60 border border-rose-500/30 rounded-2xl p-8 space-y-4">
      <div class="text-xs font-bold text-rose-400 uppercase tracking-wider">THE STATUS QUO (THE BROKEN WAY)</div>
      <div class="text-2xl font-bold text-slate-200">Manual Microservice Orchestration</div>
      <ul class="space-y-3 text-slate-400 text-sm">
        <li class="flex items-start gap-2"><span class="text-rose-400">&times;</span> Average 42 minutes incident MTTR with human triage</li>
        <li class="flex items-start gap-2"><span class="text-rose-400">&times;</span> Over-provisioning by 40% to survive traffic spikes</li>
        <li class="flex items-start gap-2"><span class="text-rose-400">&times;</span> Fragile YAML configurations requiring dedicated DevOps teams</li>
      </ul>
    </div>

    <!-- Our Bet (Right) -->
    <div class="bg-indigo-950/40 border border-emerald-500/40 rounded-2xl p-8 space-y-4">
      <div class="text-xs font-bold text-emerald-400 uppercase tracking-wider">THE UNFAIR ADVANTAGE (OUR BET)</div>
      <div class="text-2xl font-bold text-white">Autonomous Agent-Driven Fabric</div>
      <ul class="space-y-3 text-slate-300 text-sm">
        <li class="flex items-start gap-2"><span class="text-emerald-400">&check;</span> 8.4 seconds mean time to auto-remediate anomalies</li>
        <li class="flex items-start gap-2"><span class="text-emerald-400">&check;</span> Dynamic zero-waste allocation (-38% compute cost)</li>
        <li class="flex items-start gap-2"><span class="text-emerald-400">&check;</span> Self-declarative continuous deployment across regions</li>
      </ul>
    </div>
  </div>

  <div class="text-xs font-mono text-slate-500">
    CHALLENGER ARCHITECTURE REPORT &bull; 2026
  </div>
</div>
```
