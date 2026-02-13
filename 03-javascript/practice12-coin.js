const coinList = document.querySelector("#coin-list");
const coinInput = document.querySelector("#coin-input");
const searchBtn = document.querySelector("#search-btn");

// 모달 관련 요소
const modal = document.querySelector("#coin-modal");
const modalTitle = document.querySelector("#modal-title");
const modalBody = document.querySelector("#modal-body");
const closeBtn = document.querySelector(".close");

// 조회할 코인 목록 (KRW 마켓)
let markets = [];
const marketNames = {}; // 한국어 이름 저장용
let searchKeyword = ""; // 검색어 저장
const prevAccTradePrice = {}; // 이전 거래대금 저장

// 코인 검색 함수
function searchCoin() {
  searchKeyword = coinInput.value.toUpperCase().trim();
  getUpbitData(); // 즉시 갱신
}

// 이벤트 리스너 등록
searchBtn.addEventListener("click", searchCoin);
coinInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchCoin();
});

// 모든 마켓 코드 가져오기
async function getMarketCodes() {
  try {
    const response = await fetch(
      "https://api.upbit.com/v1/market/all?isDetails=false",
    );
    if (!response.ok) throw new Error("마켓 코드 조회 실패");
    const data = await response.json();

    // KRW 마켓만 필터링
    const krwMarkets = data.filter((coin) => coin.market.startsWith("KRW-"));
    markets = krwMarkets.map((coin) => coin.market);

    krwMarkets.forEach((coin) => {
      marketNames[coin.market] = coin.korean_name;
    });

    getUpbitData(); // 데이터 가져오기 시작
  } catch (error) {
    console.error("마켓 코드 가져오기 실패:", error);
  }
}

