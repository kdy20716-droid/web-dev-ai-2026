/*
	- 데이터(data) : 화면에 보이거나, 사용자가 입력하거나, 저장해야 하는 정보
    - 데이터베이스(database) : 데이터를 저장하고 필요할 때 꺼내 쓰는 공간
    - DBMS(database management system) : 데이터베이스를 관리하는 프로그램
    - RDBMS(relational database management system) : 관계형 데이터베이스 관리 시스템
       예) MySQL, Oracle, PostgreSQL
    - SQL(Structured Query Language)
        : 관계형 데이터베이스에서 데이터를 조회하거나 조작하기 위한 표준 언어

    - SQL 종류
        - DDL(Data Definition Language) : 데이터 정의어
            - DB의 구조를 정의하거나 변경, 삭제하기 위한 언어
            - CREATE : 생성, ALTER : 수정, DROP : 삭제
        - DML(Data Manipulation Language) : 데이터 조작어
            - 데이터를 조작하기 위한 언어
            - INSERT : 추가, UPDATE : 수정, DELETE : 삭제
        - DQL(Data Query Language) : 데이터 질의어
            - 데이터를 조회(검색)하기 위한 언어
            - SELECT : 조회
        - DCL(Data Control Language) : 데이터 제어어
            - DB의 보안, 권한 관리, 무결성 제어를 위한 언어
            - GRANT : 권한 부여, REVOKE : 권한 회수
        - TCL(Transaction Control Language) : 트랜잭션 제어어
            - 트랜잭션 처리 및 제어를 위한 언어
            - COMMIT : 실행, ROLLBACK : 취소, SAVEPOINT : 임시저장
*/

-- 1. SELECT 기초
/*
	SELECT 컬럼, [컬럼, ...]
    FROM 테이블명;

    - 테이블에서 데이터를 조회할 때 사용하는 SQL문
    - SELECT를 통해서 조회된 결과를 RESULT SET이라고 한다. (즉, 조회된 행들의 집합)
    - 조회하고자 하는 컬럼들은 반드시 FROM 절에 기술한 테이블에 존재하는 컬럼이어야 한다.
    - 모든 컬럼을 조회할 경우 컬럼명 대신 * 기호 사용
*/
-- actor 테이블의 전체 배우의 모든 컬럼(*) 정보 조회
SELECT *
FROM actor;

-- film 테이블에서 전체 영화의 film_id, title, rental_rate만 조회
-- 직접 작성해보기


-- 관례상 SQL 키워드는 대문자로 작성

-- 실습문제 --------
-- 1. category 테이블의 모든 정보 조회
-- 직접 작성해보기


-- 2. category 테이블의 장르 이름(name)만 조회
-- 직접 작성해보기


-- 3. country 테이블의 모든 정보 조회
-- 직접 작성해보기


-- 4. customer 테이블의 고객명(first_name, last_name), 이메일(email),
--    가입일(create_date) 정보만 조회
-- 직접 작성해보기


-- 5. film 테이블의 개봉연도(release_year), 제목(title), 대여료(rental_rate) 조회
-- 직접 작성해보기


/*
	컬럼 산술 연산
    - SELECT 절에 컬럼명 입력 부분에 산술연산자를 사용하여 결과를 조회할 수 있다.
*/
-- film 테이블에서 제목(title), 대여료(rental_rate), 대여기간(rental_duration) 동안
-- 이 영화를 계속 빌린다고 가정했을 때의 누적 대여료(rental_rate * rental_duration) 조회
SELECT title, rental_rate, rental_rate * rental_duration
FROM film;

/*
	컬럼 별칭
    컬럼 as 별칭 / 컬럼 as "별칭" / 컬럼 별칭 / 컬럼 "별칭"

    - 산술연산을 하면 컬럼명이 지저분해진다.
      이때 컬럼명에 별칭을 부여해서 깔끔하게 보여줄 수 있다.
    - 별칭을 부여할 때 띄어쓰기 혹은 특수문자가 포함될 경우 반드시 큰따옴표(")로 감싸준다.
*/
SELECT
	title as 영화제목,
    rental_rate "대여료",
    rental_rate * rental_duration as 누적대여료
FROM film;

/*
	리터럴
    - SELECT 절에 리터럴을 사용하면 테이블에 존재하는 데이터처럼 조회가 가능
*/
-- film 테이블에서 film_id, title, rental_rate, 통화 단위('달러') 조회
SELECT film_id, title, rental_rate, '달러'
FROM film;

/*
	DISTINCT
    - 컬럼에 중복된 값들을 한번씩만 표시하고자 할 때 사용
*/
-- film 테이블에 존재하는 등급(rating) 종류 조회
SELECT DISTINCT rating
FROM film;

-- film 테이블에 존재하는 언어코드(language_id) 종류 조회
SELECT DISTINCT language_id
FROM film;

-- film 테이블에 존재하는 등급, 언어코드 조합 조회
-- 유의사항! DISTINCT는 SELECT절에 딱 한번만 기술 가능
SELECT DISTINCT rating, language_id
FROM film;


-- 2. WHERE 조건절
/*
	WHERE 절

    SELECT 컬럼, 컬럼, ...
    FROM 테이블명
    WHERE 조건식;

    - 조회하고자 하는 테이블로부터 특정 조건에 만족하는 데이터만 조회하고자 할 때 사용
    - 이때 WHERE 절에 조건식을 제시
    - 조건식에는 다양한 연산자 사용 가능

    비교 연산자
    >, <, >=, <= : 대소 비교
    = : 같은지 비교
    !=, <> : 같지 않은지 비교
*/
-- customer 테이블에서 store_id가 1인 고객들만 조회 (이때, 모든 컬럼 조회)
-- 직접 작성해보기


-- 실습문제 (테이블 : customer, film) ---
-- 1. store_id가 1인 고객들의 first_name, last_name, store_id만 조회
-- 직접 작성해보기


-- 2. store_id가 1이 아닌 고객들의 customer_id, first_name, store_id 조회
-- 직접 작성해보기


-- 3. 대여료(rental_rate)가 3달러 이상인 영화들의 title, rental_rate 조회
-- 직접 작성해보기


-- 4. 활성 고객(active 컬럼값이 1)인 고객들의 customer_id, first_name, active 조회
-- 직접 작성해보기


-- OR(또는), AND(그리고)
-- 등급이 'PG'이거나 대여료가 3달러 이상인 영화들의 title, rating, rental_rate 조회
SELECT title, rating, rental_rate
FROM film
WHERE rating = 'PG' OR rental_rate >= 3;

-- 상영시간(length)이 90분 이상 120분 이하인 영화들의
-- title, film_id, length 조회
SELECT title, film_id, length
FROM film
WHERE 90 <= length AND length <= 120;

/*
	BETWEEN AND
    - 조건식에서 사용되는 구문
    - 몇 이상 몇 이하인 범위에 대한 조건을 제시할 때 사용되는 연산자

    비교대상컬럼 BETWEEN 하한값 AND 상한값
*/
-- 상영시간(length)이 90분 이상 120분 이하인 영화들의
-- title, film_id, length 조회
SELECT title, film_id, length
FROM film
WHERE length BETWEEN 90 AND 120;

-- 결제일(payment_date)이 '2005-05-25' ~ '2005-06-01' 사이인 결제 내역 전체 조회
SELECT *
FROM payment
WHERE payment_date BETWEEN '2005-05-25' AND '2005-06-01';

/*
	LIKE
    - 비교하고자 하는 컬럼값이 내가 제시한 특정 패턴에 만족될 경우 조회

    비교대상컬럼 LIKE '특정패턴'
    - 특정패턴에는 '%', '_'를 와일드카드로 사용

    '%' : 0글자 이상
    비교대상컬럼 LIKE '문자%' => 비교대상컬럼값이 문자로 "시작"되는걸 조회
    비교대상컬럼 LIKE '%문자' => 비교대상컬럼값이 문자로 "끝"나는걸 조회
    비교대상컬럼 LIKE '%문자%' => 비교대상컬럼값이 문자가 "포함"되는걸 조회 (검색 기능)

    '_' : 1글자
    비교대상컬럼 LIKE '_문자' => 비교대상컬럼값에 문자앞에 무조건 한글자가 올 경우 조회
    비교대상컬럼 LIKE '__문자' => 비교대상컬럼값에 문자앞에 무조건 두글자가 올 경우 조회
    비교대상컬럼 LIKE '_문자_' => 비교대상컬럼값에 문자 앞과 뒤에 무조건 한글자씩 올 경우 조회
*/
-- 성(last_name)이 'A'로 시작하는 배우들의 first_name, last_name 조회
SELECT first_name, last_name
FROM actor
WHERE last_name LIKE 'A%';

-- 제목(title)에 'LOVE'가 포함된 영화들의 title, description, rental_rate 조회
SELECT title, description, rental_rate
FROM film
WHERE title LIKE '%LOVE%';

-- 성(last_name)이 정확히 4글자이면서 마지막 글자가 'S'인 배우 조회 (검색 X, 길이+패턴)
SELECT first_name, last_name
FROM actor
WHERE last_name LIKE '___S';

-- 실제 데이터에 %, _ 문자 자체가 포함되어 있을 때는 ESCAPE 옵션으로
-- 나만의 와일드카드를 지정해서 진짜 문자 그대로 검색할 수 있다.
-- 예) 문자열 'A_B'에서 _를 와일드카드가 아닌 진짜 언더바로 찾고 싶은 경우
SELECT 'A_B' LIKE 'A#_B' ESCAPE '#'; -- 1(TRUE) : # 뒤의 _는 와일드카드가 아니라 진짜 문자
SELECT 'AXB' LIKE 'A#_B' ESCAPE '#'; -- 0(FALSE)

-- NOT LIKE : 특정 패턴에 해당하지 않는 데이터 조회
-- 제목에 'LOVE'가 포함되지 않은 영화들의 title 조회
SELECT title
FROM film
WHERE title NOT LIKE '%LOVE%';

/*
	IS NULL / IS NOT NULL
    - 컬럼값에 NULL이 있을 경우 NULL 값 비교에 사용되는 연산자
    - NULL은 = 나 != 로 비교할 수 없고 반드시 IS NULL / IS NOT NULL 사용
*/
-- 아직 반납되지 않은 대여 건(rental.return_date가 NULL)의
-- rental_id, rental_date, return_date 조회
SELECT rental_id, rental_date, return_date
FROM rental
WHERE return_date IS NULL;

-- 원어(original_language_id)가 지정되지 않았지만 등급(rating)은 지정된
-- 영화들의 film_id, title, original_language_id, rating 조회
SELECT film_id, title, original_language_id, rating
FROM film
WHERE original_language_id IS NULL AND rating IS NOT NULL;

/*
	IN
    - 비교대상컬럼값이 내가 제시한 목록 중에 일치하는 값이 있는지
    비교대상컬럼 IN ('값1', '값2', ....) (검색필터에 자주 사용)
*/
-- 등급(rating)이 PG, PG-13, R인 영화들의 title, rating, rental_rate 조회
-- 직접 작성해보기


/*
	연산자 우선순위
    0. ()
    1. 산술연산자 : +, -, *, /, DIV, %, MOD
    2. 비교연산자 : =, !=, <>, <, <=, >, >=
    3. IS NULL / LIKE / IN
    4. BETWEEN AND
    5. NOT
    6. AND
    7. OR
*/

-- 실습문제 ----
-- 1. 등급(rating)이 'PG' 또는 'R'이면서 대여료(rental_rate)가 3달러 이상인
--    영화들의 모든 컬럼 조회
-- 직접 작성해보기


-- 2. 주소2(address2)와 우편번호(postal_code)가 모두 입력되지 않은 주소들의
--    address_id, address, district 조회
-- 직접 작성해보기


-- 3. 누적대여료(rental_rate * rental_duration)가 15달러 이상이고
--    원어(original_language_id)가 지정되지 않은 영화들의
--    film_id, title, rental_rate, original_language_id 조회
-- 직접 작성해보기


-- 4. 결제일(payment_date)이 '2005-07-01' 이후이고 금액(amount)이 0보다 큰
--    결제내역의 payment_id, customer_id, payment_date, amount 조회
--    (정렬은 결제일이 오래된 순서 - ORDER BY는 다음 섹션에서 다룸)
-- 직접 작성해보기


-- 5. 금액(amount)이 2달러 이상 5달러 이하이고 결제일이 '2005-07-01' 이후이고
--    대여 건(rental_id)과 연결된 결제내역의
--    payment_id, customer_id, amount, payment_date 조회
-- 직접 작성해보기


-- 6. 누적대여료(rental_rate * rental_duration)가 NULL이 아니고
--    제목에 'LOVE'가 포함된 영화들의
--    title, rental_rate, rental_duration, 누적대여료(별칭) 조회 (누적대여료 내림차순 정렬)
-- 직접 작성해보기



