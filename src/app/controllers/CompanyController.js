const express = require("express");
const authMeddleware = require("../middlewares/auth");
const Department = require("../models/Department");
const Employee = require("../models/Employee");

const router = express.Router();

router.use(authMeddleware);

// Insert department
router.post("/", async (req, res) => {
  try {
    const { title, description, employees } = req.body;
    const department = await Department.create({
      title,
      description,
      company: req.companyId,
    });

    await Promise.all(
      employees.map(async (employee) => {
        const departmentEmployee = new Employee({
          ...employee,
          department: department._id,
        });
        await departmentEmployee.save();
        department.employees.push(departmentEmployee);
      })
    );
    await department.save();
    return res.send({ department });
  } catch (error) {
    res.status(400).send({ error: `'Error creating new department ${error}'` });
  }
});

// List the department
router.get("/", async (req, res) => {
  try {
    const department = await Department.find().populate([
      "company",
      "employees",
    ]);
    return res.send({ department });
  } catch (error) {
    res.status(400).send({ error: `'Error listing department' ${error}` });
  }
});

// Get a specific department
router.get("/:departmentId", async (req, res) => {
  try {
    const department = await Department.findById(
      req.params.departmentId
    ).populate(["company", "employees"]);
    return res.send({ department });
  } catch (error) {
    res.status(400).send({ error: "Error listing company departments" });
  }
});
// Change a department
router.put("/:departmentId", async (req, res) => {
  try {
    const { title, description, employees } = req.body;
    const department = await Department.findByIdAndUpdate(
      req.params.departmentId,
      {
        title,
        description,
      },
      { new: true }
    ); // For mongose ​​to return the updated department]

    // remove employees to create them again
    department.employees = [];
    await Employee.deleteOne({ departmentId: department._id });

    await Promise.all(
      employees.map(async (employee) => {
        const departmentEmployee = new Employee({
          ...employee,
          department: department._id,
        });
        await departmentEmployee.save();
        department.employees.push(departmentEmployee);
      })
    );
    await department.save();
    return res.send({ department });
  } catch (error) {
    res
      .status(400)
      .send({ error: `'Error update company department' ${error}` });
  }
});

// Remove a department
router.delete("/:departmentId", async (req, res) => {
  try {
    await Department.findByIdAndRemove(
      req.params.departmentId
    );
    return res.send("The department has been removed");
  } catch (error) {
    res.status(400).send({ error: "Error removing department" });
  }
});

module.exports = (app) => app.use("/departments", router);
