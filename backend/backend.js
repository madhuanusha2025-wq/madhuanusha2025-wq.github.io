(function () {
    const emailInput = document.getElementById("email-input");
    const submitBtn = document.getElementById("submit-email");
    const message = document.getElementById("email-msg");

    // === CONFIG: Replace with your actual backend or Apps Script URL ===
    const ENDPOINT_URL = "https://script.google.com/macros/s/YOUR_DEPLOYED_SCRIPT_ID/exec";
    // Example for local testing:
    // const ENDPOINT_URL = "http://localhost:5000/save";

    function showMessage(text, color = "black") {
        message.style.display = "block";
        message.style.color = color;
        message.innerHTML = text;
        setTimeout(() => (message.style.display = "none"), 4000);
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    async function submitEmail() {
        const email = emailInput.value.trim();

        if (!isValidEmail(email)) {
            showMessage("Please enter a valid email ID.", "red");
            return;
        }

        submitBtn.disabled = true;
        showMessage("Submitting...", "gray");

        try {
            const response = await fetch(ENDPOINT_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                showMessage(
                    "Thank you for registering.<br>Our support team will contact you from <b style='color:green'>rftsupport@rightfittalent.com</b>.",
                    "black"
                );
                emailInput.value = "";
            } else {
                showMessage("Submission failed. Please try again later.", "red");
            }
        } catch (error) {
            showMessage("Network error. Please check your connection.", "red");
        } finally {
            submitBtn.disabled = false;
        }
    }

    emailInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") submitEmail();
    });
    submitBtn.addEventListener("click", submitEmail);
    await logEmailToGitHub(email);
})();
async function logEmailToGitHub(email) {
  const repoOwner = "madhuanusha2025-wq";
  const repoName = "madhuanusha2025-wq.github.io";
  const filePath = "data/email_log.csv";
  const token = "YOUR_GITHUB_PAT_HERE"; // <-- replace with your token

  const date = new Date();
  const formattedDate = date.toLocaleDateString("en-GB");
  const formattedTime = date.toLocaleTimeString("en-GB");
  const newLine = `${formattedDate},${formattedTime},${email}\n`;

  // Step 1: Fetch current file content
  const getUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
  const getResponse = await fetch(getUrl, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const fileData = await getResponse.json();
  const oldContent = atob(fileData.content);
  const updatedContent = oldContent + newLine;

  // Step 2: Push the updated content
  await fetch(getUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: `Log email: ${email}`,
      content: btoa(updatedContent),
      sha: fileData.sha
    })
  });
}
