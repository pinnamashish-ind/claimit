-- =======================================================
-- CLAIMIT (నా హక్కు) Sample & Demo Dataset
-- Realistic hackathon mock data for government schemes
-- =======================================================

USE claimit_db;

-- 1. Master Documents
INSERT INTO documents (id, code, name, name_te, description, is_mandatory_default) VALUES
(1, 'DOC_AADHAAR', 'Aadhaar Card / Government Photo ID', 'ఆధార్ కార్డు / ఫోటో గుర్తింపు కార్డు', 'Proof of identity and address', 1),
(2, 'DOC_INCOME', 'Income Certificate from Revenue Authority', 'ఆదాయ ధృవీకరణ పత్రం (మీసేవ/తహసీల్దార్)', 'Recent certificate proving family annual income', 1),
(3, 'DOC_BANK', 'Active Bank Passbook / Account Statement', 'బ్యాంక్ పాస్‌బుక్ / ఖాతా వివరాలు', 'Bank account linked to Aadhaar (NPCI enabled)', 1),
(4, 'DOC_BONAFIDE', 'Bonafide / Study Certificate', 'బోనాఫైడ్ / విద్యా ధృవీకరణ పత్రం', 'Issued by currently enrolled college or school', 1),
(5, 'DOC_MARKS', 'Previous Year Marks Memo / Transcript', 'మునుపటి తరగతి మార్కుల మెమో', 'Proof of academic qualification and CGPA', 1),
(6, 'DOC_COMMUNITY', 'Caste / Community Certificate', 'కుల ధృవీకరణ పత్రం', 'Required for reserved categories (SC/ST/BC/OBC)', 0),
(7, 'DOC_LAND', 'Land Pattadar Passbook / ROR-1B', 'పట్టాదారు పాస్‌బుక్ / వ్యవసాయ భూమి పత్రాలు', 'Agricultural landholding record', 0),
(8, 'DOC_DISABILITY', 'Disability (SADAREM) Certificate', 'దివ్యాంగుల ధృవీకరణ పత్రం (సదరం)', 'Certificate showing 40% or higher disability', 0),
(9, 'DOC_RESIDENCE', 'Nativity / Residence Certificate', 'నివాస ధృవీకరణ పత్రం', 'Proof of state domicile', 1),
(10, 'DOC_PROJECT_REPORT', 'Detailed Project Report (DPR)', 'ప్రాజెక్ట్ నివేదిక', 'Business plan for entrepreneurial subsidy', 0);

-- 2. Master Schemes (Realistic Govt Schemes across categories)
INSERT INTO schemes (id, code, title, title_te, category, short_description, short_description_te, detailed_description, target_beneficiaries, min_benefit_amount, max_benefit_amount, benefit_display, benefit_type, deadline, official_portal_url, info_source, last_verified, is_active) VALUES
(1, 'SCH_TS_EPASS', 'Telangana Post-Matric Scholarship & Fee Reimbursement (ePASS)', 'తెలంగాణ పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్ మరియు ఫీజు రీయింబర్స్‌మెంట్', 'Education', 
 'Full tuition fee reimbursement and monthly maintenance allowance for undergraduate & postgraduate students in recognized institutions.', 
 'గుర్తింపు పొందిన కళాశాలల్లో చదువుతున్న విద్యార్థులకు పూర్తి ట్యూషన్ ఫీజు రీయింబర్స్‌మెంట్ మరియు నెలవారీ భత్యం.', 
 'The Telangana ePASS Post-Matric Scholarship provides financial assistance for higher education to economically weaker students. It covers tuition fee reimbursement directly to colleges and provides sustenance allowance directly to students bank accounts.',
 'Undergraduate & PG students residing in Telangana', 35000.00, 75000.00, 'Up to ₹75,000 / year', 'Scholarship & Fee Waiver', '2026-10-31', 'https://telanganaepass.cgg.gov.in (Demo Portal Link)', 'Telangana State Welfare Department', '2026-08-15', 1),

