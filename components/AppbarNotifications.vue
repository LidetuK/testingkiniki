<script setup>
const isVisible = ref(true)
let timer = null

const calculateTimeLeft = () => {
    const difference = +new Date(`2024-10-30T23:59:59`) - +new Date()
    let timeLeft = {}
    
    if (difference > 0) {
        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)).toString().padStart(2, '0'),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24).toString().padStart(2, '0'),
            minutes: Math.floor((difference / 1000 / 60) % 60).toString().padStart(2, '0'),
            seconds: Math.floor((difference / 1000) % 60).toString().padStart(2, '0')
        }
    } else {
        isVisible.value = false
    }
    
    return timeLeft
}
const timeLeft = ref(calculateTimeLeft())

onMounted(() => {
    timer = setInterval(() => {
        timeLeft.value = calculateTimeLeft()
    }, 60_000)
})
onBeforeUnmount(() => {
    clearInterval(timer)
})

const setIsVisible = (state) => {
    isVisible.value = state
}

const { notify } = useNotification()
const copyToClipboard = async (textToCopy) => {
    try {
        await navigator.clipboard.writeText(textToCopy);
        notify({ title: 'Copied!', text: 'copied to clipboard' })
    } catch (err) {
        notify({ title: 'Copying failed', text: 'copy manually instead.' })
    }
}

const DISCOUNT_CODE = "DISCOUNT 20% OFF"
</script>

<template>
    <!--
    <div class="relative bg-[--primary] text-black p-3 z-50 shadow-md -mx-6 -top-6"
         style="position: stic; top: 0;"
         v-if="isVisible">
        <div class="flex flex-col items-center lg:flex-row lg:justify-between">
            <div class="text-center mb-2 lg:flex lg:gap-2 lg:text-left lg:mb-0">
                <p class="font-bold text-lg">Special Offer:</p>
                <p class="flex flex-col items-center lg:flex-row cursor-pointer"
                   @click="copyToClipboard(DISCOUNT_CODE)">
                    Get 20% off on all purchases! Use code{{ ' ' }}
                    <span class="font-bold px-2">{{ DISCOUNT_CODE }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256">
                        <g fill="black">
                            <path d="M216 40v128h-48V88H88V40Z" opacity="0.2" />
                            <path
                                d="M216 32H88a8 8 0 0 0-8 8v40H40a8 8 0 0 0-8 8v128a8 8 0 0 0 8 8h128a8 8 0 0 0 8-8v-40h40a8 8 0 0 0 8-8V40a8 8 0 0 0-8-8m-56 176H48V96h112Zm48-48h-32V88a8 8 0 0 0-8-8H96V48h112Z" />
                        </g>
                    </svg>
                </p>
            </div>
            <div class="text-center lg:flex lg:gap-2 lg:text-right mb-2 lg:mb-0 lg:mr-10">
                <p>&nbsp;</p>
            </div>
            <button @click=setIsVisible(false)
                    class="absolute top-2 right-2 text-black hover:text-gray-800 transition-colors lg:inset-y-0"
                    aria-label="Close notification">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-2 -2 24 24">
                    <path fill="black"
                          d="m11.414 10l2.829-2.828a1 1 0 1 0-1.415-1.415L10 8.586L7.172 5.757a1 1 0 0 0-1.415 1.415L8.586 10l-2.829 2.828a1 1 0 0 0 1.415 1.415L10 11.414l2.828 2.829a1 1 0 0 0 1.415-1.415zM4 0h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4" />
                </svg>
            </button>
        </div>
    </div>
    -->
</template>
