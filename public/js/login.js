/**
 * CLAIMIT (నా హక్కు) - Authentication & Login Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  initAuthTabs();
  initOtpFlow();
  initPasswordLogin();
  initDemoPersonas();
  initRegisterForm();
  updateAuthTranslations();

  window.addEventListener("claimit_lang_change", () => {
    updateAuthTranslations();
  });
});

function initAuthTabs() {
  const tabs = document.querySelectorAll(".auth-tab-btn");
  const contents = {
    otp: document.getElementById("tabContentOtp"),
    password: document.getElementById("tabContentPassword"),
    demo: document.getElementById("tabContentDemo"),
    register: document.getElementById("tabContentRegister")
  };

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const target = tab.getAttribute("data-tab");
      Object.keys(contents).forEach(key => {
        if (contents[key]) {
          contents[key].style.display = key === target ? "block" : "none";
        }
      });
    });
  });
}

function initOtpFlow() {
  const step1Form = document.getElementById("otpStep1Form");
  const step2Form = document.getElementById("otpStep2Form");
  const identifierInput = document.getElementById("otpIdentifierInput");
  const sentTargetDisplay = document.getElementById("sentTargetDisplay");
  const btnAutoFillOtp = document.getElementById("btnAutoFillOtp");
  const btnBackToStep1 = document.getElementById("btnBackToStep1");
  const otpBoxes = document.querySelectorAll(".otp-box");

  let countdownInterval = null;

  // Auto-focus next box on typing
  otpBoxes.forEach((box, index) => {
    box.addEventListener("input", (e) => {
      const val = e.target.value;
      if (val.length === 1 && index < otpBoxes.length - 1) {
        otpBoxes[index + 1].focus();
      }
    });

    box.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !box.value && index > 0) {
        otpBoxes[index - 1].focus();
      }
    });
  });

  if (step1Form) {
    step1Form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const identifier = identifierInput.value.trim();
      if (!identifier) return;

      const btn = document.getElementById("btnSendOtp");
      btn.disabled = true;
      btn.innerText = "Dispatching OTP...";

      try {
        const resp = await ClaimItApi.sendOtp(identifier);
        showToast(resp.message || "OTP Sent! Demo code: 123456", "success");
        if (sentTargetDisplay) {
          sentTargetDisplay.innerText = identifier;
        }

        step1Form.style.display = "none";
        step2Form.style.display = "block";
        startOtpCountdown();

        // Focus first OTP box
        if (otpBoxes[0]) otpBoxes[0].focus();
      } catch (err) {
        showToast("Error requesting OTP. Please try again.", "error");
      } finally {
        btn.disabled = false;
        btn.innerText = "Get Verification OTP →";
      }
    });
  }

  if (btnAutoFillOtp) {
    btnAutoFillOtp.addEventListener("click", () => {
      const code = "123456";
      otpBoxes.forEach((box, i) => {
        box.value = code[i];
      });
      showToast("Demo OTP 123456 filled", "info");
      if (otpBoxes[5]) otpBoxes[5].focus();
    });
  }

  if (btnBackToStep1) {
    btnBackToStep1.addEventListener("click", () => {
      step2Form.style.display = "none";
      step1Form.style.display = "block";
      clearInterval(countdownInterval);
    });
  }

  if (step2Form) {
    step2Form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const enteredOtp = Array.from(otpBoxes).map(b => b.value).join("");
      const identifier = identifierInput.value.trim();

      const btn = document.getElementById("btnVerifyOtp");
      btn.disabled = true;
      btn.innerText = "Verifying...";

      try {
        const res = await ClaimItApi.verifyOtp(identifier, enteredOtp);
        if (res.success) {
          showToast(`✓ Welcome, ${res.user ? res.user.fullName : 'Citizen'}!`, "success");
          setTimeout(() => {
            window.location.href = "dashboard.html";
          }, 800);
        } else {
          showToast(res.message || "Invalid OTP code", "error");
        }
      } catch (err) {
        showToast("Verification failed", "error");
      } finally {
        btn.disabled = false;
        btn.innerText = "Verify & Sign In";
      }
    });
  }

  function startOtpCountdown() {
    let timeLeft = 300;
    const timerElem = document.getElementById("otpTimer");
    clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        if (timerElem) timerElem.innerText = "Expired";
        return;
      }
      const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
      const secs = String(timeLeft % 60).padStart(2, '0');
      if (timerElem) timerElem.innerText = `${mins}:${secs}`;
    }, 1000);
  }
}

function initPasswordLogin() {
  const form = document.getElementById("passwordLoginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const identifier = document.getElementById("loginEmailInput").value.trim();
    const password = document.getElementById("loginPasswordInput").value;

    const res = await ClaimItApi.login({ identifier, password, authType: "password" });
    if (res.success) {
      showToast(`✓ Signed in as ${res.user ? res.user.fullName : 'Citizen'}`, "success");
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 700);
    } else {
      showToast(res.message || "Login failed", "error");
    }
  });

  const linkForgot = document.getElementById("linkForgotPwd");
  if (linkForgot) {
    linkForgot.addEventListener("click", (e) => {
      e.preventDefault();
      showToast("Password reset link will be sent to registered mobile/email in live portal.", "info");
    });
  }
}

function initDemoPersonas() {
  const cards = document.querySelectorAll(".persona-card");
  cards.forEach(card => {
    card.addEventListener("click", async () => {
      const persona = card.getAttribute("data-persona");
      card.style.opacity = "0.7";
      showToast(`⚡ Loading persona: ${persona}...`, "info");

      const res = await ClaimItApi.loginDemoPersona(persona);
      if (res.success) {
        showToast(`✓ Signed in as ${res.user.fullName}`, "success");
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 600);
      }
    });
  });
}

function initRegisterForm() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fullName = document.getElementById("regNameInput").value.trim();
    const phone = document.getElementById("regPhoneInput").value.trim();
    const email = document.getElementById("regEmailInput").value.trim();
    const state = document.getElementById("regStateInput").value;
    const occupation = document.getElementById("regOccupationInput").value;
    const annualIncome = document.getElementById("regIncomeInput").value;

    const res = await ClaimItApi.register({
      fullName,
      phone,
      email,
      state,
      occupation,
      annualIncome
    });

    if (res.success) {
      showToast(`✓ Welcome to ClaimIt, ${fullName}! Taking you to complete your profile.`, "success");
      setTimeout(() => {
        window.location.href = "profile.html";
      }, 900);
    }
  });
}

function updateAuthTranslations() {
  const isTe = localStorage.getItem("claimit_lang") === "te";
  const title = document.getElementById("authTitle");
  const subtitle = document.getElementById("authSubtitle");

  if (title) {
    title.innerText = isTe ? "పౌర లాగిన్ (Citizen Sign In)" : "Citizen Sign In";
  }
  if (subtitle) {
    subtitle.innerText = isTe
      ? "మీ అర్హత గల పథకాలు, దరఖాస్తులు మరియు రికార్డులను సురక్షితంగా వీక్షించండి."
      : "Sign in to view your matched schemes, eligibility scores, and track submitted applications.";
  }
}
