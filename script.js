const addBtn = document.querySelector('.addNewTask');
const deleteBtn = document.querySelector('.deleteAddedTask');
const taskText = document.querySelector('.task');
const mainDiv = document.querySelector('.main');

let taskList = document.createElement('div');
taskList.className = 'task-list';
mainDiv.appendChild(taskList);

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
renderTasks();

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks(showCheckboxes = false) {
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    taskText.style.display = 'block';
    return;
  }

  taskText.style.display = 'none';

  if (showCheckboxes) {
    const selectAllDiv = document.createElement('div');
    selectAllDiv.className = 'task-item';

    const selectAllCheckbox = document.createElement('input');
    selectAllCheckbox.type = 'checkbox';
    selectAllCheckbox.className = 'select-all';

    const label = document.createElement('span');
    label.textContent = 'Select All';

    selectAllDiv.appendChild(selectAllCheckbox);
    selectAllDiv.appendChild(label);
    taskList.appendChild(selectAllDiv);

    selectAllCheckbox.addEventListener('change', (e) => {
      document.querySelectorAll('.delete-checkbox').forEach(cb => {
        cb.checked = e.target.checked;
      });
    });
  }

  tasks.forEach((task, index) => {
    const div = document.createElement('div');
    div.className = 'task-item';

    if (showCheckboxes) {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'delete-checkbox';
      checkbox.dataset.index = index;
      div.appendChild(checkbox);
    }

    const span = document.createElement('span');
    span.textContent = task;
    div.appendChild(span);
    taskList.appendChild(div);
  });
}

// Add Task
addBtn.addEventListener('click', () => {
  const existingInput = document.querySelector('.task-input-div');
  if (existingInput) return;

  const inputDiv = document.createElement('div');
  inputDiv.className = 'task-input-div';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Enter your task...';
  input.className = 'task-input';

  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'Submit';
  submitBtn.className = 'submit-task';

  inputDiv.appendChild(input);
  inputDiv.appendChild(submitBtn);
  mainDiv.insertBefore(inputDiv, taskList);

  submitBtn.addEventListener('click', () => {
    const value = input.value.trim();
    if (value !== '') {
      tasks.push(value);
      saveTasks();
      renderTasks(false);
    }
    mainDiv.removeChild(inputDiv);
  });
});

function handleConfirmDelete() {
  const checkboxes = document.querySelectorAll('.delete-checkbox');
  const selectedIndexes = [];

  checkboxes.forEach(cb => {
    if (cb.checked) {
      selectedIndexes.push(parseInt(cb.dataset.index));
    }
  });

  // Sort in reverse to avoid index shifting
  selectedIndexes.sort((a, b) => b - a).forEach(index => {
    tasks.splice(index, 1);
  });

  saveTasks();
  renderTasks(false);

  deleteBtn.textContent = 'Delete Task';
  deleteBtn.removeEventListener('click', handleConfirmDelete);
  deleteBtn.addEventListener('click', deleteClickHandler);
}

function deleteClickHandler() {
  if (tasks.length === 0) return;

  renderTasks(true);
  deleteBtn.textContent = 'Confirm Delete';

  deleteBtn.removeEventListener('click', deleteClickHandler);
  deleteBtn.addEventListener('click', handleConfirmDelete);
}

deleteBtn.addEventListener('click', deleteClickHandler);
