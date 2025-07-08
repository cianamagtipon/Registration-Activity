<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Menu, House, Collection } from '@element-plus/icons-vue'
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

      // Delay the transition and unloading
      setTimeout(() => {
        router.push({ name: 'login' }).then(() => {
          ElMessage({
            type: 'success',
            message: 'Logout successful',
          })
          fullscreenLoading.value = false
        })
      }, 800)
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
  <div v-loading.fullscreen.lock="fullscreenLoading">
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

    <!-- Mobile Navbar -->
    <div v-else class="navbar mobile-navbar">
      <div class="logo-text" @click="handleSelect('1')">
        Student Registration
      </div>

      <el-button @click="toggleDrawer" class="menu-button">
        <el-icon><Menu /></el-icon>
      </el-button>

      <el-drawer
        v-model="isDrawerVisible"
        direction="ltr"
        size="200px"
        with-header="false"
        :modal="true"
      >
        <div class="drawer-container">
          <el-menu
            :default-active="activeIndex"
            class="el-menu-vertical nav-menu"
            mode="vertical"
            @select="handleSelect"
          >
            <el-menu-item index="1">
              <el-icon><House /></el-icon>
              Home
            </el-menu-item>
            <el-menu-item index="2-1">
              <el-icon><Collection /></el-icon>
              Masterlist
            </el-menu-item>
          </el-menu>

          <el-menu
            class="el-menu-vertical action-menu"
            mode="vertical"
            @select="handleSelect"
          >
            <el-menu-item index="2-2">Reset</el-menu-item>
            <el-menu-item index="2-3" class="logout-item">Logout</el-menu-item>
          </el-menu>
        </div>
      </el-drawer>
    </div>

    <!-- Content -->
    <div class="main">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.menu-spacer {
  flex: 1;
}

.main {
  padding-left: 2rem;
  padding-right: 2rem;
  padding-top: 30px;
  display: flex;
  justify-content: center;
}

.navbar.mobile-navbar {
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.home-button {
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  transition: background 0.3s;
}

.navbar.mobile-navbar {
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logout-item {
  color: #ff2200af !important;
  font-weight: 600;
}
.logout-item:hover {
  background-color: #fdecea !important;
}

/* Logo style */
.logo-text {
  font-size: 1.2rem;
  font-weight: 700;
  background: linear-gradient(to right, #6b91ed, #00b1b1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

/* Optional: Adjust icon spacing */
.menu-button {
  margin-left: 1rem;
}

.el-menu-vertical {
  border: none !important;
}

.drawer-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.nav-menu {
  flex-grow: 1;
}

.action-menu {
  border-top: 1px solid #e4e7ed;
  padding-top: 0.5rem;
}
</style>
