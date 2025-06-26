/*BASIC DESCRIPTION: These are the main components of the dashboard.*/

<!---------- SCRIPTS ---------->

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStudentStore } from '@/stores/student'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import {
  Calendar,
  Location,
  Notebook,
  Tickets,
  User,
  Search,
} from '@element-plus/icons-vue'

import type { Student } from '@/stores/student'

const search = ref('')
const selectedStudent = ref<Student | null>(null)

const router = useRouter()
const userStore = useUserStore()

const studentStore = useStudentStore()
const { students } = storeToRefs(studentStore)

onMounted(() => {
  studentStore.fetchStudents()
})
</script>

<!---------- TEMPLATES ---------->

<template>
  <div class="format-container">
    <div class="dashboard-container">
      <!-- FILTER -->
      <!-- <el-input
        class="search-bar"
        v-model="search"
        placeholder="Search..."
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input> -->

      <!-- STUDENT DETAIL -->
      <el-descriptions
        class="margin-top"
        title="Student Information"
        :column="3"
        border
      >
        <!-- <template #extra>
          <el-button type="default" @click="router.push('/masterlist')"
            >Go to Masterlist</el-button
          >
        </template> -->
      </el-descriptions>

      <!-- Transition wrapper using dynamic key to force transition -->
      <transition name="fade-slide" mode="out-in">
        <div
          :key="selectedStudent?.id ?? 'no-student'"
          class="description-container"
        >
          <el-descriptions v-if="selectedStudent" :column="3" border>
            <el-descriptions-item :span="3">
              <template #label>
                <span class="icon-container"
                  ><el-icon><User /></el-icon
                ></span>
                Student
              </template>
              {{ selectedStudent.firstName }}
              {{ selectedStudent.middleInitial }}
              {{ selectedStudent.lastName }}
            </el-descriptions-item>

            <el-descriptions-item>
              <template #label>
                <span class="icon-container"
                  ><el-icon><Calendar /></el-icon
                ></span>
                Birthday
              </template>
              {{ new Date(selectedStudent.birthDate).toLocaleDateString() }}
            </el-descriptions-item>

            <el-descriptions-item>
              <template #label>
                <span class="icon-container"
                  ><el-icon><Notebook /></el-icon
                ></span>
                Age
              </template>
              {{ selectedStudent.age }}
            </el-descriptions-item>

            <el-descriptions-item>
              <template #label>
                <span class="icon-container"
                  ><el-icon><Tickets /></el-icon
                ></span>
                Course
              </template>
              <el-tag size="small">{{ selectedStudent.course }}</el-tag>
            </el-descriptions-item>

            <el-descriptions-item :span="3">
              <template #label>
                <span class="icon-container"
                  ><el-icon><Location /></el-icon
                ></span>
                Address
              </template>
              {{ selectedStudent.address.street }},
              {{ selectedStudent.address.city }},
              {{ selectedStudent.address.province }}.
              {{ selectedStudent.address.zipCode }}.
            </el-descriptions-item>
          </el-descriptions>

          <el-empty
            v-else
            description="Click a student card to see details"
            class="empty"
          />
        </div>
      </transition>

      <!-- CAROUSEL -->
      <div class="carousel-container">
        <el-carousel
          :interval="4000"
          type="card"
          height="250px"
          indicator-position="none"
        >
          <el-carousel-item v-for="student in students" :key="student.id">
            <el-card
              class="carousel-card"
              shadow="hover"
              @click="selectedStudent = student"
            >
              <template #header>
                <div class="card-header">
                  <span>
                    <el-avatar>
                      {{
                        student.firstName.charAt(0).toUpperCase() +
                        student.lastName.charAt(0).toUpperCase()
                      }}
                    </el-avatar>
                    <strong
                      >{{ student.firstName }} {{ student.middleInitial }}
                      {{ student.lastName }}</strong
                    ></span
                  >
                </div>
              </template>
              <p class="card-text">Age: {{ student.age }}</p>
              <p class="card-text">Course: {{ student.course }}</p>
            </el-card>
          </el-carousel-item>
        </el-carousel>
      </div>

      <!-- FILTER -->
    </div>
  </div>
</template>

<!---------- STYLES ---------->

<style scoped>
/* SEARCH BAR */
.search-bar {
  width: 40%;
  margin-bottom: 30px;
  border-radius: 8px;
}

/* STUDENT DETAIL */
.dashboard-container {
  max-width: 1440px;
  width: 80vw;
  margin: 0 auto;
}

.description-container {
  margin-top: 10px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #ebeef5;
  box-shadow:
    0 0 10px rgba(100, 150, 255, 0.25),
    0 1px 6px rgba(0, 0, 0, 0.08);
}

.icon-container {
  padding: 8px;
}

.empty {
  height: 150px;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
  will-change: transform, opacity;
  transform-origin: center center;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: scale(1.015);
}

@media screen and (max-width: 800px) {
  .icon-container {
    display: none;
  }
}

/* CAROUSEL */
.el-avatar {
  margin-right: 10px;
  background: linear-gradient(to right, #244bc5 0%, #6b91ed 60%);
  color: white;
  font-weight: bold;
  border: none;
}

.card-text {
  margin: 6px 0;
  font-size: 15px;
}

.carousel-container {
  margin-top: 40px;
}

.carousel-card {
  height: 90%;
  background: white;
  border-radius: 8px;
  box-sizing: border-box;
  border: 2px solid #ebeef5;
  transition:
    box-shadow 0.3s ease,
    transform 0.15s ease;
  cursor: pointer;
}

.carousel-card:hover {
  box-shadow:
    5px 10px 20px rgba(100, 150, 255, 0.25),
    0 1px 6px rgba(0, 0, 0, 0.08);
}

.carousel-card:active {
  transform: scale(0.97);
}

::v-deep(.el-carousel__container) {
  overflow: visible !important;
  padding-top: 20px;
  box-sizing: border-box;
}

::v-deep(.el-carousel__item) {
  overflow: visible !important;
}

.empty :deep(.el-empty__image) {
  width: 90px;
  height: 90px;
}

::v-deep(.el-carousel__item.is-active .carousel-card) {
  box-shadow:
    5px 10px 20px rgba(100, 150, 255, 0.25),
    0 1px 6px rgba(0, 0, 0, 0.08);
}
</style>
