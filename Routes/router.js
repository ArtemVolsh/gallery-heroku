const express = require("express");
const NewsController = require("../Controllers/NewsController");
const ExhibitionsController = require("../Controllers/ExhibitionsController");
const AuthenticationController = require("../Controllers/AuthenticationController");
const ExcursionsController = require("../Controllers/ExcursionsController");
const authMiddleware = require("../middlewares/auth");
const RequestedPostsController = require("../Controllers/RequestedPostsController");
const router = express.Router();

router
  .route("/news")
  .get(NewsController.getAllNews)
  .post(NewsController.createNews);
router
  .route("/exhibitions")
  .get(ExhibitionsController.getAllExhibitions)
  .post(ExhibitionsController.createExhibition);
router
  .route("/excursions")
  .get(ExcursionsController.getAllExcursions)
  .post(ExcursionsController.createExcursion);

router.route("/excursions/:id").post(ExcursionsController.getExcursionById);
router.route("/exhibitions/:id").post(ExhibitionsController.getExhibitionById);
router.route("/news/:id").post(NewsController.getNewsById);

router
  .route("/requestedPosts/news")
  .patch(authMiddleware, RequestedPostsController.updateApprovalNews);
router
  .route("/requestedPosts/exhibitions")
  .patch(authMiddleware, RequestedPostsController.updateApprovalExhibitions);
router
  .route("/requestedPosts/excursions")
  .patch(authMiddleware, RequestedPostsController.updateApprovalExcursions);

router.route("/registration").post(AuthenticationController.registration);
router.route("/users").post(AuthenticationController.getUserById);
router.route("/refresh").get(AuthenticationController.refresh);
router.route("/login").post(AuthenticationController.login);

module.exports = router;
