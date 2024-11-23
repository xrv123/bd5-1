const express = require('express');
const { resolve } = require('path');
const {
  department,
  role,
  employee,
  employeeDepartment,
  employeeRole,
} = require('./models/employee.model');
const { sequelize } = require('./lib');

const app = express();
const port = 3000;

app.get('/seed_db', async (req, res) => {
  await sequelize.sync({ force: true });

  const departments = await department.bulkCreate([
    { name: 'Engineering' },
    { name: 'Marketing' },
  ]);

  const roles = await role.bulkCreate([
    { title: 'Software Engineer' },
    { title: 'Marketing Specialist' },
    { title: 'Product Manager' },
  ]);

  const employees = await employee.bulkCreate([
    { name: 'Rahul Sharma', email: 'rahul.sharma@example.com' },
    { name: 'Priya Singh', email: 'priya.singh@example.com' },
    { name: 'Ankit Verma', email: 'ankit.verma@example.com' },
  ]);

  // Associate employees with departments and roles using create method on junction models
  await employeeDepartment.create({
    employeeId: employees[0].id,
    departmentId: departments[0].id,
  });
  await employeeRole.create({
    employeeId: employees[0].id,
    roleId: roles[0].id,
  });

  await employeeDepartment.create({
    employeeId: employees[1].id,
    departmentId: departments[1].id,
  });
  await employeeRole.create({
    employeeId: employees[1].id,
    roleId: roles[1].id,
  });

  await employeeDepartment.create({
    employeeId: employees[2].id,
    departmentId: departments[0].id,
  });
  await employeeRole.create({
    employeeId: employees[2].id,
    roleId: roles[2].id,
  });

  return res.json({ message: 'Database seeded!' });
});

app.get('/employees', async (req, res) => {
  const employees = await employee.findAll();
  let finalEmployeeList = [];

  let empData;
  for (let i = 0; i < employees.length; i++) {
    empData = await getEmployeeDetails(employees[i]);
    finalEmployeeList.push(empData);
  }

  res.json({ employees: finalEmployeeList });
});

app.get('/employees/details/:id', async (req, res) => {
  const employees = await employee.findAll();
  const id = parseInt(req.params.id);
  let finalEmployeeList = [];

  let empData;
  for (let i = 0; i < employees.length; i++) {
    empData = await getEmployeeDetails(employees[i]);
    finalEmployeeList.push(empData);
  }

  const result = finalEmployeeList.filter((e) => e.id === id);
  res.json({ employee: result[0] });
});

app.get('/employees/department/:id', async (req, res) => {
  const employees = await employee.findAll();
  const id = parseInt(req.params.id);
  let finalEmployeeList = [];

  let empData;
  for (let i = 0; i < employees.length; i++) {
    empData = await getEmployeeDetails(employees[i]);
    finalEmployeeList.push(empData);
  }

  const result = finalEmployeeList.filter((e) => e.department.id === id);
  res.json({ employee: result[0] });
});

app.get('/employees/role/:id', async (req, res) => {
  const employees = await employee.findAll();
  const id = parseInt(req.params.id);
  let finalEmployeeList = [];

  let empData;
  for (let i = 0; i < employees.length; i++) {
    empData = await getEmployeeDetails(employees[i]);
    finalEmployeeList.push(empData);
  }

  const result = finalEmployeeList.filter((e) => e.role.id === id);
  res.json({ employee: result[0] });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get('/employees/sort-by-name', async (req, res) => {
  const employees = await employee.findAll();
  const id = parseInt(req.params.id);
  let finalEmployeeList = [];

  let empData;
  for (let i = 0; i < employees.length; i++) {
    empData = await getEmployeeDetails(employees[i]);
    finalEmployeeList.push(empData);
  }

  const order = req.query.order;

  let result;
  console.log("The order is ", order)
  if (order === 'asc') {
    res.json({ employees: finalEmployeeList.sort((a, b) => a.name.localeCompare(b.name)) });
  } else {
    res.json({ employees: finalEmployeeList.sort((a, b) => b.name.localeCompare(a.name)) });
  }
});


app.post("/employees/new", async (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let departmentId = parseInt(req.body.departmentId);
  let roleId = parseInt(req.body.roleId);

  const unitEmployee = await employee.create(
    { name , email }
  )
  
  await employeeDepartment.create({
    employeeId: unitEmployee.id,
    departmentId: departmentId,
  });
  await employeeRole.create({
    employeeId: unitEmployee.id,
    roleId: roleId,
  });

  let empData = await getEmployeeDetails(employees[i]);

  res.json(empData)
})


// ----------- HELPER FUNCTIONS ------

// Helper function to get employee's associated departments
async function getEmployeeDepartments(employeeId) {
  const employeeDept = await employeeDepartment.findOne({
    where: { employeeId },
  });

  const departmentData = await department.findOne({
    where: { id: employeeDept.departmentId },
  });

  return departmentData;
}

// Helper function to get employee details with associated departments and roles
async function getEmployeeDetails(employeeData) {
  const department = await getEmployeeDepartments(employeeData.id);
  const role = await getEmployeeRoles(employeeData.id);

  return {
    ...employeeData.dataValues,
    department,
    role,
  };
}

async function getEmployeeRoles(employeeId) {
  const empRole = await employeeRole.findOne({
    where: { employeeId },
  });

  const roleData = await role.findOne({
    where: { id: empRole.roleId },
  });

  return roleData;
}
