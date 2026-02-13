const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 캔버스 크기 설정
canvas.width = 1024;
canvas.height = 900;

// 먼지 입자 초기화
const particles = [];
for (let i = 0; i < 50; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.2,
    vy: (Math.random() - 0.5) * 0.2,
    size: Math.random() * 2 + 0.5,
    alpha: Math.random(),
    changeAlpha: (Math.random() - 0.5) * 0.01,
  });
}

// 게임 상태 및 플레이어 설정
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const tableY = centerY + 30;

const players = [
  {
    name: "East",
    displayName: "플레이어 2",
    x: centerX + 430,
    y: tableY,
    angle: -Math.PI / 2,
    hand: [],
    spacing: 15,
    isDead: false,
  },
  {
    name: "North",
    displayName: "플레이어 3",
    x: centerX,
    y: tableY - 280,
    angle: Math.PI,
    hand: [],
    spacing: 15,
    isDead: false,
  },
  {
    name: "West",
    displayName: "플레이어 4",
    x: centerX - 430,
    y: tableY,
    angle: Math.PI / 2,
    hand: [],
    spacing: 15,
    isDead: false,
  },
  {
    name: "South",
    displayName: "플레이어 1",
    x: centerX,
    y: tableY + 280,
    angle: 0,
    hand: [],
    spacing: 15,
    isDead: false,
  },
];

// 카드 덱 생성 및 셔플
const cardTypes = [
  ...Array(6).fill("K"), // King
  ...Array(6).fill("Q"), // Queen
  ...Array(6).fill("S"), // Spade
  ...Array(2).fill("J"), // Joker
];

// Fisher-Yates Shuffle
for (let i = cardTypes.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [cardTypes[i], cardTypes[j]] = [cardTypes[j], cardTypes[i]];
}

// 카드 이미지 로드 (HTML에 있는 img 태그 가져오기)
const cardImages = {};
const imgIds = {
  K: "img-K",
  Q: "img-Q",
  J: "img-J",
  S: "img-S",
  BACK: "img-back",
};

for (const [key, id] of Object.entries(imgIds)) {
  const img = document.getElementById(id);
  if (img) {
    cardImages[key] = img;
    // 로드 상태 확인용 로그
    img.onload = () => console.log(`이미지 로드 성공: ${id}`);
    img.onerror = () =>
      console.error(`이미지 로드 실패: ${id} (경로 확인 필요)`);
  }
}

// 배분 애니메이션 상태
let dealingState = {
  isDealing: true,
  totalCards: 20, // 5장 * 4명
  dealtCount: 0,
  movingCard: null, // 현재 이동 중인 카드 {x, y, targetPlayerIndex, progress}
  speed: 0.15, // 카드 이동 속도
};

// 애니메이션 관리 (카드 제출 등)
const animations = [];

// 오디오 및 말풍선 관리 함수
function playSound(type) {
  const audio = document.getElementById(`sfx-${type}`);
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch((e) => console.log("Audio play failed:", e));
  }
}

function showBubble(playerIndex, text) {
  const bubble = document.getElementById(`bubble-${playerIndex}`);
  if (bubble) {
    bubble.textContent = text;
    bubble.classList.add("show");
    setTimeout(() => {
      bubble.classList.remove("show");
    }, 2000);
  }
}

// BGM 관리 함수
function playBGM(type) {
  const mainBgm = document.getElementById("bgm-main");
  const rouletteBgm = document.getElementById("bgm-roulette");

  if (type === "main") {
    if (rouletteBgm) {
      rouletteBgm.pause();
      rouletteBgm.currentTime = 0;
    }
    if (mainBgm && mainBgm.paused) {
      mainBgm.volume = 0.3;
      mainBgm.play().catch(() => {});
    }
  } else if (type === "roulette") {
    if (mainBgm) mainBgm.pause();
    if (rouletteBgm) {
      rouletteBgm.volume = 0.4;
      rouletteBgm.play().catch(() => {});
    }
  }
}

// 러시안 룰렛 상태
const revolver = {
  chambers: 6,
  currentChamber: 0,
  bulletPosition: Math.floor(Math.random() * 6),
};

// 게임 규칙 상태
const gameState = {
  phase: "START", // DEALING, PLAYING, RESOLVING, ROULETTE, GAME_OVER, START
  turnIndex: 3, // 3: South(Player)부터 시작 -> 2: West -> 1: North -> 0: East (반시계/시계 방향에 따라 조정)
  currentRank: "K", // 현재 테이블에 내야 하는 카드 (K, Q, J, S)
  tableCards: [], // 테이블 중앙에 쌓인 카드들
  lastPlayedBatch: null, // 마지막으로 제출된 카드 정보 { playerIndex, cards: [] }
  shakeTimer: 0, // 화면 흔들림 타이머
  lighting: "NORMAL", // NORMAL, DIM, RED_FLASH, FLICKER
  lightingTimer: 0, // 조명 효과 타이머
  turnCount: 0, // 턴 진행 횟수 (도전 확률 증가용)
};

