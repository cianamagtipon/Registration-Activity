/*BASIC DESCRIPTION: These are the main components of the student masterlist.*/

<!---------- SCRIPTS ---------->

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

import { useStudentStore } from '@/stores/student'
import type { Student } from '@/stores/student'

import AddStudent from './forms/AddStudent.vue'
import EditStudent from './forms/EditStudent.vue'

import { studentFilter } from '@/composables/studentFilter'

const studentStore = useStudentStore()
const { students } = storeToRefs(studentStore)

const addStudentRef = ref()
const editStudentRef = ref()

const {
  search,
  courseFilter,
  visibleStudents: filteredStudents,
} = studentFilter(students, 'advanced')

const courseNames = {
  BSCS: 'Bachelor of Science in Computer Science',
  BSIT: 'Bachelor of Science in Information Technology',
  BST: 'Bachelor of Science in Tourism',
  BSHRM: 'Bachelor of Science in Hotel and Restaurant Management',
  BSN: 'Bachelor of Science in Nursing',
}

const handleStudentAdded = (rawForm) => {
  const studentRaw = {
    firstName: rawForm.firstName,
    middleInitial: rawForm.middleInitial,
    lastName: rawForm.lastName,
    birthDate: new Date(rawForm.birthday),
    course: rawForm.course,
    address: {
      street: rawForm.address.street,
      city: rawForm.address.city,
      province: rawForm.address.province,
      zipCode: Number(rawForm.address.zipCode),
    },
  }

  studentStore.addStudent(studentRaw)
  ElMessage.closeAll()
  ElMessage.success('Student added')
}

const handleStudentUpdated = (updatedStudent: Student) => {
  studentStore.updateStudent(updatedStudent)
}

const deleteRow = (id) => {
  ElMessageBox.confirm(
    'Are you sure you want to remove this student?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    },
  )
    .then(() => {
      studentStore.removeStudent(id)
      ElMessage({
        type: 'success',
        message: 'Delete completed',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      })
    })
}

onMounted(() => {
  studentStore.fetchStudents()
})
</script>

<!---------- TEMPLATES ---------->

<template>
  <div class="masterlist-container">
    <div class="actions">
      <!-- FILTERS -->
      <div class="filter-column">
        <div class="table-filters">
          <!-- Search -->
          <el-input
            class="search-bar"
            v-model="search"
            placeholder=" Find Name or Address"
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
      </div>

      <!-- Add Student -->
      <div class="button-column">
        <el-button class="add-button" @click="addStudentRef.openForm()">
          Add Student
        </el-button>
      </div>
    </div>

    <!-- STUDENT TABLE -->
    <el-table :data="filteredStudents" max-height="410px" class="student-table">
      <el-table-column
        prop="lastName"
        label="Last Name"
        min-width="150"
        align="center"
      />
      <el-table-column
        prop="firstName"
        label="First Name"
        min-width="150"
        align="center"
      />
      <el-table-column
        prop="middleInitial"
        label="Middle Initial"
        min-width="120"
        align="center"
      />
      <el-table-column
        prop="birthDate"
        label="Birth Date"
        min-width="140"
        align="center"
      >
        <template #default="scope">
          {{ new Date(scope.row.birthDate).toLocaleDateString() }}
        </template>
      </el-table-column>
      <el-table-column prop="age" label="Age" min-width="90" align="center" />
      <el-table-column prop="address" label="Address" min-width="250">
        <template #default="scope">
          {{ scope.row.address.street }}, {{ scope.row.address.city }},
          {{ scope.row.address.province }}. {{ scope.row.address.zipCode }}.
        </template>
      </el-table-column>
      <el-table-column label="Course" min-width="250">
        <template #default="scope">
          {{ courseNames[scope.row.course] || scope.row.course }}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="Operations"
        min-width="150"
        align="center"
      >
        <template #default="scope">
          <el-button
            class="edit-button"
            link
            type="primary"
            size="medium"
            @click="editStudentRef.openForm(scope.row)"
          >
            Edit
          </el-button>
          <el-button
            class="remove-button"
            link
            type="primary"
            size="medium"
            @click.prevent="deleteRow(scope.row.id)"
          >
            Remove
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- DRAWERS -->
  <EditStudent ref="editStudentRef" @student-updated="handleStudentUpdated" />
  <AddStudent ref="addStudentRef" @student-added="handleStudentAdded" />
</template>

<!---------- STYLES ---------->

<style scoped>
.masterlist-container {
  max-width: 1440px;
  width: 80vw;
  margin: 0 auto;
}

/* ────────────────────────
  ACTIONS
 ──────────────────────── */

.actions {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.table-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  min-width: 250px;
}

/* LEFT SIDE (FILTERS) */
.filter-column {
  flex: 1 1 60%;
}

/* RIGHT SIDE (ADD BUTTON) */
.button-column {
  flex: 1 1 30%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.add-button {
  white-space: nowrap;
  align-self: flex-end;
}

/* ===== FILTER ELEMENTS ===== */

.search-bar,
.course-select {
  width: 200px;
  min-width: 150px;
}

/* ────────────────────────
  TABLE
 ──────────────────────── */

.student-table {
  border-radius: 12px;
  margin-top: 30px;
  overflow: hidden;
  border: 1px solid #ebeef5;
  box-shadow:
    0px 0px 20px rgba(100, 150, 255, 0.25),
    0 1px 6px rgba(0, 0, 0, 0.08);
}

/* ────────────────────────
  OVERRIDES
 ──────────────────────── */

::v-deep(.search-bar .el-input__wrapper) {
  border-radius: 8px;
  box-shadow:
    0 4px 12px rgba(36, 75, 197, 0.25),
    0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

::v-deep(.course-select .el-select__wrapper) {
  border-radius: 8px;
  box-shadow:
    0 4px 12px rgba(36, 75, 197, 0.25),
    0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

/* ALL BUTTONS THAT ARE NOT EDIT AND REMOVE */
::v-deep(.el-button:not(.edit-button):not(.remove-button)) {
  border-radius: 8px;
  box-shadow:
    0px 0px 20px rgba(100, 150, 255, 0.25),
    0 1px 6px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

/* HOVER FOR BUTTONS THAT ARE NOT EDIT AND REMOVE */
::v-deep(.el-button:not(.edit-button):not(.remove-button):hover) {
  border: none;
  transform: translateY(2px);
  box-shadow:
    0 4px 12px rgba(36, 75, 197, 0.25),
    0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
}

/* ────────────────────────
  MEDIA
 ──────────────────────── */

@media (max-width: 600px) {
  .search-bar,
  .course-select {
    width: 200px;
  }

  .button-column {
    width: 100%;
    justify-content: flex-end;
    margin-top: 10px;
  }
}

@media (max-width: 465px) {
  .search-bar,
  .course-select,
  .add-button {
    width: 100%;
  }
}
</style>
