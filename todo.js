let todos = [];
let count = 0;
const displayDay = document.querySelector('.display__day');
const displayDate = document.querySelector('.display__date');
const input = document.querySelector('.input');
const inputBox = document.querySelector('.input__box');
const pendingCount = document.querySelector('.todo__number');
const pendingTodosBox = document.querySelector('.todo__list--pending');
const completedTodosBox = document.querySelector('.todo__list--done');
const clearButton = document.querySelector('.footer__btn--clear');
const hideButton = document.querySelector('.footer__btn--complete');


displayDay.textContent = new Date().toLocaleDateString('en', { weekday: 'long' });
displayDate.textContent = new Date().toLocaleDateString('en-US').replaceAll('/', '-');

getFromLocalStorage();

inputBox.addEventListener('submit', (event) => {
    event.preventDefault();
    addTodos(input.value);
})

pendingTodosBox.addEventListener('click', (event) => {
    if (event.target.type === 'checkbox') {
        changeCompleted(parseInt(event.target.parentElement.parentElement.getAttribute('data-id')))
    }
    if (event.target.classList.contains('trash')) {
        deleteTodo(parseInt(event.target.parentElement.getAttribute('data-id')));
    }
})
completedTodosBox.addEventListener('click', (event) => {
    if (event.target.classList.contains('trash')) {
        deleteTodo(parseInt(event.target.parentElement.getAttribute('data-id')));
    }
})

clearButton.addEventListener('click', () => {
    clearPendingElements();
})

hideButton.addEventListener('click', () => {
    completedTodosBox.classList.toggle('hide');
    completedTodosBox.classList.contains('hide') ? hideButton.textContent = 'Show Complete' : hideButton.textContent = 'Hide Complete';
})

function getFromLocalStorage() {
    todos = JSON.parse(localStorage.getItem('todos')) || [];
    handleCount(todos);
    createTodosElement(todos);
}

function addToLocalStorage(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
    createTodosElement(todos);
}

function changeCompleted(id) {
    todos.forEach(item => {
        if (item.id == id) {
            item.completed = !item.completed;
        }
    });
    handleCount(todos);
    addToLocalStorage(todos);
}

function deleteTodo(id) {
    todos = todos.filter(item => {
        return item.id !== id;
    })
    handleCount(todos);
    addToLocalStorage(todos);
}

function addTodos(inputdata) {
    if (inputdata !== '') {
        const todo = {
            id: Date.now(),
            name: inputdata,
            completed: false
        }
        todos.push(todo);
        handleCount(todos);
        addToLocalStorage(todos);
        input.value = '';
        pendingTodosBox.firstChild.classList.add('show-in');
    }
}

function createTodosElement(todosArray) {
    pendingTodosBox.innerHTML = '';
    completedTodosBox.innerHTML = '';
    todosArray.forEach(todo => {
        const checked = todo.completed ? 'checked' : null;
        const TodosBoxElement = document.createElement("div");
        TodosBoxElement.classList.add('todos');
        TodosBoxElement.setAttribute('data-id', todo.id);
        if (todo.completed) { TodosBoxElement.classList.add('checked') }
        TodosBoxElement.innerHTML = `
                    <div class="input-label-box">
                        <input type="checkbox" ${checked}>
                        <label>${todo.name}</label>
                    </div>
                    <span class="trash"></span>
             `;
        todo.completed ? completedTodosBox.prepend(TodosBoxElement) : pendingTodosBox.prepend(TodosBoxElement);
    });
    createCompletedTitle();
}

function createCompletedTitle() {
    const completedTitle = document.createElement('p');
    completedTitle.textContent = `Completed tasks: ${Math.round((todos.length - count) * 100 / todos.length)}%`
    completedTodosBox.prepend(completedTitle);
}

function handleCount(todos) {
    count = todos.filter(item => item.completed === false).length;
    if (count === 0) {
        pendingCount.parentElement.classList.add('hide');
    } else {
        pendingCount.parentElement.classList.remove('hide');
        pendingCount.textContent = count;
        clearButton.classList.remove('hide');
        hideButton.classList.remove('hide');
    }
}

function clearPendingElements() {
    todos = todos.filter(item => {
        return item.completed === true;
    });
    handleCount(todos);
    addToLocalStorage(todos);
}

