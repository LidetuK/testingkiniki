<script lang='ts' setup>
const isVisible = ref(false)
const close = () => {
    isVisible.value = false
}

const CURRENT_AD = 'kisiki-ad-1'
const alreadySeenAd = () => {
    localStorage.setItem(CURRENT_AD, JSON.stringify({ dontShowAgain: true }))
    isVisible.value = false
}

const getAdPreferences = () => {
    const preferences = localStorage.getItem(CURRENT_AD);
    return preferences ? JSON.parse(preferences) : null;
}

const showActions = ref(true)
const closeActions = () => {
    showActions.value = false;
}
onBeforeMount(() => {
    setTimeout(() => {
        const preferences = getAdPreferences()
        isVisible.value = !preferences?.dontShowAgain;
    }, 3_000)
})
</script>

<template>
    <transition name="fade" mode="out-in">
        <div class="z-50 fixed inset-0 mt-32" v-if="isVisible">
            <button class="" @click="close">
                <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 32 32">
                    <path fill="#F68422"
                        d="M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2m5.4 21L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4z" />
                </svg>
            </button>
            <div class="w-full shadow-lg border border-[--dprimary] rounded-lg overflow-hidden md:max-w-md md:mx-auto">
                <img src="/img/promos/car-promo.webp" alt="advertisement poster" class="object-fit">
                <div class="bg-[--dprimary] flex items-center gap-4 p-3" v-if="showActions">
                    <span class="font-medium text-sm text-black">Already seen this ad? Turn off?</span>
                    <button class="flex items-center text-sm text-black" @click="alreadySeenAd">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20">
                            <path fill="black" d="m14.83 4.89l1.34.94l-5.81 8.38H9.02L5.78 9.67l1.34-1.25l2.57 2.4z" />
                        </svg>Yes
                    </button>
                    <div class="h-full w-[1px] bg-black">&nbsp;</div>
                    <button class="flex items-center text-sm text-black" @click="closeActions">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20">
                            <path fill="black"
                                d="M14.95 6.46L11.41 10l3.54 3.54l-1.41 1.41L10 11.42l-3.53 3.53l-1.42-1.42L8.58 10L5.05 6.47l1.42-1.42L10 8.58l3.54-3.53z" />
                        </svg>No
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
    {
    opacity: 0;
}
</style>