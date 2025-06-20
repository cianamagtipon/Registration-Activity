/*BASIC DESCRIPTION: These are the main components of the login page.*/


<!---------- SCRIPTS ---------->


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
    ElMessage.closeAll()
    ElMessage({
      message: 'Invalid username or password',
      type: 'error'
    })
  }
}

function forgetPassword() {
  ElMessage.closeAll()

  if (!username.value) {
    ElMessage({
      message: 'Please enter username',
      type: 'warning',
    })
    return
  } else if (username.value !== 'admin') {
    ElMessage({
      message: 'Username does not exist',
      type: 'error',
    })
  }

  if (username.value === 'admin') {
    forgetClickCount.value++

    if (forgetClickCount.value === 1) {
      ElMessage({
        message: 'Password change request sent',
        type: 'success',
      })
    } else {
      ElMessage({
        message: 'Password change already requested',
        type: 'warning',
      })
    }
  }
}
</script>


<!---------- TEMPLATES ---------->


<template>
  <div class="login-container">
    <form class="login" @submit.prevent="login">
      <el-input
        v-model="username"
        placeholder="Username"
        style="margin-bottom: 16px;"
        :prefix-icon="User"
      />
      <el-input
        v-model="password"
        placeholder="Password"
        style="margin-bottom: 30px;"
        :prefix-icon="Lock"
        show-password
      />
      <el-button type="primary" native-type="submit">
        Login
      </el-button>
    </form>

    <div class="forgot-password">
      <el-link type="info" @click="forgetPassword">Forgot Password?</el-link>
    </div>
  </div>
</template>


<!---------- STYLES ---------->


<style scoped>
  .login-container {
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
