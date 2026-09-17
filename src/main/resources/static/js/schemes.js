/**
 * CLAIMIT - Schemes Discovery & Matching List Controller
 */

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("schemes-grid");
  const banner = document.getElementById("results-banner");
  const bannerCount = document.getElementById("banner-count");
  const searchInput = document.getElementById("search-input");
  const categoryFilter = document.getElementById("category-filter");
  const matchFilter = document.getElementById("match-filter");
  const sortSelect = document.getElementById("sort-select");

  const urlParams = new URLSearchParams(window.location.search);
  const isDemo = urlParams.get("mode") === "demo";
  const isMatched = urlParams.get("matched") === "true";

  let currentUser = ClaimItApi.getCurrentUser();
  if (isDemo || (!currentUser && isMatched)) {
    currentUser = ClaimItApi.demoProfile;
    ClaimItApi.setCurrentUser(currentUser);
  }

  let rawResults = [];

  async function loadData() {
    if (currentUser) {
      banner.style.display = "flex";
      rawResults = await ClaimItApi.checkEligibility(currentUser);
      bannerCount.innerText = `${rawResults.length} Schemes Evaluated`;
    } else {
      banner.style.display = "none";
      const list = await ClaimItApi.getSchemes();
      rawResults = list.map(s => ({
        scheme: s,
        matchPercentage: 80,
        qualificationStatus: "Public Benefit",
        potentialBenefitFormatted: s.benefitDisplay,
        breakdowns: [
          { ruleName: "Eligibility", satisfied: true, verified: true, details: "Open for public welfare application", statusText: "✓ Available" }
        ]
      }));
    }
    renderGrid();
  }

  function renderGrid() {
    const isTe = (localStorage.getItem("claimit_lang") || "en") === "te";
    const q = searchInput.value.toLowerCase().trim();
    const cat = categoryFilter.value;
    const match = matchFilter.value;
    const sort = sortSelect.value;

    let filtered = rawResults.filter(item => {
      const s = item.scheme;
      const title = (isTe && s.titleTe ? s.titleTe : s.title).toLowerCase();
      const desc = (isTe && s.shortDescriptionTe ? s.shortDescriptionTe : s.shortDescription).toLowerCase();
      const category = (s.category || "").toLowerCase();

      // Search
      if (q && !title.includes(q) && !desc.includes(q) && !category.includes(q)) {
        return false;
      }

      // Category
      if (cat !== "ALL" && s.category && !s.category.equalsIgnoreCase(cat)) {
        if (cat.toLowerCase() !== (s.category || "").toLowerCase()) return false;
      }

      // Match filter
      if (match === "STRONG" && item.matchPercentage < 80) return false;
      if (match === "POTENTIAL" && item.matchPercentage < 60) return false;

      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (sort === "MATCH") return b.matchPercentage - a.matchPercentage;
      if (sort === "DEADLINE") {
        if (!a.scheme.deadline) return 1;
        if (!b.scheme.deadline) return -1;
        return a.scheme.deadline.localeCompare(b.scheme.deadline);
      }
      if (sort === "AMOUNT") {
        const amtA = a.scheme.maxBenefitAmount || 0;
        const amtB = b.scheme.maxBenefitAmount || 0;
        return amtB - amtA;
      }
      return 0;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding:48px; background:#fff; border:1px dashed var(--border-color); border-radius:var(--radius-lg);">
          <div style="font-size:36px; margin-bottom:12px;">🔍</div>
          <h4 style="font-size:18px; font-weight:700;">No matching benefits found</h4>
          <p style="font-size:14px; color:var(--text-dim); margin-top:4px;">Try clearing filters or updating your profile information.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(item => {
      const s = item.scheme;
      const title = isTe && s.titleTe ? s.titleTe : s.title;
      const desc = isTe && s.shortDescriptionTe ? s.shortDescriptionTe : s.shortDescription;
      const matchScore = item.matchPercentage;

      let badgeColor = "#047857";
      let badgeBg = "#ecfdf5";
      let badgeBorder = "#a7f3d0";
      if (matchScore < 80) {
        badgeColor = "#b45309";
        badgeBg = "#fffbeb";
        badgeBorder = "#fde68a";
      }

      const satisfiedCount = (item.breakdowns || []).filter(b => b.satisfied).length;
      const totalRules = (item.breakdowns || []).length;

      return `
        <div class="scheme-card">
          <div>
            <div class="scheme-card-header">
              <span class="category-tag">${s.category || 'Welfare'}</span>
              <span style="background:${badgeBg}; color:${badgeColor}; border:1px solid ${badgeBorder}; padding:3px 10px; border-radius:9999px; font-size:12px; font-weight:800;">
                ${matchScore}% Match
              </span>
            </div>

            <h3>${title}</h3>
            <p class="desc">${desc}</p>

            <div class="scheme-meta-box">
              <div class="meta-row">
                <span class="meta-label">Benefit:</span>
                <span class="meta-val green">${s.benefitDisplay || 'Financial Grant'}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Deadline:</span>
                <span class="meta-val">${s.deadline ? formatDate(s.deadline) : 'Rolling Admissions'}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Criteria Met:</span>
                <span class="meta-val">${satisfiedCount} of ${totalRules} Conditions</span>
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; margin-top:16px;">
            <button class="btn btn-outline btn-sm" onclick="trackQuick(${s.id})">
              📌 Track
            </button>
            <a href="scheme-details.html?id=${s.id}" class="btn btn-primary btn-sm">
              ${isTe ? 'పూర్తి వివరాలు & చెక్‌లిస్ట్ &rarr;' : 'View Details & Checklist &rarr;'}
            </a>
          </div>
        </div>
      `;
    }).join("");
  }

  function formatDate(dStr) {
    try {
      const d = new Date(dStr);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dStr;
    }
  }

  window.trackQuick = (id) => {
    ClaimItApi.trackApplication({
      userId: 1,
      schemeId: id,
      status: "Interested"
    });
    showToast("📌 Saved to your tracked applications list!", "success");
  };

  searchInput.addEventListener("input", renderGrid);
  categoryFilter.addEventListener("change", renderGrid);
  matchFilter.addEventListener("change", renderGrid);
  sortSelect.addEventListener("change", renderGrid);

  window.addEventListener("claimit_lang_change", renderGrid);

  await loadData();
});
