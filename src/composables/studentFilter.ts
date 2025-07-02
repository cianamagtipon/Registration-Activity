import { ref, computed, Ref } from 'vue'
import type { Student } from '@/stores/student'
import { entryRestriction } from '@/composables/entryRestriction'

const { normalizeSpaces, removeSymbols } = entryRestriction()

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
    const searchTerm = normalizeSpaces(search.value.trim().toLowerCase())
    const course = courseFilter.value.trim()

    // Filter by name and address (if advanced)
    let results = students.value.filter((student) => {
      const fullName = {
        standard:
          `${student.firstName} ${student.middleInitial ?? ''} ${student.lastName}`.toLowerCase(),
        standardRaw: removeSymbols(
          `${student.firstName} ${student.middleInitial ?? ''} ${student.lastName}`,
        ).toLowerCase(),
        lastNameFirst:
          `${student.lastName} ${student.firstName} ${student.middleInitial ?? ''}`.toLowerCase(),
      }

      const fullAddress = {
        formatted: normalizeSpaces(
          `${student.address.street} ${student.address.city} ${student.address.province} ${student.address.zipCode}`.toLowerCase(),
        ),
        stripped: normalizeSpaces(
          removeSymbols(
            `${student.address.street} ${student.address.city} ${student.address.province} ${student.address.zipCode}`,
          ).toLowerCase(),
        ),
        formattedWithComma: normalizeSpaces(
          `${student.address.street}, ${student.address.city}, ${student.address.province}, ${student.address.zipCode}`.toLowerCase(),
        ),
        strippedWithComma: normalizeSpaces(
          removeSymbols(
            `${student.address.street}, ${student.address.city}, ${student.address.province}, ${student.address.zipCode}`,
          ).toLowerCase(),
        ),
      }

      const matchesSearch =
        !searchTerm ||
        Object.values(fullName).some((name) =>
          normalizeSpaces(name).includes(searchTerm),
        ) ||
        (mode === 'advanced' &&
          Object.values(fullAddress).some((addr) => addr.includes(searchTerm)))

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
