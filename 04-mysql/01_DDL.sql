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


