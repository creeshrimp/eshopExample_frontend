<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1 class="text-center">{{ $t('nav.login') }}</h1>
            </v-col>
            <v-divider></v-divider>
            <v-col cols="12">
                <v-form :disabled="isSubmitting" @submit.prevent="submit">
                    <v-text-field v-model="account.value.value" :error-messages="account.errorMessage.value"
                        :label="$t('user.account')" minlength="4" maxlength="20" counter />
                    <v-text-field v-model="password.value.value" type="password"
                        :error-messages="password.errorMessage.value" :label="$t('user.password')" minlength="4"
                        maxlength="20" counter />
                    <div class="text-center">
                        <v-btn :loading="isSubmitting" type="submit" color="primary">{{ $t('login.submit') }}</v-btn>
                    </div>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import validator from 'validator'
import { useI18n } from 'vue-i18n'
import { useAxios } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const { t } = useI18n()
const { api } = useAxios()
const createSnackbar = useSnackbar()
const router = useRouter()
const user = useUserStore()

const schema = yup.object({
    account: yup
        .string()
        .required(t('api.userAccountRequired'))
        .min(4, t('api.userAccountTooShort'))
        .max(20, t('api.userAccountTooLong'))
        .test('isAlphanumeric', t('api.userAccountInvalid'), (value) =>
            validator.isAlphanumeric(value),
        ),
    password: yup
        .string()
        .required(t('api.userPasswordRequired'))
        .min(4, t('api.userPasswordTooShort'))
        .max(20, t('api.userPasswordTooLong')),

})

// 建立表單
const { handleSubmit, isSubmitting } = useForm({
    validationSchema: schema,
})

// 建立欄位
const account = useField('account')
const password = useField('password')

const submit = handleSubmit(async (values) => {
    try {
        const { data } = await api.post('/user/login', {
            account: values.account,
            password: values.password
        })

        user.login(data.result)
        createSnackbar({
            text: t('login.success'),
            snackbarProps: {
                color: 'success'
            }
        })

        // 登入成功回首頁
        router.push('/')
    } catch (error) {
        console.log(error)
        createSnackbar({
            text: t('api.' + (error?.response?.data?.message || 'unknownError')),
            snackbarProps: {
                color: 'error'
            }
        })
    }
})
</script>