(2, 'SCH_AICTE_PRAGATI', 'AICTE Pragati Scholarship for Girl Students', 'బాలికల కోసం AICTE ప్రగతి స్కాలర్‌షిప్ పథకం', 'Education',
 'Financial assistance of ₹50,000 per annum for meritorious female students enrolled in technical degree or diploma courses.',
 'సాంకేతిక కోర్సుల్లో ప్రవేశం పొందిన ప్రతిభావంతులైన విద్యార్థినులకు ఏడాదికి ₹50,000 ఆర్థిక సాయం.',
 'Pragati is an MHRD-AICTE scheme aimed at empowering young women to pursue technical education. Selection is purely merit-based with quota for underprivileged backgrounds.',
 'Female students in 1st year Degree/Diploma engineering', 50000.00, 50000.00, '₹50,000 / year', 'Scholarship', '2026-11-15', 'https://scholarships.gov.in (Demo Portal Link)', 'Ministry of Education & AICTE', '2026-08-10', 1),

(3, 'SCH_NMMSS', 'National Means-cum-Merit Scholarship Scheme (NMMSS)', 'జాతీయ ప్రతిభా స్కాలర్‌షిప్ పథకం (NMMSS)', 'Education',
 'Awarding ₹12,000 annually to meritorious students from economically disadvantaged families to prevent dropout after Class 8.',
 'ఆర్థికంగా వెనుకబడిన కుటుంబాలకు చెందిన ప్రతిభావంతులైన విద్యార్థులకు ఏడాదికి ₹12,000 ఉపకార వేతనం.',
 'Centrally sponsored scholarship awarded to students clearing the state NMMS examination, providing ₹1,000 per month through DBT mode.',
 'Secondary school students (Classes 9 to 12)', 12000.00, 12000.00, '₹12,000 / year', 'Direct Benefit Transfer', '2026-09-30', 'https://scholarships.gov.in (Demo Portal Link)', 'Department of School Education & Literacy', '2026-08-01', 1),

(4, 'SCH_CSSS_HE', 'Central Sector Scheme of Scholarships for College and University Students', 'కళాశాల విద్యార్థుల కోసం సెంట్రల్ సెక్టార్ స్కాలర్‌షిప్', 'Education',
 'Financial support for top-percentile 12th pass students pursuing higher university education across India.',
 '12వ తరగతి ఉత్తీర్ణులై డిగ్రీ చదువుతున్న విద్యార్థులకు వార్షిక స్కాలర్‌షిప్.',
 'Direct financial support to top 20th percentile students with family income under ₹4.5 Lakhs.',
 'Undergraduate college students', 12000.00, 20000.00, '₹12,000 - ₹20,000 / year', 'Scholarship', '2026-10-15', 'https://scholarships.gov.in (Demo Portal Link)', 'Ministry of Education', '2026-07-28', 1),

(5, 'SCH_PM_KISAN', 'PM-KISAN Samman Nidhi & Farmer Input Subsidy', 'పీఎం కిసాన్ సమ్మాన్ నిధి & రైతు పెట్టుబడి సాయం', 'Agriculture',
 'Income support of ₹6,000 to ₹10,000 per year directly into bank accounts of landholding farmer families in equal installments.',
 'రైతు కుటుంబాలకు పంట పెట్టుబడి కోసం బ్యాంకు ఖాతాల్లోకి ఏడాదికి ₹6,000 నుండి ₹10,000 వరకు ఆర్థిక సాయం.',
 'Direct income support scheme aimed at helping small and marginal farmers fulfill domestic farm input needs including seeds and fertilizers.',
 'Small and marginal farmers with cultivable land', 6000.00, 10000.00, '₹6,000 - ₹10,000 / year', 'Direct Cash Transfer', '2026-12-31', 'https://pmkisan.gov.in (Demo Portal Link)', 'Ministry of Agriculture and Farmers Welfare', '2026-08-12', 1),

