// models/user.js
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config();

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      minlength: [3, "Full name must be at least 3 characters"],
      maxlength: [50, "Full name cannot exceed 50 characters"],
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      validate: {
        validator: function (value) {
          // ✅ Indian phone number validation: 10 digits, no country code
          return /^[6-9]\d{9}$/.test(value);
        },
        message: "Invalid phone number format",
      },
    },

    emailId: {
      type: String,
      required: [true, "Email ID is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "Invalid email format",
      },
    },

     password: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("Enter a strong passwordddddd");
      }
    },
  },

    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
      minlength: [2, "State name is too short"],
    },

    district: {
      type: String,
      required: [true, "District is required"],
      trim: true,
      minlength: [2, "District name is too short"],
    },

    crops: {
      type: [String],
      required: [true, "At least one crop is required"],
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "User must grow at least one crop",
      },
    },

    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [18, "Minimum age must be 18"],
      max: [100, "Maximum age cannot exceed 100"],
    },

    photoUrl: {
  type: String,
  default:
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
  validate(value) {
    const isUrl = validator.isURL(value, {
      require_protocol: true,
      protocols: ["http", "https"],
      allow_underscores: true,
    });

    const isLocalUpload = value.startsWith("http://localhost") || value.startsWith("https://yourdomain.com");

    if (!isUrl && !isLocalUpload) {
      throw new Error("photoUrl is not a valid URL");
    }
  },
},

  },
  { timestamps: true }
);

// ✅ Index for quick search by location + crop
userSchema.index({ state: 1, district: 1, crops: 1 });

// JWT generation
userSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

// Password check
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(passwordInputByUser, user.password);
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
