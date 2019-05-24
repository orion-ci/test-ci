<template>
  <div>
    <i-header></i-header>
    <div class="main-body">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  import iHeader from './../components/header'
  export default {
    components: {
      iHeader
    }
  }
</script>
<style>
  .main-body{
    width: 1200px;
    margin: 0 auto;
  }
</style>