-- 3. ORDER BY / LIMIT
/*
	ORDER BY
    - SELECT문 가장 마지막 줄에 작성 뿐만 아니라 실행순서 또한 마지막에 실행

    3 SELECT 컬럼, 컬럼, ...
    1 FROM 테이블명
    2 WHERE 조건식
    4 ORDER BY 정렬하고자 하는 컬럼값 [ASC|DESC];

    - ASC : 오름차순 정렬 (생략시 기본값)
    - DESC : 내림차순 정렬
*/
-- 전체 대여 기록의 대여일(rental_date), 반납일(return_date) 조회
-- 반납일 기준 내림차순 정렬 (반납이 안 된 NULL 값이 어디에 위치하는지 확인)
SELECT rental_date, return_date
FROM rental
ORDER BY 2 DESC;

/*
	LIMIT
    - ORDER BY 절 보다 뒤에 조건을 걸고 싶을 때 사용
    - 출력되는 행 수를 제한하는 MySQL 전용 비표준 구문
    - 데이터 양을 제한하고자 할 때 유용 (페이징 처리)
*/
-- 대여료가 높은 5개 영화의 title, rental_rate 조회
SELECT title, rental_rate
FROM film
ORDER BY rental_rate DESC
LIMIT 5;

-- LIMIT 절은 두 개의 값이 있을 수 있음!
-- 첫번째 값은 오프셋(offset, 0부터 시작) 시작 행을 지정
-- 두번째 값은 반환할 최대 행 수를 지정
SELECT title, rental_rate
FROM film
ORDER BY rental_rate DESC
LIMIT 0, 10;

SELECT title, rental_rate
FROM film
ORDER BY rental_rate DESC
LIMIT 10 OFFSET 0;

-- 공식 : OFFSET = (페이지번호 - 1) * 페이지당 개수
-- 1페이지 : 1~10번째 영화 (0개 건너뛰고 10개)
SELECT * FROM film
ORDER BY film_id
LIMIT 10 OFFSET 0;

-- 2페이지 : 11~20번째 영화 (10개 건너뛰고 10개)
SELECT * FROM film
ORDER BY film_id
LIMIT 10 OFFSET 10;

-- SELECT - FROM - WHERE - GROUP BY - HAVING - ORDER BY - LIMIT 순으로 실행

-- 4. 함수 (단일행 함수)
/*
	함수 : 전달된 컬럼값을 읽어들여서 함수를 실행한 결과를 반환

    - 단일행 함수 : N개의 값을 읽어서 N개의 결과값 리턴 (매 행마다 함수 실행 결과 반환)
    - 그룹 함수 : N개의 값을 읽어서 1개의 결과값 리턴 (그룹별로 함수 실행 결과 반환)

    >> SELECT 절에 단일행 함수와 그룹 함수는 함께 사용하지 못함!
       왜? 결과 행의 개수가 다르기 때문에!

	>> 함수를 사용할 수 있는 위치 : SELECT, WHERE, ORDER BY, GROUP BY, HAVING
*/

/*
	문자 처리 함수

    LENGTH : 해당 문자열값의 BYTE 길이 수 반환
    - 한글 한글자 -> 3BYTE
    - 영문자, 숫자, 특수문자 한글자 -> 1BYTE
    CHAR_LENGTH : 해당 문자열값의 글자 수 반환
*/
SELECT
	length('데이터베이스'), char_length('데이터베이스'),
    length('database'), char_length('database');

-- 배우명(first_name), 배우명의 글자수 조회
SELECT first_name, char_length(first_name)
FROM actor;

/*
	INSTR(컬럼|'문자열', '찾으려는 문자열')
    - 특정 문자열에서 찾고자 하는 문자열의 위치 반환
    - 없으면 0 반환
*/
SELECT instr('AABAACAABBAA', 'B'), instr('AABAACAABBAA', 'D'); -- 3, 0

-- 's'가 포함되어 있는 이메일 중 이메일, 이메일의 @ 위치 조회
SELECT email, instr(email, '@')
FROM customer
WHERE email LIKE '%s%';

/*
	LPAD|RPAD(컬럼|'문자열', 최종적으로 반환할 문자의 길이, '덧붙이고자 하는 문자')
    - 문자열에 덧붙이고자 하는 문자를 왼쪽 또는 오른쪽에 덧붙여서
      최종적으로 반환할 문자의 길이만큼 문자열 반환
*/
SELECT lpad('hello', 10, '*'), rpad('hello', 10, '+');

/*
	TRIM(컬럼|'문자열') | TRIM([LEADING|TRAILING|BOTH] 제거하고자하는문자들 FROM 컬럼|'문자열')
    - 문자열의 앞/뒤/양쪽에 있는 지정한 문자들을 제거한 나머지 문자열 반환
*/
SELECT trim('        K H       '); -- 기본적으로 양쪽에 있는 공백 제거
SELECT trim(BOTH ' ' FROM '        K H       ');

SELECT trim(LEADING 'Z' FROM 'ZZZKHZZZ'); -- KHZZZ <-- 문자 제거는 LEADING
SELECT ltrim('        K H       '); -- LTRIM : 앞쪽 공백만 제거

SELECT trim(TRAILING 'Z' FROM 'ZZZKHZZZ'); -- ZZZKH
SELECT rtrim('        K H       '); -- RTRIM : 뒤쪽 공백만 제거

/*
	SUBSTR|SUBSTRING(컬럼|'문자열', 시작 위치 값, 추출할 문자 개수)
    - 문자열에서 특정 문자열을 추출해서 반환
*/
SELECT substr('PROGRAMMING', 5, 2); -- RA
SELECT substr('PROGRAMMING', 1, 6); -- PROGRA
SELECT substr('PROGRAMMING', -8, 3); -- GRA

-- 이메일에서 @ 앞부분만(아이디) 추출해서 이름, 이메일, 아이디 조회
SELECT first_name, email, substr(email, 1, instr(email, '@') - 1)
FROM customer;

/*
	LOWER : 다 소문자로 변경한 문자열 반환
    UPPER : 다 대문자로 변경한 문자열 반환
*/
SELECT lower('Welcome To MySQL'), upper('Welcome To MySQL');

-- 배우명(first_name, last_name)을 첫 글자만 대문자인 형태로 조회
-- 예) PENELOPE -> Penelope
SELECT
	concat(upper(substr(first_name, 1, 1)), lower(substr(first_name, 2))) 이름,
    concat(upper(substr(last_name, 1, 1)), lower(substr(last_name, 2))) 성
FROM actor;

/*
	REPLACE(컬럼|'문자열', '바꾸고 싶은 문자열', '바꿀 문자열')
    - 특정 문자열로 변경하여 반환
*/
SELECT replace('서울특별시 강남구 역삼동', '강남구', '서초구');

-- district 값 중 'California'를 'CA'로 바꿔서 조회
SELECT district, replace(district, 'California', 'CA')
FROM address
WHERE district = 'California';

/*
	CONCAT : 문자열을 하나로 합친 후 결과 반환
*/
-- 직접 작성해보기


-- 실습문제 ---
-- 1. 고객명을 '성, 이름' 형태로 합쳐서 first_name, last_name, 합친 이름 조회
-- 예) SMITH, MARY
-- 직접 작성해보기


-- 2. 이메일 도메인을 'sakilacustomer.org'에서 'gmail.com'으로 바꿔서
--    이름, 변경 전 이메일, 변경 후 이메일 조회
-- 직접 작성해보기


-- 3. 영화 제목(title)의 앞 10글자만 잘라서 미리보기(title_preview)로 조회
--    (10글자보다 길면 뒤에 '...' 붙이기)
-- 직접 작성해보기


/*
	숫자 처리 함수

	ABS : 절대값 반환
*/
SELECT abs(5.6), abs(-10);

/*
	숫자 DIV 숫자 = 숫자 / 숫자
    숫자 MOD 숫자 = 숫자 % 숫자 = MOD(숫자, 숫자)
*/
SELECT
	10 DIV 3, 10 / 3,
    10 MOD 3, 10 % 3, mod(10, 3);

/*
	ROUND(숫자, [위치])
    - 반올림한 결과를 반환
*/
SELECT round(123.567), round(123.567, 2), round(123.567, -1);

/*
	CEIL : 올림 처리해서 반환
    FLOOR : 버림 처리해서 반환
*/
SELECT ceil(123.152), floor(123.952);

/*
	TRUNCATE(숫자, 위치)
    - 위치 지정하여 버림 처리해서 반환
*/
SELECT truncate(123.456, 1), truncate(123.456, -1);

-- 대여료(rental_rate)에 부가세 10%를 붙인 금액을 소수점 둘째자리까지 반올림해서 조회
SELECT title, rental_rate, round(rental_rate * 1.1, 2) 부가세포함가격
FROM film;

/*
	날짜 처리 함수
    NOW, CURRENT_TIMESTAMP : 현재 날짜와 시간 반환
    CURDATE, CURRENT_DATE : 현재 날짜 반환
    CURTIME, CURRENT_TIME : 현재 시간 반환
*/
SELECT
	now(), current_timestamp(),
	curdate(), current_date(),
	curtime(), current_time();

/*
	DAYOFYEAR : 날짜가 해당 연도에서 몇 번째 날인지 반환
    DAYOFMONTH : 날짜가 해당 월에서 몇 번째 날인지 반환
    DAYOFWEEK : 날짜가 해당 주에서 몇 번째 날인지 반환 (일요일 = 1, 토요일 = 7)
*/
SELECT dayofyear(now()), dayofmonth(now()), dayofweek(now());

/*
	DATEDIFF(날짜, 날짜) : 두 날짜 사이의 일수를 숫자로 반환
    TIMESTAMPDIFF(날짜단위, 날짜, 날짜) : 두 날짜 사이의 기간을 날짜단위에 따라 변환

    * 날짜단위 : YEAR(연도), QUARTER(분기), MONTH(월), WEEK(주), DAY(일)
               HOUR(시간), MINUTE(분), SECOND(초)
*/
-- 대여일(rental_date)로부터 반납일(return_date)까지 며칠이 걸렸는지 조회
SELECT rental_id, rental_date, return_date, datediff(return_date, rental_date) 대여일수
FROM rental
WHERE return_date IS NOT NULL;

-- 고객명, 가입일(create_date), 가입 후 지금까지 며칠/몇개월/몇년이 지났는지 조회
SELECT
	first_name, create_date,
    timestampdiff(day, create_date, now()) "가입 후 일수",
    timestampdiff(month, create_date, now()) "가입 후 개월수",
    timestampdiff(year, create_date, now()) "가입 후 년수"
FROM customer;

/*
	ADDDATE(날짜, INTERVAL 숫자 날짜단위)
    - 특정 날짜에 입력받은 정보만큼 더한 날짜를 반환
    SUBDATE(날짜, INTERVAL 숫자 날짜단위)
    - 특정 날짜에 입력받은 정보만큼 뺀 날짜를 반환
*/
SELECT
	now(),
    adddate(now(), interval 10 year),
    subdate(now(), interval 15 day);

-- 대여일(rental_date)로부터 7일 후가 연체 기준일이라고 가정했을 때
-- 대여일, 연체 기준일 조회
SELECT rental_id, rental_date, adddate(rental_date, interval 7 day) 연체기준일
FROM rental;

/*
	YEAR, MONTH, DAY, HOUR, MINUTE, SECOND
    - 특정 날짜에 연도, 월, 일, 시간, 분, 초 정보를 각각 추출해서 반환
*/
SELECT
	year(now()), month(now()), day(now()),
	hour(now()), minute(now()), second(now());

-- 결제 연도, 결제 월별로 오래된 순으로 payment_id, 결제년도, 결제월 조회
SELECT
	payment_id,
    year(payment_date) 결제년도,
    month(payment_date) 결제월
FROM payment
ORDER BY 결제년도, 결제월;

/*
	포맷 함수
    FORMAT(숫자, 위치) : 숫자에 3단위씩 콤마 추가해서 반환
    DATE_FORMAT(날짜, 포맷형식) : 날짜 형식을 변경해서 반환
*/
SELECT amount, format(amount, 2)
FROM payment;

SELECT
	now(),
    date_format(now(), '%Y.%m.%d'), -- %Y : 년도, %m : 월, %d : 일
    date_format(now(), '%Y.%m.%d %T'); -- %T : 시간 전체, %H : 시, %i : 분, %s : 초

-- 고객명, 가입일(2006년 02월 14일 14시 05분 30초 형태) 조회
SELECT first_name, date_format(create_date, '%Y년 %m월 %d일 %H시 %i분 %s초')
FROM customer;

