/*BASIC DESCRIPTION: Form for adding student. One of the children of
TheMasterlist.vue.*/

<!---------- SCRIPTS ---------->

<script lang="ts" setup>
import { ref, reactive, computed, onBeforeUnmount, watch } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'

import { dateRestriction } from '@/composables/dateRestriction'
import { entryRestriction } from '@/composables/entryRestriction'
import { entryFormatter } from '@/composables/entryFormatter'
import { getAge } from '@/composables/getAge'

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

// Props and mode setup (defaults to drawer)
const props = defineProps<{
  mode?: 'drawer' | 'dialog'
  existingStudents: Array<{
    firstName: string
    middleInitial?: string
    lastName: string
    birthday: string
  }>
}>()

const mode = computed(() => props.mode ?? 'drawer')

const isDuplicateEntry = () => {
  const normalize = (val: string) => toTitleCase(val.trim())
  const normalizeInitial = (val: string) => formatMiddleInitial(val.trim())

  const newFirst = normalize(form.firstName)
  const newMiddle = normalizeInitial(form.middleInitial || '')
  const newLast = normalize(form.lastName)
  const newBday = new Date(form.birthday).toISOString().split('T')[0] // "YYYY-MM-DD"

  return props.existingStudents.some((student) => {
    const studentFirst = normalize(student.firstName)
    const studentMiddle = normalizeInitial(student.middleInitial || '')
    const studentLast = normalize(student.lastName)
    const studentBday = new Date(student.birthday).toISOString().split('T')[0]

    return (
      studentFirst === newFirst &&
      studentMiddle === newMiddle &&
      studentLast === newLast &&
      studentBday === newBday
    )
  })
}

// Visibility state and form reference
const visible = ref(false)
const formRef = ref<FormInstance | null>(null)

// Emit event when a student is added
const emit = defineEmits<{
  (e: 'student-added', form: StudentForm): void
}>()

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

const validateStreet = (
  _: any,
  value: string,
  callback: (error?: Error) => void,
) => {
  const trimmed = value.trim()

  if (!trimmed) {
    callback()
  } else if (/^\d+$/.test(trimmed)) {
    callback(new Error('Input cannot be only numbers.'))
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

// Form structure and validation types
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

// Reactive form model
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

// Form validation rules
const rules = {
  firstName: [
    { required: true, message: 'Required', trigger: 'blur' },
    { validator: validateEntry, trigger: 'blur' },
  ],
  middleInitial: [{ validator: validateEntry, trigger: 'blur' }],
  lastName: [
    { required: true, message: 'Required', trigger: 'blur' },
    { validator: validateEntry, trigger: 'blur' },
  ],
  birthday: [{ required: true, message: 'Select a date', trigger: 'change' }],
  course: [{ required: true, message: 'Required', trigger: 'change' }],
  'address.street': [
    { validator: validateEntry, trigger: 'blur' },
    { validator: validateStreet, trigger: 'blur' },
  ],
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

// Open and close form
const openForm = () => {
  visible.value = true
}

const closeForm = () => {
  visible.value = false
  resetForm()
}

// Reset form fields
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

// Submit and emit form data after validation
const submitForm = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    if (isDuplicateEntry()) {
      ElMessage.closeAll()
      ElMessage.error('Duplicate entry: This student already exists.')
      return
    }

    emit('student-added', {
      firstName: toTitleCase(form.firstName),
      middleInitial: form.middleInitial
        ? formatMiddleInitial(form.middleInitial)
        : '',
      lastName: toTitleCase(form.lastName),
      birthday: form.birthday,
      course: form.course,
      address: {
        street: toTitleCase(abbreviateStreet(form.address.street)),
        city: toTitleCase(form.address.city),
        province: toTitleCase(form.address.province),
        zipCode: form.address.zipCode,
      },
    })

    closeForm()
  } catch (error) {
    ElMessage.closeAll()
    ElMessage.error('Please fill all required fields')
  }
}

// Make openForm available to parent via ref
defineExpose({ openForm })

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
</script>

<!---------- TEMPLATES ---------->

<template>
  <component
    :is="mode === 'drawer' ? 'el-drawer' : 'el-dialog'"
    v-model="visible"
    title="Add New Student"
    :size="mode === 'drawer' ? drawerSize : undefined"
    :width="mode === 'dialog' ? '600px' : undefined"
    :with-header="true"
    :custom-class="mode === 'drawer' ? 'student-drawer' : 'student-dialog'"
    :destroy-on-close="true"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-width="120px"
      style="display: flex; flex-direction: column; gap: 10px"
    >
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
          :editable="false"
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
      <el-form-item label="Unit/Street" prop="address.street">
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
        <el-button type="primary" @click="submitForm">Add Student</el-button>
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
</style>
