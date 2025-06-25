/*BASIC DESCRIPTION: These are the main components of the student masterlist
page.*/

<!---------- SCRIPTS ---------->

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStudentStore } from '@/stores/student'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'

import AddStudent from './forms/AddStudent.vue'
import EditStudent from './forms/EditStudent.vue'

import type { Student } from '@/stores/student'

const router = useRouter()
const studentStore = useStudentStore()
const { students } = storeToRefs(studentStore)

const addStudentRef = ref()
const editStudentRef = ref()

onMounted(() => {
  studentStore.fetchStudents()
})

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
  studentStore.removeStudent(id)
  ElMessage.closeAll()
  ElMessage.success('Student removed')
}

const resetData = () => {
  studentStore.resetStudents()
}
</script>

<!---------- TEMPLATES ---------->

<template>
  <div class="table-container">
    <el-descriptions
      class="margin-top"
      title="Student Masterlist"
      :column="3"
      border
    >
      <template #extra>
        <el-button type="default" @click="router.push('/dashboard')"
          >Return to Dashboard</el-button
        >
      </template>
    </el-descriptions>

    <el-table :data="students" max-height="410px" class="student-table">
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
            link
            type="primary"
            size="medium"
            @click="editStudentRef.openForm(scope.row)"
          >
            Edit
          </el-button>

          <el-button
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

    <el-button class="add-button" @click="addStudentRef.openForm()">
      Add Student
    </el-button>
  </div>

  <EditStudent ref="editStudentRef" @student-updated="handleStudentUpdated" />
  <AddStudent ref="addStudentRef" @student-added="handleStudentAdded" />
</template>

<!---------- STYLES ---------->

<style scoped>
.table-container {
  max-width: 1440px;
  width: 80vw;
  margin: 0 auto;
}

.student-table {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #ebeef5;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
}

.add-button {
  display: block;
  width: 100%;
  margin-top: 16px;
}
</style>
