import nodemailer from "nodemailer"; // 이메일 전송을 위한 nodemailer 모듈 불러오기

async function sendEmail({ email }) {
  // 이메일 전송을 위한 메일 서버 연결
  const transporter = nodemailer.createTransport({
    host: process.env.MAILER_HOST, // 사용할 이메일 서비스의 호스트 주소 (gamil)
    port: Number(process.env.MAILER_PORT), // 이메일 서비스의 포트 번호 (일반적으로 25, 587, 465, 2525 중 하나 사용)
    auth: {
      // 이메일 서버 인증을 위한 사용자의 이메일 주소와 비밀번호
      user: process.env.MAILER_EMAIL, // 이메일 주소
      pass: process.env.MAILER_PASSWORD, // 이메일 비밀번호 (그대로 노출되기 때문에 구글의 app 패스워드를 사용할 것을 추천한다.)
    },
  });

  try {
    let token = 4444;

    // 메일 옵션 설정
    const mailOptions = {
      from: process.env.MAILER_EMAIL,
      to: email,
      subject: `인증번호 메일`,
      text: `인증번호를 입력해주세요. : ${token}`,
    };

    // 이메일 전송
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("오류가 발생하였습니다.");
    console.log(error.message);
  }
}

export default sendEmail;
