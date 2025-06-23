<template>
  <el-drawer
    v-model="visible"
    title="Add New Student"
    size="30%"
    :with-header="true"
    custom-class="student-drawer"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="First Name" prop="firstName">
        <el-input v-model="form.firstName" />
      </el-form-item>

      <el-form-item label="Middle Initial" prop="middleInitial">
        <el-input v-model="form.middleInitial" />
      </el-form-item>

      <el-form-item label="Last Name" prop="lastName">
        <el-input v-model="form.lastName" />
      </el-form-item>

      <el-form-item label="Birthday" prop="birthday">
        <el-date-picker
          v-model="form.birthday"
          type="date"
          placeholder="Pick a date"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="Course" prop="course">
        <el-select v-model="form.course" placeholder="Select a course">
          <el-option label="BSCS" value="BSCS" />
          <el-option label="BSIT" value="BSIT" />
          <el-option label="BST" value="BST" />
          <el-option label="BSHRM" value="BSHRM" />
          <el-option label="BSN" value="BSN" />
        </el-select>
      </el-form-item>

      <el-form-item label="Street" prop="address.street">
        <el-input v-model="form.address.street" />
      </el-form-item>

      <el-form-item label="City" prop="address.city">
        <el-input v-model="form.address.city" />
      </el-form-item>

      <el-form-item label="Province" prop="address.province">
        <el-input v-model="form.address.province" />
      </el-form-item>

      <el-form-item label="Zip Code" prop="address.zipCode">
        <el-input v-model="form.address.zipCode" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">Add Student</el-button>
        <el-button @click="closeDrawer">Cancel</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, defineExpose } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { useStudentStore } from '@/stores/student'

const visible = ref(false)
const formRef = ref<FormInstance | null>(null)

const form = reactive({
  firstName: '',
  middleInitial: '',
  lastName: '',
  birthday: '',
  course: '',
  address: {
    street: '',
    city: '',
    province: '',
    zipCode: '',
  },
})

const rules = {
  firstName: [{ required: true, message: 'Required', trigger: 'blur' }],
  lastName: [{ required: true, message: 'Required', trigger: 'blur' }],
  birthday: [{ required: true, message: 'Select a date', trigger: 'change' }],
  course: [{ required: true, message: 'Required', trigger: 'change' }],
  'address.street': [{ required: true, message: 'Required', trigger: 'blur' }],
  'address.city': [{ required: true, message: 'Required', trigger: 'blur' }],
  'address.province': [{ required: true, message: 'Required', trigger: 'blur' }],
  'address.zipCode': [
    { required: true, message: 'Required', trigger: 'blur' },
    {
      validator: (_, value) => /^\d+$/.test(value),
      message: 'Zip code must be numeric',
      trigger: 'blur',
    },
  ],
}

const studentStore = useStudentStore()

const openDrawer = () => {
  visible.value = true
}

const closeDrawer = () => {
  visible.value = false
  resetForm()
}

const resetForm = () => {
  form.firstName = ''
  form.middleInitial = ''
  form.lastName = ''
  form.birthday = ''
  form.course = ''
  form.address = {
    street: '',
    city: '',
    province: '',
    zipCode: '',
  }
}

const submitForm = async () => {
  if (!formRef.value) return

  const valid = await formRef.value.validate()

  if (valid) {
    studentStore.addStudent({
      firstName: form.firstName,
      middleInitial: form.middleInitial,
      lastName: form.lastName,
      birthDate: new Date(form.birthday),
      course: form.course as any,
      address: {
        street: form.address.street,
        city: form.address.city,
        province: form.address.province,
        zipCode: Number(form.address.zipCode),
      },
    })
    ElMessage.success('Student added successfully!')
    closeDrawer()
  } else {
    ElMessage.error('Please fill all required fields.')
  }
}

defineExpose({ openDrawer })
</script>

<style scoped>
.student-drawer {
  padding: 20px;
}
</style>
