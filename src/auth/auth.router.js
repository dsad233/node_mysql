import express from "express";
import bcrypt from "bcrypt";
import { ENV_PASSWORD_SALT } from "../utils/const-config.js";
import userToken from "../utils/jwt/signjwt.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 회원가입 및 로그인 관련 API
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: 회원가입 API
 *     description: 이메일, 비밀번호, 닉네임을 통해 새로운 계정을 생성합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: 이메일 주소
 *                 example: 'test@naver.com'
 *               password:
 *                 type: string
 *                 description: 비밀번호
 *                 example: '1234'
 *               nickname:
 *                 type: string
 *                 description: 사용자 닉네임
 *                 example: 'nickname'
 *               image:
 *                 type: string
 *                 description: 프로필 이미지 URL
 *                 example: 'image.jpg'
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "계정 생성 완료"
 *       400:
 *         description: 중복된 이메일 또는 닉네임
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "회원가입에 실패하였습니다."
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: 로그인 API
 *     description: 이메일과 비밀번호를 사용하여 로그인합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: 유저 이메일
 *                 example: 'test@naver.com'
 *               password:
 *                 type: string
 *                 description: 유저 비밀번호
 *                 example: '1234'
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "로그인 완료"
 *       400:
 *         description: 비밀번호 불일치 또는 삭제된 계정
 *       404:
 *         description: 존재하지 않는 유저
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "존재하지 않는 유저입니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "로그인에 실패하였습니다."
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: 로그아웃 API
 *     description: 현재 사용자의 세션을 종료하고 로그아웃합니다.
 *     responses:
 *       201:
 *         description: 로그아웃 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "로그아웃 완료"
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "로그아웃에 실패하였습니다."
 */

// 회원가입
router.post('/register', async (req, res, next) => {
    try {
        const selectUser = 'select email, nickname from users where email = ? or nickname = ?';
        const insertUser = 'insert into users(email, password, nickname, image) values (?, ?, ?, ?)';
        const insertRoles = 'insert into roles(userId) values(?)';
        const body = req.body;
    
        if(!body.email){
            return res.status(404).json({ message : "이메일란이 누락되었습니다." });
        }
    
        if(!body.password){
            return res.status(404).json({ message : "패스워드란이 누락되었습니다." });
        }
    
        if(!body.nickname){
            return res.status(404).json({ message : "닉네임란이 누락되었습니다." });
        }
    
        const hashPassword = await bcrypt.hash(body.password, ENV_PASSWORD_SALT);
        const uniqueCheckData = [body.email, body.nickname];
        const data = [body.email, hashPassword, body.nickname, body.image];

        req.mysql.beginTransaction((error) => {
            if(error) {
                console.log("beginTransaction Error : ", error.message);
                return res.status(500).json({ message : "트랜잭션 시작 도중 오류가 발생하였습니다." })
            }

            req.mysql.query(selectUser, uniqueCheckData, (error, results) => {
                if(error) {
                    console.log("users table Select Error : ", error.message);
                    return req.mysql.rollback(() => {
                        return res.status(500).json({ message : "users 테이블 조회에 에러가 발생하였습니다." });
                    });
                } else if(results.length !== 0 && results[0].email === body.email){
                    return req.mysql.rollback(() => {
                        return res.status(400).json({ message : "이미 존재하는 이메일입니다." });
                    });
                    
                } else if(results.length !== 0 && results[0].nickname === body.nickname){
                    return req.mysql.rollback(() => {
                        return res.status(400).json({ message : "이미 존재하는 닉네임입니다." });
                    });
                }
                
                req.mysql.query(insertUser, data, (error2, results2) => {
                    if(error2) {
                        console.log("users table Create Error : ", error.message);
                        return req.mysql.rollback(() => {
                            return res.status(500).json({ message : "users 테이블 생성에 에러가 발생하였습니다." });
                        });
                    }

                    const userId = results2.insertId;
                    req.mysql.query(insertRoles, userId, (error) => {
                        if(error) {
                            console.log("roles table Error : ", error.message);
                            return req.mysql.rollback(() => {
                                return res.status(500).json({ message : "roles 테이블 생성에 에러가 발생하였습니다." });
                            });
                        } 
                        req.mysql.commit((error) => {
                            if(error){
                                console.log("commit Error : ", error.message);
                                return req.mysql.rollback(() => {
                                    return res.status(500).json({ message : "트랜잭션 commit 과정 중 에러가 발생하였습니다." });
                                });
                            } 
                            return res.status(201).json({ message : "계정 생성 완료" });
                        });
                    });
                });
            });
        });
    } catch (error) {
        if(error){
            console.log(error.message)
            return res.status(500).json({ message : "회원가입에 실패하였습니다." });
        }
    }
});


// 로그인
router.post('/login', (req, res, next) => {
    try {
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
            } else if(results[0].deletedAt !== null){
                return res.status(400).json({ message : "삭제 진행 중인 계정입니다. 문의를 진행하여 주십시오." });
            } else if(results && results[0].deletedAt === null){
                res.cookie('authrization', `Bearer ${userToken(results[0].id)}`);
                return res.status(200).json({ message : "로그인 완료" });            
            }
        });
    } catch (error){
        if(error){
            console.log(error.message)
            return res.status(500).json({ message : "로그인에 실패하였습니다." });
        }
    }
});


// 로그아웃 
router.post('/logout', (req, res, next) => {
    try{
        res.clearCookie('authrization');
        return res.status(201).json({ message : "로그아웃 완료" });
    } catch(error){
        if(error){
            console.log(error.message)
            return res.status(500).json({ message : "로그아웃에 실패하였습니다." });
        }
    }
});


export default router;