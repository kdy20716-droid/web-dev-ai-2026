const Game = {
  targetNumber: 0,
  tryCount: 0,

  getTarget: function () {
    return Math.floor(Math.random() * 100) + 1;
  },

  setInput: function () {
    return prompt("1부터 100까지의 숫자를 입력하세요.");
  },

  judge: function (input) {
    if (input === null) {
      return "CANCEL";
    }

    if (input.trim() === "" || isNaN(input)) {
      return "INVALID";
    }

    const userNum = Number(input);

    if (userNum === this.targetNumber) {
      return "CORRECT";
    } else if (userNum > this.targetNumber) {
      return "DOWN";
    } else {
      return "UP";
    }
  },

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
