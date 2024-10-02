<template>
    <main class="flex justify-between h-screen bg-[#F5F5F5]">
        <div class="flex items-center justify-center w-full px-4 lg:w-2/3">
            <form class="border py-4 px-6 w-full max-w-[600px] mx-auto rounded-xl bg-white relative"
                @submit.prevent="login">
                <NuxtLink to="/" class="absolute flex items-center gap-4 mb-8 text-gray-600 -top-12 left-2">
                    <Icon name="weui:back-filled" />Home
                </NuxtLink>
                <header class="pb-6">
                    <img src="/img/api/logo2.webp" alt="" width="150px" class="mb-8">
                    <h1 class="pb-2 text-4xl font-bold">Login</h1>
                    <p>Welcome back. Let's get straight to trading</p>
                </header>
                <div class="pb-6">
                    <label>Email</label>
                    <input type="email" name="email" id="email" placeholder="Enter your email" v-model="email"
                        class="w-full px-3 py-2 border focus:outline-none" autocomplete="email" :disabled="loading"
                        required>
                </div>
                <div class="pb-6">
                    <label>Password</label>
                    <input type="password" name="password" id="password" v-model="password"
                        class="w-full px-3 py-2 border focus:outline-none" autocomplete="current-password"
                        :disabled="loading" required>
                </div>
                <div class="pb-6">
                    <button type="submit"
                        class="bg-[--primary] py-2 px-3 rounded-sm w-full opacity-60 hover:opacity-100"
                        :class="{ loading: 'opacity-100 animate-pulse' }" :disabled="loading">Next</button>
                </div>
                <NuxtLink to="/forgot-password" class="underline">Forgot password?</NuxtLink>
            </form>
        </div>
        <img src="/public/img/bgs/login-background.webp" alt=""
            class="hidden lg:block lg:w-1/3 lg:max-h-screen lg:object-cover lg:opacity-50 lg:hover:opacity-100">
    </main>
</template>

<script lang="ts" setup>
import feathersClient from "../lib/feathersRestClient.js";
// import useGlobalStore from '~/store/modules/globalStore';
// const globalStore = useGlobalStore()

const { notify } = useNotification()
const email = ref(null)
const password = ref(null)
const loading = ref(false)
const { externalApiUrl } = useRuntimeConfig().public;
const feathers = feathersClient(externalApiUrl);

const login = async () => {
    try {
        loading.value = true
        const response = await feathers.authenticate({
            strategy: "local",
            email: email.value,
            password: password.value,
        });
        localStorage.setItem("feathers-jwt", response.accessToken);
        // globalStore.setUser(response.data.user)
        navigateTo('/dashboard')
    } catch (err: any) {
        notify({ title: 'Login Failed', text: `Invalid credentials. Please try again.` })
    } finally {
        loading.value = false
    }
}

const reAuthenticate = async () => {
    try {
        loading.value = true
        const token = localStorage.getItem("feathers-jwt");
        if (token) {
            // Authenticate using an existing token
            const response = await feathers.reAuthenticate()
            // globalStore.setUser(response.user)
            navigateTo('/dashboard')
        }
    } catch (err) {
        notify({ title: 'Automatic Reauthentication', text: `Reauthentication failed. Please login manually.` })
    } finally {
        loading.value = false
    }
};

onMounted(async () => {
    reAuthenticate()
})
</script>
