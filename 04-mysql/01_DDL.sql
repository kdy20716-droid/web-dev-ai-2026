/* 여러줄 주석 */
-- 한줄 주석
/*
    - 데이터(data) - 화면에 보여지거나, 사용자가 입력하거나, 저장해야 하는 정보
    - 데이터베이스(database) : 대이터를 저장하고 필요할 때 꺼내 쓰는 공간
    - DBMS(database management system) : 데이터베이스를 관리하는 프로그램
    - RDBMS(relational database management system) : 관계형 데이터베이스 관리 시스템
       예) MYSQL, ORACLE, PostgreSQL
    - SQL(structured query language) : 관계형 데이터베이스에서 데이터를 조회하거나 조작하기 위한 표준 언어
       - SQL 종류
        - DDL(Data Definition Language) : 데이터 정의어
           - DB의 구조를 정의하거나 변경, 삭제하기 위한 언어
           - CREATE : 생성, DROP : 삭제, ALTER : 수정
        - DML(Data Manipulation Language) : 데이터 조작어
           - 데이터를 조회하거나 조작하기 위한 언어
           - SELECT : 조회, INSERT : 추가, UPDATE : 수정, DELETE : 삭제 -> CRUD
        - DCL(Data Control Language) : 데이터 제어어
           - DB의 보안, 권한 권리, 무결성 제어를 위한 언어
           - GRANT : 권한 부여, REVOKE : 권한 회수
        - TCL(Transaction Control Language) : 트랜잭션 관리 언어
            - 트랜잭션 처리 및 제어를 위한 언어
            - COMMIT : 실행, ROLLBACK : 취소, SAVEPOINT : 임시저장
        

     - 엔티티(Entity) : 같은 성격을 가진 데이터를 묶어놓는 큰 주제
*/
/*
    DDL(Data Definition Language) : 데이터 정의어
    - 실제 데이터 값이 아닌 구조 자체를 정의하는 언어
    - 객체를 만들고(CREATE), 수정하고(ALTER), 삭제하는(DROP)하는 언어

    MySQL에서 객체 : 스키마(Schema), 테이블(Table), -> 많이 씀
                    뷰(View), 인덱스(Index), -> 중간정도
                    함수(Function), 프로시저(Procedure), 트리거(Trigger) -> 잘 안씀
*/
/*
    스키마 : 테이블들을 담는 큰 공간
    프로젝트 단위로 하나의 스키마를 만들어 사용
*/
-- 스키마 생성
CREATE DATABASE sample; -- MYSQL에서는 DATABASE랑 SCHEMA를 같은 뜻
CREATE SCHEMA cocktail;
/*
    CREATE TABLE 테이블명(
		컬럼명 자료형(크기),
        컬럼명 자료형(크기), ...
	);

    * 자료형
        1. 문자 :
            - CHAR / **VARCHAR** : 고정 및 가변 길이 문자, 반드시 크기 지정
            - TEXT : 매우 긴 문자열을 저장하는데 사용
        2. 숫자 :
            - **INT** : 정수값 저장하는데 사용
            - FLOAT / DOUBLE : 부동소수점 저장하는데 사용
            - DECIMAL : 고정소수점 저장하는데 사용
        3. 날짜 :
            - **DATE** : 날짜 저장하는데 사용
            - TIME : 시간 저장하는데 사용
            - DATETIME / TIMESTAMP : 날짜와 시간을 함께 저장하는데 사용
        4. 불리언
            - BOOLEAN / BOOL : 참(True) 또는 거짓(False) 값을 저장하는데 사용
        5. 이진 데이터
            - BLOB : 이진 데이터를 저장하는데 사용, 이미지나 동영상과 같은 이진 파일
            -> 실제로는 이미지나 동영상은 따로 관리 (URL로 문자형으로 저장)

    - 엔티티(Entity) : 같은 성격을 가진 데이터를 묶어놓는 큰 주제
    - 테이블 : 같은 성격의 데이터를 모아두는 곳
    - 컬럼 : 테이블 안에서 각 정보의 종류를 구분하는 칸
    - 레코드(data) : 실제 저장된 데이터 한 줄

    * 데이터 모델링
    1. 개념적 모델링 : 어떤 정보가 필요한지 큰 묶음으로 정리
        ex) recipes, users
    2. 논리적 모델링 : 각 묶음에 어떤 컬럼이 필요한지 정리
        ex) recipes(name, image, descrpition)  
    3. 물리적 모델링 : 실제 DB에서 자료형과 제약조건까지 정해서 CREATE TABLE로 작성
        ex) name VARCHAR(50)
*/
CREATE TABLE recipes(
    name VARCHAR(50),
    image VARCHAR(200),
    descrpition TEXT
);
CREATE TABLE users(
    id VARCHAR(50),
    email VARCHAR(200),
    name VARCHAR(50),
    gender CHAR(1),
    password VARCHAR(200),
    nickname VARCHAR(100),
    phone VARCHAR(20),
    address VARCHAR(200),
    birth DATE
);
-- 아이디, 이메일, 이름, 성별, 비밀번호, 닉네임, 전화번호, 주소, 생년월일

