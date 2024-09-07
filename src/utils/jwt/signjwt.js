import jwt from "jsonwebtoken";
import { ENV_JWT_SECRET } from "../const-config.js";

const userToken = (userId) => {
    const token = jwt.sign({ id : userId }, ENV_JWT_SECRET, { expiresIn : "12h" });
    return token;
};

export default userToken;