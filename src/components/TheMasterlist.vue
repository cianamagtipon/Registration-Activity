/*BASIC DESCRIPTION: These are the main components of the student masterlist page.*/


<!---------- SCRIPTS ---------->


<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useStudentStore } from '@/stores/student'
import { storeToRefs } from 'pinia'

const studentStore = useStudentStore()
const { students } = storeToRefs(studentStore)

const tableData = ref([])

onMounted(() => {
  tableData.value = [...studentStore.students]
})

const deleteRow = studentStore.removeStudent
const onAddItem = studentStore.addStudent

</script>


<!---------- TEMPLATES ---------->


<template>
    <el-table :data="students" class="student-table">
      <el-table-column
        prop="lastName"
        label="Last Name" />
      <el-table-column
        prop="firstName"
        label="First Name" />
      <el-table-column
        prop="middleInitial"
        label="Middle Initial" />
      <el-table-column
        prop="birthDate"
        label="Birth Date"
        width="140">
        <template #default="scope">
          {{ new Date(scope.row.birthDate).toLocaleDateString() }}
        </template>
      </el-table-column>
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

    <el-button
      class="mt-4"
      style="width: 100%"
      @click="onAddItem"
    >
      Add Item
    </el-button>
</template>



<!---------- STYLES ---------->


<style scoped>
.el-col {
  border-radius: 4px;
}

.el-button {
  margin: 12px;
}

.table-container {
  font-size: x-large;
  color: white;
}

.table-scroll-wrapper {
  width: 100%;
  overflow-x: auto;
}

.student-table {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #ebeef5;
}
</style>


