<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Setting } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
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

// Handle menu selection
const handleSelect = (key: string) => {
  activeIndex.value = key
  if (key === '1') router.push('/dashboard')
  else if (key === '2') router.push('/masterlist')
}

// Sync menu highlight with route
const updateActiveIndexFromRoute = (path: string) => {
  if (path.startsWith('/dashboard')) activeIndex.value = '1'
  else if (path.startsWith('/masterlist')) activeIndex.value = '2'
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
    fullscreenLoading.value = true
    setTimeout(() => {
      router.push({ name: 'login' })
      userStore.logout()
      studentStore.resetStudents()
      fullscreenLoading.value = false
    }, 1500)
  } else if (command === 'reset') {
    studentStore.resetStudents()
    userStore.resetForgetClickCount()
    ElMessage.info('All data has been reset to default')
  } else {
    ElMessage(`Clicked item: ${command}`)
  }
}

// Track dropdown open state for icon animation
const isDropdownOpen = ref(false)

// Watch screen resize and current route path
onMounted(() => {
  window.addEventListener('resize', updateScreenSize)
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
})
</script>

<template>
  <div v-loading.fullscreen.lock="fullscreenLoading">
    <div v-if="route.name !== 'login'" class="table-header">
      <el-menu
        :default-active="activeIndex"
        active-text-color="#00b1b1"
        mode="horizontal"
        class="navbar"
        @select="handleSelect"
        router
      >
        <el-menu-item index="1">
          <span class="menu-glow">Home</span>
        </el-menu-item>
        <el-menu-item index="2">
          <span class="menu-glow">Masterlist</span>
        </el-menu-item>
      </el-menu>

      <div class="drop-location">
        <el-dropdown
          trigger="click"
          @command="handleCommand"
          @visible-change="(val) => (isDropdownOpen = val)"
        >
          <span
            class="el-dropdown-link"
            style="cursor: pointer; display: flex; align-items: center"
          >
            <el-icon :class="['setting-icon', isDropdownOpen ? 'active' : '']">
              <Setting />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="reset">Reset</el-dropdown-item>
              <el-dropdown-item command="logout">Logout</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <div class="main">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.table-header {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 10px;
  margin: 20px 0 10px;
}

.main {
  padding-top: 40px;
  display: flex;
  justify-content: center;
}

/* ────────────────────────
  NAVBAR STYLES
 ──────────────────────── */
.navbar {
  border-radius: 12px;
  background: linear-gradient(
    to right,
    #244bc5 0%,
    #00b1b1 45%,
    #00b1b1 55%,
    #244bc5 100%
  );
  box-shadow:
    0 0 15px rgba(100, 150, 255, 0.5),
    0 1px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* ────────────────────────
  DROPDOWN
 ──────────────────────── */
.drop-location {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 16px;
  height: 60px;

  background: #244bc5;
  color: white;
  border-radius: 12px;
  box-shadow:
    0 0 15px rgba(100, 150, 255, 0.5),
    0 1px 6px rgba(0, 0, 0, 0.1);
}

.el-icon {
  color: white !important;
}

.setting-icon {
  font-size: 20px;
  color: white;
  transition: all 0.3s ease;
}

.setting-icon:hover {
  color: #6b91ed !important;
  transform: scale(1.1);
}

/* ────────────────────────
  OVERRIDES
 ──────────────────────── */

/* MENU TEXT (WHITE) */
::v-deep(.el-menu-item),
::v-deep(.el-sub-menu__title) {
  color: white !important;
  font-weight: 600 !important;
  transition: all 0.3s ease;
}

/* MENU TEXT (GLOW) */
::v-deep(.el-menu-item.is-active .menu-glow) {
  background: linear-gradient(to right, #00b1b1, #ffffff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  font-weight: 600;
  letter-spacing: 1.5px;
  filter: drop-shadow(0 0 4px #244bc5);
}

/* HOVER GLOW */
::v-deep(.el-menu-item:hover),
::v-deep(.el-sub-menu__title:hover) {
  border-bottom: 2px solid #6b91ed;
  background-color: transparent !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  filter: drop-shadow(0 0 4px #244bc5);
  background: linear-gradient(to right, #6b91ed, #ffffff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

/* ICON ACTIVE */
::v-deep(.setting-icon.active) {
  color: #00b1b1 !important;
}

/* REMOVE BOTTOM BORDER PLUS CLEAN TRANSITIONS */
::v-deep(.el-menu--horizontal .el-menu-item::after),
::v-deep(.el-menu--horizontal .el-menu-item.is-active::after) {
  display: none !important;
  border-bottom: none !important;
  height: 0 !important;
  transform: none !important;
}

::v-deep(.el-menu--horizontal .el-menu-item) {
  transition: none !important;
}

::v-deep(.el-menu-item:focus),
::v-deep(.el-menu-item:active),
::v-deep(.el-sub-menu__title:focus),
::v-deep(.el-sub-menu__title:active) {
  background-color: transparent !important;
  box-shadow: none !important;
  outline: none !important;
}
</style>
