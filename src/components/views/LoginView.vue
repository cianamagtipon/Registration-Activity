/*BASIC DESCRIPTION: The main view page for login. you can import the components
here.*/

<!---------- SCRIPTS ---------->

<script setup>
import TheLogin from '../TheLogin.vue'
import vector from '@/assets/background/vector.png'
import outerEllipse from '@/assets/background/outerEllipse.png'
import middleEllipse from '@/assets/background/middleEllipse.png'
import innerEllipse from '@/assets/background/innerEllipse.png'
</script>

<!---------- TEMPLATES ---------->

<template>
  <main class="login-bg">
    <img :src="vector" class="vector" />
    <img :src="outerEllipse" class="outerEllipse" />
    <img :src="middleEllipse" class="middleEllipse" />
    <img :src="innerEllipse" class="innerEllipse" />

    <!-- Login form -->
    <TheLogin />
  </main>
</template>

<!---------- STYLES ---------->

<style scoped>
.vector {
  position: absolute;
  top: 15px;
  right: 0;
  width: 70%;
  height: auto;
  object-fit: cover;
  z-index: 0;
  pointer-events: none;
}

.outerEllipse {
  position: absolute;
  bottom: -15px;
  left: 0;
  width: 40%;
  height: auto;
  object-fit: cover;
  z-index: 0;
  pointer-events: none;
}

.middleEllipse {
  position: absolute;
  bottom: -15px;
  left: 0;
  width: 30%;
  height: auto;
  object-fit: cover;
  z-index: 1;
  pointer-events: none;
}

.innerEllipse {
  position: absolute;
  bottom: -15px;
  left: 0;
  width: 20%;
  height: auto;
  object-fit: cover;
  z-index: 2;
  pointer-events: none;
}
</style>
