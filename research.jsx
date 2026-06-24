const { useState, useEffect, useMemo, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentHue": 295,
  "showSparklines": true,
  "density": "comfortable",
  "showGrain": true
}/*EDITMODE-END*/;

// ---------- DATA ----------
const ENTRIES = [
  {
    id: "r-014",
    num: "014",
    status: "active",
    title: "On the latency budget of <em>thinking out loud</em>",
    tags: ["primary:HCI", "interfaces", "latency", "draft"],
    primary: "HCI",
    abstract: "Measuring the perceptual cost of streamed reasoning in agentic interfaces — when does watching a model think become more friction than transparency?",
    date: "2026-04",
    dateLabel: "Apr 2026",
    readTime: 14,
    citations: 3,
    spark: [4, 6, 5, 8, 12, 11, 14, 18, 17, 22, 26, 31],
    expanded: {
      body: "An ongoing investigation into the <strong>tradeoff between transparency and tempo</strong> in streamed-reasoning interfaces. Initial findings suggest that users tolerate ~1.4s of visible 'thinking' before frustration outweighs trust gains; below that threshold, exposing intermediate steps measurably increases perceived competence. Above it, the same exposure feels like stalling.\n\nNext: a within-subjects study comparing four disclosure modes — fully hidden, summarized, streamed-token, and structured-step — across three task categories.",
      related: [
        { label: "Streaming UI patterns", meta: "internal" },
        { label: "Trust calibration in LLM apps", meta: "2025" },
        { label: "Anthropic — agent UX notes", meta: "ext" }
      ]
    }
  },
  {
    id: "r-013",
    num: "013",
    status: "published",
    title: "Statz: a year of <em>quantified self</em>, in retrospect",
    tags: ["primary:Product", "iOS", "habits", "case-study"],
    primary: "Product",
    abstract: "Twelve months of building, shipping, and rebuilding a self-tracking app. What stuck, what didn't, and the surprisingly load-bearing role of friction in habit retention.",
    date: "2026-03",
    dateLabel: "Mar 2026",
    readTime: 22,
    citations: 7,
    spark: [12, 14, 18, 16, 20, 25, 23, 28, 32, 30, 35, 38],
    expanded: {
      body: "A retrospective on shipping <strong>Statz</strong> — the design decisions that aged well, the ones that didn't, and a candid look at the metrics that actually predicted retention versus the ones I thought would.\n\nKey claim: <strong>onboarding friction is undervalued</strong>. The version with a longer, more demanding setup outperformed the 'frictionless' variant on D7 retention by 1.8x. Investment effects are real and measurable.",
      related: [
        { label: "Statz on the App Store", meta: "live" },
        { label: "D7 retention dataset", meta: "private" },
        { label: "Onboarding ablation log", meta: "Mar 2026" }
      ]
    }
  },
  {
    id: "r-012",
    num: "012",
    status: "active",
    title: "Composable interfaces for <em>non-deterministic</em> systems",
    tags: ["primary:HCI", "design-systems", "agents"],
    primary: "HCI",
    abstract: "How do you build a coherent UI vocabulary when the underlying system can return anything? A working theory of 'shaped uncertainty' as a primary design primitive.",
    date: "2026-02",
    dateLabel: "Feb 2026",
    readTime: 18,
    citations: 5,
    spark: [8, 10, 12, 14, 13, 16, 19, 22, 21, 24, 27, 30],
    expanded: {
      body: "Most design systems assume <strong>deterministic outputs</strong>: a button click triggers a known state. Agentic and generative systems break that assumption — the same input may return text, a tool call, a structured object, or an error. This essay proposes treating <strong>shape uncertainty</strong> as a first-class design primitive, with components that gracefully degrade across return types.",
      related: [
        { label: "Generative UI taxonomy", meta: "draft" },
        { label: "Component fallback patterns", meta: "internal" }
      ]
    }
  },
  {
    id: "r-011",
    num: "011",
    status: "published",
    title: "Notes on running an <em>LLC of one</em>",
    tags: ["primary:Practice", "indie", "ops"],
    primary: "Practice",
    abstract: "Twelve months in. The boring infrastructure decisions that paid off, the frameworks that didn't, and a defense of doing your own books for at least the first year.",
    date: "2026-02",
    dateLabel: "Feb 2026",
    readTime: 9,
    citations: 0,
    spark: [6, 7, 9, 11, 10, 13, 15, 14, 17, 20, 19, 22],
    expanded: {
      body: "A practical log of solo-LLC operations: <strong>what to automate, what to keep manual</strong>, and which expensive 'founder tools' turned out to be theater. Spoiler: a spreadsheet and a shared inbox got me further than three of the four CRMs I tried.",
      related: [
        { label: "Tooling audit, Q1", meta: "private" },
        { label: "Tax setup notes", meta: "Feb 2026" }
      ]
    }
  },
  {
    id: "r-010",
    num: "010",
    status: "draft",
    title: "The <em>second-order</em> effects of generative search",
    tags: ["primary:Research", "search", "speculation"],
    primary: "Research",
    abstract: "If LLM-mediated search collapses the click economy, what replaces it? A speculative map of attention, attribution, and authorship in a post-SERP web.",
    date: "2026-01",
    dateLabel: "Jan 2026",
    readTime: 16,
    citations: 11,
    spark: [3, 4, 6, 8, 7, 10, 13, 12, 15, 18, 17, 20],
    expanded: {
      body: "Working through three scenarios for the post-SERP web: <strong>(1) attribution renaissance</strong>, where citation primitives become load-bearing; <strong>(2) attention recession</strong>, where original work becomes economically untenable; <strong>(3) walled-pasture pluralism</strong>, where each major model surfaces a different web. None feel obviously most likely.",
      related: [
        { label: "Citation UX patterns", meta: "live" },
        { label: "Search economics 2026", meta: "ext" },
        { label: "Attribution primitives RFC", meta: "draft" }
      ]
    }
  },
  {
    id: "r-009",
    num: "009",
    status: "published",
    title: "Why your <em>habit tracker</em> stops working in week three",
    tags: ["primary:Product", "habits", "behavior"],
    primary: "Product",
    abstract: "The streak is the wrong primitive. A short essay on why most quantified-self tools fail at the exact moment they were supposed to start working — and a sketch of what to replace them with.",
    date: "2025-12",
    dateLabel: "Dec 2025",
    readTime: 7,
    citations: 4,
    spark: [10, 12, 15, 18, 22, 25, 23, 20, 17, 14, 11, 9],
    expanded: {
      body: "<strong>Streaks reward consistency, not progress.</strong> In week three, when life happens, a single break invalidates weeks of investment — and most users never recover. The fix isn't 'streak insurance' (band-aid); it's a different primitive entirely. Sketch attached.",
      related: [
        { label: "Streak alternatives", meta: "private" }
      ]
    }
  },
  {
    id: "r-008",
    num: "008",
    status: "archived",
    title: "Color systems for <em>information density</em>",
    tags: ["primary:Design", "color", "data-viz"],
    primary: "Design",
    abstract: "A field guide to building OKLCH-based palettes for dashboards: when to vary hue, when to vary chroma, and the surprisingly narrow band where lightness can carry semantic weight.",
    date: "2025-11",
    dateLabel: "Nov 2025",
    readTime: 11,
    citations: 2,
    spark: [14, 13, 12, 11, 10, 11, 10, 9, 8, 9, 7, 8],
    expanded: {
      body: "OKLCH gives designers a perceptual coordinate system, but most palettes built in it still treat hue as the dominant variable. This piece argues for <strong>chroma-led palettes</strong> in dense informational UIs, where saturation differences track semantic weight more reliably than hue shifts.",
      related: [
        { label: "OKLCH primer", meta: "ext" },
        { label: "Dashboard palette audit", meta: "2025" }
      ]
    }
  }
];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "HCI", label: "HCI" },
  { id: "Product", label: "Product" },
  { id: "Research", label: "Research" },
  { id: "Design", label: "Design" },
  { id: "Practice", label: "Practice" }
];

