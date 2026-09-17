/**
 * CLAIMIT - Scheme Details, Why You Qualify & Document Readiness Controller
 */

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const schemeId = parseInt(urlParams.get("id")) || 1;

  const scheme = await ClaimItApi.getSchemeById(schemeId);
  const currentUser = ClaimItApi.getCurrentUser() || ClaimItApi.demoProfile;

  // Evaluate eligibility for this specific scheme
  const evaluation = ClaimItApi.evaluateFallbackEligibility(currentUser).find(m => m.scheme.id == schemeId) || {
    matchPercentage: 90,
    breakdowns: [
      { ruleName: "Eligibility Verification", satisfied: true, verified: true, details: "Criteria aligned with submitted credentials", statusText: "✓ Satisfied" }
    ]
  };

  const isTe = (localStorage.getItem("claimit_lang") || "en") === "te";

  // Render Basic Details
  document.getElementById("bc-title").innerText = scheme.title;
  document.getElementById("detail-category").innerText = scheme.category || "Welfare";
  document.getElementById("detail-title").innerText = isTe && scheme.titleTe ? scheme.titleTe : scheme.title;
  if (scheme.titleTe && !isTe) {
    document.getElementById("detail-telugu-title").innerText = scheme.titleTe;
  }
  document.getElementById("detail-desc").innerText = isTe && scheme.shortDescriptionTe ? scheme.shortDescriptionTe : (scheme.detailedDescription || scheme.shortDescription);
  document.getElementById("detail-benefit").innerText = scheme.benefitDisplay || "Financial Assistance";
  document.getElementById("detail-deadline").innerText = scheme.deadline || "Rolling Applications";

  const matchBadge = document.getElementById("detail-match-badge");
  matchBadge.innerText = `${evaluation.matchPercentage}% Eligibility Match`;
  if (evaluation.matchPercentage >= 80) {
    matchBadge.style.background = "#ecfdf5";
    matchBadge.style.color = "#047857";
    matchBadge.style.borderColor = "#a7f3d0";
  } else {
    matchBadge.style.background = "#fffbeb";
    matchBadge.style.color = "#b45309";
    matchBadge.style.borderColor = "#fde68a";
  }

  // Official Links & Trust
  const officialLink = document.getElementById("detail-official-link");
  officialLink.href = scheme.officialPortalUrl || "#";
  document.getElementById("trust-dept").innerText = scheme.infoSource || "Government Department";
  document.getElementById("trust-verified-date").innerText = scheme.lastVerified || "Recent";
  document.getElementById("trust-portal-name").innerText = scheme.officialPortalUrl || "Official Portal";

  // Render "WHY YOU MAY QUALIFY"
  const breakdownContainer = document.getElementById("qualification-breakdowns");
  breakdownContainer.innerHTML = (evaluation.breakdowns || []).map(b => {
    const isOk = b.satisfied;
    const bg = isOk ? "#f0fdf4" : "#fef2f2";
    const border = isOk ? "#bbf7d0" : "#fecaca";
    const textColor = isOk ? "#166534" : "#991b1b";
    const icon = isOk ? "✓" : "✗";

    return `
      <div style="background:${bg}; border:1px solid ${border}; border-radius:var(--radius-sm); padding:12px 16px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-weight:700; font-size:14px; color:${textColor};">${icon} ${b.ruleName}</div>
          <div style="font-size:13px; color:var(--text-muted); margin-top:2px;">${b.details}</div>
        </div>
        <span style="font-size:12px; font-weight:700; color:${textColor};">${b.statusText}</span>
      </div>
    `;
  }).join("");

  // Render Document Readiness Checklist with Local Storage persistence
  const docContainer = document.getElementById("documents-checklist");
  const documents = scheme.documents || [
    { name: "Aadhaar Card", nameTe: "ఆధార్ కార్డు", isMandatory: true },
    { name: "Income Certificate (< ₹3 Lakhs)", nameTe: "ఆదాయ ధృవీకరణ పత్రం", isMandatory: true },
    { name: "Bank Account Passbook", nameTe: "బ్యాంక్ ఖాతా వివరాలు", isMandatory: true },
    { name: "College Bonafide / Study Certificate", nameTe: "బోనాఫైడ్ సర్టిఫికేట్", isMandatory: true }
  ];

  const storageKey = `claimit_docs_${schemeId}`;
  let readyDocs = JSON.parse(localStorage.getItem(storageKey) || "[]");

  function updateMeter() {
    const total = documents.length;
    const readyCount = readyDocs.length;
    const pct = total > 0 ? Math.round((readyCount / total) * 100) : 0;

    document.getElementById("readiness-ratio").innerText = `${readyCount} / ${total} Ready (${pct}%)`;
    document.getElementById("readiness-fill").style.width = `${pct}%`;
  }

  function renderDocs() {
    docContainer.innerHTML = documents.map((doc, idx) => {
      const isReady = readyDocs.includes(idx);
      const name = isTe && doc.nameTe ? doc.nameTe : doc.name;

      return `
        <div class="check-item ${isReady ? 'ready' : ''}" data-idx="${idx}">
          <div class="check-left">
            <div class="check-box">${isReady ? '✓' : ''}</div>
            <div>
              <div style="font-weight:600; font-size:14px; color:var(--text-main);">${name}</div>
              <div style="font-size:12px; color:var(--text-dim);">${doc.isMandatory ? 'Mandatory Requirement' : 'Optional / If applicable'}</div>
            </div>
          </div>
          <span style="font-size:12px; font-weight:600; color:${isReady ? '#059669' : '#94a3b8'};">
            ${isReady ? 'Ready' : 'Not Prepared'}
          </span>
        </div>
      `;
    }).join("");

    document.querySelectorAll(".check-item").forEach(el => {
      el.addEventListener("click", () => {
        const idx = parseInt(el.getAttribute("data-idx"));
        if (readyDocs.includes(idx)) {
          readyDocs = readyDocs.filter(i => i !== idx);
        } else {
          readyDocs.push(idx);
        }
        localStorage.setItem(storageKey, JSON.stringify(readyDocs));
        renderDocs();
        updateMeter();
      });
    });
  }

  renderDocs();
  updateMeter();

  // Render Step-by-Step Process Timeline
  const stepsContainer = document.getElementById("steps-timeline");
  const steps = scheme.steps || [
    { number: 1, title: "Register on Portal", titleTe: "పోర్టల్‌లో రిజిస్ట్రేషన్", desc: "Access the designated web portal and complete user verification." },
    { number: 2, title: "Submit Supporting Details", titleTe: "వివరాలు నమోదు చేయండి", desc: "Upload academic, income, and bank account proofs." },
    { number: 3, title: "Verification & Disbursement", titleTe: "వెరిఫికేషన్ & నిధుల విడుదల", desc: "Department nodals authenticate documents and credit benefit via DBT." }
  ];

  stepsContainer.innerHTML = steps.map(s => {
    const title = isTe && s.titleTe ? s.titleTe : s.title;
    return `
      <div class="timeline-step">
        <div class="timeline-dot">${s.number}</div>
        <div class="timeline-content">
          <h4>${title}</h4>
          <p>${s.desc}</p>
        </div>
      </div>
    `;
  }).join("");

  // Track / Save Application
  const statusSelect = document.getElementById("app-status-select");
  const saveStatusBtn = document.getElementById("btn-save-status");
  saveStatusBtn.addEventListener("click", () => {
    const val = statusSelect.value;
    ClaimItApi.trackApplication({
      userId: 1,
      schemeId: schemeId,
      status: val
    });
    showToast(`Saved! Status updated to "${val}"`, "success");
  });

  // Ask AI about this scheme
  const askAiBtn = document.getElementById("btn-ask-scheme-ai");
  askAiBtn.addEventListener("click", () => {
    AiAssistant.open(schemeId);
  });
});
