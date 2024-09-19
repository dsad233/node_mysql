import express from "express";
import checkToken from "../utils/jwt/checkToken.js";
import { sendPostEmail } from "../utils/sendEmail.middleware.js";

const router = express.Router();

// 내가 작성한 게시글 조회
router.get('/mypost', checkToken, (req, res) => {
    try {
        const { id } = req.users[0];
        const sql = 'select * from posts where userId = ?';
    
        req.mysql.query(sql, id, (error, results) => {
            if (error) {
                console.log(error.message);
                return res.status(500).json({ message : "데이터 전송에 오류가 발생하였습니다." });
            } else if(results.length !== 0){
                return res.status(200).json({ message : "내 게시글 조회 완료", results });
            } else if(results.length === 0){
                return res.status(404).json({ message : "게시글이 존재하지 않습니다." });
            }
        });
    } catch (error) {
        if(error){
            console.log(error.message)
            return res.status(500).json({ message : "내 게시글 조회에 실패하였습니다." });
        }
    }
});

// 게시글 전체 조회
router.get("/", (req, res) => {
    try {
        const sql = "SELECT * FROM posts where isOpen = true and deletedAt is null";
        req.mysql.query(sql , (error, results) => {
            if (error) {
                console.log(error.message);
                return res.status(500).json({ message : "데이터 전송에 오류가 발생하였습니다." });
            } else if(results.length !== 0){
                return res.status(200).json({ message : "게시글 전체 조회 완료", results });
            } else if(results.length === 0){
                return res.status(404).json({ message : "게시글이 존재하지 않습니다." });
            }
        });
    } catch (error){
        if(error){
            console.log(error.message)
            return res.status(500).json({ message : "게시글 전체 조회에 실패하였습니다." });
        }
    }
});

// music 게시글 전체 조회
router.get('/music', (req, res) => {
    try {
        const sql = 'select * from posts where category = "music" and isOpen = true and deletedAt is null';
        
        req.mysql.query(sql, (error, results) => {
            if (error) {
                console.log(error.message);
                return res.status(500).json({ message : "데이터 전송에 오류가 발생하였습니다." });
            } else if(results.length !== 0){
                return res.status(200).json({ message : "music 게시글 전체 조회 완료", results });
            } else if(results.length === 0){
                return res.status(404).json({ message : "게시글이 존재하지 않습니다." });
            }
        });
    } catch (error) {
        if(error){
            console.log(error.message)
            return res.status(500).json({ message : "music 게시글 조회에 실패하였습니다." });
        }
    }
});

// post 게시글 전채 조회
router.get('/post', (req, res) => {
    try {
        const sql = 'select * from posts where category = "post" and isOpen = true and deletedAt is null';
        
        req.mysql.query(sql, (error, results) => {
            if (error) {
                console.log(error.message);
                return res.status(500).json({ message : "데이터 전송에 오류가 발생하였습니다." });
            } else if(results.length !== 0){
                return res.status(200).json({ message : "post 게시글 전체 조회 완료", results });
            } else if(results.length === 0){
                return res.status(404).json({ message : "게시글이 존재하지 않습니다." });
            }
        });
    } catch (error) {
        if(error){
            console.log(error.message)
            return res.status(500).json({ message : "post 게시글 조회에 실패하였습니다." });
        }
    }
});

// day 게시글 전채 조회
router.get('/day', (req, res) => {
    try {
        const sql = 'select * from posts where category = "day" and isOpen = true and deletedAt is null';
        
        req.mysql.query(sql, (error, results) => {
            if (error) {
                console.log(error.message);
                return res.status(500).json({ message : "데이터 전송에 오류가 발생하였습니다." });
            } else if(results.length !== 0){
                return res.status(200).json({ message : "day 게시글 전체 조회 완료", results });
            } else if(results.length === 0){
                return res.status(404).json({ message : "게시글이 존재하지 않습니다." });
            }
        });
    } catch (error) {
        if(error){
            console.log(error.message)
            return res.status(500).json({ message : "day 게시글 조회에 실패하였습니다." });
        }
    }
});

// 게시글 상세 조회
router.get("/:paramid", checkToken, (req, res) => {
    try {
        const { paramid } = req.params;
        const sql = "select * from posts where id = ?";
        
        req.mysql.query(sql, paramid, (error, results) => {
            if(error){
                console.log(error.message);
                return res.status(500).json({ message : "데이터 전송에 오류가 발생하였습니다." });
            } else if(results.length !== 0 && results[0].deletedAt === null){
                return res.status(200).json({ message : "게시글 상세 조회 완료", results });
            } else if(results.length === 0){
                return res.status(404).json({ message : "게시글이 존재하지 않습니다." });
            } else if(results[0].deletedAt !== null){
                return res.status(404).json({ message : "삭제 진행 중인 게시물입니다." });
            }
        });
    } catch (error) {
        if(error){
            console.log(error.message)
            return res.status(500).json({ message : "게시글 상세 조회에 실패하였습니다." });
        }
    }
});



// 게시글 생성
router.post("/", checkToken, (req, res, next) => {
    try {
        const { id } = req.users[0];
        const body = req.body;
        const sql = "insert into posts(title, content, category, isOpen, userId) values (?, ?, ?, ?, ?)";
        const data = [body.title, body.content, body.category, body.isOpen, id];

        if(!body.title || body.title.length === 0){
            return res.status(400).json({ message : "게시물 제목란이 누락되었습니다." });
        }

        if(!body.category || body.category.length === 0){
            return res.status(400).json({ message : "게시물의 카테고리 (music, post, day) 중에 작성해주세요."});
        }
        
        req.mysql.query(sql, data, (error, results) => {
            if(error){
                console.log(error.message);
                return res.status(500).json({ message : "데이터 전송에 오류가 발생하였습니다." });
            } else if(results){
                return res.status(201).json({ message : "게시글을 정상적으로 생성하였습니다." });
            }
        });
    } catch (error) {
        if(error){
            console.log(error.message)
            return res.status(500).json({ message : "게시글 생성에 실패하였습니다." });
        }
    }
});

