document.addEventListener('DOMContentLoaded', () => {
    const calendar = document.getElementById('calendar');
    const monthYearDisplay = document.getElementById('calendar-month-year');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    const medicationSelect = document.getElementById('medication-taken');
    const submitButton = document.getElementById('submit-button');

    const today = new Date(); // Get current date from the user's system
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    // Object to track the ticked days (store it in memory or localStorage if persistence is needed)
    let medicationTakenDays = JSON.parse(localStorage.getItem('medicationTakenDays')) || {};

    // Function to generate the calendar
    function generateCalendar(month, year) {
        calendar.innerHTML = '';
        monthYearDisplay.textContent = `${getMonthName(month)} ${year}`;
        
        // Days of the week
        const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        daysOfWeek.forEach(day => {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day', 'day-name');
            dayDiv.textContent = day;
            calendar.appendChild(dayDiv);
        });

        // Get the number of days in the month and the start day
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();

        // Fill in the blank spaces before the first day
        for (let i = 0; i < firstDay; i++) {
            const blankDiv = document.createElement('div');
            blankDiv.classList.add('day', 'blank-day');
            calendar.appendChild(blankDiv);
        }

        // Generate the days in the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day');
            dayDiv.textContent = day;

            // Highlight today's date based on the user's system date
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayDiv.classList.add('highlighted');  // Add class for highlighted day
            }

            // Check if the day has been ticked (marked as medication taken)
            if (medicationTakenDays[`${day}-${month}-${year}`]) {
                dayDiv.classList.add('ticked');
            }

            calendar.appendChild(dayDiv);
        }
    }

    // Function to get the month name
    function getMonthName(monthIndex) {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June', 
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return monthNames[monthIndex];
    }

    // Handle previous and next month buttons
    prevMonthButton.addEventListener('click', () => {
        currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
        currentYear = (currentMonth === 11) ? currentYear - 1 : currentYear;
        generateCalendar(currentMonth, currentYear);
    });

    nextMonthButton.addEventListener('click', () => {
        currentMonth = (currentMonth === 11) ? 0 : currentMonth + 1;
        currentYear = (currentMonth === 0) ? currentYear + 1 : currentYear;
        generateCalendar(currentMonth, currentYear);
    });

    // Handle acknowledgment submission
    submitButton.addEventListener('click', () => {
        const selectedOption = medicationSelect.value;
        if (selectedOption === 'yes') {
            // Track that the user has taken the medication on the current day
            medicationTakenDays[`${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`] = true;
            localStorage.setItem('medicationTakenDays', JSON.stringify(medicationTakenDays)); // Store the state in localStorage
            generateCalendar(currentMonth, currentYear); // Regenerate the calendar with updated tick
        }
    });

    // Initial Calendar generation
    generateCalendar(currentMonth, currentYear);
});
