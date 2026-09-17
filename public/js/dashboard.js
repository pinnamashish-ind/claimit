/**
 * CLAIMIT - Dashboard View Controller
 */

document.addEventListener("DOMContentLoaded", async () => {
  const currentUser = ClaimItApi.getCurrentUser() || ClaimItApi.demoProfile;
  const userNameElem = document.getElementById("dash-user-name");
  userNameElem.innerText = currentUser.fullName || "Citizen";

  const isTe = (localStorage.getItem("claimit_lang") || "en") === "te";

  // Fetch or calculate dashboard data
  const data = await ClaimItApi.getUserDashboard(currentUser.id || 1);

  // Set metric counters
  document.getElementById("metric-benefits-count").innerText = data.potentialBenefitsCount || 8;
  document.getElementById("metric-strong-matches").innerText = data.strongMatchesCount || 4;
  document.getElementById("metric-total-value").innerText = data.totalPotentialBenefitFormatted || "₹75,000+";
  document.getElementById("metric-apps-count").innerText = data.applicationsStartedCount || 3;

  // Render Top Matches
  const topMatchesContainer = document.getElementById("dash-top-matches");
  const matches = data.topMatches || [];

  if (matches.length === 0) {
    topMatchesContainer.innerHTML = `<div class="card"><p style="color:var(--text-dim);">No matches yet. Complete your profile to discover benefits.</p></div>`;
  } else {
    topMatchesContainer.innerHTML = matches.map(m => {
      const s = m.scheme;
      const title = isTe && s.titleTe ? s.titleTe : s.title;
      const score = m.matchPercentage;
      const isStrong = score >= 80;

      return `
        <div class="card" style="padding:18px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="category-tag">${s.category || 'Education'}</span>
              <span style="background:${isStrong ? '#ecfdf5' : '#fffbeb'}; color:${isStrong ? '#047857' : '#b45309'}; border:1px solid ${isStrong ? '#a7f3d0' : '#fde68a'}; padding:2px 8px; border-radius:9999px; font-size:11px; font-weight:800;">
                ${score}% Match
              </span>
            </div>
            <span style="font-weight:700; color:#047857; font-size:14px;">${s.benefitDisplay || ''}</span>
          </div>

          <h4 style="font-size:16px; font-weight:700; color:var(--primary-900); margin-bottom:6px;">
            <a href="scheme-details.html?id=${s.id}">${title}</a>
          </h4>
          <p style="font-size:13px; color:var(--text-muted); margin-bottom:12px;">
            ${s.shortDescription || ''}
          </p>

          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:12px; color:var(--text-dim);">
              Deadline: <strong>${s.deadline || 'Rolling'}</strong>
            </span>
            <a href="scheme-details.html?id=${s.id}" class="btn btn-outline btn-sm">
              Check Readiness &rarr;
            </a>
          </div>
        </div>
      `;
    }).join("");
  }

  // Render Notifications & Deadlines
  const notifsContainer = document.getElementById("dash-notifications");
  const notifs = [
    { title: "Telangana ePASS Post-Matric Deadline", date: "31 Oct 2026", daysLeft: "44 days left", urgent: true },
    { title: "Central Sector Scholarship Verification", date: "15 Oct 2026", daysLeft: "28 days left", urgent: true },
    { title: "PM Kaushal Vikas Yojana Enrollment", date: "30 Oct 2026", daysLeft: "43 days left", urgent: false }
  ];

  notifsContainer.innerHTML = notifs.map(n => `
    <div style="background:#ffffff; border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:14px 16px; border-left:4px solid ${n.urgent ? 'var(--accent-amber)' : 'var(--primary-600)'};">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h5 style="font-size:14px; font-weight:700; color:var(--primary-900);">${n.title}</h5>
        <span style="font-size:11px; font-weight:700; color:${n.urgent ? '#b45309' : '#1e40af'}; background:${n.urgent ? '#fffbeb' : '#eff6ff'}; padding:2px 8px; border-radius:9999px;">
          ${n.daysLeft}
        </span>
      </div>
      <p style="font-size:12px; color:var(--text-dim); margin-top:4px;">Official Portal closing date: ${n.date}</p>
    </div>
  `).join("");
});
