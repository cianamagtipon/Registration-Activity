/*BASIC DESCRIPTION: These are the main components of the student masterlist page.*/


<!---------- SCRIPTS ---------->


<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useStudentStore } from '@/stores/student'
import { ElMessage } from 'element-plus'

import AddStudent from './forms/AddStudent.vue'

const studentStore = useStudentStore()

const tableData = ref([])
const addStudentRef = ref()

onMounted(() => {
  studentStore.fetchStudents()
  tableData.value = [...studentStore.students]
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
  tableData.value = [...studentStore.students]
  ElMessage.closeAll()
  ElMessage.success('Student added!')
}


const deleteRow = (id) => {
  studentStore.removeStudent(id)
  tableData.value = [...studentStore.students]
  ElMessage.closeAll()
  ElMessage.success('Student removed.')
}
</script>


<!---------- TEMPLATES ---------->


<template>
  <div class="table-container">
    <el-table :data="tableData" max-height="500px" class="student-table">
      <el-table-column
        prop="lastName"
        label="Last Name"
        width="150" />
      <el-table-column
        prop="firstName"
        label="First Name"
        width="150" />
      <el-table-column
        prop="middleInitial"
        label="Middle Initial"
        width="150" />
      <el-table-column
        prop="birthDate"
        label="Birth Date"
        width="140">
        <template #default="scope">
          {{ new Date(scope.row.birthDate).toLocaleDateString() }}
        </template>
      </el-table-column>
      <el-table-column
        prop="age"
        label="Age"
        width="150" />
      <el-table-column
        prop="address"
        label="Address"
        width="250">
        <template #default="scope">
          {{ scope.row.address.street }},
          {{ scope.row.address.city }},
          {{ scope.row.address.province }}.
          {{ scope.row.address.zipCode }}.
        </template>
      </el-table-column>
      <el-table-column
        prop="course"
        label="Course" />
      <el-table-column
        fixed="right"
        label="Operations"
        width="150">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="medium"
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


