<script lang="ts" setup>
import { ref } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'

const username = ref('')
const password = ref('')
</script>

<template>
  <div class="login">
    <h1>This is the login page</h1>

    <el-input
      v-model="username"
      placeholder="Username"
      :prefix-icon="User"
    />
    <el-input
      v-model="password"
      placeholder="Password"
      :prefix-icon="Lock"
      show-password
    />

    <el-button type="primary"> Login </el-button>
  </div>

  <div class="login-forgot" >
    <el-link type="info"> Forgot Password? </el-link>
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
  .login {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 50%;
    gap: 16px;
  }

  .login-forgot {
    width: 50%;
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
  }
}
</style>
