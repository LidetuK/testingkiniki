<template>
    <main class="flex justify-between h-screen bg-[#F5F5F5]">
        <div class="w-full flex justify-center items-center px-4 lg:w-2/3">
            <div class="w-full h-full flex flex-col justify-center items-center gap-4" v-if="isEmailSent">
                <img src="/img/bgs/forgot-password-background.webp" class="rounded-xl" width="250" height="250">
                <h1 class="text-2xl md:text-4xl text-[--primary] font-bold">Email sent!</h1>
                <p class="max-w-sm text-center">{{ responseMessage }}</p>
            </div>
            <form class="border py-4 px-6 w-full max-w-[600px] mx-auto rounded-xl bg-white relative"
                @submit.prevent="sendResetPasswordLink" v-else>
                <NuxtLink to="/" class="flex items-center gap-4 mb-8 text-gray-600 absolute -top-12 left-2">
                    <Icon name="weui:back-filled" />Home
                </NuxtLink>
                <header class="pb-6">
                    <img src="/img/api/logo2.webp" alt="" width="150px" class="mb-8">
                    <h1 class="text-4xl font-bold pb-2">Forgot Password</h1>
                    <p>Enter your email to receive the password reset link</p>
                </header>
                <div class="pb-6">
                    <label>Email</label>
                    <input type="email" name="email" id="email" placeholder="Enter your email" autocomplete="email"
                        v-model="email" class="border w-full py-2 px-3 focus:outline-none"
                        :class="{ loading: 'animate-pulse' }" required :disabled="loading">
                </div>
                <div class="pb-6">
                    <button type="submit"
                        class="bg-[--primary] py-2 px-3 rounded-sm w-full opacity-60 hover:opacity-100"
                        :class="{ loading: 'animate-pulse' }" :disabled="loading">Send
                        Link</button>
                </div>
            </form>

        </div>
        <img src="/public/img/bgs/login-background.webp" alt=""
            class="hidden lg:block lg:w-1/3 lg:max-h-screen lg:object-cover lg:opacity-50 lg:hover:opacity-100">
    </main>
</template>

<script lang="ts" setup>
const { externalApiUrl } = useRuntimeConfig().public
const { notify } = useNotification()
const loading = ref(false)
const email = ref(null)
const isEmailSent = ref(false)
const responseMessage = ref(null)

const sendResetPasswordLink = async () => {
    try {
        loading.value = true
        const response = await fetch(`${externalApiUrl}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email.value })
        });
        if (!response.ok) {
            throw Error('Something went wrong')
        }

        const emailResponse = await response.json()
        isEmailSent.value = emailResponse.success
        responseMessage.value = emailResponse.data.message
    } catch (err) {
        notify({ title: 'Password Reset Error', text: `Password reset attempt failed with error` })
    } finally {
        loading.value = false
    }
}
</script>
