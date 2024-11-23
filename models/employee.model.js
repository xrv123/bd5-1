let { DataTypes, sequelize } = require('../lib');

let department = sequelize.define('department', {
  name: DataTypes.STRING,
});

let role = sequelize.define('role', {
  title: DataTypes.STRING,
});

let employee = sequelize.define('employee', {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
});

let employeeDepartment = sequelize.define('employeeDepartment', {
  employeeId: DataTypes.INTEGER,
  departmentId: DataTypes.INTEGER,
});

let employeeRole = sequelize.define('employeeRole', {
  employeeId: DataTypes.INTEGER,
  roleId: DataTypes.INTEGER,
});

module.exports = {
  department,
  role,
  employee,
  employeeDepartment,
  employeeRole,
};
