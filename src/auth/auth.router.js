import express from "express";
import bcrypt from "bcrypt";
import { ENV_PASSWORD_SALT } from "../utils/const-config.js";
import userToken from "../utils/jwt/signjwt.js";


const router = express.Router();


// 회원가입
router.post('/register', async (req, res, next) => {
    const sql = 'insert into users(email, password, nickname, image) values (?, ?, ?, ?)';
    const body = req.body;

    if(!body.email){
        res.status(400).json({ message : "이메일란이 누락되었습니다." });
    }

    if(!body.password){
        res.status(400).json({ message : "패스워드란이 누락되었습니다." });
    }

    if(!body.nickname){
        res.status(400).json({ message : "닉네임란이 누락되었습니다." });
    }

    const hashPassword = await bcrypt.hash(body.password, ENV_PASSWORD_SALT);
    const data = [body.email, hashPassword, body.nickname, body.image];

    req.mysql.query(sql, data, (error, results) => {
        if(error) {
            console.log(error.message);
            return res.status(500).json({ message : "전송 에러가 발생하였습니다." });
        } else if(results){
            return res.status(201).json({ message : "계정 생성 완료" });
        }
    });
});


// 로그인
router.post('/login', (req, res, next) => {
    const sql = 'select * from users where email = ?'
    const body = req.body;
    const data = [body.email, body.password];

    req.mysql.query(sql, data, async (error, results) => {
        if(error) {
            console.log(error.message);
            return res.status(500).json({ message : "전송 에러가 발생하였습니다." });
        } else if(results.length === 0){
            return res.status(404).json({ message : "존재하지 않는 유저입니다." });
        } else if(!await bcrypt.compare(body.password, results[0].password)){
            return res.status(400).json({ message : "패스워드가 일치하지 않습니다. 다시 입력해주십시오." });
        } else if(results){
            res.cookie('authrization', `Bearer ${userToken(results[0].id)}`);
            return res.status(200).json({ message : "로그인 완료" });            
        }
    });
});


// 로그아웃 
router.post('/logout', (req, res, next) => {
    res.clearCookie('authrization');
    return res.status(201).json({ message : "로그아웃 완료" });
});


export default router;