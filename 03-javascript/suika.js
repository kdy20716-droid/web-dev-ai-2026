const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

// 1. 엔진 및 렌더러 초기화
const engine = Engine.create();
const world = engine.world;

const gameArea = document.getElementById("game-area");
const width = 480;
const height = 700;

const render = Render.create({
  element: gameArea,
  engine: engine,
  options: {
    width: width,
    height: height,
    wireframes: false, // 와이어프레임 끄기 (색상 채우기)
    background: "transparent", // CSS에서 배경색 제어하도록 투명으로 변경
  },
});

Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

// 2. 벽 생성 (바닥, 왼쪽, 오른쪽)
const wallOptions = {
  isStatic: true,
  render: { fillStyle: "#8B4513" },
};
const ground = Bodies.rectangle(width / 2, height, width, 60, wallOptions);
const leftWall = Bodies.rectangle(0, height / 2, 20, height, wallOptions);
const rightWall = Bodies.rectangle(width, height / 2, 20, height, wallOptions);

World.add(world, [ground, leftWall, rightWall]);

// 3. 과일 데이터 정의
const FRUITS = [
  {
    name: "체리",
    radius: 15,
    color: "rgb(240, 89, 89)",
    score: 10,
    face: "smile",
  },
  { name: "딸기", radius: 25, color: "#F88", score: 20, face: "wink" },
  { name: "포도", radius: 35, color: "#A0F", score: 30, face: "surprised" },
  { name: "한라봉", radius: 45, color: "#FA0", score: 40, face: "sleepy" },
  { name: "오렌지", radius: 55, color: "#F80", score: 50, face: "neutral" },
  { name: "사과", radius: 65, color: "#F00", score: 60, face: "laugh" },
  { name: "배", radius: 75, color: "#FF8", score: 70, face: "worried" },
  { name: "복숭아", radius: 85, color: "#FBC", score: 80, face: "happy" },
  { name: "파인애플", radius: 95, color: "#FF0", score: 90, face: "confused" },
  { name: "멜론", radius: 105, color: "#8F8", score: 100, face: "excited" },
  {
    name: "수박",
    radius: 115,
    color: "#0F0",
    score: 110,
    face: "big_smile",
  },
];

let currentFruit = null;
let isClickable = true;
let score = 0;
const scoreElement = document.getElementById("score");
let dropCount = 0;
let nextFruitIndex = null; // 다음에 나올 과일 인덱스
const nextFruitElement = document.getElementById("next-fruit");
const highScoreElement = document.getElementById("high-score");
const recentScoresElement = document.getElementById("recent-scores");
const gameOverModal = document.getElementById("game-over-modal");
const finalScoreElement = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");
const bgmBtn = document.getElementById("bgm-btn");
const shakeBtn = document.getElementById("shake-btn");
const evolutionList = document.getElementById("evolution-list");
const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const themeBtn = document.getElementById("theme-btn");
const recentLabel = document.querySelector(".recent-scores-box .label");

// 📢 Firebase 설정 (Firebase 콘솔에서 프로젝트 생성 후 발급받은 실제 값으로 변경해야 랭킹이 공유됩니다!)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID",
};

let db;
try {
  if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("파이어베이스 연결 성공!");
  } else {
    console.warn(
      "파이어베이스 설정이 완료되지 않았습니다. 로컬 모드로 동작합니다.",
    );
  }
} catch (error) {
  console.error("Firebase 초기화 실패:", error);
}

// 콤보 시스템 변수
let comboCount = 0;
let comboTimer = null;

