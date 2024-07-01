<template>
  <div class="register-page">
    <div class="register-container">
      <h1 class="register-title">Register</h1>
      <form class="register-form" @submit.prevent="handleRegister">
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
          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
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
        <div class="form-group">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            class="form-input"
            required
          />
        </div>
        <button type="submit" class="btn btn-register">Register</button>
      </form>
      <div class="register-footer">
        <p>
          Already have an account?
          <router-link to="/login" class="link">Login</router-link>
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
  name: 'RegisterPage',
  setup() {
    const router = useRouter();
    const username = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');

    const handleRegister = async () => {
      try {
        const response = await axios.post('/api/account/register', {
          username: username.value,
          email: email.value,
          password: password.value,
        });
        console.log('Registration successful:', response.data);
        localStorage.setItem('username', response.data.user.username);
        router.push('/login');
      } catch (error) {
        console.error('Registration failed:', error);
      }
    };

    return {
      username,
      email,
      password,
      confirmPassword,
      handleRegister,
    };
  },
};
</script>

<style src="./RegisterPage.css" scoped></style>