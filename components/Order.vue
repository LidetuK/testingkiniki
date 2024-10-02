<template>
    <div v-if="myErrors" class="bg-red-600 w-full py-2 text-center text-white my-3">{{ myErrors }}</div>
    
    <div v-if="orderResponse?.redirect_url">
        <iframe :src="orderResponse.redirect_url" frameborder="0" width="100%" height="500px"
            class="mx-auto md:max-w-xl"></iframe>
    </div>
    <p class="my-10 w-full flex justify-center bg-gray-100 text-wrap">
        <code class="max-w-lg overflow-auto">Request:&nbsp;{{ formData }}</code>
    </p>
    <p class="my-10 w-full flex justify-center bg-gray-100 text-wrap">
        <code class="max-w-lg overflow-auto">Order Response:&nbsp;{{ orderResponse }}</code>
    </p>
</template>
<script setup lang="ts">
import { v4 as uuidV4 } from 'uuid';

const { appUrl } = useRuntimeConfig().public

const formData = ref({
    id: uuidV4(),
    currency: 'KES',
    amount: 1,
    description: 'Test order',
    redirect_mode: '_TOP_WINDOW',
    callback_url: `${appUrl}/api/callback`,
    notification_id: '3f426a95-c362-4694-8410-dcf0581b2fc4',
    billing_address: {
        email_address: null,
    }
});

const orderResponse = ref < any > ()
const myErrors = ref < any > ()
const loading = ref(false)
const pay = async () => {
    try {
        loading.value = true

        // Order Request
        const response = await $fetch('/api/pesapal/order', {
            method: 'post',
            body: { formData: formData.value }
        })
        if (response.status != "200" || response.error) throw Error(`Something went wrong ${response.error}`)
        orderResponse.value = response
    } catch (err: any) {
        console.log("🚀 ~ pay ~ err:", err)
        myErrors.value = err
    } finally {
        loading.value = false
    }

}
</script>