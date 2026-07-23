# Express + Prisma

### 기술 스택

- Express : 라우팅, 미들웨어 기반 웹 프레임워크
- Prisma : DB 접근을 담당하는 ORM
- JWT : 로그인 상태를 유지하기 위한 토큰 발급/검증
- bcrypt : 비밀번호를 암호화된 형태로 저장
- multer + Cloudinary : 이미지 업로드 처리

### 실행

```bash
cd 05-express
npm i # or install
npm run dev
```

### 전체 구조

- package.json
- prisma : Prisma용 테이블 구조 정의
- src
  - app.js : 서버 시작점, 라우터 및 에러 미들웨어 연결, CORS 설정
  - **routes** : 라우팅 - URL 및 메서드를 해당 컨트롤러로 연결
  - middleware : 컨트롤러 실행 전 처리
    - auth.js : JWT 토큰 검증
    - upload.js : 이미지 업로드 -> Cloudinary 전송
    - error.js : 에러를 응답으로 변환
  - **controllers** : 요청에서 값을 꺼내고, 서비스를 호출하고, 응답 형태로 변환
  - **services** : 비즈니스 로직
  - **models** : Prisma로 recipes 테이블 접근
  - prisma.js : Prisma Client 생성
  - config/cloudinary.js : Cloudinary 연결 설정
  - utils/AppError.js : 상태 코드를 담은 에러 객체

### DB 테이블 구조

- `users` : 회원 정보 (id, name, email, password)
- `recipes` : 레시피 (id, user_id, name, image, description, name_eng, abv, difficulty, created_at)
- `ingredients` : 레시피별 재료 (id, recipe_id, name, amount, name_eng, abv)
- `directions` : 레시피별 만드는 순서 (id, recipe_id, content)
- `bars` : 용산구 칵테일바 정보 (id, name, street, dong, address, lat, lng, keywords)

## API 목록

- `POST /users/register` : 회원가입 (name, email, password)
- `POST /users/login` : 로그인 -> 성공 시 JWT 토큰 발급
- `GET /recipes` : 레시피 목록 조회 (페이지네이션, `keyword` 검색)
- `GET /recipes/:id` : 레시피 상세 조회 (재료 및 만드는 방법 포함, 없으면 404)
- `POST /recipes` : 레시피 등록 (로그인 필요, 이미지 파일 포함)
- `PUT /recipes/:id` : 레시피 수정 (로그인 필요, 작성자 본인만 가능)
- `DELETE /recipes/:id` : 레시피 삭제 (로그인 필요, 작성자 본인만 가능)
- `GET /bars` : 용산구 칵테일바 목록 조회 (`keyword`로 이름/동/키워드 검색 지원, 로그인 불필요)