function draw() {
  // 카드 배분 로직 업데이트
  if (dealingState.isDealing && gameState.phase !== "START") {
    updateDealing();
  }

  // 배경 (바닥)
  // 1. 전체를 검은색으로 채움 (뒷배경)
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save(); // 흔들림 효과 시작
  if (gameState.shakeTimer > 0) {
    const intensity = gameState.shakeTimer;
    const dx = (Math.random() - 0.5) * intensity;
    const dy = (Math.random() - 0.5) * intensity;
    ctx.translate(dx, dy);
    gameState.shakeTimer--;
  }

  // 조명 효과 계산
  let floorColor = "#1a1a1a";
  let lightColor = "rgba(93, 64, 55, 0.4)";

  if (gameState.lighting === "DIM") {
    // 긴장감 조성 (어둡게)
    lightColor = "rgba(93, 64, 55, 0.1)";
  } else if (gameState.lighting === "RED_FLASH") {
    // 사망 시 붉은 섬광
    if (gameState.lightingTimer > 0) {
      gameState.lightingTimer--;
      const intensity = gameState.lightingTimer / 60;
      floorColor = `rgb(${Math.floor(80 * intensity)}, 0, 0)`;
      lightColor = `rgba(255, 0, 0, ${0.6 * intensity})`;
    } else {
      gameState.lighting = "NORMAL";
    }
  } else if (gameState.lighting === "FLICKER") {
    // 생존 시 깜빡임
    if (gameState.lightingTimer > 0) {
      gameState.lightingTimer--;
      if (Math.random() > 0.5) lightColor = "rgba(93, 64, 55, 0.05)";
    } else {
      gameState.lighting = "NORMAL";
    }
  }

  // 2. 테이블 주변만 보이도록 구멍 뚫린 효과 (스포트라이트)
  const bgGradient = ctx.createRadialGradient(
    centerX,
    tableY,
    200,
    centerX,
    tableY,
    700,
  );
  bgGradient.addColorStop(0, floorColor); // 중심부: 동적 바닥색
  bgGradient.addColorStop(1, "rgba(0, 0, 0, 0)"); // 외곽: 투명 (검은색 배경)

  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 내 차례(South)일 때 남쪽에서 희미한 빛 추가
  if (gameState.turnIndex === 3 && gameState.phase === "PLAYING") {
    const turnLight = ctx.createRadialGradient(
      centerX,
      canvas.height + 100,
      100,
      centerX,
      canvas.height,
      800,
    );
    turnLight.addColorStop(0, "rgba(255, 250, 200, 0.19)"); // 따뜻하고 희미한 빛
    turnLight.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = turnLight;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // 1. 테이블 다리 (중앙 기둥)
  ctx.save();
  ctx.fillStyle = "#1a0f0a"; // 아주 어두운 나무색
  ctx.strokeStyle = "#3e2723";
  ctx.lineWidth = 4;

  ctx.beginPath();
  // 테이블 중심에서 시작해서 아래로 뻗어나감
  const pillarBottomY = tableY + 260;
  ctx.moveTo(centerX - 50, tableY);
  ctx.lineTo(centerX - 80, pillarBottomY);
  // 바닥 부분 둥글게 처리
  ctx.quadraticCurveTo(
    centerX,
    pillarBottomY + 40,
    centerX + 80,
    pillarBottomY,
  );
  ctx.lineTo(centerX + 50, tableY);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // 2. 테이블 아래 빛
  ctx.save();
  const lightY = tableY + 100; // 빛도 테이블을 따라 아래로 이동

  const lightGradient = ctx.createRadialGradient(
    centerX,
    lightY,
    50,
    centerX,
    lightY,
    450,
  );
  lightGradient.addColorStop(0, lightColor); // 중심부 동적 빛
  lightGradient.addColorStop(1, "rgba(93, 64, 55, 0)"); // 외곽 투명

  ctx.fillStyle = lightGradient;
  ctx.beginPath();
  ctx.ellipse(centerX, lightY, 420, 240, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 3. 테이블 상판 그리기
  const gradient = ctx.createRadialGradient(
    centerX,
    tableY,
    50,
    centerX,
    tableY,
    400,
  );
  gradient.addColorStop(0, "#8d6e63"); // 중앙: 밝은 나무색 (스팟라이트)
  gradient.addColorStop(0.8, "#4e342e"); // 중간: 진한 나무색
  gradient.addColorStop(1, "#281a14"); // 가장자리: 어두운 색

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(centerX, tableY, 400, 220, 0, 0, Math.PI * 2);
  ctx.fill();

  // 4. 테이블 테두리
  ctx.strokeStyle = "#3e2723";
  ctx.lineWidth = 15;
  ctx.stroke();
  ctx.lineWidth = 1;

  // 5. 카드 덱 그리기
  // 딜링 중이거나 이동 중인 카드가 있을 때만 그림 (끝나면 사라짐)
  if (dealingState.isDealing || dealingState.movingCard) {
    drawCardDeck(centerX, tableY - 40);
  }

  // 6. 플레이어 손패 그리기
  players.forEach((player) => {
    const selectedCount = player.hand.filter((c) => c.isSelected).length;
    const isMaxSelected = selectedCount >= 3;

    // 남쪽 플레이어(내 카드)이고 딜링이 끝났으면 카드 간격 넓히기
    if (player.name === "South" && !dealingState.isDealing) {
      // 목표 간격 90, 부드럽게 이동
      player.spacing += (90 - player.spacing) * 0.1;
    }

    // 사망 시 X 표시
    if (player.isDead) {
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.strokeStyle = "#c62828";
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(-40, -40);
      ctx.lineTo(40, 40);
      ctx.moveTo(40, -40);
      ctx.lineTo(-40, 40);
      ctx.stroke();
      ctx.restore();
    }

    player.hand.forEach((card, index) => {
      // 카드를 겹쳐서 배치
      const offsetX = (index - (player.hand.length - 1) / 2) * player.spacing;

      // 선택된 카드 위로 띄우기 (플레이어만)
      const offsetY = card.isSelected ? -30 : 0;

      // 뒤집기 애니메이션 처리
      let scaleX = 1;
      let isBack = !card.faceUp;

      if (card.isFlipping) {
        card.flipProgress += 0.05;
        if (card.flipProgress >= 1) {
          card.flipProgress = 1;
          card.isFlipping = false;
          card.faceUp = true;
        }
        // 0~0.5: 뒷면 줄어듦, 0.5~1: 앞면 늘어남
        if (card.flipProgress < 0.5) {
          scaleX = 1 - card.flipProgress * 2;
          isBack = true;
        } else {
          scaleX = (card.flipProgress - 0.5) * 2;
          isBack = false;
        }
      }

      // 3장 선택 시 나머지 카드 비활성화 효과 (투명도 조절)
      if (player.name === "South" && isMaxSelected && !card.isSelected) {
        ctx.globalAlpha = 0.5;
      } else {
        ctx.globalAlpha = 1.0;
      }

      if (isBack) {
        drawBackCard(
          player.x,
          player.y,
          player.angle,
          offsetX,
          offsetY,
          scaleX,
          card.isSelected,
        );
      } else {
        drawFrontCard(
          player.x,
          player.y,
          player.angle,
          card.type,
          offsetX,
          offsetY,
          scaleX,
          card.isSelected,
        );
      }
      // 투명도 초기화
      ctx.globalAlpha = 1.0;
    });
  });

  // 7. 이동 중인 카드 그리기
  if (dealingState.movingCard) {
    const mc = dealingState.movingCard;
    drawBackCard(mc.x, mc.y, mc.angle, 0, 0);
  }

  // 8. 테이블 중앙에 쌓인 카드 그리기
  gameState.tableCards.forEach((card, i) => {
    if (card.faceUp) {
      drawFrontCard(card.x, card.y, card.angle, card.type, 0, 0, 1);
    } else {
      drawBackCard(card.x, card.y, card.angle, 0, 0, 1);
    }
  });

  ctx.restore(); // 흔들림 효과 끝

  // 6. 먼지 입자 애니메이션
  updateAndDrawParticles();

  requestAnimationFrame(draw);
}

function updateDealing() {
  // 이동 중인 카드가 없다면 새 카드를 발사
  if (!dealingState.movingCard) {
    if (dealingState.dealtCount < dealingState.totalCards) {
      const playerIndex = dealingState.dealtCount % 4; // 동 -> 북 -> 서 -> 남 순서
      const targetPlayer = players[playerIndex];

      dealingState.movingCard = {
        startX: centerX,
        startY: tableY - 40,
        x: centerX,
        y: tableY - 40,
        targetX: targetPlayer.x,
        targetY: targetPlayer.y,
        startAngle: 0.1, // 덱에 있을 때의 각도
        targetAngle: targetPlayer.angle,
        angle: 0.1,
        progress: 0,
        playerIndex: playerIndex,
      };
    } else {
      dealingState.isDealing = false;
      gameState.phase = "PLAYING";

      document.getElementById("game-hud").classList.remove("hidden");
      showMessage(`Target: ${gameState.currentRank}`, 120);
      updateTargetDisplay();
      setTimeout(() => {
        updateGameStatus();
      }, 2500); // 카드 배분 및 뒤집기 애니메이션 후 메시지 표시
      playBGM("main");

      // 라운드 시작 시 버튼 상태 초기화
      const btnLiar = document.getElementById("btn-liar");
      const btnPlay = document.getElementById("btn-play");
      if (btnLiar) btnLiar.classList.add("hidden");
      if (btnPlay) {
        btnPlay.textContent = "완료";
        btnPlay.disabled = true;
      }

      // 딜링이 끝난 후 AI 턴이면 행동 시작
      if (gameState.turnIndex !== 3) {
        processAiTurn();
      }
    }
  }

  // 이동 중인 카드가 있다면 업데이트
  if (dealingState.movingCard) {
    const mc = dealingState.movingCard;
    mc.progress += dealingState.speed;

    if (mc.progress >= 1) {
      // 도착 완료
      const cardType = cardTypes[dealingState.dealtCount];
      players[mc.playerIndex].hand.push({
        type: cardType,
        faceUp: false,
        isFlipping: false,
        flipProgress: 0,
        isSelected: false, // 선택 상태 추가
      }); // 핸드에 카드 추가
      dealingState.dealtCount++;
      dealingState.movingCard = null;

      // 모든 카드가 배분되면 남쪽 플레이어(인덱스 3) 카드 뒤집기
      if (dealingState.dealtCount >= dealingState.totalCards) {
        setTimeout(() => {
          players[3].hand.forEach((card, i) => {
            setTimeout(() => {
              card.isFlipping = true;
            }, i * 200); // 순차적으로 뒤집기
          });
        }, 500);
      }
    } else {
      // 이동 중 (선형 보간)
      mc.x = mc.startX + (mc.targetX - mc.startX) * mc.progress;
      mc.y = mc.startY + (mc.targetY - mc.startY) * mc.progress;
      mc.angle = mc.startAngle + (mc.targetAngle - mc.startAngle) * mc.progress;
    }
  }
}

function updateAndDrawParticles() {
  ctx.fillStyle = "#f0e6d2"; // 빛의 색감에 맞춘 아주 연한 웜톤
  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.alpha += p.changeAlpha;

    // 투명도 범위 제한 및 반전 (더 투명하게 조정: 최대 0.5 -> 0.3)
    if (p.alpha <= 0 || p.alpha >= 0.3) {
      p.changeAlpha *= -1;
    }
    // 범위 보정
    if (p.alpha < 0) p.alpha = 0;
    if (p.alpha > 0.3) p.alpha = 0.3;

    // 화면 밖으로 나가면 반대편으로 이동
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1.0; // 투명도 초기화
}

// 단일 카드 뒷면 그리기 (이동 및 손패용)
function drawBackCard(
  x,
  y,
  rotation,
  offsetX = 0,
  offsetY = 0,
  scaleX = 1,
  isSelected = false,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.translate(offsetX, offsetY);
  ctx.scale(scaleX, 1); // 가로 스케일 적용 (뒤집기 효과용)

  // 그림자
  if (isSelected) {
    ctx.shadowColor = "rgba(255, 223, 0, 1)"; // 노란색 빛
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  } else {
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
  }

  const w = 80;
  const h = 120;
  const r = 5;
  const cx = -w / 2;
  const cy = -h / 2;

  // 카드 외형 경로 생성
  ctx.beginPath();
  ctx.moveTo(cx + r, cy);
  ctx.lineTo(cx + w - r, cy);
  ctx.quadraticCurveTo(cx + w, cy, cx + w, cy + r);
  ctx.lineTo(cx + w, cy + h - r);
  ctx.quadraticCurveTo(cx + w, cy + h, cx + w - r, cy + h);
  ctx.lineTo(cx + r, cy + h);
  ctx.quadraticCurveTo(cx, cy + h, cx, cy + h - r);
  ctx.lineTo(cx, cy + r);
  ctx.quadraticCurveTo(cx, cy, cx + r, cy);
  ctx.closePath();

  // 뒷면 이미지 그리기
  ctx.save();
  ctx.clip();
  if (
    cardImages.BACK &&
    cardImages.BACK.complete &&
    cardImages.BACK.naturalWidth > 0
  ) {
    ctx.drawImage(cardImages.BACK, cx, cy, w, h);
  } else {
    ctx.fillStyle = "#b71c1c"; // 이미지 로드 전 대체 색상
    ctx.fillRect(cx, cy, w, h);
  }
  ctx.restore();

  ctx.strokeStyle = "#dcdcdc";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();
}

// 단일 카드 앞면 그리기
function drawFrontCard(
  x,
  y,
  rotation,
  type,
  offsetX = 0,
  offsetY = 0,
  scaleX = 1,
  isSelected = false,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.translate(offsetX, offsetY);
  ctx.scale(scaleX, 1);

  // 그림자
  if (isSelected) {
    ctx.shadowColor = "rgba(255, 223, 0, 1)"; // 노란색 빛
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  } else {
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
  }

  const w = 80;
  const h = 120;
  const r = 5;
  const cx = -w / 2;
  const cy = -h / 2;

  // 카드 베이스 경로 함수
  const drawCardPath = () => {
    ctx.beginPath();
    ctx.moveTo(cx + r, cy);
    ctx.lineTo(cx + w - r, cy);
    ctx.quadraticCurveTo(cx + w, cy, cx + w, cy + r);
    ctx.lineTo(cx + w, cy + h - r);
    ctx.quadraticCurveTo(cx + w, cy + h, cx + w - r, cy + h);
    ctx.lineTo(cx + r, cy + h);
    ctx.quadraticCurveTo(cx, cy + h, cx, cy + h - r);
    ctx.lineTo(cx, cy + r);
    ctx.quadraticCurveTo(cx, cy, cx + r, cy);
    ctx.closePath();
  };

  ctx.save();
  drawCardPath();
  ctx.clip();

  // 앞면 이미지 그리기
  if (
    cardImages[type] &&
    cardImages[type].complete &&
    cardImages[type].naturalWidth > 0
  ) {
    ctx.drawImage(cardImages[type], cx, cy, w, h);
  } else {
    ctx.fillStyle = "white";
    ctx.fill();
  }
  ctx.restore();

  ctx.strokeStyle = "#dcdcdc";
  ctx.lineWidth = 1;
  drawCardPath(); // 테두리를 위해 경로 다시 생성
  ctx.stroke();

  ctx.restore();
}

function drawCardDeck(x, y) {
  ctx.save();
  ctx.translate(x, y);

  // 그림자 효과
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;

  const w = 80;
  const h = 120;
  const r = 5; // 모서리 둥글기

  // 카드 외형 경로
  const drawCardPath = (x, y) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  // 카드 더미 (쌓인 효과)
  for (let i = 0; i < 5; i++) {
    ctx.save();
    // 약간씩 비틀어서 자연스럽게
    ctx.rotate(0.05 * (i - 2));

    const cx = -w / 2;
    const cy = -h / 2;

    // 카드 베이스 (흰색)
    drawCardPath(cx, cy);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#dcdcdc";
    ctx.lineWidth = 1;
    ctx.stroke();

    // 맨 위 카드 뒷면 디자인
    if (i === 4) {
      ctx.save();
      ctx.clip(); // 카드 모양대로 클리핑

      if (
        cardImages.BACK &&
        cardImages.BACK.complete &&
        cardImages.BACK.naturalWidth > 0
      ) {
        ctx.drawImage(cardImages.BACK, cx, cy, w, h);
      } else {
        ctx.fillStyle = "#b71c1c";
        ctx.fillRect(cx, cy, w, h);
      }

      ctx.restore();
    }
    ctx.restore();
  }

  ctx.restore();
}

function updateAndDrawAnimations() {
  for (let i = animations.length - 1; i >= 0; i--) {
    const anim = animations[i];
    anim.progress += anim.speed;

    if (anim.progress >= 1) {
      anim.progress = 1;
      if (anim.onComplete) anim.onComplete();
      animations.splice(i, 1);
    } else {
      // 선형 보간 이동
      const curX = anim.startX + (anim.targetX - anim.startX) * anim.progress;
      const curY = anim.startY + (anim.targetY - anim.startY) * anim.progress;
      const curAngle =
        anim.startAngle + (anim.targetAngle - anim.startAngle) * anim.progress;

      // 카드 그리기 (뒷면)
      drawBackCard(curX, curY, curAngle, 0, 0, 1);
    }
  }
}

// 마우스 클릭 이벤트 처리
canvas.addEventListener("click", (e) => {
  if (gameState.phase === "GAME_OVER") {
    location.reload();
    return;
  }

  if (gameState.phase !== "PLAYING") return;
  if (gameState.turnIndex !== 3) return; // 플레이어 턴이 아니면 무시

  const rect = canvas.getBoundingClientRect();
  // 캔버스 스케일링 비율 계산 (화면에 보이는 크기 vs 실제 캔버스 크기)
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const clickX = (e.clientX - rect.left) * scaleX;
  const clickY = (e.clientY - rect.top) * scaleY;

  const player = players[3]; // South
  const cardW = 80;
  const cardH = 120;

  // 1. 카드 클릭 감지 (역순으로 체크하여 위에 있는 카드부터 선택)
  let cardClicked = false;
  for (let i = player.hand.length - 1; i >= 0; i--) {
    const card = player.hand[i];
    const offsetX = (i - (player.hand.length - 1) / 2) * player.spacing;
    const offsetY = card.isSelected ? -30 : 0;

    // 카드의 화면상 좌표 (중심 기준)
    const cardX = player.x + offsetX;
    const cardY = player.y + offsetY;

    // 히트 박스 체크
    if (
      clickX >= cardX - cardW / 2 &&
      clickX <= cardX + cardW / 2 &&
      clickY >= cardY - cardH / 2 &&
      clickY <= cardY + cardH / 2
    ) {
      const selectedCount = player.hand.filter((c) => c.isSelected).length;
      if (card.isSelected || selectedCount < 3) {
        card.isSelected = !card.isSelected;
        playSound("select"); // 카드 선택 효과음
      }
      cardClicked = true;
      break; // 한 번에 한 장만 클릭 처리 (겹친 경우 위쪽 우선)
    }
  }

  // 카드 클릭 시 Play 버튼 상태 업데이트
  const hasSelection = player.hand.some((c) => c.isSelected);
  const btnPlay = document.getElementById("btn-play");
  if (btnPlay) btnPlay.disabled = !hasSelection;
});

function submitCards(playerIndex, cardIndices) {
  const player = players[playerIndex];
  const cardsToPlay = [];

  // 인덱스 역순 정렬 (splice 시 인덱스 밀림 방지)
  cardIndices.sort((a, b) => b - a);

  // 플레이어별 테이블 목표 위치 설정 (각자 앞쪽 테이블 공간)
  let targetBaseX = centerX;
  let targetBaseY = tableY;
  let targetBaseAngle = 0;

  if (playerIndex === 0) {
    // East
    targetBaseX = centerX + 200;
    targetBaseY = tableY;
    targetBaseAngle = -Math.PI / 2;
  } else if (playerIndex === 1) {
    // North
    targetBaseX = centerX;
    targetBaseY = tableY - 120;
    targetBaseAngle = Math.PI;
  } else if (playerIndex === 2) {
    // West
    targetBaseX = centerX - 200;
    targetBaseY = tableY;
    targetBaseAngle = Math.PI / 2;
  } else if (playerIndex === 3) {
    // South
    targetBaseX = centerX;
    targetBaseY = tableY + 120;
    targetBaseAngle = 0;
  }

  // 선택된 카드를 핸드에서 제거하고 테이블로 이동
  cardIndices.forEach((idx) => {
    const card = player.hand.splice(idx, 1)[0];
    card.isSelected = false;
    card.faceUp = false; // 낼 때는 뒷면으로
    cardsToPlay.push(card);

    // 카드 소리 재생
    playSound("card");

    // 애니메이션 추가
    animations.push({
      startX: player.x,
      startY: player.y,
      targetX: centerX,
      targetY: tableY - 40,
      startAngle: player.angle,
      targetAngle: (Math.random() - 0.5) * 0.5, // 랜덤 회전
      progress: 0,
      speed: 0.25, // 카드 이동 속도 증가 (0.1 -> 0.25)
      onComplete: () => {
        gameState.tableCards.push(card);
      },
    });
  });

  // 마지막 배치 정보 업데이트
  gameState.lastPlayedBatch = {
    playerIndex: playerIndex,
    cards: cardsToPlay,
  };

  console.log(`${player.name} played ${cardsToPlay.length} cards.`);

  gameState.turnCount++; // 턴 카운트 증가

  // 턴 넘기기
  nextTurn();

  // 내 턴이 끝나면 버튼 숨기기/비활성화
  if (playerIndex === 3) {
    document.getElementById("btn-play").disabled = true;
  }

  // 다음 턴이 AI라면 AI 로직 실행
  if (gameState.turnIndex !== 3) {
    processAiTurn();
  }
}

function nextTurn() {
  let nextIndex = gameState.turnIndex;
  let loopCount = 0;
  do {
    nextIndex = (nextIndex - 1 + 4) % 4; // 반시계 방향
    loopCount++;
  } while (
    (players[nextIndex].isDead ||
      (gameState.phase === "PLAYING" &&
        players[nextIndex].hand.length === 0)) &&
    loopCount < 5
  );
  gameState.turnIndex = nextIndex;
  updateGameStatus();

  // 내 턴이 돌아왔을 때 Liar 버튼 표시 여부 확인
  const btnLiar = document.getElementById("btn-liar");
  if (
    gameState.turnIndex === 3 &&
    gameState.lastPlayedBatch &&
    gameState.lastPlayedBatch.playerIndex !== 3
  ) {
    btnLiar.classList.remove("hidden");
  } else {
    btnLiar.classList.add("hidden");
  }
}

function processAiTurn() {
  const aiIndex = gameState.turnIndex;
  const aiPlayer = players[aiIndex];

  // 고민하는 시간 랜덤 설정 (1초 ~ 3초)
  const thinkingTime = Math.random() * 2000 + 1000;

  setTimeout(() => {
    // 1. 도전(Liar) 여부 결정 (이전 플레이어가 카드를 냈을 경우)
    // 20% 확률로 도전 + 턴이 지날수록 5%씩 증가
    const challengeChance = 0.2 + gameState.turnCount * 0.05;
    if (gameState.lastPlayedBatch && Math.random() < challengeChance) {
      const phrases = ["거짓말!", "말도 안 돼.", "까봐!", "의심스러운데..."];
      showBubble(aiIndex, phrases[Math.floor(Math.random() * phrases.length)]);
      console.log(`${aiPlayer.name} challenges!`);
      challenge();
      return;
    }

    // 2. 카드 제출 로직
    // 현재 랭크와 일치하거나 조커인 카드 찾기
    const validIndices = [];
    const invalidIndices = [];
    aiPlayer.hand.forEach((card, index) => {
      if (card.type === gameState.currentRank || card.type === "J") {
        validIndices.push(index);
      } else {
        invalidIndices.push(index);
      }
    });

    // 랭크 텍스트 변환 (대사용)
    let rankText = gameState.currentRank;
    if (rankText === "S") rankText = "에이스";
    if (rankText === "J") rankText = "조커";
    if (rankText === "K") rankText = "킹";
    if (rankText === "Q") rankText = "퀸";

    let indicesToPlay = [];

    // 진실을 말할 확률 (50% 고정 - 진짜 랜덤하게 블러핑)
    const truthChance = 0.5;

    if (validIndices.length > 0 && Math.random() < truthChance) {
      const count = Math.min(
        validIndices.length,
        Math.floor(Math.random() * 3) + 1,
      ); // 1~3장
      indicesToPlay = validIndices.slice(0, count);

      // 진실 대사
      const phrases = ["진짜야.", "믿어줘.", `${rankText} 냈어.`, "진실이야."];
      showBubble(aiIndex, phrases[Math.floor(Math.random() * phrases.length)]);
    } else {
      // 거짓말 (랜덤 카드 제출)
      const count = Math.min(
        aiPlayer.hand.length,
        Math.floor(Math.random() * 3) + 1,
      ); // 1~3장
      // 섞어서 선택
      const allIndices = validIndices.concat(invalidIndices);
      // 셔플 (무작위 선택)
      for (let i = allIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allIndices[i], allIndices[j]] = [allIndices[j], allIndices[i]];
      }
      indicesToPlay = allIndices.slice(0, count);

      // 블러핑 대사
      const phrases = ["쉽네.", "거짓말 아니야.", "믿어봐.", "카드 낸다."];
      showBubble(aiIndex, phrases[Math.floor(Math.random() * phrases.length)]);
    }

    // 카드가 없으면 강제로 아무거나 냄 (규칙상 패스 없음)
    if (indicesToPlay.length === 0 && aiPlayer.hand.length > 0) {
      indicesToPlay.push(0);
    }

    submitCards(aiIndex, indicesToPlay);
  }, thinkingTime);
}

function challenge() {
  gameState.phase = "RESOLVING";
  const challenger = players[gameState.turnIndex];
  const lastBatch = gameState.lastPlayedBatch;
  const submitter = players[lastBatch.playerIndex];
  const isLie = lastBatch.cards.some(
    (c) => c.type !== gameState.currentRank && c.type !== "J",
  );

  // 도전 대사 (플레이어가 도전했을 때도 말풍선 표시)
  const phrases = ["오픈!", "두고 보자.", "거짓말!"];
  showBubble(
    gameState.turnIndex,
    phrases[Math.floor(Math.random() * phrases.length)],
  );

  console.log("--- CHALLENGE! ---");
  console.log(`Challenger: ${challenger.name}, Submitter: ${submitter.name}`);

  lastBatch.cards.forEach((card) => {
    // 결과 확인을 위해 앞면으로 뒤집기 (애니메이션 없이 즉시)
    card.faceUp = true;
  });

  // 테이블의 마지막 카드들을 앞면으로 그림 (draw 함수에서 처리됨)
  // 여기서는 결과 처리만

  let loser;
  if (isLie) {
    console.log("It was a LIE! Submitter loses.");
    loser = submitter;
  } else {
    console.log("It was TRUE! Challenger loses.");
    loser = challenger;
  }

  showMessage(isLie ? "거짓말!" : "진실!", 100);

  setTimeout(() => {
    triggerRussianRoulette(loser);
  }, 2000);
}

function triggerRussianRoulette(victim) {
  gameState.phase = "ROULETTE";
  playBGM("roulette"); // 룰렛 BGM으로 전환
  gameState.lighting = "DIM"; // 조명 어둡게 (긴장감)
  showMessage(`${victim.displayName}이(가) 방아쇠를 당깁니다...`, 100);

  const heartbeat = document.getElementById("sfx-heartbeat");
  if (heartbeat) {
    heartbeat.volume = 0.8;
    heartbeat.play().catch(() => {});
  }

  setTimeout(() => {
    if (heartbeat) {
      heartbeat.pause();
      heartbeat.currentTime = 0;
    }

    // 발사 로직 (1/6 확률, 실제로는 챔버가 돌아감)
    const isBang = revolver.currentChamber === revolver.bulletPosition;
    revolver.currentChamber = (revolver.currentChamber + 1) % revolver.chambers;

    if (isBang) {
      showMessage("탕!!!", 150);
      playSound("gun"); // 총소리
      gameState.shakeTimer = 30; // 30프레임 동안 흔들림
      gameState.lighting = "RED_FLASH"; // 붉은 섬광
      gameState.lightingTimer = 60;
      victim.isDead = true;

      // 사망 메시지 표시
      const statusEl = document.getElementById("game-status");
      if (statusEl) {
        statusEl.textContent = `${victim.displayName}은(는) 사망하였습니다.`;
        statusEl.style.color = "#c62828";
      }

      // 사망 처리 후 게임 상태 확인
      setTimeout(() => {
        checkWinCondition();
      }, 2000);
    } else {
      playSound("click"); // 빈 총 소리
      showMessage("철컥... (생존)", 100);
      gameState.lighting = "FLICKER"; // 조명 깜빡임
      gameState.lightingTimer = 30;
      setTimeout(() => {
        startRound(); // 생존 시 다음 라운드
      }, 2000);
    }
  }, 2000);
}

function checkWinCondition() {
  const survivors = players.filter((p) => !p.isDead);

  if (players[3].isDead) {
    gameState.phase = "GAME_OVER"; // 플레이어 사망
    showGameOver(false);
  } else if (survivors.length === 1 && survivors[0].name === "South") {
    gameState.phase = "GAME_OVER"; // 플레이어 승리 (혼자 남음)
    showGameOver(true);
  } else {
    startRound(); // 게임 계속
  }
}

function startRound() {
  // 테이블 초기화
  gameState.tableCards = [];
  gameState.lastPlayedBatch = null;
  gameState.phase = "DEALING";
  gameState.lighting = "NORMAL"; // 조명 복구
  gameState.turnCount = 0; // 턴 카운트 초기화
  playBGM("main"); // 메인 BGM으로 복귀

  // 현재 턴인 플레이어가 사망했다면 다음 턴으로 넘김
  if (players[gameState.turnIndex].isDead) {
    nextTurn();
  }

  // 덱 재생성 및 셔플
  // (간단하게 기존 cardTypes 다시 셔플)
  for (let i = cardTypes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardTypes[i], cardTypes[j]] = [cardTypes[j], cardTypes[i]];
  }

  // 생존자들에게 카드 다시 배분 (기존 핸드 초기화)
  players.forEach((p) => {
    p.hand = [];
    p.spacing = 15;
  });

  // 딜링 상태 리셋
  dealingState.isDealing = true;
  dealingState.dealtCount = 0;
  dealingState.totalCards = 20; // 5장 * 4명 (죽은 사람도 딜링 모션은 가지만 카드는 버려짐 처리하거나, 로직 수정 필요)
  // 여기서는 간단히 죽은 사람에게도 카드가 가는 모션은 나오되 핸드에는 안 쌓이게 처리하거나
  // dealtCount 로직을 수정해야 함. 편의상 죽은 사람은 건너뛰고 산 사람에게만 5장씩 주도록 수정.

  // 새 랭크 설정
  const ranks = ["K", "Q", "S"];
  gameState.currentRank = ranks[Math.floor(Math.random() * ranks.length)];
  updateTargetDisplay();
}

