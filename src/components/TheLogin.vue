<script lang="ts" setup>
import { ref } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'

const username = ref('')
const password = ref('')
</script>

<style scoped>
  .login,
  .login input,
  .login button {
    display: block;
    width: 100%;
  }

  .login-forgot {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
  }
</style>

<template>
  <div class="login">

    <el-input
      v-model="username"
      placeholder="Username"
      style="margin-bottom: 16px;"
      :prefix-icon="User"
    />
    <el-input
      v-model="password"
      placeholder="Password"
      :prefix-icon="Lock"
      style="margin-bottom: 16px;"
      show-password
    />

    <el-button type="primary"> Login </el-button>
  </div>

  <div class="login-forgot" >
    <el-link type="info"> Forgot Password? </el-link>
  </div>
</template>
