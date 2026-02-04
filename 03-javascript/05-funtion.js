// 2. 매개변수(parameter) o, 리턴값 x
function sayHello() {
  console.log("Hello");
}
sayHello();

// 3. 매개변수 x, 리턴값 o
// return : 함수 호출 결과, 함수 종료
function getNumber() {
  return 1049;
}
console.log(getNumber());

// 4. 매개변수 o, 리턴값 o
// 파라미터는 입력, 리턴은 출력
function add(a, b) {
  return a + b;
}
console.log(add(10, 20));

//변수와 유효범위(scope)
const numl = 100; // 전역변수
function sample() {
  const numl = 200; // 지역변수
  // 함수 밖에서 안쪽 변수는 접근 불가
  console.log("sample 내부 : ", numl); // 200
}
console.log("sample 외부 : ", numl); //100
sample();

// 선언적 vs 익명 vs 화살표 함수
// 선언적 함수(Funtion Declaration)
// 호이스팅 : 선언 이전에 호출 가능
console.log("선언적 함수 :", multiply(3, 4));
function multiply(a, b) {
  return a * b;
}
// 익명 함수(Funtion Expression)
// 함수 이름이 없음, 변수에 할당
const subtract = function (a, b) {
  return a - b;
};
console.log("익명 함수 :", subtract(5, 8));

// 화살표 함수(Arrow Function)
// Function 대신 => 사용
const divide = (a, b) => {
  return a / b;
};
console.log("화살표 함수 :", divide(12, 3));

// 콜백 함수
// 다른 함수의 파라미터로 전달하는 함수
function callfunc(callback) {
  console.log("함수 호출 전");
  callback(); // 콜백 함수 호출
  console.log("함수 호출 후");
}
function call() {
  console.log("안녕하세요~ 콜백 함수 호출");
}
callfunc(call);

// 배열 관련 콜백 함수들
const numbers = [1, 2, 3, 4, 5];

// 1. 값을 하나씩 출력
for (let i = 0; i <= numbers.length; i++) {
  // 전에 배운 반복문
  console.log(numbers[i], i, numbers);
}

numbers.forEach((value, index, array) => {
  console.log(value, index, array);
});
// 배열의 값을 각각 2배로 만들어서 출력 -map
// [2, 4, 6, 8, 10]
// 각 배열의 값들을 가공하여 새로운 배열로 만들 때
/* forEach 사용했을때
numbers.forEach((value, index, array) => {
  numbers[index] = value * 2;
});
console.log(numbers);
*/
const doubled = numbers.map((value, index, array) => {
  return value * 2;
});
console.log(doubled);

numbers.doublemap = numbers.map((value) => {
  return value * 2;

  console.log(doublemap);
});

// 3. 짝수만 출력
// [2, 4]
const even = [];
numbers.forEach((value) => {
  if (value % 2 === 0) even.push(value);
});
console.log(even);

const evenFilter = numbers.filter((value, index, array) => value % 2 === 0);
console.log(evenFilter);

// 4. 배열의 값의 총합
let sum = 0;
numbers.forEach((value) => {
  sum += value;
});
console.log(sum);

// reduce((accumulatar 누적된 값, value, index, array) => {}, 초기값)
// 배열의 각 값들을 누적하여 하나의 값으로 변환
const sumReduce = numbers.reduce((acc, value) => {
  console.log("acc : ${acc}, value : ${value}");
  return acc + value;
}, 0);
console.log(sumReduce);
