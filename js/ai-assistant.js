/**
 * CLAIMIT (నా హక్కు) - AI Assistant Modal & Interaction Script
 */

const AiAssistant = {
  isOpen: false,
  activeSchemeId: null,

  init() {
    this.injectUi();
    this.bindEvents();
  },

  injectUi() {
    // Check if already injected
    if (document.getElementById("ai-assistant-root")) return;

    const root = document.createElement("div");
    root.id = "ai-assistant-root";
    root.innerHTML = `
      <!-- Floating Trigger Button -->
      <button id="ai-trigger-btn" class="ai-trigger-btn" title="Ask ClaimIt AI">
        <span>🤖</span>
        <span data-i18n="btn_ask_ai">Ask ClaimIt AI</span>
      </button>

      <!-- AI Modal / Drawer -->
      <div id="ai-modal-overlay" class="ai-modal-overlay">
        <div class="ai-chat-box">
          <div class="ai-chat-header">
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="font-size:24px;">🤖</span>
              <div>
                <h4 style="font-size:16px; font-weight:700;">ClaimIt Assistant (నా హక్కు)</h4>
                <p style="font-size:12px; opacity:0.8;">Answers eligibility, document & step questions</p>
              </div>
            </div>
            <button id="ai-close-btn" style="background:none; border:none; color:#fff; font-size:22px; cursor:pointer;">&times;</button>
          </div>

          <div id="ai-chat-messages" class="ai-chat-messages">
            <div class="chat-bubble assistant">
              Namaskaram / Hello! I am your ClaimIt benefits assistant. 
              <br><br>
              How can I help you today? You can ask me about documents needed, why you qualify, or application steps in <b>English</b> or <b>తెలుగు</b>.
            </div>
          </div>

          <div id="ai-chips-row" class="ai-chips-row">
            <button class="ai-chip" data-q="What documents do I need?">📋 What documents do I need?</button>
            <button class="ai-chip" data-q="Why am I potentially eligible?">🎯 Why do I qualify?</button>
            <button class="ai-chip" data-q="How do I apply step-by-step?">🚀 How to apply?</button>
            <button class="ai-chip" data-q="ఈ పథకానికి ఏ పత్రాలు కావాలి?">తెలుగు: ఏ పత్రాలు కావాలి?</button>
          </div>

          <form id="ai-chat-form" class="ai-chat-input-row">
            <input type="text" id="ai-user-input" class="ai-chat-input" placeholder="Type your question in English or Telugu..." required />
            <button type="submit" class="btn btn-primary btn-sm">Send</button>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(root);
  },

  bindEvents() {
    const trigger = document.getElementById("ai-trigger-btn");
    const overlay = document.getElementById("ai-modal-overlay");
    const close = document.getElementById("ai-close-btn");
    const form = document.getElementById("ai-chat-form");
    const input = document.getElementById("ai-user-input");

    trigger?.addEventListener("click", () => this.open());
    close?.addEventListener("click", () => this.close());
    overlay?.addEventListener("click", (e) => {
      if (e.target === overlay) this.close();
    });

    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      this.handleUserQuestion(text);
      input.value = "";
    });

    document.querySelectorAll(".ai-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const q = chip.getAttribute("data-q");
        this.handleUserQuestion(q);
      });
    });
  },

  open(schemeId = null) {
    this.activeSchemeId = schemeId;
    const overlay = document.getElementById("ai-modal-overlay");
    if (overlay) overlay.classList.add("open");
    this.isOpen = true;
  },

  close() {
    const overlay = document.getElementById("ai-modal-overlay");
    if (overlay) overlay.classList.remove("open");
    this.isOpen = false;
  },

  appendMessage(text, sender = "assistant") {
    const container = document.getElementById("ai-chat-messages");
    if (!container) return;

    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${sender}`;
    bubble.innerHTML = text.replace(/\n/g, "<br>");
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
  },

  async handleUserQuestion(question) {
    this.appendMessage(question, "user");

    // Loading indicator bubble
    const loadingId = "ai-loading-" + Date.now();
    const container = document.getElementById("ai-chat-messages");
    const loadingBubble = document.createElement("div");
    loadingBubble.id = loadingId;
    loadingBubble.className = "chat-bubble assistant";
    loadingBubble.innerHTML = "<em>Analyzing scheme rules and documents...</em>";
    container.appendChild(loadingBubble);
    container.scrollTop = container.scrollHeight;

    const res = await ClaimItApi.askAi(question, this.activeSchemeId);

    const loader = document.getElementById(loadingId);
    if (loader) loader.remove();

    this.appendMessage(res.answer || "I could not retrieve information on that topic. Please verify official guidelines.");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  AiAssistant.init();
});