(6, 'SCH_AGRI_SMAM', 'Sub-Mission on Agricultural Mechanization (SMAM)', 'వ్యవసాయ యాంత్రీకరణ సబ్-మిషన్ (SMAM)', 'Agriculture',
 '40% to 50% capital subsidy for purchase of modern farm machinery, power tillers, and crop processing implements.',
 'రైతులకు వ్యవసాయ పరికరాలు, ట్రాక్టర్లు కొనుగోలుపై 40% నుండి 50% వరకు రాయితీ.',
 'Promotes farm mechanization among small and marginal farmers with special subsidy rates for women farmers and SC/ST categories.',
 'Cultivator farmers and Farmer Producer Organizations (FPOs)', 25000.00, 150000.00, 'Up to ₹1,50,000 Subsidy', 'Machinery Subsidy', '2026-11-30', 'https://agrimachinery.nic.in (Demo Portal Link)', 'Directorate of Agricultural Mechanization', '2026-07-15', 1),

(7, 'SCH_PMEGP', 'Prime Minister Employment Generation Programme (PMEGP)', 'ప్రధాన మంత్రి ఉపాధి కల్పన కార్యక్రమం (PMEGP)', 'Entrepreneurship',
 'Credit-linked subsidy program offering 15% to 35% margin money assistance on bank-financed micro-enterprises up to ₹50 Lakhs.',
 'నూతన వ్యాపారం లేదా చిన్న పరిశ్రమ స్థాపనకు 15% నుండి 35% వరకు సబ్సిడీతో కూడిన రుణం.',
 'Assists educated unemployed youth and artisans to establish manufacturing or service units.',
 'First-generation entrepreneurs, youth aged 18+', 50000.00, 500000.00, 'Up to ₹5,00,000 Margin Subsidy', 'Credit-Linked Subsidy', '2026-12-15', 'https://www.kviconline.gov.in (Demo Portal Link)', 'Khadi and Village Industries Commission (KVIC)', '2026-08-05', 1),

(8, 'SCH_STANDUP_INDIA', 'Stand-Up India Scheme for Women & SC/ST Entrepreneurs', 'స్టాండ్-అప్ ఇండియా పథకం (మహిళా & SC/ST ఔత్సాహికులు)', 'Entrepreneurship',
 'Facilitates bank loans between ₹10 Lakhs and ₹1 Crore to at least one SC/ST and one woman borrower per bank branch.',
 'మహిళలు మరియు SC/ST వర్గాల వ్యాపారవేత్తలకు ₹10 లక్షల నుండి ₹1 కోటి వరకు బ్యాంక్ లోన్లు.',
 'Promotes enterprise setup in greenfield manufacturing, services, or agri-allied trading sectors.',
 'Women and SC/ST entrepreneurs aged 18+', 100000.00, 1000000.00, 'Bank Credit up to ₹1 Crore', 'Bank Loan Support', '2026-11-20', 'https://www.standupmitra.in (Demo Portal Link)', 'Small Industries Development Bank of India (SIDBI)', '2026-08-11', 1),

(9, 'SCH_PMKVY', 'Pradhan Mantri Kaushal Vikas Yojana 4.0 (PMKVY)', 'ప్రధాన మంత్రి కౌశల్ వికాస్ యోజన 4.0 (నైపుణ్యాభివృద్ధి)', 'Skill Development',
 'Industry-relevant, accredited free skill certification courses with daily travel stipend, insurance, and job placement assistance.',
 'యువతకు ఉచిత సాంకేతిక నైపుణ్య శిక్షణ, సర్టిఫికేషన్ మరియు ఉద్యోగ సహాయం.',
 'Short-term training on AI, robotics, industrial IoT, electronics, retail, and healthcare for school/college dropouts and unemployed youth.',
 'Unemployed youth & job seekers aged 15-45', 8000.00, 15000.00, 'Free Training + ₹8,000 Stipend', 'Training & Stipend', '2026-10-30', 'https://www.pmkvyofficial.org (Demo Portal Link)', 'National Skill Development Corporation (NSDC)', '2026-08-18', 1),

