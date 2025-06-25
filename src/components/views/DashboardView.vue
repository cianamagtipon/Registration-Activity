/*BASIC DESCRIPTION: The main view page for Dashboard. you can import the components here.*/

<!---------- SCRIPTS ---------->

<script setup>
import TheDashboard from '../TheDashboard.vue'
</script>

<!---------- TEMPLATES ---------->

<template>
  <main>
    <TheDashboard />
  </main>
</template>

<!---------- STYLES ---------->

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
