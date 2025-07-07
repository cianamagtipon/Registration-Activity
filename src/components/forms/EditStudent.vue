/*BASIC DESCRIPTION: Form for editing student data. One of the children of
TheMasterlist.vue.*/

<!---------- SCRIPTS ---------->

<script setup lang="ts">
import { ref, reactive, computed, onBeforeUnmount, watch } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'

import { getAge } from '@/composables/getAge'
import { entryFormatter } from '@/composables/entryFormatter'
import { dateRestriction } from '@/composables/dateRestriction'
import { entryRestriction } from '@/composables/entryRestriction'

import type { Student } from '@/stores/student'
import type { Course } from '@/stores/student'

// Composables
const { toTitleCase, formatMiddleInitial } = entryFormatter()
const {
  onlyDigits,
  onlyLetters,
  onlyAlphaNumeric,
  onlyMiddleInitial,
  abbreviateStreet,
  isOnlySpaces,
  onlyOneSpace,
  preventPaste,
  isInvalidInput,
} = entryRestriction()

const { tooYoung, defaultDate } = dateRestriction()
const { calculateAge } = getAge()

// Modal visibility and form ref
const visible = ref(false)
const formRef = ref<FormInstance | null>(null)

// Computed age field
const age = computed(() =>
  form.birthday ? calculateAge(new Date(form.birthday)) : '',
)

const validateEntry = (
  _: any,
  value: string,
  callback: (error?: Error) => void,
) => {
  if (isOnlySpaces(value)) {
    callback(new Error('Input cannot be empty or just spaces.'))
  } else if (isInvalidInput(value)) {
    callback(new Error('Please enter valid characters.'))
  } else {
    callback()
  }
}

const validateZipCode = (
  rule: any,
  value: string,
  callback: (error?: string | Error) => void,
) => {
  if (!value) {
    callback() // allow empty string
  } else if (!/^[1-9][0-9]{3}$/.test(value)) {
    callback(
      new Error('Must be 4 digits, numerical, and does not start with 0.'),
    )
  } else {
    callback()
  }
}

// Add input event helpers
const inputEvents = (
  field: string,
  type: 'letters' | 'digits' | 'initial' = 'letters',
) => {
  const keypress = {
    letters: onlyLetters,
    digits: (e: KeyboardEvent) => onlyDigits(e, field),
    initial: onlyMiddleInitial,
  }[type]

  return {
    onKeypress: keypress,
    onKeydown: (e: KeyboardEvent) => onlyOneSpace(e, field),
    onPaste: preventPaste,
  }
}

// Reactive form state
interface EditStudentForm {
  id: string
  firstName: string
  middleInitial?: string
  lastName: string
  birthday: string
  course: Course
  address: {
    street: string
    city: string
    province: string
    zipCode: string
  }
}

const form = reactive<EditStudentForm>({
  id: '',
  firstName: '',
  middleInitial: '',
  lastName: '',
  birthday: '',
  course: '' as Course,
  address: {
    street: '',
    city: '',
    province: '',
    zipCode: '',
  },
})

// Form validation rules
const rules = {
  firstName: [
    { required: true, message: 'Required', trigger: 'blur' },
    { validator: validateEntry, trigger: 'blur' },
  ],
  lastName: [
    { required: true, message: 'Required', trigger: 'blur' },
    { validator: validateEntry, trigger: 'blur' },
  ],
  birthday: [{ required: true, message: 'Select a date', trigger: 'change' }],
  course: [{ required: true, message: 'Required', trigger: 'change' }],
  'address.city': [
    { required: true, message: 'Required', trigger: 'blur' },
    { validator: validateEntry, trigger: 'blur' },
  ],
  'address.province': [
    { required: true, message: 'Required', trigger: 'blur' },
    { validator: validateEntry, trigger: 'blur' },
  ],
  'address.zipCode': [{ validator: validateZipCode, trigger: 'blur' }],
}

// Drawer/dialog mode support
const props = defineProps<{
  mode?: 'drawer' | 'dialog'
}>()

const mode = computed(() => props.mode ?? 'drawer')

// Responsive drawer width
const drawerSize = ref(getDrawerSize())

function getDrawerSize() {
  return window.innerWidth <= 768 ? '100%' : '40%'
}

// Handle Enter key to submit
const handleKeyPress = (e: KeyboardEvent) => {
  const isTextarea = (e.target as HTMLElement)?.tagName === 'TEXTAREA'
  if (e.key === 'Enter' && !isTextarea && visible.value) {
    e.preventDefault()
    submitForm()
  }
}

// Watch drawer visibility and bind/unbind listener
watch(visible, (val) => {
  if (val) {
    window.addEventListener('keydown', handleKeyPress)
  } else {
    window.removeEventListener('keydown', handleKeyPress)
  }
})

// Cleanup on component unmount
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyPress)
})

// Emit updated student object to parent
const emit = defineEmits<{
  (e: 'student-updated', student: Student): void
}>()

// Populate form with selected student's data
const openForm = (student: Student) => {
  form.id = student.id
  form.firstName = toTitleCase(student.firstName)
  form.middleInitial = student.middleInitial
    ? formatMiddleInitial(student.middleInitial)
    : ''
  form.lastName = toTitleCase(student.lastName)
  form.birthday = student.birthDate.toISOString().split('T')[0]
  form.course = student.course
  form.address.street = toTitleCase(abbreviateStreet(student.address.street))
  form.address.city = toTitleCase(student.address.city)
  form.address.province = toTitleCase(student.address.province)
  form.address.zipCode = String(student.address.zipCode)

  visible.value = true
}