/*
	NULL 처리 함수

    COALESCE|IFNULL(값, 값이 NULL일 경우 반환할 값)
*/
-- 대여 건들의 rental_id, 반납일(return_date), 반납일이 없으면 '미반납'으로 조회
SELECT rental_id, coalesce(return_date, '미반납')
FROM rental;

-- 원어(original_language_id)가 없으면 '자체제작'으로 표시해서 조회
SELECT title, ifnull(original_language_id, '자체제작')
FROM film;

/*
	NULLIF(값1, 값2)
    - 두 개의 값이 동일하면 null 반환, 두 개의 값이 동일하지 않으면 값1 반환
*/
SELECT nullif('123', '123'), nullif('123', '456'); -- null, 123

/*
	IF(조건, 조건이 True인 경우, 조건이 False인 경우)
    - 조건에 해당하면 두번째 값 반환, 해당하지 않으면 마지막 값 반환
*/
-- 대여 건들의 rental_id, 반납여부(반납일이 있으면 '반납완료', 없으면 '대여중') 조회
SELECT
	rental_id, return_date,
    if(return_date IS NULL, '대여중', '반납완료') 반납여부
FROM rental;

-- 영화 제목, 등급(rating), 상영 가능 여부 조회
-- 정렬 : 등급 오름차순
-- 등급이 'G'인 영화는 '전체 관람가'
-- 등급이 'PG'인 영화는 '보호자 동반가'
-- 등급이 'PG-13'인 영화는 '13세 이상 권장'
-- 그 외 등급은 '청소년 관람불가'
SELECT
	title, rating,
    if(rating = 'G', '전체 관람가',
		if(rating = 'PG', '보호자 동반가',
			if(rating = 'PG-13', '13세 이상 권장', '청소년 관람불가'))) 상영등급안내
FROM film
ORDER BY rating;

/*
	CASE WHEN 조건식 1 THEN 결과값 1
		 WHEN 조건식 2 THEN 결과값 2
         ....
		 ELSE 결과값 N
	END

    -> if ~ else if ~ else 문과 유사
*/
SELECT
	title, rating,
    case when rating = 'G' then '전체 관람가'
		 when rating = 'PG' then '보호자 동반가'
         when rating = 'PG-13' then '13세 이상 권장'
         else '청소년 관람불가'
	 end 상영등급안내
FROM film
ORDER BY rating;

-- 영화 제목, 상영시간(length), 상영시간 등급(1~4등급) 조회
-- length 값이 120분 초과일 경우 1등급(장편)
-- length 값이 120분 이하 90분 초과일 경우 2등급
-- length 값이 90분 이하 60분 초과일 경우 3등급
-- 그 외의 경우 4등급(단편)
SELECT
	title, length,
	case when length > 120 then '1등급'
		 when length > 90 then '2등급'
         when length > 60 then '3등급'
         else '4등급'
	  end 상영시간등급
FROM film;


-- 5. 그룹 함수와 GROUP BY / HAVING
/*
	그룹함수(집계함수) --> 결과값 1개!
    - 대량의 데이터들로 집계나 통계 같은 작업을 처리해야 하는 경우 사용되는 함수들
    - 모든 그룹 함수는 NULL 값을 자동으로 제외하고 값이 있는 것들만 계산

    SUM : 해당 컬럼 값들의 총 합계 반환
*/
-- 전체 결제 금액의 합 조회
SELECT sum(amount)
FROM payment;

-- customer_id가 1인 고객의 총 결제 금액 조회
SELECT sum(amount)
FROM payment
WHERE customer_id = 1;

SELECT sum(case when customer_id = 1 then amount end)
FROM payment;

/*
	AVG
    - 해당 컬럼 값들의 평균값을 반환
    - 모든 그룹 함수는 NULL 값을 자동으로 제외하기 때문에
      AVG 함수를 사용할 때는 COALESCE 또는 IFNULL 함수와 함께 사용하는 걸 권장
*/
-- 전체 영화의 평균 대여료, 평균 상영시간 조회
SELECT
	avg(rental_rate), avg(length),
	avg(ifnull(rental_rate, 0)), avg(ifnull(length, 0))
FROM film;

/*
	MIN : 해당 컬럼 값들 중에 가장 작은 값 반환
    MAX : 해당 컬럼 값들 중에 가장 큰 값 반환
*/
SELECT
	min(title), min(rental_rate), min(release_year),
    max(title), max(rental_rate), max(release_year)
FROM film;

/*
	COUNT
    - 컬럼 또는 행의 개수를 세서 반환

    * : 조회 결과에 해당하는 모든 행 개수 반환
    컬럼 : 해당 컬럼값이 NULL이 아닌 행 개수 반환
    distinct 컬럼 : 해당 컬럼값의 중복을 제거한 행 개수 반환
*/
-- 전체 영화 수 조회
SELECT count(*)
FROM film;

-- 반납된(=return_date가 NULL이 아닌) 대여 건수 조회
SELECT count(return_date)
FROM rental;

SELECT count(*)
FROM rental
WHERE return_date IS NOT NULL;

-- film 테이블에서 사용중인 등급(rating) 종류 수 조회
SELECT count(distinct rating)
FROM film;

/*
	GROUP BY
    - 그룹 기준을 제시할 수 있는 구문
    - 여러 개의 값들을 하나의 그룹으로 묶어서 처리할 목적으로 사용
*/
-- 등급(rating)별 영화 수, 총 대여료, 평균 대여료, 최저/최고 대여료 조회
SELECT
	rating,
    count(*) "영화 수",
    format(sum(rental_rate), 2) "총 대여료",
    format(avg(rental_rate), 2) "평균 대여료",
    min(rental_rate) "최저 대여료",
    max(rental_rate) "최고 대여료"
FROM film
GROUP BY rating;

-- 언어코드(language_id)별 영화 수 조회
SELECT language_id, count(*)
FROM film
GROUP BY language_id;

-- 매장(store_id)별 고객 수 조회
SELECT store_id, count(*)
FROM customer
GROUP BY store_id;

/*
	HAVING
    - 그룹에 대한 조건을 제시할 때 사용하는 구문

    5 SELECT    * | 조회하고자 하는 컬럼명 as 별칭 | 함수
    1 FROM      조회하고자 하는 테이블명
    2 WHERE     조건식 (연산자들 가지고 기술)
    3 GROUP BY  그룹 기준에 해당하는 컬럼명 | 함수
    4 HAVING    조건식 (그룹 함수를 가지고 기술)
    6 ORDER BY  컬럼명 | 컬럼순번 | 별칭 [ASC | DESC];
*/
-- 등급별 평균 대여료가 3달러 이상인 등급의 평균 대여료 조회
SELECT rating, format(avg(rental_rate), 2) 평균대여료
FROM film
GROUP BY rating
HAVING avg(rental_rate) >= 3;

-- 고객(customer_id)별 총 결제금액이 100달러 이상인 고객만 조회
SELECT customer_id, sum(amount)
FROM payment
GROUP BY customer_id
HAVING sum(amount) >= 100;

-- 배우(actor_id)별로 출연한 영화가 40편이 넘는 배우만 조회
SELECT actor_id, count(*)
FROM film_actor
GROUP BY actor_id
HAVING count(*) > 40;

/*
	rollup(컬럼1, 컬럼2) - 실제 볼일은 많지 않지만 알아두면 좋은 집계 함수
    - 그룹별 산출한 결과 값의 중간 집계를 계산 해주는 함수

    MySQL에서의 rollup
    컬럼1, 컬럼2 with rollup
*/
-- 매장별, 활성여부별 고객 수 조회 (중간 집계 포함)
SELECT store_id, active, count(*)
FROM customer
GROUP BY store_id, active WITH ROLLUP;

/*
	집합 연산자
    - 여러 개의 쿼리문을 하나의 쿼리문으로 만드는 연산자
    - 여러 개의 쿼리문에서 조회하려고 하는 컬럼의 개수와 이름이 같아야 사용할 수 있다.

    주의! ORDER BY 절은 쓰시려면 마지막에만 기술 가능

    UNION (합집합) : 두 쿼리문을 수행한 결과값을 하나로 합쳐서 추출 (중복되는 행 제거)
    UNION ALL (합집합) : 두 쿼리문을 수행한 결과값을 하나로 합쳐서 추출 (중복되는 행 제거 X)
    INTERSECT (교집합) : 두 쿼리문을 수행한 결과값에 중복된 결과값만 추출 (MySQL 8.0.31 이상)
    -- INTERSECT, MINUS(차집합) : 필요하면 WHERE절에서 AND 연산자를 사용해서 처리 가능!
*/
-- 1. UNION
-- (1) 등급(rating)이 'G'인 영화들의 film_id, title, rating, rental_rate 조회
SELECT film_id, title, rating, rental_rate
FROM film
WHERE rating = 'G'
UNION
-- (2) 대여료가 4달러를 초과하는 영화들의 film_id, title, rating, rental_rate 조회
SELECT film_id, title, rating, rental_rate
FROM film
WHERE rental_rate > 4
ORDER BY film_id;

-- 등급이 'G'이거나 대여료가 4달러를 초과하는 영화들의 film_id, title, rating, rental_rate 조회
-- 위 쿼리문 대신 WHERE 절에 OR 연산자를 사용해서 처리 가능
SELECT film_id, title, rating, rental_rate
FROM film
WHERE rating = 'G' OR rental_rate > 4;

-- 2. UNION ALL
SELECT film_id, title, rating, rental_rate
FROM film
WHERE rating = 'G'
UNION ALL
SELECT film_id, title, rating, rental_rate
FROM film
WHERE rental_rate > 4;

-- 6. JOIN
/*
	JOIN
    - 두 개 이상의 테이블에서 데이터를 조회하고자 할 때 사용하는 구문
    - 조회 결과는 하나의 결과물(RESULT SET)으로 나옴
    - 관계형 데이터베이스는 최소한의 데이터로 각각의 테이블에 담고 있음
      (중복을 최소화하기 위해 최대한 쪼개서 관리)
      영화 데이터는 film 테이블, 배우 데이터는 actor 테이블, 장르는 category 테이블 등...

      만약 어떤 영화가 어떤 장르에 속해있는지 장르명과 같이 조회하고 싶다면?
      만약 어떤 배우가 어떤 영화에 출연했는지 영화 제목과 같이 조회하고 싶다면?

      => 즉, 관계형 데이터베이스에서 SQL 문을 이용한 테이블 간에 "관계"를 맺어
         원하는 데이터만 조회하는 방법
*/
/*
	1. 내부 조인(INNER JOIN)
    - 연결시키는 컬럼의 값이 일치하는 행들만 조인되어 조회 (일치하는 값이 없는 행은 조회 X)

    1) WHERE 구문
    SELECT 컬럼, 컬럼, ...
    FROM 테이블1, 테이블2
    WHERE 테이블1.컬럼명 = 테이블2.컬럼명;

    - FROM 절에 조회하고자 하는 테이블들을 콤마(,)로 구분하여 나열
    - WHERE 절에 매칭시킬 컬럼명에 대한 조건 제시

    2) ANSI(미국국립표준협회) 표준 구문 -> 다른 DB에서도 사용 가능!
    SELECT 컬럼, 컬럼, ...
    FROM 테이블1
    [INNER] JOIN 테이블2 ON (테이블1.컬럼명 = 테이블2.컬럼명);

    - FROM 절에서 기준이 되는 테이블을 기술
    - JOIN 절에서 같이 조회하고자 하는 테이블을 기술 후 매칭 시킬 컬럼에 대한 조건을 기술 (ON, USING)
    - 연결에 사용하려는 컬럼명이 같은 경우 ON 구문 대신 USING(컬럼명) 구문 사용
*/
-- 1) 연결할 두 컬럼명이 다른 경우 (film : language_id - language : language_id는 같지만
--    film : original_language_id 처럼 이름이 다른 컬럼을 기준으로 붙이는 경우도 있음)
-- film_id, title, language_id, 언어명(name) 조회
SELECT film_id, title, film.language_id, name
FROM film, language
WHERE film.language_id = language.language_id;

-- >> ANSI 구문
SELECT film_id, title, film.language_id, name
FROM film
JOIN language ON (film.language_id = language.language_id);

-- 2) 연결할 두 컬럼명이 같은 경우 (film_actor : actor_id - actor : actor_id)
-- 배우 출연작 매핑 테이블(film_actor)과 배우 테이블(actor)을 연결해서
-- actor_id, first_name, last_name, film_id 조회
SELECT actor_id, first_name, last_name, film_id
FROM film_actor, actor
WHERE actor_id = actor_id; -- ambiguous : 애매한, 모호한 / 에러 발생!

-- 해결방법 1) 테이블명 이용
SELECT film_actor.actor_id, first_name, last_name, film_id
FROM film_actor, actor
WHERE film_actor.actor_id = actor.actor_id;

