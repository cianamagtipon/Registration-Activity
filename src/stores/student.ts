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
  id: string
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
  const generateId = () => Math.random().toString(36).substring(2, 9)

  const students = ref<Student[]>(
    masterlist.map((student) => ({
      ...student,
      id: generateId(),
      age: calculateAge(student.birthDate),
    }))
  )

  const addStudent = (student: Omit<Student, 'id' | 'age'>) => {
    students.value.push({
      ...student,
      id: generateId(),
      age: calculateAge(student.birthDate),
    })
  }

  const removeStudent = (id: string) => {
    students.value = students.value.filter((student) => student.id !== id)
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
    resetStudents,
  }
})

