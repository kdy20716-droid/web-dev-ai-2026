const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 캔버스 크기 설정
canvas.width = 1024;
canvas.height = 576;

function draw() {
  // 배경 (바닥)
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 중앙 테이블 좌표
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const tableY = centerY + 30; // 전체적으로 아래로 내림

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
  lightGradient.addColorStop(0, "rgba(93, 64, 55, 0.4)"); // 중심부 은은한 빛
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
}

// 그리기 실행
draw();

/*
### 게임 설명
1.  **게임 목표**: 카드를 내면서 거짓말을 들키지 않거나, 상대방의 거짓말을 간파하여 러시안 룰렛에서 살아남으세요.
2.  **진행 방식**:
   *   매 턴마다 **목표 숫자(Target Rank)**가 정해집니다.
   *   플레이어는 카드를 한 장 선택하여 **'제출하기'**를 누릅니다. (목표 숫자와 다른 카드를 내면 거짓말이 됩니다.)
   *   상대방(AI)은 카드를 보고 **'의심하기'** 또는 **'패스'**를 선택합니다.
3.  **러시안 룰렛**:
   *   거짓말이 들통나거나, 진실인데 의심받으면 패자가 되어 방아쇠를 당깁니다.
   *   6발 중 1발이 실탄입니다. 발사되면 게임 오버!
4.  **AI**: 공격적 성향의 AI가 탑재되어 있어 블러핑과 의심을 자주 시도합니다.

이제 `liars-roulette.html`을 실행하면 긴장감 넘치는 심리전 게임을 즐기실 수 있습니다!


[PROMPT_SUGGESTION]러시안 룰렛에서 방아쇠를 당길 때 긴장감 있는 효과음과 애니메이션을 추가해줘[/PROMPT_SUGGESTION]
[PROMPT_SUGGESTION]AI가 블러핑을 할 때 가끔씩 말풍선으로 도발하는 대사를 하도록 만들어줘[/PROMPT_SUGGESTION]
*/
