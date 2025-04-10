document.addEventListener("DOMContentLoaded", function () {
    const monthYear = document.getElementById("calendar-month-year");
    const calendar = document.getElementById("calendar");
    const prevBtn = document.getElementById("prev-month");
    const nextBtn = document.getElementById("next-month");

    let date = new Date();
    let selectedStatus = true;
    let medicationLog = JSON.parse(localStorage.getItem("medicationLog")) || {};
    let customTimes = JSON.parse(localStorage.getItem("customTimes")) || {
        morning: "08:00:00",
        afternoon: "14:00:00",
        evening: "20:00:00"
    };

    function renderCalendar() {
        calendar.innerHTML = "";
        monthYear.textContent = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });

        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        let daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            calendar.innerHTML += "<div></div>";
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const day = document.createElement("div");
            day.className = "day";
            day.innerHTML = `<strong>${i}</strong>`;
            const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;

            ["morning", "afternoon", "evening"].forEach((time) => {
                const slot = document.createElement("div");
                slot.className = `slot ${time}`;
                slot.textContent = time;

                if (medicationLog[dateString] && medicationLog[dateString][time] !== undefined) {
                    slot.classList.add(medicationLog[dateString][time] ? "taken" : "missed");
                }

                slot.addEventListener("click", () => {
                    if (!medicationLog[dateString]) medicationLog[dateString] = {};
                    medicationLog[dateString][time] = selectedStatus;
                    slot.classList.toggle("taken", selectedStatus);
                    slot.classList.toggle("missed", !selectedStatus);
                    localStorage.setItem("medicationLog", JSON.stringify(medicationLog));
                });

                day.appendChild(slot);
            });

            calendar.appendChild(day);
        }
    }

    function scheduleAlerts() {
        Object.entries(customTimes).forEach(([timeName, timeValue]) => {
            const now = new Date();
            const alertTime = new Date();
            const [hours, minutes, seconds] = timeValue.split(":").map(Number);
            alertTime.setHours(hours, minutes, seconds, 0);

            const timeDiff = alertTime - now;

            if (timeDiff > 0) {
                setTimeout(() => {
                    const message = `💊 Reminder: It's time to take your ${timeName} medication!`;

                    if (Notification.permission === "granted") {
                        new Notification(message);
                    } else if (Notification.permission !== "denied") {
                        Notification.requestPermission().then((permission) => {
                            if (permission === "granted") {
                                new Notification(message);
                            } else {
                                alert(message); // fallback if denied
                            }
                        });
                    } else {
                        alert(message); // fallback if already denied
                    }
                }, timeDiff);
            }
        });
    }

    prevBtn.addEventListener("click", () => {
        date.setMonth(date.getMonth() - 1);
        renderCalendar();
    });

    nextBtn.addEventListener("click", () => {
        date.setMonth(date.getMonth() + 1);
        renderCalendar();
    });

    document.getElementById("acknowledgment-form")?.addEventListener("submit", function (event) {
        event.preventDefault();
        const selection = document.getElementById("medication-taken").value;
        const notificationBox = document.getElementById("notification");

        const message = `You selected "${selection}" for medication.`;

        if (Notification.permission === "granted") {
            new Notification(message);
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    new Notification(message);
                } else {
                    alert(message);
                }
            });
        } else {
            alert(message);
        }

        notificationBox.classList.remove("hidden");
        notificationBox.querySelector("p").textContent = `Notification sent regarding "${selection}" medication.`;
    });

    document.getElementById("successful-dose")?.addEventListener("click", () => selectedStatus = true);
    document.getElementById("unsuccessful-dose")?.addEventListener("click", () => selectedStatus = false);

    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    renderCalendar();
    scheduleAlerts();
});
