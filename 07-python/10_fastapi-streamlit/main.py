"""
FastAPI
- 파이썬으로 API 서버를 만들 수 있게 해주는 웹 프레임워크
- 함수 하나에 URL 경로를 연결하기만 하면 API 하나가 완성
- 타입 힌트만 붙여도 자동으로 값 검증+ API 문서 (Swagger UI)까지 만들어줌
- uvicorn : FastAPI를 실행시켜주는 서버 프로그램

uv add fastapi uvicorn - 폴더 내 가상환경에 설치
uvicorn main:app --reload - FastAPI 서버 실행 (main.py 파일 내 app 객체를 찾아서 실행)
브라우저에서 http://127.0.0.1:8000/ 접속하면 {"Hello": "World"} 출력
"""
from fastapi import FastAPI
import pymysql

app = FastAPI()  # FastAPI 객체 생성

"""
DB 연결 함수
- API 요청이 올 때마다 접속해야 함
- 매번 연결 코드를 반복해서 쓰지 않도록, 연결하는 부분만 함수로 따로 빼둠
- cursorclass=pymysql.cursors.DictCursor : SELECT 결과를 딕셔너리 형태로 가져오기 위해 설정
"""
def get_db_connection():
    return pymysql.connect(
        host="127.0.0.1",
        user="root",
        password="qwer1234",
        database="testdb",
        cursorclass=pymysql.cursors.DictCursor
    )

@app.get("/")
def read_root():
    return {"message": "회원 관리 API"}

"""
CRUD를 HTTP 메서드로 표현
- 09에서 pymysql로 직접 했던 CRUD를, API에서는 HTTp 메서드로 구분해서 표현
- GET : 조회 - 데이터 가져오기
- POST : 생성 - 새 데이터 추가
- PUT : 수정 - 기존 데이터 수정
- DELETE : 삭제 - 기존 데이터 삭제
- FASTAPI에서는 @app.메서드() 데코레이터를 사용해서 HTTP 메서드와 URL 경로를 연결
"""

"""
Read - 회원 목록, 한 명 조회 API
"""
@app.get("/members")
def read_members():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM members")
    members = cursor.fetchall()
    conn.close()
    return {"members": members}

"""
경로 파라미터
- URL 경로에 변수를 넣어서 API를 만들 수 있음
- FastAPI는 경로 파라미터를 함수의 매개변수로 전달할 수 있음
- 함수 파라미터 이름과 {} 안 이름을 똑같이 맞추면 FASTAPI가 자동으로 값을 전달해줌
- 타입 힌트를 붙이면 문자열이 와도 자동으로 정수로 변환, 숫자가 아니면 자동으로 오류 응답
"""

@app.get("/members/{members_id}")
def read_member(members_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM members WHERE id = %s", (members_id,))
    member = cursor.fetchone()
    conn.close()
    return {"member": member}

"""
요청 본문과 Pydantic 모델
- POST, PUT 요청은 body에 데이터를 담아서 보내는 경우가 많음
- 회원 등록처럼 여러 값을 한 번에 보내야 하는 경우, body에 JSON 형태로 데이터를 담아서 보냄
- FastAPI에서는 pydantic의 basemodel로 "이 요청 본문엔 어떤 값들이 와야 하는지" 미리 설계
"""

"""
Create - 회원 추가 API
- POST 메서드로 회원 추가 API를 만들기 위해 @app.post() 데코레이터를 사용
- FastAPI는 POST 요청의 body에 담긴 JSON 데이터를 자동으로 파싱해서 함수의 매개변수로 전달
- FastAPI는 Pydantic 모델을 사용해서 요청 body의 데이터 구조를 정의하고 검증
"""
from pydantic import BaseModel

class Member(BaseModel):
    name: str
    address: str
    email: str
    phone_number: str
    job: str
    company: str

@app.post("/members")
def create_member(member: Member):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO members (name, address, email, phone_number, job, company) VALUES (%s, %s, %s, %s, %s, %s)", 
                   (member.name, member.address, member.email, member.phone_number, member.job, member.company))
    conn.commit()
    newid = cursor.lastrowid  # 새로 추가된 회원의 id 가져오기
    conn.close()
    return {"message": "회원이 추가되었습니다.", "id": newid}

"""
Update - 회원 수정 API
- PUT 메서드로 회원 수정 API를 만들기 위해 @app.put() 데코레이터를 사용
- FastAPI는 PUT 요청의 body에 담긴 JSON 데이터를 자동으로 파싱해서 함수의 매개변수로 전달
- FastAPI는 Pydantic 모델을 사용해서 요청 body의 데이터 구조를 정의하고 검증
"""

@app.put("/members/{members_id}")
def update_member(members_id: int, member: Member):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE members SET name = %s, address = %s, email = %s, phone_number = %s, job = %s, company = %s WHERE id = %s", 
                   (member.name, member.address, member.email, member.phone_number, member.job, member.company, members_id))
    conn.commit()
    conn.close()
    return {"message": "회원 정보가 수정되었습니다."}

"""
Delete - 회원 삭제 API
- DELETE 메서드로 회원 삭제 API를 만들기 위해 @app.delete() 데코레이터를 사용
- FastAPI는 DELETE 요청의 body에 담긴 JSON 데이터를 자동으로 파싱해서 함수의 매개변수로 전달
- FastAPI는 Pydantic 모델을 사용해서 요청 body의 데이터 구조를 정의하고 검증
"""

@app.delete("/members/{members_id}")
def delete_member(members_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    # 해당 ID가 없다면 404에러 처리
    cursor.execute("SELECT * FROM members WHERE id = %s", (members_id,))
    member = cursor.fetchone()
    if not member:
        conn.close()
        return {"message": "회원을 찾을 수 없습니다."}
    # 해당 ID가 있다면 삭제
    cursor.execute("DELETE FROM members WHERE id = %s", (members_id,))
    conn.commit()
    conn.close()
    return {"message": "회원이 삭제되었습니다."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

"""
과제
- 기간 : 7월 29일 (수)
- 09에서 진행한 과제에서 만든 코드를 FastAPI or express로 각각의 API 만들기
- 주제_이름.ipynb <- 앞에서 진행했던 파일에 그대로 붙여서 해도 상관없음
"""