
document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("theme-toggle");
    const body = document.body;
    
    const savedTheme = localStorage.getItem("theme");
    
    if (savedTheme === "light") {
        body.classList.add("light-theme");
        toggleBtn.textContent = "🌞";
        updateLogoForTheme("light");
    } else {
        body.classList.remove("light-theme");
        toggleBtn.textContent = "🌙";
        updateLogoForTheme("dark");
    }

    toggleBtn.addEventListener("click", () => {
        if (body.classList.contains("light-theme")) {
            body.classList.remove("light-theme");
            localStorage.setItem("theme", "dark");
            toggleBtn.textContent = "🌙";
            updateLogoForTheme("dark");
        } else {
            body.classList.add("light-theme");
            localStorage.setItem("theme", "light");
            toggleBtn.textContent = "🌞";
            updateLogoForTheme("light");
        }
    });
    
    function updateLogoForTheme(theme) {
    const logos = document.querySelectorAll('img[data-light]');
    logos.forEach(logo => {
        if (theme === "light") {
            logo.src = logo.getAttribute('data-light');
        } else {
            logo.src = 'images/logo.jpg'; 
        }
    });
}
});