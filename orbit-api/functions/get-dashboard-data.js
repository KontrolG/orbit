const dashboardData = require("../data/dashboard");

exports.handler = async function (event, context) {
  return { statusCode: 200, body: JSON.stringify(dashboardData) };
};
