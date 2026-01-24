document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("email-input");
  const submitBtn = document.getElementById("submit-email");
  const message = document.getElementById("email-msg");

  const ENDPOINT_URL =
    "https://script.google.com/macros/s/AKfycbxbqAEIqp3zBMFLd0mIhcmc1d7G0bo8s_Y8nLLEpvNRW4GOV8t-zSJ3dEW4P8ayajDv/exec";

  function showMessage(html, color) {
    message.style.display = "block";
    message.style.color = color;
    message.innerHTML = html;
    setTimeout(() => (message.style.display = "none"), 4000);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function submitEmail() {
    const email = emailInput.value.trim();

    if (!isValidEmail(email)) {
      showMessage("Please enter Valid email ID", "red");
      return;
    }

    submitBtn.disabled = true;

    try {
      const res = await fetch(ENDPOINT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        showMessage(
          "Thank you for giving your email ID. Our " +
          "<b style='color:green'>support@rftalent.in</b> from " +
          "<b style='color:green'>rftalent.in</b> will reach out to you.",
          "black"
        );
        emailInput.value = "";
      } else {
        showMessage("Submission failed. Try again.", "red");
      }
    } catch {
      showMessage("Network error.", "red");
    }

    submitBtn.disabled = false;
  }

  submitBtn.addEventListener("click", submitEmail);
  emailInput.addEventListener("keydown", e => {
    if (e.key === "Enter") submitEmail();
  });
});
