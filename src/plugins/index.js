/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '@/stores'
import router from '@/router'
import i18n from '@/i18n'
import VuetifyUseDialog from 'vuetify-use-dialog'

// 檔案上傳套件fileAgent
import VueFileAgentNext from '@boindil/vue-file-agent-next'
import '@boindil/vue-file-agent-next/dist/vue-file-agent-next.css'

export function registerPlugins(app) {
    app.use(vuetify)
        .use(router)
        .use(pinia)
        .use(i18n)
        .use(VuetifyUseDialog, {
            snackbar: {
                showCloseButton: false,
                snackbarPoprs: {
                    timeout: 2000,
                },
            },
        })
        .use(VueFileAgentNext)
}
