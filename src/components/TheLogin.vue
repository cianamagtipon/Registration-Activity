/*BASIC DESCRIPTION: These are the main components of the login page.*/

<!---------- SCRIPTS ---------->

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const username = ref('')
const password = ref('')

const router = useRouter()
const userStore = useUserStore()
const { fullscreenLoading } = storeToRefs(userStore)

const login = () => {
  if (!username.value || !password.value) {
    ElMessage.closeAll()
    ElMessage.warning('Please enter username and password')
    return
  }

  fullscreenLoading.value = true

  setTimeout(() => {
    const success = userStore.login(username.value, password.value)

    fullscreenLoading.value = false

    if (success) {
      router.push('/dashboard')
    } else {
      ElMessage.closeAll()
      ElMessage({
        message: 'Invalid username or password',
        type: 'error',
      })
    }
  }, 1500)
}

const forgetPassword = () => {
  userStore.setUsername(username.value)
  const result = userStore.handleForgetPassword()

  ElMessage.closeAll()
  switch (result) {
    case 'empty':
      ElMessage({
        message: 'Please enter username',
        type: 'warning',
      })
      break
    case 'notFound':
      ElMessage({
        message: 'Username does not exist',
        type: 'error',
      })
      break
    case 'requested':
      ElMessage({
        message: 'Password change request sent',
        type: 'success',
      })
      break
    case 'alreadyRequested':
      ElMessage({
        message: 'Password change already requested',
        type: 'warning',
      })
      break
  }
}
</script>

<!---------- TEMPLATES ---------->

<template>
  <div class="login-container">
    <form class="login" @submit.prevent="login">
      <el-input
        v-model="username"
        class="username"
        placeholder="Username"
        style="margin-bottom: 16px"
        :prefix-icon="User"
      />
      <el-input
        v-model="password"
        class="password"
        placeholder="Password"
        style="margin-bottom: 30px"
        :prefix-icon="Lock"
        show-password
      />
      <el-button type="primary" class="login-button" native-type="submit">
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40vw;
  max-width: 900px;
  height: 90vh;
  margin: 0 auto;
}

.login,
.login input,
.login button {
  display: block;
  width: 100%;
  z-index: 10;
}

.forgot-password {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

/* ────────────────────────
  OVERRIDES
 ──────────────────────── */

/* INPUT (BASE) */
::v-deep(.el-input__wrapper) {
  background-color: transparent !important;
  border: 0.5px solid rgba(255, 255, 255, 0.7);
  transition:
    border 0.2s ease,
    box-shadow 0.2s ease;
}

/* INPUT (TEXT) */
::v-deep(.el-input__inner) {
  background-color: transparent !important;
  color: white !important;
}

/* INPUT (PLACEHOLDER) */
::v-deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.7) !important;
}

/* ICON */
::v-deep(.el-icon) {
  color: white !important;
}

/* FORGOT PASSWORD */
::v-deep(.el-link) {
  color: white !important;
}

/* BUTTON */
::v-deep(.el-button) {
  background-color: white !important;
  color: #244bc5 !important;
  border: none;
  box-shadow: 0 4px 20px rgba(36, 75, 197, 0.4);
  transition: all 0.3s ease;
  font-weight: 600;
  border-radius: 8px;
}

/* BUTTON HOVER */
::v-deep(.el-button:hover) {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

/* ────────────────────────
  MEDIA
 ──────────────────────── */

@media (max-width: 600px) {
  .login-container {
    width: 70vw;
  }
}

@media (min-width: 768px) {
  ::v-deep(.el-input__inner::placeholder) {
    font-size: 16px;
  }
}

@media (min-width: 1024px) {
  .login input,
  .login button {
    font-size: 20px;
  }

  ::v-deep(.el-input__wrapper) {
    height: 50px;
  }

  ::v-deep(.el-input__inner::placeholder) {
    font-size: 20px;
  }

  ::v-deep(.el-button) {
    font-size: 18px;
    padding: 0 28px;
    height: 50px;
  }

  ::v-deep(.el-link) {
    font-size: 20px !important;
  }
}
</style>
