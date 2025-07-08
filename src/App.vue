<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Menu } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useStudentStore } from '@/stores/student'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const studentStore = useStudentStore()

const { fullscreenLoading } = storeToRefs(userStore)

// Navigation state
const activeIndex = ref('1')

// Check screen size
const isMobile = ref(window.innerWidth <= 768)
const updateScreenSize = () => {
  isMobile.value = window.innerWidth <= 768
}

const isTinyScreen = ref(window.innerWidth < 400)
const updateTinyScreen = () => {
  isTinyScreen.value = window.innerWidth < 400
}

const isDrawerVisible = ref(false)
const toggleDrawer = () => {
  isDrawerVisible.value = !isDrawerVisible.value
}

// Handle menu selection
const handleSelect = (key: string) => {
  activeIndex.value = key

  if (key === '1') {
    router.push('/dashboard')
    isDrawerVisible.value = false
  } else if (key === '2-1') {
    router.push('/masterlist')
    isDrawerVisible.value = false
  } else if (key === '2-2') {
    handleCommand('reset')
  } else if (key === '2-3') {
    handleCommand('logout')
  }
}

// Sync menu highlight with route
const updateActiveIndexFromRoute = (path: string) => {
  if (path.startsWith('/dashboard')) activeIndex.value = '1'
  else if (path.startsWith('/masterlist')) activeIndex.value = '2-1'
  else activeIndex.value = ''
}

// BG for login
watch(
  () => route.name,
  (name) => {
    if (name === 'login') {
      document.body.classList.add('login-bg')
    } else {
      document.body.classList.remove('login-bg')
    }
  },
  { immediate: true },
)

// Dropdown command handling
const handleCommand = (command: string) => {
  ElMessage.closeAll()

  if (command === 'logout') {
    ElMessageBox.confirm('Log out of your account?', {
      confirmButtonText: 'LOG OUT',
      cancelButtonText: 'Cancel',
    }).then(() => {
      isDrawerVisible.value = false
      fullscreenLoading.value = true

      userStore.logout()
      studentStore.resetStudents()

      router.push({ name: 'login' }).then(() => {
        fullscreenLoading.value = false
        ElMessage({
          type: 'success',
          message: 'Logout successful',
        })
      })
    })
  } else if (command === 'reset') {
    ElMessageBox.confirm(
      'This will reset your entire database. Proceed?',
      'Warning',
      {
        confirmButtonText: 'YES',
        cancelButtonText: 'Cancel',
        type: 'warning',
      },
    ).then(() => {
      ElMessage({
        type: 'success',
        message: 'All data has been reset to default',
      })

      studentStore.resetStudents()
      userStore.resetForgetClickCount()
    })
  } else {
    ElMessage(`Clicked item: ${command}`)
  }
}

// Example: inside your login form handler
const handleLogin = async () => {
  fullscreenLoading.value = true
  try {
    await userStore.login(credentials)
    router.push('/dashboard')
  } finally {
    fullscreenLoading.value = false
  }
}

// Track dropdown open state for icon animation
const isDropdownOpen = ref(false)

// Watch screen resize and current route path
onMounted(() => {
  window.addEventListener('resize', updateScreenSize)
  window.addEventListener('resize', updateTinyScreen)

  watch(
    () => route.path,
    (newPath) => {
      updateActiveIndexFromRoute(newPath)
    },
    { immediate: true },
  )
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenSize)
  window.removeEventListener('resize', updateTinyScreen)
})
</script>

<template>
  <!-- Top Nav -->
  <el-menu
    v-if="!isMobile"
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <el-menu-item index="1">Home</el-menu-item>
    <el-menu-item index="2-1">Masterlist</el-menu-item>

    <div class="menu-spacer"></div>
    <el-sub-menu index="2">
      <template #title>Menu</template>
      <el-menu-item index="2-2">Reset</el-menu-item>
      <el-menu-item index="2-3">Logout</el-menu-item>
    </el-sub-menu>
  </el-menu>

  <!-- Mobile Menu Button -->
  <div v-else class="mobile-header">
    <el-button @click="toggleDrawer">
      <el-icon><Menu /></el-icon>
    </el-button>
  </div>

  <!-- Drawer for Mobile -->
  <el-drawer
    v-model="isDrawerVisible"
    direction="ltr"
    size="200px"
    with-header="false"
  >
    <el-menu
      :default-active="activeIndex"
      class="el-menu-vertical"
      mode="vertical"
      @select="handleSelect"
    >
      <el-menu-item index="1">Home</el-menu-item>
      <el-menu-item index="2-1">Masterlist</el-menu-item>
      <el-menu-item index="2-2">Reset</el-menu-item>
      <el-menu-item index="2-3">Logout</el-menu-item>
    </el-menu>
  </el-drawer>

  <div class="main">
    <el-loading
      v-if="fullscreenLoading"
      fullscreen
      lock
      text="Loading..."
      background="rgba(0, 0, 0, 0.5)"
    />
    <RouterView />
  </div>
</template>

<style scoped>
.menu-spacer {
  flex: 1;
}

.main {
  padding-top: 30px;
  display: flex;
  justify-content: center;
}

.mobile-header {
  display: flex;
  justify-content: flex-end;
  padding: 0.5rem 1rem;
}

.el-menu-vertical {
  border: none !important;
}
</style>
