const mongoose = require("mongoose");
const projectModel = require("../models/projectModel.js");
const userModel = require("../models/userModel.js");
exports.getAllprojectsController = async (req, res) => {
  try {
    const projects = await projectModel.find({}).populate("user");
    if (!projects || projects.length === 0) {
      return res.status(200).send({
        success: true,
        msg: "No projects Till Now",
      });
    }
    return res.status(200).send({
      success: true,
      msg: "GOT",
      projectCount: projects.length,
      projects,
    });
  } catch (error) {
    return res.status(404).send({
      success: false,
      msg: "ERROR WHILE GETTING PROJECTS",
      error: error.message,
    });
  }
};
exports.createprojectController = async (req, res) => {
  try {
    const { title, description, image, user } = req.body;
    if (!title || !description || !user) {
      return res.status(400).send({
        msg: "Please fill title, description, and user",
      });
    }
    const exist = await userModel.findById(user);
    if (!exist) {
      return res.status(400).send({
        msg: "Unable to find user",
      });
    }

    const newproject = new projectModel({
      title,
      description,
      image,
      user,
    });

    const session = await mongoose.startSession();
    session.startTransaction();
    await newproject.save({ session });
    exist.projects.push(newproject);
    await exist.save({ session });
    await session.commitTransaction();

    return res.status(200).send({
      success: true,
      newproject,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      msg: "UNABLE TO CREATE project",
      error: error.message,
    });
  }
};

exports.updateprojectController = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, description, image } = req.body;
    // Check if the required fields are missing
    if (!title && !description && !image) {
      return res.status(400).send({
        success: false,
        msg: "Please provide at least one field to update",
      });
    }

    // Construct an object containing the fields to update
    const updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (image) updateFields.image = image;

    // Find and update the project by ID
    const updatedproject = await projectModel.findByIdAndUpdate(
      id,
      updateFields,
      {
        new: true,
      }
    );

    // Check if the project with the provided ID exists
    if (!updatedproject) {
      return res.status(404).send({
        success: false,
        msg: "project not found",
      });
    }

    // Send the updated project as response
    return res.status(200).send({
      success: true,
      msg: "project updated successfully",
      updatedproject,
    });
  } catch (error) {
    // Handle errors
    return res.status(400).send({
      success: false,
      msg: "Error in updating project",
      error: error.message,
    });
  }
};

exports.getprojectById = async (req, res) => {
  try {
    const id = req.params.id;
    const project = await projectModel.findById(id);
    if (!project) {
      return res.status(200).send({
        msg: "no such project",
      });
    }
    return res.status(200).send({
      success: true,
      project,
    });
  } catch (error) {
    return res.status(400).send({
      msg: "ERROR",
      error: error.message,
    });
  }
};
exports.deleteprojectController = async (req, res) => {
  try {
    const id = req.params.id;
    const project = await projectModel.findByIdAndDelete(id).populate("user");
    await project.user.projectModel.pull(project);
    //await project.user.project.pull(project);
    await project.user.save();
    return res.status(200).send({
      success: true,
      msg: "Deleted Successfully",
      data: project,
    });
  } catch (error) {
    return res.status(400).send({
      msg: "ERROR IN DELETING",
      error: error.message,
    });
  }
};
exports.userprojectController = async (req, res) => {
  try {
    const userproject = await userModel
      .findById(req.params.id)
      .populate("projects");
    if (!userproject) {
      return res.status(404).send({
        success: false,
        msg: "projectS NOT FOUND WITH THIS ID",
      });
    }
    return res.status(200).send({
      success: true,
      message: "user projects",
      userproject,
    });
  } catch (error) {
    console.error("Error in userprojectController:", error);
    return res.status(400).send({
      success: false,
      message: "Error in userprojectController",
      error,
    });
  }
};
exports.getCompleted = async (req, res) => {
  try {
    const projects = await projectModel.find({ status: true });
    if (!projects) {
      return res.status(200).send({
        success: true,
        msg: "No projects are completed",
      });
    }
    return res.status(200).send({
      success: true,
      msg: "GOT",
      projectCount: projects.length,
      projects,
    });
  } catch (error) {
    return res.status(404).send({
      success: false,
      msg: "ERROR WHILE GETTING projectS",
      error: error.message,
    });
  }
};