-- 해결방법 2) 테이블에 별칭 부여해서 이용
SELECT fa.actor_id, first_name, last_name, film_id
FROM film_actor fa, actor a
WHERE fa.actor_id = a.actor_id;

-- >> ANSI 구문
SELECT fa.actor_id, first_name, last_name, film_id
FROM film_actor fa
JOIN actor a ON (fa.actor_id = a.actor_id);

-- 두 컬럼명이 같을 때만 USING 구문 사용 가능!
SELECT actor_id, first_name, last_name, film_id
FROM film_actor
JOIN actor USING (actor_id);

-- 자연조인(NATURAL JOIN) : 각 테이블마다 동일한 컬럼이 한 개만 존재할 경우
-- 두 테이블에 동일한 이름의 컬럼이 있으면 자동으로 매칭해서 조인해주는 구문
-- 주의사항! 실무에서는 쓰지 않는다 (의도치 않은 컬럼까지 자동으로 매칭될 수 있어서 위험)

-- 배우 이름이 'NICK WAHLBERG'인 배우가 출연한 영화의 film_id, first_name, last_name 조회
-- 1) where 구문
SELECT film_id, first_name, last_name
FROM film_actor fa, actor a
WHERE fa.actor_id = a.actor_id
	AND first_name = 'NICK' AND last_name = 'WAHLBERG';

-- 2) ANSI 구문
-- 직접 작성해보기


-- 실습문제 ---
-- 1. 장르(category)가 'Action'인 영화들의 film_id, title, rental_rate 조회
--    (film, film_category, category)
SELECT * FROM film; -- film_id, title, rental_rate
SELECT * FROM film_category; -- film_id, category_id
SELECT * FROM category; -- category_id, name

-- 직접 작성해보기


-- 2. 전체 도시의 city_id, city, country_id, country 조회 (city, country)
SELECT * FROM city; -- city_id, city, country_id
SELECT * FROM country; -- country_id, country

-- 직접 작성해보기


-- 3. 결제 금액이 있는(즉, 결제한 적 있는) 고객들의
--    customer_id, first_name, amount, 매장(store_id) 조회 (customer, payment)
SELECT * FROM customer; -- customer_id, first_name, store_id
SELECT * FROM payment; -- customer_id, amount

-- 직접 작성해보기


/*
	2. 외부 조인(OUTER JOIN) : MySQL은 ANSI 구문만 가능
    - 두 테이블 간의 JOIN 시 일치하지 않는 행도 포함시켜서 조회가 가능하다.
    - 단, 반드시 기준이 되는 테이블(컬럼)을 지정해야 한다. (LEFT, RIGHT, FULL)
*/
-- 고객명, 결제일, 결제금액 조회
SELECT first_name, payment_date, amount
FROM customer
	JOIN payment USING (customer_id);
-- > 결제 이력이 한 번도 없는 고객에 대한 정보는 조회 X

-- 1) LEFT JOIN : 두 테이블 중 왼쪽에 기술된 테이블을 기준으로 JOIN
-- 결제 이력이 없는 고객도 포함해서 고객명, 결제일, 결제금액 조회
SELECT first_name, payment_date, amount
FROM customer
	LEFT JOIN payment USING (customer_id);

-- 2) RIGHT JOIN : 두 테이블 중 오른쪽에 기술된 테이블을 기준으로 JOIN
SELECT first_name, payment_date, amount
FROM customer
	RIGHT JOIN payment USING (customer_id);

-- 3) FULL JOIN : 두 테이블이 가진 모든 행을 조회할 수 있음 - MySQL X

/*
	3. 비등가 조인 (NON EQUAL JOIN)
    - 매칭시킬 컬럼에 대한 조건 작성시 '='(등호)를 사용하지 않는 조인문
    - 값의 범위에 포함되는 행들을 연결하는 방식
    - ANSI 구문으로는 JOIN ON만 사용 가능! (USING 사용 불가)
    - 실무에서는 별도의 급간표 테이블(예: length_grade)을 두고
      JOIN ON 컬럼 BETWEEN 최소값 AND 최대값 형태로 사용한다.

    예) SELECT title, length, grade_name
        FROM film
            JOIN length_grade ON (length BETWEEN min_len AND max_len);
*/

/*
	4. 자체 조인(SELF JOIN)
    - 같은 테이블을 다시 한번 조인하는 경우 (자기 자신과 조인)
*/
-- staff 테이블에는 담당 매장(store_id)이 있고, store 테이블에는 매니저 직원(manager_staff_id)이 있다.
-- 즉 staff는 다른 staff(매니저)를 참조하는 구조가 아니므로, self join은 같은 도시에 사는
-- 고객끼리 짝지어보는 예시로 대체해서 살펴본다.
-- 같은 도시(address.city_id)에 사는 서로 다른 두 고객의 이름을 짝지어 조회
SELECT
	c1.first_name "고객1", c1.address_id "고객1주소",
    c2.first_name "고객2", c2.address_id "고객2주소"
FROM customer c1
JOIN customer c2 ON (c1.address_id = c2.address_id AND c1.customer_id < c2.customer_id);

/*
	5. 카테시안곱(CARTESIAN PRODUCT) / 교차 조인 (CROSS JOIN)
    - 조인되는 모든 테이블의 각 행들이 서로서로 모두 매핑된 데이터가 검색된다. (곱집합)
    - 두 테이블의 행들이 모두 곱해진 행들의 조합이 출력 -> 방대한 데이터 출력 -> 과부하 위험
*/
-- language명, category명 조합 조회 (language - name, category - name)
-- >> where 구문
SELECT language.name, category.name
FROM language, category;

-- >> ANSI 구문
SELECT language.name, category.name
FROM language CROSS JOIN category;

/*
	6. 다중 JOIN
    - 여러 개의 테이블을 조인하는 경우
*/
-- 영화 제목, 장르명, 언어명 조회
SELECT * FROM film; -- film_id, title, language_id <-- foreign key(외래키)
SELECT * FROM film_category; -- film_id, category_id
SELECT * FROM category; -- category_id, name <-- primary key(주요키)
SELECT * FROM language; -- language_id, name <-- primary key(주요키)

-- 직접 작성해보기


-- 실습 문제 ---
-- 1. 등급이 'PG-13'이면서 'Action' 장르인 영화들의
--    film_id, title, 등급, 장르명, 대여료 조회
SELECT * FROM film; -- film_id, title, rating, rental_rate
SELECT * FROM film_category; -- film_id, category_id
SELECT * FROM category; -- category_id, name

-- 직접 작성해보기


-- 2. 이름(first_name)이 'A'로 시작하면서 성(last_name)에 'S'가 포함된 배우들이
--    출연한 영화의 first_name, last_name, title 조회
SELECT * FROM actor; -- actor_id, first_name, last_name
SELECT * FROM film_actor; -- actor_id, film_id
SELECT * FROM film; -- film_id, title

-- 직접 작성해보기


-- 3. 결제한 적이 있는 고객들의 고객명, 결제금액, 소속 매장명(store_id), 근무지역(city) 조회
--    결제 이력이 없는 고객도 나타내고 싶다면 LEFT JOIN (customer 테이블이 왼쪽에 있을 때)
SELECT * FROM customer; -- first_name, store_id, address_id
SELECT * FROM payment; -- customer_id, amount
SELECT * FROM address; -- address_id, city_id
SELECT * FROM city; -- city_id, city

-- 직접 작성해보기


-- 4. 'Canada'와 'Japan'에서 거주하는 고객들의 고객명, 도시명, 국가명 조회
SELECT * FROM customer; -- first_name, address_id
SELECT * FROM address; -- address_id, city_id
SELECT * FROM city; -- city_id, city, country_id
SELECT * FROM country; -- country_id, country

-- 직접 작성해보기


-- 5. 각 장르별 평균 대여료를 조회하여 장르명, 평균 대여료 조회
SELECT * FROM film; -- rental_rate
SELECT * FROM film_category; -- film_id, category_id
SELECT * FROM category; -- category_id, name

-- 직접 작성해보기


-- 6. 각 장르별 영화 수가 60편 이상인 장르명, 영화 수 조회
-- 직접 작성해보기


-- 7. film_id, title, 언어명, 대여료 등급(구분) 조회
--    대여료가 4달러 초과인 경우 '고가'
--    대여료가 4달러 이하 2달러 초과인 경우 '중가'
--    그 외의 경우 '저가'
-- 직접 작성해보기


-- 8. 상영시간이 90분 미만이면서 등급이 'G' 또는 'PG'인 영화들의
--    title, 언어명, 상영시간 조회
-- 직접 작성해보기


-- 9. 배우가 출연한 적이 있는 영화들의 title, first_name, last_name, 장르명 조회
--    INNER JOIN을 하는 경우 매칭되는 값이 없으면 자동으로 제외됨
-- 직접 작성해보기


-- 10. 'Sports' 장르에 속하는 영화들의 title, 언어명, 장르명 조회
-- 직접 작성해보기


-- 11. 이름(first_name)에 'ER'이 들어있는 배우들이 출연한 영화의
--     actor_id, first_name, title 조회
-- 직접 작성해보기


-- 12. film_id, title, 장르명, 언어명, 등급, 대여료 조회
--     참고로 film, film_category, category, language 사용
-- 직접 작성해보기



-- 7. SUBQUERY (서브쿼리)
/*
	서브쿼리(SUBQUERY), 중첩쿼리
    - 하나의 SQL문 안에 포함된 또 다른 SQL문
    - 서브쿼리를 수행한 결과값이 몇 행 몇 열이냐에 따라 분류
    - 서브쿼리 종류에 따라 서브쿼리와 사용하는 연산자가 달라짐

    1. 단일행 서브쿼리(SINGLE ROW SUBQUERY)
    - 서브쿼리의 조회 결과값의 개수가 오로지 1개일 때 (한 행 한 열)
    - 일반 비교연산자 사용 가능 : =, !=, <>, >, <, >=, <=, ...
*/
-- 배우 'NICK WAHLBERG'와 함께 같은 영화(film_id)에 출연한 다른 배우들 조회
-- 1) NICK WAHLBERG의 actor_id 조회
SELECT actor_id
FROM actor
WHERE first_name = 'NICK' AND last_name = 'WAHLBERG'; -- 2

-- 2) actor_id가 2인 배우가 출연한 영화들 조회
SELECT film_id
FROM film_actor
WHERE actor_id = 2;

-- 전체 영화의 평균 대여료보다 더 비싼 대여료를 받는 영화들의 film_id, title, rental_rate 조회
-- 1) 전체 영화의 평균 대여료 조회
SELECT avg(rental_rate)
FROM film; -- 대략 2.98

-- 2) 위 값보다 더 비싼 영화들의 film_id, title, rental_rate 조회
SELECT film_id, title, rental_rate
FROM film
WHERE rental_rate > 2.98;

-- 3) 합치기!
SELECT film_id, title, rental_rate
FROM film
WHERE rental_rate > (SELECT avg(rental_rate)
						FROM film);

-- 'NICK WAHLBERG'가 출연한 영화들의 title, rental_rate, rating 조회
-- 1) NICK WAHLBERG의 actor_id
SELECT actor_id
FROM actor
WHERE first_name = 'NICK' AND last_name = 'WAHLBERG'; -- 2

-- 2)
SELECT title, rental_rate, rating
FROM film
WHERE film_id IN (SELECT film_id
					FROM film_actor
					WHERE actor_id = 2);

-- 3) 단일행 서브쿼리 버전 (actor_id가 하나의 값이므로 = 로도 연결 가능)
SELECT title, rental_rate, rating
FROM film
WHERE film_id IN (SELECT film_id
					FROM film_actor
					WHERE actor_id = (SELECT actor_id
										FROM actor
										WHERE first_name = 'NICK' AND last_name = 'WAHLBERG'));

-- 결제금액의 합이 가장 큰 고객의 customer_id, 결제금액 합 조회
SELECT customer_id, sum(amount)
FROM payment
GROUP BY customer_id
ORDER BY 2 DESC
LIMIT 1;

-- >> 서브쿼리 사용!
-- 결제금액 합이 가장 큰 값
SELECT max(sum_amount)
FROM (SELECT customer_id, sum(amount) sum_amount
		FROM payment
		GROUP BY customer_id) customer_sum;

-- 서브쿼리 특징! 쿼리 자체는 직관적!
-- 쿼리 속도 중요시! 서브쿼리 상대적으로 느려요~~
-- 가급적으로 서브쿼리를 사용하지 않아도 되는 거면 안 쓰고 하시는 걸 추천!
SELECT customer_id, sum(amount)
FROM payment
GROUP BY customer_id
HAVING sum(amount) = (SELECT max(sum_amount)
						FROM (SELECT customer_id, sum(amount) sum_amount
								FROM payment
								GROUP BY customer_id) customer_sum);

