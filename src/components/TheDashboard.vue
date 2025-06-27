/*BASIC DESCRIPTION: These are the main components of the dashboard.*/

<!---------- SCRIPTS ---------->

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useStudentStore } from '@/stores/student'
import { storeToRefs } from 'pinia'
import {
  Calendar,
  Location,
  Notebook,
  Tickets,
  User,
  Search,
} from '@element-plus/icons-vue'

import type { Student } from '@/stores/student'
import { studentFilter } from '@/composables/studentFilter'

const time = ref('')
const value = ref(new Date())
const selectedStudent = ref<Student | null>(null)

const studentStore = useStudentStore()
const { students } = storeToRefs(studentStore)

const { search, courseFilter, visibleStudents, load } = studentFilter(
  students,
  'simple',
)

const descriptionColumnCount = ref(3)

const updateDescriptionColumns = () => {
  const width = window.innerWidth
  if (width < 480) {
    descriptionColumnCount.value = 1
  } else if (width < 768) {
    descriptionColumnCount.value = 2
  } else {
    descriptionColumnCount.value = 3
  }
}

onMounted(() => {
  studentStore.fetchStudents()

  time.value = new Date().toLocaleTimeString()
  setInterval(() => {
    time.value = new Date().toLocaleTimeString()
  }, 1000)

  updateDescriptionColumns()
  window.addEventListener('resize', updateDescriptionColumns)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateDescriptionColumns)
})
</script>

<!---------- TEMPLATES ---------->

<template>
  <div class="format-container">
    <!-- STUDENT DETAIL AND CAROUSEL -->
    <div class="dashboard-container">
      <el-descriptions
        class="margin-top"
        title="Student Information"
        :column="descriptionColumnCount"
        border
      />

      <!-- STUDENT DETAIL AND EMPTY STATE -->
      <transition name="fade-slide" mode="out-in">
        <div
          :key="selectedStudent?.id ?? 'no-student'"
          class="description-container"
        >
          <el-descriptions
            v-if="selectedStudent"
            :column="descriptionColumnCount"
            border
          >
            <el-descriptions-item :span="3">
              <template #label>
                <span class="icon-container">
                  <el-icon><User /></el-icon>
                </span>
                Student
              </template>
              {{ selectedStudent.firstName }}
              {{ selectedStudent.middleInitial }}
              {{ selectedStudent.lastName }}
            </el-descriptions-item>

            <el-descriptions-item>
              <template #label>
                <span class="icon-container">
                  <el-icon><Calendar /></el-icon>
                </span>
                Birthday
              </template>
              {{ new Date(selectedStudent.birthDate).toLocaleDateString() }}
            </el-descriptions-item>

            <el-descriptions-item>
              <template #label>
                <span class="icon-container">
                  <el-icon><Notebook /></el-icon>
                </span>
                Age
              </template>
              {{ selectedStudent.age }}
            </el-descriptions-item>

            <el-descriptions-item>
              <template #label>
                <span class="icon-container">
                  <el-icon><Tickets /></el-icon>
                </span>
                Course
              </template>
              <el-tag size="small">{{ selectedStudent.course }}</el-tag>
            </el-descriptions-item>

            <el-descriptions-item :span="3">
              <template #label>
                <span class="icon-container">
                  <el-icon><Location /></el-icon>
                </span>
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
                    <strong>
                      {{ student.firstName }} {{ student.middleInitial }}
                      {{ student.lastName }}
                    </strong>
                  </span>
                </div>
              </template>
              <p class="card-text">Age: {{ student.age }}</p>
              <p class="card-text">Course: {{ student.course }}</p>
            </el-card>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>

    <!-- BODY -->
    <div class="body-container">
      <!-- STUDENT SEARCH & FILTERS -->
      <div class="student-search">
        <div class="card-filters">
          <!-- Search -->
          <el-input
            class="name-search"
            v-model="search"
            placeholder="Search by Name..."
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>

          <!-- Course Filter -->
          <el-select
            v-model="courseFilter"
            placeholder="Filter by Course"
            clearable
            class="course-select"
            @clear="courseFilter = ''"
          >
            <el-option label="BSCS" value="BSCS" />
            <el-option label="BSIT" value="BSIT" />
            <el-option label="BST" value="BST" />
            <el-option label="BSHRM" value="BSHRM" />
            <el-option label="BSN" value="BSN" />
          </el-select>
        </div>

        <!-- INFINITE SCROLL STUDENT LIST -->
        <div v-infinite-scroll="load" class="infinite-list">
          <el-card
            v-for="student in visibleStudents"
            :key="student.id"
            class="carousel-card"
            @click="selectedStudent = student"
            style="margin-bottom: 16px"
          >
            <template #header>
              <div class="card-header">
                <el-avatar>
                  {{
                    student.firstName.charAt(0).toUpperCase() +
                    student.lastName.charAt(0).toUpperCase()
                  }}
                </el-avatar>
                <strong>
                  {{ student.firstName }} {{ student.middleInitial }}
                  {{ student.lastName }}
                </strong>
              </div>
            </template>
            <p class="card-text">Age: {{ student.age }}</p>
            <p class="card-text">Course: {{ student.course }}</p>
          </el-card>
        </div>
      </div>

      <!-- UTILITIES -->
      <div class="utilities">
        <!-- Clock -->
        <div class="time">
          <el-card class="clock-card">
            <div class="clock-display">{{ time }}</div>
          </el-card>
        </div>

        <!-- Calendar -->
        <div class="calendar">
          <el-calendar v-model="value" />
        </div>
      </div>
    </div>
  </div>
