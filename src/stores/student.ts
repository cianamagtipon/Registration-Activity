import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { masterlist } from '@/assets/data/masterlist'
import { getAge } from '@/composables/getAge'

const { calculateAge } = getAge()

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
      students.value = masterlist.map((student) => ({
        ...student,
        id: generateId(),
        age: calculateAge(student.birthDate),
      }))
    }

    initialized = true
  }

  const addStudent = (student: StudentRaw) => {
    students.value.push({
      ...student,
      id: generateId(),
      age: calculateAge(student.birthDate),
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
      students.value[index] = {
        ...updated,
        age: calculateAge(updated.birthDate),
      }
    }
  }

  const resetStudents = () => {
    students.value = masterlist.map((student) => ({
      ...student,
      id: generateId(),
      age: calculateAge(student.birthDate),
    }))
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
