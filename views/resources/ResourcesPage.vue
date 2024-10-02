<template>
  <main id="resources-page" class="px-4 py-5 text-center md:px-6">
    <Navbar />
    <section id="hero-section" class="py-24">
      <div class="mb-6 title-lg-gradient md:max-w-lg md:mx-auto lg:max-w-3xl">
        “Risk comes from not knowing what you are doing”
      </div>
      <div class="md:max-w-md md:mx-auto lg:max-w-3xl">
        Learning resources to ensure that you are up to speed with the
        terminologies and rules of our services and operations
      </div>
    </section>

    <article class="justify-center hidden md:flex">
      <div
        class="flex flex-row px-4 py-3 mt-4 space-x-4 rounded-full btn-tab-container"
      >
        <div v-for="resource in resourcesList" :key="resource">
          <div
            class="px-4 py-2 rounded-full cursor-pointer btn-tab"
            :class="{ active: selectedResourceId == resource.id }"
            @click="selectResource(resource.id)"
          >
            {{ resource.content }}
          </div>
        </div>
      </div>
    </article>

    <article class="my-8 md:hidden">
      <Dropdown
        :list="resourcesList"
        :placeholder="resourcesPlaceholder"
        :is-array-of-objects="true"
        @fillOption="fillOption"
      />
    </article>
    <section v-if="selectedResourceId == 1">
      <article class="mt-8 mb-16">
        <div class="mb-6 md:max-w-lg md:mx-auto lg:max-w-3xl">
          <span class="title-lg-gradient">01</span>
          &nbsp;&nbsp;
          <span class="title-lg-gradient">What is a Prop Firm</span>
        </div>
        <div class="md:max-w-md md:mx-auto lg:max-w-3xl">
          These kinds of businesses permit individual traders to transact using
          the capital of the company. The company typically charges a monthly
          fee for the use of the desk or software platform in exchange for a
          portion of the earnings. The term 'proprietary' denotes that, unlike
          in a regular brokerage, the firm's traders make transactions using the
          firm's money as opposed to client funds. Because the company is
          betting with its own money rather than that of its clients, this
          structure enables it to take on riskier wagers. In order to help
          traders learn about the markets and various trading methods,
          proprietary investment firms frequently provide instructional and
          training resources. These organizations are typically on the lookout
          for traders who can create winning strategies
        </div>
      </article>
      <DividerSection />
      <article class="py-16">
        <div class="mb-8 title-md-gradient">
          Trading with a proprietary company like us <br />
          has the following advantages
        </div>
        <article class="mb-6">
          <div class="mb-1 caption-gradient">Capital Access</div>
          <div>
            When they first begin trading, many traders do not have a
            substantial sum of money to invest. Traders have access to <br />
            substantial amounts of money through the challenge model that they
            would not otherwise be able to trade
          </div>
        </article>
        <article class="mb-6">
          <div class="mb-1 caption-gradient">Risk Reduction</div>
          <div>
            When trading using the firm's funds, the trader does not put their
            own money at risk in the markets. The business takes <br />
            on the loss on unsuccessful trades
          </div>
        </article>
        <article class="mb-6">
          <div class="mb-1 caption-gradient">Profit Sharing</div>
          <div>
            The trader receives a sizeable percentage of the earnings, typically
            between 70% and 90%. For savvy traders, this can <br />
            be a great source of revenue.
          </div>
        </article>
      </article>
    </section>

    <section v-if="selectedResourceId == 2">
      <div class="my-8 md:mx-auto lg:max-w-3xl">
        These rules protect us all. Kindly follow them so you can enjoy the full
        trading experience
      </div>
      <div class="flex flex-col my-8 space-y-8 lg:px-56">
        <article v-for="rule in rulesList" :key="rule.id">
          <DetailsContainer :details="rule" />
        </article>
      </div>
    </section>

    <section v-if="selectedResourceId == 3">
      <div class="flex flex-col my-8 space-y-8 lg:px-56">
        <article v-for="rule in rulesTwoList" :key="rule.id">
          <DetailsContainer :details="rule" />
        </article>
      </div>
    </section>

    <DividerSection />

    <FooterSection @scrollToPackages="scrollToPackages()" />
  </main>
</template>

<script setup>
import rulesListData from "~/data/rulesListData.js";
const rulesList = ref(rulesListData);

import rulesTwoListData from "~/data/rulesTwoListData.js";
const rulesTwoList = ref(rulesTwoListData);

const resourcesList = ref([
  {
    id: "1",
    content: "What is a Prop Firm",
  },
  {
    id: "2",
    content: "Our Rules of Operations",
  },
  {
    id: "3",
    content: "One Phase Challenges",
  },
]);

const selectedResourceId = ref(1);
function selectResource(resourceId) {
  selectedResourceId.value = resourceId;
}

const resourcesPlaceholder = ref("Select Resource");
function fillOption(dropdownEmit) {
  if (dropdownEmit.placeholder == resourcesPlaceholder.value) {
    selectedResourceId.value = dropdownEmit.option.id;
  }
}

const packagesSection = ref(null);
function scrollToPackages() {
  packagesSection.value?.scrollIntoView({ behavior: "smooth" });
}
</script>

<style scoped></style>
