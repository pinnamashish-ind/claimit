/**
 * CLAIMIT (నా హక్కు) - Main Utilities & API Client
 */

const API_BASE = "/api";

const ClaimItApi = {
  // Demo User profile data
  demoProfile: {
    fullName: "Demo Student",
    email: "demo.student@claimit.org",
    phone: "+91 98765 43210",
    age: 20,
    gender: "Male",
    state: "Telangana",
    district: "Hyderabad",
    occupation: "Student",
    educationLevel: "Undergraduate",
    annualIncome: 250000,
    category: "OBC",
    hasDisability: false,
    employmentStatus: "Unemployed",
    institutionName: "Osmania University College of Engineering",
    course: "B.Tech Computer Science",
    studyYear: 3,
    cgpa: 8.20,
    isDemo: true
  },

  async getSchemes() {
    try {
      const res = await fetch(`${API_BASE}/schemes`);
      if (!res.ok) throw new Error("Failed to fetch schemes");
      return await res.json();
    } catch (err) {
      console.warn("Using fallback local dataset:", err);
      return this.getFallbackSchemes();
    }
  },

  async getSchemeById(id) {
    try {
      const res = await fetch(`${API_BASE}/schemes/${id}`);
      if (!res.ok) throw new Error("Scheme not found");
      return await res.json();
    } catch (err) {
      console.warn("Using fallback scheme lookup:", err);
      const list = this.getFallbackSchemes();
      return list.find(s => s.id == id) || list[0];
    }
  },

  async checkEligibility(profileData) {
    try {
      const res = await fetch(`${API_BASE}/eligibility/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData)
      });
      if (!res.ok) throw new Error("Eligibility check failed");
      return await res.json();
    } catch (err) {
      console.warn("Evaluating fallback eligibility engine in browser:", err);
      return this.evaluateFallbackEligibility(profileData);
    }
  },

  async saveUserProfile(profileData) {
    try {
      const res = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData)
      });
      if (!res.ok) throw new Error("Could not save profile");
      const saved = await res.json();
      localStorage.setItem("claimit_user", JSON.stringify(saved));
      return saved;
    } catch (err) {
      console.warn("Saving profile in local storage:", err);
      const simulated = { id: 1, ...profileData };
      localStorage.setItem("claimit_user", JSON.stringify(simulated));
      return simulated;
    }
  },

  async getUserDashboard(userId) {
    try {
      const res = await fetch(`${API_BASE}/users/${userId}/dashboard`);
      if (!res.ok) throw new Error("Dashboard fetch failed");
      return await res.json();
    } catch (err) {
      console.warn("Using local dashboard metrics calculation:", err);
      const user = this.getCurrentUser() || this.demoProfile;
      const matches = this.evaluateFallbackEligibility(user);
      const apps = this.getStoredApplications();
      return {
        userName: user.fullName || "Valued Citizen",
        potentialBenefitsCount: matches.length,
        strongMatchesCount: matches.filter(m => m.matchPercentage >= 80).length,
        applicationsStartedCount: apps.length,
        upcomingDeadlinesCount: 3,
        totalPotentialBenefitFormatted: "₹75,000+",
        topMatches: matches.slice(0, 6),
        userApplications: apps,
        notifications: [
          { id: 1, title: "Upcoming Deadline: ePASS Scholarship", message: "Telangana Post-Matric scholarship deadline on 31 Oct 2026. Complete college sign-off.", type: "deadline" },
          { id: 2, title: "Personalized Matches Identified", message: "8 schemes currently align with your educational and domicile profile.", type: "match" }
        ]
      };
    }
  },

  async trackApplication(appData) {
    try {
      const res = await fetch(`${API_BASE}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appData)
      });
      if (!res.ok) throw new Error("Application save failed");
      return await res.json();
    } catch (err) {
      console.warn("Tracking application in local storage:", err);
      return this.storeLocalApplication(appData);
    }
  },

  async askAi(question, schemeId) {
    const lang = localStorage.getItem("claimit_lang") || "en";
    try {
      const res = await fetch(`${API_BASE}/ai/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, schemeId, language: lang })
      });
      if (!res.ok) throw new Error("AI request failed");
      return await res.json();
    } catch (err) {
      // Return rule-grounded response
      const isTe = lang === 'te' || question.includes('తెలుగు');
      let answer = isTe 
        ? "మీరు అడిగిన ప్రశ్నకు ధన్యవాదాలు. క్లెయిమ్‌ఇట్ ఇంజిన్ మీ అర్హతలను మరియు అవసరమైన పత్రాలను అధికారిక మార్గదర్శకాల ప్రకారం సరిపోల్చి సురక్షితంగా మార్గదర్శనం చేస్తుంది."
        : "Thank you for asking! ClaimIt automatically cross-references your profile credentials with verified scheme eligibility requirements to ensure you never miss benefits you deserve.";
      return { answer, language: lang, simulated: true };
    }
  },

  getCurrentUser() {
    const saved = localStorage.getItem("claimit_user");
    return saved ? JSON.parse(saved) : null;
  },

  setCurrentUser(user) {
    localStorage.setItem("claimit_user", JSON.stringify(user));
    this.renderAuthNav();
  },

  async login(payload) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.user) {
        this.setCurrentUser(data.user);
        if (data.token) localStorage.setItem("claimit_token", data.token);
      }
      return data;
    } catch (err) {
      console.warn("Using offline auth login:", err);
      const user = { ...this.demoProfile, fullName: payload.identifier || "Citizen" };
      this.setCurrentUser(user);
      return { success: true, user, token: "claimit-local-token" };
    }
  },

  async register(payload) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.user) {
        this.setCurrentUser(data.user);
        if (data.token) localStorage.setItem("claimit_token", data.token);
      }
      return data;
    } catch (err) {
      console.warn("Using offline registration:", err);
      const user = { ...this.demoProfile, fullName: payload.fullName || "Citizen", email: payload.email };
      this.setCurrentUser(user);
      return { success: true, user, token: "claimit-local-token" };
    }
  },

  async sendOtp(identifier) {
    try {
      const res = await fetch(`${API_BASE}/auth/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier })
      });
      return await res.json();
    } catch (err) {
      return { success: true, message: "A 6-digit OTP has been sent. Use test code 123456.", demoOtp: "123456" };
    }
  },

  async verifyOtp(identifier, otp) {
    try {
      const res = await fetch(`${API_BASE}/auth/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, otp })
      });
      const data = await res.json();
      if (data.success && data.user) {
        this.setCurrentUser(data.user);
        if (data.token) localStorage.setItem("claimit_token", data.token);
      }
      return data;
    } catch (err) {
      if (otp === "123456") {
        const user = this.demoProfile;
        this.setCurrentUser(user);
        return { success: true, user, token: "claimit-local-token" };
      }
      return { success: false, message: "Invalid OTP. Use test code 123456." };
    }
  },

  async loginDemoPersona(personaKey) {
    try {
      const res = await fetch(`${API_BASE}/auth/demo-login?persona=${encodeURIComponent(personaKey)}`, {
        method: "POST"
      });
      const data = await res.json();
      if (data.success && data.user) {
        this.setCurrentUser(data.user);
        if (data.token) localStorage.setItem("claimit_token", data.token);
      }
      return data;
    } catch (err) {
      const user = { ...this.demoProfile, role: personaKey };
      this.setCurrentUser(user);
      return { success: true, user };
    }
  },

  logout() {
    localStorage.removeItem("claimit_user");
    localStorage.removeItem("claimit_token");
    window.location.href = "login.html";
  },

  renderAuthNav() {
    const navActions = document.querySelector(".nav-actions");
    if (!navActions) return;

    let authContainer = navActions.querySelector(".nav-auth-container");
    if (!authContainer) {
      authContainer = document.createElement("div");
      authContainer.className = "nav-auth-container";
      navActions.appendChild(authContainer);
    }

    const user = this.getCurrentUser();
    const isTe = localStorage.getItem("claimit_lang") === "te";

    if (user && (user.fullName || user.email)) {
      const displayName = user.fullName || user.email.split("@")[0];
      authContainer.innerHTML = `
        <div class="user-nav-dropdown" style="display:flex; align-items:center; gap:8px;">
          <a href="dashboard.html" class="user-pill-badge" title="Citizen Account" style="display:flex; align-items:center; gap:6px; background:#eff6ff; border:1px solid #bfdbfe; color:#1d4ed8; padding:5px 12px; border-radius:9999px; text-decoration:none; font-size:13px; font-weight:600;">
            <span style="font-size:14px;">👤</span>
            <span style="max-width:110px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${displayName}</span>
          </a>
          <button id="navLogoutBtn" class="btn btn-outline btn-sm" title="${isTe ? 'లాగౌట్' : 'Sign Out'}" style="padding:4px 10px; font-size:12px; color:#ef4444; border-color:#fecaca;">
            ${isTe ? 'లాగౌట్' : 'Sign Out'}
          </button>
        </div>
      `;
      const logoutBtn = authContainer.querySelector("#navLogoutBtn");
      if (logoutBtn) {
        logoutBtn.onclick = (e) => {
          e.preventDefault();
          this.logout();
        };
      }
    } else {
      authContainer.innerHTML = `
        <a href="login.html" class="btn btn-outline btn-sm" style="font-weight:600; padding:6px 14px; border-color:#cbd5e1; color:var(--text-main); text-decoration:none;">
          ${isTe ? 'లాగిన్' : 'Sign In'}
        </a>
      `;
    }
  },

  getStoredApplications() {
    const apps = localStorage.getItem("claimit_applications");
    if (apps) return JSON.parse(apps);
    // Pre-seed realistic tracking
    const initial = [
      { id: 1, scheme: { title: "Telangana Post-Matric Scholarship (ePASS)", category: "Education", deadline: "2026-10-31" }, status: "Application Started", referenceNumber: "TS-EPASS-2026-98124", appliedDate: "2026-08-20" },
      { id: 2, scheme: { title: "Central Sector Scheme for College Students", category: "Education", deadline: "2026-10-15" }, status: "Submitted", referenceNumber: "NSP-CSSS-2026-4421", appliedDate: "2026-08-10" },
      { id: 3, scheme: { title: "Pradhan Mantri Kaushal Vikas Yojana (PMKVY)", category: "Skill Development", deadline: "2026-10-30" }, status: "Interested", referenceNumber: null, appliedDate: null }
    ];
    localStorage.setItem("claimit_applications", JSON.stringify(initial));
    return initial;
  },

  storeLocalApplication(appData) {
    const list = this.getStoredApplications();
    const scheme = this.getFallbackSchemes().find(s => s.id == appData.schemeId) || { title: "Government Benefit Scheme", category: "General" };
    const existingIdx = list.findIndex(a => a.scheme && a.scheme.id == appData.schemeId);
    const newEntry = {
      id: Date.now(),
      scheme: scheme,
      status: appData.status || "Interested",
      referenceNumber: appData.referenceNumber || ("CLM-" + Math.floor(100000 + Math.random() * 900000)),
      appliedDate: new Date().toISOString().split("T")[0],
      notes: appData.notes || ""
    };
    if (existingIdx >= 0) {
      list[existingIdx] = newEntry;
    } else {
      list.unshift(newEntry);
    }
    localStorage.setItem("claimit_applications", JSON.stringify(list));
    return newEntry;
  },

  // Fallback schemes dataset ensuring the UI operates smoothly even before DB is connected
  getFallbackSchemes() {
    return [
      {
        id: 1,
        code: "SCH_TS_EPASS",
        title: "Telangana Post-Matric Scholarship & Fee Reimbursement (ePASS)",
        titleTe: "తెలంగాణ పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్ మరియు ఫీజు రీయింబర్స్‌మెంట్",
        category: "Education",
        shortDescription: "Full tuition fee reimbursement and monthly maintenance allowance for undergraduate & postgraduate students in recognized institutions.",
        shortDescriptionTe: "గుర్తింపు పొందిన కళాశాలల్లో చదువుతున్న విద్యార్థులకు పూర్తి ట్యూషన్ ఫీజు రీయింబర్స్‌మెంట్ మరియు నెలవారీ భత్యం.",
        targetBeneficiaries: "Undergraduate & PG students residing in Telangana",
        benefitDisplay: "Up to ₹75,000 / year",
        deadline: "2026-10-31",
        officialPortalUrl: "https://telanganaepass.cgg.gov.in (Demo Portal Link)",
        infoSource: "Telangana State Welfare Department",
        lastVerified: "2026-08-15",
        rules: { minAge: 16, maxAge: 30, states: "Telangana", occupations: "Student", educations: "Undergraduate,Postgraduate,Diploma", maxIncome: 300000, minCgpa: 6.0 },
        documents: [
          { name: "Aadhaar Card of student and parents", nameTe: "విద్యార్థి మరియు తల్లిదండ్రుల ఆధార్ కార్డు", isMandatory: true },
          { name: "Income Certificate issued by Revenue Department", nameTe: "ఆదాయ ధృవీకరణ పత్రం (మీసేవ/MRO)", isMandatory: true },
          { name: "Aadhaar Linked Active Bank Passbook", nameTe: "బ్యాంక్ ఖాతా పాస్‌బుక్", isMandatory: true },
          { name: "College Bonafide / Study Certificate", nameTe: "బోనాఫైడ్ / స్టడీ సర్టిఫికేట్", isMandatory: true },
          { name: "Previous Academic Marks Memo", nameTe: "మునుపటి తరగతి మార్కుల మెమో", isMandatory: true }
        ],
        steps: [
          { number: 1, title: "Register on ePASS Portal", titleTe: "ePASS పోర్టల్‌లో రిజిస్ట్రేషన్ చేసుకోండి", desc: "Visit official portal and choose Post-Matric fresh/renewal option." },
          { number: 2, title: "Fill Academic & Admission Details", titleTe: "విద్యా మరియు అడ్మిషన్ వివరాలు నమోదు చేయండి", desc: "Provide CET hallticket, rank, college code and admission quota." },
          { number: 3, title: "Upload Scanned Certificates", titleTe: "ధృవీకరణ పత్రాలు అప్‌లోడ్ చేయండి", desc: "Upload clear scans of income certificate, bonafide, and passbook under 100KB." },
          { number: 4, title: "Review & Submit", titleTe: "సమీక్షించి సమర్పించండి", desc: "Verify preview, submit online form, and save your Application Reference Number." },
          { number: 5, title: "Submit Hardcopy to College", titleTe: "కళాశాలలో రశీదు సమర్పించండి", desc: "Hand over physical copy with attested documents to the college scholarship officer." }
        ]
      },
      {
        id: 2,
        code: "SCH_AICTE_PRAGATI",
        title: "AICTE Pragati Scholarship for Girl Students",
        titleTe: "బాలికల కోసం AICTE ప్రగతి స్కాలర్‌షిప్ పథకం",
        category: "Education",
        shortDescription: "Financial assistance of ₹50,000 per annum for meritorious female students enrolled in technical degree or diploma courses.",
        shortDescriptionTe: "సాంకేతిక కోర్సుల్లో ప్రవేశం పొందిన ప్రతిభావంతులైన విద్యార్థినులకు ఏడాదికి ₹50,000 ఆర్థిక సాయం.",
        targetBeneficiaries: "Female students in 1st year Degree/Diploma engineering",
        benefitDisplay: "₹50,000 / year",
        deadline: "2026-11-15",
        officialPortalUrl: "https://scholarships.gov.in (Demo Portal Link)",
        infoSource: "Ministry of Education & AICTE",
        lastVerified: "2026-08-10",
        rules: { minAge: 17, maxAge: 28, states: "All India", occupations: "Student", educations: "Undergraduate,Diploma", maxIncome: 800000, minCgpa: 6.5 },
        documents: [
          { name: "Aadhaar Card", nameTe: "ఆధార్ కార్డు", isMandatory: true },
          { name: "Income Certificate (< ₹8 Lakhs)", nameTe: "ఆదాయ ధృవీకరణ పత్రం", isMandatory: true },
          { name: "Bank Account Passbook (NPCI mapped)", nameTe: "బ్యాంక్ ఖాతా పాస్‌బుక్", isMandatory: true },
          { name: "AICTE Institution Admission Proof", nameTe: "అడ్మిషన్ ధృవీకరణ పత్రం", isMandatory: true }
        ],
        steps: [
          { number: 1, title: "National Scholarship Portal Login", titleTe: "NSP పోర్టల్ లాగిన్", desc: "Login or register on NSP using Aadhaar OTP authentication." },
          { number: 2, title: "Select AICTE Pragati Scheme", titleTe: "ప్రగతి స్కాలర్‌షిప్ ఎంచుకోండి", desc: "Fill institute AISHE code and technical course details." },
          { number: 3, title: "Upload Documents & Submit", titleTe: "పత్రాలు అప్‌లోడ్ చేసి సమర్పించండి", desc: "Submit application for institute and state nodal verification." }
        ]
      },
      {
        id: 4,
        code: "SCH_CSSS_HE",
        title: "Central Sector Scheme of Scholarships for College and University Students",
        titleTe: "కళాశాల విద్యార్థుల కోసం సెంట్రల్ సెక్టార్ స్కాలర్‌షిప్",
        category: "Education",
        shortDescription: "Financial support for top-percentile 12th pass students pursuing regular degree courses across India.",
        shortDescriptionTe: "12వ తరగతి ఉత్తీర్ణులై డిగ్రీ చదువుతున్న విద్యార్థులకు వార్షిక స్కాలర్‌షిప్.",
        targetBeneficiaries: "Meritorious undergraduate college students",
        benefitDisplay: "₹12,000 - ₹20,000 / year",
        deadline: "2026-10-15",
        officialPortalUrl: "https://scholarships.gov.in (Demo Portal Link)",
        infoSource: "Department of Higher Education, GoI",
        lastVerified: "2026-07-28",
        rules: { minAge: 17, maxAge: 25, states: "All India", occupations: "Student", educations: "Undergraduate", maxIncome: 450000, minCgpa: 7.0 },
        documents: [
          { name: "Aadhaar Card", nameTe: "ఆధార్ కార్డు", isMandatory: true },
          { name: "Income Certificate (< ₹4.5 Lakhs)", nameTe: "ఆదాయ ధృవీకరణ పత్రం", isMandatory: true },
          { name: "Class 12th Board Marksheet", nameTe: "12వ తరగతి మార్కుల మెమో", isMandatory: true },
          { name: "College Bonafide", nameTe: "బోనాఫైడ్ సర్టిఫికేట్", isMandatory: true }
        ],
        steps: [
          { number: 1, title: "Check Board Cutoff List", titleTe: "బోర్డు కటాఫ్ జాబితా పరిశీలించండి", desc: "Confirm your roll number is within top 20th percentile of 12th Board." },
          { number: 2, title: "Apply on NSP", titleTe: "NSPలో దరఖాస్తు చేసుకోండి", desc: "Complete registration with bank account details." }
        ]
      },
      {
        id: 5,
        code: "SCH_PM_KISAN",
        title: "PM-KISAN Samman Nidhi & Farmer Input Subsidy",
        titleTe: "పీఎం కిసాన్ సమ్మాన్ నిధి & రైతు పెట్టుబడి సాయం",
        category: "Agriculture",
        shortDescription: "Direct financial support of ₹6,000 to ₹10,000 per year directly transferred to bank accounts of farmer families in three installments.",
        shortDescriptionTe: "రైతు కుటుంబాలకు పంట పెట్టుబడి కోసం బ్యాంకు ఖాతాల్లోకి ఏడాదికి ₹6,000 నుండి ₹10,000 వరకు ఆర్థిక సాయం.",
        targetBeneficiaries: "Small and marginal farmers with cultivable landholding",
        benefitDisplay: "₹6,000 - ₹10,000 / year",
        deadline: "2026-12-31",
        officialPortalUrl: "https://pmkisan.gov.in (Demo Portal Link)",
        infoSource: "Ministry of Agriculture and Farmers Welfare",
        lastVerified: "2026-08-12",
        rules: { minAge: 18, maxAge: 75, states: "All India", occupations: "Farmer", educations: "All", maxIncome: 500000 },
        documents: [
          { name: "Farmer Aadhaar Card", nameTe: "రైతు ఆధార్ కార్డు", isMandatory: true },
          { name: "Pattadar Land Passbook / ROR", nameTe: "పట్టాదారు పాస్‌బుక్", isMandatory: true },
          { name: "NPCI Enabled Bank Passbook", nameTe: "బ్యాంక్ ఖాతా వివరాలు", isMandatory: true }
        ],
        steps: [
          { number: 1, title: "Farmer Corner Registration", titleTe: "రైతు పోర్టల్ నమోదు", desc: "Enter Aadhaar number and mobile OTP to start verification." },
          { number: 2, title: "Enter Land Khata & Survey Number", titleTe: "భూమి సర్వే వివరాలు నమోదు", desc: "Provide district, sub-district, village and land ownership details." },
          { number: 3, title: "Biometric e-KYC", titleTe: "బయోమెట్రిక్ e-KYC పూర్తి చేయండి", desc: "Complete online OTP or CSC biometric KYC to activate payment cycle." }
        ]
      },
      {
        id: 7,
        code: "SCH_PMEGP",
        title: "Prime Minister Employment Generation Programme (PMEGP)",
        titleTe: "ప్రధాన మంత్రి ఉపాధి కల్పన కార్యక్రమం (PMEGP)",
        category: "Entrepreneurship",
        shortDescription: "Credit-linked capital subsidy offering 15% to 35% margin money assistance on bank-financed micro-enterprises up to ₹50 Lakhs.",
        shortDescriptionTe: "నూతన వ్యాపారం లేదా చిన్న పరిశ్రమ స్థాపనకు 15% నుండి 35% వరకు సబ్సిడీతో కూడిన రుణం.",
        targetBeneficiaries: "Aspiring entrepreneurs and educated unemployed youth aged 18+",
        benefitDisplay: "Up to ₹5,00,000 Margin Subsidy",
        deadline: "2026-12-15",
        officialPortalUrl: "https://www.kviconline.gov.in (Demo Portal Link)",
        infoSource: "Khadi & Village Industries Commission (KVIC)",
        lastVerified: "2026-08-05",
        rules: { minAge: 18, maxAge: 55, states: "All India", occupations: "Entrepreneur,Job Seeker,Other", educations: "All", maxIncome: 1000000 },
        documents: [
          { name: "Aadhaar Card & PAN", nameTe: "ఆధార్ & పాన్ కార్డు", isMandatory: true },
          { name: "Project Business Report (DPR)", nameTe: "ప్రాజెక్ట్ రిపోర్ట్", isMandatory: true },
          { name: "Qualification Certificate", nameTe: "విద్యార్హత సర్టిఫికేట్", isMandatory: true },
          { name: "EDP Training Certificate", nameTe: "EDP శిక్షణ పత్రం", isMandatory: false }
        ],
        steps: [
          { number: 1, title: "Submit Online Application on KVIC", titleTe: "KVIC పోర్టల్‌లో దరఖాస్తు", desc: "Select agency (DIC / KVIC) and financing bank branch." },
          { number: 2, title: "Bank Appraisal & Sanction", titleTe: "బ్యాంకు ఆమోదం", desc: "Bank reviews project viability and sanctions loan with subsidy claim." }
        ]
      },
      {
        id: 9,
        code: "SCH_PMKVY",
        title: "Pradhan Mantri Kaushal Vikas Yojana 4.0 (PMKVY)",
        titleTe: "ప్రధాన మంత్రి కౌశల్ వికాస్ యోజన 4.0 (నైపుణ్యాభివృద్ధి)",
        category: "Skill Development",
        shortDescription: "Industry-aligned, accredited free skill certification courses in cutting-edge domains with daily conveyance stipend, insurance, and job fairs.",
        shortDescriptionTe: "యువతకు ఉచిత సాంకేతిక నైపుణ్య శిక్షణ, సర్టిఫికేషన్ మరియు ఉద్యోగ సహాయం.",
        targetBeneficiaries: "Youth and job seekers aged 15-45 looking for employment skills",
        benefitDisplay: "Free Training + ₹8,000 Stipend",
        deadline: "2026-10-30",
        officialPortalUrl: "https://www.pmkvyofficial.org (Demo Portal Link)",
        infoSource: "National Skill Development Corporation (NSDC)",
        lastVerified: "2026-08-18",
        rules: { minAge: 15, maxAge: 45, states: "All India", occupations: "Job Seeker,Student,Other", educations: "All", maxIncome: 500000 },
        documents: [
          { name: "Aadhaar Card", nameTe: "ఆధార్ కార్డు", isMandatory: true },
          { name: "Aadhaar-seeded Bank Passbook", nameTe: "బ్యాంక్ ఖాతా వివరాలు", isMandatory: true },
          { name: "Highest Education Proof", nameTe: "విద్యార్హత పత్రం", isMandatory: true }
        ],
        steps: [
          { number: 1, title: "Find Local Skill Training Center", titleTe: "సమీప శిక్షణా కేంద్రాన్ని ఎంచుకోండి", desc: "Browse accredited centers offering courses in robotics, IT, and healthcare." },
          { number: 2, title: "Enroll & Complete Skill Assessment", titleTe: "శిక్షణ పూర్తి చేయండి", desc: "Undergo practical training and earn Govt Skill Certificate." }
        ]
      }
    ];
  },

  // Fallback client-side rule evaluation matching backend algorithm exactly
  evaluateFallbackEligibility(profile) {
    const schemes = this.getFallbackSchemes();
    return schemes.map(scheme => {
      const r = scheme.rules || {};
      let score = 0;
      let total = 100;
      const breakdowns = [];

      // Occupation (25)
      if (profile.occupation && (r.occupations.includes(profile.occupation) || r.occupations === "All")) {
        score += 25;
        breakdowns.push({ ruleName: "Occupation Requirement", satisfied: true, verified: true, details: `Occupation matched: ${profile.occupation}`, statusText: "✓ Satisfied" });
      } else {
        breakdowns.push({ ruleName: "Occupation Requirement", satisfied: false, verified: true, details: `Requires: ${r.occupations} (Your profile: ${profile.occupation})`, statusText: "✗ Not met" });
      }

      // Income (25)
      const userInc = Number(profile.annualIncome || 250000);
      if (!r.maxIncome || userInc <= r.maxIncome) {
        score += 25;
        breakdowns.push({ ruleName: "Income Requirement", satisfied: true, verified: true, details: `Income ₹${userInc.toLocaleString('en-IN')} is within limit`, statusText: "✓ Satisfied" });
      } else {
        breakdowns.push({ ruleName: "Income Requirement", satisfied: false, verified: true, details: `Income ₹${userInc.toLocaleString('en-IN')} exceeds limit`, statusText: "✗ Not met" });
      }

      // State (20)
      if (!r.states || r.states.includes("All India") || r.states.includes(profile.state || "Telangana")) {
        score += 20;
        breakdowns.push({ ruleName: "State / Domicile", satisfied: true, verified: true, details: `State matched: ${profile.state || 'Telangana'}`, statusText: "✓ Satisfied" });
      } else {
        breakdowns.push({ ruleName: "State / Domicile", satisfied: false, verified: true, details: `Restricted to: ${r.states}`, statusText: "✗ Not met" });
      }

      // Education (15)
      if (!r.educations || r.educations === "All" || r.educations.includes(profile.educationLevel || "Undergraduate")) {
        score += 15;
        breakdowns.push({ ruleName: "Education Requirement", satisfied: true, verified: true, details: `Education matched: ${profile.educationLevel || 'Undergraduate'}`, statusText: "✓ Satisfied" });
      } else {
        breakdowns.push({ ruleName: "Education Requirement", satisfied: false, verified: true, details: `Requires: ${r.educations}`, statusText: "✗ Not met" });
      }

      // Age (10)
      const userAge = Number(profile.age || 20);
      if ((!r.minAge || userAge >= r.minAge) && (!r.maxAge || userAge <= r.maxAge)) {
        score += 10;
        breakdowns.push({ ruleName: "Age Requirement", satisfied: true, verified: true, details: `Age ${userAge} within bracket (${r.minAge || 0} - ${r.maxAge || 100})`, statusText: "✓ Satisfied" });
      } else {
        breakdowns.push({ ruleName: "Age Requirement", satisfied: false, verified: true, details: `Age ${userAge} outside bracket`, statusText: "✗ Not met" });
      }

      // Academic Merit (5)
      if (r.minCgpa) {
        const userCgpa = Number(profile.cgpa || 8.2);
        if (userCgpa >= r.minCgpa) {
          score += 5;
          breakdowns.push({ ruleName: "Academic Merit (CGPA)", satisfied: true, verified: true, details: `CGPA ${userCgpa} satisfies requirement (≥ ${r.minCgpa})`, statusText: "✓ Satisfied" });
        } else {
          breakdowns.push({ ruleName: "Academic Merit (CGPA)", satisfied: false, verified: true, details: `CGPA ${userCgpa} below required ${r.minCgpa}`, statusText: "✗ Not met" });
        }
      } else {
        score += 5;
        breakdowns.push({ ruleName: "Academic / General Category", satisfied: true, verified: true, details: "No restrictive cut-off required", statusText: "✓ Satisfied" });
      }

      const matchPct = Math.min(100, Math.round(score));
      let qualStatus = "Strong Match";
      if (matchPct < 85) qualStatus = matchPct >= 65 ? "Potentially Eligible" : "Partial Match";

      return {
        scheme: scheme,
        matchPercentage: matchPct,
        qualificationStatus: qualStatus,
        potentialBenefitFormatted: scheme.benefitDisplay,
        breakdowns: breakdowns,
        missingFields: []
      };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);
  }
};

// Global Toast Notification Helper
function showToast(message, type = "info") {
  const existing = document.getElementById("claimit-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "claimit-toast";
  toast.style.position = "fixed";
  toast.style.bottom = "24px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = type === "success" ? "#065f46" : type === "error" ? "#991b1b" : "#1e293b";
  toast.style.color = "#ffffff";
  toast.style.padding = "12px 24px";
  toast.style.borderRadius = "9999px";
  toast.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";
  toast.style.zIndex = "9999";
  toast.style.fontSize = "14px";
  toast.style.fontWeight = "600";
  toast.style.display = "flex";
  toast.style.alignItems = "center";
  toast.style.gap = "8px";
  toast.innerText = message;

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.4s ease";
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// Global "Try Demo" Action handler
function activateDemoMode() {
  ClaimItApi.setCurrentUser(ClaimItApi.demoProfile);
  showToast("⚡ Demo Student Profile Loaded (Telangana, UG, ₹2.5L Income, 8.2 CGPA)", "success");
  setTimeout(() => {
    window.location.href = "schemes.html?mode=demo";
  }, 600);
}

document.addEventListener("DOMContentLoaded", () => {
  // Render Auth state in navbar
  ClaimItApi.renderAuthNav();

  // Re-render auth nav on language change
  window.addEventListener("claimit_lang_change", () => {
    ClaimItApi.renderAuthNav();
  });

  // Bind any demo buttons across pages
  document.querySelectorAll(".btn-demo, [data-action='try-demo']").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      activateDemoMode();
    });
  });
});