/*
	2. 다중행 서브쿼리
    - 서브쿼리의 조회 결과 값의 개수가 여러 행 일 때 (여러행 한열)

    IN 서브쿼리 : 여러개의 결과값 중에서 한개라도 일치하는 값이 있다면
*/
-- 각 장르별 최고 대여료를 받는 영화의 title, category_id, rental_rate 조회
-- 1) 각 장르별 최고 대여료
SELECT max(rental_rate)
FROM film
	JOIN film_category USING (film_id)
GROUP BY category_id;

-- 2) 위의 값들을 받는 영화의 title, category_id, rental_rate 조회
SELECT title, category_id, rental_rate
FROM film
	JOIN film_category USING (film_id)
WHERE rental_rate IN (SELECT max(rental_rate)
						FROM film
							JOIN film_category USING (film_id)
						GROUP BY category_id);

-- 3) 합치기! (중복 없이 다시 정리)
SELECT title, category_id, rental_rate
FROM film
	JOIN film_category USING (film_id)
WHERE rental_rate IN (SELECT max(f2.rental_rate)
						FROM film f2
							JOIN film_category fc2 USING (film_id)
						GROUP BY fc2.category_id);

-- 배우들 중 감독 역할을 한 사람이 있는지 여부를 매핑한 형태의 실습을 위해
-- film_actor에 등장한 적 있는 actor_id 목록으로 "출연 이력 있음/없음" 구분 조회
SELECT
	actor_id, first_name, last_name,
    if(actor_id IN (SELECT DISTINCT actor_id
						FROM film_actor), '출연작 있음', '출연작 없음') 구분
FROM actor;

/*
	컬럼 > ANY (서브쿼리) : 여러개의 결과값 중에서 "한개라도" 클 경우
    컬럼 < ANY (서브쿼리) : 여러개의 결과값 중에서 "한개라도" 작을 경우
    --> OR
*/
-- 등급이 'G'임에도 등급이 'NC-17'인 영화들의 최소 대여료보다 더 비싼 영화의
-- film_id, title, rating, rental_rate 조회
-- NC-17 등급의 대여료 목록 확인
SELECT rental_rate
FROM film
WHERE rating = 'NC-17';

SELECT film_id, title, rating, rental_rate
FROM film
WHERE rating = 'G'
	AND rental_rate > ANY (SELECT rental_rate
							FROM film
							WHERE rating = 'NC-17');

/*
	컬럼 > ALL (서브쿼리) : 여러개의 "모든" 결과값들 보다 클 경우
    컬럼 < ALL (서브쿼리) : 여러개의 "모든" 결과값들 보다 작을 경우
    --> AND
*/
-- 등급이 'PG'임에도 등급이 'G'인 영화의 최대 대여료보다 더 비싼 영화의
-- film_id, title, rating, rental_rate 조회
SELECT film_id, title, rating, rental_rate
FROM film
WHERE rating = 'PG'
	AND rental_rate > ALL (SELECT rental_rate
							FROM film
							WHERE rating = 'G');

/*
	3. 다중열 서브쿼리
    - 서브쿼리의 조회 결과값이 한 행이지만 컬럼이 여러개일 때 (한 행 여러 열)
*/
-- 영화 'ACADEMY DINOSAUR'와 같은 언어(language_id), 같은 등급(rating)인
-- 영화들의 title, language_id, rating 조회
-- 'ACADEMY DINOSAUR'의 언어, 등급
SELECT language_id, rating
FROM film
WHERE title = 'ACADEMY DINOSAUR'; -- 1, PG

SELECT title, language_id, rating
FROM film
WHERE language_id = (SELECT language_id
						FROM film
						WHERE title = 'ACADEMY DINOSAUR')
AND rating = (SELECT rating
				FROM film
				WHERE title = 'ACADEMY DINOSAUR');

-- >> 다중열 서브쿼리
SELECT title, language_id, rating
FROM film
WHERE (language_id, rating) = (SELECT language_id, rating
									FROM film
									WHERE title = 'ACADEMY DINOSAUR');

/*
	4. 다중행 다중열 서브쿼리
    - 서브쿼리의 조회 결과값이 여러 행, 여러 열일 경우
*/
-- 각 등급(rating)별로 최저 대여료를 받는 영화의 title, rating, rental_rate 조회
-- 각 등급별로 최저 대여료
SELECT rating, min(rental_rate)
FROM film
GROUP BY rating;

SELECT title, rating, rental_rate
FROM film
WHERE (rating, rental_rate) IN (SELECT rating, min(rental_rate)
									FROM film
									GROUP BY rating);

-- 8. DCL (Data Control Language) - 계정과 권한
/*
	보안 및 권한 관리를 위해 root 계정을 직접 사용하지 않는 것을 권장

	DCL(Data Control Language) : 데이터 제어 언어
    - 계정에게 객체 접근 권한을 부여(GRANT)하거나 회수(REVOKE)하는 구문

    GRANT 권한, 권한, ... TO 계정;
    REVOKE 권한, 권한, ... FROM 계정;
*/
-- 사용자 계정 생성
CREATE USER sakila_student IDENTIFIED BY 'student1234';

-- sakila 스키마(데이터베이스)에 대한 모든 권한 부여
GRANT ALL PRIVILEGES ON sakila.* TO sakila_student;

-- 데이터베이스(스키마) 권한 회수
-- REVOKE ALL PRIVILEGES ON sakila.* FROM sakila_student;

-- 사용자 계정 삭제
DROP USER sakila_student;

/*
	데이터베이스(Database) : 데이터의 집합을 저장하고 관리하는 시스템
		- 데이터를 구조화하고 조직화하는데 사용
        - 여러 테이블, 뷰, 프로시저, 함수 등을 포함

    스키마(Schema) : 데이터베이스 내에 특정 테이블, 뷰, 프로시저, 함수 등을 그룹화

    --> 데이터베이스와 스키마를 같은 의미로 사용을 하지만, 몇몇 DBMS에서는 다르게 해석
        MySQL에서는 대부분 두 용어를 같이 사용! (sakila도 스키마이자 데이터베이스)
*/


-- 9. DDL - CREATE (연습용 테이블 설계)
/*
	DDL(Data Definition Language) : 데이터 정의어
    - 객체(Object)/스키마(Schema)를 만들고(CREATE),
      변경하고(ALTER), 삭제(DROP)하는 언어
    - 즉, 실제 데이터 값이 아닌 구조 자체를 정의하는 언어

    MySQL에서 객체(구조) : 테이블(Table), 뷰(View), 인덱스(Index),
						프로시저(Procedure), 트리거(Trigger), 함수(Function)

	CREATE
    - 객체를 생성하는 구문

    테이블 생성
    CREATE TABLE 테이블명(
		컬럼명 자료형(크기),
        컬럼명 자료형(크기),
        ...
    );

    * 자료형
    1. 문자
		- CHAR / VARCHAR : 고정 및 가변 길이 문자, 반드시 크기 지정
        - TEXT : 매우 긴 문자열을 저장하는데 사용
	2. 숫자
		- INT : 정수값 저장하는데 사용
        - FLOAT / DOUBLE : 부동소수점 저장하는데 사용
        - DECIMAL : 고정소수점 저장하는데 사용
	3. 날짜 및 시간
		- DATE : 날짜 저장하는데 사용
        - TIME : 시간 저장하는데 사용
        - DATETIME / TIMESTAMP : 날짜와 시간을 함께 저장
	4. 불리언
		- BOOLEAN / BOOL : 참(True) 또는 거짓(False) 값을 저장하는데 사용
	5. 이진 자료형
		- BLOB : 이진 데이터를 저장하는데 사용. 이미지나 동영상과 같은 이진 파일
        --> 실제로는 이미지나 동영상은 따로 관리함 (URL만 문자형으로 저장하는 편)
*/
-- 리뷰 초안 실습용 테이블 (제약조건 없이 시작)
CREATE TABLE review_draft(
	review_id INT,
    customer_id INT,
    film_id INT,
    rating INT,
    comment VARCHAR(200),
    review_date DATE
);

-- 테이블 구조를 표시해주는 구문
DESC review_draft;

SELECT * FROM review_draft;

-- 테이블에 데이터를 추가시키는 구문 (DML : INSERT)
-- INSERT INTO 테이블명 VALUES(값, 값, ...);
INSERT INTO review_draft
	VALUES(1, 1, 1, 5, '정말 재밌게 봤어요!', '2026-07-10');
INSERT INTO review_draft
	VALUES(2, 1, 2, NULL, NULL, NOW());
INSERT INTO review_draft VALUES(NULL, NULL, NULL, NULL, NULL, NULL);
-- >> 제약조건이 하나도 없으니 NULL이 아무 컬럼에나 다 들어가 버린다! 문제가 있다.

/*
	제약조건(CONSTRAINTS)
    - 사용자가 원하는 조건의 데이터만 유지하기 위해서 각 컬럼에 대해 저장될 값에 대한 제약조건 설정
    - 제약조건은 데이터 무결성 보장을 목적으로 한다.
    - 종류 : NOT NULL, UNIQUE, CHECK, PRIMARY KEY, FOREIGN KEY
*/
/*
	NOT NULL
    - 해당 컬럼에 반드시 값이 있어야만 하는 경우
		(즉, 해당 컬럼에 절대 NULL이 들어와서는 안되는 경우)
	- 추가/수정시 NULL 값을 허용하지 않도록 제한
*/
DROP TABLE review_draft;
CREATE TABLE review_draft(
	review_id INT NOT NULL,
    customer_id INT NOT NULL,
    film_id INT NOT NULL,
    rating INT NOT NULL,
    comment VARCHAR(200),
    review_date DATE
);

INSERT INTO review_draft
	VALUES(1, 1, 1, 5, '정말 재밌게 봤어요!', '2026-07-10');
INSERT INTO review_draft
	VALUES(2, 1, 2, 4, NULL, current_date());
-- >> comment, review_date는 NOT NULL이 아니라서 NULL이 들어가도 정상적으로 성공!
INSERT INTO review_draft
	VALUES(3, 1, NULL, 3, '그럭저럭이었어요', current_date());
-- >> film_id는 NOT NULL인데 NULL을 넣으려 해서 오류 발생!

SELECT * FROM review_draft;

/*
	UNIQUE
    - 해당 컬럼에 중복된 값이 들어와서는 안 되는 경우
    - 추가/수정 시 기존에 있는 데이터값 중 중복값이 있을 경우 오류 발생
    - NULL은 여러 번 들어와도 중복으로 취급하지 않는다.
*/
DROP TABLE review_draft;
CREATE TABLE review_draft(
	review_id INT NOT NULL UNIQUE,
    customer_id INT NOT NULL,
    film_id INT NOT NULL,
    rating INT NOT NULL,
    comment VARCHAR(200),
    review_date DATE
);

INSERT INTO review_draft VALUES(1, 1, 1, 5, '정말 재밌게 봤어요!', current_date());
INSERT INTO review_draft VALUES(2, 1, 2, 4, '괜찮았어요', current_date());
-- >> unique 제약조건에 위배되어 insert 실패! (review_id 1이 중복)
INSERT INTO review_draft VALUES(1, 2, 3, 3, '별로였어요', current_date());
-- >> rating에 유효하지 않은 값(예: 100)이 들어가도 걸러내지 못한다는 문제가 남아있음

SELECT * FROM review_draft;

/*
	CHECK(조건식)
    - 해당 컬럼에 들어올 수 있는 값에 대한 조건을 제시해볼 수 있음!
    - 해당 조건에 만족하는 데이터값만 담길 수 있음
*/
DROP TABLE review_draft;
CREATE TABLE review_draft(
	review_id INT NOT NULL UNIQUE,
    customer_id INT NOT NULL,
    film_id INT NOT NULL,
    rating INT NOT NULL,
    comment VARCHAR(200),
    review_date DATE,
    CONSTRAINT review_rating_check CHECK (rating BETWEEN 1 AND 5)
);

INSERT INTO review_draft VALUES(1, 1, 1, 5, '정말 재밌게 봤어요!', current_date());
INSERT INTO review_draft VALUES(2, 1, 2, 9, '별점 실수', current_date());
-- >> check 제약조건에 위배되었기 때문에 오류 발생! (rating은 1~5만 허용)

SELECT * FROM review_draft;

/*
	PRIMARY KEY (기본키)
    - 테이블에서 각 행들을 식별하기 위해 사용될 컬럼에 부여하는 제약조건 (식별자 역할)
    ex) 회원번호, 학번, 사원번호, 리뷰번호, 주문번호, ...
    - PRIMARY KEY 제약조건을 부여하면 그 컬럼에 자동으로 NOT NULL + UNIQUE 조건이 설정
    - 한 테이블 당 오로지 한 개만 설정
    --> 간혹 복합키 설정도 가능
*/
DROP TABLE review_draft;

