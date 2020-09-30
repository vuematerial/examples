How this works
==============

See readme for docs and community information https://github.com/Feathers-plus/Feathers-vuex

Report issues with demo at https://gitlab.com/FossPrime/feathers-vuex-quick-start/

# FrontEnd #

- index.html - Not much here, just a normal mount point for the main vue component
- index.js - First js file to be loaded, initializes vue and vuex
- store.js - 
  - Similar in function to a vuex store module
  - passes the Feathers client to FeathersVuex, which then makes vuex plugins based on the store
    - These can be easily extended with aditional vuex functionality, learn vuex First
    - 'id' is the default `id`, but in many projects this will be `_id`
      - Other options that apply to all services can be passed here
    - `service('todos', {})` this creates a vuex service that connects with the `todos` service in Feathers
      - vuex customizations among other parameters may be passed aswell

- App.js (Template)
  - `form` when submiting fields it is recomended to wrap it in a form, for accessibility and tab indexing
  - `@submit.prevent="create({ name: name.pop() })"`
    - use the mapped FeathersVuex, vuex action, `create` to create one item, and clear it
  - `md-button` triggers the `v-on:submit` event, disabled when value evaluates to false
  - `v-for="todo in todos().data"` creates new form for each item 
    - Result come from the FeathersVuex `find` vuex getter
    - Results are paginated, actual items are in the data property
    - Results are live and reactive to changes emitted from the Feathers server via sockets
      - Feathers is the first to recieve them, before passing on to FeathersVuex [1]
  `@submit.prevent="remove(todo.id)"` calls the remove hook in the feathers server
    - the method is provided by FeathersVuex as a vuex action

- App.js (Script)
  - `import { mapActions, mapGetters } from 'vuex'` get the vuex actions and getters mappers
    - You could also use vuex dispatch https://vuex.vuejs.org/guide/getters.html
  - `mapGetters` takes params in many forms, should be used in computed
  - `mapActions` map the vuex actions created by FeathersVuex
    - This can also load custom ones
    - create, remove and find all correspond to Feathers hooks
      - find and patch in particular use a slightly different api then feathers, see docs
  - `await this.find()` populate the in store cache with records, 
    - await is unnecesary in this simple case, the find getter will update when the data arrives

# "BackEnd" #

This actually runs on the browser and pretends to be a typical Feathers server.

[1] Even though we don't have a socket connection open on our Feathers client, Feathers is actually isomorphic.
Most of the features that work on the server work on the client, including hooks and most of the plugins.
In this case we are using the LocalStorage database plugin to save the Feathers server data models in the browser.
NeDB also supports this feature and uses a MongoDB like API.

- `softDelete`: a common hook that adds a `deleted: true` property to deleted records, 
  - instead of deleting outright
- `localstorage`: this is our browser side replacement for MongoDB, Sequelize, etc feathers db adapters
  - You can see the data under the browsers inspector
    - for Chromium this is `Inspect > Application > Storage > Local Storage`
- `app.use('todos', localstorage({ storage: window.localStorage }))`
  - Setup our Feathers service, use the localStorage adapter as the model
- `all: softDelete()`: Add the softDelete hook to all hooks
  - These hooks could also be used to validate and timestamp data as it comes in from the client
    - https://docs.feathersjs.com/api/hooks.html
- `addBuiltInTodo(query)`: add some todo's "server" side
  - the events emitted on the server would be recieved by feathers on the client socket
    - Operating practically the same as if we had a real server socket connection open
    - To get a better sense of what's happening checkout the websockets frame inspector on the chat example
  - `todoService.find({ query })`: Call the Feathers service find hook
  - If no duplicates* were found create the todo
- `$disableSoftDelete`: bypasses SoftDelete and shows all records, deleted or not
  - Has the effect of adding that message only once
- `setInterval`: add `Breath` as a todo, every 10 seconds, no active duplicates
- `default () => app` pass this on to FeathersVuex
  - Similar to a normal Feathers client with a socket connected to the server
