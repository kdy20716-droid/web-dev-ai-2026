const Game = {
  targetNumber: 0,
  tryCount: 0,

  getTarget: function () {
    return Math.floor(Math.random() * 100) + 1;
  },

  setInput: function () {
    return prompt("1부터 100까지의 숫자를 입력하세요.");
  },

  // 취소 버튼을 눌렀을 때 input이  null인데 이때 종료
  judge: function (input) {
    if (input === null) {
      return "CANCEL";
    }

    // 유효성 검사
    if (input.trim() === "" || isNaN(input)) {
      return "INVALID";
    }

    // 유저가 입력한 숫자
    const userNum = Number(input);

    // 범위 검사
    if (userNum === this.targetNumber) {
      return "CORRECT";
    } else if (userNum > this.targetNumber) {
      return "DOWN";
    } else {
      return "UP";
    }
  },

  // 메시지 출력
  showMessage: function (status) {
    switch (status) {
      case "INVALID":
        alert("제대로 입력해주세요");
        break;
      case "DOWN":
        alert("해당 숫자보다 작습니다.");
        break;
      case "UP":
        alert("해당 숫자보다 큽니다.");
        break;
      case "CORRECT":
        alert(`정답입니다! ${this.tryCount}번 만에 맞추셨습니다.`);
        break;
      case "CANCEL":
        alert("게임을 종료합니다.");
        break;
    }
  },

  // 게임 시작
  play: function () {
    this.targetNumber = this.getTarget();
    this.tryCount = 0;

    while (true) {
      const input = this.setInput();
      const status = this.judge(input);

      if (status === "INVALID") {
        this.showMessage(status);
        continue;
      }

      if (status === "CANCEL") {
        this.showMessage(status);
        break;
      }

      this.tryCount++;
      this.showMessage(status);

      if (status === "CORRECT") {
        break;
      }
    }
  },
};

Game.play();
