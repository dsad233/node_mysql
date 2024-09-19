# node_mysql


> ## API List
### Auth
- ('/auth/register', POST) 회원 가입
- ('/auth/login', POST) 로그인
- ('/auth/logout', POST) 로그아웃


### Users
- ('/users', GET) 유저 전체 조회 [어드민만 접근 가능]
- ('/users/mypage', GET) 유저 마이페이지 조회
- ('/users/:paramid', GET) 유저 상세 조회 [어드민만 접근 가능]
- ('/users', PATCH) 유저 정보 수정
- ('/users/softdelete', PATCH) 유저 소프트 삭제
- ('/users', DELETE) 유저 삭제
- ('/users/restore', POST) 유저 삭제 복구 요청


### Posts
- ('/posts/mypost', GET) 내가 작성한 게시글 조회
- ('/posts', GET) 게시글 전체 조회
- ('/posts/music', GET) music 게시글 전체 조회
- ('/posts/post', GET) post 게시글 전체 조회
- ('/posts/day', GET) day 게시글 전체 조회
- ('/posts/:paramid', GET) 게시글 상세 조회
- ('/posts/:paramid', PATCH) 게시글 수정
- ('/posts/softdelete/:paramid', PATCH) 게시글 소프트 삭제
- ('/posts/:paramid', DELETE) 게시글 삭제
- ('/posts/restore', POST) 게시글 생성


### utils
- checkToken.js [토큰 유무 체크]
- signjwt.js [토큰 발급]
- roles-Check.js [어드민 권한 체크]
- sendEmail.middleware.js [nodemailer 설정]


---

#### ETC
- Mysqls
- Nodemailer
- Swagger


</br>
