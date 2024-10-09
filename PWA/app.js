// Elements
const habitInput = document.getElementById('habit-input');
const habitDateInput = document.getElementById('habit-date');
const addHabitBtn = document.getElementById('add-habit-btn');
const habitList = document.getElementById('habit-list');
const weeklyReport = document.getElementById('weekly-report');

// Load habits from localStorage
let habits = JSON.parse(localStorage.getItem('habits')) || [];

// Initialize app
function init() {
    habitList.innerHTML = '';
    habits.forEach((habit, index) => {
        addHabitToList(habit, index);
    });
    updateWeeklyReport();
}

// Add habit to list and localStorage
function addHabit() {
    const habitText = habitInput.value;
    const habitDate = habitDateInput.value;

    if (habitText === '' || habitDate === '') return;

    const newHabit = {
        text: habitText,
        date: habitDate,
        completed: false
    };

    habits.push(newHabit);
    localStorage.setItem('habits', JSON.stringify(habits));
    addHabitToList(newHabit, habits.length - 1);
    habitInput.value = '';
    habitDateInput.value = '';
}

// Render a habit to the DOM
function addHabitToList(habit, index) {
    const habitDiv = document.createElement('div');
    habitDiv.className = 'habit';
    habitDiv.innerHTML = `
        <span class="${habit.completed ? 'completed' : ''}">${habit.text} (${habit.date})</span>
        <button onclick="toggleComplete(${index})">${habit.completed ? 'Undo' : 'Complete'}</button>
        <button onclick="editHabit(${index})">Edit</button>
        <button onclick="deleteHabit(${index})">Delete</button>
    `;
    habitList.appendChild(habitDiv);
}

// Toggle habit completion
function toggleComplete(index) {
    habits[index].completed = !habits[index].completed;
    localStorage.setItem('habits', JSON.stringify(habits));
    init();
}

// Edit habit
function editHabit(index) {
    const habit = habits[index];
    habitInput.value = habit.text;
    habitDateInput.value = habit.date;

    deleteHabit(index);
}

// Delete habit
function deleteHabit(index) {
    habits.splice(index, 1);
    localStorage.setItem('habits', JSON.stringify(habits));
    init();
}

// Get the next 7 days starting from today
function getNext7Days() {
    const next7Days = [];
    for (let i = 0; i < 7; i++) {
        const day = new Date();
        day.setDate(day.getDate() + i);
        next7Days.push(day.toISOString().split('T')[0]);
    }
    return next7Days;
}

// Update the weekly report
function updateWeeklyReport() {
    const next7Days = getNext7Days();
    weeklyReport.innerHTML = '';

    next7Days.forEach(day => {
        const dailyHabits = habits.filter(habit => habit.date === day);
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day-report';
        dayDiv.innerHTML = `<strong>${day}</strong>`;

        if (dailyHabits.length > 0) {
            dailyHabits.forEach(habit => {
                const habitStatus = habit.completed ? 'Completed' : 'Not Completed';
                dayDiv.innerHTML += `<p>${habit.text}: ${habitStatus}</p>`;
            });
        } else {
            dayDiv.innerHTML += `<p>No habits tracked</p>`;
        }

        weeklyReport.appendChild(dayDiv);
    });
}


// Event listeners
addHabitBtn.addEventListener('click', addHabit);
window.onload = init;
