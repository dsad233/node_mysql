import nodemailer from "nodemailer"; // 이메일 전송을 위한 nodemailer 모듈 불러오기
import { ENV_MAILER_EMAIL, ENV_MAILER_HOST, ENV_MAILER_PASSWORD, ENV_MAILER_PORT, ENV_ADMIN_MAILER } from "./const-config.js";

const transporter = nodemailer.createTransport({
  host: ENV_MAILER_HOST, 
  port: ENV_MAILER_PORT, 
  auth: {
    user: ENV_MAILER_EMAIL, 
    pass: ENV_MAILER_PASSWORD,
  },
});

async function sendUserEmail(email, nickname, title, content) {
  try {
    const mailOptions = {
      from: ENV_MAILER_EMAIL,  
      to: ENV_ADMIN_MAILER,
      subject: `계정 복구 요청 : ${email}`,
      html: `<h3>문의 제목 : ${title} </h3> <br>
      <p>닉네임 : ${nickname}</p> <br>
      <p>문의 내용 : ${content}</p>`,  
    };

    await transporter.sendMail(mailOptions);

  } catch (error) {
    if(error){
      console.log(error.message);
      console.log("문의 메일 요청을 실패하였습니다.")
   }
  }
}

async function sendPostEmail(email, nickname, title, content) {
  try {
    const mailOptions = {
      from: ENV_MAILER_EMAIL,  
      to: ENV_ADMIN_MAILER,
      subject: `게시글 복구 요청 : ${email}`,
      html: `<h3>문의 제목 : ${title} </h3> <br> 
      <p>닉네임 : ${nickname}</p> <br>
      <p>문의 내용 : ${content}</p>`,  
    };

    await transporter.sendMail(mailOptions);

  } catch (error) {
    if(error){
      console.log(error.message);
      console.log("문의 메일 요청을 실패하였습니다.")
   }
  }
}

export { sendUserEmail, sendPostEmail };
