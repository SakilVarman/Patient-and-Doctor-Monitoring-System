document.addEventListener("DOMContentLoaded", function () {
    const monthYear = document.getElementById("calendar-month-year");
    const calendar = document.getElementById("calendar");
    const prevBtn = document.getElementById("prev-month");
    const nextBtn = document.getElementById("next-month");

    let date = new Date();
    
    function renderCalendar() {
        calendar.innerHTML = "";
        monthYear.textContent = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });

        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        let daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            calendar.innerHTML += "<div></div>";
        }

        for (let i = 1; i <= daysInMonth; i++) {
            calendar.innerHTML += `<div>${i}</div>`;
        }
    }

    prevBtn.addEventListener("click", () => {
        date.setMonth(date.getMonth() - 1);
        renderCalendar();
    });

    nextBtn.addEventListener("click", () => {
        date.setMonth(date.getMonth() + 1);
        renderCalendar();
    });

    renderCalendar();

    document.getElementById("acknowledgment-form").addEventListener("submit", function (event) {
        event.preventDefault();
        let selection = document.getElementById("medication-taken").value;
        if (selection === "no") {
            document.getElementById("notification").classList.remove("hidden");
        }
    });
});
