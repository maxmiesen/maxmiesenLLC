/* ---------- research viewer ---------- */
const REPORTS = [
  { num:"01", code:"BME 404", cat:"BME", catLabel:"Biomech", title:"Orthopedic Biomechanics", file:"BME404report.pdf", semester:"Fall 2024", desc:"Biomedical engineering analysis of orthopedic systems — medical device design and biological-systems integration. Covers load-bearing implants, joint mechanics, and the constraints of in-vivo material selection.", tags:["Biomechanics","Implants","Materials"] },
  { num:"02", code:"BME 405", cat:"BME", catLabel:"Senior Projects", title:"Biomedical Senior Projects", file:"BME405report.pdf", semester:"Spring 2025", desc:"Biomedical systems engineering with medical-device integration and end-to-end system optimization. Documents design tradeoffs, validation methodology, and team-level engineering process.", tags:["Systems","Devices","Optimization"] },
  { num:"03", code:"BME 410", cat:"BME", catLabel:"Tissue & Biomaterials", title:"Tissue Engineering & Biomaterials", file:"BME410report.pdf", semester:"Fall 2023", desc:"Biomedical instrumentation, sensor technologies, and measurement systems applied to medical-grade biomaterials. Examines characterization protocols and calibration strategies.", tags:["Tissue","Sensors","Measurement"] },
  { num:"04", code:"BME 499", cat:"BME", catLabel:"Capstone", title:"Special Topics — Capstone Senior Design", file:"BME499report.pdf", semester:"Spring 2025", desc:"Capstone senior-design project consolidating biomedical engineering coursework into an end-to-end design problem. Covers ideation, prototyping, and validation under industry-style constraints.", tags:["Capstone","Design","Prototype"] },
  { num:"05", code:"EE 202", cat:"EE", catLabel:"Linear Circuits", title:"Linear Circuits Analysis", file:"EE202report.pdf", semester:"Fall 2022", desc:"Electrical engineering fundamentals: circuit analysis, electronic design, and the application of linear-system principles in biomedical instrumentation contexts.", tags:["Circuits","EE","Analysis"] },
  { num:"06", code:"Article", cat:"Article", catLabel:"Published", title:"Golf Performance — 3D PCA via OpenCap", file:"golfreport.pdf", semester:"2025", desc:"Published journal article: golf-swing performance analysis using OpenCap markerless motion capture and 3D principal-component analysis. Quantifies swing-plane variance across skill levels.", tags:["Biomech","PCA","Motion-capture"] }
];

const REPORT_TAKEAWAYS = [
  "Explore how joint loads and material constraints inform implant design.",
  "Follow the design tradeoffs and validation process behind a biomedical system.",
  "Explore how sensing, calibration, and characterization support biomaterial measurement.",
  "Follow a design problem from ideation through prototyping and validation.",
  "Connect circuit-analysis principles to biomedical instrumentation.",
  "Explore how markerless motion capture and PCA can describe golf-swing variation."
];
const $ = (s) => document.querySelector(s);
const sidebar = $('#sidebar');
const dotsWrap = $('#dots');
let visible = REPORTS.slice();
let currentIdx = 0;

function renderSidebar() {
  sidebar.querySelectorAll('.report-card').forEach(el => el.remove());
  visible.forEach((r, i) => {
    const btn = document.createElement('button');
    btn.className = 'report-card' + (i === currentIdx ? ' active' : '');
    btn.setAttribute('aria-pressed', String(i === currentIdx));
    btn.innerHTML = `<div class="rc-row1"><span class="rc-num">${r.num}</span><span class="rc-tag">${r.code}</span></div><div class="rc-title">${r.title}</div><div class="rc-meta">${r.semester} · ${r.catLabel}</div>`;
    btn.addEventListener('click', () => goTo(i));
    sidebar.appendChild(btn);
  });
  $('#sidebarTotal').textContent = String(visible.length).padStart(2,'0');
  $('#totIdx').textContent = visible.length;
  $('#viewingCount').textContent = String(visible.length).padStart(2,'0');
}
function renderDots() {
  dotsWrap.innerHTML = '';
  visible.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'dot' + (i === currentIdx ? ' active' : '');
    d.setAttribute('aria-label', visible[i].title);
    d.setAttribute('aria-pressed', String(i === currentIdx));
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  });
}
function renderStage() {
  if (!visible.length) return;
  const r = visible[currentIdx];
  $('#stageEyebrow').textContent = `${r.code} · ${r.catLabel}`;
  $('#stageTitle').textContent = r.title;
  $('#curIdx').textContent = currentIdx + 1;
  $('#prevBtn').disabled = visible.length < 2;
  $('#nextBtn').disabled = visible.length < 2;
  $('#stageDesc').textContent = r.desc;
  $('#openLink').href = r.file;
  $('#reportOverview').textContent = r.desc;
  $('#reportTakeaway').textContent = REPORT_TAKEAWAYS[REPORTS.indexOf(r)];
  $('#reportMethods').textContent = r.tags.join(' · ');
  const frame = $('#pdfFrame');
  frame.title = r.title + ' — PDF report';
  const container = $('#pdfContainer');
  if (frame.getAttribute('data-src') !== r.file) {
    frame.removeAttribute('src');
    frame.setAttribute('data-src', r.file);
    container.hidden = true;
    $('#reportPreviewToggle').setAttribute('aria-expanded', 'false');
    $('#reportPreviewToggle').textContent = 'Show embedded PDF';
  }
  const tagsWrap = $('#stageTags');
  tagsWrap.innerHTML = '';
  r.tags.forEach(t => {
    const s = document.createElement('span');
    s.className = 'stage-tag';
    s.textContent = t;
    tagsWrap.appendChild(s);
  });
  sidebar.querySelectorAll('.report-card').forEach((el, i) => {
    el.classList.toggle('active', i === currentIdx);
    el.setAttribute('aria-pressed', String(i === currentIdx));
  });
  dotsWrap.querySelectorAll('.dot').forEach((el, i) => {
    el.classList.toggle('active', i === currentIdx);
    el.setAttribute('aria-pressed', String(i === currentIdx));
  });
}
function goTo(i) { if (!visible.length) return; currentIdx = (i + visible.length) % visible.length; renderStage(); }

$('#prevBtn').addEventListener('click', () => goTo(currentIdx - 1));
$('#nextBtn').addEventListener('click', () => goTo(currentIdx + 1));
document.querySelectorAll('.toc-chip').forEach(chip => {
  chip.setAttribute('aria-pressed', String(chip.classList.contains('active')));
  chip.addEventListener('click', () => {
    document.querySelectorAll('.toc-chip').forEach(c => {
      c.classList.remove('active');
      c.setAttribute('aria-pressed', 'false');
    });
    chip.classList.add('active');
    chip.setAttribute('aria-pressed', 'true');
    const f = chip.dataset.filter;
    visible = (f === 'all') ? REPORTS.slice() : REPORTS.filter(r => r.cat === f);
    currentIdx = 0;
    renderSidebar(); renderDots(); renderStage();
  });
});

renderSidebar(); renderDots(); renderStage();

$('#reportPreviewToggle').addEventListener('click', () => {
  const container = $('#pdfContainer');
  container.hidden = !container.hidden;
  $('#reportPreviewToggle').setAttribute('aria-expanded', String(!container.hidden));
  $('#reportPreviewToggle').textContent = container.hidden ? 'Show embedded PDF' : 'Hide embedded PDF';
  const frame = $('#pdfFrame');
  if (!container.hidden && !frame.getAttribute('src')) frame.src = frame.getAttribute('data-src') + '#view=FitH&toolbar=0';
});
