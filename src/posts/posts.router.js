import express from "express";
import checkToken from "../utils/jwt/checkToken.js";

const router = express.Router();


// 게시글 전체 조회
router.get("/", checkToken, (req, res) => {
    const sql = "SELECT * FROM posts";
    req.mysql.query(sql , (error, results) => {
        if (error) {
            console.log(error.message);
            return res.status(500).json({ message : "데이터 전송에 오류가 발생하였습니다." });
        } else if(results.length !== 0){
            return res.status(200).json({ message : "데이터 전송완료", results });
        } else if(results.length === 0){
            return res.status(404).json({ message : "데이터가 존재하지 않습니다." });
        }
    });
});

// 게시글 상세 조회
router.get("/:id", checkToken, (req, res) => {
    const { id } = req.params;
    const sql = "select * from posts where id = ?";
    
    req.mysql.query(sql, id, (error, results) => {
        if(error){
            console.log(error.message);
            return res.status(500).json({ message : "데이터 전송에 오류가 발생하였습니다." });
        } else if(results.length !== 0){
            return res.status(200).json({ message : "데이터 전송완료", results });
        } else if(results.length === 0){
            return res.status(404).json({ message : "데이터가 존재하지 않습니다." });
        }
    });
});



// 게시글 생성
router.post("/", checkToken, (req, res, next) => {
    const body = req.body;
    const sql = "insert into posts(title, content, category) values (?, ?, ?)";
    const data = [body.title, body.content, body.category];
    
    req.mysql.query(sql, data, (error, results) => {
        if(error){
            console.log(error.message);
            return res.status(500).json({ message : "데이터 전송에 오류가 발생하였습니다." });
        } else if(results){
            return res.status(201).json({ message : "데이터를 정상적으로 생성하였습니다." });
        }
    });
});

// 게시글 수정
router.patch("/:id", checkToken, (req, res, next) => {
    const { id } = req.params;
    const body = req.body;
    const sql = "update posts set title = ?, content = ?, category = ? where id = ?";
    const data = [body.title, body.content, body.category, id];
    req.mysql.query(sql, data, (error, results) => {
        if(error){
            console.log(error.message);
            return res.status(500).json({ message : "데이터 전송에 오류가 발생하였습니다." });
        } else if(results.changedRows !== 0){
            return res.status(201).json({ message : "데이터를 정상적으로 수정하였습니다." });
        } else if(results.affectedRows === 0){
            return res.status(404).json({ message : "데이터가 존재하지 않습니다." });
        }
    });
});

// 게시글 삭제
router.delete("/:id", checkToken, (req, res, next) => {
    const { id } = req.params;
    const sql = "delete from posts where id = ?";

    req.mysql.query(sql, id, (error, results) => {
        console.log(results)
        if(error){
            console.log(error.message);
            return res.status(500).json({ message : "데이터 전송에 오류가 발생하였습니다." });
        } else if(results.changedRows !== 0){
            return res.status(201).json({ message : "데이터를 정상적으로 삭제하였습니다." });
        } else if(results.affectedRows === 0){
            return res.status(404).json({ message : "데이터가 존재하지 않습니다." });
        }
    });
});


export default router;