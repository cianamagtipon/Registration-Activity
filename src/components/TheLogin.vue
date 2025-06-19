<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter  } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'

const username = ref('')
const password = ref('')

const router = useRouter()

const login = () => {
  if (username.value === 'admin' && password.value === '1234') {
    router.push('/dashboard')
  } else {
    alert('Invalid username or password')
  }
}
</script>

<style scoped>
  .login,
  .login input,
  .login button {
    display: block;
    width: 100%;
  }

  .forgot-password {
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

    <el-button type="primary"  @click="login"> Login </el-button>
  </div>

  <div class="forgot-password" >
    <el-link type="info"> Forgot Password? </el-link>
  </div>
</template>