// 기록 불러오기 함수
async function loadRecords() {
  const highScore = localStorage.getItem("suika-high-score") || 0;
  highScoreElement.textContent = highScore;
  recentScoresElement.innerHTML =
    "<li style='text-align:center;'>불러오는 중...</li>";

  let recentScores = [];

  if (db) {
    // Firebase가 연결된 경우 서버에서 데이터 가져오기
    recentLabel.textContent = "명예의 전당 🏆";
    try {
      const querySnapshot = await db
        .collection("scores")
        .orderBy("score", "desc")
        .limit(10)
        .get();
      querySnapshot.forEach((doc) => {
        recentScores.push(doc.data());
      });
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    }
  }

  // 데이터가 없으면(오류 또는 초기 상태) 로컬 데이터 표시 (선택 사항)
  if (recentScores.length === 0) {
    if (!db) recentLabel.textContent = "최근 기록 (로컬)";
    recentScores = JSON.parse(
      localStorage.getItem("suika-recent-scores") || "[]",
    );
  }

  recentScoresElement.innerHTML = recentScores
    .map((entry, index) => {
      if (typeof entry === "object") {
        return `
          <li>
            <div><span class="rank">${index + 1}</span> ${entry.name}</div>
            <div>${entry.score}점</div>
            <div class="date-info">${entry.date || ""}</div>
          </li>`;
      }
      return `<li>익명: ${entry}</li>`; // 구버전 데이터 호환
    })
    .join("");
}
loadRecords();

// 진화 가이드 생성
FRUITS.forEach((fruit) => {
  const li = document.createElement("li");

  const icon = document.createElement("div");
  icon.className = "fruit-icon";
  icon.style.backgroundColor = fruit.color;

  const name = document.createElement("span");
  name.textContent = fruit.name;

  li.appendChild(icon);
  li.appendChild(name);
  evolutionList.appendChild(li);
});

// 과일 생성 함수
function createFruit(x, y, index, isStatic = false) {
  const fruitData = FRUITS[index];
  const fruit = Bodies.circle(x, y, fruitData.radius, {
    label: "fruit",
    isStatic: isStatic,
    restitution: 0.2, // 탄성
    render: { fillStyle: fruitData.color },
  });
  fruit.fruitIndex = index; // 과일 단계 저장
  return fruit;
}

// Next Fruit 결정 및 UI 업데이트 함수
function setNextFruit() {
  let maxIndex = 5;
  if (dropCount < 10) {
    maxIndex = 2;
  }
  nextFruitIndex = Math.floor(Math.random() * (maxIndex + 1));

  // UI 업데이트
  const nextFruitData = FRUITS[nextFruitIndex];
  nextFruitElement.style.backgroundColor = nextFruitData.color;
  nextFruitElement.style.backgroundImage = "none";
}

// 대기 중인 과일 생성 (상단)
function addCurrentFruit() {
  // 처음 실행 시 nextFruit이 없으면 생성
  if (nextFruitIndex === null) {
    setNextFruit();
  }

  const fruit = createFruit(width / 2, 30, nextFruitIndex, true); // 생성 위치를 조금 더 위로(30) 올림
  currentFruit = fruit;
  World.add(world, fruit);

  // 다음 과일 미리 준비
  setNextFruit();
}

// 4. 조작 이벤트 (마우스/터치)
gameArea.addEventListener("mousemove", (e) => {
  if (!isClickable || !currentFruit) return;

  const rect = gameArea.getBoundingClientRect();
  let x = e.clientX - rect.left;

  // 벽 밖으로 나가지 않게 제한
  const radius = currentFruit.circleRadius;
  if (x < 20 + radius) x = 20 + radius;
  if (x > width - 20 - radius) x = width - 20 - radius;

  Body.setPosition(currentFruit, { x: x, y: 30 }); // 이동 위치도 30으로 조정
});

gameArea.addEventListener(
  "touchmove",
  (e) => {
    if (!isClickable || !currentFruit) return;
    e.preventDefault(); // 스크롤 방지

    const rect = gameArea.getBoundingClientRect();
    let x = e.touches[0].clientX - rect.left;

    // 벽 밖으로 나가지 않게 제한
    const radius = currentFruit.circleRadius;
    if (x < 20 + radius) x = 20 + radius;
    if (x > width - 20 - radius) x = width - 20 - radius;

    Body.setPosition(currentFruit, { x: x, y: 30 });
  },
  { passive: false },
);