-- 리뷰에 붙일 태그를 관리하는 작은 기준 테이블부터 만든다 (PRIMARY KEY + AUTO_INCREMENT 실습)
CREATE TABLE review_tag(
	tag_id INT PRIMARY KEY AUTO_INCREMENT,
    tag_name VARCHAR(30) NOT NULL UNIQUE
);

INSERT INTO review_tag(tag_name) VALUES ('감동적');
INSERT INTO review_tag(tag_name) VALUES ('지루함');
INSERT INTO review_tag(tag_name) VALUES ('강력추천');
INSERT INTO review_tag(tag_name) VALUES ('스포주의');

SELECT * FROM review_tag;

INSERT INTO review_tag(tag_id, tag_name) VALUES(1, '감동적임');
-- >> 기본키에 중복값을 담으려고 해서 문제 발생! (unique 제약조건 위배)

INSERT INTO review_tag(tag_id, tag_name) VALUES(NULL, '눈물주의');
-- >> AUTO_INCREMENT 컬럼에 NULL을 넣으면 알아서 다음 번호가 채워진다 (에러 X)

SELECT * FROM review_tag;

/*
	FOREIGN KEY (외래키)
    - 외래키 역할을 하는 컬럼에 부여하는 제약조건
    - 다른 테이블에 존재하는 값만 들어와야 되는 특정 컬럼에 부여하는 제약조건
		(단, NULL 값은 가질 수 있음)

    --> 다른 테이블을 참조한다고 표현
    --> 주로 FOREIGN KEY 제약조건에 의해 테이블 간의 관계가 형성됨!

	customer_review 테이블은 세 개의 외래키를 갖는다.
	- customer_id : sakila의 실제 customer 테이블을 참조 (절대 삭제하지 않을 참조 대상)
	- film_id : sakila의 실제 film 테이블을 참조 (절대 삭제하지 않을 참조 대상)
	- tag_id : 우리가 직접 만든 review_tag 테이블을 참조 (자유롭게 다뤄도 되는 참조 대상)
*/
CREATE TABLE customer_review(
	review_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id SMALLINT UNSIGNED NOT NULL,
    film_id SMALLINT UNSIGNED NOT NULL,
    tag_id INT,
    rating TINYINT NOT NULL,
    comment VARCHAR(200),
    created_at DATETIME DEFAULT (CURRENT_TIMESTAMP),
    CONSTRAINT review_rating_check CHECK (rating BETWEEN 1 AND 5),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
    FOREIGN KEY (film_id) REFERENCES film(film_id),
    FOREIGN KEY (tag_id) REFERENCES review_tag(tag_id) ON DELETE SET NULL
);

-- 실제 존재하는 customer_id(1), film_id(1), tag_id(1)를 참조해서 정상 등록
INSERT INTO customer_review(customer_id, film_id, tag_id, rating, comment)
VALUES(1, 1, 1, 5, '정말 재밌게 봤어요!');

INSERT INTO customer_review(customer_id, film_id, rating, comment)
VALUES(2, 2, 4, '태그 없이도 등록 가능 (tag_id는 NULL 허용)');
-- >> 외래키 제약조건이 부여되도 기본적으로 null 허용

INSERT INTO customer_review(customer_id, film_id, tag_id, rating, comment)
VALUES(9999, 1, 1, 3, '존재하지 않는 고객번호');
-- >> 부모키(parent key)를 찾을 수 없다는 오류 발생! (customer_id 9999는 customer에 없음)

SELECT * FROM customer_review;

-- >> 부모 테이블(review_tag)에서 데이터값을 삭제할 경우 어떤 문제가 발생하는지 확인
-- review_tag 테이블에서 tag_id가 1인 태그 삭제
DELETE FROM review_tag
WHERE tag_id = 1;
-- >> ON DELETE SET NULL 옵션 덕분에 삭제는 되고, customer_review에서
--    tag_id가 1이었던 리뷰는 자동으로 tag_id가 NULL로 바뀐다.

SELECT * FROM customer_review;
SELECT * FROM review_tag;

-- 다시 태그를 채워넣어서 이후 실습에 사용
INSERT INTO review_tag(tag_name) VALUES ('감동적');

/*
	DEFAULT 기본값
    - 제약조건 아님!
    - 컬럼을 선정하지 않고 INSERT시 NULL이 아닌 기본값을 세팅해주는 값
    - customer_review의 created_at 컬럼이 이미 DEFAULT (CURRENT_TIMESTAMP)로 지정되어 있다.
*/
INSERT INTO customer_review(customer_id, film_id, rating, comment)
VALUES(3, 3, 5, 'DEFAULT 값으로 created_at이 자동으로 채워짐');

SELECT * FROM customer_review;

/*
	서브쿼리를 이용한 테이블 생성
    - 컬럼명, 데이터 타입, 값 모두 복사 / 제약조건은 대부분 사라짐 (PK, FK 등은 복사 X)

    CREATE TABLE 테이블명
    AS 서브쿼리;
*/
-- sakila의 film 테이블을 복사하여 새로운 테이블 생성 (film 원본은 전혀 건드리지 않는다!)
CREATE TABLE film_copy
AS SELECT * FROM film;

SELECT * FROM film_copy;

DESC film_copy;

-- 테이블만 생성하고 데이터 값은 복사하지 않는 방법
DROP TABLE film_copy;
CREATE TABLE film_copy
AS SELECT * FROM film WHERE 1 = 0;
-- 모든 행에 대해서 매번 false이기 때문에 테이블 구조만 복사!

SELECT * FROM film_copy; -- 구조만 있고 데이터는 없음

-- film 테이블에서 film_id, title, rental_rate, 누적대여료만 저장한 film_price_copy 테이블 생성
CREATE TABLE film_price_copy
AS SELECT film_id, title, rental_rate, rental_rate * rental_duration 누적대여료 FROM film;

SELECT * FROM film_price_copy;

-- 10. DDL - ALTER / DROP
/*
	ALTER
    - 객체를 수정하는 구문

    ALTER TABLE 테이블명 수정할내용;

	참고 : 여기서도 실제 category 테이블이 아니라 category를 복사한 category_copy를 사용한다!
*/
-- 여기서 사용할 테이블 생성 (category 원본은 절대 건드리지 않는다)
DROP TABLE IF EXISTS category_copy;
CREATE TABLE category_copy
AS SELECT * FROM category;

/*
	1. 컬럼 추가 / 수정 / 삭제 / 이름 변경
    1-1. 컬럼 추가 (ADD)
    ALTER TABLE 테이블명 ADD 컬럼명 자료형 [DEFAULT 기본값];
*/
-- description 컬럼 추가
ALTER TABLE category_copy ADD description VARCHAR(100);
-- >> 새로운 컬럼이 만들어지고 기본적으로 NULL로 채워짐

-- source_country 컬럼 추가 (기본값 : '한국')
ALTER TABLE category_copy ADD source_country VARCHAR(20) DEFAULT '한국';
-- >> 새로운 컬럼이 만들어지고 지정한 기본값으로 채워짐

/*
	1-2. 컬럼 수정 (MODIFY)
    - 자료형 변경 : ALTER TABLE 테이블명 MODIFY 컬럼명 변경할자료형;
    - 기본값 변경 : ALTER TABLE 테이블명 MODIFY 컬럼명 자료형 DEFAULT 변경할기본값;

    * 참고 : DEFAULT 삭제
    ALTER TABLE 테이블명 MODIFY 컬럼명 자료형 DEFAULT NULL;
*/
-- category_id 컬럼의 자료형을 SMALLINT로 변경
ALTER TABLE category_copy MODIFY category_id SMALLINT UNSIGNED;

ALTER TABLE category_copy MODIFY name INT; -- 에러 발생! (이미 문자 데이터가 들어있음)
ALTER TABLE category_copy MODIFY description INT; -- 기존 데이터가 없으면 자료형 변경 가능

-- name의 자료형을 VARCHAR(5)로 변경
ALTER TABLE category_copy MODIFY name VARCHAR(5);
-- >> 변경하려는 자료형의 크기보다 이미 큰 값이 존재하면 에러 발생!

-- 다중 수정 가능!
-- name 컬럼의 자료형은 VARCHAR(30),
-- description 컬럼의 자료형은 VARCHAR(200),
-- source_country 컬럼의 기본값을 '미국'으로 변경 (자료형 : VARCHAR(20))
ALTER TABLE category_copy
	MODIFY name VARCHAR(30),
    MODIFY description VARCHAR(200),
    MODIFY source_country VARCHAR(20) DEFAULT '미국';

INSERT INTO category_copy(category_id, name, description)
VALUES(17, '한국영화', '한국에서 만든 영화');

SELECT * FROM category_copy;

/*
	1-3. 컬럼 삭제

    ALTER TABLE 테이블명 DROP COLUMN 컬럼명;

    - 데이터 값이 기록되어 있어도 같이 삭제된다. (삭제된 컬럼 복구는 불가능)
    - 테이블에는 최소 한 개의 컬럼이 존재해야 한다.
    - 참조되고 있는 컬럼이 있다면 삭제가 불가능하다.
*/
ALTER TABLE category_copy DROP COLUMN description;

/*
	1-4. 컬럼명 변경 (RENAME COLUMN)
    ALTER TABLE 테이블명 RENAME COLUMN 기존컬럼명 TO 변경할컬럼명;
*/
-- category_copy 테이블에서 source_country 컬럼명을 country_name으로 변경
ALTER TABLE category_copy RENAME COLUMN source_country TO country_name;

DESC category_copy;

/*
	2. 제약조건 추가 / 삭제
    2-1 제약조건 추가 (ADD)
    - ADD [CONSTRAINT 제약조건명] PRIMARY KEY(컬럼명);
    - ADD [CONSTRAINT 제약조건명] FOREIGN KEY(컬럼명) REFERENCES 테이블명(컬럼명);
    - ADD [CONSTRAINT 제약조건명] UNIQUE(컬럼명);
    - ADD [CONSTRAINT 제약조건명] CHECK(컬럼에 대한 조건);
    - NOT NULL : MODIFY 컬럼명 [CONSTRAINT 제약조건명] NOT NULL;
*/
-- category_copy 테이블의 category_id 컬럼에 기본키(PK) 제약조건 추가
ALTER TABLE category_copy ADD PRIMARY KEY(category_id);
-- ALTER TABLE category_copy ADD CONSTRAINT category_copy_pk PRIMARY KEY(category_id);

-- name 컬럼에 unique 제약조건 추가
ALTER TABLE category_copy ADD CONSTRAINT category_copy_uq UNIQUE(name);

/*
	2-2. 제약조건 삭제
    - NOT NULL : ALTER TABLE 테이블명 MODIFY 컬럼명 NULL;
    - PRIMARY KEY : ALTER TABLE 테이블명 DROP PRIMARY KEY;
    - 나머지 : ALTER TABLE 테이블명 DROP CONSTRAINT 제약조건명;
*/
ALTER TABLE category_copy DROP CONSTRAINT category_copy_uq;
ALTER TABLE category_copy DROP PRIMARY KEY;

-- 제약조건명 확인 (스키마 이름은 실습 환경의 데이터베이스명으로 바꿔서 조회)
SELECT TABLE_SCHEMA, TABLE_NAME, CONSTRAINT_NAME, CONSTRAINT_TYPE
FROM information_schema.TABLE_CONSTRAINTS
WHERE TABLE_SCHEMA = 'sakila' AND TABLE_NAME = 'category_copy';

DESC category_copy;
SELECT * FROM category_copy;

/*
	3. 테이블명 변경 (RENAME)
    ALTER TABLE 기존테이블명 RENAME TO 변경할테이블명;
*/
-- category_copy => category_test 변경
ALTER TABLE category_copy RENAME TO category_test;

SELECT * FROM category_test;

/*
	DROP
    - 객체를 삭제하는 구문
    DROP TABLE 테이블명;

    - 삭제하고 싶다면 자식 테이블 먼저 삭제 후 부모 테이블 삭제 가능! (FK 관계 때문)
*/
-- 실습용으로 만든 복사 테이블들은 더 이상 필요 없으니 정리
DROP TABLE category_test;
DROP TABLE film_copy;
DROP TABLE film_price_copy;

