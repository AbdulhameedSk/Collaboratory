const express = require("express");
const {
  getAllprojectsController,
  createprojectController,
  updateprojectController,
  getprojectById,
  deleteprojectController,
  userprojectController,
} = require("../controller/projectController");
const router = express.Router();

router.get("/all-projects", getAllprojectsController);
router.post("/create-project", createprojectController);
router.put("/update-project/:id", updateprojectController);
router.get("/get-project/:id", getprojectById);
router.delete("/delete-project/:id", deleteprojectController);
router.get("/user-project/:id", userprojectController);
module.exports = router;