(10, 'SCH_DDU_GKY', 'Deen Dayal Upadhyaya Grameen Kaushalya Yojana (DDU-GKY)', 'దీన్ దయాళ్ ఉపాధ్యాయ గ్రామీణ నైపుణ్య యోజన', 'Skill Development',
 'Demand-driven, placement-linked skill training for rural youth with guaranteed placement minimum 70% of certified students.',
 'గ్రామీణ యువతకు ఉచిత వసతితో కూడిన ఉద్యోగ ఆధారిత నైపుణ్య శిక్షణ.',
 'Aims to transform rural poor youth into an economically independent, globally relevant workforce with food and residential allowances.',
 'Rural unemployed youth aged 18-35', 12000.00, 25000.00, 'Free Residential Training + Placement', 'Training & Placement', '2026-11-10', 'https://ddugky.gov.in (Demo Portal Link)', 'Ministry of Rural Development', '2026-08-02', 1),

(11, 'SCH_PMAY_URBAN', 'Pradhan Mantri Awas Yojana (PMAY-U / Housing for All)', 'ప్రధాన మంత్రి ఆవాస్ యోజన (గృహ నిర్మాణ సాయం)', 'Housing',
 'Credit-linked interest subsidy up to ₹2.67 Lakhs on home loans for first-time home buyers in Economically Weaker Section (EWS) and LIG.',
 'సొంత ఇల్లు నిర్మించుకోవడానికి లేదా కొనుగోలు చేయడానికి ₹2.67 లక్షల వరకు వడ్డీ రాయితీ.',
 'Assists urban and peri-urban families lacking pucca house to construct or purchase their first residential home.',
 'Families without pucca home, annual income < ₹6 Lakhs', 150000.00, 267000.00, 'Up to ₹2,67,000 Subsidy', 'Interest Subsidy', '2026-12-31', 'https://pmaymis.gov.in (Demo Portal Link)', 'Ministry of Housing and Urban Affairs', '2026-07-30', 1),

(12, 'SCH_KALYANA_LAKSHMI', 'Telangana Kalyana Lakshmi / Shaadi Mubarak Scheme', 'తెలంగాణ కళ్యాణ లక్ష్మి / షాదీ ముబారక్ పథకం', 'Social Welfare',
 'One-time financial assistance of ₹1,00,116 to unmarried brides from economically disadvantaged backgrounds at the time of marriage.',
 'పేద కుటుంబాల్లోని వధువుల వివాహ ఖర్చుల నిమిత్తం ₹1,00,116 ఒకేసారి ఆర్థిక సహాయం.',
 'Prevents child marriages and relieves financial burden on underprivileged families across SC, ST, BC, and minority communities.',
 'Unmarried girls aged 18+ residing in Telangana', 100116.00, 100116.00, '₹1,00,116 One-Time Grant', 'Grant Assistance', '2026-12-31', 'https://telanganaepass.cgg.gov.in (Demo Portal Link)', 'Telangana Welfare Department', '2026-08-14', 1),

(13, 'SCH_AASARA_PENSION', 'Aasara Social Security Pension Scheme', 'ఆసరా పెన్షన్ పథకం (వృద్ధులు & వితంతువులు)', 'Social Welfare',
 'Monthly social pension of ₹2,016 directly deposited into bank accounts of destitute senior citizens, widows, and weavers.',
 'నిరుపేద వృద్ధులు, వితంతువులకు గౌరవప్రదమైన జీవనం కోసం ప్రతి నెలా ₹2,016 పింఛను.',
 'Provides social security net ensuring life with dignity for marginalized senior citizens above age 57.',
 'Senior citizens aged 57+, widows, persons with disabilities', 24192.00, 24192.00, '₹2,016 / month (₹24,192/yr)', 'Monthly Pension', '2026-12-31', 'https://aasara.telangana.gov.in (Demo Portal Link)', 'Panchayat Raj & Rural Development Department', '2026-08-01', 1),

