const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const { generarJwt } = require("../helpers/jwt");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    await userModel.findOne({ email }, async (err, user) => {
      if (err) {
        return res.status(400).json({
          status: false,
          message: "Error al obtener el usuario",
        });
      }
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "El usuario no existe",
        });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({
          status: false,
          message: "La contraseña es incorrecta",
        });
      }
      const token = await generarJwt(user.id);
      return res.status(200).json({
        status: true,
        user,
        token,
      });
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error al obtener el usuario",
    });
  }
};
const register = async (req, res) => {
  try {
    const { body } = req;
    const existeEmail = await userModel.findOne({ email: body.email });
    if (existeEmail) {
      return res.status(400).json({
        status: false,
        message: "El email ya existe",
      });
    }
    const user = new userModel(body);
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(user.password, salt);
    await user.save(async (err, userStored) => {
      if (err) {
        return res.status(400).json({
          status: false,
          message: "Error al guardar el usuario",
        });
      }
      const token = await generarJwt(user.id);
      return res.status(200).json({
        status: true,
        user: userStored,
        token,
      });
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error al guardar el usuario",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { nombre, apellido, email, password, newPassword } = req.body;
    await userModel.findOne({ email }, async (err, user) => {
      if (err) {
        return res.status(400).json({
          status: false,
          message: "Error al obtener el usuario",
        });
      }
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "El usuario no existe",
        });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({
          status: false,
          message: "La contraseña es incorrecta",
        });
      }

      user.nombre = nombre;
      user.apellido = apellido;
      user.email = email;
      user.password = newPassword;
      await user.save(async (err, userStored) => {
        if (err) {
          return res.status(400).json({
            status: false,
            message: "Error al guardar la contraseña del usuario",
          });
        }
        const token = await generarJwt(user.id);
        return res.status(200).json({
          status: true,
          user: userStored,
          token,
        });
      });
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error al cambiar la constraseña",
    });
  }
};

const renewToken = async (req, res) => {
  try {
    const { id } = req;
    const token = await generarJwt(id);
    return res.status(200).json({
      status: true,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error al renovar el token",
    });
  }
};
module.exports = {
  login,
  register,
  updateUser,
  renewToken,
};
