<template>
  <div class="min-h-screen flex flex-col bg-slate-50 text-slate-800">
    <Navbar />
    <main class="flex-1">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
</script>
