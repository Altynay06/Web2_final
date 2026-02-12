document.addEventListener('DOMContentLoaded', function() {
    const datetimeElement = document.getElementById('currentDateTime');

    if (!datetimeElement) {
        console.error("Element with ID 'currentDateTime' not found.");
        return;
    }

    function updateDateTime() {
        const now = new Date();
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };

        const formattedDate = now.toLocaleDateString('en-US', options);
        datetimeElement.textContent = formattedDate;
    }

    updateDateTime();
    setInterval(updateDateTime, 60000);
});
