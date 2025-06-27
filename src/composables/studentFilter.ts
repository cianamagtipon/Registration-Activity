import { ref, computed, Ref } from 'vue'
import type { Student } from '@/stores/student'

// Filter mode
type FilterMode = 'simple' | 'advanced'

/**
 * Composable to handle searching, filtering, and pagination of a student list.
 *
 * @param students - A reactive Ref containing the full student list
 * @param mode - Optional filter mode; allows full-text address search in 'advanced'
 */

export function studentFilter(
  students: Ref<Student[]>,
  mode: FilterMode = 'simple',
) {
  const search = ref('')
  const courseFilter = ref('')

  // Max students visible (infinite scroll)
  const count = ref<number | null>(10)

  const visibleStudents = computed(() => {
    const searchTerm = search.value.trim().toLowerCase()
    const course = courseFilter.value.trim()

    // Filter by name and address (if advanced)
    let results = students.value.filter((student) => {
      const fullName =
        `${student.firstName} ${student.middleInitial ?? ''} ${student.lastName}`.toLowerCase()

      const matchesSearch =
        !searchTerm || // If search is empty, match all
        fullName.includes(searchTerm) || // Match by name
        (mode === 'advanced' &&
          student.address &&
          `${student.address.street} ${student.address.city} ${student.address.province}`
            .toLowerCase()
            .includes(searchTerm))

      const matchesCourse = !course || student.course === course

      return matchesSearch && matchesCourse
    })

    // Limit number of students if count is set
    if (count.value !== null) {
      results = results.slice(0, count.value)
    }

    return results
  })

  // Load more students (also for infinite scroll)
  const load = () => {
    if (count.value !== null && count.value < students.value.length) {
      count.value += 10
    }
  }

  return {
    search,
    courseFilter,
    count,
    visibleStudents,
    load,
  }
}
