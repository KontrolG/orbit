require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const dashboardData = require("./data/dashboard");
const User = require("./data/User");
const InventoryItem = require("./data/InventoryItem");
const { hashPassword, verifyPassword } = require("./util");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const csrf = require("csurf");
var jwt = require("express-jwt");
var jwks = require("jwks-rsa");
const jwtAuthz = require("express-jwt-authz");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrf({ cookie: true }));
app.use(
  session({
    store: new FileStore(),
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    rolling: true,
    cookie: {
      sameSite: true,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: parseInt(process.env.SESSION_MAX_AGE, 10)
    }
  })
);

app.use((req, res, next) => {
  console.log(req.session);
  next();
});

app.get("/api/csrf-token", (req, res, next) => {
  const csrfToken = req.csrfToken();
  res.json({ csrfToken });
});

app.post("/api/authenticate", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email
    }).lean();

    if (!user) {
      return res.status(403).json({
        message: "Wrong email or password."
      });
    }

    const passwordValid = await verifyPassword(password, user.password);

    if (!passwordValid) {
      return res.status(403).json({
        message: "Wrong email or password."
      });
    }

    const { password: userPassword, bio, ...rest } = user;
    const userInfo = Object.assign({}, { ...rest });
    req.session.user = userInfo;

    res.json({
      message: "Authentication successful!",
      userInfo
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Something went wrong." });
  }
});

app.post("/api/signup", async (req, res) => {
  try {
    const { email, firstName, lastName } = req.body;

    const hashedPassword = await hashPassword(req.body.password);

    const userData = {
      email: email.toLowerCase(),
      firstName,
      lastName,
      password: hashedPassword,
      role: "admin"
    };

    const existingEmail = await User.findOne({
      email: userData.email
    }).lean();

    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = new User(userData);
    const savedUser = await newUser.save();

    if (savedUser) {
      const { firstName, lastName, email, role, _id } = savedUser;

      const userInfo = {
        _id,
        firstName,
        lastName,
        email,
        role
      };

      req.session.user = userInfo;

      return res.json({
        message: "User created!",
        userInfo
      });
    } else {
      return res.status(400).json({
        message: "There was a problem creating your account"
      });
    }
  } catch (err) {
    return res.status(400).json({
      message: "There was a problem creating your account"
    });
  }
});

const requireAuth = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.AUTH0_JWKS_URI
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_ISSUER,
  algorithms: ["RS256"]
});

const getUserId = (user) => user["https://app.orbit/" + "sub"];

app.get("/api/user-info", (req, res) => {
  const userInfo = req.user;

  if (!userInfo) {
    return res.json({ message: "Unauthenticated", userInfo: null });
  }

  setTimeout(() => {
    res.json({ userInfo });
  }, 2000);
});

app.post("/api/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(400).json({
        message: `Something went wrong. Error: ${error.toString()}`
      });
    }
    return res.json({ message: "Logout successful" });
  });
});

app.get(
  "/api/dashboard-data",
  requireAuth,
  jwtAuthz(["read:dashboard"]),
  (req, res) => res.json(dashboardData)
);

app.patch("/api/user-role", jwtAuthz(["edit:user"]), async (req, res) => {
  try {
    const { role } = req.body;
    const allowedRoles = ["user", "admin"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Role not allowed" });
    }
    await User.findOneAndUpdate({ _id: getUserId(req.user) }, { role });
    res.json({
      message:
        "User role updated. You must log in again for the changes to take effect."
    });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

app.get(
  "/api/inventory",
  requireAuth,
  jwtAuthz(["read:inventory"]),
  async (req, res) => {
    try {
      const user = getUserId(req.user);
      const inventoryItems = await InventoryItem.find({
        user
      });
      res.json(inventoryItems);
    } catch (err) {
      return res.status(400).json({ error: err });
    }
  }
);

app.post(
  "/api/inventory",
  requireAuth,
  jwtAuthz(["write:inventory"]),
  async (req, res) => {
    try {
      const userId = getUserId(req.user);
      const input = Object.assign({}, req.body, {
        user: userId
      });
      const inventoryItem = new InventoryItem(input);
      await inventoryItem.save();
      res.status(201).json({
        message: "Inventory item created!",
        inventoryItem
      });
    } catch (err) {
      return res.status(400).json({
        message: "There was a problem creating the item"
      });
    }
  }
);

app.delete(
  "/api/inventory/:id",
  requireAuth,
  jwtAuthz(["delete:inventory"]),
  async (req, res) => {
    try {
      const deletedItem = await InventoryItem.findOneAndDelete({
        _id: req.params.id,
        user: getUserId(req.user)
      });
      res.status(201).json({
        message: "Inventory item deleted!",
        deletedItem
      });
    } catch (err) {
      return res.status(400).json({
        message: "There was a problem deleting the item."
      });
    }
  }
);

app.get(
  "/api/users",
  requireAuth,
  jwtAuthz(["read:users"]),
  async (req, res) => {
    try {
      const users = await User.find()
        .lean()
        .select("_id firstName lastName avatar bio");

      res.json({
        users
      });
    } catch (err) {
      return res.status(400).json({
        message: "There was a problem getting the users"
      });
    }
  }
);

app.get("/api/bio", requireAuth, jwtAuthz(["read:user"]), async (req, res) => {
  try {
    const _id = getUserId(req.user);
    const user = await User.findOne({
      _id
    })
      .lean()
      .select("bio");

    res.json({
      bio: user.bio
    });
  } catch (err) {
    return res.status(400).json({
      message: "There was a problem updating your bio"
    });
  }
});

app.patch(
  "/api/bio",
  requireAuth,
  jwtAuthz(["edit:user"]),
  async (req, res) => {
    try {
      const _id = getUserId(req.user);
      const { bio } = req.body;
      const updatedUser = await User.findOneAndUpdate(
        {
          _id
        },
        {
          bio
        },
        {
          new: true
        }
      );

      res.json({
        message: "Bio updated!",
        bio: updatedUser.bio
      });
    } catch (err) {
      return res.status(400).json({
        message: "There was a problem updating your bio"
      });
    }
  }
);

async function connect() {
  try {
    mongoose.Promise = global.Promise;
    await mongoose.connect(process.env.ATLAS_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
  } catch (err) {
    console.log("Mongoose error", err);
  }
  app.listen(3001);
  console.log("API listening on localhost:3001");
}

connect();
