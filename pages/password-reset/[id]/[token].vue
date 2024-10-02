<template>
    <main class="flex justify-between h-screen bg-[#F5F5F5]">
        <div class="w-full h-full flex flex-col justify-center items-center gap-4" v-if="isResetSuccess == 'yes'">
            <Icon name="clarity:success-standard-solid" size="96" class="text-[--primary]" />
            <p class="text-xl font-bold py-4">Password Changed!</p>
            <NuxtLink :to="loginPath">Go to login</NuxtLink>
        </div>
        <div class="w-full h-full flex flex-col justify-center items-center gap-4" v-else-if="isResetSuccess == 'no'">
            <Icon name="pajamas:canceled-circle" size="96" class="text-[--primary]" />
            <p class="text-xl font-bold py-4">Password Reset Failed</p>
        </div>
        <div class="w-full flex justify-center items-center px-4 lg:w-2/3" v-else>
            <div class="mx-auto" v-if="!isLinkValidated">
                <Icon name="eos-icons:three-dots-loading" size="96" class="text-[--primary]" />
            </div>
            <div class="mx-auto text-center" v-else-if="isInvalidLink && isLinkValidated">
                <Icon name="pajamas:canceled-circle" size="96" class="text-[--primary]" />
                <p class="text-xl font-bold py-4">Invalid Reset Link</p>
            </div>
            <form class="border py-4 px-6 w-full max-w-[600px] mx-auto rounded-xl bg-white"
                @submit.prevent="resetPassword" v-else-if="isLinkValidated && !isInvalidLink">
                <header class="pb-6">
                    <img src="/img/api/logo2.webp" alt="" width="150px" class="mb-8">
                    <h1 class="text-4xl font-bold pb-2">Reset Password</h1>
                    <p>Enter your new password to finish the process</p>
                </header>
                <div class="pb-6">
                    <label>New Password</label>
                    <div class="float-right" v-show="newPassword">
                        <p class="text-xs text-red-600" v-if="!isPasswordOkay">Passwords do not match!</p>
                        <Icon name="clarity:success-standard-solid" size="12" class="text-[--primary]" v-else />
                    </div>
                    <input type="password" name="new-password" id="new-password" v-model="newPassword"
                        autocomplete="new-password"
                        :class="{ loading: 'animate-pulse', isPasswordOkay: 'border-green-600' }"
                        class="border w-full py-2 px-3 focus:outline-none" required :disabled="loading">
                </div>
                <div class="pb-6">
                    <label>Confirm New Password</label>
                    <div class="float-right" v-show="confirmPassword">
                        <p class="text-xs text-red-600" v-if="!isPasswordOkay">Passwords do not match!</p>
                        <Icon name="clarity:success-standard-solid" size="12" class="text-[--primary]" v-else />
                    </div>
                    <input type="password" name="confirm-password" id="confirm-password" v-model="confirmPassword"
                        autocomplete="new-password"
                        :class="{ loading: 'animate-pulse', isPasswordOkay: 'border-green-600' }"
                        class="border w-full py-2 px-3 focus:outline-none" required :disabled="loading">
                </div>
                <div class="pb-6">
                    <button type="submit"
                        class="bg-[--primary] py-2 px-3 rounded-sm w-full opacity-60 hover:opacity-100"
                        :class="{ loading: 'animate-pulse bg-grey-900' }"
                        :disabled="loading || !isPasswordOkay">Submit</button>
                </div>
            </form>
        </div>
        <img src="/public/img/bgs/login-background.webp" alt=""
            class="hidden lg:block lg:w-1/3 lg:max-h-screen lg:object-cover lg:opacity-50 lg:hover:opacity-100">
    </main>
</template>

<script lang="ts" setup>
const { externalApiUrl, appUrl } = useRuntimeConfig().public

const loginPath = `${appUrl}/login`
const route = useRoute()
const { notify } = useNotification()

const userId = route.params.id
const token = route.params.token

const newPassword = ref(null)
const confirmPassword = ref(null)
const isPasswordOkay = computed(() => {
    return newPassword.value === confirmPassword.value
})

const loading = ref(false)
const isInvalidLink = ref(true)
const isLinkValidated = ref(false)
const idAndToken = ref<Record<string, any> | null>(null)
const isResetSuccess = ref<'yes' | 'no' | null>(null)

const validateLink = async () => {
    try {
        loading.value = true
        const response = await fetch(`${externalApiUrl}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Service-Method': 'verifyPasswordResetLink'
            },
            body: JSON.stringify({ userId, token })
        })
        if (!response.ok) {
            throw Error('Something went wrong')
        }
        const verifyResponse = await response.json()
        if (verifyResponse.error) {
            throw Error('Invalid Reset Link')
        }
        idAndToken.value = verifyResponse.data
        isInvalidLink.value = false
    } catch (err) {
        isInvalidLink.value = true
    } finally {
        loading.value = false
        isLinkValidated.value = true
    }
}

const resetPassword = async () => {
    try {
        loading.value = true
        if (!idAndToken.value?.id || !idAndToken.value?.token || !newPassword.value) {
            throw Error('Missing required fields')
        }
        // update password
        const response = await fetch(`${externalApiUrl}/users/${idAndToken.value?.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: newPassword.value })
        })
        if (!response.ok) {
            throw Error('Something went wrong')
        }
        isResetSuccess.value = 'yes'
    } catch (err) {
        isResetSuccess.value = 'no'
        notify({ title: 'Password Reset Error', text: `Password reset failed with error: ${err}` })
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    await validateLink()
})
</script>
