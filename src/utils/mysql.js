import mysql from "mysql2";
import { ENV_DB_HOST, ENV_DB_PORT, ENV_DB_USER, ENV_DB_PASSWORD, ENV_DB_DATABASE } from "./const-config.js";

const db_info = {
    host: ENV_DB_HOST,
    port: ENV_DB_PORT,
    user: ENV_DB_USER, 
    password: ENV_DB_PASSWORD,
    database: ENV_DB_DATABASE
  };

  console.log(process.env.ENV_DB_HOST)

  console.log(db_info)


  const module = {
    init: function () {
      return mysql.createConnection(db_info);
    },
    connect: function (conn) {
      conn.connect(function (err) {
        if (err) console.error("mysql 연결 에러! : " + err);
        else console.log("mysql 정상적으로 연결 완료!");
      });
    },
  };

  export default module;