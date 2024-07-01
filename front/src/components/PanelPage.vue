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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import avatarImage from "../assets/avatar.webp";
import axios from 'axios';

export default {
  name: 'PanelPage',
  setup() {
    const router = useRouter();
    const username = localStorage.getItem('username');
    const todos = ref([]);
    const newTodoText = ref('');
    const newTodoEndDate = ref('');
    const lastTodoId = ref(0);

    const fetchTodos = async () => {
      try {
        const response = await axios.get('/api/items/tasks', { params: { username } });
        todos.value = response.data.map(task => ({
          id: task.id,
          text: task.task_name,
          completed: task.task_status === 'accomplished',
          startDate: new Date(task.task_start_day),
          endDate: new Date(task.task_end_day)
        }));
        lastTodoId.value = todos.value.length ? todos.value[todos.value.length - 1].id : 0;
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    const addTodo = async () => {
      if (newTodoText.value.trim() !== '') {
        const newTask = {
          username,
          task_name: newTodoText.value,
          task_start_day: new Date().toISOString().split('T')[0],
          task_end_day: newTodoEndDate.value,
          task_status: 'pending'
        };

        try {
          const response = await axios.post('/api/items/tasks', newTask);
          todos.value.push({
            id: response.data.id,
            text: response.data.task_name,
            completed: false,
            startDate: new Date(response.data.task_start_day),
            endDate: new Date(response.data.task_end_day)
          });
          newTodoText.value = '';
          newTodoEndDate.value = '';
        } catch (error) {
          console.error('Error adding task:', error);
        }
      }
    };

    const deleteTodo = async (id) => {
      try {
        await axios.delete(`/api/items/tasks/${id}`);
        todos.value = todos.value.filter((todo) => todo.id !== id);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    };

    const formatDate = (date) => {
      return date.toLocaleDateString();
    };

    const quitAccount = () => {
      localStorage.removeItem('username');
      router.push('/');
    };

    onMounted(() => {
      fetchTodos();
    });

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
