import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { masterlist } from '@/assets/data/masterlist'
import { getAge } from '@/composables/getAge'
import { nameFormatter } from '@/composables/nameFormatter'

const { calculateAge } = getAge()
const { toTitleCase, formatMiddleInitial } = nameFormatter()

export interface Address {
  street: string
  city: string
  province: string
  zipCode: number
}

export type Course = 'BSCS' | 'BSIT' | 'BST' | 'BSHRM' | 'BSN'

export interface Student {
  id: string
  firstName: string
  middleInitial?: string
  lastName: string
  birthDate: Date
  age: number
  address: Address
  course: Course
}

export type StudentRaw = Omit<Student, 'id' | 'age'>

function formatStudent(
  raw: Omit<Student, 'id' | 'age'>,
): Omit<Student, 'id' | 'age'> {
  return {
    ...raw,
    firstName: toTitleCase(raw.firstName),
    middleInitial: raw.middleInitial
      ? formatMiddleInitial(raw.middleInitial)
      : '',
    lastName: toTitleCase(raw.lastName),
    course: raw.course,
    birthDate: raw.birthDate,
    address: {
      street: toTitleCase(raw.address.street),
      city: toTitleCase(raw.address.city),
      province: toTitleCase(raw.address.province),
      zipCode: Number(raw.address.zipCode),
    },
  }
}

export const useStudentStore = defineStore('student', () => {
  const generateId = () => crypto.randomUUID()

  const students = ref<Student[]>([])
  let initialized = false

  const fetchStudents = () => {
    if (initialized) return

    const stored = localStorage.getItem('students')

    if (stored) {
      students.value = JSON.parse(stored).map((original: Student) => ({
        ...original,
        birthDate: new Date(original.birthDate),
      }))
    } else {
      students.value = masterlist.map((student) => {
        const formatted = formatStudent({
          firstName: student.firstName,
          middleInitial: student.middleInitial,
          lastName: student.lastName,
          birthDate: student.birthDate,
          course: student.course,
          address: student.address,
        })
        return {
          ...formatted,
          id: generateId(),
          age: calculateAge(formatted.birthDate),
        }
      })
    }

    initialized = true
  }

  const addStudent = (student: StudentRaw) => {
    const formatted = formatStudent(student)
    students.value.push({
      ...formatted,
      id: generateId(),
      age: calculateAge(formatted.birthDate),
    })
  }

  const removeStudent = (id: string) => {
    students.value = students.value.filter((student) => student.id !== id)
  }

  const updateStudent = (updated: Student) => {
    const index = students.value.findIndex(
      (original) => original.id === updated.id,
    )
    if (index !== -1) {
      const formatted = formatStudent(updated)
      students.value[index] = {
        ...updated,
        ...formatted,
        age: calculateAge(updated.birthDate),
      }
    }
  }

  const resetStudents = () => {
    students.value = masterlist.map((student) => {
      const formatted = formatStudent({
        firstName: student.firstName,
        middleInitial: student.middleInitial,
        lastName: student.lastName,
        birthDate: student.birthDate,
        course: student.course,
        address: student.address,
      })
      return {
        ...formatted,
        id: generateId(),
        age: calculateAge(formatted.birthDate),
      }
    })
  }

  const clearStorage = () => {
    localStorage.removeItem('students')
  }

  watch(
    students,
    (newStudents) => {
      localStorage.setItem('students', JSON.stringify(newStudents))
    },
    { deep: true },
  )

  return {
    students,
    addStudent,
    removeStudent,
    updateStudent,
    fetchStudents,
    resetStudents,
    clearStorage,
  }
})
