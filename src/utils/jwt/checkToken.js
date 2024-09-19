import jwt from "jsonwebtoken";
import { ENV_JWT_SECRET } from "../const-config.js";

const checkToken = (req, res, next) => {
    try {
        const [tokenType, token] = req.cookies.authrization.split(' ');
    
        if(!token || !tokenType){
            return res.status(404).json({ message : "토큰이 존재하지 않습니다." });
        }
    
        if(tokenType !== 'Bearer'){
            return res.status(400).json({ message : "토큰 타입이 일치하지 않습니다." });
        }
    
        const sql = 'select * from users where id = ?';
        const { id } = jwt.verify(token, ENV_JWT_SECRET);

        req.mysql.query(sql, id, (error, results) => {
            if(error){
                console.log("checkToken Error : ", error.message);
                return res.status(500).json({ message : "데이터 전송에 오류가 발생하였습니다." });
            } else if(results.length !== 0){
                req.users = results;
                next();
            } else if(results.length === 0){
                return res.status(404).json({ message : "유저가 존재하지 않습니다." });
            }
        });

    } catch (error){
        if(error.name === "TokenExpiredError"){
            return res.status(401).json({ message : "토큰이 만료되었습니다." });
        } else if(error.name === "JsonWebTokenError"){
            return res.status(401).json({ message : "토큰 오류가 발생되었습니다." });
        } else {
            return res.status(500).json({ message : "비정상적인 오류가 발생하였습니다.", Error :  error.message });
        }
    }
};

export default checkToken;