gameArea.addEventListener("click", () => {
  if (isClickable) dropFruit();
});

gameArea.addEventListener("touchend", (e) => {
  if (isClickable) dropFruit();
});

// 과일 떨어뜨리기
function dropFruit() {
  if (!currentFruit) return;
  isClickable = false;

  dropCount++;
  Body.setStatic(currentFruit, false); // 물리 효과 활성화 (떨어짐)
  playDropSound();
  currentFruit = null;

  // 1초 뒤에 다음 과일 생성
  setTimeout(() => {
    addCurrentFruit();
    isClickable = true;
  }, 1000);
}

// 5. 충돌 감지 및 합체 로직
Events.on(engine, "collisionStart", (event) => {
  const pairs = event.pairs;

  pairs.forEach((pair) => {
    const bodyA = pair.bodyA;
    const bodyB = pair.bodyB;

    // 두 물체가 모두 과일인 경우
    if (bodyA.label === "fruit" && bodyB.label === "fruit") {
      // 같은 단계의 과일이면
      if (bodyA.fruitIndex === bodyB.fruitIndex) {
        const index = bodyA.fruitIndex;

        // 수박(마지막 단계)이면 합쳐지지 않음
        if (index === FRUITS.length - 1) return;

        // 이미 제거된 물체인지 확인 (중복 실행 방지)
        if (!world.bodies.includes(bodyA) || !world.bodies.includes(bodyB))
          return;

        // 충돌 위치 중간값 계산
        const midX = (bodyA.position.x + bodyB.position.x) / 2;
        const midY = (bodyA.position.y + bodyB.position.y) / 2;

        // 기존 과일 제거
        World.remove(world, [bodyA, bodyB]);

        // 콤보 계산
        comboCount++;
        if (comboTimer) clearTimeout(comboTimer);
        comboTimer = setTimeout(() => {
          comboCount = 0;
        }, 1000); // 1초 내에 연속 합체 시 콤보 유지

        // 효과음 및 파티클 실행
        playPopSound();
        createParticles(midX, midY, FRUITS[index].color);

        // 다음 단계 과일 생성
        const newFruit = createFruit(midX, midY, index + 1);
        World.add(world, newFruit);

        // 수박(index 9 -> 10) 탄생 시 축하 효과
        if (index === FRUITS.length - 2) {
          celebrateWatermelon();
        }

        // 점수 증가
        let scoreToAdd = FRUITS[index].score * 2;
        if (comboCount > 1) {
          scoreToAdd += (comboCount - 1) * 10; // 콤보당 10점 추가 보너스
        }
        score += scoreToAdd;
        scoreElement.textContent = score;

        // 점수 애니메이션
        showFloatingScore(midX, midY, scoreToAdd, comboCount);
      }
    }
  });
});

// 6. 게임 오버 로직 (상단 라인 넘었을 때)
const limitLineY = 100; // 게임 오버 기준선을 더 위로 올림 (공간 확보)
let gameOverTimestamp = 0; // 게임 오버 타이머

Events.on(engine, "afterUpdate", () => {
  // 물리 시뮬레이션 업데이트 후 실행
  const fruits = world.bodies.filter((body) => {
    // 과일이면서, 고정된 대기 과일이 아니고, 기준선보다 위에 있는 경우
    return (
      body.label === "fruit" && !body.isStatic && body.position.y < limitLineY
    );
  });

  if (fruits.length > 0) {
    // 기준선 넘은 과일이 있으면 시간 측정 시작
    if (gameOverTimestamp === 0) {
      gameOverTimestamp = Date.now();
    } else {
      // 2초 동안 계속 넘어가 있으면 게임 오버
      if (Date.now() - gameOverTimestamp > 2000) {
        Runner.stop(runner); // 게임 중지
        isClickable = false; // 조작 차단

        playGameOverSound(); // 게임 오버 효과음 재생
        // 모달 띄우기
        finalScoreElement.textContent = score;
        gameOverModal.classList.remove("hidden");
      }
    }
  } else {
    // 기준선 넘은 과일이 없으면 타이머 초기화
    gameOverTimestamp = 0;
  }
});

