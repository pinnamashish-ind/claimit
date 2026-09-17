/**
 * CLAIMIT - Profile Form Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("profile-form");
  const occSelect = document.getElementById("occupation");
  const studentFields = document.getElementById("student-fields");
  const fillDemoBtn = document.getElementById("btn-fill-demo");
  const quickDemoBtn = document.getElementById("btn-quick-demo");

  // Dynamic occupation fields
  function updateOccupationFields() {
    if (occSelect.value === "Student") {
      studentFields.style.display = "grid";
    } else {
      studentFields.style.display = "none";
    }
  }

  occSelect.addEventListener("change", updateOccupationFields);
  updateOccupationFields();

  // Populate demo values
  function fillDemoData() {
    const d = ClaimItApi.demoProfile;
    document.getElementById("fullName").value = d.fullName;
    document.getElementById("email").value = d.email;
    document.getElementById("age").value = d.age;
    document.getElementById("gender").value = d.gender;
    document.getElementById("state").value = d.state;
    document.getElementById("district").value = d.district;
    document.getElementById("occupation").value = d.occupation;
    document.getElementById("educationLevel").value = d.educationLevel;
    document.getElementById("annualIncome").value = d.annualIncome;
    document.getElementById("category").value = d.category;
    document.getElementById("hasDisability").checked = d.hasDisability;
    document.getElementById("institutionName").value = d.institutionName;
    document.getElementById("course").value = d.course;
    document.getElementById("studyYear").value = d.studyYear;
    document.getElementById("cgpa").value = d.cgpa;
    updateOccupationFields();
    showToast("⚡ Demo Student data loaded into form!", "success");
  }

  fillDemoBtn?.addEventListener("click", fillDemoData);
  quickDemoBtn?.addEventListener("click", fillDemoData);

  // Check if existing user stored
  const saved = ClaimItApi.getCurrentUser();
  if (saved) {
    document.getElementById("fullName").value = saved.fullName || "";
    document.getElementById("email").value = saved.email || "";
    document.getElementById("age").value = saved.age || "";
    if (saved.gender) document.getElementById("gender").value = saved.gender;
    if (saved.state) document.getElementById("state").value = saved.state;
    document.getElementById("district").value = saved.district || "";
    if (saved.occupation) document.getElementById("occupation").value = saved.occupation;
    if (saved.educationLevel) document.getElementById("educationLevel").value = saved.educationLevel;
    document.getElementById("annualIncome").value = saved.annualIncome || "";
    if (saved.category) document.getElementById("category").value = saved.category;
    document.getElementById("hasDisability").checked = !!saved.hasDisability;
    document.getElementById("institutionName").value = saved.institutionName || "";
    document.getElementById("course").value = saved.course || "";
    document.getElementById("studyYear").value = saved.studyYear || "";
    document.getElementById("cgpa").value = saved.cgpa || "";
    updateOccupationFields();
  }

  // Handle Form Submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const profileData = {
      fullName: document.getElementById("fullName").value.trim(),
      email: document.getElementById("email").value.trim(),
      age: parseInt(document.getElementById("age").value),
      gender: document.getElementById("gender").value,
      state: document.getElementById("state").value,
      district: document.getElementById("district").value.trim(),
      occupation: document.getElementById("occupation").value,
      educationLevel: document.getElementById("educationLevel").value,
      annualIncome: parseFloat(document.getElementById("annualIncome").value),
      category: document.getElementById("category").value,
      hasDisability: document.getElementById("hasDisability").checked,
      institutionName: document.getElementById("institutionName").value.trim(),
      course: document.getElementById("course").value.trim(),
      studyYear: parseInt(document.getElementById("studyYear").value) || null,
      cgpa: parseFloat(document.getElementById("cgpa").value) || null
    };

    showToast("Evaluating your profile against all active schemes...", "info");
    const submitBtn = document.getElementById("btn-submit-eval");
    submitBtn.disabled = true;
    submitBtn.innerText = "Evaluating Eligibility Engine...";

    try {
      await ClaimItApi.saveUserProfile(profileData);
      setTimeout(() => {
        window.location.href = "schemes.html?matched=true";
      }, 500);
    } catch (err) {
      console.error(err);
      window.location.href = "schemes.html?matched=true";
    }
  });
});
