import { defineStore } from 'pinia'
import { ref } from 'vue'
import { masterlist } from '@/assets/data/masterlist'
import { useAge } from '@/composables/useAge'

const { calculateAge } = useAge()

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
  const generateId = () => Math.random().toString(36).substring(2, 9)

  const students = ref<Student[]>([])
  let initialized = false

  const fetchStudents = () => {
    if (initialized) return
    students.value = masterlist.map((student) => ({
      ...student,
      id: generateId(),
      age: calculateAge(student.birthDate),
    }))
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
    const index = students.value.findIndex(s => s.id === updated.id)
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

  return {
    students,
    addStudent,
    removeStudent,
    updateStudent,
    fetchStudents,
    resetStudents,
  }
})
