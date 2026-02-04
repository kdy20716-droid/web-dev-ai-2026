let answer = Math.floor(Math.random() * 100) + 1;

let count = 0;

function gameStart() {
  while (true) {
    let input = prompt("1부터 100 사이의 숫자를 입력해보세요!");

    // 무한반복 -> 종료하는 시점 (break)
    // 취소 버튼을 눌렀을 때 input이 null한테 이때 종료
    if (input === null) {
      alert("게임을 종료합니다.");
      break;
    }

    if (input === "" || isNaN(input)) {
      alert("숫자만 입력해주세요!");
      continue;
    }

    let myNumber = Number(input);
    // 끝나는 시점! 내가 입력한 input 값이 랜덤 값을 맞춤

    count = count + 1;

    if (myNumber === answer) {
      alert("정답입니다! " + count + "번 만에 맞췄어요!");
      break;
    } else if (myNumber > answer) {
      alert("해당 숫자보다 작습니다.");
    } else {
      alert("해당 숫자보다큽니다.");
    }
  }
}

gameStart();
