const mongoose = require("mongoose");
const { isURL } = require("validator");

const CompanySchema = new mongoose.Schema({

  companyname: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true,
    trim: true
  },

  industry: {
    type: String,
    required: true,
    trim: true
  },

  location: {
    type: String,
    required: true,
    trim: true
  },

  website: {
    type: String,
    required: true,
    trim: true,
    validate: [isURL, "It must be url"]
  },

  logo: {
    type: String,
    trim: true,
    validate: {
      validator: function (value) {

        // Logo is optional
        if (!value) {
          return true;
        }

        return isURL(value);
      },

      message: "Enter valid url"
    }
  }

}, {
  timestamps: true
});


const CompanyModel = mongoose.model("company", CompanySchema);

module.exports = CompanyModel;