// API 호출 및 데이터 렌더링 함수
async function getUpbitData() {
  if (markets.length === 0) {
    coinList.innerHTML =
      "<tr><td colspan='4'>조회할 코인이 없습니다.</td></tr>";
    return;
  }

  try {
    // 업비트 API 호출 (마켓 코드들을 쉼표로 구분해서 요청)
    const url = `https://api.upbit.com/v1/ticker?markets=${markets.join(",")}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("네트워크 응답이 올바르지 않습니다.");
    }

    const data = await response.json();

    // 거래대금 기준 내림차순 정렬
    data.sort((a, b) => b.acc_trade_price_24h - a.acc_trade_price_24h);

    renderTable(data);
  } catch (error) {
    console.error("데이터를 가져오는 중 오류 발생:", error);
  }
}

// 테이블 렌더링 함수
function renderTable(data) {
  coinList.innerHTML = ""; // 기존 내용 초기화
  let hasResult = false;

  data.forEach((coin) => {
    const tr = document.createElement("tr");

    // 코인 이름 (마켓 코드에서 KRW- 제거)
    const symbol = coin.market.replace("KRW-", "");
    const koreanName = marketNames[coin.market] || "";

    // 검색어 필터링
    if (searchKeyword) {
      if (
        !symbol.includes(searchKeyword) &&
        !koreanName.includes(searchKeyword)
      ) {
        return;
      }
    }

    hasResult = true;

    // 현재가 (천 단위 콤마)
    const price = coin.trade_price.toLocaleString();

    // 전일대비 등락율 (백분율 변환 및 소수점 2자리)
    const changeRate = (coin.signed_change_rate * 100).toFixed(2);

    // 거래대금 (백만 단위로 표시)
    const accTradePrice =
      Math.floor(coin.acc_trade_price_24h / 1000000).toLocaleString() + "백만";

    // 거래대금 변경 감지
    let tradeClass = "";
    if (
      prevAccTradePrice[coin.market] &&
      prevAccTradePrice[coin.market] !== coin.acc_trade_price_24h
    ) {
      tradeClass = "flash-red";
    }
    prevAccTradePrice[coin.market] = coin.acc_trade_price_24h;

    // 색상 클래스 결정 (상승: up, 하락: down)
    let colorClass = "same";
    if (coin.signed_change_rate > 0) colorClass = "up";
    else if (coin.signed_change_rate < 0) colorClass = "down";

    tr.innerHTML = `
      <td><strong>${symbol}</strong> <span style="font-size: 0.8em; color: #666;">${koreanName}</span></td>
      <td class="${colorClass}">${price} KRW</td>
      <td class="${colorClass}">${changeRate}%</td>
      <td class="${tradeClass}">${accTradePrice}</td>
    `;

    // 클릭 이벤트 추가 (모달 띄우기)
    tr.addEventListener("click", () => {
      showModal(coin);
    });

    coinList.appendChild(tr);
  });

  if (!hasResult) {
    coinList.innerHTML = "<tr><td colspan='4'>검색 결과가 없습니다.</td></tr>";
  }
}

// 모달창 표시 함수
async function showModal(coin) {
  const symbol = coin.market.replace("KRW-", "");
  const koreanName = marketNames[coin.market] || "";
  const colorStyle =
    coin.signed_change_rate > 0
      ? "color: #c84a31;"
      : coin.signed_change_rate < 0
        ? "color: #1261c4;"
        : "color: #333;";

  modalTitle.innerHTML = `${koreanName} <span style="font-size: 0.7em; color: #666;">(${symbol})</span>`;

  modalBody.innerHTML = `
    <p><strong>현재가:</strong> <span style="${colorStyle} font-weight: bold;">${coin.trade_price.toLocaleString()} KRW</span></p>
    <p><strong>전일대비:</strong> <span style="${colorStyle}">${(coin.signed_change_rate * 100).toFixed(2)}%</span></p>
    <p><strong>고가 (High):</strong> ${coin.high_price.toLocaleString()} KRW</p>
    <p><strong>저가 (Low):</strong> ${coin.low_price.toLocaleString()} KRW</p>
    <p><strong>거래량 (24H):</strong> ${Math.floor(coin.acc_trade_volume_24h).toLocaleString()}</p>
    <p><strong>거래대금 (24H):</strong> ${Math.floor(coin.acc_trade_price_24h).toLocaleString()} KRW</p>
    <p><strong>52주 신고가:</strong> ${coin.highest_52_week_price.toLocaleString()} KRW (${coin.highest_52_week_date})</p>
    <p><strong>52주 신저가:</strong> ${coin.lowest_52_week_price.toLocaleString()} KRW (${coin.lowest_52_week_date})</p>
    <div id="modal-chart" style="margin-top: 20px; text-align: center;">
      <p style="color: #888;">차트 로딩 중...</p>
    </div>
  `;

  modal.style.display = "block";

  // 차트 데이터 가져오기 (최근 30일)
  try {
    const response = await fetch(
      `https://api.upbit.com/v1/candles/days?market=${coin.market}&count=30`,
    );
    if (!response.ok) throw new Error("차트 데이터 조회 실패");
    const data = await response.json();

    // 데이터 가공 (날짜, 가격)
    const reversedData = data.reverse();
    const labels = reversedData.map((item) =>
      item.candle_date_time_kst.substr(5, 5),
    ); // MM-DD
    const prices = reversedData.map((item) => item.trade_price);

    // 차트 색상 (상승: 빨강, 하락: 파랑)
    const isUp = prices[prices.length - 1] >= prices[0];
    const borderColor = isUp ? "#c84a31" : "#1261c4";

    // QuickChart API 설정
    const chartConfig = {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "30일 시세",
            data: prices,
            borderColor: borderColor,
            backgroundColor: "rgba(0,0,0,0)",
            borderWidth: 2,
            pointRadius: 0,
          },
        ],
      },
      options: {
        legend: { display: false },
        title: { display: true, text: "최근 30일 시세 추이" },
        scales: {
          xAxes: [{ ticks: { fontSize: 10 } }],
          yAxes: [{ ticks: { fontSize: 10 } }],
        },
      },
    };

    const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(
      JSON.stringify(chartConfig),
    )}`;

    const chartDiv = document.querySelector("#modal-chart");
    if (chartDiv) {
      chartDiv.innerHTML = `<img src="${chartUrl}" alt="30일 시세 차트" style="width: 100%; border-radius: 5px; border: 1px solid #eee;">`;
    }
  } catch (error) {
    console.error("차트 로딩 실패:", error);
    const chartDiv = document.querySelector("#modal-chart");
    if (chartDiv) {
      chartDiv.innerHTML = `<p style="color: red;">차트 정보를 불러오지 못했습니다.</p>`;
    }
  }
}

// 모달 닫기 이벤트
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// 모달 외부 클릭 시 닫기
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// 초기 실행
getMarketCodes();

// 1초마다 갱신 (실시간 효과)
setInterval(getUpbitData, 1000);
