-- =======================================================
-- CLAIMIT (నా హక్కు - Naa Hakku) Database Schema
-- Database: claimit_db (MySQL 8.0+)
-- =======================================================

CREATE DATABASE IF NOT EXISTS claimit_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE claimit_db;

-- Drop tables in reverse foreign key order if re-running
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS application_steps;
DROP TABLE IF EXISTS scheme_documents;
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS eligibility_rules;
DROP TABLE IF EXISTS schemes;
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS users;

-- 1. Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20),
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. User Profiles Table (One-to-One with Users)
CREATE TABLE user_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    occupation VARCHAR(50) NOT NULL,
    education_level VARCHAR(50) NOT NULL,
    annual_income DECIMAL(12, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    has_disability BOOLEAN DEFAULT FALSE,
    employment_status VARCHAR(50) NOT NULL,
    institution_name VARCHAR(200),
    course VARCHAR(150),
    study_year INT,
    cgpa DECIMAL(4, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_profile_criteria (occupation, education_level, annual_income, state)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Schemes Table
CREATE TABLE schemes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    title_te VARCHAR(255),
    category VARCHAR(80) NOT NULL,
    short_description TEXT NOT NULL,
    short_description_te TEXT,
    detailed_description LONGTEXT,
    target_beneficiaries VARCHAR(255) NOT NULL,
    min_benefit_amount DECIMAL(12, 2),
    max_benefit_amount DECIMAL(12, 2),
    benefit_display VARCHAR(100) NOT NULL,
    benefit_type VARCHAR(50) DEFAULT 'Grant',
    deadline DATE,
    official_portal_url VARCHAR(255) NOT NULL,
    info_source VARCHAR(150) NOT NULL,
    last_verified DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_scheme_cat (category),
    INDEX idx_scheme_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Eligibility Rules Table
CREATE TABLE eligibility_rules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    scheme_id BIGINT NOT NULL,
    min_age INT,
    max_age INT,
    allowed_states TEXT, -- Comma-separated list or JSON (e.g. "Telangana,All India")
    allowed_occupations TEXT, -- Comma-separated (e.g. "Student,Job Seeker")
    allowed_educations TEXT, -- Comma-separated (e.g. "Undergraduate,Postgraduate")
    max_annual_income DECIMAL(12, 2),
    allowed_categories TEXT, -- Comma-separated (e.g. "General,OBC,SC,ST")
    requires_disability BOOLEAN DEFAULT NULL,
    min_cgpa DECIMAL(4, 2) DEFAULT NULL,
    additional_notes TEXT,
    CONSTRAINT fk_rules_scheme FOREIGN KEY (scheme_id) REFERENCES schemes (id) ON DELETE CASCADE,
    INDEX idx_rule_scheme (scheme_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Master Documents Table
CREATE TABLE documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    name_te VARCHAR(150),
    description VARCHAR(255),
    is_mandatory_default BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Scheme-Document Relationship Table
CREATE TABLE scheme_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    scheme_id BIGINT NOT NULL,
    document_id BIGINT NOT NULL,
    is_mandatory BOOLEAN DEFAULT TRUE,
    notes VARCHAR(255),
    CONSTRAINT fk_sd_scheme FOREIGN KEY (scheme_id) REFERENCES schemes (id) ON DELETE CASCADE,
    CONSTRAINT fk_sd_doc FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE,
    UNIQUE KEY uq_scheme_document (scheme_id, document_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Application Steps Table
CREATE TABLE application_steps (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    scheme_id BIGINT NOT NULL,
    step_number INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    title_te VARCHAR(150),
    instructions TEXT NOT NULL,
    portal_action_type VARCHAR(50) DEFAULT 'Online Form',
    CONSTRAINT fk_steps_scheme FOREIGN KEY (scheme_id) REFERENCES schemes (id) ON DELETE CASCADE,
    INDEX idx_steps_order (scheme_id, step_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Applications Table (Tracking)
CREATE TABLE applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    scheme_id BIGINT NOT NULL,
    status ENUM('Interested', 'Application Started', 'Submitted', 'Approved', 'Rejected') DEFAULT 'Interested',
    reference_number VARCHAR(100),
    applied_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_app_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_app_scheme FOREIGN KEY (scheme_id) REFERENCES schemes (id) ON DELETE CASCADE,
    UNIQUE KEY uq_user_scheme_application (user_id, scheme_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Notifications Table
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'deadline',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_notif_user (user_id, is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
