// Math 객체
console.log("최소한 :", Math.min(5, 7, -1, -8)); // -8
console.log("최대값 :", Math.max(5, 7, -1, -8)); // 7
console.log("절대값 :", Math.abs(-7.57)); // 7.57
console.log("반올림 :", Math.round(2.897)); // 3
console.log("올림 :", Math.ceil(2.8978)); // 3
console.log("내림 :", Math.floor(2.8978)); // 2
console.log("0~3 랜덤 :", Math.random());

// 1 ~ 10까지의 랜덤 숫자
// 0 <= Math.ramdom() < 1
// * 10
// 0 <= Math.ramdom() * 10 < 10
// + 1
// 1 <= Math.ramdom() * 10 + 1 < 11
console.log(Math.floor(Math.random() * 10) + 1);

// 5 ~ 15까지의 랜덤 숫자
console.log(Math.floor(Math.random() * 11) + 5);

//Date 객체
const now = new Date();
// 현재 날짜 및 시간
console.log(now);
console.log(
  `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 ${now.getHours()}시 ${now.getMinutes()}분 ${now.getSeconds()}초`,
);

const date = new Date(2026, 7, 20, 18, 10, 0);
console.log(date);

const date2 = new Date("2026-08-20");
console.log(date2);

const date3 = new Date("2026-08-20");
//console.log(date3, toLocaleleDateString("KO-KR", { weekday: "long" }));

const date4 = new Date("2026-08-20T18:10:00");
//console.log(date3, toLocaleleDateString("en-CA"));

// string
const str = new String("Hello javascript");
console.log("길이 :", str.length);
console.log("포함여부 :", str.includes("java"));
console.log("위치 :", str.indexOf("java"));
console.log("일부 :", str.slice(7, 17));
console.log("대문자 :", str.toUpperCase());
console.log("소문자 :", str.toLowerCase());

// Timer
// 1000 = 1초
// 일정 시간 후 1회 실행
setTimeout(() => {
  console.log("3초 후 실행");
}, 3000);

// 일정 시간마다 반복 실행
let sec = 0;
setInterval(() => {
  console.log(`${++sec}초`);
}, 1000);

// json
const obj = {
  name: "김도연",
  age: 25,
};
// 객체 -> 문자열
const jsonStr = JSON.stringify(obj);
console.log(obj, typeof obj);
console.log(jsonStr, typeof jsonStr);
// 문자열 -> 객체
const jsonParse = JSON.parse(jsonStr);
console.log(jsonParse, typeof jsonParse);

// BOM
console.log(location.href); // 전체 주소
console.log(location.host); // 호스트명(도메인)
console.log(location.pathname); // 경로

// 페이지 이동
// location.href = "https://www.naver.com";
