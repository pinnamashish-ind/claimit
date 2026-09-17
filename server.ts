import express from "express";
import path from "path";
import fs from "fs";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory demo data store matching database/sample_data.sql
const demoUser = {
  id: 1,
  fullName: "Demo Student",
  email: "demo.student@claimit.org",
  phone: "+91 98765 43210",
  isDemo: true,
  profile: {
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
    cgpa: 8.20
  }
};

const schemes = [
  {
    id: 1,
    code: "SCH_TS_EPASS",
    title: "Telangana Post-Matric Scholarship & Fee Reimbursement (ePASS)",
    titleTe: "తెలంగాణ పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్ మరియు ఫీజు రీయింబర్స్‌మెంట్",
    category: "Education",
    shortDescription: "Full tuition fee reimbursement and monthly maintenance allowance for undergraduate & postgraduate students in recognized institutions.",
    shortDescriptionTe: "గుర్తింపు పొందిన కళాశాలల్లో చదువుతున్న విద్యార్థులకు పూర్తి ట్యూషన్ ఫీజు రీయింబర్స్‌మెంట్ మరియు నెలవారీ భత్యం.",
    detailedDescription: "The Electronic Payment and Application System of Scholarships (ePASS) offers comprehensive scholarship and tuition waiver to students pursuing post-matriculation courses in colleges across Telangana.",
    targetBeneficiaries: "Undergraduate & PG students residing in Telangana",
    benefitDisplay: "Up to ₹75,000 / year",
    minBenefitAmount: 15000,
    maxBenefitAmount: 75000,
    deadline: "2026-10-31",
    officialPortalUrl: "https://telanganaepass.cgg.gov.in",
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
    detailedDescription: "Pragati is a scheme implemented by AICTE aiming to support the empowerment of girls pursuing technical education through substantial annual stipends.",
    targetBeneficiaries: "Female students in 1st year Degree/Diploma engineering",
    benefitDisplay: "₹50,000 / year",
    minBenefitAmount: 50000,
    maxBenefitAmount: 50000,
    deadline: "2026-11-15",
    officialPortalUrl: "https://scholarships.gov.in",
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
    id: 3,
    code: "SCH_NSP_PRE",
    title: "National Means-cum-Merit Scholarship (NMMSS)",
    titleTe: "నేషనల్ మీన్స్-కమ్-మెరిట్ స్కాలర్‌షిప్",
    category: "Education",
    shortDescription: "Scholarships to meritorious students of economically weaker sections to arrest dropouts at class 8 and encourage continuation.",
    shortDescriptionTe: "ఆర్థికంగా వెనుకబడిన ప్రతిభావంతులైన విద్యార్థులకు మాధ్యమిక విద్యా ప్రోత్సాహకం.",
    targetBeneficiaries: "Class 9 to 12 students in government schools",
    benefitDisplay: "₹12,000 / year",
    minBenefitAmount: 12000,
    maxBenefitAmount: 12000,
    deadline: "2026-10-31",
    officialPortalUrl: "https://scholarships.gov.in",
    infoSource: "Ministry of Education",
    lastVerified: "2026-08-01",
    rules: { minAge: 13, maxAge: 18, states: "All India", occupations: "Student", educations: "Class 10,Class 12", maxIncome: 350000 },
    documents: [
      { name: "Aadhaar Card", nameTe: "ఆధార్ కార్డు", isMandatory: true },
      { name: "Income Certificate", nameTe: "ఆదాయ ధృవీకరణ పత్రం", isMandatory: true }
    ],
    steps: [
      { number: 1, title: "School Endorsement", titleTe: "పాఠశాల పరిశీలన", desc: "Headmaster submits qualifying roll number on NSP." }
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
    minBenefitAmount: 12000,
    maxBenefitAmount: 20000,
    deadline: "2026-10-15",
    officialPortalUrl: "https://scholarships.gov.in",
    infoSource: "Department of Higher Education, GoI",
    lastVerified: "2026-07-28",
    rules: { minAge: 17, maxAge: 25, states: "All India", occupations: "Student", educations: "Undergraduate", maxIncome: 450000, minCgpa: 7.0 },
    documents: [
      { name: "Aadhaar Card", nameTe: "ఆధార్ కార్డు", isMandatory: true },
      { name: "Income Certificate (< ₹4.5 Lakhs)", nameTe: "ఆదాయ ధృవీకరణ పత్రం", isMandatory: true },
      { name: "Class 12th Board Marksheet", nameTe: "12వ తరగతి మార్కుల మెమో", isMandatory: true }
    ],
    steps: [
      { number: 1, title: "Register on NSP", titleTe: "NSPలో నమోదు", desc: "Select Department of Higher Education and apply." }
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
    minBenefitAmount: 6000,
    maxBenefitAmount: 10000,
    deadline: "2026-12-31",
    officialPortalUrl: "https://pmkisan.gov.in",
    infoSource: "Ministry of Agriculture and Farmers Welfare",
    lastVerified: "2026-08-12",
    rules: { minAge: 18, maxAge: 75, states: "All India", occupations: "Farmer", educations: "All", maxIncome: 500000 },
    documents: [
      { name: "Farmer Aadhaar Card", nameTe: "రైతు ఆధార్ కార్డు", isMandatory: true },
      { name: "Pattadar Land Passbook / ROR", nameTe: "పట్టాదారు పాస్‌బుక్", isMandatory: true }
    ],
    steps: [
      { number: 1, title: "Farmer Corner Registration", titleTe: "రైతు పోర్టల్ నమోదు", desc: "Enter Aadhaar number and mobile OTP to start verification." }
    ]
  },
  {
    id: 6,
    code: "SCH_RYTHU_BANDHU",
    title: "Telangana Rythu Bharosa / Rythu Bandhu Investment Support",
    titleTe: "తెలంగాణ రైతు భరోసా / పెట్టుబడి సాయం",
    category: "Agriculture",
    shortDescription: "Crop investment support of ₹7,500 per acre per season directly credited to pattadar landholders for seeds, fertilizers and tilling.",
    shortDescriptionTe: "ఎకరానికి సీజన్‌కు ₹7,500 పెట్టుబడి సాయం నేరుగా రైతు ఖాతాలో జమ.",
    targetBeneficiaries: "Landholding farmers in Telangana state",
    benefitDisplay: "₹15,000 / acre / year",
    minBenefitAmount: 7500,
    maxBenefitAmount: 37500,
    deadline: "2026-11-30",
    officialPortalUrl: "https://rythubandhu.telangana.gov.in",
    infoSource: "Department of Agriculture, Telangana",
    lastVerified: "2026-08-14",
    rules: { minAge: 18, maxAge: 80, states: "Telangana", occupations: "Farmer", educations: "All", maxIncome: 600000 },
    documents: [
      { name: "Dharani Pattadar Passbook", nameTe: "ధరణి పట్టాదారు పాస్‌బుక్", isMandatory: true }
    ],
    steps: [
      { number: 1, title: "AEO Verification", titleTe: "వ్యవసాయ అధికారి పరిశీలన", desc: "Agricultural Extension Officer verifies land records with revenue data." }
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
    minBenefitAmount: 100000,
    maxBenefitAmount: 500000,
    deadline: "2026-12-15",
    officialPortalUrl: "https://www.kviconline.gov.in",
    infoSource: "Khadi & Village Industries Commission (KVIC)",
    lastVerified: "2026-08-05",
    rules: { minAge: 18, maxAge: 55, states: "All India", occupations: "Entrepreneur,Job Seeker,Other", educations: "All", maxIncome: 1000000 },
    documents: [
      { name: "Aadhaar Card & PAN", nameTe: "ఆధార్ & పాన్ కార్డు", isMandatory: true },
      { name: "Detailed Project Report (DPR)", nameTe: "ప్రాజెక్ట్ రిపోర్ట్", isMandatory: true }
    ],
    steps: [
      { number: 1, title: "Submit Online Application on KVIC", titleTe: "KVIC పోర్టల్‌లో దరఖాస్తు", desc: "Select agency and financing bank branch." }
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
    minBenefitAmount: 8000,
    maxBenefitAmount: 8000,
    deadline: "2026-10-30",
    officialPortalUrl: "https://www.pmkvyofficial.org",
    infoSource: "National Skill Development Corporation (NSDC)",
    lastVerified: "2026-08-18",
    rules: { minAge: 15, maxAge: 45, states: "All India", occupations: "Job Seeker,Student,Other", educations: "All", maxIncome: 500000 },
    documents: [
      { name: "Aadhaar Card", nameTe: "ఆధార్ కార్డు", isMandatory: true },
      { name: "Bank Passbook", nameTe: "బ్యాంక్ ఖాతా వివరాలు", isMandatory: true }
    ],
    steps: [
      { number: 1, title: "Enroll at Accredited Center", titleTe: "శిక్షణా కేంద్రాన్ని ఎంచుకోండి", desc: "Undergo practical training and earn certification." }
    ]
  }
];

function evaluateProfile(profile: any) {
  return schemes.map(s => {
    const r = s.rules;
    let score = 0;
    const breakdowns: any[] = [];

    // Occupation (25)
    if (profile.occupation && (r.occupations.includes(profile.occupation) || r.occupations === "All")) {
      score += 25;
      breakdowns.push({ ruleName: "Occupation Requirement", satisfied: true, verified: true, details: `Matched: ${profile.occupation}`, statusText: "✓ Satisfied" });
    } else {
      breakdowns.push({ ruleName: "Occupation Requirement", satisfied: false, verified: true, details: `Requires: ${r.occupations}`, statusText: "✗ Not met" });
    }

    // Income (25)
    const inc = Number(profile.annualIncome || 250000);
    if (!r.maxIncome || inc <= r.maxIncome) {
      score += 25;
      breakdowns.push({ ruleName: "Income Requirement", satisfied: true, verified: true, details: `Income ₹${inc.toLocaleString('en-IN')} within ceiling`, statusText: "✓ Satisfied" });
    } else {
      breakdowns.push({ ruleName: "Income Requirement", satisfied: false, verified: true, details: `Exceeds max income limit`, statusText: "✗ Not met" });
    }

    // State (20)
    if (!r.states || r.states.includes("All India") || r.states.includes(profile.state || "Telangana")) {
      score += 20;
      breakdowns.push({ ruleName: "State / Domicile", satisfied: true, verified: true, details: `State verified: ${profile.state || 'Telangana'}`, statusText: "✓ Satisfied" });
    } else {
      breakdowns.push({ ruleName: "State / Domicile", satisfied: false, verified: true, details: `Restricted to: ${r.states}`, statusText: "✗ Not met" });
    }

    // Education (15)
    if (!r.educations || r.educations === "All" || r.educations.includes(profile.educationLevel || "Undergraduate")) {
      score += 15;
      breakdowns.push({ ruleName: "Education Requirement", satisfied: true, verified: true, details: `Education verified: ${profile.educationLevel || 'Undergraduate'}`, statusText: "✓ Satisfied" });
    } else {
      breakdowns.push({ ruleName: "Education Requirement", satisfied: false, verified: true, details: `Requires: ${r.educations}`, statusText: "✗ Not met" });
    }

    // Age (10)
    const age = Number(profile.age || 20);
    if ((!r.minAge || age >= r.minAge) && (!r.maxAge || age <= r.maxAge)) {
      score += 10;
      breakdowns.push({ ruleName: "Age Requirement", satisfied: true, verified: true, details: `Age ${age} in bracket`, statusText: "✓ Satisfied" });
    } else {
      breakdowns.push({ ruleName: "Age Requirement", satisfied: false, verified: true, details: `Age outside allowed bracket`, statusText: "✗ Not met" });
    }

    // Merit (5)
    if (r.minCgpa) {
      const cgpa = Number(profile.cgpa || 8.2);
      if (cgpa >= r.minCgpa) {
        score += 5;
        breakdowns.push({ ruleName: "Academic Merit (CGPA)", satisfied: true, verified: true, details: `CGPA ${cgpa} meets requirement`, statusText: "✓ Satisfied" });
      } else {
        breakdowns.push({ ruleName: "Academic Merit (CGPA)", satisfied: false, verified: true, details: `CGPA below cutoff`, statusText: "✗ Not met" });
      }
    } else {
      score += 5;
      breakdowns.push({ ruleName: "Academic & Category Merit", satisfied: true, verified: true, details: `No cut-off restriction`, statusText: "✓ Satisfied" });
    }

    const matchPct = Math.min(100, Math.round(score));
    return {
      scheme: s,
      matchPercentage: matchPct,
      qualificationStatus: matchPct >= 80 ? "Strong Match" : matchPct >= 60 ? "Potentially Eligible" : "Partial Match",
      potentialBenefitAmount: s.maxBenefitAmount || 15000,
      potentialBenefitFormatted: s.benefitDisplay,
      breakdowns: breakdowns
    };
  }).sort((a, b) => b.matchPercentage - a.matchPercentage);
}

// REST API Endpoints
app.get("/api/schemes", (req, res) => {
  res.json(schemes);
});

app.get("/api/schemes/:id", (req, res) => {
  const item = schemes.find(s => s.id === parseInt(req.params.id));
  if (item) res.json(item);
  else res.status(404).json({ error: "Scheme not found" });
});

app.get("/api/schemes/category/:cat", (req, res) => {
  const cat = req.params.cat.toLowerCase();
  res.json(schemes.filter(s => s.category.toLowerCase() === cat));
});

app.get("/api/users/demo", (req, res) => {
  res.json(demoUser);
});

app.post("/api/users", (req, res) => {
  res.status(201).json({ id: 1, ...req.body });
});

app.get("/api/users/:id/dashboard", (req, res) => {
  const matches = evaluateProfile(demoUser.profile);
  res.json({
    userName: demoUser.fullName,
    potentialBenefitsCount: matches.length,
    strongMatchesCount: matches.filter(m => m.matchPercentage >= 80).length,
    applicationsStartedCount: 3,
    upcomingDeadlinesCount: 2,
    totalPotentialBenefitFormatted: "₹75,000+",
    topMatches: matches.slice(0, 6),
    userApplications: [
      { id: 1, scheme: schemes[0], status: "Application Started", referenceNumber: "TS-EPASS-2026-98124", appliedDate: "2026-08-20" },
      { id: 2, scheme: schemes[3], status: "Submitted", referenceNumber: "NSP-CSSS-2026-4421", appliedDate: "2026-08-10" }
    ]
  });
});

app.post("/api/eligibility/check", (req, res) => {
  res.json(evaluateProfile(req.body));
});

app.post("/api/applications", (req, res) => {
  res.status(201).json({
    id: Date.now(),
    ...req.body,
    referenceNumber: "CLM-REF-" + Math.floor(100000 + Math.random() * 900000)
  });
});

app.post("/api/ai/ask", (req, res) => {
  const { question, language, schemeId } = req.body;
  const isTe = language === 'te' || (question && question.includes('తెలుగు'));
  const s = schemeId ? schemes.find(sc => sc.id === parseInt(schemeId)) : null;

  let answer = "";
  if (s) {
    answer = isTe
      ? `📋 **${s.titleTe || s.title}** కోసం:\n• అర్హత: ${s.targetBeneficiaries}\n• ప్రయోజనం: ${s.benefitDisplay}\n• గడువు: ${s.deadline}\n• అధికారిక పోర్టల్ ద్వారా దరఖాస్తు చేసుకోవచ్చు.`
      : `📋 About **${s.title}**:\n• Target: ${s.targetBeneficiaries}\n• Benefit: ${s.benefitDisplay}\n• Closing Date: ${s.deadline}\n• Make sure you have your Aadhaar, Income certificate and study proofs ready.`;
  } else {
    answer = isTe
      ? `నమస్కారం! క్లెయిమ్‌ఇట్ (నా హక్కు) ప్లాట్‌ఫామ్ ద్వారా మీరు స్కాలర్‌షిప్‌లు, రైతు సబ్సిడీలు, మహిళా ప్రోత్సాహకాలు మరియు సంక్షేమ పథకాల అర్హతలను కనుగొనవచ్చు.`
      : `Welcome to ClaimIt! Tell us your educational and family details to check your eligibility percentages, or click on any scheme card to see why you qualify and prepare your documents.`;
  }

  res.json({
    answer,
    language: isTe ? 'te' : 'en',
    simulated: true
  });
});

// Serve static HTML/CSS/JS files from src/main/resources/static
const staticPath = path.join(process.cwd(), "src", "main", "resources", "static");
app.use(express.static(staticPath));

// Fallback to static index.html
app.get("*", (req, res) => {
  const filePath = path.join(staticPath, req.path);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.sendFile(filePath);
  } else {
    res.sendFile(path.join(staticPath, "index.html"));
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`CLAIMIT dev server running on http://0.0.0.0:${PORT}`);
});
