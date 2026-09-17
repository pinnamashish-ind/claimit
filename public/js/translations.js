/**
 * CLAIMIT (నా హక్కు - Naa Hakku) Bilingual Translation Engine
 * Supports seamless toggle between English (en) and Telugu (te).
 */

const translations = {
  en: {
    brand_name: "CLAIMIT",
    brand_tagline: "Know what you deserve. Claim what you're eligible for.",
    brand_telugu_identity: "నా హక్కు (Naa Hakku)",
    nav_home: "Home",
    nav_find_benefits: "Find Benefits",
    nav_how_it_works: "How It Works",
    nav_schemes: "Schemes",
    nav_dashboard: "Dashboard",
    nav_applications: "My Applications",
    nav_about: "About",
    btn_find_benefits: "Find My Benefits",
    btn_explore_schemes: "Explore Schemes",
    btn_try_demo: "⚡ Try Demo",
    btn_view_details: "View Details",
    btn_apply_official: "Apply on Official Website",
    btn_save_application: "Save / Track Application",
    btn_ask_ai: "Ask ClaimIt AI",
    
    hero_title: "Don't Search for Benefits.\nDiscover What You Can Claim.",
    hero_subtitle: "ClaimIt helps you discover scholarships, subsidies, welfare schemes and opportunities you may be eligible for — and guides you through the application process.",
    hero_hint: "No complicated searching. Just tell us about yourself.",

    preview_badge: "Personalized Discovery Engine",
    preview_benefits_found: "8 Benefits Found",
    preview_match_score: "92% Eligibility Match",
    preview_potential_amount: "₹48,000+ Potential Benefits",
    preview_disclaimer: "Potential benefits identified based on your profile criteria.",

    problem_title: "THE PROBLEM",
    problem_sub: "People often miss out on crucial public benefits because:",
    prob_1: "They don't know which schemes exist across departments",
    prob_2: "Eligibility guidelines are confusing and dense",
    prob_3: "Information is scattered across hundreds of portals",
    prob_4: "Application procedures are difficult to navigate",
    prob_5: "Required documents and formats are unclear",
    prob_6: "Important government deadlines are quietly missed",

    solution_title: "THE SOLUTION",
    solution_sub: "ClaimIt transforms welfare discovery with automated guidance:",
    sol_1: "Personalized discovery based on your profile",
    sol_2: "Rule-based multi-criteria eligibility matching",
    sol_3: "Simple, transparent 'Why you qualify' explanations",
    sol_4: "Interactive document readiness checklist",
    sol_5: "Step-by-step application guidance roadmap",
    sol_6: "Direct official application links & status tracking",

    how_title: "How It Works",
    how_sub: "Four simple steps to discover and claim your government entitlements",
    step_1_title: "1. Tell Us About Yourself",
    step_1_desc: "Share basic details like occupation, education, state, and family income safely.",
    step_2_title: "2. Find Matching Benefits",
    step_2_desc: "Our rule engine scans verified schemes across education, agriculture, and welfare.",
    step_3_title: "3. Check Your Eligibility",
    step_3_desc: "Review your transparent match score and see exactly which conditions you satisfy.",
    step_4_title: "4. Claim with Guided Steps",
    step_4_desc: "Prepare documents with our readiness tracker and apply directly on official portals.",

    results_header: "🎉 We found benefits that may match your profile.",
    results_sub: "Potential benefits identified based on the information provided in your profile.",
    
    filter_all_categories: "All Categories",
    filter_sort_best_match: "Best Match %",
    filter_sort_deadline: "Approaching Deadline",
    filter_sort_amount: "Highest Benefit Amount",

    section_why_qualify: "WHY YOU MAY QUALIFY",
    section_documents: "DOCUMENTS REQUIRED",
    section_steps: "STEP-BY-STEP APPLICATION PROCESS",
    section_readiness: "APPLICATION READINESS",
    readiness_sub: "You're almost ready to apply.",

    trust_source: "Information Source",
    trust_verified: "Last Verified",
    trust_official: "Official Portal",

    status_interested: "Interested",
    status_started: "Application Started",
    status_submitted: "Submitted",
    status_approved: "Approved",
    status_rejected: "Rejected"
  },
  te: {
    brand_name: "క్లెయిమ్‌ఇట్",
    brand_tagline: "మీకు రావలసినది తెలుసుకోండి. మీకు అర్హత ఉన్నది క్లెయిమ్ చేయండి.",
    brand_telugu_identity: "నా హక్కు (Naa Hakku)",
    nav_home: "హోమ్",
    nav_find_benefits: "అర్హతలను కనుగొనండి",
    nav_how_it_works: "ఇది ఎలా పనిచేస్తుంది",
    nav_schemes: "ప్రభుత్వ పథకాలు",
    nav_dashboard: "డ్యాష్‌బోర్డ్",
    nav_applications: "నా దరఖాస్తులు",
    nav_about: "గురించి",
    btn_find_benefits: "నా ప్రయోజనాలు కనుగొనండి",
    btn_explore_schemes: "పథకాలను చూడండి",
    btn_try_demo: "⚡ డెమో చూడండి",
    btn_view_details: "వివరాలు చూడండి",
    btn_apply_official: "అధికారిక వెబ్‌సైట్‌లో దరఖాస్తు చేసుకోండి",
    btn_save_application: "దరఖాస్తును భద్రపరచండి / ట్రాక్ చేయండి",
    btn_ask_ai: "క్లెయిమ్‌ఇట్ AI అడగండి",

    hero_title: "పథకాల కోసం వెతకవద్దు.\nమీరు క్లెయిమ్ చేయగల ప్రయోజనాలను కనుగొనండి.",
    hero_subtitle: "మీకు అర్హత ఉన్న స్కాలర్‌షిప్‌లు, సబ్సిడీలు, సంక్షేమ పథకాలు మరియు అవకాశాలను కనుగొనడంలో క్లెయిమ్‌ఇట్ (నా హక్కు) మీకు సహాయపడుతుంది — మరియు దరఖాస్తు ప్రక్రియలో మార్గదర్శనం చేస్తుంది.",
    hero_hint: "ఎలాంటి సంక్లిష్టమైన శోధన అవసరం లేదు. మీ వివరాలను సులభంగా తెలియజేయండి.",

    preview_badge: "వ్యక్తిగత అర్హత గుర్తింపు వ్యవస్థ",
    preview_benefits_found: "8 పథకాలు లభించాయి",
    preview_match_score: "92% అర్హత సరిపోలిక",
    preview_potential_amount: "₹48,000+ అంచనా ప్రయోజనాలు",
    preview_disclaimer: "మీ ప్రొఫైల్ ప్రమాణాల ఆధారంగా గుర్తించబడిన సంభావ్య ప్రయోజనాలు.",

    problem_title: "సమస్య ఏమిటి?",
    problem_sub: "చాలామందికి ఈ కారణాల వల్ల ప్రభుత్వ ప్రయోజనాలు అందడం లేదు:",
    prob_1: "వివిధ శాఖల్లో ఏయే పథకాలు అందుబాటులో ఉన్నాయో ప్రజలకు తెలియదు",
    prob_2: "అర్హత నిబంధనలు సంక్లిష్టంగా మరియు అర్థం చేసుకోవడం కష్టంగా ఉంటాయి",
    prob_3: "సమాచారం వందలాది విభిన్న వెబ్‌సైట్లలో చెల్లాచెదురుగా ఉంటుంది",
    prob_4: "దరఖాస్తు విధానం చాలా సంక్లిష్టంగా ఉంటుంది",
    prob_5: "ఏయే పత్రాలు మరియు సర్టిఫికెట్లు అవసరమో స్పష్టత ఉండదు",
    prob_6: "గడువు తేదీలు తెలియక సమయం ముగిసిపోతుంది",

    solution_title: "పరిష్కారం ఏమిటి?",
    solution_sub: "క్లెయిమ్‌ఇట్ ద్వారా స్వయంచాలక మార్గదర్శకత్వం:",
    sol_1: "మీ ప్రొఫైల్ ఆధారంగా వ్యక్తిగత పథకాల గుర్తింపు",
    sol_2: "నిబంధనల ఆధారిత ఖచ్చితమైన అర్హత సరిపోలిక",
    sol_3: "మీరు ఎందుకు అర్హులనే దానికి స్పష్టమైన వివరణ",
    sol_4: "అవసరమైన పత్రాల సంసిద్ధత చెక్‌లిస్ట్",
    sol_5: "దశలవారీ దరఖాస్తు మార్గదర్శకత్వం",
    sol_6: "అధికారిక దరఖాస్తు లింకులు మరియు స్టేటస్ ట్రాకింగ్",

    how_title: "ఇది ఎలా పనిచేస్తుంది?",
    how_sub: "నాలుగు సులభ దశల్లో మీ ప్రభుత్వ సంక్షేమ హక్కులను పొందండి",
    step_1_title: "1. మీ వివరాలు తెలపండి",
    step_1_desc: "వృత్తి, చదువు, రాష్ట్రం, కుటుంబ ఆదాయం వంటి ప్రాథమిక వివరాలు నమోదు చేయండి.",
    step_2_title: "2. సరిపోలే పథకాలను కనుగొనండి",
    step_2_desc: "విద్యా, వ్యవసాయ మరియు సంక్షేమ పథకాలను మా ఇంజిన్ సరిపోలుస్తుంది.",
    step_3_title: "3. మీ అర్హతను పరిశీలించండి",
    step_3_desc: "మీరు ఏయే నిబంధనలను సంతృప్తిపరిచారో స్పష్టంగా తెలుసుకోండి.",
    step_4_title: "4. మార్గదర్శకత్వంతో క్లెయిమ్ చేయండి",
    step_4_desc: "పత్రాలను సిద్ధం చేసుకుని అధికారిక పోర్టల్ ద్వారా దరఖాస్తు చేసుకోండి.",

    results_header: "🎉 మీ ప్రొఫైల్‌కు సరిపోలే సంక్షేమ పథకాలు లభించాయి.",
    results_sub: "మీరు అందించిన సమాచారం ఆధారంగా గుర్తించబడిన సంభావ్య ప్రయోజనాలు.",
    
    filter_all_categories: "అన్ని రంగాలు",
    filter_sort_best_match: "అత్యుత్తమ అర్హత %",
    filter_sort_deadline: "సమీపిస్తున్న గడువు",
    filter_sort_amount: "అత్యధిక ప్రయోజనం",

    section_why_qualify: "మీరు ఎందుకు అర్హత సాధించవచ్చంటే",
    section_documents: "అవసరమైన ధృవీకరణ పత్రాలు",
    section_steps: "దశలవారీ దరఖాస్తు విధానం",
    section_readiness: "దరఖాస్తు సంసిద్ధత",
    readiness_sub: "మీరు దరఖాస్తు చేసుకోవడానికి దాదాపు సిద్ధంగా ఉన్నారు.",

    trust_source: "సమాచార మూలం",
    trust_verified: "చివరిగా ధృవీకరించిన తేది",
    trust_official: "అధికారిక వెబ్‌సైట్",

    status_interested: "ఆసక్తి ఉంది",
    status_started: "దరఖాస్తు ప్రారంభమైంది",
    status_submitted: "సమర్పించబడింది",
    status_approved: "ఆమోదించబడింది",
    status_rejected: "తిరస్కరించబడింది"
  }
};

let currentLanguage = localStorage.getItem("claimit_lang") || "en";

function t(key) {
  if (translations[currentLanguage] && translations[currentLanguage][key]) {
    return translations[currentLanguage][key];
  }
  if (translations.en[key]) {
    return translations.en[key];
  }
  return key;
}

function setLanguage(lang) {
  if (lang !== 'en' && lang !== 'te') return;
  currentLanguage = lang;
  localStorage.setItem("claimit_lang", lang);
  updatePageTranslations();
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
  });
  // Dispatch language change event for dynamic components
  window.dispatchEvent(new CustomEvent("claimit_lang_change", { detail: { lang } }));
}

function updatePageTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(elem => {
    const key = elem.getAttribute("data-i18n");
    const val = t(key);
    if (val) {
      if (elem.tagName === 'INPUT' && elem.getAttribute('placeholder')) {
        elem.setAttribute('placeholder', val);
      } else {
        elem.innerHTML = val.replace(/\n/g, "<br>");
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updatePageTranslations();
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const lang = btn.getAttribute("data-lang");
      setLanguage(lang);
    });
  });
});