// 기준선 그리기 (렌더링 루프에 추가)
Events.on(render, "afterRender", () => {
  const ctx = render.context;
  ctx.beginPath();
  ctx.moveTo(0, limitLineY);
  ctx.lineTo(width, limitLineY);
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]); // 점선
  ctx.stroke();
  ctx.setLineDash([]); // 점선 초기화

  // 과일 표정 그리기
  const bodies = world.bodies;
  bodies.forEach((body) => {
    if (body.label === "fruit") {
      const { x, y } = body.position;
      const radius = body.circleRadius;
      const fruitData = FRUITS[body.fruitIndex];
      const face = fruitData ? fruitData.face : "smile";
      const name = fruitData ? fruitData.name : "";

      ctx.translate(x, y);
      ctx.rotate(body.angle);

      // 0. 과일 특징 그리기 (줄기, 잎, 무늬 등)
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (name === "체리") {
        // 줄기
        ctx.beginPath();
        ctx.moveTo(0, -radius * 0.8);
        ctx.quadraticCurveTo(
          radius * 0.2,
          -radius * 1.5,
          radius * 0.8,
          -radius * 2,
        );
        ctx.strokeStyle = "#6d4c41";
        ctx.lineWidth = 3;
        ctx.stroke();
      } else if (name === "딸기") {
        // 씨앗
        ctx.fillStyle = "rgba(255, 235, 59, 0.6)";
        [
          [-0.4, 0.2],
          [0.4, 0.2],
          [0, 0.6],
          [-0.3, -0.2],
          [0.3, -0.2],
        ].forEach((pos) => {
          ctx.beginPath();
          ctx.arc(
            radius * pos[0],
            radius * pos[1],
            radius * 0.08,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        });
      } else if (name === "한라봉") {
        // 꼭지 (볼록한 부분)
        ctx.beginPath();
        ctx.arc(0, -radius * 0.9, radius * 0.35, Math.PI, 0);
        ctx.fillStyle = fruitData.color;
        ctx.fill();
        // 잎
        ctx.beginPath();
        ctx.ellipse(
          radius * 0.2,
          -radius * 1.1,
          radius * 0.2,
          radius * 0.1,
          -Math.PI / 4,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = "#4CAF50";
        ctx.fill();
      } else if (name === "사과" || name === "오렌지" || name === "복숭아") {
        // 잎
        ctx.beginPath();
        ctx.ellipse(
          0,
          -radius * 0.95,
          radius * 0.2,
          radius * 0.1,
          -Math.PI / 4,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = "#4CAF50";
        ctx.fill();
        // 줄기 (사과만)
        if (name === "사과") {
          ctx.beginPath();
          ctx.moveTo(0, -radius * 0.8);
          ctx.lineTo(0, -radius * 1.1);
          ctx.strokeStyle = "#6d4c41";
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      } else if (name === "배") {
        // 줄기
        ctx.beginPath();
        ctx.moveTo(0, -radius * 0.9);
        ctx.lineTo(radius * 0.1, -radius * 1.2);
        ctx.strokeStyle = "#6d4c41";
        ctx.lineWidth = 3;
        ctx.stroke();
      } else if (name === "파인애플") {
        // 뾰족한 잎
        ctx.fillStyle = "#4CAF50";
        ctx.beginPath();
        ctx.moveTo(0, -radius * 0.9);
        ctx.lineTo(-radius * 0.3, -radius * 1.4);
        ctx.lineTo(radius * 0.3, -radius * 1.4);
        ctx.fill();
      } else if (name === "멜론") {
        // 그물 무늬
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-radius * 0.5, -radius * 0.5);
        ctx.lineTo(radius * 0.5, -radius * 0.5);
        ctx.moveTo(-radius * 0.5, radius * 0.5);
        ctx.lineTo(radius * 0.5, radius * 0.5);
        ctx.moveTo(0, -radius * 0.8);
        ctx.lineTo(0, radius * 0.8);
        ctx.stroke();
        // T자 줄기
        ctx.strokeStyle = "#6d4c41";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, -radius);
        ctx.lineTo(0, -radius * 1.2);
        ctx.moveTo(-radius * 0.15, -radius * 1.2);
        ctx.lineTo(radius * 0.15, -radius * 1.2);
        ctx.stroke();
      } else if (name === "수박") {
        // 줄무늬
        ctx.strokeStyle = "#1b5e20"; // 진한 초록
        ctx.lineWidth = radius * 0.1;
        ctx.beginPath();
        for (let i = -0.6; i <= 0.6; i += 0.4) {
          ctx.moveTo(radius * i, -radius * 0.8);
          ctx.bezierCurveTo(
            radius * (i - 0.3),
            -radius * 0.2,
            radius * (i + 0.3),
            radius * 0.2,
            radius * i,
            radius * 0.8,
          );
        }
        ctx.stroke();
      }

      // 1. 볼터치 (귀여움 포인트)
      ctx.fillStyle = "rgba(255, 100, 100, 0.4)"; // 연한 분홍색
      const blushX = radius * 0.45;
      const blushY = radius * 0.1;
      const blushSize = radius * 0.18; // 볼터치 크기 증가

      ctx.beginPath();
      ctx.arc(-blushX, blushY, blushSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(blushX, blushY, blushSize, 0, Math.PI * 2);
      ctx.fill();

      // 2. 눈과 입 스타일 설정
      ctx.fillStyle = "#444"; // 진한 회색 (더 선명하게)
      ctx.strokeStyle = "#444";
      ctx.lineWidth = Math.max(2, radius * 0.08); // 크기에 비례한 두께
      ctx.lineCap = "round";

      const eyeX = radius * 0.3;
      const eyeY = -radius * 0.15;
      const eyeSize = radius * 0.13;

      // 눈 그리기 헬퍼 (반짝이는 하이라이트 포함)
      const drawCuteEye = (ex, ey, es) => {
        ctx.beginPath();
        ctx.arc(ex, ey, es, 0, Math.PI * 2);
        ctx.fillStyle = "#444";
        ctx.fill();
        // 하이라이트 (흰색 점)
        ctx.beginPath();
        ctx.arc(ex - es * 0.3, ey - es * 0.3, es * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
      };

      if (face === "smile") {
        // 기본 스마일
        drawCuteEye(-eyeX, eyeY, eyeSize);
        drawCuteEye(eyeX, eyeY, eyeSize);
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.3, 0.2 * Math.PI, 0.8 * Math.PI);
        ctx.stroke();
      } else if (face === "wink") {
        // 윙크
        drawCuteEye(-eyeX, eyeY, eyeSize);
        // 윙크하는 눈 (> 모양)
        ctx.beginPath();
        ctx.moveTo(eyeX - eyeSize, eyeY);
        ctx.quadraticCurveTo(eyeX, eyeY - eyeSize, eyeX + eyeSize, eyeY);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.3, 0.2 * Math.PI, 0.8 * Math.PI);
        ctx.stroke();
      } else if (face === "surprised") {
        // 놀람 (O 입)
        // 눈 (작은 점)
        ctx.beginPath();
        ctx.arc(-eyeX, eyeY, eyeSize * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = "#444";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, eyeSize * 0.8, 0, Math.PI * 2);
        ctx.fill();
        // 입 (동그란 O)
        ctx.beginPath();
        ctx.ellipse(
          0,
          radius * 0.2,
          radius * 0.1,
          radius * 0.15,
          0,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
      } else if (face === "sleepy") {
        // 졸림 (- - 눈)
        ctx.beginPath();
        ctx.moveTo(-eyeX - eyeSize, eyeY);
        ctx.lineTo(-eyeX + eyeSize, eyeY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(eyeX - eyeSize, eyeY);
        ctx.lineTo(eyeX + eyeSize, eyeY);
        ctx.stroke();
        // 입 (작은 o)
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.2, 0.2 * Math.PI, 0.8 * Math.PI);
        ctx.stroke();
      } else if (face === "neutral") {
        // 무표정 (- 입)
        drawCuteEye(-eyeX, eyeY, eyeSize);
        drawCuteEye(eyeX, eyeY, eyeSize);
        ctx.beginPath();
        ctx.moveTo(-radius * 0.2, radius * 0.2);
        ctx.lineTo(radius * 0.2, radius * 0.2);
        ctx.stroke();
      } else if (face === "laugh") {
        // 웃음 (> < 눈)
        ctx.beginPath();
        ctx.moveTo(-eyeX - eyeSize, eyeY - eyeSize / 2);
        ctx.lineTo(-eyeX, eyeY + eyeSize / 2);
        ctx.lineTo(-eyeX + eyeSize, eyeY - eyeSize / 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(eyeX - eyeSize, eyeY - eyeSize / 2);
        ctx.lineTo(eyeX, eyeY + eyeSize / 2);
        ctx.lineTo(eyeX + eyeSize, eyeY - eyeSize / 2);
        ctx.stroke();
        // 입 (반달 채움)
        ctx.beginPath();
        ctx.arc(0, radius * 0.1, radius * 0.25, 0, Math.PI, false);
        ctx.fillStyle = "#444";
        ctx.fill();
      } else if (face === "worried") {
        // 걱정 (ㅅ 입)
        drawCuteEye(-eyeX, eyeY, eyeSize);
        drawCuteEye(eyeX, eyeY, eyeSize);
        // 눈썹
        ctx.beginPath();
        ctx.moveTo(-eyeX - eyeSize, eyeY - eyeSize * 1.5);
        ctx.lineTo(-eyeX + eyeSize / 2, eyeY - eyeSize * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(eyeX + eyeSize, eyeY - eyeSize * 1.5);
        ctx.lineTo(eyeX - eyeSize / 2, eyeY - eyeSize * 2);
        ctx.stroke();
        // 입 (물결)
        ctx.beginPath();
        ctx.arc(0, radius * 0.4, radius * 0.2, 1.2 * Math.PI, 1.8 * Math.PI);
        ctx.stroke();
      } else if (face === "happy") {
        // 행복 (^ ^ 눈)
        ctx.beginPath();
        ctx.arc(-eyeX, eyeY + eyeSize / 2, eyeSize, Math.PI, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(eyeX, eyeY + eyeSize / 2, eyeSize, Math.PI, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.3, 0.2 * Math.PI, 0.8 * Math.PI);
        ctx.stroke();
      } else if (face === "confused") {
        // 혼란 (짝짝이 눈)
        drawCuteEye(-eyeX, eyeY, eyeSize * 0.8);
        drawCuteEye(eyeX, eyeY, eyeSize * 1.2);
        // 입 (지그재그)
        ctx.beginPath();
        ctx.moveTo(-radius * 0.1, radius * 0.2);
        ctx.lineTo(radius * 0.2, radius * 0.1);
        ctx.stroke();
      } else if (face === "excited") {
        // 신남 (X X 눈)
        ctx.beginPath();
        ctx.moveTo(-eyeX - eyeSize, eyeY - eyeSize);
        ctx.lineTo(-eyeX + eyeSize, eyeY + eyeSize);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-eyeX + eyeSize, eyeY - eyeSize);
        ctx.lineTo(-eyeX - eyeSize, eyeY + eyeSize);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(eyeX - eyeSize, eyeY - eyeSize);
        ctx.lineTo(eyeX + eyeSize, eyeY + eyeSize);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(eyeX + eyeSize, eyeY - eyeSize);
        ctx.lineTo(eyeX - eyeSize, eyeY + eyeSize);
        ctx.stroke();

        // 입 (D 모양)
        ctx.beginPath();
        ctx.arc(0, radius * 0.1, radius * 0.25, 0, Math.PI);
        ctx.closePath();
        ctx.fillStyle = "#444";
        ctx.fill();
      } else if (face === "big_smile") {
        // 왕 스마일
        drawCuteEye(-eyeX, eyeY, eyeSize * 1.2);
        drawCuteEye(eyeX, eyeY, eyeSize * 1.2);
        // 입 (큰 D)
        ctx.beginPath();
        ctx.arc(0, radius * 0.1, radius * 0.3, 0, Math.PI);
        ctx.closePath();
        ctx.fillStyle = "#444";
        ctx.fill();
        // 혀
        ctx.beginPath();
        ctx.arc(0, radius * 0.3, radius * 0.15, Math.PI, 0);
        ctx.fillStyle = "#ff6b6b";
        ctx.fill();
      }

      ctx.rotate(-body.angle);
      ctx.translate(-x, -y);
    }
  });
});

// 7. 효과음 및 파티클 시스템
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playPopSound() {
  // 브라우저 정책상 사용자 인터랙션 후 오디오 컨텍스트 활성화 필요
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(
    600,
    audioCtx.currentTime + 0.1,
  );

  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.1);
}

function playDropSound() {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(
    300,
    audioCtx.currentTime + 0.1,
  );

  gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.1);
}

function playGameOverSound() {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = "sawtooth"; // 거친 소리
  oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(
    50,
    audioCtx.currentTime + 1.5,
  ); // 음이 뚝 떨어짐

  gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 1.5);
}

