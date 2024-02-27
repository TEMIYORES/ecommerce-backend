const { nextWednesday } = require("date-fns");
const EmployeeDB = require("../model/Employee");
const getAllEmployees = async (req, res) => {
  const allEmployees = await EmployeeDB.find();
  if (!allEmployees)
    return res.status(204).json({ message: "No Employees found" });
  res.json(allEmployees);
};

const createNewEmployee = async (req, res) => {
  const { firstname, lastname } = req.body;
  if (!firstname || !lastname)
    return res.status(400).json({ message: "First and last names required" });

  try {
    //   Create and Store new Employee
    const newEmployee = await EmployeeDB.create({
      firstname: firstname,
      lastname: lastname,
    });
    console.log(newEmployee);
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateEmployee = async (req, res) => {
  const { id, firstname, lastname } = req?.body;
  if (!id) return res.status(400).json({ message: `Id parameter is required` });
  const employee = await EmployeeDB.findOne({ _id: id }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ message: `Employee with ${id} Id Not Found` });
  }

  if (firstname) employee.firstname = firstname;
  if (lastname) employee.lastname = lastname;
  const updatedEmployee = await employee.save();
  console.log(updatedEmployee);
  res.status(200).json(updateEmployee);
};

const deleteEmployee = async (req, res) => {
  const { id } = req?.body;
  if (!id) return res.status(400).json({ message: `Id parameter is required` });

  const employee = await EmployeeDB.findOne({ _id: id }).exec();
  if (!employee) {
    return res.status(204).json({ error: `Employee with ${id} Id Not Found` });
  }
  const deletedEmployee = await EmployeeDB.deleteOne({ _id: id });
  res.status(200).json(deletedEmployee);
};
const getEmployee = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: `Id parameter is required` });

  const employee = await EmployeeDB.findOne({ _id: id }).exec();
  if (!employee) {
    return res.status(400).json({ error: `Employee with ${id} Id Not Found` });
  }
  res.status(200).json(employee);
};
module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
