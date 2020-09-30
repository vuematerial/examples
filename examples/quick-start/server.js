import feathers from "@feathersjs/feathers";
import { softDelete } from "feathers-hooks-common";
import ls from "feathers-localstorage";
import mem from "feathers-memory";

// #################### Isomorphic Server ####################
const app = feathers();

try {
  app.use("todos", ls({ storage: window.localStorage }));
} catch (e) {
  app.use("todos", mem()); // Third party coolies used.
}

const todoService = app.service("todos"); // Get the service we registered above
todoService.hooks({
  before: {
    // hook to add flare before saving
    all: softDelete()
  }
});
async function addBuiltInTodo(query) {
  // server-side built-in todo
  const list = await todoService.find({ query });
  if (list.length === 0) {
    todoService.create({ name: `${query.name}` });
  }
}
addBuiltInTodo({ name: "Learn feathers-vuex", $disableSoftDelete: true });
setInterval(() => addBuiltInTodo({ name: "Breath" }), 10000);

export default () => app; // making this server look normal
