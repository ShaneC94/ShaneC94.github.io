document.addEventListener('DOMContentLoaded', function() {
    var colors = ['#DB2B39', '#399E5A','#F40076', '#20A4F3', '#E36414', '#0F4C5C']; // Add more colors if desired
    var currentColorIndex = 0;
    var reminderElement = document.getElementById('reminder');

    setInterval(function() {
        reminderElement.style.color = colors[currentColorIndex];
        currentColorIndex = (currentColorIndex + 1) % colors.length; // Cycle through the colors
    }, 2000);
    currentSortMode = 'priority';
    renderTasks();
});
function addTask() {
    const taskText = document.getElementById('task').value;
    const dueDate = document.getElementById('dueDate').value;
    const priority = document.getElementById('priority').value;

    if (taskText.trim() === '') return;

    const task = {
        text: taskText,
        dueDate: dueDate,
        priority: priority,
        completed: false
    };

    // Get tasks from local storage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);

    // Save tasks to local storage
    localStorage.setItem('tasks', JSON.stringify(tasks));

    renderTasks();
    clearInputFields();
}
function renderTasks() {
    const ul = document.getElementById('tasks');
    ul.innerHTML = '';

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const priorityValues = { 'low': 1, 'medium': 2, 'high': 3 };

    if (currentSortMode === 'priority') {
        tasks.sort((a, b) => priorityValues[b.priority] - priorityValues[a.priority]);
    } else {
        tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }

    tasks.forEach(task => {
        const li = document.createElement('li');
        const capitalizedPriority = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
        const priorityClass = task.priority.toLowerCase();
        li.innerHTML = `
            <span class="${priorityClass}">${task.text}</span>
            <span>Priority: <span class="priority-label ${priorityClass}">${capitalizedPriority}</span></span>
            <span>Due Date: ${task.dueDate}</span>
            <button onclick="completeTask(this)">Complete</button>
            <button onclick="removeTask(this)">Remove</button>
        `;

        if (task.completed) {
            li.querySelector('span').classList.add('completed');
        }

        ul.appendChild(li);
    });
}
function sortTask() {
    currentSortMode = currentSortMode === 'priority' ? 'dueDate' : 'priority';
    renderTasks();
}

function completeTask(button) {
    const taskText = button.parentElement.querySelector('span');
    taskText.classList.toggle('completed');

    // Update the completed status in local storage
    const taskTextValue = taskText.textContent;
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => {
        if (task.text === taskTextValue) {
            task.completed = !task.completed;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));

    renderTasks(); 
}
function removeTask(button) {
    var test_confirm = confirm("This task will be permanently deleted! Are you sure you want to delete?");
    if (test_confirm === false) {
        return; // If user clicks 'Cancel', exit the function without removing the task
    }
    
    const taskText = button.parentElement.querySelector('span');
    const taskTextValue = taskText.textContent;

    // Remove the task from local storage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.text !== taskTextValue);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    renderTasks(); 
}

function clearInputFields() {
    document.getElementById('task').value = '';
    document.getElementById('dueDate').value = '';
    document.getElementById('priority').value = 'low';
}
renderTasks();