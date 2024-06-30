<template>
    <div class="main-page">
      <header class="header">
        <div class="header-content">
          <h1 class="title">Welcome to My Todo App</h1>
          <div class="auth-buttons">
            <button class="btn btn-login" @click="navigateToLogin">Login</button>
            <button class="btn btn-register" @click="navigateToRegister">Register</button>
          </div>
        </div>
      </header>
  
      <main class="content">
        <div class="todo-list">
          <h2 class="todo-title">Todo List</h2>
          <ul class="todo-items">
            <li v-for="todo in todos" :key="todo.id" class="todo-item">
              <input type="checkbox" v-model="todo.completed" class="todo-checkbox" />
              <span :class="{ 'completed': todo.completed }" class="todo-text">{{ todo.text }}</span>
              <button class="btn btn-delete" @click="deleteTodo(todo.id)">Delete</button>
            </li>
          </ul>
          <div class="todo-input">
            <input type="text" v-model="newTodoText" placeholder="Add a new task" class="todo-input-field" />
            <button class="btn btn-add" @click="addTodo">Add</button>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'MainPage',
  setup() {
    const router = useRouter();
    const todos = ref([
      { id: 1, text: 'Finish the project', completed: false },
      { id: 2, text: 'Go for a walk', completed: false },
      { id: 3, text: 'Read a book', completed: true },
    ]);

    const newTodoText = ref('');

    const addTodo = () => {
      if (newTodoText.value.trim() !== '') {
        todos.value.push({
          id: todos.value.length + 1,
          text: newTodoText.value,
          completed: false,
        });
        newTodoText.value = '';
      }
    };

    const deleteTodo = (id) => {
      todos.value = todos.value.filter((todo) => todo.id !== id);
    };

    const navigateToLogin = () => {
      router.push('/login');
    };

    const navigateToRegister = () => {
      router.push('/register');
    };

    return {
      todos,
      newTodoText,
      addTodo,
      deleteTodo,
      navigateToLogin,
      navigateToRegister,
    };
  },
};
</script>

<style src="./MainPage.css" scoped></style>