<script setup>
const emit = defineEmits(['togglePageAlert'])

function handleScroll() {
    const scrolled = window.scrollY;

    // throttling to optimize performance: https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event
    window.requestAnimationFrame(() => {
        if (scrolled >= 40) {
            emit('togglePageAlert', false);
        } else {
            emit('togglePageAlert', true);
        }
    });


}

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>
<template></template>