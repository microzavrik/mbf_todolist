<template>
  <div class="panel-page">
    <header class="header">
      <div class="header-content">
        <h1 class="title">Todo App</h1>
        <button class="btn btn-logout" @click="quitAccount">Quit Account</button>
      </div>
    </header>

    <main class="content">
      <div class="user-panel">
        <div class="user-info">
          <img :src="avatarImage" alt="Avatar" class="avatar" />
          <h2 class="username">{{ username }}</h2>
        </div>
        <div class="todo-list">
          <h3 class="todo-title">Todo List</h3>
          <table class="todo-table">
            <thead>
              <tr>
                <th></th>
                <th>Task</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="todo in todos" :key="todo.id" class="todo-item">
                <td>
                  <input type="checkbox" v-model="todo.completed" class="todo-checkbox" />
                </td>
                <td>
                  <div class="todo-text" :class="{ completed: todo.completed }">
                    {{ todo.text }}
                  </div>
                </td>
                <td>{{ formatDate(todo.startDate) }}</td>
                <td>{{ formatDate(todo.endDate) }}</td>
                <td>
                  <button class="btn btn-delete" @click="deleteTodo(todo.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="todo-input">
            <input
              type="text"
              v-model="newTodoText"
              placeholder="Enter a new task"
              class="todo-input-field"
            />
            <input type="date" v-model="newTodoEndDate" class="todo-input-field" />
            <button class="btn btn-add" @click="addTodo">Add</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import avatarImage from "../assets/avatar.webp"

export default {
  name: 'PanelPage',
  setup() {
    const router = useRouter();
    const username = localStorage.getItem('username');
    const todos = ref([
      { id: 1, text: 'Finish project report', completed: false, startDate: new Date(), endDate: new Date(Date.now() + 86400000) },
      { id: 2, text: 'Buy groceries', completed: false, startDate: new Date(), endDate: new Date(Date.now() + 86400000) },
      { id: 3, text: 'Call mom', completed: false, startDate: new Date(), endDate: new Date(Date.now() + 86400000) },
    ]);
    const newTodoText = ref('');
    const newTodoEndDate = ref('');
    let lastTodoId = 3;

    const addTodo = () => {
      if (newTodoText.value.trim() !== '') {
        todos.value.push({
          id: ++lastTodoId,
          text: newTodoText.value,
          completed: false,
          startDate: new Date(),
          endDate: new Date(newTodoEndDate.value),
        });
        newTodoText.value = '';
        newTodoEndDate.value = '';
      }
    };

    const deleteTodo = (id) => {
      todos.value = todos.value.filter((todo) => todo.id !== id);
    };

    const formatDate = (date) => {
      return date.toLocaleDateString();
    };

    const quitAccount = () => {
      // Implement account quit logic here
      console.log('Quitting account...');
      router.push('/');
    };

    return {
      avatarImage,
      username,
      todos,
      newTodoText,
      newTodoEndDate,
      addTodo,
      deleteTodo,
      formatDate,
      quitAccount,
    };
  },
};
</script>

<style src="./PanelPage.css" scoped></style>
