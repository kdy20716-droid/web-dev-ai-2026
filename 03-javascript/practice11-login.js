const form = document.querySelector("#loginForm");
const idInput = document.querySelector("#id");
const pwInput = document.querySelector("#pw");

const loginSection = document.querySelector("#loginSection");
const profileSection = document.querySelector("#profileSection");
const profileName = document.querySelector("#profileName");
const profileId = document.querySelector("#profileId");
const profileEmail = document.querySelector("#profileEmail");
const profilePhone = document.querySelector("#profilePhone");
const logoutBtn = document.querySelector("#logoutBtn");
const withdrawBtn = document.querySelector("#withdrawBtn");

let currentUserId = null; // 현재 로그인한 사용자 ID 저장

form.addEventListener("submit", (e) => {
  e.preventDefault(); // 새로고침 방지

  const id = idInput.value;
  const pw = pwInput.value;

  // 1. 아이디 입력 확인
  if (!id) {
    return alert("아이디를 입력해주세요.");
  }

  // 2. 로컬 스토리지에서 사용자 정보 가져오기
  const storedUser = localStorage.getItem(id);

  if (!storedUser) {
    return alert("존재하지 않는 아이디입니다.");
  }

  const user = JSON.parse(storedUser);

  // 3. 비밀번호 일치 확인
  if (user.pw === pw) {
    alert(`${user.name}님 환영합니다! 로그인 되었습니다.`);
    // 로그인 성공 처리: 화면 전환
    currentUserId = id;
    profileName.textContent = user.name;
    profileId.textContent = user.id;
    profileEmail.textContent = user.email;
    profilePhone.textContent = user.phone;

    loginSection.classList.add("hidden");
    profileSection.classList.remove("hidden");

    // 입력창 초기화
    idInput.value = "";
    pwInput.value = "";
  } else {
    alert("비밀번호가 일치하지 않습니다.");
  }
});

// 로그아웃 버튼
logoutBtn.addEventListener("click", () => {
  alert("로그아웃 되었습니다.");
  loginSection.classList.remove("hidden");
  profileSection.classList.add("hidden");
  currentUserId = null;
});

// 회원탈퇴 버튼
withdrawBtn.addEventListener("click", () => {
  if (confirm("정말로 탈퇴하시겠습니까? 모든 정보가 삭제됩니다.")) {
    localStorage.removeItem(currentUserId);
    alert("회원탈퇴가 완료되었습니다.");
    loginSection.classList.remove("hidden");
    profileSection.classList.add("hidden");
    currentUserId = null;
  }
});
