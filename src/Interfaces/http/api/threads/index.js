const ThreadsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'threads',
  register: async (server, { injections }) => {
    const threadsHandler = new ThreadsHandler(injections);
    server.route(routes(threadsHandler));
  },
};
