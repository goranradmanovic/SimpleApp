<template lang="pug">
  .list
    .row
      b-modal(id='deletedrow-modal' centered title="Deleted" size='sm' ok-only @ok='') Item has been deleted!
      b-modal(id='deletedall-modal' centered title="Deleted" size='sm' ok-only @ok='') All data has been deleted!

      .col-md-12.col-sm-12
        b-table(striped hover responsive :items='liveTableData' :fields='fields')
          template(v-slot:cell(id)='data') {{ data.index + 1 }}

          template(v-slot:cell(budget)='data') {{ data.value }}
            img.tablecell__img(src='../assets/images/icons/verified.svg' alt='Veriried image')

          template(v-slot:cell(delete)='data')
            b-button(variant='danger' small @click='deleteRow($event)' :data-id='data.item.key') Delete

          template(v-slot:table-caption v-if='dataLenght == 0') There is no data
    .row
      .col-md-12.col-sm-12
        b-button.mt-3.mb-3(variant='danger' block @click='deleteAllData()') Clear All
</template>

<script>
export default {
  name: 'list',
  data() {
    return {
      fields: ['id', 'activity', 'participants', 'budget', 'delete'],
    }
  },

  methods: {
    //Delete one row
    deleteRow(event) {
      this.$bvModal.show('deletedrow-modal');
      this.$store.dispatch('deleteSinglePersistedData', event.target.dataset.id);
    },

    //Delete all rows
    deleteAllData() {
      this.$bvModal.show('deletedall-modal');
      this.$store.dispatch('deleteAllPersistedData');
      this.items = [];
    }
  },

  computed: {
    //Watch for changes in stored data
    liveTableData() {
      return this.$store.getters.presistantData;
    },

    //Get array lenght of stored data
    dataLenght() {
      return this.$store.getters.presistantData.length;
    }
  }
}
</script>