</template>

<!---------- STYLES ---------->

<style scoped>
.dashboard-container {
  max-width: 1440px;
  width: 80vw;
  margin: 0 auto;
}

/* ────────────────────────
  STUDENT INFORMATION
 ──────────────────────── */

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

/* ===== TRANSITIONS ===== */

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

/* ────────────────────────
  CAROUSEL
 ──────────────────────── */

.carousel-container {
  margin-top: 40px;
}

.el-avatar {
  margin-right: 10px;
  background: linear-gradient(to right, #244bc5 0%, #00b1b1 60%);
  color: white;
  font-weight: bold;
  border: none;
}

.card-text {
  margin: 6px 0;
  font-size: 15px;
}

.carousel-card {
  height: 90%;
  background: white;
  border-radius: 8px;
  border: 2px solid #ebeef5;
  box-sizing: border-box;
  cursor: pointer;
  transition:
    box-shadow 0.3s ease,
    transform 0.15s ease;
}

.carousel-card:hover {
  box-shadow:
    5px 10px 20px rgba(100, 150, 255, 0.25),
    0 1px 6px rgba(0, 0, 0, 0.08);
}

.carousel-card:active {
  transform: scale(0.97);
}

/* ────────────────────────
  BODY
 ──────────────────────── */
.body-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: start;
  gap: 40px;
  margin-top: 30px;
}

.student-search {
  grid-row: span 2 / span 2;
  padding: 30px;
  border-radius: 12px;
  min-height: 700px;
  max-height: 700px;
  box-shadow:
    5px 10px 20px rgba(100, 150, 255, 0.25),
    0 1px 6px rgba(0, 0, 0, 0.08);
}

/* ===== FILTERS ===== */

.card-filters {
  margin: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.card-filters > * {
  flex: 1 1 200px;
}

.name-search,
.course-select {
  height: 30px;
  min-height: 30px;
  max-height: 30px;
}

/* ===== INFINITE SCROLL ===== */

.infinite-list {
  max-height: 600px;
  margin-top: 30px;
  overflow-y: auto;
  padding: 20px;
  border-radius: 12px;
}

/* ===== CLOCK ===== */

.clock-card {
  background: linear-gradient(to right, #6b91ed, #00b1b1);
  color: white;
  text-align: center;
  padding: 20px;
  border-radius: 12px;
  border: none;
  box-shadow:
    0 0 15px rgba(100, 150, 255, 0.5),
    0 1px 6px rgba(0, 0, 0, 0.1);
}

.clock-display {
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 2px;
}

.calendar {
  margin-top: 30px;
  grid-column-start: 2;
}

/* ────────────────────────
  OVERRIDES
 ──────────────────────── */

::v-deep(.el-carousel__container) {
  overflow: visible !important;
  padding-top: 20px;
  box-sizing: border-box;
}

::v-deep(.el-carousel__item) {
  overflow: visible !important;
}

::v-deep(.el-carousel__item.is-active .carousel-card) {
  box-shadow:
    5px 10px 20px rgba(100, 150, 255, 0.25),
    0 1px 6px rgba(0, 0, 0, 0.08);
}

.empty :deep(.el-empty__image) {
  width: 90px;
  height: 90px;
}

::v-deep(.name-search .el-input__wrapper),
::v-deep(.course-select .el-select__wrapper) {
  border-radius: 8px;
  box-shadow:
    0 4px 12px rgba(36, 75, 197, 0.25),
    0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

/* ────────────────────────
  MEDIA
 ──────────────────────── */

@media (max-width: 1105px) {
  .infinite-list {
    max-height: 550px;
  }
}

@media screen and (max-width: 800px) {
  .icon-container {
    display: none;
  }
}

@media (max-width: 768px) {
  .body-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .student-search {
    width: 90%;
  }

  .infinite-list {
    max-height: 600px;
  }
}

@media (max-width: 600px) {
  .card-filters {
    flex-direction: column;
    align-items: stretch;
  }

  .infinite-list {
    max-height: 550px;
  }
}

@media (max-width: 400px) {
  .clock-display {
    font-size: 1.5rem;
  }
}
</style>
