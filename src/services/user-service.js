const UserRepository = require("../repositories/user-repository");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_KEY } = require("../config/serverConfig");
class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async create(data) {
    try {
      const user = await this.userRepository.create(data);
      return user;
    } catch (error) {
      console.log("something wrong with service layer");
      throw { error };
    }
  }

  async destroy(userId) {
    try {
      const response = await this.userRepository.destroy(userId);
      return response;
    } catch (error) {
      console.log("something wrong with service layer");
      throw { error };
    }
  }

  async signIn(email, plainPassword) {
    try {
      const user = await this.userRepository.getByEmail(email);
      const passwordsMatch = this.checkPassword(plainPassword, user.password);
      if (!passwordsMatch) {
        console.log("password doesnt match");
        throw { error: "incorrect password" };
      }
      const newJWT = this.createToken({ email: user.email, id: user.id });
      return newJWT;
    } catch (error) {
      console.log("something wrong with signin service");
      throw { error };
    }
  }

  async isAuthenticated(token) {
    try {
      const response = this.verifyToken(token);
      if (!response) {
        throw { error: "Invalid token" };
      }
      const user = await this.userRepository.getById(response.id);
      if (!user) {
        throw { error: "no user with corresponding token" };
      }
      return user.id;
    } catch (error) {
      console.log("Something went wrong in the auth process");
      throw error;
    }
  }

  createToken(user) {
    try {
      const result = jwt.sign(user, JWT_KEY, { expiresIn: "1d" });
      return result;
    } catch (error) {
      console.log("something wrong with token creation");
      throw { error };
    }
  }

  verifyToken(token) {
    try {
      const response = jwt.verify(token, JWT_KEY);
      return response;
    } catch (error) {
      console.log("something wrong with token validation", error);
      throw { error };
    }
  }

  checkPassword(userInputPlainPassword, encryptedPassword) {
    try {
      return bcrypt.compareSync(userInputPlainPassword, encryptedPassword);
    } catch (error) {
      console.log("something wrong with password comparison", error);
      throw { error };
    }
  }

  isAdmin(userId) {
    try {
      return this.userRepository.isAdmin(userId);
    } catch (error) {
      console.log("something wrong with service layer", error);
      throw { error };
    }
  }
}

module.exports = UserService;
