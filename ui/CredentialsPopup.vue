<template>
  <div
    v-if="isCredentialsPopup"
    id="credentials-popup"
    class="flex flex-row items-center justify-center backdrop-filter backdrop-blur-sm popup-box-overlay"
  >
    <main class="px-8 py-6 popup-box">
      <article class="flex flex-row items-center justify-between">
        <div class="title-lg">Credentials</div>
        <button class="btn-close" @click="toggleCredentialsPopup()">
          &times;
        </button>
      </article>
      <article class="mb-4 text-left title-lg">#12313219</article>
      <hr class="white-40-divider" />
      <div v-for="credential in challengeCredentialsList" :key="credential.id">
        <article class="grid grid-cols-1 my-6 md:grid-cols-2">
          <div class="font-bold">{{ credential.title }}</div>
          <div class="inline-flex">
            <span class="mr-2">{{ credential.content }}</span>
            <span
              class="cursor-pointer"
              v-show="credential.title != 'Platform'"
              @click="useCopyToClipboard(credential.content)"
            >
              <Icon
                name="material-symbols:content-copy-outline"
                class="w-[30px] h-[30px]"
              />
            </span>
          </div>
        </article>
      </div>
    </main>
  </div>
</template>

<script setup>
import challengeCredentialsListData from "~/data/challengeCredentialsListData.js";
const challengeCredentialsList = ref(challengeCredentialsListData);
const isCredentialsPopup = ref(false);
function toggleCredentialsPopup() {
  isCredentialsPopup.value = !isCredentialsPopup.value;
}
defineExpose({ toggleCredentialsPopup });

const { useCopyToClipboard } = useMyUtils();
</script>

<style scoped>
.iconify:hover {
  color: var(--secondary);
}
</style>
