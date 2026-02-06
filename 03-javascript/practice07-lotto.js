// 로또 번호 6개 추출
const lotto = [];
while (lotto.length < 6) {
  const num = Math.floor(Math.random() * 45) + 1;
  if (!lotto.includes(num)) {
    lotto.push(num);
  }
}
// 보너스 번호 1개 추출 (로또 번호와 겹치지 않게)
let bonus;
while (true) {
  const num = Math.floor(Math.random() * 45) + 1;
  if (!lotto.includes(num)) {
    bonus = num;
    break;
  }
}
console.log(
  `로또 번호: ${lotto.sort((a, b) => a - b)} / 보너스 번호: ${bonus}`,
);

// 내가 입력한 번호도 6개 숫자 랜덤으로 맞출 때까지
const myLotto = [];
while (myLotto.length < 6) {
  const num = Math.floor(Math.random() * 45) + 1;
  if (!myLotto.includes(num)) {
    myLotto.push(num);
  }
}
console.log(myLotto);

// 1등 당첨 : 6개 일치
const count = lotto.filter((num) => myLotto.includes(num)).length;
if (count === 6) {
  console.log("1등 당첨!");
}
// 2등 당첨 : 5개 일치 + 보너스
if (count === 5 && bonus.includes(myLotto[6])) {
  console.log("2등 당첨!");
}
// 3등 당첨 : 5개 일치
if (count === 5) {
  console.log("3등 당첨!");
}
// 4등 당첨 : 4개 일치
if (count === 4) {
  console.log("4등 당첨!");
}
// 5등 당첨 : 3개 일치
if (count === 3) {
  console.log("5등 당첨!");
}
// 테스트 : 1~5등 당첨 될때까지 무한반복 (ai사용)
let tryCount = 0;
const intervalId = setInterval(() => {
  tryCount++;
  const myTestLotto = [];
  while (myTestLotto.length < 6) {
    const num = Math.floor(Math.random() * 45) + 1;
    if (!myTestLotto.includes(num)) {
      myTestLotto.push(num);
    }
  }

  const matchCount = lotto.filter((num) => myTestLotto.includes(num)).length;
  console.log(myTestLotto);

  if (matchCount === 6) {
    console.log("1등 당첨!");
    clearInterval(intervalId);
  } else if (matchCount === 5 && myTestLotto.includes(bonus[0])) {
    console.log("2등 당첨!");
    clearInterval(intervalId);
  } else if (matchCount === 5) {
    console.log("3등 당첨!");
    clearInterval(intervalId);
  } else if (matchCount === 4) {
    console.log("4등 당첨!");
    clearInterval(intervalId);
  } else if (matchCount === 3) {
    console.log("5등 당첨!");
    clearInterval(intervalId);
  }
}, 100);
