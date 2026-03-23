DROP TABLE recipes;
DROP TABLE users;

CREATE TABLE users(
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL
);
CREATE TABLE recipes(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    image VARCHAR(200) NOT NULL,
    descrpition TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE reviews(
    id VARCHAR(50),
    reviews VARCHAR(500)
    rating INT
);

SELECT * FROM users; -- 조회

-- DROP : 삭제
DROP TABLE users(
    id VARCHAR(50),
    email VARCHAR(200),
    password VARCHAR(200),
)

-- 제약조건(CONSTRAINT) : 데이터 무결성을 지키기 위한 규칙