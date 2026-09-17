# CLAIMIT (నా హక్కు - Naa Hakku)

> **"Know what you deserve. Claim what you're eligible for."**  
> *Personalized government benefits and opportunities discovery platform.*

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17%2B-orange.svg)](https://www.oracle.com/java/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0%2B-blue.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

---

## 1. Project Overview & Problem Statement

Every year, millions of students, farmers, women, workers, artisans, entrepreneurs, and senior citizens in India miss out on thousands of crores in scholarships, subsidies, welfare schemes, fee reimbursements, and skill grants.

### The Problem
1. **Low Awareness**: Citizens don't know what schemes exist across fragmented central and state ministries.
2. **Confusing Eligibility Rules**: Bureaucratic guidelines are dense and scattered across dozens of individual portals.
3. **No Personalization**: Existing portals present static, uncurated lists of hundreds of schemes without matching individual criteria.
4. **Document Ambiguity**: Applicants often fail during verification because required paperwork is unclear.
5. **Missed Deadlines**: Deadlines expire quietly without alerts or reminders.

### The ClaimIt Solution
ClaimIt introduces an intelligent, rule-based matching paradigm:
```
USER PROFILE
     ↓
ELIGIBILITY ENGINE (Multi-Criteria Evaluation)
     ↓
PERSONALIZED MATCHES & MATCH SCORES
     ↓
"WHY YOU QUALIFY" EXPLANATION
     ↓
DOCUMENT READINESS CHECKLIST
     ↓
STEP-BY-STEP APPLICATION ROADMAP
     ↓
OFFICIAL PORTAL ACTION & APPLICATION TRACKING
```

---

## 2. Core Features & Hackathon Highlights

- 🎯 **Rule-Based Eligibility Engine**: Evaluates age, state domicile, occupation, education level, annual family income limits, and academic cutoffs.
- 📊 **Dynamic Match Score**: Expressed as a percentage (e.g., 92% Match) with transparent breakdowns of satisfied vs unverified criteria.
- 💡 **"Why You Qualify" Breakdown**: Transparent explanations of eligibility conditions rather than black-box decisions.
- 📋 **Document Readiness Checklist**: Real-time counter (e.g., "4 / 5 Documents Ready") with progress meter and actionable advice.
- 🔔 **Application Lifecycle Tracking**: Save and track benefits across states: `Interested` → `Application Started` → `Submitted` → `Approved`.
- ⏰ **Upcoming Deadline Alerts**: Visual countdowns and warning cards.
- 🌐 **Telugu Language Support (నా హక్కు)**: Seamless bilingual UI toggle between English and తెలుగు.
- 🤖 **Ask ClaimIt AI Assistant**: Conversational assistant answering document questions, eligibility explanations, and application steps.
- ⚡ **One-Click Demo Mode**: Pre-populates a realistic student profile ("Demo Student", Age 20, Telangana, Income ₹2.5L, CGPA 8.2) to evaluate matching instantaneously.

---

## 3. Technology Stack

- **Frontend**: Semantic HTML5, Responsive CSS3 (Custom Design System with Inter & Plus Jakarta typography), Vanilla JavaScript (No React/Vue/Angular).
- **Backend**: Java 17, Spring Boot 3.2+, Spring Data JPA, Spring Web MVC.
- **Database**: MySQL 8.0+ (`claimit_db`) with indexed foreign keys and relationships.
- **Build & Management**: Apache Maven.

---

## 4. Architecture & Database Schema

```
users (1) ────────── (1) user_profiles
  │
  └── (1:N) applications (N:1) ────── schemes (1)
                                         ├── (1:N) eligibility_rules
                                         ├── (1:N) scheme_documents (N:1) ── documents
                                         └── (1:N) application_steps
```

### Table Structure
- `users`: Core account details.
- `user_profiles`: Domicile, occupation, education, income, social category, CGPA.
- `schemes`: Scheme metadata, verified portal links, category, max benefit amount.
- `eligibility_rules`: Rule constraints (income caps, permitted states, occupation filters).
- `documents` & `scheme_documents`: Required paperwork, verification notes, and certificates.
- `application_steps`: Step-by-step application pipeline.
- `applications`: User application statuses (`Interested`, `Application Started`, `Submitted`, etc.).
- `notifications`: Deadline reminders and match alerts.

---

## 5. REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/schemes` | Retrieve all active schemes |
| `GET` | `/api/schemes/{id}` | Scheme details, rules, documents, and steps |
| `GET` | `/api/schemes/category/{category}` | Filter schemes by category |
| `POST` | `/api/users` | Create or update user profile |
| `GET` | `/api/users/{id}` | Get user and profile details |
| `GET` | `/api/users/demo` | Fetch pre-seeded demo user |
| `GET` | `/api/users/{id}/benefits` | Run eligibility engine for user |
| `GET` | `/api/users/{id}/dashboard` | Retrieve consolidated dashboard metrics |
| `POST` | `/api/eligibility/check` | Test raw profile criteria on-the-fly |
| `POST` | `/api/applications` | Save or update application tracking status |
| `GET` | `/api/applications/user/{userId}` | List applications for user |
| `PUT` | `/api/applications/{id}/status` | Update tracking state |
| `GET` | `/api/notifications/{userId}` | Fetch user notifications and alerts |
| `POST` | `/api/ai/ask` | Ask ClaimIt assistant (rules & explanations) |

---

## 6. How to Run Locally in VS Code

### Prerequisites
1. **Java Development Kit (JDK 17 or higher)**
2. **Apache Maven 3.8+**
3. **MySQL Server 8.0+**

### Step 1: Clone Repository
```bash
git clone https://github.com/your-org/claimit.git
cd claimit
```

### Step 2: Set Up MySQL Database
Log into MySQL and execute the schema and sample data scripts:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/sample_data.sql
```

### Step 3: Configure `src/main/resources/application.properties`
Ensure your database credentials match your local MySQL configuration:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/claimit_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```
*(Or set environment variables `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`)*

### Step 4: Build and Run with Maven
```bash
mvn clean install
mvn spring-boot:run
```

### Step 5: Open the Application
Open your browser and navigate to:
```
http://localhost:8080
```

---

## 7. Hackathon Presentation & Product Narrative

> **Story**: "People shouldn't have to search hundreds of government portals to find benefits they already qualify for. **ClaimIt** turns public welfare discovery on its head: from *searching blindly* to *intelligent matching, clear explanations, and guided claiming*."

- **Discovery**: Instantly maps users to relevant schemes.
- **Explainability**: Clear visual breakdown of why a citizen is eligible.
- **Empowerment**: Eliminates documentation anxiety with interactive readiness checklists.
- **Inclusivity**: Native Telugu language interface (నా హక్కు).
