// Utilities
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import UserRole from '@/enums/UserRole'

export const useUserStore = defineStore(
    'user',
    () => {
        const token = ref('')
        const account = ref('')
        const role = ref(UserRole.USER)
        const cart = ref(0)

        // 用有沒有token來判斷是否登入
        const isLoggedIn = computed(() => {
            return token.value.length > 0
        })

        // 是不是管理員
        const isAdmin = computed(() => {
            return role.value === UserRole.ADMIN
        })

        // 大頭貼 (利用API根據帳號名產生固定的大頭貼)
        const avatar = computed(() => {
            return `https://api.multiavatar.com/${account.value}.png`
        })

        /**
         *  登入
         *  @param {Object} data 登入資料(from backend response)
         */
        const login = (data) => {
            if (data.token) {
                token.value = data.token
            }
            account.value = data.account
            role.value = data.role
            cart.value = data.cart
        }

        /**
         *  登出
         */

        const logout = () => {
            token.value = ''
            account.value = ''
            role.value = UserRole.USER
            cart.value = 0
        }

        return { token, account, role, cart, isLoggedIn, isAdmin, avatar, login, logout }
    },
    {
        persist: {
            key: 'shop-user',
            pick: ['token'],
        },
    },
)
