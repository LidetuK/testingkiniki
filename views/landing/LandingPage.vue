<template>
  <main id="landing-page" class="px-4 py-5 text-center md:px-6">
    <header class="sticky top-2">
      <ClientOnly>
        <AdvertPopup />
        <transition name="fade" mode="out-in">
          <AppbarNotifications v-if="isPageAlertVisible" />
        </transition>
      </ClientOnly>
      <Navbar />
    </header>
    <section id="hero-section" class="py-24 md:py-40">
      <div class="mb-6 title-lg-gradient md:max-w-lg md:mx-auto lg:max-w-3xl">
        Grow your financial portfolio with <br />
        adequate funding
      </div>
      <div class="md:max-w-md md:mx-auto lg:max-w-3xl">
        Unleash your trade potential with expert trade advice from expert trade
        professionals <br />
        and adequate funding from a trusted prop firm
      </div>
      <div class="flex items-center justify-center gap-6 my-4 md:my-0 md:gap-0 md:space-y-4 md:flex-col md:block">
        <button aria-label="Get Started" class="p-4 rounded md:mt-8 btn-cta" @click="scrollToPackages()">
          Get Started
        </button>
        <article class="md:hidden">
          <button aria-label="Sign In" class="px-10 py-4 border rounded btn-nav" @click="navigateTo('/login')">
            Sign In
          </button>
        </article>
      </div>
      <div class="flex justify-center mt-8">
        <img src="/img/avatars/avatargroup.webp" alt="Kisiki Avatar Group" width="150" height="150" />
      </div>
      <div class="mt-6 font-bold">Trusted by 20+ traders</div>
    </section>
    <DividerSection />
    <section class="py-24">
      <div class="mb-6 title-lg">Why Trade With Us</div>
      <div>
        Simple. We ensure your trade success and security by assisting you every
        <br />
        step of the way in your journey
      </div>
      <div class="flex flex-col justify-center my-20 space-x-0 space-y-16 lg:space-x-16 lg:space-y-0 lg:flex-row">
        <article class="flex flex-col items-center">
          <div class="mb-6">
            <img src="/img/icons/wallet.webp" alt="Kisiki Capital Wallet Icon" height="50" width="50" />
          </div>
          <div class="mb-2 title-md">Adequate funding</div>
          <div>
            We fund your trade ventures 100%, allowing you to <br />
            trade without fear of losing your money.
          </div>
        </article>

        <article class="flex flex-col items-center">
          <div class="mb-6">
            <img src="/img/icons/lock.webp" alt="Kisiki Capital Lock Icon" height="50" width="50" />
          </div>
          <div class="mb-2 title-md">Secure Data Management</div>
          <div>
            Any and all transactions within the platform are <br />
            end-to-end encrypted to ensure that your <br />
            winnings are safe
          </div>
        </article>

        <article class="flex flex-col items-center">
          <div class="mb-6">
            <img src="/img/icons/graduation.webp" alt="Kisiki Capital Graduation Icon" height="50" width="50" />
          </div>
          <div class="mb-2 title-md">Learning from the best</div>
          <div>
            Access the best advice from the best trade experts <br />
            to help you learn to maneuver the trade landscape.
          </div>
        </article>
      </div>
    </section>
    <DividerSection />
    <section class="py-24">
      <div class="mb-6 title-lg">Our Process</div>
      <div>
        As a prop firm, <br />we’ve researched on the safest and best ways to
        approach trading <br />through expert algorithms to ensure that risk is
        maximized<br />
        within the bounds of sense to ensure that
      </div>
      <div
        class="flex flex-col justify-center my-20 space-x-0 space-y-16 lg:container lg:mx-auto lg:space-x-16 lg:space-y-0 lg:flex-row">
        <article class="flex flex-col items-center">
          <div>
            <img src="/img/icons/number1.webp" alt="Kisiki Capital Icon" width="200" height="200" />
          </div>
          <div class="mb-2 title-md">
            Package Purchase <br />
            and getting started
          </div>
          <div class="md:max-w-lg">
            You purchase a package to allow us to assign you to a professional
            who will help you handle your trade ventures
          </div>
        </article>
        <hr />

        <article class="flex flex-col items-center">
          <div>
            <img src="/img/icons/number2.webp" alt="Kisiki Capital Icon" width="200" height="200" />
          </div>
          <div class="mb-2 title-md">
            Discovery call and <br />
            ratio agreement
          </div>
          <div class="md:max-w-lg">
            You engage your assigned professional, who takes you through our
            terms and conditions and you agree on a set ratio of profit sharing
          </div>
        </article>
        <hr />

        <article class="flex flex-col items-center">
          <div>
            <img src="/img/icons/number3.webp" alt="Kisiki Capital Icon" width="200" height="200" />
          </div>
          <div class="mb-2 title-md">
            Strategy and fund <br />
            assigning
          </div>
          <div class="md:max-w-lg">
            Along with your assigned professional, you strategize and then you
            are assigned you initial funds
          </div>
        </article>
        <hr />

        <article class="flex flex-col items-center">
          <div>
            <img src="/img/icons/number4.webp" alt="Kisiki Capital Icon" width="200" height="200" />
          </div>
          <div class="mb-2 title-md">Maintenance and risk management</div>
          <div class="md:max-w-lg">
            Constant assistance from your assigned professional, helping you
            reduce your losses and maximize your wins
          </div>
        </article>
      </div>
    </section>
    <DividerSection />
    <section class="py-24" id="benefits-section">
      <div class="mb-6 title-lg">Numbers don’t lie</div>
      <div>
        Men lie, women lie, the world lies, but numbers don’t. See how we fare
        in <br />
        terms of statistical performance
      </div>
      <div
        class="flex flex-col justify-center mt-8 space-x-0 space-y-4 lg:container lg:mx-auto lg:space-y-0 lg:space-x-6 lg:flex-row">
        <article class="rounded-lg lg:w-full lg:flex lg:flex-col lg:items-center lg:justify-center">
          <div class="hidden m-auto lg:block">
            <img src="/img/icons/users.webp" alt="Kisiki Capital Users Icon" height="200px" width="200px" />
          </div>
          <div class="benefits-title">20+</div>
          <div class="benefits-desc">ambitious traders</div>
        </article>
        <div class="space-y-4 lg:w-full lg:flex lg:flex-col lg:space-y-6">
          <article class="rounded-lg">
            <div class="benefits-title">25M+</div>
            <div class="benefits-desc">in trade investments</div>
          </article>
          <article class="row-span-1 rounded-lg">
            <div class="benefits-title">50</div>
            <div class="benefits-desc">in daily trade pieces</div>
          </article>
        </div>
        <article class="rounded-lg lg:w-full lg:flex lg:flex-col lg:items-center lg:justify-center">
          <div class="hidden mb-4 lg:block">
            <img src="/img/icons/moneywavy.webp" alt="Kisiki Capital MoneyWavy Icon" height="200px" width="307px" />
          </div>
          <div class="benefits-title">1M+</div>
          <div class="benefits-desc">in trade winnings</div>
        </article>
      </div>
    </section>
    <DividerSection />
    <section class="py-24">
      <div class="mb-6 title-lg">Word on the street</div>
      <div>
        As a prop firm, we have had the pleasure of financing hundreds of
        ambitious <br />
        traders and helped them achieve their dream of financial independence.
        <br />
        Don’t believe us? Peep below
        <br />
        <a class="terms-link" href="https://www.trustpilot.com/review/kisikicapital.com" target="_blank"
          rel="noopener noreferrer">
          Look at more reviews
        </a>
      </div>
      <div class="flex flex-row justify-between px-10 py-4 mt-8 space-x-8 quote-cover scrollbar-hide">
        <article class="flex flex-col justify-between p-4 text-left quote-container rounded-2xl"
          v-for="quote in quoteList" :key="quote.id">
          <div class="mb-4 w-[280px] h-[200px] lg:w-[450px] overflow-auto scrollbar-hide">
            <p class="text-ellipsis text-wrap">{{ quote.content }}</p>
          </div>
          <div class="flex flex-row">
            <!-- <div class="mr-6">
              <img
                :src="quote.avatarImage"
                alt="Kisiki Capital Quote Author"
                height="50"
                width="50"
              />
            </div> -->
            <div>
              <div class="font-bold">{{ quote.authorName }}</div>
              <div class="author-title">{{ quote.authorTitle }}</div>
            </div>
          </div>
        </article>
      </div>
    </section>
    <DividerSection />
    <section ref="packagesSection" class="py-24">
      <PackageSection />
    </section>
    <DividerSection />
    <section class="py-24">
      <div class="mb-2 title-lg">Got questions?</div>
      <div>
        Frequently asked questions by various of our current and prospective
        <br />
        customers.
      </div>
      <div class="flex flex-col my-8 space-y-8 lg:px-56">
        <article v-for="faq in faqList" :key="faq.id">
          <DetailsContainer :details="faq" />
        </article>
      </div>
      <div class="mb-4 title-lg">Questions not answered?</div>
      <div>Feel free to shoot us an email at</div>
      <a class="email-title" href="mailto:enquiries@kisikicapital.com">enquiries@kisikicapital.com</a>
    </section>
    <DividerSection />
    <FooterSection @scrollToPackages="scrollToPackages()" />
    <PageScrollTracker @toggle-page-alert="showPageAlert($event)" />
  </main>
