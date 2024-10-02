<script lang="ts" setup>
    defineProps({
        title: String,
        link: String
    })
</script>
<template>
    <main class="h-screen flex flex-col justify-center items-center text-center">
        <header class="py-16">
            <h1 class="p-4 text-[--primary] text-4xl">{{ title }}</h1>
            <a :href="link" :download="link" class="w-full text-white underline" allow-downloads>
                Download or Open PDF
            </a>
        </header>
        <embed :src="link" class="w-full h-screen"/>
    </main>
</template>