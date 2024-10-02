<template>
    <div class="flex items-center justify-between px-6 py-4 bg-gray-100 rounded shadow">
        <div class="flex flex-col gap-4 md:flex-row">
            <img src="/img/icons/header-icon.svg" alt="" width="28" height="28" />
            <div>
                <slot></slot>
            </div>
        </div>
        <nuxt-link to="/"
            class="flex items-center gap-1 px-3 py-1 text-gray-800 underline rounded hover:text-sky-blue">
            <Icon name="material-symbols:home-outline" size="20" />
            <span>Home</span>
        </nuxt-link>
    </div>
</template>