</template>

<script setup>
import quoteListData from "~/data/quoteListData.js";
const quoteList = ref(quoteListData);

import faqListData from "~/data/faqListData.js";
const faqList = ref(faqListData);

const packagesSection = ref(null);
function scrollToPackages() {
  packagesSection.value?.scrollIntoView({ behavior: "smooth" });
}

const isPageAlertVisible = ref(true);
function showPageAlert(state) {
  isPageAlertVisible.value = state;
}
</script>

<style scoped>
#hero-section {
  background-image: url("/img/bgs/hero-background.webp");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

.quote-cover {
  overflow-x: auto;
}

.quote-container {
  background-image: var(--gradient3);
  white-space: nowrap;
}

.quote-container img {
  max-width: none;
}

::-webkit-scrollbar {
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background-image: var(--gradient2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: var(--secondary);
}

.author-title {
  color: var(--white-40);
}

.email-title {
  font-size: var(--font-md);
  background-image: var(--gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

#benefits-section article {
  @apply p-8;
  background-image: var(--gradient3);
}

.benefits-title {
  font-family: var(--font-title);
  font-size: var(--font-2xl);
  color: var(--secondary);
  font-weight: bold;
}

.benefits-desc {
  font-size: var(--font-md);
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* For Firefox */
.scrollbar-hide {
  scrollbar-width: none;
}
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
