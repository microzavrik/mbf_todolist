<template>
  <div class="login-page">
    <div class="login-container">
      <h1 class="login-title">Login</h1>
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username" class="form-label">Username</label>
          <input
            type="text"
            id="username"
            v-model="username"
            class="form-input"
            required
          />
        </div>
        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="form-input"
            required
          />
        </div>
        <button type="submit" class="btn btn-login">Login</button>
      </form>
      <div class="login-footer">
        <p>
          Don't have an account?
          <router-link to="/register" class="link">Register</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter();
    const username = ref('');
    const password = ref('');

    const handleLogin = async () => {
      try {
        const response = await axios.post('/api/account/login', {
          username: username.value,
          password: password.value,
        });
        console.log('Login successful:', response.data);
        // console.log("Username: ", response.data.user.username)
        localStorage.setItem('username', response.data.user.username);
        router.push('/panel');
      } catch (error) {
        console.error('Login failed:', error);
      }
    };

    return {
      username,
      password,
      handleLogin,
    };
  },
};
</script>

<style src="./LoginPage.css" scoped></style>
