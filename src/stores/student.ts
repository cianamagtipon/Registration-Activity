import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { masterlist } from '@/assets/data/masterlist'

export interface Address {
  street: string
  city: string
  province: string
  zipCode: number
}

export type Course = 'BSCS' | 'BSIT' | 'BST' | 'BSHRM' | 'BSN'

export interface Student {
  firstName: string
  middleInitial?: string
  lastName: string
  birthDate: Date
  age: number
  address: Address
  course: Course
}

function calculateAge(birthDate: Date): number {
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

export const useStudentStore = defineStore('student', () => {
  // compute age when initializing.
  const students = ref<Student[]>(
    masterlist.map((student) => ({
      ...student,
      age: calculateAge(student.birthDate),
    }))
  )

  // compute age when adding student (if form only gives birthDate)
  const addStudent = (student: Omit<Student, 'age'>) => {
    students.value.push({
      ...student,
      age: calculateAge(student.birthDate),
    })
  }

  // compute age when resetting
  const resetStudents = () => {
    students.value = masterlist.map((student) => ({
      ...student,
      age: calculateAge(student.birthDate),
    }))
  }

  return {
    students,
    addStudent,
    resetStudents,
  }
})
