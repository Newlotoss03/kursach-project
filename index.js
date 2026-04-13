let users = JSON.parse(localStorage.getItem("users")) || [];
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveData() {
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Пользователи
function addUser() {
  const name = document.getElementById("userName").value;
  if (!name) return;

  users.push({
    id: Date.now(),
    name,
    completed: 0
  });

  document.getElementById("userName").value = "";
  saveData();
  render();
}

// ➕ Добавить задачу
function addTask() {
  const title = document.getElementById("taskTitle").value;
  const deadline = document.getElementById("deadline").value;
  const category = document.getElementById("category").value;

  if (!title) return;

  tasks.push({
    id: Date.now(),
    title,
    category,
    deadline,
    assignedTo: null,
    completed: false
  });

  document.getElementById("taskTitle").value = "";
  saveData();
  render();
}

// Редактирование
function editTask(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  const newTitle = prompt("Новое название:", task.title);
  const newCategory = prompt("Категория:", task.category);

  if (newTitle) task.title = newTitle;
  if (newCategory) task.category = newCategory;

  saveData();
  render();
}

// 🗑 Удаление
function deleteTask(taskId) {
  tasks = tasks.filter(t => t.id !== taskId);
  saveData();
  render();
}

// Назначение
function assignUser(taskId) {
  const list = users.map(u => `${u.id}: ${u.name}`).join("\n");
  const userId = prompt("Введите ID:\n" + list);

  const task = tasks.find(t => t.id === taskId);
  if (task) task.assignedTo = Number(userId);

  saveData();
  render();
}

// ✅ Завершение
function completeTask(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task || task.completed) return;

  task.completed = true;

  const user = users.find(u => u.id === task.assignedTo);
  if (user) user.completed++;

  saveData();
  render();
}

// Сброс
function resetData() {
  if (confirm("Удалить ВСЕ данные?")) {
    localStorage.clear();
    users = [];
    tasks = [];
    render();
  }
}

// Рендер
function render() {
  renderUsers();
  renderTasks();
  renderRating();
}

// 👤 Список пользователей
function renderUsers() {
  const list = document.getElementById("userList");
  list.innerHTML = "";

  users.forEach(u => {
    const li = document.createElement("li");
    li.textContent = `${u.name} (ID: ${u.id})`;
    list.appendChild(li);
  });
}

// Задачи
function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach(task => {
    const user = users.find(u => u.id === task.assignedTo);

    const li = document.createElement("li");
    li.innerHTML = `
      <b>${task.title}</b> [${task.category}]

   
рок: ${task.deadline || "нет"}

   
сполнитель: ${user ? user.name : "не назначен"}

   
татус: ${task.completed ? "✅" : "⏳"}

  
<div class="task-buttons">
        <button onclick="assignUser(${task.id})">Назначить</button>
        <button onclick="completeTask(${task.id})">✔</button>
        <button onclick="editTask(${task.id})">✏️</button>
        <button onclick="deleteTask(${task.id})">🗑</button>
      </div>
    `;

    list.appendChild(li);
  });
}

// Рейтинг
function renderRating() {
  const list = document.getElementById("ratingList");
  list.innerHTML = "";

  const sorted = [...users].sort((a, b) => b.completed - a.completed);

  sorted.forEach(u => {
    const li = document.createElement("li");
    li.textContent = `${u.name} — ${u.completed}`;
    list.appendChild(li);
  });
}

render();