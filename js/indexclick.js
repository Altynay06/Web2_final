 document.querySelectorAll(".movie-card img").forEach(img => {
    img.addEventListener("click", () => {
      const title = img.alt.trim();
      window.location.href = `movie-details.html?title=${encodeURIComponent(title)}`;
    });
  });