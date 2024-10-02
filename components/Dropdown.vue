<template>
  <main>
    <div class="dropdown">
      <div
        :class="{
          'dropdown-select-dashboard': isDashboard,
          'dropdown-select-filter': isFilter,
          'dropdown-select': !isDashboard && !isFilter,
          active: isDropdownOpen,
        }"
        @click="toggleDropdown"
      >
        <span v-show="isFilter">
          <Icon
            name="material-symbols:filter-alt-outline"
            class="w-[24px] h-[24px]"
          />
        </span>
        <span>{{ currentOption || placeholder }}</span>
        <span class="arrow" :class="{ up: isDropdownOpen }">
          <img
            src="/img/icons/arrow.webp"
            alt="Kisiki Capital"
            height="24"
            width="24"
          />
        </span>
      </div>
      <div v-if="isDropdownOpen" class="dropdown-options">
        <div
          :class="{
            'dropdown-option-dashboard': isDashboard,
            'dropdown-option': !isDashboard,
          }"
          v-if="isArrayOfObjects"
          v-for="(option, optionIndex) in list"
          :key="option.id"
          @click="selectOption(option, optionIndex)"
        >
          {{ option.content }}
        </div>
        <div
          class="dropdown-option"
          :class="{ dashboard: isDashboard }"
          v-else
          v-for="(option, optionIndex) in list"
          :key="option"
          @click="selectOption(option, optionIndex)"
        >
          {{ option }}
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
const props = defineProps({
  list: Array,
  placeholder: String,
  isArrayOfObjects: {
    type: Boolean,
    required: false,
    default: false,
  },
  isFilter: {
    type: Boolean,
    required: false,
    default: false,
  },
  isDashboard: {
    type: Boolean,
    required: false,
  },
});
const isDropdownOpen = ref(false);
const currentOption = ref(null);
function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

const emit = defineEmits(["fillOption"]);
function selectOption(option, optionIndex) {
  currentOption.value = props.isArrayOfObjects ? option.content : option;
  isDropdownOpen.value = false;
  emit("fillOption", {
    placeholder: props.placeholder,
    option: option,
    optionIndex: optionIndex,
  });
}
</script>

<style scoped>
.dropdown {
  position: relative;
}

.dropdown-select,
.dropdown-select-dashboard,
.dropdown-option-dashboard,
.dropdown-select-filter {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  @apply w-full px-4 appearance-none;
  color: var(--white-70);
}

.dropdown-select,
.dropdown-select-dashboard {
  @apply py-6;
}

.dropdown-select-dashboard,
.dropdown-select-filter {
  border: 1px solid var(--dtertiary);
}

.dropdown-select:hover,
.dropdown-select.active,
.dropdown-select-dashboard:hover,
.dropdown-select-dashboard.active,
.dropdown-select-filter:hover,
.dropdown-select-filter.active {
  border: 1px solid var(--secondary);
}

.dropdown-select {
  background: var(--gradient3);
  border: 1px solid;
  border-image: var(--gradient2) 1;
}

.dropdown-select-filter {
  @apply py-2;
}

.dropdown-select-dashboard,
.dropdown-select-filter,
.dropdown-option-dashboard {
  background-color: var(--dgrey-400);
}

.dropdown-option,
.dropdown-option-dashboard {
  padding: 10px;
  cursor: pointer;
}

.dropdown-option:hover,
.dropdown-option-dashboard:hover {
  background-color: var(--primary);
}

.arrow {
  transition: transform 0.2s;
}

.arrow.up {
  transform: rotate(180deg);
}

.iconify {
  color: var(--dgrey-100);
}

.dropdown-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: var(--black);
  border: 1px solid;
  border-image: var(--gradient2) 1;
  z-index: 10;
  max-height: 150px;
  overflow-y: auto;
}
</style>
