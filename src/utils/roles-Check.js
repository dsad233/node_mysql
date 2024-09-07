import jwt from "jsonwebtoken";
import { ENV_JWT_SECRET } from "./const-config.js";

const rolesCheck = (req, res, next) => {

    try {
        const token = req.cookies.authrization.split(' ');
    
        const { id } = jwt.verify(token[1], ENV_JWT_SECRET);
        const sql = 'select roles from users where id = ?';

        req.mysql.query(sql, id, (error, results) => {
            if(error){
                return res.status(500).json({ message : "데이터 전송에 오류가 발생하였습니다." });
            } else if(results.length === 0){
                return res.status(404).json({ message : "유저가 존재하지 않습니다." });
            } else if(results.length !== 0 && results[0].roles === 'user'){
                return res.status(403).json({ message : "어드민 권한이 존재하지 않습니다." });
            } else if(results.length !== 0 && results[0].roles === 'admin'){
                next();
            }
        });
        
    } catch(error){
        if(error){
            console.log(error.message)
            return res.status(500).json({ message : "유저 권한체크에 실패하였습니다." });
        }
    }
    
};

export default rolesCheck;