document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  // Elements
  const phoneInput = document.getElementById("phone");
  const requestPairingBtn = document.getElementById("requestPairing");
  const statusEl = document.getElementById("status");

  // Request pairing code
  requestPairingBtn.addEventListener("click", async () => {
    const number = phoneInput.value.trim();
    if (!number) {
      showStatus("❌ Please enter your phone number (with country code).", "error");
      return;
    }

    // Validate phone number format (basic validation)
    if (!/^[0-9]{8,15}$/.test(number.replace(/\D/g, ''))) {
      showStatus("❌ Please enter a valid phone number (digits only, 8-15 characters).", "error");
      return;
    }

    showStatus("<span class='spinner'></span> Requesting pairing code...", "loading");

    try {
      const res = await fetch("/api/pair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        showStatus("❌ Error: " + (data.error || "Failed to request pairing"), "error");
        return;
      }

      const code = (data.pairingCode || "").toString().trim();
      const spacedCode = code.split("").join(" ");
      
      showStatus(`
        <div style="text-align: center;">
          <p style="margin-bottom: 16px;">✅ Pairing code for <strong>${number}</strong>:</p>
          <div class="pairing-code" id="pairingCode">${spacedCode}</div>
          <p><small>Click the code to copy — then enter it in WhatsApp to complete pairing.</small></p>
        </div>
      `, "success");

      // Add copy functionality
      const pairingEl = document.getElementById("pairingCode");
      if (pairingEl) {
        pairingEl.addEventListener("click", () => {
          navigator.clipboard.writeText(code)
            .then(() => {
              const originalText = pairingEl.textContent;
              pairingEl.textContent = "Copied!";
              pairingEl.style.letterSpacing = "1px";
              
              setTimeout(() => {
                pairingEl.textContent = originalText;
                pairingEl.style.letterSpacing = "8px";
              }, 1500);
            })
            .catch(() => {
              showStatus("❌ Failed to copy to clipboard. Please manually copy the code.", "error");
            });
        });
      }
    } catch (err) {
      console.error("Pairing request failed", err);
      showStatus("❌ Failed to request pairing code (network or server error).", "error");
    }
  });

  // Show status message with animation
  function showStatus(message, type = "") {
    statusEl.innerHTML = message;
    statusEl.className = "";
    if (type) statusEl.classList.add(type);
    statusEl.classList.add("fade-in");
  }

  // Socket: Linked event
  socket.on("linked", ({ sessionId }) => {
    showStatus(`
      <div style="text-align: center; color: var(--success);">
        <i class="fas fa-check-circle" style="font-size: 2.5rem; margin-bottom: 16px;"></i>
        <h3>✅ Successfully Linked!</h3>
        <p>Your device has been successfully connected. You can now use Tracle-Lite features.</p>
        <p><small>Session ID: ${sessionId}</small></p>
      </div>
    `, "success");
    
    // Reset the form after successful pairing
    phoneInput.value = "";
  });

  // Socket: pairing timeout
  socket.on("pairingTimeout", ({ number }) => {
    showStatus(`
      <div style="text-align: center; color: var(--warning);">
        <i class="fas fa-clock" style="font-size: 2rem; margin-bottom: 12px;"></i>
        <p>⏰ Pairing code for ${number} has expired.</p>
        <p>Please request a new code if you still need to connect.</p>
      </div>
    `, "warning");
  });

  // Handle Enter key in phone input
  phoneInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      requestPairingBtn.click();
    }
  });

  // Input validation for phone number
  phoneInput.addEventListener("input", function(e) {
    this.value = this.value.replace(/\D/g, '');
  });

  // Add visual feedback for loading state
  requestPairingBtn.addEventListener("click", function() {
    this.classList.add("loading");
    setTimeout(() => this.classList.remove("loading"), 3000);
  });
});