function playClapSound() {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  // 노이즈 버퍼 생성 (박수 소리 시뮬레이션)
  const bufferSize = audioCtx.sampleRate * 2; // 2초 길이
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  // 여러 번의 박수 소리를 랜덤한 타이밍에 재생
  for (let i = 0; i < 15; i++) {
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const gainNode = audioCtx.createGain();
    // 1.5초 내에서 랜덤하게 시작
    const startTime = audioCtx.currentTime + Math.random() * 1.5;

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01); // 소리 커짐
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1); // 빠르게 사라짐

    noise.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    noise.start(startTime);
    noise.stop(startTime + 0.15);
  }
}

function celebrateWatermelon() {
  playClapSound();

  // 폭죽 연발 (0.2초 간격으로 10번)
  let count = 0;
  const interval = setInterval(() => {
    const x = Math.random() * width;
    const y = (Math.random() * height) / 2; // 화면 상단 절반 영역
    const color = FRUITS[Math.floor(Math.random() * FRUITS.length)].color;
    createParticles(x, y, color);
    count++;
    if (count >= 10) clearInterval(interval);
  }, 200);
}

function createParticles(x, y, color) {
  for (let i = 0; i < 8; i++) {
    const particle = Bodies.circle(x, y, 4, {
      render: { fillStyle: color },
      isSensor: true, // 물리적 충돌 무시 (시각 효과만)
      frictionAir: 0.05,
    });

    const angle = (Math.PI * 2 * i) / 8;
    const force = 0.002;
    Body.applyForce(particle, particle.position, {
      x: Math.cos(angle) * force,
      y: Math.sin(angle) * force,
    });

    World.add(world, particle);

    // 0.6초 후 제거
    setTimeout(() => {
      World.remove(world, particle);
    }, 600);
  }
}

