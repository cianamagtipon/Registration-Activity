import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { masterlist } from '@/assets/data/masterlist'

import { getAge } from '@/composables/getAge'
import { entryFormatter } from '@/composables/entryFormatter'

const { calculateAge } = getAge()
const { toTitleCase, formatMiddleInitial } = entryFormatter()

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

// Raw form data before ID and age are computed
export type StudentRaw = Omit<Student, 'id' | 'age'>

// Ensure input strings are consistently formatted before storing
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

/*---------- MAIN STORE ----------*/

export const useStudentStore = defineStore('student', () => {
  const generateId = () => crypto.randomUUID()

  // reactive list of students
  const students = ref<Student[]>([])

  // Prevent refetching from localStorage more than once
  let initialized = false

  // Load students either from localStorage or fallback to predefined masterlist
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

  // Reset the list to the original masterlist
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

  // Persist all changes to localStorage automatically
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
  }
})
