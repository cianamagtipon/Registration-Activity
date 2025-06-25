/*BASIC DESCRIPTION: These are the main components of the dashboard.*/

<!---------- SCRIPTS ---------->

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

import {
  Calendar,
  Location,
  Notebook,
  Tickets,
  User,
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
</script>

<!---------- TEMPLATES ---------->

<template>
  <div class="dashboard-container">
    <el-descriptions
      class="margin-top"
      title="Student Dashboard"
      :column="3"
      border
    >
      <template #extra>
        <el-button type="default">Update Student Information</el-button>
      </template>
    </el-descriptions>

    <div class="descriptions-container">
      <el-descriptions :column="3" border>
        <el-descriptions-item :span="3">
          <template #label>
            <el-icon><User /></el-icon>
            Student
          </template>
          LastName, FirstName, MiddleInitial
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <el-icon><Calendar /></el-icon>
            Birthday
          </template>
          0000-00-00
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <el-icon><Notebook /></el-icon>
            Age
          </template>
          00
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <el-icon><Tickets /></el-icon>
            Course
          </template>
          <el-tag size="small">BSCS</el-tag>
        </el-descriptions-item>

        <el-descriptions-item :span="3">
          <template #label>
            <el-icon><Location /></el-icon>
            Address
          </template>
          No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<!---------- STYLES ---------->

<style scoped>
.dashboard-container {
  width: 80vw;
  margin: 0 auto;
}

.descriptions-container {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #ebeef5;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
}

::v-deep(.el-descriptions__body) {
  background-color: #fff;
}
</style>
