const form = document.querySelector("#loginForm");
const idInput = document.querySelector("#id");
const pwInput = document.querySelector("#pw");

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
    // 로그인 성공 후 페이지 이동 로직 등을 여기에 추가 (예: location.href = 'main.html')
  } else {
    alert("비밀번호가 일치하지 않습니다.");
  }
});
