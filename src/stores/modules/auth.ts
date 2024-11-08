// src/stores/auth.ts
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isRegister: false,
    isEmailLogin: false,
    isForgotPassword: false,
    activeKey: '1'
  }),
  actions: {
    toggleMode() {
      if (this.isEmailLogin) {
        this.isEmailLogin = !this.isEmailLogin
      } else {
        this.isForgotPassword = !this.isForgotPassword
      }
    },
    toggleEmailLoginMode() {
      this.isEmailLogin = !this.isEmailLogin
    },
    toggleRegisterMode() {
      const keyMap = {
        1: '3',
        2: '4',
        3: '1',
        4: '2'
      }
      this.isRegister = !this.isRegister
      this.isEmailLogin = false
      this.activeKey = keyMap[this.activeKey]
    },
    onTabChange(key) {
      this.activeKey = key
    }
  }
})