(14, 'SCH_DRONE_DIDI', 'Namo Drone Didi Scheme for Women SHGs', 'నమో డ్రోన్ దీదీ పథకం (మహిళా స్వయం సహాయక సంఘాలు)', 'Women & Child Welfare',
 '80% government subsidy (up to ₹8 Lakhs) to rural women Self-Help Groups (SHGs) to procure modern agricultural drones.',
 'మహిళా సంఘాలకు వ్యవసాయ డ్రోన్లు కొనుగోలు చేయడానికి 80% (గరిష్టంగా ₹8 లక్షలు) రాయితీ.',
 'Empowers rural women with drone pilot training and drone enterprise to provide drone rental spraying services to local farmers.',
 'Women SHG members in rural areas', 400000.00, 800000.00, 'Up to ₹8,00,000 Subsidy', 'Equipment Subsidy', '2026-11-25', 'https://nrlm.gov.in (Demo Portal Link)', 'Ministry of Agriculture & Rural Development', '2026-08-09', 1);

-- 3. Eligibility Rules
INSERT INTO eligibility_rules (scheme_id, min_age, max_age, allowed_states, allowed_occupations, allowed_educations, max_annual_income, allowed_categories, requires_disability, min_cgpa, additional_notes) VALUES
-- ePASS (Telangana, Student, UG/PG, Income <= 300000)
(1, 16, 30, 'Telangana', 'Student', 'Undergraduate,Postgraduate,Diploma', 300000.00, 'OBC,SC,ST,General,Other', NULL, 6.0, 'Must be registered in state recognized university'),
-- AICTE Pragati (Female students, UG/Diploma, Income <= 800000)
(2, 17, 28, 'Telangana,Andhra Pradesh,Karnataka,Maharashtra,Tamil Nadu,Kerala,All India', 'Student', 'Undergraduate,Diploma', 800000.00, 'General,OBC,SC,ST,Other', NULL, 6.5, 'Open strictly for female students in technical education'),
-- NMMSS (Age 13-17, 8th-12th grade, Income <= 350000)
(3, 13, 18, 'Telangana,Andhra Pradesh,Karnataka,Maharashtra,Tamil Nadu,Kerala,All India', 'Student', '10th,12th', 350000.00, 'General,OBC,SC,ST,Other', NULL, 5.5, 'Must have passed 8th grade with min 55% marks'),
-- CSSS Higher Education (Student, UG, Income <= 450000, min CGPA 7.0)
(4, 17, 25, 'Telangana,Andhra Pradesh,Karnataka,Maharashtra,Tamil Nadu,Kerala,All India', 'Student', 'Undergraduate', 450000.00, 'General,OBC,SC,ST,Other', NULL, 7.0, 'Must score in top 20th percentile in Class 12 board exams'),
-- PM Kisan (Farmer, Income <= 500000)
(5, 18, 75, 'Telangana,Andhra Pradesh,Karnataka,Maharashtra,Tamil Nadu,Kerala,All India', 'Farmer', '10th,12th,Diploma,Undergraduate,Postgraduate,Other', 500000.00, 'General,OBC,SC,ST,Other', NULL, NULL, 'Must hold agricultural land in family name'),
-- SMAM Agri Mechanization (Farmer, Income <= 800000)
(6, 18, 70, 'Telangana,Andhra Pradesh,Karnataka,Maharashtra,Tamil Nadu,Kerala,All India', 'Farmer', '10th,12th,Diploma,Undergraduate,Postgraduate,Other', 800000.00, 'General,OBC,SC,ST,Other', NULL, NULL, 'Preference for women, SC/ST, and small/marginal farmers'),
-- PMEGP (Youth, 18-50, Income <= 1000000)
(7, 18, 55, 'Telangana,Andhra Pradesh,Karnataka,Maharashtra,Tamil Nadu,Kerala,All India', 'Entrepreneur,Job Seeker,Other', '10th,12th,Diploma,Undergraduate,Postgraduate,Other', 1000000.00, 'General,OBC,SC,ST,Other', NULL, NULL, 'Must present viable project business plan'),
-- Stand-Up India (Women / SC / ST, 18+, Entrepreneur)
(8, 18, 65, 'Telangana,Andhra Pradesh,Karnataka,Maharashtra,Tamil Nadu,Kerala,All India', 'Entrepreneur,Employee,Other', '10th,12th,Diploma,Undergraduate,Postgraduate,Other', 1500000.00, 'SC,ST,OBC,General,Other', NULL, NULL, 'Non-individual enterprises must have 51% shareholding by SC/ST or woman'),
-- PMKVY (Job Seeker / Student dropouts / Youth 15-40)
(9, 15, 45, 'Telangana,Andhra Pradesh,Karnataka,Maharashtra,Tamil Nadu,Kerala,All India', 'Job Seeker,Student,Other', '10th,12th,Diploma,Undergraduate,Other', 500000.00, 'General,OBC,SC,ST,Other', NULL, NULL, 'Aadhaar linked bank account is mandatory for DBT'),
-- DDU-GKY (Rural youth, 18-35, Job Seeker)
(10, 18, 35, 'Telangana,Andhra Pradesh,Karnataka,Maharashtra,Tamil Nadu,Kerala,All India', 'Job Seeker,Other', '10th,12th,Diploma,Undergraduate,Other', 300000.00, 'General,OBC,SC,ST,Other', NULL, NULL, 'Residential training with 70% job placement commitment'),
-- PMAY Housing (All India, Income <= 600000, 21-65)
(11, 21, 65, 'Telangana,Andhra Pradesh,Karnataka,Maharashtra,Tamil Nadu,Kerala,All India', 'Employee,Farmer,Entrepreneur,Job Seeker,Senior Citizen,Other', '10th,12th,Diploma,Undergraduate,Postgraduate,Other', 600000.00, 'General,OBC,SC,ST,Other', NULL, NULL, 'Family must not own a pucca house anywhere in India'),
-- Kalyana Lakshmi (Telangana, 18+, Bride assistance, Income <= 200000)
(12, 18, 35, 'Telangana', 'Student,Employee,Job Seeker,Other', '10th,12th,Diploma,Undergraduate,Postgraduate,Other', 200000.00, 'OBC,SC,ST,Other', NULL, NULL, 'Bride must be resident of Telangana state'),
-- Aasara Senior Pension (Telangana, Age 57+, Income <= 200000)
(13, 57, 100, 'Telangana', 'Senior Citizen,Other', '10th,12th,Diploma,Undergraduate,Postgraduate,Other', 200000.00, 'General,OBC,SC,ST,Other', NULL, NULL, 'Destitute senior citizen with no family financial support'),
-- Drone Didi (Women SHG, 18-50)
(14, 18, 50, 'Telangana,Andhra Pradesh,Karnataka,Maharashtra,Tamil Nadu,Kerala,All India', 'Farmer,Entrepreneur,Employee,Other', '10th,12th,Diploma,Undergraduate,Other', 400000.00, 'General,OBC,SC,ST,Other', NULL, NULL, 'Must be an active member of registered Women Self Help Group');

