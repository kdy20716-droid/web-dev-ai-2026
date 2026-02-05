/*
 사람 {
      // 특징들! => 변수
      이름
      나이
      사는곳

      // 행동들! => 함수 (기능)
      일어난다
      밥먹는다
      씻는다
      옷입는다
      나간다
 }
*/
// 변수끼리 서로 관련이 있다는 게 보이지 않음
const name = "김도연";
const age = 25;
const addr = "서울";

// 배열은 서로 관련이 있다는게 보임, 각각의 값이 뭘 의미하는지 모름
const personArr = ["김도연", "25", "서울"];

// 객체 (변수 - 키: 값)
const person = {
  // 변수
  name: "김도연",
  age: 25,
  addr: "서울",
  // 함수
  hello() {
    // this : 본인 자체
    console.log(" 안녕하세요, $(this.name) 입니다");
  },
};
console.log(person);
console.log(person.name);
person.hello();

// 객체 생성과 속성/함수 추가
const person1 = new Object();
person1.name = "김도연";
person1.name = "김도연1";
person1["age"] = 25;
person1.hello = function () {
  console.log(`나는, ${this.name}이고, 나이는 ${this.age}살이야`);
};
console.log(person1);
person1.hello();

const person2 = new Object();
person2.name = "김도연";
person2.age = 25;
person2.hello = function () {
  console.log(`나는, ${this.name}이고, 나이는 ${this.age}살이야`);
};
person2.hello();

// this
const person3 = {
  name: "김도연",
  age: 25,
  hello: function () {
    console.log(`익명함수 : ${this}`);
  },
};

const person4 = {
  name: "김도연",
  age: 25,
  hello: () => {
    // 화살표 함수 내에서 this --> 전역 객체인 window
    // console.log(this.alert("안녕하세요!"))
    console.log(`화살표함수 : ${this.name}`);
  },
};
person3.hello();

// 생성자 함수, 클래스
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.hello = function () {
    console.log(`안녕? ${this.name}이야, 나이는 ${this.age}살이야`);
  };
}
const p1 = new Person("김도연", 25);
p1.hello();
const p2 = new Person("김도연2", 25);
p2.hello();

// 함수 형식보다는 클래스 형식을 더 사용
class Person2 {
  // 객체 생성자 호출
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  hello() {
    console.log(`안녕? ${this.name}이야, 나이는 ${this.age}살이야`);
  }
}
const p3 = new Person2("김도연3", 25);
p3.hello();
