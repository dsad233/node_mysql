import express from "express";
import checkToken from "../utils/jwt/checkToken.js";
import rolesCheck from "../utils/roles-Check.js";
import bcrypt from "bcrypt";
import { sendUserEmail } from "../utils/sendEmail.middleware.js";
import { ENV_PASSWORD_SALT } from "../utils/const-config.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 유저 관련 API
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: 유저 전체 조회 (어드민만)
 *     description: 모든 유저 정보를 조회합니다. (어드민 권한 필요)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 유저 전체 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "유저 전체 조회 완료"
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: 유저 ID
 *                       email:
 *                         type: string
 *                         description: 유저 이메일
 *                       password:
 *                         type: string
 *                         description: 유저 패스워드
 *                       nickname:
 *                         type: string
 *                         description: 유저 닉네임
 *                       isOpen:
 *                         type: boolean
 *                         description: 유저 공개 여부
 *                       createdAt:
 *                         type: string
 *                         description: 유저 생성 일자
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         description: 유저 업데이트 일자
 *                         format: date-time
 *                       deletedAt:
 *                         type: string
 *                         description: 유저 삭제 여부
 *                         default: null
 *                       image:
 *                         type: string
 *                         description: 유저 프로필 사진
 *                       permision:
 *                         type: string
 *                         description: 유저 권한
 *                         default: "admin"
 *       404:
 *         description: 유저 정보 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "유저 정보가 존재하지 않습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "데이터 전송에 오류가 발생하였습니다."
 */


/**
 * @swagger
 * /users/mypage:
 *   get:
 *     tags:
 *       - Users
 *     summary: 유저 마이페이지 조회
 *     description: 현재 로그인한 유저의 마이페이지 정보를 조회합니다.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 마이페이지 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "유저 마이페이지 조회 완료"
 *                 results:
 *                   type: object
 *                   properties:
 *                       id:
 *                         type: integer
 *                         description: 유저 ID
 *                         default: 1
 *                       email:
 *                         type: string
 *                         description: 유저 이메일
 *                       password:
 *                         type: string
 *                         description: 유저 패스워드
 *                       nickname:
 *                         type: string
 *                         description: 유저 닉네임
 *                       isOpen:
 *                         type: boolean
 *                         description: 유저 공개 여부
 *                       createdAt:
 *                         type: string
 *                         description: 유저 생성 일자
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         description: 유저 업데이트 일자
 *                         format: date-time
 *                       deletedAt:
 *                         type: string
 *                         description: 유저 삭제 여부
 *                         default: null
 *                       image:
 *                         type: string
 *                         description: 유저 프로필 사진
 *       404:
 *         description: 유저 정보 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "유저 정보가 존재하지 않습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "데이터 전송에 오류가 발생하였습니다."
 */

/**
 * @swagger
 * /users/{paramid}:
 *   get:
 *     tags:
 *       - Users
 *     summary: 유저 상세 조회 (어드민만)
 *     description: 특정 유저의 상세 정보를 조회합니다. (어드민 권한 필요)
 *     parameters:
 *       - in: path
 *         name: paramid
 *         required: true
 *         schema:
 *           type: integer
 *         description: 조회할 유저의 ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 유저 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "유저 상세 조회 완료"
 *                 results:
 *                   type: object
 *                   properties:
 *                       id:
 *                         type: integer
 *                         description: 유저 ID
 *                         default: 1
 *                       email:
 *                         type: string
 *                         description: 유저 이메일
 *                       password:
 *                         type: string
 *                         description: 유저 패스워드
 *                       nickname:
 *                         type: string
 *                         description: 유저 닉네임
 *                       isOpen:
 *                         type: boolean
 *                         description: 유저 공개 여부
 *                       createdAt:
 *                         type: string
 *                         description: 유저 생성 일자
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         description: 유저 업데이트 일자
 *                         format: date-time
 *                       deletedAt:
 *                         type: string
 *                         description: 유저 삭제 여부
 *                         default: null
 *                       image:
 *                         type: string
 *                         description: 유저 프로필 사진
 *       404:
 *         description: 유저 정보 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "유저 정보가 존재하지 않습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "데이터 전송에 오류가 발생하였습니다."
 */


/**
 * @swagger
 * /users:
 *   patch:
 *     tags:
 *       - Users
 *     summary: 유저 정보 수정
 *     description: 현재 로그인한 유저의 정보를 수정합니다.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: 새로운 비밀번호
 *                 example: '12345'
 *               nickname:
 *                 type: string
 *                 description: 새로운 닉네임
 *                 example: 'newnickname'
 *               isOpen:
 *                 type: boolean
 *                 description: 유저 공개 여부
 *                 example: true
 *               image:
 *                 type: string
 *                 description: 새로운 프로필 이미지 URL
 *                 example: 'new_image.jpg'
 *     responses:
 *       201:
 *         description: 유저 정보 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "유저 정보를 정상적으로 수정하였습니다."
 *       400:
 *         description: 닉네임 1자 이상 충족 필요 및 닉네임 중복 이슈
 *       404:
 *         description: 유저 정보 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "유저 정보가 존재하지 않습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "유저 정보 수정에 실패하였습니다."
 */


