<template>
  <nav class="hidden px-2 fixed top-0 md:w-1/6 md:block">
    <div class="inline-flex items-center p-2 my-4 space-x-2">
      <span>
        <img
          src="/img/logos/logo-mark.webp"
          alt="Kisiki Capital Logo"
          height="20px"
          width="20px"
        />
      </span>
      <span class="hidden font-bold xl:block">KISIKI&nbsp;CAPITAL</span>
    </div>
    <div v-for="sideNav in sideNavs" :key="sideNav.title">
      <div
        class="inline-flex items-center p-2 my-2 rounded-lg sidenav"
        :class="{
          active: activeSideNavId == sideNav.id,
          highlight: sideNav.id == 1,
        }"
        @click="toggleSideNavs(sideNav.id)"
      >
        <span class="inline-flex items-center mr-2" :title="sideNav.title">
          <Icon :name="sideNav.icon" class="w-[25px] h-[25px]" />
        </span>
        <b class="hidden md:block text-nowrap">
          {{ sideNav.title }}
        </b>
      </div>
    </div>
  </nav>
  <article class="flex flex-row items-center px-2 m-2 md:hidden">
    <button
      aria-label="Show or Hide Menu"
      class="md:hidden"
      @click="isMenuOpen = !isMenuOpen"
    >
      <svg
        class="w-6 h-6"
        aria-hidden="true"
        fill="#fff"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clip-rule="evenodd"
          fill-rule="evenodd"
          d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
        ></path>
      </svg>
    </button>
    <div class="inline-flex items-center p-2 space-x-2">
      <span>
        <img
          src="/img/logos/logo-mark.webp"
          alt="Kisiki Capital Logo"
          height="20px"
          width="20px"
        />
      </span>
      <span class="font-bold">KISIKI&nbsp;CAPITAL</span>
    </div>
  </article>
  <nav
    class="fixed left-0 z-40 w-64 h-screen py-4 md:hidden"
    :class="isMenuOpen ? 'flex' : 'hidden'"
  >
    <div
      class="flex-col items-center h-full px-3 py-4 space-y-4 overflow-y-auto md:flex mobile-sidenav"
    >
      <div v-for="sideNav in sideNavs" :key="sideNav.title">
        <div
          class="inline-flex items-center p-2 my-2 rounded-lg sidenav"
          :class="{
            active: activeSideNavId == sideNav.id,
            highlight: sideNav.id == 1,
          }"
          @click="toggleSideNavs(sideNav.id, true)"
        >
          <span class="inline-flex items-center mr-2" :title="sideNav.title">
            <Icon :name="sideNav.icon" class="w-[25px] h-[25px]" />
          </span>
          <b class="text-nowrap">
            {{ sideNav.title }}
          </b>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import feathersClient from "./../lib/feathersRestClient";
const { externalApiUrl } = useRuntimeConfig().public;
const feathers = feathersClient(externalApiUrl);

import useSideNavStore from "~/store/modules/sideNavStore";
const sideNavStore = useSideNavStore();
const sideNavs = ref(sideNavStore.sideNavListState);
const activeSideNavId = ref(sideNavStore.activeSideNavIdState);

const isMenuOpen = ref(false);
async function toggleSideNavs(sideNavId, isMobileSideNav = false) {
  if (sideNavId === "4") {
    await feathers.logout();
    navigateTo("/login");
  }

  activeSideNavId.value = sideNavId;
  sideNavStore.setSideNavId(sideNavId);
  if (isMobileSideNav) {
    isMenuOpen.value = false;
  }
}
</script>

<style scoped>
.mobile-sidenav {
  background-color: var(--dblack);
}
.sidenav {
  width: 100%;
  cursor: pointer;
  color: var(--dgrey-100);
}

.sidenav:hover,
.sidenav.active {
  background-color: var(--dprimary);
  color: var(--white);
}

.sidenav.highlight .iconify {
  color: var(--dprimary);
}

.sidenav.highlight:hover .iconify,
.sidenav.highlight.active .iconify {
  color: var(--white);
}
</style>
