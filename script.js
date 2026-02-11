let todos = [];
let currentFilter = 'all';

// ページ読み込み時にローカルストレージからデータを読み込む
window.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    renderTodos();
});

// TODOを追加
function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();

    if (text === '') {
        alert('タスクを入力してください');
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };

    todos.push(todo);
    input.value = '';

    saveTodos();
    renderTodos();
}

// TODOの完了状態を切り替え
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

// TODOを削除
function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    renderTodos();
}

// 完了済みのTODOをすべて削除
function clearCompleted() {
    todos = todos.filter(t => !t.completed);
    saveTodos();
    renderTodos();
}

// フィルターを適用
function filterTodos(filter) {
    currentFilter = filter;

    // フィルターボタンのアクティブ状態を更新
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    renderTodos();
}

// TODOリストを表示
function renderTodos() {
    const todoList = document.getElementById('todoList');
    const todoCount = document.getElementById('todoCount');

    // フィルタリング
    let filteredTodos = todos;
    if (currentFilter === 'active') {
        filteredTodos = todos.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(t => t.completed);
    }

    // リストを空にする
    todoList.innerHTML = '';

    // TODOアイテムを表示
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

        li.innerHTML = `
            <input
                type="checkbox"
                class="todo-checkbox"
                ${todo.completed ? 'checked' : ''}
                onchange="toggleTodo(${todo.id})"
            >
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">削除</button>
        `;

        todoList.appendChild(li);
    });

    // 統計を更新
    const activeCount = todos.filter(t => !t.completed).length;
    todoCount.textContent = `${activeCount}件の未完了タスク`;
}

// ローカルストレージに保存
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// ローカルストレージから読み込み
function loadTodos() {
    const saved = localStorage.getItem('todos');
    if (saved) {
        todos = JSON.parse(saved);
    }
}

// HTMLエスケープ（XSS対策）
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
