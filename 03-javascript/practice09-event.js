// 요소 가져오기
const img1 = document.querySelector("#img1");
const img2 = document.querySelector("#img2");
const img3 = document.querySelector("#img3");

const clickBtn = document.querySelector("#clickBtn");
const restartBtn = document.querySelector("#restartBtn");
const result = document.querySelector("#result");
const fail = document.querySelector("#fail");

// 이미지 배열
const images = [
  "./03-javascript/assets/spy1.jpg",
  "./03-javascript/assets/spy2.jpg",
  "./03-javascript/assets/spy3.jpg",
];

let count = 0;

// 클릭 버튼 이벤트
clickBtn.addEventListener("click", () => {
  count++; // 횟수 증가
  clickBtn.textContent = `click(${count})`;

  // 랜덤 숫자 3개 생성 (0 ~ 2)
  const num1 = Math.floor(Math.random() * 3);
  const num2 = Math.floor(Math.random() * 3);
  const num3 = Math.floor(Math.random() * 3);
  console.log(num1, num2, num3);

  // 이미지 변경
  img1.src = images[num1];
  img2.src = images[num2];
  img3.src = images[num3];

  // 3개가 모두 같으면 승리
  if (num1 === num2 && num2 === num3) {
    console.log("성공");
    clickBtn.disabled = true; // 버튼 비활성화
    result.style.display = "block"; // 결과 메시지 보이기
    result.textContent = `축하합니다! ${count}번 만에 성공하셨습니다! 다시 시작하려면 재시작 버튼을 눌러주세요`;
    fail.style.display = "none"; // 실패 메시지 숨기기

    // 폭죽 효과 생성
    const firework = document.createElement("div");
    firework.classList.add("firework");
    document.body.appendChild(firework);

    // 1.5초 뒤에 폭죽 요소 제거
    setTimeout(() => {
      document.body.removeChild(firework);
    }, 3000);
  } else {
    console.log("실패");
    fail.style.display = "block"; // 실패 메시지 보이기
    fail.textContent = `안탑깝게도 ${count}번 만에 맞추는데 실패했습니다! click 버튼을 다시 눌러주세요!`;
  }
});

// 재시작 버튼 이벤트
restartBtn.addEventListener("click", () => {
  location.reload();
});
