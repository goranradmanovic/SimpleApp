<template lang="pug">

  .row
    b-modal(id='saving-modal' centered title="Data is saved" size='sm' ok-only @ok='getAPIData(defaultApiLink)') Your selection is saved!
    b-modal(id='error-modal' centered title="Error" size='md' ok-only @ok='getAPIData(defaultApiLink)')
      p ERROR!!! PLEASE TRY AGAIN!
      p {{ this.errorMessage }}

    .col-md-7.col-sm-12
      h2.mb-4 You should:
      b-form-textarea#textarea-no-resize.p-2.activity__textarea.border.font-weight-bold.font-italic.text-secondary(placeholder='Random text' rows='9' no-resize plaintext :value="randomText")
      b-spinner.ml-3.textarea__spinner(label='Loading...' variant='primary' v-if='loading')

      b-form-group.mt-3
        b-button(variant='success' block @click='saveCurrentActivity()') Save for later

    .col-md-5.col-sm-12
      h2.mb-4 Activity details:

      b-form-group#fieldset-1(label='Type' label-for='select-1')
        b-form-select#select-1.text-capitalize(v-model='selected' :options='options' ref='selectBox' @change='getType()')

      b-form-group#fieldset-2.mt-3(v-model='participants' label='Participants' label-for='input-1')
        b-form-input#input-1(v-model='participants' trim placeholder='Enter number of participants' @input='getParticipants()' ref='inputField')

      b-form-group#fieldset-3.mt-3(label='Budget' label-for='range-1')
        b-form-input#range-1(v-model='rangeValue' type='range' min='0' max='10' ref='rangeField' @change='getBudget()')
        .d-flex.justify-content-between
          small.text-secondary cheap
          small.text-secondary expensive

      b-form-group
        b-button(variant='primary' block @click='getAPIData(apiLink), resetDisabledFormFileds()') Hit me with a new one!
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
        options: [
          {value: 'education', text: 'Education'},
          {value: 'recreational', text: 'Recreational'},
          {value: 'social', text: 'Social'},
          {value: 'diy', text: 'Diy'},
          {value: 'charity', text: 'Charity'},
          {value: 'cooking', text: 'Cooking'},
          {value: 'relaxation', text: 'Relaxation'},
          {value: 'music', text: 'Music'},
          {value: 'busywork', text: 'Busywork'},
        ],
        responseData: null,
        storeData: null,
        loading: false,
        defaultApiLink: 'https://www.boredapi.com/api/activity/', //DEFAULT api link
        apiLink: 'https://www.boredapi.com/api/activity/', //Initial api link
        errorMessage: ''
      }
    },

    methods: {

       async getAPIData(url) {
         this.loading = true;

         //Fetch the API
         let response = await fetch(url);

         //If response is 404
         if (response.status == 404) {
           this.$bvModal.show('error-modal');
         }

         //Get JSON data
         this.responseData = await response.json();

         //If there is no data from API call
         if (this.responseData.error) {
           this.errorMessage = this.responseData.error; //Set the message
           this.$bvModal.show('error-modal'); //Show error modal
         }

         //Set the Activity data
         this.setActivityData(this.responseData);

         //Set data for storing
         this.setStoreData(this.responseData);

         this.loading = false;
       },

       setActivityData(data) {
         //Set Activiy page data
         this.randomText = data.activity;
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
           budget: ((data.price * 10) < 5) ? 'cheap' : 'expensive'
         }
       },

       saveCurrentActivity() {
         this.$bvModal.show('saving-modal');
         //Send data to the vuex store
         this.$store.dispatch('getPersistedData', this.storeData);
         this.$bvModal.hide('saving-modal');
       },

       //API - Get type of activity
       getType() {
         //Disable other form fileds
         let formEl = document.querySelectorAll('#input-1, #range-1');
         formEl[0].disabled = true;
         formEl[1].disabled = true;

         //Create new API link
         this.apiLink = `https://www.boredapi.com/api/activity?type=${this.selected}`;
       },

       //API - Get participants of activity
       getParticipants() {
         //Disable other form fileds
         let formEl = document.querySelectorAll('#select-1, #range-1');
         formEl[0].disabled = true;
         formEl[1].disabled = true;

         //Create new API link
         this.apiLink = `https://www.boredapi.com/api/activity?participants=${this.participants}`;
       },

       //API - Get budget of activity
       getBudget() {
         //Get form fileds
         let formEl = document.querySelectorAll('#select-1, #input-1'),
             formatedRangeValue = this.rangeValue / 10; //Range from 0.0 - 1 (this.rangeValue is whole number 0 - 10)

         //Disable other form fileds
         formEl[0].disabled = true;
         formEl[1].disabled = true;

         //Create new API link
         this.apiLink = `https://www.boredapi.com/api/activity?price=${formatedRangeValue}`;
       },

       resetDisabledFormFileds() {
         let formEl = document.querySelectorAll('#select-1, #input-1, #range-1');
         //Undisable other form fileds
         formEl[0].disabled = false;
         formEl[1].disabled = false;
         formEl[2].disabled = false;
       }
    },

    created() {
      //Initial request for random activity data
      this.getAPIData(this.defaultApiLink);
    }
  }
</script>
