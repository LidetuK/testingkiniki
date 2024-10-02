<template>
  <section class="flex flex-row items-center justify-center" id="cas-section">
    <article class="my-16 md:mx-8">
      <main class="flex flex-row justify-center rounded-3xl">
        <div class="flex flex-row items-center">
          <div class="hidden lg:block">
            <img src="/img/bgs/cas-background1.webp" alt="Kisiki Capital" height="50px" width="34px" />
          </div>
          <article class="flex flex-col">
            <div class="mb-2 title-lg">Ready to take the leap?</div>
            <div>
              Ready to open the door to financial <br />
              independence and achieve your dreams ?
            </div>
            <div>
              <button aria-label="Get Started" class="p-4 mt-8 rounded btn-cta" @click="scrollToPackages()">
                Get Started
              </button>
            </div>
          </article>
          <div class="hidden lg:block">
            <img src="/img/bgs/cas-background2.webp" alt="Kisiki Capital" height="50px" width="32px" />
          </div>
        </div>
      </main>
    </article>
  </section>
  <footer class="py-8 font-bold md:px-8">
    <article class="flex flex-col justify-center lg:mb-6 lg:justify-between lg:items-center lg:flex-row">
      <div class="m-auto mb-8 lg:m-0">
        <article class="flex flex-row items-center space-x-2">
          <img src="/img/logos/logo-mark.webp" alt="Kisiki Capital Logo Mark" width="40" height="40" />
          <div class="font-bold">Kisiki Capital</div>
        </article>
      </div>
      <div
        class="flex flex-col mb-6 space-x-0 space-y-6 lg:space-y-0 lg:m-0 lg:flex-row lg:justify-between lg:space-x-8">
        <div>
          <NuxtLink to="privacy-policy">Privacy Policy</NuxtLink>
        </div>
        <div>
          <NuxtLink to="terms-and-conditions">Terms and Conditions</NuxtLink>
        </div>
        <div>
          <NuxtLink to="refund-policy">Refund Policy</NuxtLink>
        </div>
      </div>
      <div class="flex flex-row justify-center mb-6 space-x-4 lg:justify-between footer-icons">
        <a href="tel:+255680082960" aria-label="Contact with Phone Number">
          <Icon name="material-symbols:call-outline" class="w-[28px] h-[28px] md:w-[24px] md:h-[24px]" />
        </a>
        <a href="https://t.me/kisiki_capital" aria-label="Contact with Telegram">
          <Icon name="mingcute:telegram-line" class="w-[28px] h-[28px] md:w-[24px] md:h-[24px]" />
        </a>
        <a href="https://instagram.com/kisiki_capital" aria-label="Contact with Instagram">
          <Icon name="mdi:instagram" class="w-[28px] h-[28px] md:w-[24px] md:h-[24px]" />
        </a>
        <a href="https://x.com/kisiki_capital" aria-label="Contact with Twitter or X">
          <Icon name="carbon:logo-x" class="w-[28px] h-[28px] md:w-[24px] md:h-[24px]" />
        </a>
      </div>
    </article>
    <article class="text-center">
      &copy;{{ new Date().getFullYear() }} Kisiki Capital
    </article>
  </footer>
</template>

<script setup>
const emit = defineEmits(["scrollToPackages"]);
function scrollToPackages() {
  emit("scrollToPackages");
}
</script>

<style scoped>
#cas-section img {
  clip-path: inset(0% round 24px);
  height: 400px;
  width: 600px;
}

@media (min-width: 1200px) {
  #cas-section article {
    width: 1090px;
  }

  #cas-section img {
    height: 500px;
    width: 750px;
  }
}

@media (min-width: 1440px) {
  #cas-section article {
    width: 1330px;
  }

  #cas-section img {
    height: 500px;
    width: 750px;
  }
}

@media (min-width: 1800px) {
  #cas-section article {
    width: 1690px;
  }

  #cas-section img {
    height: 500px;
    width: 750px;
  }
}

@media (min-width: 2560px) {
  #cas-section article {
    width: 2070px;
  }

  #cas-section img {
    height: 500px;
    width: 750px;
  }
}

#cas-section main {
  background-image: var(--gradient3);
}

@media (max-width: 1023px) {
  #cas-section main {
    background-image: inherit;
  }
}

footer svg {
  height: 2rem;
  width: 2rem;
  fill: #a4a8ac;
}

.footer-icons img {
  width: 28px;
  height: 28px;
}

.footer-icons img:hover,
footer svg:hover {
  background-color: var(--primary);
}
</style>
