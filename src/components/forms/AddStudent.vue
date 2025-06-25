/*BASIC DESCRIPTION: Form for adding student. One of the children of
TheMasterlist.vue.*/

<!---------- SCRIPTS ---------->

<script lang="ts" setup>
import { ref, reactive, defineExpose, computed } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { dateRestriction } from '@/composables/dateRestriction'
import { getAge } from '@/composables/getAge'

const { disableTooYoung } = dateRestriction()
const { calculateAge } = getAge()

const visible = ref(false)
const formRef = ref<FormInstance | null>(null)

const emit = defineEmits<{
  (e: 'student-added', form: StudentForm): void
}>()

const age = computed(() =>
  form.birthday ? calculateAge(new Date(form.birthday)) : '',
)

interface StudentForm {
  firstName: string
  middleInitial?: string
  lastName: string
  birthday: string
  course: string
  address: {
    street: string
    city: string
    province: string
    zipCode: string
  }
}

const form = reactive<StudentForm>({
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
  'address.province': [
    { required: true, message: 'Required', trigger: 'blur' },
  ],
  'address.zipCode': [
    { required: true, message: 'Required', trigger: 'blur' },
    { type: 'number', message: 'Must be numeric', trigger: 'blur' },
  ],
}

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
    zipCode: null,
  }
}

const submitForm = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    emit('student-added', { ...form })
    closeDrawer()
  } catch (error) {
    ElMessage.error('Please fill all required fields')
  }
}

defineExpose({ openDrawer })
</script>

<!---------- TEMPLATES ---------->

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
          :disabled-date="disableTooYoung"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="Age">
        <el-input :value="age" disabled />
      </el-form-item>

      <el-form-item label="Course" prop="course">
        <el-select v-model="form.course" placeholder="Select a course">
          <el-option
            label=" Bachelor of Science in Computer Science"
            value="BSCS"
          />
          <el-option
            label="Bachelor of Science in Information and Technology"
            value="BSIT"
          />
          <el-option label="Bachelor of Science in Tourism" value="BST" />
          <el-option
            label="Bachelor of Science in Hotel and Restaurant Management"
            value="BSHRM"
          />
          <el-option label="Bachelor of Science in Nursing" value="BSN" />
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
        <el-input v-model.number="form.address.zipCode" type="number" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">Add Student</el-button>
        <el-button @click="closeDrawer">Cancel</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<!---------- STYLES ---------->

<style scoped>
.student-drawer {
  padding: 20px;
}
</style>
