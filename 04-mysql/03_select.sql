-- SELECT 컬럼명 FROM 테이블명;
-- * : 모든 컬럼
SELECT * FROM recipes;
SELECT name, image, description 
FROM recipes;

-- 별칭(alias) : 조회 결과 컬럼 이름을 바꾸고자 할 때 사용
SELECT 
	name as 레시피이름, 
    image recipe_image, 
    description '레시피 설명'
FROM recipes;

-- WHERE : 조건에 맞는 데이터 조회
-- user_id가 1인 학생이 등록한 레시피만 조회
SELECT * 
FROM recipes
WHERE user_id = 1;

-- 비교 연산자 : =, !=, <>, >, <, >=, <=
-- id가 20보다 큰 레시피 조회
SELECT *
FROM recipes
WHERE id > 20;

SELECT *
FROM recipes
WHERE name = '유자 토닉';

-- LIKE : 특정 글자가 포함/시작/끝나는 데이터 조회 (검색 기능)
-- name이 '유자'로 시작하는 레시피 조회
SELECT *
FROM recipes
WHERE name LIKE '유자%';

-- name이 '토닉'으로 끝나는 레시피 조회
SELECT *
FROM recipes
WHERE name LIKE '%토닉';

-- name이 '진저'가 포함된 레시피 조회 (검색 기능!!)
SELECT *
FROM recipes
WHERE name LIKE '%진저%';

-- AND/OR : 조건을 여러개 사용
-- name에 진저가 포함되어 있으면서 user_id가 5인 레시피 조회
SELECT *
FROM recipes
WHERE name LIKE '%진저%' AND user_id = 5;


-- name에 진저가 포함되어 있거나 user_id가 5인 레시피 조회
SELECT *
FROM recipes
WHERE name LIKE '%진저%' OR user_id = 5;

-- ORDER BY : 정렬할 때 사용 (DESC : 내림차순, ASC : 오름차순 - 생략 가능)
-- 최신순 정렬
SELECT * 
FROM recipes
ORDER BY created_at DESC;

-- name을 기준으로 오름차순 정렬(가나다 순)
SELECT * 
FROM recipes
ORDER BY name;

-- 최신 등록순 정렬
SELECT * 
FROM recipes
ORDER BY id DESC;

-- name은 가나다순, user_id는 작은숫자부터
SELECT * 
FROM recipes
ORDER BY user_id, name;

-- LIMIT : 조회 결과 개수 제한
SELECT * 
FROM recipes 
LIMIT 5;

-- SELECT - FROM - WHERE - ORDER BY - LIMIT 순
-- description에 '민트'가 포함된 최신순으로 5개만 조회
SELECT * 
FROM recipes 
WHERE description LIKE '%민트%'
ORDER BY created_at DESC
LIMIT 5;

