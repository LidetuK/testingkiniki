<template>
  <section class="flex flex-col items-center justify-center p-24">
    <div class="error-img">
      <img
        src="/img/bgs/404-background.webp"
        alt="Kisiki Capital error Error"
        height="500px"
        width="500px"
      />
    </div>
    <div class="error-title text-2xl md:pb-4">Page not found</div>
    <div class="text-center error-desc">
      You’ve discovered a previously hidden gem. However, it seems <br />
      that it’s not tradeable. Let’s get you back on track
    </div>
    <NuxtLink to="/" class="font-bold error-link">Back to Home</NuxtLink>
  </section>
</template>

<script></script>

<style scoped>
img {
  filter: grayscale(1);
}
.error-img,
.error-title,
.error-desc,
.error-link {
  @apply mb-4;
}

.error-title {
  font-family: var(--font-title);
}

.error-link {
  color: var(--primary);
}

@media (min-width: 768px) {
  .error-title {
      font-size: var(--font-2xl);
    }
}
</style>
