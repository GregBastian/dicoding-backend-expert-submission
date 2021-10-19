/* istanbul ignore file */

// internal js modules
const date = Date;

// external agency
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
const pool = require('./database/postgres/pool');

// service (repository, helper, manager, etc)
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');
const ThreadRepositoryPostgres = require('./repository/ThreadRepositoryPostgres');
const CommentRepositoryPostgres = require('./repository/CommentRepositoryPostgres');
const ReplyRepositoryPostgres = require('./repository/ReplyRepositoryPostgres');
const LikeRepositoryPostgres = require('./repository/LikeRepositoryPostgres');
const BcryptEncryptionHelper = require('./security/BcryptEncryptionHelper');
const JwtTokenManager = require('./security/JwtTokenManager');

// use case
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase');
const LoginUserUseCase = require('../Applications/use_case/LoginUserUseCase');
const RefreshAuthenticationUseCase = require('../Applications/use_case/RefreshAuthenticationUseCase');
const LogoutUserUseCase = require('../Applications/use_case/LogoutUserUseCase');
const AddthreadUseCase = require('../Applications/use_case/AddThreadUseCase');
const AddCommentUseCase = require('../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../Applications/use_case/DeleteCommentUseCase');
const GetThreadUseCase = require('../Applications/use_case/GetThreadUseCase');
const AddReplyUseCase = require('../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../Applications/use_case/DeleteReplyUseCase');
const AddLikeUseCase = require('../Applications/use_case/AddLikeUseCase');

const serviceInstanceContainer = {
  userRepository: new UserRepositoryPostgres(pool, nanoid),
  authenticationRepository: new AuthenticationRepositoryPostgres(pool),
  encryptionHelper: new BcryptEncryptionHelper(bcrypt),
  authenticationTokenManager: new JwtTokenManager(Jwt.token),
  threadRepository: new ThreadRepositoryPostgres(pool, nanoid, date),
  commentRepository: new CommentRepositoryPostgres(pool, nanoid, date),
  replyRepository: new ReplyRepositoryPostgres(pool, nanoid, date),
  likeRepository: new LikeRepositoryPostgres(pool, nanoid),
};

const useCaseInstanceContainer = {
  addUserUseCase: new AddUserUseCase({
    userRepository: serviceInstanceContainer.userRepository,
    encryptionHelper: serviceInstanceContainer.encryptionHelper,
  }),
  loginUserUseCase: new LoginUserUseCase({
    authenticationRepository: serviceInstanceContainer.authenticationRepository,
    authenticationTokenManager: serviceInstanceContainer.authenticationTokenManager,
    userRepository: serviceInstanceContainer.userRepository,
    encryptionHelper: serviceInstanceContainer.encryptionHelper,
  }),
  refreshAuthenticationUseCase: new RefreshAuthenticationUseCase({
    authenticationRepository: serviceInstanceContainer.authenticationRepository,
    authenticationTokenManager: serviceInstanceContainer.authenticationTokenManager,
  }),
  logoutUserUseCase: new LogoutUserUseCase({
    authenticationRepository: serviceInstanceContainer.authenticationRepository,
  }),
  addThreadUseCase: new AddthreadUseCase({
    threadRepository: serviceInstanceContainer.threadRepository,
    authenticationTokenManager: serviceInstanceContainer.authenticationTokenManager,
  }),
  addCommentUseCase: new AddCommentUseCase({
    threadRepository: serviceInstanceContainer.threadRepository,
    commentRepository: serviceInstanceContainer.commentRepository,
    authenticationTokenManager: serviceInstanceContainer.authenticationTokenManager,
  }),
  deleteCommentUseCase: new DeleteCommentUseCase({
    commentRepository: serviceInstanceContainer.commentRepository,
    authenticationTokenManager: serviceInstanceContainer.authenticationTokenManager,
  }),
  getThreadUseCase: new GetThreadUseCase({
    threadRepository: serviceInstanceContainer.threadRepository,
    commentRepository: serviceInstanceContainer.commentRepository,
    likeRepository: serviceInstanceContainer.likeRepository,
  }),
  addReplyUseCase: new AddReplyUseCase({
    threadRepository: serviceInstanceContainer.threadRepository,
    commentRepository: serviceInstanceContainer.commentRepository,
    replyRepository: serviceInstanceContainer.replyRepository,
    authenticationTokenManager: serviceInstanceContainer.authenticationTokenManager,
  }),
  deleteReplyUseCase: new DeleteReplyUseCase({
    replyRepository: serviceInstanceContainer.replyRepository,
    authenticationTokenManager: serviceInstanceContainer.authenticationTokenManager,
  }),
  addLikeUseCase: new AddLikeUseCase({
    commentRepository: serviceInstanceContainer.commentRepository,
    likeRepository: serviceInstanceContainer.likeRepository,
    authenticationTokenManager: serviceInstanceContainer.authenticationTokenManager,
  }),
};

// export all instance
module.exports = {
  ...serviceInstanceContainer,
  ...useCaseInstanceContainer,
};
