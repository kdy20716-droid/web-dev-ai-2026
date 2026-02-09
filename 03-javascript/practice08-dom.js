const quotes = [
  {
    en: "God doesn't require us to succeed: he only requires that you try.",
    ko: "신은 우리에게 성공을 요구하지 않는다. 우리가 노력할 것을 요구할 뿐이다.",
  },
  {
    en: "Hold faithfulness and sincerity as first principles.",
    ko: "충심과 성실을 첫 번째 원칙으로 삼아라.",
  },
  {
    en: "Only actions give life strength; only moderation gives it a charm.",
    ko: "행동만이 삶에 힘을 주고 절제만이 삶에 매력을 준다.",
  },
  {
    en: "No one has ever made a difference by being like everyone else.",
    ko: "그저 남들과 똑같이 살면서 차이를 만들어낸 사람은 없다.",
  },
];

const dateElement = document.querySelector("#date");
const timeElement = document.querySelector("#time");
const remainingElement = document.querySelector("#remaining");
const quoteElement = document.querySelector("#quote");

const now = new Date();
const minute = String(now.getMinutes()).padStart(2, "0");
function updateClock() {
  const now = new Date();

  //요일 배열
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const day = days[now.getDay()];

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  dateElement.textContent = `${year}년 ${month}월 ${date}일 (${day}요일)`;
  timeElement.textContent = `${hours}:${minutes}:${seconds}`;

  // 올해 남은 시간 계산
  const endOfYear = new Date(year, 11, 31, 23, 59, 59);
  const dif = endOfYear - now;

  const rDays = Math.floor(dif / (1000 * 60 * 60 * 24));
  const rHours = Math.floor((dif / (1000 * 60 * 60)) % 24);
  const rMinutes = Math.floor((dif / (1000 * 60)) % 60);
  const rSeconds = Math.floor((dif / 1000) % 60);

  remainingElement.textContent = `올해 남은 시간: ${rDays}일 ${rHours}시간 ${rMinutes}분 ${rSeconds}초`;
}

updateClock();
setInterval(updateClock, 1000);

// 명언 3초마다 랜덤으로 출력
let currentQuoteIndex = -1;
function updateQuote() {
  let randomIndex = Math.floor(Math.random() * quotes.length);
  while (randomIndex === currentQuoteIndex) {
    randomIndex = Math.floor(Math.random() * quotes.length);
  }
  currentQuoteIndex = randomIndex;
  const randomQuote = quotes[randomIndex];
  quoteElement.innerHTML = `<div class="en">${randomQuote.en}</div><div class="ko">${randomQuote.ko}</div>`;

  // 랜덤으로 색깔 출력
  const randomColor =
    pastelColors[Math.floor(Math.random() * pastelColors.length)];
  document.body.style.backgroundColor = randomColor;
}
const pastelColors = [
  "#FFB3BA",
  "#FFDFBA",
  "#FFFFBA",
  "#BAFFC9",
  "#BAE1FF",
  "#E6E6FA",
  "#FFC0CB",
  "#D8BFD8",
  "#B0E0E6",
  "#F0E68C",
];
updateQuote();
setInterval(updateQuote, 3000);