// 게시글 수정
router.patch("/:paramid", checkToken, (req, res, next) => {
    try {
        const { paramid } = req.params;
        const body = req.body;
        const selectPost = 'select * from posts where id = ? and deletedAt is null';
        const updatePost = "update posts set title = ?, content = ?, category = ?, isOpen = ? where id = ?";

        if(body.title || body.title === ""){
            if(body.title.length === 0){
                return res.status(400).json({ message : "게시물 제목을 1자 이상으로 작성해주세요." });
            }
        } 

        if(body.category || body.category === ""){
            if(body.category.length === 0){
                return res.status(400).json({ message : "게시물의 카테고리 (music, post, day) 중에 작성해주세요."});
            }
        }

        req.mysql.beginTransaction((error) => {
            if(error){
                console.log("beginTransaction Error : ", error.message);
                return res.status(500).json({ message : "트랜잭션 시작 도중 오류가 발생하였습니다." })
            }
            req.mysql.query(selectPost, paramid, (error, results) => {
                if(error){
                    console.log("posts table Error : ", error.message);
                    return req.mysql.rollback(() => {
                        return res.status(500).json({ message : "데이터 전송에 오류가 발생하였습니다." });
                    });
                } else if(results.length === 0){
                    return req.mysql.rollback(() => {
                        return res.status(404).json({ message : "게시글이 존재하지 않습니다." });
                    });
                }

                const titleEnable = !body.title ? results[0].title : body.title;
                const contentEnable = !body.content ? results[0].content : body.content;
                const categoryEnable = !body.category ? results[0].category : body.category;
                const isOpenEnable = typeof body.isOpen === 'undefined' ? Boolean(results[0].isOpen) : Boolean(body.isOpen);

                const data = [titleEnable, contentEnable, categoryEnable, isOpenEnable, paramid];

                req.mysql.query(updatePost, data, (error2, results2) => {
                    if(error2){
                        return req.mysql.rollback(() => {
                            return res.status(500).json({ message : "데이터 전송에 오류가 발생하였습니다." });
                        });
                    } else if(results2.affectedRows === 0){
                        return req.mysql.rollback(() => {
                            return res.status(404).json({ message : "게시글이 존재하지 않습니다." });
                        });
                    } else if(results2.affectedRows !== 0){
                        req.mysql.commit((error, results) => {
                            if(error){
                                console.log("commit Error : ", error.message);
                                return req.mysql.rollback(() => {
                                    return res.status(500).json({ message : "트랜잭션 commit 과정 중 에러가 발생하였습니다." });
                                });
                            } else if(results){
                                return res.status(201).json({ message : "게시글을 정상적으로 수정하였습니다." });
                            }
                        });
                    }
                });
            });
        });
    } catch (error) {
        if(error){
            console.log(error.message)
            return res.status(500).json({ message : "게시글 수정에 실패하였습니다." });
        }
    }
});

// 게시글 소프트 삭제
router.patch('/softdelete/:paramid', checkToken, (req, res, next) => {
    try {
        const { paramid } = req.params;
        const sql = 'update posts set deletedAt = ? where id = ?';
        const deletedAtNow = new Date();
        const resultData = [deletedAtNow, paramid];
    
        req.mysql.query(sql, resultData, (error, results) => {
            if(error){
                console.log(error.message);
                return res.status(500).json({ message : "데이터 전송에 오류가 발생하였습니다." });
            } else if(results.changedRows !== 0){
                return res.status(201).json({ message : "게시글을 정상적으로 삭제하였습니다." });
            } else if(results.affectedRows === 0){
                return res.status(404).json({ message : "게시글이 존재하지 않습니다." });
            }
        });
    } catch (error) {
        if(error){
            console.log(error.message)
            return res.status(500).json({ message : "게시글 삭제에 실패하였습니다." });
        }
    }
});

// 게시글 삭제
router.delete("/:paramid", checkToken, (req, res, next) => {
    try {
        const { paramid } = req.params;
        const sql = "delete from posts where id = ?";
    
        req.mysql.query(sql, paramid, (error, results) => {
            if(error){
                console.log(error.message);
                return res.status(500).json({ message : "데이터 전송에 오류가 발생하였습니다." });
            } else if(results.affectedRows !== 0){
                return res.status(201).json({ message : "게시글을 정상적으로 삭제하였습니다." });
            } else if(results.affectedRows === 0){
                return res.status(404).json({ message : "게시글이 존재하지 않습니다." });
            }
        });
    } catch (error) {
        if(error){
            console.log(error.message)
            return res.status(500).json({ message : "게시글 삭제에 실패하였습니다." });
        }
    }
});


// 게시글 삭제 복구 요청
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
        
        await sendPostEmail(users.email, users.nickname, body.title, body.content);
    
        return res.status(201).json({ message : "게시글 문의 요청을 완료하였습니다." });
    } catch (error) {
        if(error){
            console.log(error.message);
            return res.status(500).json({ message : "게시글 문의 요청에 실패하였습니다." });
        }
    }
});

export default router;