// HTML 구조가 완전히 로드된 뒤 실행
//window.addEventListener("DOMContentLoaded", () => {});
// h1 가져오기
const h1 = document.querySelector("h1");
console.log(h1);

// 클릭 이벤트
const click = document.querySelector("#click");
click.addEventListener("click", () => {
  // 클릭 이벤트가 일어날 시 실행하고자 하는 코드 작성
  console.log("클릭 이벤트 발생!");
  click.style.backgroundColor = "hotpink";
});

const double = document.querySelector("#double");
double.addEventListener("dblclick", () => {
  console.log("더블 클릭 이벤트 발생!");
});

const right = document.querySelector("#right");
right.addEventListener("contextmenu", (event) => {
  //console.log(event);
  event.preventDefault(); // 이벤트 제거
  //alert("우클릭 발생!");
});
const hover = document.querySelector("#hover");
hover.addEventListener("mouseenter", () => {
  console.log("mousenter!");
  hover.style.backgroundColor = "lightblue";
  hover.textContent = "Mouse Enter!";
});
hover.addEventListener("mouseleave", () => {
  console.log("mouseleave!");
  hover.style.backgroundColor = "navy";
  hover.textContent = "Mouse Leave!";
});

const form = document.querySelector("#form");
const input = document.querySelector("#input");
const inputResult = document.querySelector("#inputResult");
form.addEventListener("submit", (e) => {
  // input 입력이 비어있을시만 방지, 입력했다면 제출
  if (input.value.trim() === "") e.preventDefault();
  else alert("제출 완료!");
});
input.addEventListener("input", () => {
  console.log(input.value);
  inputResult.textContent = input.value;
});
// select에 있는 option을 선택할 때마다 일어나는 이벤트 : change
// 해당하는 이벤트가 일어날 시 selectResult에 값이 나타나도록
// e. target.value
const select = document.querySelector("#select");
const selectResult = document.querySelector("#selectResult");
select.addEventListener("change", (e) => {
  console.log(e.target.value);
  selectResult.textContent = e.target.value;
});
// 3. 키보드 이벤트
const key = document.querySelector("#key");
const keyResult = document.querySelector("#keyResult");
// keydown - keypress - keyup
key.addEventListener("keydown", (e) => {
  console.log(e.code);
  keyResult.textContent = e.code;
});
// 키보드를 눌러서 상자를 움직이게 하기
const moveBox = document.querySelector(".moveBox");
let x = 0;
let y = 0;
document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft") {
    x -= 10;
  } else if (e.code === "ArrowRight") {
    x += 10;
  } else if (e.code === "ArrowUp") {
    y -= 10;
  } else if (e.code === "ArrowDown") {
    y += 10;
  }
  moveBox.style.left = `${x}px`;
  moveBox.style.top = `${y}px`;
});

// 4. 스크롤 이벤트
const wheel = document.querySelector("#wheel");
document.addEventListener("wheel", (e) => {
  if (e.deltaY < 0) wheel.textContent = "휠을 위로 올림!";
  else wheel.textContent = "휠을 아래로 내림!.";
});
const scroll = document.querySelector("#scroll");
document.addEventListener("scroll", () => {
  // console.log(document.documentElement.scrollHeight); // 전체 높이
  // console.log(window.innerHeight); // 화면에 보이는 높이
  // console.log(window.scrollY); // 스크롤 위치
  // scrollY + innerHeight === scrollHeight
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollY = window.scrollY;
  const innerHeight = window.innerHeight;
  // console.log(scrollHeight - innerHeight); // scrollY (가장 아래에 있을 경우)
  const totalHeight = scrollHeight - innerHeight;
  console.log(scrollY / totalHeight) * 100;
  const width = (scrollY / totalHeight) * 100;
  scroll.style.width = `${width}%`;
});

// 5. 이벤트 위임
// 이미지를 클릭할 때마다 해당 이미지 지우기

/* 방법 1 - 요소들을 포함하는 부모 요소에게 이벤트를 맡김
const img = document.querySelectorAll(".container img");
img.forEach((img) => {
  img.addEventListener("click", (e) => {
    e.target.remove();
  });
});  */

// 방법 2 - 마을 입구에 검문소를 세우는 방식
const container = document.querySelector(".container");
container.addEventListener("click", (e) => {
  if (e.target.tagName === "IMG") {
    e.target.remove();
  }
});