-- 4. Scheme Documents Mapping
INSERT INTO scheme_documents (scheme_id, document_id, is_mandatory, notes) VALUES
-- ePASS documents
(1, 1, 1, 'Aadhaar card of student and parent'),
(1, 2, 1, 'MRO issued Income Certificate dated after 01-Jan-2026'),
(1, 3, 1, 'Student bank account passbook with IFSC code'),
(1, 4, 1, 'Bonafide certificate issued by Principal'),
(1, 5, 1, 'Intermediate / 12th marks memo'),
(1, 6, 1, 'Caste certificate for BC/SC/ST categories'),
-- AICTE Pragati documents
(2, 1, 1, 'Applicant Aadhaar Card'),
(2, 2, 1, 'Income certificate verifying < 8 Lakhs'),
(2, 3, 1, 'Bank passbook front page'),
(2, 4, 1, 'Bonafide certificate from AICTE approved institute'),
(2, 5, 1, 'Qualifying 10+2 / Diploma mark sheet'),
-- PM-KISAN documents
(5, 1, 1, 'Farmer Aadhaar Card'),
(5, 3, 1, 'DBT active bank account'),
(5, 7, 1, 'Pattadar passbook showing land extent'),
-- PMEGP documents
(7, 1, 1, 'Aadhaar / PAN card'),
(7, 5, 1, 'Highest qualification certificate (minimum 8th standard pass)'),
(7, 10, 1, 'Project appraisal report approved by bank');

