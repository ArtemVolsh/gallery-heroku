const News = require("../Models/News");
const Exhibition = require("../Models/Exhibition");
const Excursion = require("../Models/Excursion");

class requestedPostsController {
  updateApprovalNews = async (req, res, next) => {
    try {
      const { id, status } = req.body;

      const updateCandidate = await News.findByIdAndUpdate(
        id,
        {
          approvalStatus: status,
        },
        { new: true }
      );
      console.log("REQUESTED CTRL LOG " + id + " " + status);
      console.log(updateCandidate);
      return res.json(updateCandidate);
    } catch (e) {
      console.log(e);
      next(e);
    }
  };
  updateApprovalExhibitions = async (req, res, next) => {
    try {
      const { id, status } = req.body;

      const updateCandidate = await Exhibition.findByIdAndUpdate(
        id,
        {
          approvalStatus: status,
        },
        { new: true }
      );
      console.log("REQUESTED CTRL LOG " + id + " " + status);
      console.log(updateCandidate);
      return res.json(updateCandidate);
    } catch (e) {
      console.log(e);
      next(e);
    }
  };
  updateApprovalExcursions = async (req, res, next) => {
    try {
      const { id, status } = req.body;

      const updateCandidate = await Excursion.findByIdAndUpdate(
        id,
        {
          approvalStatus: status,
        },
        { new: true }
      );
      console.log("REQUESTED CTRL LOG " + id + " " + status);
      console.log(updateCandidate);
      return res.json(updateCandidate);
    } catch (e) {
      console.log(e);
      next(e);
    }
  };
}

module.exports = new requestedPostsController();
