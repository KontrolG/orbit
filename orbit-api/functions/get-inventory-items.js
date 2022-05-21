const { checkAuth, checkRole } = require("../util");
const InventoryItemConnection = require("../data/InventoryItemConnection");

exports.handler = async function (event, context) {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const user = await checkAuth(event);
    await checkRole(user, ["admin"]);
    const InventoryItem = await InventoryItemConnection.createConnection();
    const items = await InventoryItem.find({
      user: user.sub
    });
    return { statusCode: 200, body: JSON.stringify(items) };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: error.message
      })
    };
  }
};
