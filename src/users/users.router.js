import express from "express";
import checkToken from "../utils/jwt/checkToken.js";
import rolesCheck from "../utils/roles-Check.js";
import bcrypt from "bcrypt";
import { sendUserEmail } from "../utils/sendEmail.middleware.js";
import { ENV_PASSWORD_SALT } from "../utils/const-config.js";

const router = express.Router();


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
            console.log(error.message)
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