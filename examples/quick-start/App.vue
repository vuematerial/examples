<template>
  <div class="root">
    <form @submit.prevent="create({ name: name.pop() })">
      <md-card>
        <md-card-content>
          <md-field>
            <md-input v-model="name[0]"></md-input>
            <label>Create New To-do: {{name[0]}}</label>
          </md-field>
        </md-card-content>
        <md-card-actions>
          <md-button type="submit" :disabled="! name[0]" class="md-primary">Create</md-button>
        </md-card-actions>
      </md-card>
    </form>

    <md-content class="list">
      <form v-for="todo in todos().data" :key="todo.id" @submit.prevent="remove(todo.id)">
        <md-card md-with-hover :title="todo.id">
          <md-card-header>
            <div class="md-title">{{ todo.name }}</div>
          </md-card-header>
          <md-card-actions>
            <md-button class="md-primary" type="submit">Done</md-button>
          </md-card-actions>
        </md-card>
      </form>
    </md-content>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return { name: [''] }
  },
  computed: { // only getters have live queries
    ...mapGetters('todos', {todos: 'find'})
  },
  methods: {
    ...mapActions('todos', ['create', 'remove', 'find'])
  },
  created: async function () {
    await this.find()
  }
}
</script>

<style lang="scss" scoped>
.root > form { padding: 5px; background: url('http://bit.ly/2LPV0uo'); }
.root > form > .md-card { margin: auto; width: 320px; }
.list > form { display: inline-block; margin: 8px; margin-right: 0; }
.list > form > .md-card { width: 320px; }
</style>
