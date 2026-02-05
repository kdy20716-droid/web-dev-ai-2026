// 1. 기본 구현 (practice05 참고하여 제작 + 승패 관련은 ai을 보고 수정)
// 랜덤으로 가위,바위,보 고름
const games = ["가위", "바위", "보"];
const random = Math.floor(Math.random() * games.length);
const com = games[random];

console.log(com);

function play() {
  // 프롬프트 입력 창
  while (true) {
    let input = prompt("안내면 진다~ 가위~ 바위~ 보");
    console.log(input);

    // 취소 버튼을 눌렀을 때 input이 null한테 이때 종료
    if (input === null) {
      alert("하나라도 내지않은 당신의 패배!");
      break;
    }

    // 이상한 값을 입력시 뜨는 창
    if (input !== "가위" && input !== "바위" && input !== "보") {
      alert("가위, 바위, 보 중 하나를 정확히 입력해주세요!");
      continue;
    }

    // 승패 결과 판단
    if (input === com) {
      alert("비겼습니다! 컴퓨터: " + com);
    } else if (
      (input === "가위" && com === "보") ||
      (input === "바위" && com === "가위") ||
      (input === "보" && com === "바위")
    ) {
      alert("이겼습니다! 컴퓨터: " + com);
    } else {
      alert("졌습니다... 컴퓨터: " + com);
    }
    break;
  }
}

play();

// 2. 객체 구현 방식 (ai보면서 만들기, 06-object.js도 참고)
const computer = {
  choice: "",

  select() {
    const items = ["가위", "바위", "보"];
    const random = Math.floor(Math.random() * 3);
    this.choice = items[random];
    console.log("컴퓨터:", this.choice);
  },
};

const player = {
  choice: "",
};

const game = {
  start() {
    computer.select();

    while (true) {
      const input = prompt("가위, 바위, 보 중 하나를 입력하세요");

      if (input === null) {
        alert("게임을 종료합니다.");
        break;
      }

      if (input === "가위" || input === "바위" || input === "보") {
        player.choice = input;
        this.result();
        break;
      } else {
        alert("잘못 입력했습니다. 다시 입력해주세요.");
      }
    }
  },

  result() {
    const myChoice = player.choice;
    const comChoice = computer.choice;

    if (myChoice === comChoice) {
      alert(`비겼습니다! (컴퓨터: ${comChoice})`);
    } else if (
      (myChoice === "가위" && comChoice === "보") ||
      (myChoice === "바위" && comChoice === "가위") ||
      (myChoice === "보" && comChoice === "바위")
    ) {
      alert(`이겼습니다! (컴퓨터: ${comChoice})`);
    } else {
      alert(`졌습니다... (컴퓨터: ${comChoice})`);
    }
  },
};

game.start();

// 객체 구현 방식 (참고한 ai)
/* 
  객체 분리: Computer, Player, Game
  - 컴퓨터(computer): 랜덤 선택 기능
  - 사용자(player): 선택 저장 기능
  - 게임(game): 승패 판단 및 진행 기능

// 1. 컴퓨터 객체
const computer = {
  choice: null,
  options: ["가위", "바위", "보"],

  makeChoice: function () {
    const randomIndex = Math.floor(Math.random() * this.options.length);
    this.choice = this.options[randomIndex];
    console.log("컴퓨터(몰래보기):", this.choice);
  },
};

// 2. 플레이어(사용자) 객체
const player = {
  choice: null,
};

// 3. 게임 객체
const game = {
  start: function () {
    // 컴퓨터가 먼저 패를 결정
    computer.makeChoice();

    while (true) {
      // 사용자 입력 받기
      const input = prompt("가위, 바위, 보 중 하나를 입력하세요!");

      if (input === null) {
        alert("게임을 취소했습니다.");
        break;
      }

      if (input !== "가위" && input !== "바위" && input !== "보") {
        alert("가위, 바위, 보 만 입력할 수 있어요!");
        continue;
      }

      // 플레이어의 선택 저장
      player.choice = input;

      // 결과 판단
      this.checkResult();
      break;
    }
  },

  checkResult: function () {
    const user = player.choice;
    const com = computer.choice;

    if (user === com) {
      alert(`비겼습니다! 컴퓨터: ${com}`);
    } else if (
      (user === "가위" && com === "보") ||
      (user === "바위" && com === "가위") ||
      (user === "보" && com === "바위")
    ) {
      alert(`이겼습니다! 컴퓨터: ${com}`);
    } else {
      alert(`졌습니다... 컴퓨터: ${com}`);
    }
  },
};

// 객체 안에 만들어둔 start 기능을 실행합니다.
game.start();

*/
