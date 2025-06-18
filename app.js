const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = 'all';

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";
  let filteredTasks = tasks;  

  if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(task => task.completed);
  } else if (currentFilter === 'pending') {
    filteredTasks = tasks.filter(task => !task.completed);
  }  

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    li.innerHTML = `
      <span>
        <span class="priority ${task.priority}">${task.priority}</span>
        ${task.text}
        <br />
        <small>📅 Due: ${task.dueDate || "Not set"}</small>
      </span>
      <div>
        <button onclick="toggleComplete(${index})">✅</button>
        <button onclick="editTask(${index})">✏️</button>
        <button onclick="deleteTask(${index})">❌</button>
      </div>
    `;

//   tasks.forEach((task, index) => {
//     const li = document.createElement("li");
//     li.className = task.completed ? "completed" : "";
//     li.innerHTML = `
//       <span>
//         <span class="priority ${task.priority}">${task.priority}</span>
//         ${task.text}
//         <br />
//         <small>📅 Due: ${task.dueDate || "Not set"}</small>
//       </span>
//       <div>
//         <button onclick="toggleComplete(${index})">✅</button>
//         <button onclick="deleteTask(${index})">❌</button>
//       </div>
//     `;
    taskList.appendChild(li);
  });
}
function editTask(index) {
  let taskText = prompt("Edit task:", tasks[index].text);
  if (taskText !== null && taskText.trim() !== "") {
    tasks[index].text = taskText.trim();
    saveTasks();
    renderTasks();
  }
}

function addTask() {
  const taskText = taskInput.value.trim();
  const priority = document.getElementById("prioritySelect").value;
  const dueDate = document.getElementById("dueDateInput").value;

  if (taskText === "") return;

  tasks.push({ text: taskText, priority: priority, dueDate: dueDate, completed: false });
  saveTasks();
  renderTasks();
  taskInput.value = "";
  document.getElementById("dueDateInput").value = "";
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function setFilter(filter) {
  currentFilter = filter;
  renderTasks();
}

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

document.getElementById("sortOptions").addEventListener("change", function () {
  const selected = this.value;

  if (selected === "date-asc") {
    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  } 
  else if (selected === "date-desc") {
    tasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
  } 
  else if (selected === "priority-asc") {
    const priorityOrder = { "High": 1, "Medium": 2, "Low": 3 };
    tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  } 
  else if (selected === "priority-desc") {
    const priorityOrder = { "High": 1, "Medium": 2, "Low": 3 };
    tasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  }

  renderTasks();
});

renderTasks();



const themeBtn = document.getElementById("themeBtn");

function setTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
  themeBtn.textContent = theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
}

// Load saved theme or System Preferences
const systemPref = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
const savedTheme = localStorage.getItem("theme") || systemPref;
setTheme(savedTheme);

// Handle button click
themeBtn.addEventListener("click", () => {
  const isDark = document.body.classList.contains("dark");
  setTheme(isDark ? "light" : "dark");
});

const footer = document.getElementById("footer");
const year = new Date().getFullYear();
footer.innerHTML = `&copy; ${year} Developed by <strong>Nishanth G</strong>`;
