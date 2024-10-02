<template>
  <Head>
    <Meta charset="UTF-8" />
    <Meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <Title>Kisiki Capital</Title>
    <Meta name="description" content="Kisiki Capital" />
    <Link rel="preconnect" href="https://fonts.googleapis.com" />
    <Link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <Link
      rel="preload"
      href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap"
      as="style"
      onload="this.onload=null;this.rel='stylesheet'"
    />
    <NoScript>
      <Link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap"
      />
    </NoScript>
  </Head>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <NuxtNotifications position="top center" :speed="3000" />
  </div>
</template>

<script setup></script>
