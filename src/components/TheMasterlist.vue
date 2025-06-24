/*BASIC DESCRIPTION: These are the main components of the student masterlist page.*/


<!---------- SCRIPTS ---------->


<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useStudentStore } from '@/stores/student'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'

import AddStudent from './forms/AddStudent.vue'
import EditStudent from './forms/EditStudent.vue'

import type { Student } from '@/stores/student'

const studentStore = useStudentStore()
const { students } = storeToRefs(studentStore)

const addStudentRef = ref()
const editStudentRef = ref()

onMounted(() => {
  studentStore.fetchStudents()
})

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
    }
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
</script>



<!---------- TEMPLATES ---------->


<template>
  <div class="table-container">
    <el-table :data="students" max-height="410px" class="student-table">
      <el-table-column
        prop="lastName"
        label="Last Name"
        width="150"
        align="center" />
      <el-table-column
        prop="firstName"
        label="First Name"
        width="150"
        align="center" />
      <el-table-column
        prop="middleInitial"
        label="Middle Initial"
        width="120"
        align="center" />
      <el-table-column
        prop="birthDate"
        label="Birth Date"
        width="140"
        align="center" >
        <template #default="scope">
          {{ new Date(scope.row.birthDate).toLocaleDateString() }}
        </template>
      </el-table-column>
      <el-table-column
        prop="age"
        label="Age"
        width="90"
        align="center" />
      <el-table-column
        prop="address"
        label="Address"
        width="250" >
        <template #default="scope">
          {{ scope.row.address.street }},
          {{ scope.row.address.city }},
          {{ scope.row.address.province }}.
          {{ scope.row.address.zipCode }}.
        </template>
      </el-table-column>
      <el-table-column
        prop="course"
        label="Course"
        width="150"
        align="center" />
      <el-table-column
        fixed="right"
        label="Operations"
        width="150"
        align="center" >
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="medium"
            @click="editStudentRef.openDrawer(scope.row)"
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

    <el-button class="add-button" @click="addStudentRef.openDrawer()">
      Add Student
    </el-button>
  </div>

  <EditStudent ref="editStudentRef" @student-updated="handleStudentUpdated" />
  <AddStudent ref="addStudentRef" @student-added="handleStudentAdded" />

</template>



<!---------- STYLES ---------->


<style scoped>
.table-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-height: 60vh;
  }

.student-table {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #ebeef5;
}

.add-button {
  display: block;
  width: 100%;
  margin-top: 16px;
}
</style>


