(function() {
  const taskObjects = {};

  const themes = {
    default: {
      '--base-text-color': '#212529',
      '--header-bg': '#007bff',
      '--header-text-color': '#fff',
      '--default-btn-bg': '#007bff',
      '--default-btn-text-color': '#fff',
      '--default-btn-hover-bg': '#0069d9',
      '--default-btn-border-color': '#0069d9',
      '--danger-btn-bg': '#dc3545',
      '--danger-btn-text-color': '#fff',
      '--danger-btn-hover-bg': '#bd2130',
      '--danger-btn-border-color': '#dc3545',
      '--input-border-color': '#ced4da',
      '--input-bg-color': '#fff',
      '--input-text-color': '#495057',
      '--input-focus-bg-color': '#fff',
      '--input-focus-text-color': '#495057',
      '--input-focus-border-color': '#80bdff',
      '--input-focus-box-shadow': '0 0 0 0.2rem rgba(0, 123, 255, 0.25)',
    },
    dark: {
      '--base-text-color': '#212529',
      '--header-bg': '#343a40',
      '--header-text-color': '#fff',
      '--default-btn-bg': '#58616b',
      '--default-btn-text-color': '#fff',
      '--default-btn-hover-bg': '#292d31',
      '--default-btn-border-color': '#343a40',
      '--default-btn-focus-box-shadow': '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
      '--danger-btn-bg': '#b52d3a',
      '--danger-btn-text-color': '#fff',
      '--danger-btn-hover-bg': '#88222c',
      '--danger-btn-border-color': '#88222c',
      '--input-border-color': '#ced4da',
      '--input-bg-color': '#fff',
      '--input-text-color': '#495057',
      '--input-focus-bg-color': '#fff',
      '--input-focus-text-color': '#495057',
      '--input-focus-border-color': '#78818a',
      '--input-focus-box-shadow': '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
    },
    light: {
      '--base-text-color': '#212529',
      '--header-bg': '#fff',
      '--header-text-color': '#212529',
      '--default-btn-bg': '#fff',
      '--default-btn-text-color': '#212529',
      '--default-btn-hover-bg': '#e8e7e7',
      '--default-btn-border-color': '#343a40',
      '--default-btn-focus-box-shadow': '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
      '--danger-btn-bg': '#f1b5bb',
      '--danger-btn-text-color': '#212529',
      '--danger-btn-hover-bg': '#ef808a',
      '--danger-btn-border-color': '#e2818a',
      '--input-border-color': '#ced4da',
      '--input-bg-color': '#fff',
      '--input-text-color': '#495057',
      '--input-focus-bg-color': '#fff',
      '--input-focus-text-color': '#495057',
      '--input-focus-border-color': '#78818a',
      '--input-focus-box-shadow': '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
    },
  };

  let lastSelectedTheme = localStorage.getItem('app_theme') || 'default';

  // UI elements
  const listContainer = document.querySelector('.tasks-list-section .list-group');
  const form = document.forms['addTask'];
  const titleInput = form.elements['title'];
  const bodyInput = form.elements['body'];
  const themeSelect = document.getElementById('themeSelect');

  // Events 
  setTheme(lastSelectedTheme);
  form.addEventListener('submit', onFormSubmitHandler);
  listContainer.addEventListener('click', onDeleteHandler);
  themeSelect.addEventListener('change', onThemeSelectHandler);

  function listItemTemplate({_id, title, body} = {}) {
    const li = document.createElement('li');
    li.classList.add(
      'list-group-item', 
      'd-flex', 
      'align-items-center', 
      'flex-wrap',
      'mt-2'
    );
    li.setAttribute('data-task-id', _id);

    const span = document.createElement('span');
    span.textContent = title;
    span.style.fontWeight = 'bold';

    const article = document.createElement('p');
    article.textContent = body;
    article.classList.add(
      'mt-2',
      'w-100'
    );

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete task';
    deleteBtn.classList.add(
      'btn',
      'btn-danger',
      'ml-auto',
      'delete-btn'
    );

    li.appendChild(span);
    li.appendChild(article);
    li.appendChild(deleteBtn);
    
    return li;
  };

  function onFormSubmitHandler(event) {
    event.preventDefault();

    const titleValue = titleInput.value;
    const bodyValue = bodyInput.value;

    if (!titleValue || !bodyValue) {
      alert("Please, enter title and body");
      return;
    }
    
    const task = createTask(titleValue, bodyValue);
    const listItem = listItemTemplate(task);

    listContainer.insertAdjacentElement('afterbegin', listItem);

    form.reset();
  }

  function createTask(title, body) {
    const task = {
      title,
      body,
      completed: false,
      _id: `task-${Math.random()}`
    };
    
    taskObjects[task._id] = task;

    return { ...task };
  }

  function onDeleteHandler({ target }) {
    if (target.classList.contains('delete-btn')) {
      const parent = target.closest('[data-task-id]');
      const id = parent.dataset.taskId;     
      const isConfirm = deleteTask(id);
      
      deleteTaskFromHtml(parent, isConfirm);
    }
  }

  function deleteTask(id) {
    const { title } = taskObjects[id];
    const isConfirm = confirm(`Are you sure that you want to delete task named ${title}?`);
    
    if (!isConfirm) return isConfirm;

    delete taskObjects[id];

    return isConfirm;
  }

  function deleteTaskFromHtml(element, isConfirm) {
    if (isConfirm) {
      element.remove();
    }
  }

  function onThemeSelectHandler() {
    const selectedTheme = themeSelect.value;
    const isConfirm = confirm(`Are you sure that you want to change theme as ${selectedTheme}?`);

    if (!isConfirm){
      themeSelect.value = lastSelectedTheme;
      return;
    }

    setTheme(selectedTheme);
    lastSelectedTheme = themeSelect.value;
    localStorage.setItem('app_theme', selectedTheme);
  }

  function setTheme(name) {
    const selectedThemeObject = themes[name];
    Object.entries(selectedThemeObject).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    })
  }

})();
