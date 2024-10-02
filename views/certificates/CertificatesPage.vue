<template>
  <main id="certificates-page" class="px-2 py-8 md:px-20">
    <header class="py-16 rounded-3xl">
      <div class="flex flex-row items-center justify-center mb-16">
        <article class="flex flex-row items-center space-x-2">
          <img
            src="/img/logos/logo-mark.webp"
            alt="Kisiki Capital Logo Mark"
            width="40"
            height="40"
          />
          <div class="font-bold">Kisiki Capital</div>
        </article>
      </div>
      <article
        class="flex flex-row items-center justify-center p-4 mb-8 space-x-2 verified"
      >
        <Icon
          name="material-symbols:check-circle-outline-rounded"
          class="w-[40px] h-[40px]"
        />
        <span
          >The Authenticity Of This Certificate is Successfully Verified</span
        >
      </article>
      <article class="flex flex-col items-center justify-center mb-16">
        <div class="flex flex-row items-center mb-4 space-x-2">
          <Icon name="material-symbols:share" class="w-[20px] h-[20px]" />
          <span class="font-bold">Share With Others</span>
        </div>
        <div
          class="flex flex-col space-x-0 space-y-6 lg:flex-row lg:space-x-6 lg:space-y-0"
        >
          <button
            aria-label="Copy Certificate Link"
            class="p-2 border rounded btn-ghost"
            @click="useCopyToClipboard('certificate')"
          >
            <div class="flex flex-row items-center justify-center space-x-2">
              <Icon
                name="material-symbols:content-copy-outline"
                class="w-[20px] h-[20px]"
              />
              <span> Copy Certificate Link</span>
            </div>
          </button>
          <button
            aria-label="Copy Certificate Link"
            class="p-2 border rounded btn-ghost"
            @click=""
          >
            <div class="flex flex-row items-center justify-center space-x-2">
              <Icon
                name="material-symbols:download"
                class="w-[20px] h-[20px]"
              />
              <span>Download Certificate PNG</span>
            </div>
          </button>
          <button
            aria-label="Copy Certificate Link"
            class="p-2 border rounded btn-ghost"
            @click=""
          >
            <div class="flex flex-row items-center justify-center space-x-2">
              <Icon
                name="material-symbols:download"
                class="w-[20px] h-[20px]"
              />
              <span>Download Certificate PDF</span>
            </div>
          </button>
        </div>
      </article>
      <article class="mx-2 mb-16 md:mx-8">
        <img src="" alt="Kisiki Capital - Challenge Certificate" />
      </article>
    </header>
  </main>
</template>

<script setup>
const { useCopyToClipboard } = useMyUtils();
</script>

<style scoped>
#certificates-page header {
  background-image: var(--gradient3);
}

.verified {
  background: var(--primary);
}

.link {
  font-weight: bold;
  color: var(--primary);
}

.link:hover {
  text-decoration: underline;
}
</style>