/**
 * @swagger
 * /users/softdelete:
 *   patch:
 *     tags:
 *       - Users
 *     summary: 유저 소프트 삭제
 *     description: 유저의 `deletedAt` 필드를 현재 시각으로 업데이트하여 유저를 소프트 삭제합니다.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: 유저 소프트 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "유저 정보를 정상적으로 삭제하였습니다."
 *       404:
 *         description: 유저 정보 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "유저 정보가 존재하지 않습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "유저 삭제에 실패하였습니다."
 */


/**
 * @swagger
 * /users:
 *   delete:
 *     tags:
 *       - Users
 *     summary: 유저 삭제
 *     description: 유저 정보를 데이터베이스에서 완전히 삭제합니다.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: 유저 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "유저 정보를 정상적으로 삭제하였습니다."
 *       404:
 *         description: 유저 정보 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "유저 정보가 존재하지 않습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "유저 삭제에 실패하였습니다."
 */

/**
 * @swagger
 * /users/restore:
 *   post:
 *     tags:
 *       - Users
 *     summary: 유저 삭제 복구 요청
 *     description: 삭제된 계정을 복구하기 위한 문의를 전송합니다.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 문의 제목
 *                 example: '계정 복구 요청'
 *               content:
 *                 type: string
 *                 description: 문의 내용
 *                 example: '계정을 복구해 주세요.'
 *     responses:
 *       201:
 *         description: 문의 요청 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "계정 문의 요청을 완료하였습니다."
 *       400:
 *         description: 요청 데이터 유효성 검사 실패
 *       404:
 *         description: 복구 요청에 의한 정보란 충족 필요
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "계정 문의 요청을 실패하였습니다."
 */

// 유저 전체 조회 (어드민만)
router.get('/', checkToken, rolesCheck, (req, res) => {
    try {
        const sql = 'select u.*, r.permision from users u inner join roles r on u.id = r.userId';
        
        req.mysql.query(sql, (error, results) => {
            if(error){
                console.log(error.message);
                return res.status(500).json({ message : "데이터 전송에 오류가 발생하였습니다." });
            } else if(results.length !== 0){
                return res.status(200).json({ message : "유저 전체 조회 완료", results });
            } else if(results.length === 0){
                return res.status(404).json({ message : "유저 정보가 존재하지 않습니다." });
            }
        });
    } catch (error) {
        if(error){
            console.log(error.message);
            return res.status(500).json({ message : "유저 전체 조회에 실패하였습니다." });
        }
    }
});

// 유저 마이페이지 조회
router.get('/mypage', checkToken, (req, res) => {
    try {
        const { id } = req.users[0];
        const sql = 'select * from users where id = ?';
    
        req.mysql.query(sql, id, (error, results) => {
            if(error){
                console.log(error.message);
                return res.status(500).json({ message : "데이터 전송에 오류가 발생하였습니다." });
            } else if(results.length !== 0){
                return res.status(200).json({ message : "유저 마이페이지 조회 완료", results });
            } else if(results.length === 0){
                return res.status(404).json({ message : "유저 정보가 존재하지 않습니다." });
            }
        });
    } catch (error){
        if(error){
            console.log(error.message)
            return res.status(500).json({ message : "유저 마이페이지 조회에 실패하였습니다." });
        }
    }
});

// 유저 상세 조회 (어드민만)
router.get('/:paramid', checkToken, rolesCheck, (req, res) => {
    try {
        const { paramid } = req.params;
        const sql = 'select * from users where id = ?';
    
        req.mysql.query(sql, paramid, (error, results) => {
            if(error){
                console.log(error.message);
                return res.status(500).json({ message : "데이터 전송에 오류가 발생하였습니다." });
            } else if(results.length !== 0){
                return res.status(200).json({ message : "유저 상세 조회 완료", results });
            } else if(results.length === 0){
                return res.status(404).json({ message : "유저 정보가 존재하지 않습니다." });
            }
        });
    } catch (error){
        if(error){
            console.log(error.message)
            return res.status(500).json({ message : "유저 상세 조회에 실패하였습니다." });
        }
    }
});

