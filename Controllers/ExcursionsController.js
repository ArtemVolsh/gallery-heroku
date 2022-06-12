const Excursion = require("../Models/Excursion");
const Excursions = require("../Models/Excursion");

class ExcursionsController {
  getAllExcursions = async (req, res, next) => {
    let query;

    const reqQuery = { ...req.query };

    const removeFields = ["sort"];

    removeFields.forEach((value) => delete reqQuery[value]);

    let queryString = JSON.stringify(reqQuery);

    queryString = queryString.replace(
      /\b(gt|gte|lt|lte|in|regex|eq)\b/g,
      (match) => `$${match}`
    );

    let parsedString = JSON.parse(queryString);

    for (let [key, value] of Object.entries(parsedString)) {
      if (parsedString[key].hasOwnProperty("$regex")) {
        parsedString[key] = { ...parsedString[key], $options: "i" };
      }
    }

    const excs = await Excursions.find(parsedString);

    res.status(200).json({
      success: true,
      data: excs,
    });
  };

  createExcursion = async (req, res, next) => {
    const { excursion } = req.body;
    const excs = await Excursions.create(excursion);

    res.status(201).json({
      success: true,
      data: excs,
    });
  };

  getExcursionById = async (req, res, next) => {
		const { id } = req.body.id

    const excs = await Excursion.findById(id);

    res.status(201).json({
      success: true,
      data: excs,
    });
  };
}

module.exports = new ExcursionsController();
