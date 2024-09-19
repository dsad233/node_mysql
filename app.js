import express from "express";
import db from "./src/utils/mysql.js";
import cookieParser from "cookie-parser";
import router from "./src/router.js";
import swagger from "./src/utils/swagger.js";

const app = express();
const port = 3000;
const connection = db.init();

db.connect(connection);

app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    req.mysql = connection;
    next();
});
app.use('/' , router);
const options = {
    explorer: true
  };
app.use('/api-docs', swagger.swaggerUi.serve, swagger.swaggerUi.setup(swagger.specs, options));

app.listen(port, () => {
    console.log(port, "서버가 정상적으로 실행중입니다.");
    console.log("swagger 주소 : http://localhost:3000/api-docs");
});
