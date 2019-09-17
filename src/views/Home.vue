<template lang="pug">
  .home
    .container
      .row
        .col-md-8.col-sm-12.offset-md-2
          h1.mt-4.text-center Bored App

      .row
        .col-md-8.col-sm-12.offset-md-2
          b-tabs.mt-5(content-class='')
            b-tab.border.border-top-0.p-2.pt-5(title='Activity' active)
              Activity
            b-tab.border.border-top-0.p-2.pt-5(title='My List')
              List
</template>

<script>

  import Activity from '@/components/Activity.vue';
  import List from '@/components/List.vue';

  export default {
    name: 'home',
    components: {
      Activity,
      List
    }
  }
</script>