// 유저 정보 수정
router.patch('/', checkToken, async (req, res, next) => {
    try {
        const { id } = req.users[0];
        const sql1 = 'select nickname from users where nickname = ?';
        const sql2 = 'update users set password = ?, nickname = ?, isOpen = ?, image = ? where id = ?';
        const body = req.body;
        const hashPassword = await bcrypt.hash(body.password, ENV_PASSWORD_SALT);

        if(!body.password){
            return res.status(404).json({ message : "패스워드란이 누락되었습니다." });
        }

        if(body.nickname || body.nickname === ""){
            if(body.title.length === 0){
                return res.status(400).json({ message : "닉네임을 1자 이상으로 작성해주세요." });
            }
        } 

        const nicknameEnable = !body.nickname ? req.users[0].nickname : body.nickname;
        const isOpenEnable = typeof body.isOpen === 'undefined' ? Boolean(req.users[0].isOpen) : Boolean(body.isOpen);
        const imageEnable = !body.image ? req.users[0].image : body.image;
        const data = [hashPassword, nicknameEnable, isOpenEnable, imageEnable, id];

        req.mysql.beginTransaction((error) => {
            if(error){
                console.log("beginTransaction Error : ", error.message);
                return res.status(500).json({ message : "트랜잭션 시작 도중 오류가 발생하였습니다." })
            }
            req.mysql.query(sql1, nicknameEnable, (error, results) => {
                if(error){
                    console.log("users table Error : ", error.message);
                    return req.mysql.rollback(() => {
                        return res.status(500).json({ message : "데이터 전송에 오류가 발생하였습니다." });
                    });
                } else if(results.length !== 0 && results[0].nickname === body.nickname){
                    return req.mysql.rollback(() => {
                        return res.status(400).json({ message : "이미 존재하는 닉네임입니다." });
                    });
                }

                req.mysql.query(sql2, data, (error2, results2) => {
                    if(error2){
                        console.log("users table edit Error : ", error2.message);
                        return req.mysql.rollback(() => {
                            return res.status(500).json({ message : "데이터 전송에 오류가 발생하였습니다." });
                        });
                    } else if(results2.affectedRows === 0){
                        return req.mysql.rollback(() => {
                            return res.status(404).json({ message : "유저 정보가 존재하지 않습니다." });
                        });
                    } else if(results2.changedRows !== 0){
                        return req.mysql.commit((error, results) => {
                            if(error){
                                console.log("commit Error : ", error.message);
                                return req.mysql.rollback(() => {
                                    return res.status(500).json({ message : "트랜잭션 commit 과정 중 에러가 발생하였습니다." });
                                });
                            } else if(results){
                                res.clearCookie('authrization');
                                return res.status(201).json({ message : "유저 정보를 정상적으로 수정하였습니다." });
                            }
                        });
                    } 
                });
            });
        });
    } catch (error) {
        if(error){
            console.log(error.message)
            return res.status(500).json({ message : "유저 정보 수정에 실패하였습니다." });
        }
    }
});

// 유저 소프트 삭제
router.patch('/softdelete', checkToken, (req, res, next) => {
    try {
        const { id } = req.users[0];
        const sql = 'update users set deletedAt = ? where id = ?';
        const deletedAtNow = new Date();
        const resultData = [deletedAtNow, id];
        
        req.mysql.query(sql, resultData, (error, results) => {
            if(error){ 
                console.log(error.message);
                return res.status(500).json({ message : "데이터 전송에 오류가 발생하였습니다." });
            } else if(results.changedRows !== 0){
                res.clearCookie('authrization');
                return res.status(201).json({ message : "유저 정보를 정상적으로 삭제하였습니다." });
            } else if(results.affectedRows === 0){
                return res.status(404).json({ message : "유저 정보가 존재하지 않습니다." });
            }
        });
    } catch (error) {
        if(error){
            console.log(error.message)
            return res.status(500).json({ message : "유저 삭제에 실패하였습니다." });
        }
    }
});

// 유저 삭제
router.delete('/',checkToken, (req, res, next) => {
    try {
        const { id } = req.users[0];
        const sql = 'delete from users where id = ?';
    
        req.mysql.query(sql, id, (error, results) => {
            if(error){
                console.log(error.message);
                return res.status(500).json({ message : "데이터 전송에 오류가 발생하였습니다." });
            } else if(results.affectedRows !== 0){
                res.clearCookie('authrization');
                return res.status(201).json({ message : "유저 정보를 정상적으로 삭제하였습니다." });
            } else if(results.affectedRows === 0){
                return res.status(404).json({ message : "유저 정보가 존재하지 않습니다." });
            }
        });
    } catch (error) {
        if(error){
            console.log(error.message)
            return res.status(500).json({ message : "유저 삭제에 실패하였습니다." });
        }
    }
});


// 유저 삭제 복구 요청
router.post('/restore', checkToken, async (req, res, next) => {
    try {
        const users = req.users[0];
        const body = req.body;  

        if(!body.title){
            return res.status(404).json({ message : "문의 제목(title)을 작성해주세요." });
        }
    
        if(!body.content){
            return res.status(404).json({ message : "문의 내용(content)을 작성해주세요." });
        }
    
        if(body.title || body.title === ""){
            if(body.title.length === 0)
            return res.status(400).json({ message : "문의 제목을 1자 이상으로 작성해주세요." });
        }
    
        if(body.content || body.content === ""){
            if(body.content.length === 0)
            return res.status(400).json({ message : "문의 내용을 1자 이상으로 작성해주세요." });
        }
    
        await sendUserEmail(users.email, users.nickname, body.title, body.content);

        return res.status(201).json({ message : "계정 문의 요청을 완료하였습니다." });
    } catch (error) {
        if(error){
            console.log(error.message)
            return res.status(500).json({ message : "계정 문의 요청을 실패하였습니다." });
        }
    }
}); 


export default router;