/* BASIC DESCRIPTION: These are the main components of the application's navbar.
*/

<!---------- SCRIPTS ---------->

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter, RouterView } from 'vue-router'
import { Menu, House, Collection } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { useStudentStore } from '@/stores/student'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const studentStore = useStudentStore()
const { fullscreenLoading } = storeToRefs(userStore)

const activeIndex = ref('1')
const isMobile = ref(window.innerWidth <= 768)
const isTinyScreen = ref(window.innerWidth < 400)
const isDrawerVisible = ref(false)

const updateScreenSize = () => {
  isMobile.value = window.innerWidth <= 768
}
const updateTinyScreen = () => {
  isTinyScreen.value = window.innerWidth < 400
}

const handleSelect = (key: string) => {
  activeIndex.value = key
  if (key === '1') router.push('/dashboard')
  else if (key === '2-1') router.push('/masterlist')
  else if (key === '2-2') handleCommand('reset')
  else if (key === '2-3') handleCommand('logout')
  isDrawerVisible.value = false
}

const updateActiveIndexFromRoute = (path: string) => {
  if (path.startsWith('/dashboard')) activeIndex.value = '1'
  else if (path.startsWith('/masterlist')) activeIndex.value = '2-1'
  else activeIndex.value = ''
}

const toggleDrawer = () => {
  isDrawerVisible.value = !isDrawerVisible.value
}

let scrollBarWidth = 0
const lockBodyScroll = () => {
  const body = document.body
  void body.offsetWidth // force reflow
  scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
  body.style.overflow = 'hidden'
  if (scrollBarWidth > 0) body.style.paddingRight = `${scrollBarWidth}px`
}

const unlockBodyScroll = () => {
  const body = document.body
  setTimeout(() => {
    body.style.overflow = ''
    body.style.paddingRight = ''
  }, 0)
}

const handleCommand = (command: string) => {
  ElMessage.closeAll()
  if (command === 'logout') {
    lockBodyScroll()
    ElMessageBox.confirm('Log out of your account?', {
      confirmButtonText: 'LOG OUT',
      cancelButtonText: 'Cancel',
    })
      .then(() => {
        fullscreenLoading.value = true
        userStore.logout()
        studentStore.resetStudents()
        router.push({ name: 'login' }).then(() => {
          ElMessage({ type: 'success', message: 'Logout successful' })
          fullscreenLoading.value = false
          unlockBodyScroll()
        })
      })
      .catch(unlockBodyScroll)
  } else if (command === 'reset') {
    lockBodyScroll()
    ElMessageBox.confirm(
      'This will reset your entire database. Proceed?',
      'Warning',
      {
        confirmButtonText: 'YES',
        cancelButtonText: 'Cancel',
        type: 'warning',
      },
    )
      .then(() => {
        ElMessage({
          type: 'success',
          message: 'All data has been reset to default',
        })
        studentStore.resetStudents()
        userStore.resetForgetClickCount()
        unlockBodyScroll()
      })
      .catch(unlockBodyScroll)
  } else {
    ElMessage(`Clicked item: ${command}`)
  }
}

watch(
  () => route.name,
  (name) => {
    if (name === 'login') document.body.classList.add('login-bg')
    else document.body.classList.remove('login-bg')
  },
  { immediate: true },
)

onMounted(() => {
  updateScreenSize()
  updateTinyScreen()
  window.addEventListener('resize', updateScreenSize)
  window.addEventListener('resize', updateTinyScreen)
  watch(
    () => route.path,
    (newPath) => updateActiveIndexFromRoute(newPath),
    { immediate: true },
  )
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenSize)
  window.removeEventListener('resize', updateTinyScreen)
})
</script>

<!---------- TEMPLATES ---------->

<template>
  <div class="app-container">
    <div v-loading.fullscreen.lock="fullscreenLoading">
      <div v-if="route.name !== 'login' && route.name !== 'error'">
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
            <el-menu-item index="2-3" style="color: #ff2200af; font-weight: 600"
              >Logout</el-menu-item
            >
          </el-sub-menu>
        </el-menu>

        <!-- Mobile Navbar -->
        <div v-else class="navbar mobile-navbar">
          <div class="logo-text" @click="handleSelect('1')">
            Student Registration
          </div>

          <el-icon @click="toggleDrawer" class="menu-button">
            <Menu />
          </el-icon>

          <el-drawer
            v-model="isDrawerVisible"
            direction="ltr"
            size="200px"
            with-header="false"
            :modal="true"
            append-to-body="false"
            @opened="lockBodyScroll"
            @closed="unlockBodyScroll"
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
                <el-menu-item index="2-3" class="logout-item"
                  >Logout</el-menu-item
                >
              </el-menu>
            </div>
          </el-drawer>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="main">
      <RouterView />
    </div>
  </div>
</template>

<!---------- STYLES ---------->

<style scoped>
.menu-spacer {
  flex: 1;
}

.main {
  padding: 40px 2rem 0;
  display: flex;
  justify-content: center;
}

/* ────────────────────────
  NAVBAR STYLES
 ──────────────────────── */

.navbar.mobile-navbar {
  padding: 0.5rem 1rem;
  box-sizing: border-box;
  width: 100%;
  max-width: 100vw;
  height: 55px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, #6b91ed 0%, #00b1b1 60%);
  box-shadow:
    5px 10px 20px rgba(100, 150, 255, 0.25),
    0 1px 6px rgba(0, 0, 0, 0.08);
}

/* BUTTON */
.menu-button {
  margin-left: 1rem;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
}

.home-button {
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  transition: background 0.3s;
}

.logout-item {
  color: #ff2200af !important;
  font-weight: 600;
}
.logout-item:hover {
  background-color: #fdecea !important;
}

/* LOGO */
.logo-text {
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

/* ────────────────────────
  DRAWER
────────────────────────── */

.drawer-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.el-menu-vertical {
  border: none !important;
}

.nav-menu {
  flex-grow: 1;
}

.action-menu {
  border-top: 1px solid #e4e7ed;
  padding-top: 0.5rem;
}
</style>
