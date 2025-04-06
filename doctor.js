document.addEventListener('DOMContentLoaded', function () {
    const patientListSection = document.getElementById('patient-list-section');
    const patientDetailsSection = document.getElementById('patient-details-section');
    const contactSection = document.getElementById('contact-section');
    const patientList = document.getElementById('patient-list');
    const patientsLink = document.getElementById('patients-link');
    const contactLink = document.getElementById('contact-link');
    const searchInput = document.getElementById('patient-search');
    const searchButton = document.getElementById('search-button');
    const notificationBox = document.createElement('div');
    
    notificationBox.id = 'notification-box';
    document.body.appendChild(notificationBox);
    
    function showNotification(message) {
        notificationBox.innerText = message;
        notificationBox.classList.add('show');
        setTimeout(() => notificationBox.classList.remove('show'), 3000);
    }

    const patients = [
        { name: "Vijay", age: 45, healthProblems: "Hypertension, Diabetes", medications: [
            { name: "Losartan", dosage: "50mg", frequency: "Once daily", time: "8:00 AM" },
            { name: "Metformin", dosage: "500mg", frequency: "Twice daily", time: "8:00 AM and 8:00 PM" },
            { name: "Insulin", dosage: "10 units", frequency: "Before meals", time: "Before breakfast, lunch, and dinner" },
        ] },
        { name: "Sakthi", age: 53, healthProblems: "Asthma", medications: [
            { name: "Albuterol", dosage: "90 mcg", frequency: "As needed", time: "As needed" },
        ] },
        { name: "Sioun", age: 19, healthProblems: "Fever", medications: [
            { name: "Albuterol", dosage: "90 mcg", frequency: "As needed", time: "As needed" },
            { name: "Metformin", dosage: "500mg", frequency: "Twice daily", time: "8:00 AM and 8:00 PM" },
        ] },
    ];

    function displayPatientList(filteredPatients) {
        patientList.innerHTML = '';
        filteredPatients.forEach((patient, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<p><strong>${patient.name}</strong> | Age: ${patient.age} | Problems: ${patient.healthProblems}</p>
                <button class="view-details" data-index="${index}">View Details</button>`;
            patientList.appendChild(listItem);
        });
        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                displayPatientDetails(filteredPatients[index]);
            });
        });
    }

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm !== "") {
            const filteredPatients = patients.filter(patient => patient.name.toLowerCase().includes(searchTerm));
            if (filteredPatients.length > 0) {
                displayPatientList(filteredPatients);
                patientListSection.classList.remove('hidden');
                patientDetailsSection.classList.add('hidden');
                contactSection.classList.add('hidden');
                showNotification('Patients found!');
            } else {
                showNotification('No matching patients found');
                patientList.innerHTML = '';
            }
        } else {
            showNotification('Please enter a patient name to search');
        }
    });

    patientsLink.addEventListener('click', () => {
        displayPatientList(patients);
        patientListSection.classList.remove('hidden');
        patientDetailsSection.classList.add('hidden');
        contactSection.classList.add('hidden');
    });

    contactLink.addEventListener('click', () => {
        contactSection.classList.remove('hidden');
        patientListSection.classList.add('hidden');
        patientDetailsSection.classList.add('hidden');
    });

    function displayPatientDetails(patient) {
        patientDetailsSection.classList.remove('hidden');
        patientListSection.classList.add('hidden');
        contactSection.classList.add('hidden');
        
        const patientInfo = document.getElementById('patient-info');
        const medicationList = document.getElementById('medication-list');
        patientInfo.innerHTML = `<p><strong>Name:</strong> ${patient.name}</p>
            <p><strong>Age:</strong> ${patient.age}</p>
            <p><strong>Health Problems:</strong> ${patient.healthProblems}</p>`;
        medicationList.innerHTML = '';
        patient.medications.forEach(medication => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${medication.name}</td>
                <td>${medication.dosage}</td>
                <td>${medication.frequency}</td>
                <td>${medication.time}</td>
                <td><button>Edit</button></td>`;
            medicationList.appendChild(row);
        });
        generateGraph(patient);
        showNotification(`${patient.name}'s details loaded`);
    }

    document.getElementById('back-to-list').addEventListener('click', () => {
        patientListSection.classList.remove('hidden');
        patientDetailsSection.classList.add('hidden');
    });

    function generateGraph(patient) {
        const canvas = document.getElementById('medication-chart');
        if (!canvas) {
            const chartContainer = document.createElement('div');
            chartContainer.innerHTML = '<canvas id="medication-chart"></canvas>';
            patientDetailsSection.appendChild(chartContainer);
        }
        const ctx = document.getElementById('medication-chart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: patient.medications.map(med => med.name),
                datasets: [{
                    label: 'Dosage Frequency',
                    data: patient.medications.map(med => parseInt(med.dosage)),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
});