// ---------- COMPONENTS ----------

function Sparkline({ points }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const w = 120, h = 28, pad = 2;
  const step = (w - pad * 2) / (points.length - 1);
  const coords = points.map((v, i) => [pad + i * step, h - pad - ((v - min) / range) * (h - pad * 2)]);
  const path = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `M${pad},${h - pad} L${coords.map(c => c.join(',')).join(' L')} L${w - pad},${h - pad} Z`;
  return (
    <svg className="sparkline" viewBox={`0 0 ${w} ${h}`}>
      <path className="area" d={area} />
      <path d={path} />
      <circle cx={coords[coords.length - 1][0]} cy={coords[coords.length - 1][1]} r="2" fill="var(--accent)" />
    </svg>
  );
}

function Tag({ tag }) {
  const isPrimary = tag.startsWith("primary:");
  const label = isPrimary ? tag.replace("primary:", "") : tag;
  return <span className={"tag" + (isPrimary ? " primary" : "")}>{label}</span>;
}

function StatusDot({ status }) {
  return <span className={"status-dot " + status} />;
}

function Item({ entry, expanded, onToggle, showSparklines }) {
  return (
    <article className="item" onClick={onToggle}>
      <div className="item-num">
        <StatusDot status={entry.status} />
        {entry.num}
      </div>
      <div className="item-body">
        <div className="item-tags">
          {entry.tags.map(t => <Tag key={t} tag={t} />)}
        </div>
        <h2 className="item-title" dangerouslySetInnerHTML={{ __html: entry.title }} />
        <p className="item-abstract">{entry.abstract}</p>
        <div className="item-foot">
          <span>{entry.dateLabel}</span>
          <span className="pip" />
          <span>{entry.readTime} min read</span>
          {entry.citations > 0 && <>
            <span className="pip" />
            <span>{entry.citations} ref{entry.citations === 1 ? '' : 's'}</span>
          </>}
          <span className="pip" />
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>{entry.status}</span>
        </div>
      </div>
      <div className="item-side">
        <div className="item-side-row">
          <span className="lbl">Filed</span>
          <span className="val">{entry.dateLabel}</span>
        </div>
        {showSparklines && (
          <div className="item-side-row">
            <span className="lbl">Engagement</span>
            <Sparkline points={entry.spark} />
          </div>
        )}
        <div className="item-arrow">
          {expanded ? '— close' : 'read →'}
        </div>
      </div>
      {expanded && (
        <div className="item-expanded" onClick={e => e.stopPropagation()}>
          <div className="expanded-body">
            {entry.expanded.body.split('\n\n').map((p, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
            ))}
            <button className="read-cta">
              Read full piece
              <span>→</span>
            </button>
          </div>
          <div className="expanded-side">
            <h4>Related</h4>
            <ul>
              {entry.expanded.related.map((r, i) => (
                <li key={i}>
                  <span>{r.label}</span>
                  <span className="meta">{r.meta}</span>
                </li>
              ))}
            </ul>
            <h4>Cite</h4>
            <ul>
              <li>
                <span>Miesen, M. ({entry.dateLabel.split(' ')[1]})</span>
                <span className="meta">{entry.id}</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </article>
  );
}

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [expandedId, setExpandedId] = useState(null);
  const [progress, setProgress] = useState(0);

  // Live accent + grain control
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-h', tweaks.accentHue);
  }, [tweaks.accentHue]);

  useEffect(() => {
    document.body.style.setProperty('--grain-opacity', tweaks.showGrain ? '0.5' : '0');
  }, [tweaks.showGrain]);

  // Reading progress
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setProgress(total > 0 ? (h.scrollTop / total) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const counts = useMemo(() => {
    const c = { all: ENTRIES.length };
    ENTRIES.forEach(e => { c[e.primary] = (c[e.primary] || 0) + 1; });
    return c;
  }, []);

  const filtered = useMemo(() => {
    let arr = filter === "all" ? ENTRIES : ENTRIES.filter(e => e.primary === filter);
    arr = [...arr];
    if (sort === "newest") arr.sort((a, b) => b.date.localeCompare(a.date));
    if (sort === "oldest") arr.sort((a, b) => a.date.localeCompare(b.date));
    if (sort === "longest") arr.sort((a, b) => b.readTime - a.readTime);
    return arr;
  }, [filter, sort]);

  return (
    <>
      <div className="progress" style={{ width: progress + '%' }} />

      <nav className="nav">
        <div className="nav-inner">
          <a className="brand" href="#">
            <span className="brand-mark" />
            <span className="brand-name">Max Miesen</span>
            <span className="brand-sep">/</span>
            <span className="brand-section">research</span>
          </a>
          <div className="nav-links">
            <a href="#">work</a>
            <a href="#" className="active">research</a>
            <a href="#">notes</a>
            <a href="#">contact</a>
          </div>
          <div className="nav-meta">
            <span className="live-dot" />
            <span>{ENTRIES.filter(e => e.status === "active").length} active threads</span>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="eyebrow">Research log · v2026</div>
        <h1>Working notes on <em>interfaces</em>, agents, and the practice of building.</h1>
        <p className="hero-lede">
          A running index of what I'm thinking about — published essays, drafts in progress, and threads I keep pulling on. Updated whenever something is worth saying out loud.
        </p>
        <div className="hero-meta">
          <div>
            <span className="lbl">Entries</span>
            <span className="val">{ENTRIES.length} · {ENTRIES.filter(e => e.status === "active").length} active</span>
          </div>
          <div>
            <span className="lbl">Last filed</span>
            <span className="val">{ENTRIES[0].dateLabel}</span>
          </div>
          <div>
            <span className="lbl">Threads</span>
            <span className="val">HCI · Product · Research · Practice</span>
          </div>
          <div>
            <span className="lbl">RSS</span>
            <span className="val">/research/feed.xml</span>
          </div>
        </div>
      </header>

      <div className="filterbar">
        <div className="chips">
          {FILTERS.map(f => (
            <button
              key={f.id}
              className={"chip" + (filter === f.id ? " active" : "")}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
              <span className="count">{counts[f.id] || 0}</span>
            </button>
          ))}
        </div>
        <div className="sort">
          <span>sort:</span>
          <button className={sort === "newest" ? "active" : ""} onClick={() => setSort("newest")}>newest</button>
          <button className={sort === "oldest" ? "active" : ""} onClick={() => setSort("oldest")}>oldest</button>
          <button className={sort === "longest" ? "active" : ""} onClick={() => setSort("longest")}>longest</button>
        </div>
      </div>

      <main className="list">
        {filtered.map(entry => (
          <Item
            key={entry.id}
            entry={entry}
            expanded={expandedId === entry.id}
            onToggle={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
            showSparklines={tweaks.showSparklines}
          />
        ))}
      </main>

      <footer className="footer">
        <div className="footer-left">
          <div className="bigtype">Maintained out of Encinitas, CA.</div>
          <div>Max Miesen LLC · est. 2025 · documents filed under B20250003052</div>
          <div>Subscribe via RSS, or get a quarterly digest by email.</div>
        </div>
        <div className="footer-right">
          <span className="lbl">Elsewhere</span>
          <a href="#">github →</a>
          <a href="#">are.na →</a>
          <a href="#">app store →</a>
          <a href="#">email →</a>
        </div>
      </footer>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Accent">
          <TweakSlider
            label="Hue"
            value={tweaks.accentHue}
            onChange={v => setTweak('accentHue', v)}
            min={0} max={360} step={1}
            suffix="°"
          />
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            {[
              { name: 'violet', h: 295 },
              { name: 'indigo', h: 270 },
              { name: 'blue', h: 245 },
              { name: 'magenta', h: 320 },
              { name: 'pink', h: 350 },
              { name: 'cyan', h: 200 }
            ].map(p => (
              <button
                key={p.name}
                onClick={() => setTweak('accentHue', p.h)}
                title={p.name}
                style={{
                  width: 22, height: 22, borderRadius: 6,
                  background: `oklch(0.72 0.19 ${p.h})`,
                  border: tweaks.accentHue === p.h ? '2px solid white' : '1px solid rgba(255,255,255,0.15)',
                  cursor: 'pointer', padding: 0
                }}
              />
            ))}
          </div>
        </TweakSection>
        <TweakSection title="Display">
          <TweakToggle
            label="Sparklines"
            value={tweaks.showSparklines}
            onChange={v => setTweak('showSparklines', v)}
          />
          <TweakToggle
            label="Film grain"
            value={tweaks.showGrain}
            onChange={v => setTweak('showGrain', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
