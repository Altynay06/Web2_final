document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".contact-form");
  const submitBtn = form.querySelector(".submit-button");

  const successMessage = document.createElement("div");
  successMessage.className = "success-message";
  successMessage.textContent = "Message sent successfully!";
  form.appendChild(successMessage);

  const errorMessage = document.createElement("div");
  errorMessage.className = "error-message";
  errorMessage.textContent = "⚠ Please fill out all required fields correctly.";
  form.appendChild(errorMessage);

  function validateForm() {
    const name = form.querySelector("#full-name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const message = form.querySelector("#message").value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name === "" || email === "" || message === "" || !emailPattern.test(email)) {
      errorMessage.style.display = "block";
      successMessage.style.display = "none";
      return false;
    }

    errorMessage.style.display = "none";
    return true;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Please wait...`;
    submitBtn.disabled = true;

    setTimeout(() => {
      fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: JSON.stringify({
          name: form.querySelector("#full-name").value,
          email: form.querySelector("#email").value,
          message: form.querySelector("#message").value,
        }),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Network error");
          return response.json();
        })
        .then(() => {
          successMessage.style.display = "block";
          form.reset();
        })
        .catch(() => {
          errorMessage.textContent = "Something went wrong. Try again later.";
          errorMessage.style.display = "block";
        })
        .finally(() => {
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
        });
    }, 1500); 
  });
});
