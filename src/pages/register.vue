<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1 class="text-center">{{ $t('nav.register') }}</h1>
            </v-col>
            <v-divider></v-divider>
            <v-col cols="12">

                <v-form :disabled="isSubmitting" @submit.prevent="submit">
                    <!-- account -->
                    <v-text-field v-model="account.value.value" :error-message="account.errorMessage.value"
                        :label="$t('user.account')" minlength="4" maxlength="20" counter>
                    </v-text-field>

                    <!-- email -->
                    <v-text-field v-model="email.value.value" :error-messages="email.errorMessage.value"
                        :label="$t('user.email')">
                    </v-text-field>

                    <!-- password -->
                    <v-text-field v-model="password.value.value" type="password"
                        :error-messages="password.errorMessage.value" :label="$t('user.password')" minlength="4"
                        maxlength="20" counter>
                    </v-text-field>

                    <v-text-field v-model="passwordConfirm.value.value" type="password"
                        :error-messages="passwordConfirm.errorMessage.value" :label="$t('user.passwordConfirm')"
                        minlength="4" maxlength="20" counter>
                    </v-text-field>

                    <div class="text-center">
                        <v-btn type="submit" color="primary">{{ $t('register.submit') }}</v-btn>
                    </div>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { useForm, useField } from "vee-validate"
import * as yup from 'yup'
import validator from 'validator'
import { useI18n } from 'vue-i18n'
import { useAxios } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import { useRouter } from 'vue-router'


const { t } = useI18n()
const { api } = useAxios()
const createSnackbar = useSnackbar()
const router = useRouter()

const schema = yup.object({
    account: yup
        .string() // 資料型態是文字
        .required(t('api.userAccountRequired')) // 必填
        .min(4, t('api.userAccountTooShort')) // 最短長度
        .max(20, t('api.userAccountTooLong')) // 最長長度

        // 自訂驗證(自訂驗證名稱, 錯誤訊息, function)
        .test('isAlphanumeric', t('api.userAccountInvalid'), value => validator.isAlphanumeric(value)),

    email: yup
        .string()
        .required(t('api.userEmailRequired'))
        .test(
            'isEmail', t('api.userEmailInvalid'),
            value => validator.isEmail(value)
        ),

    password: yup
        .string()
        .required(t('api.userPasswordRequired'))
        .min(4, t('api.userPasswordTooShort'))
        .max(20, t('api.userPasswordTooLong')),

    passwordConfirm: yup
        .string()
        .oneOf([yup.ref('password')], t('api.userPasswordNotMatch'))

})

const { handleSubmit, isSubmitting } = useForm({
    validationSchema: schema,
})

const account = useField('account')
const email = useField('email')
const password = useField('password')
const passwordConfirm = useField('passwordConfirm')


// 處理送出
const submit = handleSubmit(async (values) => {
    try {
        await api.post('/user', {
            account: values.account,
            email: values.email,
            password: values.password
        })
        // 註冊成功
        createSnackbar({
            text: t('register.success'),
            snackbarProps: {
                color: 'success',
            }
        })
        // 導回登入
        router.push('/login')
    } catch (error) {
        console.log(error)
        createSnackbar({
            // api.[後端傳來的message] 或 api.unknownError 用來查找翻譯檔
            text: t('api.' + (error?.response?.data.message || 'unknownError')),
            snackbarProps: {
                color: 'error',
            }
        })
    }
})
</script>
