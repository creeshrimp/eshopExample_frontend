import axios from 'axios'
import { useUserStore } from '@/stores/user'

const api = axios.create({
    baseURL: import.meta.env.VITE_API,
})

const apiAuth = axios.create({
    baseURL: import.meta.env.VITE_API,
})

/**
 *  axios 攔截器
 *  1. axios.get() / post()
 *  2. interceptors.request(請求設定 => {})
 *  3. 送出
 *  4. interceptors.response(成功處理, 失敗處理)
 *  5. .then().catch()
 */

apiAuth.interceptors.request.use((config) => {
    const user = useUserStore()
    config.headers.Authorization = 'Bearer ' + user.token
    return config
})

apiAuth.interceptors.response.use(
    (res) => res,
    async (error) => {
        // 判斷失敗有沒有收到回應
        // 沒收到回應可能是網路問題
        // 有收到才需要處理
        if (error.response) {
            // 是登入過期，且請求不是舊換新
            if (error.response.data.message === 'userTokenExpired' && error.config.url !== '/user/refresh') {
                const user = useUserStore()
                try {
                    // 傳送舊換新請求
                    const { data } = await apiAuth.patch('/user/refresh')

                    // 更新 store 的 token
                    user.token = data.result

                    // 修改發生錯誤的請求設定，換成新的 token
                    error.config.headers.Authorization = 'Bearer ' + user.token

                    // 用新的設定重發一次原本要做的請求
                    return axios(error.config)
                } catch (error) {
                    console.log(error)
                    // 舊換新錯誤，登出
                    user.logout()
                }
            }
        }
        // 回傳原本的錯誤
        return Promise.reject(error)
    },
)

export const useAxios = () => {
    return { api, apiAuth }
}
