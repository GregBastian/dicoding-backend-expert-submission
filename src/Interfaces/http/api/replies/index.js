const RepliesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'replies',
  register: async (server, { injections }) => {
    const repliesHandler = new RepliesHandler(injections);
    server.route(routes(repliesHandler));
  },
};
