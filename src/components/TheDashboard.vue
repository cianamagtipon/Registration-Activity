/*BASIC DESCRIPTION: These are the main components of the dashboard.*/

<!---------- SCRIPTS ---------->

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

import { Calendar, Location, Notebook, Tickets, User } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
</script>

<!---------- TEMPLATES ---------->

<template>
  <div class="description-container">
    <el-descriptions class="header" title="Student Dashboard" :column="3" border>
      <template #extra>
        <el-button type="default">Update Student Information</el-button>
      </template>

      <el-descriptions-item :span="3">
        <template #label>
          <div class="name">
            <el-icon>
              <user />
            </el-icon>
            Student
          </div>
        </template>
        LastName, FirstName, MiddleInitial
      </el-descriptions-item>

      <el-descriptions-item :span="1">
        <template #label>
          <div class="birthday">
            <el-icon>
              <calendar />
            </el-icon>
            Birthday
          </div>
        </template>
        0000-00-00
      </el-descriptions-item>

      <el-descriptions-item :span="1">
        <template #label>
          <div class="age">
            <el-icon>
              <Notebook />
            </el-icon>
            Age
          </div>
        </template>
        00
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label>
          <div class="course">
            <el-icon>
              <tickets />
            </el-icon>
            Course
          </div>
        </template>
        <el-tag size="small"> BSCS </el-tag>
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label>
          <div class="address">
            <el-icon>
              <location />
            </el-icon>
            Address
          </div>
        </template>
        No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<!---------- STYLES ---------->

<style scoped>
.description-container {
  width: 80vw;
}

.el-descriptions {
  width: 100%;
  margin-top: 20px;
}

.el-icon {
  padding: 6px;
}
</style>
