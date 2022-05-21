const dashboardData = require("../data/dashboard");
const { checkAuth } = require("../util");

exports.handler = async function (event, context) {
  try {
    await checkAuth(event);
    return { statusCode: 200, body: JSON.stringify(dashboardData) };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Not authenticated"
      })
    };
  }
};
