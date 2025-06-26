<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Setting, ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useStudentStore } from '@/stores/student'

const activeIndex = ref('1')

const route = useRoute()
const router = useRouter()

const userStore = useUserStore()
const studentStore = useStudentStore()

const isMobile = ref(window.innerWidth <= 768)

const updateScreenSize = () => {
  isMobile.value = window.innerWidth <= 768
}

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

const handleSelect = (key: string) => {
  activeIndex.value = key
  if (key === '1') router.push('/dashboard')
  else if (key === '2') router.push('/masterlist')
  // add more routing if needed
}

const updateActiveIndexFromRoute = (path: string) => {
  if (path.startsWith('/dashboard')) activeIndex.value = '1'
  else if (path.startsWith('/masterlist')) activeIndex.value = '2'
  else activeIndex.value = ''
}

// LOGIN BACKGROUND

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

// DROP DOWN
const handleCommand = (command: string) => {
  ElMessage.closeAll()
  if (command === 'logout') {
    router.push({ name: 'login' })
    userStore.logout()
    studentStore.resetStudents()
    ElMessage.success('Logged out successfully')
  } else if (command === 'reset') {
    studentStore.resetStudents()
    ElMessage.success('Student list reset')
  } else {
    ElMessage(`Clicked item: ${command}`)
  }
}
</script>

<template>
  <div v-if="route.name !== 'login'" class="table-header">
    <el-menu
      :default-active="activeIndex"
      active-text-color="#00b1b1"
      mode="horizontal"
      class="navbar"
      @select="handleSelect"
      router
    >
      <el-menu-item index="1">Home</el-menu-item>
      <el-menu-item index="2">Masterlist</el-menu-item>
    </el-menu>

    <div class="drop-location">
      <el-dropdown
        trigger="click"
        @command="handleCommand"
        style="justify-content: center; align-content: center"
      >
        <span
          class="el-dropdown-link"
          style="cursor: pointer; display: flex; align-items: center"
        >
          <el-icon><Setting /></el-icon>
          <el-icon class="el-icon--right" style="margin-left: 4px"
            ><ArrowDown
          /></el-icon>
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

  <!-- Actual page content -->
  <div class="main">
    <RouterView />
  </div>
</template>

<style scoped>
.table-header {
  display: grid;
  grid-template-columns: 85% 15%;
  grid-template-rows: 1fr;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  margin-bottom: 10px;
  /* no changes on smaller screens, so no media queries to switch to vertical */
}

/* NAVBAR CONTAINER */
.navbar {
  border-radius: 12px;
  background: linear-gradient(
    to right,
    #244bc5 0%,
    #6b91ed 45%,
    #6b91ed 55%,
    #244bc5 100%
  );
  box-shadow:
    0 0 15px rgba(100, 150, 255, 0.5),
    0 1px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.drop-location {
  display: flex; /* add this */
  justify-content: center;
  align-items: center;

  border-radius: 12px;
  box-shadow:
    0 0 15px rgba(100, 150, 255, 0.5),
    0 1px 6px rgba(0, 0, 0, 0.1);
  background: linear-gradient(
    to right,
    #244bc5 0%,
    #6b91ed 45%,
    #6b91ed 55%,
    #244bc5 100%
  );
  height: 60px;

  color: white;
}

.el-icon {
  color: white !important;
}

/* PAGE CONTAINER */
.main {
  padding-top: 50px;
  display: flex;
  justify-content: center;
}

/* REMOVE DEFAULT BOTTOM BORDER */
::v-deep(.el-menu--horizontal .el-menu-item::after) {
  display: none !important;
}

::v-deep(.el-menu--horizontal .el-menu-item.is-active::after) {
  display: none !important;
  border-bottom: none !important;
  height: 0 !important;
  transform: none !important;
}

/* DISABLE WEIRD DEFAULT TRANSITIONS */
::v-deep(.el-menu--horizontal .el-menu-item) {
  transition: none !important;
}

/* MENU TEXT DEFAULT (white text) */
::v-deep(.el-menu-item),
::v-deep(.el-sub-menu__title) {
  color: white !important;
  font-weight: 500 !important;
  transition: all 0.3s ease;
}

/* ACTIVE ITEM */
::v-deep(.el-menu-item.is-active) {
  color: #6b91ed !important;
  font-weight: 600 !important;
  border-bottom: 2px solid #6b91ed;
  background-color: transparent !important;
  box-shadow: none !important;

  background: linear-gradient(to right, #00b1b1, #ffffff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

/* HOVER EFFECTS */
::v-deep(.el-menu-item:hover),
::v-deep(.el-sub-menu__title:hover) {
  color: #6b91ed !important;
  border-bottom: 2px solid #6b91ed;
  background-color: transparent !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

/* REMOVE WHITE CLICK HIGHLIGHT */
::v-deep(.el-menu-item:focus),
::v-deep(.el-menu-item:active),
::v-deep(.el-sub-menu__title:focus),
::v-deep(.el-sub-menu__title:active) {
  background-color: transparent !important;
  box-shadow: none !important;
  outline: none !important;
}
</style>
