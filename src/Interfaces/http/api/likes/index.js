const LikesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'likes',
  register: async (server, { injections }) => {
    const likesHandler = new LikesHandler(injections);
    server.route(routes(likesHandler));
  },
};
