import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const username = ref<string>('')
    const isLoggedIn = ref<boolean>(false)
    const forgetClickCount = ref<number>(0)
    const fullscreenLoading = ref(false)

    // Returns a reactive summary of user info
    const userInfo = computed(() => ({
      username: username.value,
      isLoggedIn: isLoggedIn.value,
    }))

    const login = (inputUsername: string, inputPassword: string): boolean => {
      if (inputUsername === 'admin' && inputPassword === '1234') {
        username.value = inputUsername
        isLoggedIn.value = true
        return true
      }
      return false
    }

    const logout = () => {
      username.value = ''
      isLoggedIn.value = false
    }

    const handleForgetPassword = ():
      | 'empty'
      | 'notFound'
      | 'requested'
      | 'alreadyRequested' => {
      if (!username.value) return 'empty'
      if (username.value !== 'admin') return 'notFound'

      forgetClickCount.value++
      return forgetClickCount.value === 1 ? 'requested' : 'alreadyRequested'
    }

    const setUsername = (name: string) => {
      username.value = name
    }

    const resetForgetClickCount = () => {
      forgetClickCount.value = 0
    }

    return {
      username,
      isLoggedIn,
      forgetClickCount,
      userInfo,
      login,
      logout,
      handleForgetPassword,
      setUsername,
      resetForgetClickCount,
      fullscreenLoading,
    }
  },

  {
    persist: {
      key: 'my-app-user', // local/session storage key
      storage: sessionStorage, // uses session storage
    },
  },
)
