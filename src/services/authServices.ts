import { User } from "@prisma/client";
import {
  findUserverificationToken,
  userEmailExists,
} from "../helpers/dbValidations";
import { CustomError } from "../helpers/CustomError";
import bcrypt from "bcryptjs";
import { generateAuthToken, hashPassword } from "../helpers/auth";
import { prisma } from "./prismaService";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

interface emailAndPassword {
  email: string;
  password: string;
}

const APP_URL = process.env.APP_URL;

export const login = async (userData: emailAndPassword) => {
  try {
    const user: User | null = await userEmailExists(userData.email);
    if (!user || !user.verified)
      throw new CustomError(
        "El correo proporcionado no existe o no ha sido activado. Por favor, verifica que has ingresado la dirección de correo correcta o activa tu cuenta antes de continuar.",
        404
      );

    const validPassword = await bcrypt.compare(
      userData.password,
      user.password
    );

    if (!validPassword)
      throw new CustomError("La contraseña es incorrecta", 401);

    const token = generateAuthToken(user);

    return {
      msg: `Iniciaste sesión con ${user.email}`,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      token: token,
    };
  } catch (error) {
    throw new CustomError(error.message, error.statusCode);
  }
};

export const signUp = async (userData: User) => {
  try {
    const user: User | null = await userEmailExists(userData.email);
    if (user && user.verified) {
      console.log(`El correo ${userData.email} ya se encuentra registrado`);
      throw new CustomError(
        `El correo ${userData.email} ya se encuentra registrado`,
        400
      );
    }

    const verificationToken = generateAuthToken(userData);

    const createdUser = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashPassword(userData.password),
        role: userData.role,
        verified: false,
        verificationToken,
      },
    });

    if (!createdUser)
      throw new CustomError("No se ha podido registrar el usuario", 500);

    const msg = {
      to: userData.email,
      from: "ignaciojsoler@gmail.com",
      subject: "Verifica tu cuenta",
      text: `Activa tu cuenta con el siguiente tóken de verificación: ${verificationToken}`,
      html: `<p>Copia el siguiente tóken de verificación y utilízalo para activar tu cuenta: <h3><b>${verificationToken}</b></h3></p>`,
    };
    await sgMail.send(msg);
    return {
      msg: "Usuario registrado correctamente. Se ha enviado un enlace de verificación a su correo electrónico. Verifique su bandeja de entrada, y en caso de no encontrar el mensaje de confirmación, por favor, revise también su bandeja de spam, ya que es posible que el mensaje se encuentre allí.",
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
      },
    };
  } catch (error) {
    throw new CustomError(error.message, error.statusCode);
  }
};

export const verifyAccount = async (verificationToken: string) => {
  try {
    const user: User | null = await findUserverificationToken(
      verificationToken
    );

    if (!user) {
      throw new CustomError("Token de verificación inválido o expirado.", 404);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { verified: true, verificationToken: "" },
    });

    return updatedUser;
  } catch (error) {
    throw new CustomError(error.message, error.statusCode);
  }
};