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
