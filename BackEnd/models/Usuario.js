const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const usuarioSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contrasena: {
    type: String,
    required: true,
  },
});

//usuarioSchema.pre("save", async function (next) {
  //if (!this.isModified("contrasena")) return next();
  //this.contrasena = await bcrypt.hash(this.contrasena, 10);
//});

module.exports = mongoose.model("Usuario", usuarioSchema);