-- 5. Application Steps
INSERT INTO application_steps (scheme_id, step_number, title, title_te, instructions, portal_action_type) VALUES
(1, 1, 'Register / Login on ePASS Portal', 'ePASS పోర్టల్‌లో రిజిస్ట్రేషన్ చేసుకోండి', 'Visit the official Telangana ePASS portal and click on Post-Matric Scholarship Fresh/Renewal Registration.', 'Portal Registration'),
(1, 2, 'Enter Academic & Admission Details', 'విద్యా మరియు అడ్మిషన్ వివరాలను నమోదు చేయండి', 'Fill your CET hall ticket number, college code, course, admission quota and year of study.', 'Online Form'),
(1, 3, 'Upload Scanned Documents', 'ధృవీకరణ పత్రాలను అప్‌లోడ్ చేయండి', 'Upload clear scans of Aadhaar, Bonafide certificate, Income certificate and Bank passbook front page (PDF/JPEG < 100KB).', 'Document Upload'),
(1, 4, 'Review & Submit Application', 'వివరాలను సమీక్షించి సమర్పించండి', 'Verify all entered details carefully. Once confirmed, submit the application online to generate your Application Acknowledgment Number.', 'Submission'),
(1, 5, 'Submit Hardcopy to College Office', 'కళాశాల కార్యాలయంలో రశీదును సమర్పించండి', 'Print the signed acknowledgment form and submit it along with physical document copies to your college scholarship nodal officer for college-level verification.', 'Verification');

-- 6. Demo User & Profile Setup
INSERT INTO users (id, full_name, email, phone, is_demo) VALUES
(1, 'Demo Student', 'demo.student@claimit.org', '+91 98765 43210', 1);

INSERT INTO user_profiles (id, user_id, age, gender, state, district, occupation, education_level, annual_income, category, has_disability, employment_status, institution_name, course, study_year, cgpa) VALUES
(1, 1, 20, 'Male', 'Telangana', 'Hyderabad', 'Student', 'Undergraduate', 250000.00, 'OBC', 0, 'Unemployed', 'Osmania University College of Engineering', 'B.Tech Computer Science', 3, 8.20);

-- 7. Sample Tracked Applications for Demo User
INSERT INTO applications (id, user_id, scheme_id, status, reference_number, applied_date, notes) VALUES
(1, 1, 1, 'Application Started', 'TS-EPASS-2026-98124', '2026-08-20', 'Documents uploaded, pending college signature verification'),
(2, 1, 4, 'Submitted', 'NSP-CSSS-2026-4421', '2026-08-10', 'Submitted on National Scholarship Portal, under state review'),
(3, 1, 9, 'Interested', NULL, NULL, 'Bookmarked skill certification program for summer vacation');

-- 8. Sample Notifications
INSERT INTO notifications (id, user_id, title, message, type, is_read) VALUES
(1, 1, 'Deadline Alert: ePASS Scholarship', 'Telangana Post-Matric Scholarship deadline is approaching on 31 October 2026. Complete your college verification soon.', 'deadline', 0),
(2, 1, 'Match Alert: 4 New Education Schemes Found', 'Based on your recent profile details (Undergraduate, Telangana, Income ₹2.5L), 4 matching schemes have been identified.', 'match', 0),
(3, 1, 'Document Readiness Update', 'You have 4 of 5 required documents verified for your top matching scheme.', 'readiness', 1);
