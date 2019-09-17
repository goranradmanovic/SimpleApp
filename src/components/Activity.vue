<template lang="pug">

  .row
    b-modal(id='saving-modal' centered title="Data is saved" size='sm' ok-only @ok='getRandomActivity()') Your selection is saved!
    b-modal(id='error-modal' centered title="Error" size='sm' ok-only @ok='getRandomActivity()') ERROR!!! PLEASE TRY AGAIN!

    .col-md-7.col-sm-12
      h2.mb-4 You should:
      b-form-textarea#textarea-no-resize.p-2.activity__textarea.border.font-weight-bold.font-italic.text-secondary(placeholder='Random text' rows='9' no-resize plaintext :value="randomText")
      b-spinner.ml-3.textarea__spinner(label='Loading...' variant='primary' v-if='loading')

      b-form-group.mt-3
        b-button(variant='success' block @click='saveCurrentActivity()') Save for later

    .col-md-5.col-sm-12
      h2.mb-4 Activity details:

      b-form-group#fieldset-1(label='Type' label-for='input-1')
        b-form-select#input-1.text-capitalize(v-model='selected' :options='options' disabled)

      b-form-group#fieldset-2.mt-3(v-model='participants' label='Participants' label-for='input-2')
        b-form-input#input-2(v-model='participants' trim placeholder='Enter number of participants' readonly)

      b-form-group#fieldset-3.mt-3(label='Budget' label-for='range-1')
        b-form-input#range-1(v-model='rangeValue' type='range' min='0' max='5' disabled)
        .d-flex.justify-content-between
          small.text-secondary cheap
          small.text-secondary expensive

      b-form-group
        b-button(variant='primary' block @click='getRandomActivity()') Hit me with a new one!
          b-spinner.ml-3(small label='Loading...' v-if='loading')
</template>

<script>
  export default {
    name: 'activity',
    data() {
      return {
        randomText: '',
        participants: '',
        rangeValue: '0',
        selected: null,
        options: [{value: 'hello', text: 'World'}],
        responseData: null,
        storeData: null,
        loading: false
      }
    },

    methods: {

       async getRandomActivity() {
         this.loading = true;

         //Fetch the API
         let response = await fetch('http://www.boredapi.com/api/activity/');

         //If response is 404
         if (response.status == 404) {
           this.$bvModal.show('error-modal');
         }

         //Get JSON data
         this.responseData = await response.json();

         //Set the Activity data
         this.setActivityData(this.responseData);

         //Set data for storing
         this.setStoreData(this.responseData);

         this.loading = false;
       },

       setActivityData(data) {
         //Set Activiy page data
         this.randomText = data.activity;
         this.options.push({value: data.type, text: data.type});
         this.selected = data.type;
         this.participants = data.participants;
         this.rangeValue = data.price * 10;
       },

       setStoreData(data) {
         //Object data for permanent storing
         this.storeData = {
           key: data.key,
           activity: data.activity,
           participants: data.participants,
           budget: (data.price * 10 < 3) ? 'cheap' : 'expensive'
         }
       },

       saveCurrentActivity() {
         this.$bvModal.show('saving-modal');
         //Send data to the vuex store
         this.$store.dispatch('getPersistedData', this.storeData);
         this.$bvModal.hide('saving-modal');
       }
    },

    created() {
      this.getRandomActivity();
    }
  }
</script>
