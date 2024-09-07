import express from "express";
import checkToken from "../utils/jwt/checkToken.js";
import rolesCheck from "../utils/roles-Check.js";
import bcrypt from "bcrypt";
import { ENV_PASSWORD_SALT } from "../utils/const-config.js";

const router = express.Router();


// 유저 전체 조회 (어드민만)
router.get('/', checkToken, rolesCheck, (req, res) => {
    const sql = 'select * from users';
    
    req.mysql.query(sql, (error, results) => {
        if(error){
            console.log(error.message);
            return res.status(500).json({ message : "데이터 전송에 오류가 발생하였습니다." });
        } else if(results.length !== 0){
            return res.status(200).json({ message : "데이터 전송 완료", results });
        } else if(results.length === 0){
            return res.status(404).json({ message : "데이터가 존재하지 않습니다." });
        }
    });
});

// 유저 상세 조회
router.get('/mypage', checkToken, (req, res) => {
    const { id } = req.users;
    const sql = 'select * from users where id = ?';

    req.mysql.query(sql, id, (error, results) => {
        if(error){
            console.log(error.message);
            return res.status(500).json({ message : "데이터 전송에 오류가 발생하였습니다." });
        } else if(results.length !== 0){
            return res.status(200).json({ message : "데이터 전송 완료", results });
        } else if(results.length === 0){
            return res.status(404).json({ message : "유저가 존재하지 않습니다." });
        }
    });
});

// 유저 정보 수정
router.patch('/', checkToken, async (req, res, next) => {
    const { id } = req.users;
    const sql1 = 'select nickname from users where nickname = ?';
    const sql2 = 'update users set password = ?, nickname = ?, isOpen = ?, image = ? where id = ?';
    const body = req.body;
    const hashPassword = await bcrypt.hash(body.password, ENV_PASSWORD_SALT);
    const data = [hashPassword, body.nickname, body.isOpen, body.image, id];

    req.mysql.query(sql1, body.nickname, (error, results) => {
        if(error){
            console.log(error.message);
            return res.status(500).json({ message : "데이터 전송에 오류가 발생하였습니다." });
        } else if(results.length !== 0 && results[0].nickname === body.nickname){
            return res.status(400).json({ message : "이미 존재하는 닉네임입니다." });
        }
        req.mysql.query(sql2, data, (error2, results2) => {
            if(error2){
                console.log(error2.message);
                return res.status(500).json({ message : "데이터 전송에 오류가 발생하였습니다." });
            } else if(results2.changedRows !== 0){
                res.clearCookie('authrization');
                return res.status(201).json({ message : "유저 정보를 정상적으로 수정하였습니다." });
            } else if(results2.affectedRows === 0){
                return res.status(404).json({ message : "유저가 존재하지 않습니다." });
            }
        });
    });
});


// 유저 삭제
router.delete('/',checkToken, (req, res, next) => {
    const { id } = req.users;
    const sql = 'delete from users where id = ?';

    req.mysql.query(sql, id, (error, results) => {
        console.log(results)
        if(error){
            console.log(error.message);
            return res.status(500).json({ message : "데이터 전송에 오류가 발생하였습니다." });
        } else if(results.affectedRows !== 0){
            res.clearCookie('authrization');
            return res.status(201).json({ message : "유저를 정상적으로 삭제하였습니다." });
        } else if(results.affectedRows === 0){
            return res.status(404).json({ message : "유저가 존재하지 않습니다." });
        }
    });
});


export default router;