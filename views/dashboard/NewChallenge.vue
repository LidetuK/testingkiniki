<template>
  <main id="new-challenge">
    <header class="m-4">
      <DashboardHeader :side-nav-title="'New Challenge'"
        :side-nav-icon="`<svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='#9F9F9F'><path d='M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z'/></svg>`"
        :center="true" />
    </header>
    <main class="mx-2 lg:max-w-3xl lg:mx-auto">
      <header class="flex flex-row justify-between px-4 py-2 mb-4 rounded-full step-pills-cover">
        <div v-for="formStep in formSteps" :key="formStep.id">
          <div class="flex flex-row items-start">
            <div class="flex flex-col step-pills" :class="{ active: activeFormStep == formStep.id }">
              <article class="flex items-center w-[28px] h-[28px] mx-auto text-lg rounded-full">
                <b class="w-full text-center">{{ formStep.id }}</b>
              </article>
              <span class="text-xs pt-2">{{ formStep.title }}</span>
            </div>
            <div class="hidden md:ml-20 lg:ml-28 step-arrow md:block" :class="{ active: activeFormStep == formStep.id }"
              v-show="formStep.id != 3">
              <Icon name="material-symbols:keyboard-backspace" class="w-[50px] h-[50px]" />
            </div>
          </div>
        </div>
      </header>

      <div v-if="activeFormStep == 1">
        <ChallengeSetupForm @goToVerifyForm="goToVerifyForm()" />
      </div>

      <div v-if="activeFormStep == 2">
        <ChallengeVerifyForm @goToPayForm="goToPayForm()" />
      </div>

      <div v-if="activeFormStep == 3">
        <ChallengePayForm/>
      </div>
    </main>
  </main>
</template>

<script setup>
const formSteps = ref([
  {
    id: "1",
    title: "Set Up",
  },
  {
    id: "2",
    title: "Verify",
  },
  {
    id: "3",
    title: "Pay",
  },
]);
const activeFormStep = ref(1);

function goToVerifyForm() {
  activeFormStep.value = 2;
}

function goToPayForm() {
  activeFormStep.value = 3;
}
</script>

<style scoped>
.step-pills {
  @apply text-center px-4 py-2;
  font-weight: bold;
}

#dashboard-page .step-pills.active {
  color: var(--dsecondary);
}

.step-pills article {
  background-color: var(--white);
}

.step-pills.active article {
  background-color: var(--dsecondary);
}

.step-pills b {
/*  font-size: var(--font-lg); */
  color: var(--dgrey);
}

.step-pills.active b {
  color: var(--white);
}

.step-arrow {
  transform: rotate(180deg);
}

.step-arrow.active {
  color: var(--dsecondary);
}
</style>