-- 11. TCL (Transaction Control Language) - 트랜잭션 제어
/*
	TCL(Transaction Control Language)
    - 트랜잭션을 제어하는 언어
    - 데이터베이스는 데이터 변경 사항(INSERT, UPDATE, DELETE)들을 묶어서
		하나의 트랜잭션에 담아서 처리

	트랜잭션(Transaction)
    - 하나의 논리적인 작업 단위
    ex) ATM에서 현금 출력
    1. 카드 삽입
    2. 메뉴 선택
    3. 금액 확인
    4. 인증 - 비밀번호 입력
    5. 실제 계좌에서 금액만큼 인출
    6. 현금 인출
    7. 완료
    -- > 각각의 업무들을 묶어서 하나의 작업 단위로 만드는 것을 트랜잭션!

    COMMIT : 모든 작업들을 정상적으로 처리하겠다고 확정하는 구문
    ROLLBACK : 모든 작업들을 취소하겠다고 확정하는 구문 (마지막 COMMIT 시점으로 돌아간다.)

	참고 : 여기서도 review_tag, customer_review 같은 우리 연습용 테이블만 사용한다.
*/
-- MySQL에서는 기본적으로 autocommit 모드가 활성화되어 있음
-- 비활성화
SET autocommit = 0;

-- 트랜잭션 시작!
START TRANSACTION;

-- customer_review에서 review_id가 1인 리뷰의 별점을 1점으로 수정
UPDATE customer_review
SET rating = 1
WHERE review_id = 1;

SELECT * FROM customer_review WHERE review_id = 1; -- rating이 1로 바뀐 게 보임

ROLLBACK; -- 마지막 COMMIT 시점으로 되돌아감

SELECT * FROM customer_review WHERE review_id = 1; -- rating이 원래 값(5)으로 복구됨

-- 이번엔 정상적으로 반영하고 싶은 경우
START TRANSACTION;

UPDATE customer_review
SET comment = '다시 봐도 여전히 재밌어요!'
WHERE review_id = 1;

COMMIT; -- 확정! ROLLBACK 해도 되돌릴 수 없음

SELECT * FROM customer_review WHERE review_id = 1;

-- customer_review에서 review_id가 2, 3인 리뷰 삭제
START TRANSACTION;

DELETE FROM customer_review
WHERE review_id IN (2, 3);

SELECT * FROM customer_review; -- 삭제된 상태로 보임

ROLLBACK; -- DELETE는 ROLLBACK으로 되돌리기 가능!

SELECT * FROM customer_review; -- 다시 살아난 걸 확인

-- DDL 구문을 실행하는 순간 임시 저장된 변경사항들을 무조건 반영(암묵적 커밋)!
-- 즉, DDL 앞뒤로는 ROLLBACK이 통하지 않는다는 점 유의
CREATE TABLE review_scratch
AS SELECT * FROM customer_review WHERE 1 = 0;

INSERT INTO review_scratch
SELECT * FROM customer_review;

START TRANSACTION;

DELETE FROM review_scratch;

ROLLBACK; -- DELETE는 ROLLBACK 가능!

SELECT * FROM review_scratch; -- 데이터가 복구되어 있음

/*
	TRUNCATE
    - 테이블 전체 행을 삭제할 때 사용하는 구문
    - DELETE 보다 수행 속도가 빠르다.
    - 별도의 조건을 제시할 수 없고 ROLLBACK이 불가능하다. (DDL에 더 가까운 처리 방식)

    TRUNCATE TABLE 테이블명;
*/
START TRANSACTION;

TRUNCATE TABLE review_scratch;

ROLLBACK; -- TRUNCATE는 ROLLBACK 불가능!

SELECT * FROM review_scratch; -- 여전히 비어있음 (복구되지 않음)

-- 실습이 끝났으니 임시 테이블 정리
DROP TABLE review_scratch;

-- 다시 autocommit을 기본값으로 되돌려서 이후 실습에 영향이 없도록 한다
SET autocommit = 1;


-- 12. DML - INSERT / UPDATE / DELETE
/*
	DML(Data Manipulation Language)
    - 데이터 조작 언어로 테이블에 값을 삽입(INSERT)하거나,
	  수정(UPDATE)하거나, 삭제(DELETE)하는 구문

	INSERT
    - 테이블에 새로운 행을 추가하는 구문

    1) INSERT INTO 테이블명 VALUES (값, 값, ...);
       - 테이블에 모든 컬럼에 대한 값을 INSERT 하고자 할 때 사용한다.
       - 컬럼 순번을 지켜서 VALUES 값을 나열해야 한다.
    2) INSERT INTO 테이블명(컬럼명, 컬럼명, ...) VALUES (값, 값, ...);
       - 테이블의 특정 컬럼에 대한 값만 INSERT 하고자 할 때 사용한다.
       - 선택이 안된 컬럼들은 기본적으로 NULL값이 들어간다.
         (NOT NULL 조건이 걸려 있는 컬럼은 반드시 값을 입력해야 한다.)
	   - 기본값(DEFAULT)이 지정되어 있으면 NULL이 아닌 기본값이 들어간다.
    3) INSERT INTO 테이블명 서브쿼리;
	   - VALUES 대신 서브쿼리 조회한 결과값이 통째로 INSERT 한다.
       - 서브쿼리 결과값이 INSERT 문에 지정된 테이블 컬럼 개수와 같아야 한다.
*/
-- 1) (tag_id는 NULL - 앞에서 tag_id 1은 삭제했었으므로 존재하는 값으로 안전하게)
INSERT INTO customer_review
VALUES(10, 4, 4, NULL, 5, '최고의 영화!', now());

-- 컬럼 수가 맞지 않아서 에러!
INSERT INTO customer_review
VALUES(4, 4, 5, '별로였어요');

-- 2)
INSERT INTO customer_review(customer_id, film_id, tag_id, rating, comment)
VALUES(5, 5, 2, 1, '기대했던 것보단 많이 별로였어요');

INSERT INTO customer_review(customer_id, film_id, rating)
VALUES(6, 6, 3);

-- rating 컬럼에 NOT NULL 제약조건이 있어서 에러!
INSERT INTO customer_review(customer_id, film_id, comment)
VALUES(7, 7, '별점을 빼먹었어요');

-- 3)
-- rental 테이블에서 이미 반납이 완료된 대여 건 중 5개를 뽑아서
-- customer_id, film_id, rating(임시로 5점), comment를 자동으로 채워 리뷰 생성
INSERT INTO customer_review(customer_id, film_id, rating, comment)
SELECT r.customer_id, i.film_id, 5, '자동 생성된 리뷰(대여 완료 기록 기반)'
FROM rental r
	JOIN inventory i USING (inventory_id)
WHERE r.return_date IS NOT NULL
LIMIT 5;

SELECT * FROM customer_review;

/*
	UPDATE
    - 테이블에 기록된 데이터를 수정하는 구문

    UPDATE 테이블명
    SET 컬럼명 = 변경하려는값,
        컬럼명 = 변경하려는값, ...
	WHERE 조건;

    - SET 절에서 여러 개의 컬럼을 콤마(,)로 나열해서 값을 동시에 변경할 수 있다.
    - WHERE 절을 생략하면 모든 행의 데이터가 변경된다. (MySQL Workbench는 기본적으로 이를 방지)
    - 서브쿼리 사용도 가능!
*/
-- review_id가 1인 리뷰의 별점을 4로, 댓글을 '다시 생각해보니 4점 정도'로 변경
UPDATE customer_review
SET rating = 4,
	comment = '다시 생각해보니 4점 정도'
WHERE review_id = 1;

-- 전체 리뷰 중 태그가 없는(tag_id IS NULL) 리뷰에 '강력추천' 태그를 붙이기
UPDATE customer_review
SET tag_id = (SELECT tag_id FROM review_tag WHERE tag_name = '강력추천')
WHERE tag_id IS NULL AND rating >= 4;

-- review_id를 NULL로 변경 시도
UPDATE customer_review
SET review_id = NULL
WHERE review_id = 2;
-- >> review_id는 기본키(primary key) 제약조건 위배 (NOT NULL 위배)

SELECT * FROM customer_review;

/*
	DELETE
    - 테이블에 기록된 데이터를 삭제하는 구문

    DELETE FROM 테이블명
    WHERE 조건식;

    - WHERE 절을 제시하지 않으면 전체 행이 삭제된다.
*/
-- customer_review에서 별점(rating)이 1점인 리뷰 삭제
DELETE FROM customer_review
WHERE rating = 1;

SELECT * FROM customer_review;

-- 13. VIEW (뷰)
/*
	뷰(View)
    - SELECT문을 저장할 수 있는 객체
    - 가상 테이블 (실제 데이터가 담겨 있는 건 X => 논리적인 테이블)
    - DML(INSERT, UPDATE, DELETE) 작업 가능한 경우도 있음

    * 사용 목적
    - 편리성 : SELECT문의 복잡도 완화
    - 보안성 : 테이블의 특정 열을 노출하고 싶지 않은 경우

	참고 : VIEW는 그 자체로 데이터를 담고 있지 않으므로(단순 SELECT 저장), sakila
	실제 테이블을 기반으로 만들어도 안전하다. (구조만 정의될 뿐, 데이터가 바뀌지 않음)
*/
-- customer, address, city, country
-- 'Canada'에 거주하는 고객들의 customer_id, 고객명, 도시, 결제 관련 정보를 매번 조회하려면?
SELECT customer_id, first_name, last_name, city, country
FROM customer
	JOIN address USING (address_id)
    JOIN city USING (city_id)
    JOIN country USING (country_id)
WHERE country = 'Canada';

-- 'Japan'에 거주하는 고객 조회하려면 매번 이 긴 JOIN문을 다시 써야 한다..
SELECT customer_id, first_name, last_name, city, country
FROM customer
	JOIN address USING (address_id)
    JOIN city USING (city_id)
    JOIN country USING (country_id)
WHERE country = 'Japan';

/*
	1. VIEW 생성
    CREATE [OR REPLACE] VIEW 뷰명
    AS 서브쿼리;

    - OR REPLACE : 뷰 생성 시 기존에 중복된 이름의 뷰가 없다면 새로 뷰 생성,
                   기존에 중복된 이름의 뷰가 있다면 해당 뷰 수정
*/
CREATE OR REPLACE VIEW vw_customer_country
AS SELECT customer_id, first_name, last_name, city, country
	FROM customer
		JOIN address USING (address_id)
		JOIN city USING (city_id)
		JOIN country USING (country_id);

SELECT * FROM vw_customer_country;

-- 'Canada'에 거주하는 고객 조회
SELECT *
FROM vw_customer_country
WHERE country = 'Canada';

-- 'Japan'에 거주하는 고객 조회
SELECT *
FROM vw_customer_country
WHERE country = 'Japan';

/*
	2. 뷰 컬럼에 별칭 부여
    - 서브쿼리의 SELECT절에 함수식이나 산술연산식이 기술되어 있을 경우 반드시 별칭 지정!
*/
-- 고객의 customer_id, 고객명, 활성여부(활성/비활성), 가입 후 경과일수를 조회할 수 있는
-- SELECT 문을 뷰(vw_customer_status) 생성
CREATE OR REPLACE VIEW vw_customer_status
AS SELECT
	customer_id 고객번호,
    concat(first_name, ' ', last_name) 고객명,
    if(active = 1, '활성', '비활성') 활성여부,
    timestampdiff(day, create_date, now()) 가입후경과일
FROM customer;

-- 활성여부가 '활성'인 고객의 고객명 조회
SELECT 고객명
FROM vw_customer_status
WHERE 활성여부 = '활성';

-- 가입 후 경과일이 5000일 이상인 고객 조회
SELECT *
FROM vw_customer_status
WHERE 가입후경과일 >= 5000;

/*
	3. VIEW를 이용해서 DML(INSERT, UPDATE, DELETE) 사용
    - 뷰를 통해 조작하게 되면 실제 데이터가 담겨 있는 테이블에 반영됨
    - sakila 실제 테이블을 그대로 노출하는 뷰로 DML을 하면 sakila 데이터가 깨질 위험이 있으므로,
      DML 데모는 반드시 우리가 만든 customer_review, review_tag로만 진행한다!
*/
CREATE OR REPLACE VIEW vw_review_tag
AS SELECT tag_id, tag_name
	FROM review_tag;

-- 뷰를 통해서 INSERT
INSERT INTO vw_review_tag
VALUES(NULL, '인생영화');

-- 뷰를 통해서 UPDATE
UPDATE vw_review_tag
SET tag_name = '인생작'
WHERE tag_name = '인생영화';

-- 뷰를 통해서 DELETE
DELETE FROM vw_review_tag
WHERE tag_name = '인생작';

SELECT * FROM vw_review_tag; -- 논리적인 테이블 (실제 데이터가 담겨있지 X)
SELECT * FROM review_tag; -- 베이스 테이블 (실제 데이터가 담겨있음)

/*
	4. DML 구문으로 VIEW 조작이 불가능한 경우
    - 다양한 이유로 뷰를 통한 DML이 막힐 수 있다. 대표적인 3가지 경우만 살펴본다.
*/
-- 1) 뷰 정의에 포함되지 않은 컬럼을 조작하는 경우
CREATE OR REPLACE VIEW vw_review_tag
AS SELECT tag_id FROM review_tag;

