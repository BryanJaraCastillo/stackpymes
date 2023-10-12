const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const { generarJwt } = require("../helpers/jwt");

const usersMOCK = [];

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  const user = usersMOCK.find((u) => u.email === email);

  if (!user || user.password !== password) {
    return res.status(401).json({
      status: false,
      message: "Credenciales incorrectas",
    });
  }

  res.status(200).json({
    token: "TOKEN",
    user: {
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
    },
  });
  // try {
  //   const { email, password } = req.body;
  //   await userModel.findOne({ email }, async (err, user) => {
  //     if (err) {
  //       return res.status(400).json({
  //         status: false,
  //         message: "Error al obtener el usuario",
  //       });
  //     }
  //     if (!user) {
  //       return res.status(400).json({
  //         status: false,
  //         message: "El usuario no existe",
  //       });
  //     }
  //     const validPassword = bcrypt.compareSync(password, user.password);
  //     if (!validPassword) {
  //       return res.status(400).json({
  //         status: false,
  //         message: "La contraseña es incorrecta",
  //       });
  //     }
  //     const token = await generarJwt(user.id);
  //     return res.status(200).json({
  //       status: true,
  //       user,
  //       token,
  //     });
  //   });
  // } catch (error) {
  //   return res.status(500).json({
  //     status: false,
  //     message: "Error al obtener el usuario",
  //   });
  // }
};
const register = async (req, res) => {
  const { nombre, apellido, email, password } = req.body;
  const user = {
    nombre,
    apellido,
    email,
    password,
  };

  if (usersMOCK.some((existingUser) => existingUser.email === email)) {
    return res.status(400).json({
      status: false,
      message: "Email ya existe",
    });
  }

  usersMOCK.push(user);

  return res.status(200).json({
    status: true,
    message: "Usuario creado exitosamente",
  });

  // try {
  //   const { body } = req;
  //   const existeEmail = await userModel.findOne({ email: body.email });
  //   if (existeEmail) {
  //     return res.status(400).json({
  //       status: false,
  //       message: "El email ya existe",
  //     });
  //   }
  //   const user = new userModel(body);
  //   const salt = bcrypt.genSaltSync(10);
  //   user.password = bcrypt.hashSync(user.password, salt);
  //   await user.save(async (err, userStored) => {
  //     if (err) {
  //       return res.status(400).json({
  //         status: false,
  //         message: "Error al guardar el usuario",
  //       });
  //     }
  //     const token = await generarJwt(user.id);
  //     return res.status(200).json({
  //       status: true,
  //       user: userStored,
  //       token,
  //     });
  //   });
  // } catch (error) {
  //   return res.status(500).json({
  //     status: false,
  //     message: "Error al guardar el usuario",
  //   });
  // }
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
  const { token } = req.body;

  res.status(200).json({
    status: true,
    message: "Token de acceso renovado",
    token: `TOKEN RENOVADO: ${token}-nuevo`,
  });
  // try {
  //   const { id } = req;
  //   const token = await generarJwt(id);
  //   return res.status(200).json({
  //     status: true,
  //     token,
  //   });
  // } catch (error) {
  //   return res.status(500).json({
  //     status: false,
  //     message: "Error al renovar el token",
  //   });
  // }
};
module.exports = {
  login,
  register,
  updateUser,
  renewToken,
};
