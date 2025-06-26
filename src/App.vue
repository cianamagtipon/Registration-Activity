<script setup lang="ts">
/* BASIC DESCRIPTION: Handles navbar rendering and active state tracking. */
import { RouterView, useRoute, useRouter } from 'vue-router'
import { ref, watch, onMounted, onUnmounted } from 'vue'

const activeIndex = ref('1')
const route = useRoute()
const router = useRouter()

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
</script>

<template>
  <div v-if="route.name !== 'login'" class="header">
    <!-- HEADER -->

    <el-menu
      :default-active="activeIndex"
      :mode="isMobile ? 'vertical' : 'horizontal'"
      class="navbar"
      @select="handleSelect"
      router
    >
      <el-menu-item index="1">Home</el-menu-item>
      <el-menu-item index="2">Masterlist</el-menu-item>
    </el-menu>
  </div>

  <!-- Actual page content -->
  <div class="main">
    <RouterView />
  </div>
</template>

<style scoped>
/* HEADER */
.header {
  all: unset;
  font-family: inherit;
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
  color: #6b91ed !important;
  background-color: transparent !important;
  box-shadow: none !important;
  outline: none !important;
}
</style>