// Reset form and close modal
const closeForm = () => {
  formRef.value?.resetFields()
  visible.value = false
}

// Validate and submit edited student data
const submitForm = async () => {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()
    if (valid) {
      const updatedStudent: Student = {
        id: form.id,
        firstName: toTitleCase(form.firstName),
        middleInitial: form.middleInitial
          ? formatMiddleInitial(form.middleInitial)
          : '',
        lastName: toTitleCase(form.lastName),
        birthDate: new Date(form.birthday),
        age: 0,
        course: form.course,
        address: {
          street: toTitleCase(form.address.street),
          city: toTitleCase(form.address.city),
          province: toTitleCase(form.address.province),
          zipCode: Number(form.address.zipCode),
        },
      }

      emit('student-updated', updatedStudent)
      ElMessage.closeAll()
      closeForm()
      ElMessage.success('Student updated!')
    }
  } catch (error) {
    ElMessage.closeAll()
    ElMessage.error('Validation failed.')
  }
}

// Expose openForm to parent
defineExpose({ openForm })
</script>

<!---------- TEMPLATES ---------->

<template>
  <component
    :is="mode === 'drawer' ? 'el-drawer' : 'el-dialog'"
    v-model="visible"
    title="Update Student Information"
    :size="mode === 'drawer' ? drawerSize : undefined"
    :width="mode === 'dialog' ? '600px' : undefined"
    :with-header="true"
    :custom-class="mode === 'drawer' ? 'student-drawer' : 'student-dialog'"
    :destroy-on-close="true"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
      <!-- Basic Info -->
      <el-form-item label="First Name" prop="firstName">
        <el-input
          v-model="form.firstName"
          maxlength="40"
          @keypress="onlyLetters"
          @keydown="(e) => onlyOneSpace(e, form.firstName)"
          @paste="preventPaste"
          @blur="form.firstName = toTitleCase(form.firstName)"
        />
      </el-form-item>

      <el-form-item label="Middle Initial" prop="middleInitial">
        <el-input
          v-model="form.middleInitial"
          maxlength="1"
          @keypress="onlyMiddleInitial"
          @keydown="(e) => onlyOneSpace(e, form.middleInitial)"
          @paste="preventPaste"
          @blur="form.middleInitial = formatMiddleInitial(form.middleInitial)"
        />
      </el-form-item>

      <el-form-item label="Last Name" prop="lastName">
        <el-input
          v-model="form.lastName"
          maxlength="30"
          @keypress="onlyLetters"
          @keydown="(e) => onlyOneSpace(e, form.lastName)"
          @paste="preventPaste"
          @blur="form.lastName = toTitleCase(form.lastName)"
        />
      </el-form-item>

      <!-- Birthday and Age -->
      <el-form-item label="Birthday" prop="birthday">
        <el-date-picker
          v-model="form.birthday"
          type="date"
          placeholder="YYYY-MM-DD"
          :disabled-date="tooYoung"
          :default-value="defaultDate"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="Age">
        <el-input :value="age" readonly />
      </el-form-item>

      <!-- Course Selection -->
      <el-form-item label="Course" prop="course">
        <el-select v-model="form.course" placeholder="Select a course">
          <el-option
            label="Bachelor of Science in Computer Science"
            value="BSCS"
          />
          <el-option
            label="Bachelor of Science in Information Technology"
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

      <!-- Address -->
      <el-form-item label="Street" prop="address.street">
        <el-input
          v-model="form.address.street"
          maxlength="50"
          @keypress="onlyAlphaNumeric"
          @keydown="(e) => onlyOneSpace(e, form.address.street)"
          @paste="preventPaste"
          @blur="
            form.address.street = toTitleCase(
              abbreviateStreet(form.address.street),
            )
          "
        />
      </el-form-item>

      <el-form-item label="City" prop="address.city">
        <el-input
          v-model="form.address.city"
          maxlength="50"
          @keypress="onlyLetters"
          @keydown="(e) => onlyOneSpace(e, form.address.city)"
          @paste="preventPaste"
          @blur="form.address.city = toTitleCase(form.address.city)"
        />
      </el-form-item>

      <el-form-item label="Province" prop="address.province">
        <el-input
          v-model="form.address.province"
          maxlength="50"
          @keypress="onlyLetters"
          @keydown="(e) => onlyOneSpace(e, form.address.province)"
          @paste="preventPaste"
          @blur="form.address.province = toTitleCase(form.address.province)"
        />
      </el-form-item>

      <el-form-item label="Zip Code" prop="address.zipCode">
        <el-input
          v-model="form.address.zipCode"
          type="text"
          inputmode="numeric"
          maxlength="4"
          pattern="[0-9]*"
          @keypress="(e) => onlyDigits(e, form.address.zipCode)"
          @keydown="(e) => onlyOneSpace(e, form.address.zipCode)"
          @paste="preventPaste"
        />
      </el-form-item>

      <!-- Action Buttons -->
      <el-form-item>
        <el-button type="primary" @click="submitForm">Update</el-button>
        <el-button @click="closeForm">Cancel</el-button>
      </el-form-item>
    </el-form>
  </component>
</template>

<!---------- STYLES ---------->

<style scoped>
.student-drawer,
.student-dialog {
  padding: 20px;
}

@media (max-width: 768px) {
  .student-drawer {
    padding: 20px;
    width: 100%;
  }
}
</style>