-- INSERT (에러) : tag_name이 뷰에 없는데 NOT NULL이라 값이 필요함
INSERT INTO vw_review_tag(tag_id, tag_name)
VALUES(90, '인턴');

-- 2) 그룹함수나 GROUP BY 절을 포함한 경우
-- 태그별 리뷰 개수, 평균 별점을 조회한 SELECT 문을 vw_tag_stat 뷰로 정의
CREATE OR REPLACE VIEW vw_tag_stat
AS SELECT tag_id, count(*) 리뷰수, avg(rating) 평균별점
	FROM customer_review
    GROUP BY tag_id;

SELECT * FROM vw_tag_stat;

-- INSERT (에러)
INSERT INTO vw_tag_stat
VALUES(99, 10, 4.5);

-- 3) JOIN을 이용해서 여러 테이블을 연결한 경우
-- 리뷰번호, 고객번호, 영화제목, 별점을 조회한 SELECT문을 vw_review_film 뷰로 정의
-- rating은 customer_review, film 둘 다에 있어서 반드시 테이블명으로 구분!
CREATE OR REPLACE VIEW vw_review_film
AS SELECT review_id, customer_id, title, customer_review.rating
	FROM customer_review
    JOIN film USING (film_id);

-- INSERT (에러 - 여러 테이블이 조인된 뷰는 원칙적으로 INSERT 불가능)
INSERT INTO vw_review_film
VALUES(200, 1, 'ACADEMY DINOSAUR', 5);

SELECT * FROM vw_review_film;

/*
	7. VIEW 옵션
    - WITH CHECK OPTION : 서브쿼리에 기술된 조건에 부합하지 않는 값으로 수정시 에러 발생!
*/
-- 별점이 4점 이상인 리뷰만 조회한 SELECT문을 vw_good_review 뷰로 정의
CREATE OR REPLACE VIEW vw_good_review
AS SELECT *
	FROM customer_review
    WHERE rating >= 4;

-- CHECK OPTION 테스트용 리뷰를 새로 하나 등록 (rating 5로 시작해서 뷰 조건을 만족시킴)
INSERT INTO customer_review(customer_id, film_id, rating, comment)
VALUES(2, 3, 5, 'CHECK OPTION 테스트용');

-- 방금 삽입한 행의 id를 변수에 저장해두고 계속 재사용 (같은 테이블을 UPDATE의 서브쿼리 대상으로 못 쓰기 때문)
SET @check_id = LAST_INSERT_ID();

-- vw_good_review를 통해 방금 등록한 리뷰의 별점을 2점으로 변경 (조건 위반)
UPDATE vw_good_review
SET rating = 2
WHERE review_id = @check_id;
-- >> WITH CHECK OPTION이 없으면 조건에 안 맞아지는 값으로도 수정이 가능해버림

-- WITH CHECK OPTION 사용!
CREATE OR REPLACE VIEW vw_good_review
AS SELECT *
	FROM customer_review
    WHERE rating >= 4
WITH CHECK OPTION;

-- 방금 2점으로 바뀐 걸 다시 5점으로 복구 (뷰가 아니라 원본 테이블에 직접 UPDATE)
UPDATE customer_review SET rating = 5 WHERE review_id = @check_id;

-- 이제 rating을 4 미만으로 바꾸려고 하면 에러 발생!
UPDATE vw_good_review
SET rating = 2
WHERE review_id = @check_id; -- 에러 발생!

-- 조건을 만족하는 값으로 변경하는 건 여전히 가능!
UPDATE vw_good_review
SET rating = 4
WHERE review_id = @check_id;

SELECT * FROM vw_good_review;

-- 14. INDEX (인덱스)
/*
	인덱스(INDEX)
    - SQL 명령문의 처리 속도를 향상시키기 위해 행들의 위치 정보를 가지고 있다.

    * 데이터 검색 방식
    Table Full Scan : 테이블 데이터를 처음부터 끝까지 검색하여 원하는 데이터를 찾는 방식
    Index Scan : 인덱스를 통해 데이터를 찾는 방식

    기본키(PRIMARY KEY)는 테이블의 각 행을 고유하게 식별한다.
    실제 테이블 데이터가 모두 인덱스 구조로 저장된다.

	참고 : INDEX는 데이터를 바꾸는 게 아니라 검색 구조만 추가하는 것이므로,
	sakila 실제 테이블(payment)에 만들어도 안전하다. 대신 실습이 끝나면 DROP으로 정리한다.
*/
-- 테이블에서 인덱스 조회
SHOW INDEX FROM payment;

-- 특정 스키마에 있는 인덱스를 한꺼번에 조회
SELECT *
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'sakila';

/*
	INDEX 생성

    CREATE INDEX 인덱스명
    ON 테이블명(컬럼, 컬럼, ...);
*/
-- amount 컬럼으로 결제 내역을 자주 검색한다고 가정
SELECT *
FROM payment
WHERE amount = 0.99;

CREATE INDEX idx_amount
ON payment(amount); -- 비고유 인덱스 생성

CREATE INDEX idx_amount_id
ON payment(amount, payment_id); -- 결합 인덱스 생성

SHOW INDEX FROM payment;

/*
	INDEX 삭제

    DROP INDEX 인덱스명
    ON 테이블명;
*/
DROP INDEX idx_amount ON payment;
DROP INDEX idx_amount_id ON payment;


-- 15. PROCEDURE / FUNCTION (프로시저 / 함수)
/*
	프로시저(PROCEDURE)
    - SQL문을 저장하여 필요할 때마다 다시 입력할 필요 없이
      간단하게 호출해서 사용 가능하게 하는 코드 블록
    - 파라미터(매개변수)를 받아서 동작을 다르게 만들 수 있다.
    - CREATE PROCEDURE 안에서는 세미콜론을 여러 번 써야 해서, 문(statement)의 끝을
      잠시 다른 기호로 바꿔주는 DELIMITER 명령이 필요하다 (아래 실행 코드에서 실제 사용법 확인)

	참고 : 프로시저 실습도 우리가 만든 customer_review 테이블로만 진행한다.
*/
/* 파라미터가 있는 프로시저 (review_id 하나를 파라미터로 받아서 그 리뷰만 삭제) */
DELIMITER //

CREATE PROCEDURE del_review(IN target_id INT)
BEGIN
	DELETE FROM customer_review
    WHERE review_id = target_id;
END //

DELIMITER ;

-- 만들어진 프로시저 확인
SHOW PROCEDURE STATUS WHERE Db = 'sakila';

-- 프로시저 실행
CALL del_review(4);

SELECT * FROM customer_review;

-- 프로시저 삭제
DROP PROCEDURE del_review;

/*
	함수(FUNCTION)
    - 프로시저와 거의 유사한 용도로 리턴값(반환값)이 있는 재사용 가능한 코드 블록
    - 특정 계산이나 로직을 함수로 묶어 사용한다
    - RETURNS로 리턴할 자료형을 지정하고, DECLARE로 리턴값을 담을 변수를 선언한 다음
      RETURN으로 결과를 돌려준다 (프로시저와 마찬가지로 DELIMITER 필요, 아래 실행 코드 참고)

	참고 : 함수는 customer_id를 파라미터로 받아서 sakila의 payment 테이블을
	"읽기만" 하고 계산 결과를 리턴하므로, 실제 데이터를 전혀 바꾸지 않아 안전하다.
*/
/* 고객번호(customer_id)를 파라미터로 입력받아 해당 고객의 총 결제금액을 계산하고 리턴하는 함수 생성 */
DELIMITER //
CREATE FUNCTION get_customer_total_paid(cust_id INT)
RETURNS DECIMAL(10, 2)
DETERMINISTIC
BEGIN
	DECLARE result DECIMAL(10, 2);

    SELECT sum(amount) INTO result
	FROM payment
	WHERE customer_id = cust_id;

    RETURN ifnull(result, 0);
END //
DELIMITER ;

-- 함수 호출
SELECT get_customer_total_paid(1);

-- 방금 만든 get_customer_total_paid 함수를 이용해서 총 결제금액이 100달러 이상인
-- 고객의 customer_id, first_name, 총결제금액 조회 (정렬 : 총결제금액 높은 순)
SELECT customer_id, first_name, get_customer_total_paid(customer_id) 총결제금액
FROM customer
WHERE get_customer_total_paid(customer_id) >= 100
ORDER BY 총결제금액 DESC;

-- 함수 삭제
-- DROP FUNCTION IF EXISTS get_customer_total_paid; -- 다음 섹션에서도 사용하므로 지금은 유지


-- 16. TRIGGER (트리거)
/*
	트리거(TRIGGER)
    - 특정 이벤트가 발생할 때 자동으로 실행될 내용을 정의하여 저장

    ex)
    - 리뷰가 삭제될 때 별도의 삭제 이력 테이블에 자동으로 기록
    - 신고횟수가 일정 수를 넘었을 때 해당 리뷰를 블라인드 처리
    - 리뷰가 새로 등록(INSERT) 될 때마다 관련 통계를 매번 자동으로 갱신해야 되는 경우
    - CREATE TRIGGER 트리거명 BEFORE|AFTER INSERT|UPDATE|DELETE ON 테이블명 FOR EACH ROW
      다음에 BEGIN ~ END로 실행할 SQL 구문을 감싼다 (프로시저와 마찬가지로 DELIMITER 필요, 아래 실행 코드 참고)

	참고 : 트리거도 customer_review, review_tag처럼 우리가 만든 테이블에만 건다.
*/
SHOW TRIGGERS WHERE `Table` = 'customer_review';

-- 리뷰 관련 이벤트를 기록할 로그 테이블 생성
CREATE TABLE review_log(
	log_id INT AUTO_INCREMENT PRIMARY KEY,
    event_type VARCHAR(50),
    event_desc VARCHAR(200),
    event_timestamp TIMESTAMP DEFAULT now()
);

/*
	customer_review 테이블에서 UPDATE 수행 후 변경 전과 후의 별점을 review_log에 담는
    trg_review_update_log 트리거 생성

    OLD : 수정, 삭제 전 데이터에 접근 가능
    NEW : 추가, 수정 후 데이터에 접근 가능
*/
DELIMITER //
CREATE TRIGGER trg_review_update_log
AFTER UPDATE ON customer_review
FOR EACH ROW
BEGIN
	INSERT INTO review_log(event_type, event_desc)
    VALUES('UPDATE', concat('변경 전 별점 : ', OLD.rating, ' / 변경 후 별점 : ', NEW.rating));
END //
DELIMITER ;

-- customer_review에서 review_id가 1인 리뷰의 별점을 5점으로 변경
UPDATE customer_review
SET rating = 5
WHERE review_id = 1;

SELECT * FROM review_log;

/*
	IF 조건
    THEN SQL문
    ELSE SQL문
    END IF;

    리뷰가 새로 등록될 때, 별점이 2점 이하면 '낮은 별점 주의' 알림을,
    그 외에는 '리뷰 등록 완료' 로그를 남기는 trg_review_rating_alert 트리거 생성
*/
DELIMITER //
CREATE TRIGGER trg_review_rating_alert
AFTER INSERT ON customer_review
FOR EACH ROW
BEGIN
	IF NEW.rating <= 2
	THEN INSERT INTO review_log(event_type, event_desc)
		 VALUES('ALERT', concat('낮은 별점 주의 (review_id: ', NEW.review_id, ')'));
	ELSE INSERT INTO review_log(event_type, event_desc)
		 VALUES('INFO', concat('리뷰 등록 완료 (review_id: ', NEW.review_id, ')'));
	END IF;
END //
DELIMITER ;

-- 별점이 낮은 리뷰 등록
INSERT INTO customer_review(customer_id, film_id, rating, comment)
VALUES(9, 9, 1, '기대 이하였어요');

-- 별점이 높은 리뷰 등록
INSERT INTO customer_review(customer_id, film_id, rating, comment)
VALUES(9, 10, 5, '인생 영화입니다');

SELECT * FROM review_log ORDER BY log_id;

-- 트리거 삭제
DROP TRIGGER IF EXISTS trg_review_rating_alert;
DROP TRIGGER IF EXISTS trg_review_update_log;


/*
	데이터베이스 모델링 (DB 모델링)
    - 데이터베이스를 설계하는 프로세스
    - 테이블 간의 관계 정의 및 구조 결정

    작업 순서
    1. 개념적 모델링
		- 엔티티(Entity) 추출
        - 엔티티 간의 관계 설정
    2. 논리적 모델링 : ERD(Entity Relationship Diagram) 툴 활용
		- 정규화 작업 (1 ~ 5, 보통 3단계까지만)
          --> 너무 쪼개면 JOIN만 많아져서 오히려 비효율적일 수 있음
    3. 물리적 모델링
		- 테이블을 실질적으로 구성 (CREATE TABLE 작성)
*/