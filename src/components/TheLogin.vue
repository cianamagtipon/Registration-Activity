<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter  } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const username = ref('')
const password = ref('')
const forgetClickCount = ref(0)

const router = useRouter()

const login = () => {
  if (username.value === 'admin' && password.value === '1234') {
    router.push('/dashboard')
  } else {
    ElMessage({
      message: 'Invalid username or password',
      type: 'error'
    })
  }
}

function forgetPassword() {
  forgetClickCount.value++

  if (forgetClickCount.value === 1) {
    ElMessage({
      message: 'Password change request sent',
      type: 'success'
    })
  } else {
    ElMessage({
      message:'Password change already requested',
      type: 'warning'
    })
  }
}
</script>

<style scoped>
  .page-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 2rem;
    width: 70%;
    max-width: 400px;
  }

  .login,
  .login input,
  .login button {
    display: block;
    width: 100%;
  }

  .forgot-password {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
</style>

<template>
  <div class="page-container">
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
        style="margin-bottom: 30px;"
        show-password
      />
      <el-button type="primary" @click="login">Login</el-button>
    </div>

    <div class="forgot-password">
      <el-link type="info" @click="forgetPassword">Forgot Password?</el-link>

    </div>
  </div>
</template>