// 8. 재시작 버튼 이벤트
restartBtn.addEventListener("click", async () => {
  // 점수 저장 로직 이동
  const currentScore = score;
  const playerName = document.getElementById("player-name").value || "익명";

  const highScore = Number(localStorage.getItem("suika-high-score") || 0);
  if (currentScore > highScore) {
    localStorage.setItem("suika-high-score", currentScore);
  }

  // 날짜 정보 생성
  const now = new Date();
  const dateStr = `${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

  // Firebase에 저장
  if (db) {
    try {
      await db.collection("scores").add({
        name: playerName,
        score: currentScore,
        date: dateStr,
      });
    } catch (error) {
      console.error("점수 저장 실패:", error);
      alert("점수 저장에 실패했습니다.");
    }
  }

  // 로컬 스토리지에도 백업 (선택 사항)
  const recentScores = JSON.parse(
    localStorage.getItem("suika-recent-scores") || "[]",
  );
  recentScores.push({ name: playerName, score: currentScore, date: dateStr });
  recentScores.sort((a, b) => b.score - a.score);
  if (recentScores.length > 10) recentScores.length = 10;
  localStorage.setItem("suika-recent-scores", JSON.stringify(recentScores));

  location.reload();
});

// 9. BGM 기능
let bgmTimer = null;
let bgmIndex = 0;
const bgmNotes = [
  261.63,
  329.63,
  392.0,
  329.63, // C E G E
  261.63,
  329.63,
  392.0,
  329.63,
  349.23,
  440.0,
  523.25,
  440.0, // F A C A
  349.23,
  440.0,
  523.25,
  440.0,
];

function playBGM() {
  if (audioCtx.state === "suspended") audioCtx.resume();

  bgmTimer = setInterval(() => {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = bgmNotes[bgmIndex % bgmNotes.length];
    gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime); // 아주 작게
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioCtx.currentTime + 0.4,
    );
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.4);
    bgmIndex++;
  }, 400);
}

bgmBtn.addEventListener("click", () => {
  if (bgmTimer) {
    clearInterval(bgmTimer);
    bgmTimer = null;
    bgmBtn.textContent = "🎵 BGM OFF";
  } else {
    playBGM();
    bgmBtn.textContent = "🎵 BGM ON";
  }
});

// 10. 흔들기 기능
let shakeCount = 3;
shakeBtn.addEventListener("click", () => {
  if (shakeCount > 0) {
    shakeCount--;
    shakeBtn.textContent = `🫨 흔들기 (${shakeCount})`;

    world.bodies.forEach((body) => {
      if (body.label === "fruit" && !body.isStatic) {
        const forceMagnitude = 0.05 * body.mass;
        Body.applyForce(body, body.position, {
          x: (Math.random() - 0.5) * forceMagnitude,
          y: -forceMagnitude, // 위로 튕기기
        });
      }
    });

    // 화면 흔들기 효과
    const gameContainer = document.querySelector(".game-container");
    gameContainer.classList.add("shaking");
    setTimeout(() => {
      gameContainer.classList.remove("shaking");
    }, 500);

    if (shakeCount === 0) {
      shakeBtn.disabled = true;
    }
  }
});

// 11. 점수 애니메이션 함수
function showFloatingScore(x, y, score, combo = 0) {
  const el = document.createElement("div");
  el.className = "floating-score";

  if (combo > 1) {
    el.innerHTML = `+${score}<br><span style="font-size: 0.6em; color: #ff4757;">COMBO x${combo}</span>`;
  } else {
    el.textContent = `+${score}`;
  }

  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.textAlign = "center";
  gameArea.appendChild(el);

  setTimeout(() => {
    el.remove();
  }, 1000);
}

// 12. 게임 시작 버튼 이벤트
startBtn.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  addCurrentFruit();
  // 오디오 컨텍스트 활성화 (브라우저 정책 대응)
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
});

// 13. 테마 변경 기능
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("night-mode");
  if (document.body.classList.contains("night-mode")) {
    themeBtn.textContent = "🌞 Day";
  } else {
    themeBtn.textContent = "🌙 Night";
  }
});
