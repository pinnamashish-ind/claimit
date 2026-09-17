/**
 * CLAIMIT - Applications Tracking Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("applications-list");
  const filterTabs = document.querySelectorAll(".filter-tab");
  let activeFilter = "ALL";

  function renderList() {
    const list = ClaimItApi.getStoredApplications();

    const filtered = list.filter(item => {
      if (activeFilter === "ALL") return true;
      return item.status === activeFilter;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="card" style="text-align:center; padding:48px;">
          <div style="font-size:36px; margin-bottom:12px;">📁</div>
          <h4 style="font-size:18px; font-weight:700;">No applications in this category</h4>
          <p style="font-size:14px; color:var(--text-dim); margin-top:4px;">Browse schemes to start tracking your public benefit claims.</p>
          <a href="schemes.html" class="btn btn-primary btn-sm" style="margin-top:16px;">Browse Schemes &rarr;</a>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map((item, idx) => {
      const s = item.scheme || { title: "Government Scheme", category: "Welfare" };
      let badgeClass = "badge-interested";
      if (item.status === "Application Started") badgeClass = "badge-started";
      if (item.status === "Submitted") badgeClass = "badge-submitted";
      if (item.status === "Approved") badgeClass = "badge-approved";
      if (item.status === "Rejected") badgeClass = "badge-rejected";

      return `
        <div class="card" style="padding:20px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px;">
            <div>
              <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">
                <span class="category-tag">${s.category || 'Education'}</span>
                <span class="badge ${badgeClass}">${item.status}</span>
              </div>
              <h3 style="font-size:18px; font-weight:700; color:var(--primary-900);">
                ${s.title}
              </h3>
              <div style="font-size:13px; color:var(--text-dim); margin-top:4px;">
                ${item.referenceNumber ? `Ack / Ref Number: <strong>${item.referenceNumber}</strong>` : 'No official reference filed yet'}
                ${item.appliedDate ? ` &nbsp;•&nbsp; Updated: ${item.appliedDate}` : ''}
              </div>
            </div>

            <!-- Status Changer -->
            <div style="display:flex; align-items:center; gap:10px;">
              <select class="filter-select status-dropdown" data-id="${item.id}" style="font-size:13px;">
                <option value="Interested" ${item.status === 'Interested' ? 'selected' : ''}>Interested</option>
                <option value="Application Started" ${item.status === 'Application Started' ? 'selected' : ''}>Application Started</option>
                <option value="Submitted" ${item.status === 'Submitted' ? 'selected' : ''}>Submitted</option>
                <option value="Approved" ${item.status === 'Approved' ? 'selected' : ''}>Approved</option>
              </select>
              <a href="scheme-details.html?id=${s.id || 1}" class="btn btn-outline btn-sm">
                View Checklist &rarr;
              </a>
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Wire status changers
    document.querySelectorAll(".status-dropdown").forEach(sel => {
      sel.addEventListener("change", (e) => {
        const id = parseInt(e.target.getAttribute("data-id"));
        const newStatus = e.target.value;
        const currentList = ClaimItApi.getStoredApplications();
        const target = currentList.find(a => a.id === id);
        if (target) {
          target.status = newStatus;
          if (newStatus === "Submitted" && !target.referenceNumber) {
            target.referenceNumber = "CLM-ACK-" + Math.floor(100000 + Math.random() * 900000);
          }
          target.appliedDate = new Date().toISOString().split("T")[0];
          localStorage.setItem("claimit_applications", JSON.stringify(currentList));
          showToast(`Application status updated to "${newStatus}"`, "success");
          renderList();
        }
      });
    });
  }

  filterTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      filterTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      activeFilter = tab.getAttribute("data-status");
      renderList();
    });
  });

  renderList();
});