function showMessage(text, duration) {
  const overlay = document.getElementById("message-overlay");
  overlay.textContent = text;
  overlay.classList.remove("hidden");

  // duration이 지나면 숨김 (프레임 단위가 아닌 시간 단위로 변경)
  setTimeout(() => {
    overlay.classList.add("hidden");
  }, duration * 16); // 기존 duration이 프레임 단위였으므로 대략 ms로 변환
}

function updateTargetDisplay() {
  let rankSymbol = gameState.currentRank;
  if (rankSymbol === "S") rankSymbol = "A(♠)";
  if (rankSymbol === "J") rankSymbol = "JOKER";
  document.getElementById("target-rank").textContent = `목표: ${rankSymbol}`;
}

function updateGameStatus() {
  const statusEl = document.getElementById("game-status");
  if (!statusEl) return;

  if (gameState.turnIndex === 3) {
    statusEl.textContent = "플레이어 1은 카드를 내주세요";
    statusEl.style.color = "#ffffff"; // White
  } else {
    statusEl.textContent = `${players[gameState.turnIndex].displayName}이(가) 선택 중입니다...`;
    statusEl.style.color = "#ffffff";
  }
}

function showGameOver(isWin) {
  const screen = document.getElementById("game-over-screen");
  const title = document.getElementById("game-over-title");

  screen.classList.remove("hidden");
  document.getElementById("game-hud").classList.add("hidden");

  if (isWin) {
    title.textContent = "생존했습니다";
    title.style.color = "#2e7d32";
  } else {
    title.textContent = "사망했습니다";
    title.style.color = "#c62828";
  }
}

// --- DOM 이벤트 리스너 등록 ---

document.getElementById("btn-start").addEventListener("click", () => {
  document.getElementById("start-screen").classList.add("hidden");
  gameState.phase = "DEALING";
  playSound("click");
  playBGM("main");
});

document.getElementById("btn-play").addEventListener("click", () => {
  const player = players[3];
  const selectedIndices = player.hand
    .map((card, index) => (card.isSelected ? index : -1))
    .filter((index) => index !== -1);
  submitCards(3, selectedIndices);
});

document.getElementById("btn-liar").addEventListener("click", () => {
  challenge();
});

document.getElementById("btn-restart").addEventListener("click", () => {
  document.body.classList.add("fade-out");
  setTimeout(() => {
    location.reload();
  }, 1000);
});

document.getElementById("btn-fullscreen").addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.log(
        `Error attempting to enable full-screen mode: ${err.message}`,
      );
    });
  } else {
    document.exitFullscreen();
  }
});

// 그리기 실행
draw();
