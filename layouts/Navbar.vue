<template>
  <!-- Combined Notification Bar and Header Section -->
  <section class="frosted-glass">
    <!-- Notification Bar -->
    <div
      class="relative bg-[--primary] text-black p-3 z-50 shadow-md -mx-6 -top-6"
      style="position: sticky; top: 0;"
      v-if="isVisible"
    >
      <div class="flex flex-col items-center lg:flex-row lg:justify-between">
        <div class="text-center mb-2 lg:flex lg:gap-2 lg:text-left lg:mb-0">
          <p class="font-bold text-lg">Special Offer:</p>
          <p
            class="flex flex-col items-center lg:flex-row cursor-pointer"
            @click="copyToClipboard(DISCOUNT_CODE)"
          >
            Get 20% off on all purchases! Use code{{ ' ' }}
            <span class="font-bold px-2">{{ DISCOUNT_CODE }}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 256 256"
            >
              <g fill="black">
                <path d="M216 40v128h-48V88H88V40Z" opacity="0.2" />
                <path
                  d="M216 32H88a8 8 0 0 0-8 8v40H40a8 8 0 0 0-8 8v128a8 8 0 0 0 8 8h128a8 8 0 0 0 8-8v-40h40a8 8 0 0 0 8-8V40a8 8 0 0 0-8-8m-56 176H48V96h112Zm48-48h-32V88a8 8 0 0 0-8-8H96V48h112Z"
                />
              </g>
            </svg>
          </p>
        </div>
        <button
          @click="setIsVisible(false)"
          class="absolute top-2 right-2 text-black hover:text-gray-800 transition-colors lg:inset-y-0"
          aria-label="Close notification"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="-2 -2 24 24"
          >
            <path
              fill="black"
              d="m11.414 10l2.829-2.828a1 1 0 1 0-1.415-1.415L10 8.586L7.172 5.757a1 1 0 0 0-1.415 1.415L8.586 10l-2.829 2.828a1 1 0 0 0 1.415 1.415L10 11.414l2.828 2.829a1 1 0 0 0 1.415-1.415zM4 0h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Header Section -->
    <nav class="flex flex-row items-center justify-between p-2 rounded-xl">
      <article class="flex flex-row items-center space-x-2">
        <img
          src="/img/logos/logo-mark.webp"
          alt="Kisiki Capital Logo Mark"
          width="40"
          height="40"
        />
        <div class="hidden font-bold md:block">Kisiki Capital</div>
      </article>
      <article>
        <ul class="flex-row hidden space-x-6 md:flex">
          <li class="active">
            <NuxtLink to="/">Home</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/resources">Resources</NuxtLink>
          </li>
          <li>
            <a
              href="https://kisikicapitalforexacademy.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Our Academy
            </a>
          </li>
        </ul>
      </article>
      <article class="hidden md:block">
        <button
          aria-label="Sign In"
          class="p-2 border rounded btn-nav"
          @click="navigateTo('/login')"
        >
          Sign In
        </button>
      </article>
      <article class="flex items-center md:hidden">
        <button
          aria-label="Show or Hide Menu"
          class="md:hidden"
          @click="isMenuOpen = !isMenuOpen"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#fff"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </button>
      </article>
    </nav>

    <div class="relative">
      <nav
        class="absolute right-0 z-10 justify-center w-full py-4 mobile-nav md:hidden"
        :class="isMenuOpen ? 'flex' : 'hidden'"
      >
        <ul class="flex-col items-center space-y-4 md:flex">
          <li class="active">
            <NuxtLink to="/">Home</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/resources">Resources</NuxtLink>
          </li>
          <li>
            <a
              href="https://kisikicapitalforexacademy.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Our Academy
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </section>
</template>

<script setup>
const isMenuOpen = ref(false);
const isVisible = ref(true);
let timer = null;

const calculateTimeLeft = () => {
  const difference = +new Date(`2024-10-30T23:59:59`) - +new Date();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)).toString().padStart(2, '0'),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24).toString().padStart(2, '0'),
      minutes: Math.floor((difference / 1000 / 60) % 60).toString().padStart(2, '0'),
      seconds: Math.floor((difference / 1000) % 60).toString().padStart(2, '0'),
    };
  } else {
    isVisible.value = false;
  }

  return timeLeft;
};

const timeLeft = ref(calculateTimeLeft());

onMounted(() => {
  timer = setInterval(() => {
    timeLeft.value = calculateTimeLeft();
  }, 60_000);
});

onBeforeUnmount(() => {
  clearInterval(timer);
});

const setIsVisible = (state) => {
  isVisible.value = state;
};

const { notify } = useNotification();
const copyToClipboard = async (textToCopy) => {
  try {
    await navigator.clipboard.writeText(textToCopy);
    notify({ title: 'Copied!', text: 'copied to clipboard' });
  } catch (err) {
    notify({ title: 'Copying failed', text: 'copy manually instead.' });
  }
};

const DISCOUNT_CODE = 'DISCOUNT 20% OFF';
</script>

<style scoped>
nav svg {
  height: 3rem;
  width: 3rem;
}

@media (min-width: 768px) {
  nav {
    background: var(--grey-10);
  }
}

.mobile-nav {
  background-color: var(--grey);
}

nav li {
  font-weight: bold;
  font-size: var(--font-base);
  cursor: pointer;
}

nav li:hover {
  color: var(--gradient);
  text-decoration: none;
}

nav li.active {
  color: var(--primary);
}

.frosted-glass {
  backdrop-filter: blur(15px);
}
</style>
