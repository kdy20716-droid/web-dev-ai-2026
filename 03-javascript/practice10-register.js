const form = document.querySelector("#registerForm");
const id = document.querySelector("#id");
const pw = document.querySelector("#pw");
const pwCheck = document.querySelector("#pwCheck");
const name = document.querySelector("#name");
const email = document.querySelector("#email");
const phone = document.querySelector("#phone");

// 각 필드의 유효성 상태를 저장하는 객체
const checkStatus = {
  id: false,
  pw: false,
  pwCheck: false,
  name: false,
  email: false,
  phone: false,
};

// 유효성 검사 함수 (입력요소, 정규식, 메시지요소, 키값)
function validate(input, regex, msgElement, key) {
  if (regex.test(input.value)) {
    msgElement.textContent = "확인되었습니다";
    msgElement.style.color = "green";
    checkStatus[key] = true;
    return true;
  } else {
    msgElement.textContent = "제대로 작성해 주세요";
    msgElement.style.color = "red";
    checkStatus[key] = false;
    return false;
  }
}

// 1. 아이디: 영문 소문자, 숫자 포함 4~12자
id.addEventListener("input", () => {
  const regex = /^[a-z0-9]{4,12}$/;
  validate(id, regex, document.querySelector("#idMsg"), "id");
});

// 2. 비밀번호: 영문, 숫자, 특수문자 포함 8자 이상
pw.addEventListener("input", () => {
  // (?=.*[a-zA-Z]) : 적어도 하나의 영문자 포함
  // (?=.*[0-9]) : 적어도 하나의 숫자 포함
  // (?=.*[!@#$%^&*]) : 적어도 하나의 특수문자 포함
  const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
  validate(pw, regex, document.querySelector("#pwMsg"), "pw");

  // 비밀번호가 바뀌면 비밀번호 확인도 다시 체크해야 함
  if (pwCheck.value !== "") {
    checkPwMatch();
  }
});

// 3. 비밀번호 확인: 비밀번호와 일치 여부
function checkPwMatch() {
  const msg = document.querySelector("#pwCheckMsg");
  if (pw.value === pwCheck.value && checkStatus.pw) {
    msg.textContent = "확인되었습니다";
    msg.style.color = "green";
    checkStatus.pwCheck = true;
  } else {
    msg.textContent = "비밀번호가 일치하지 않거나 유효하지 않습니다";
    msg.style.color = "red";
    checkStatus.pwCheck = false;
  }
}
pwCheck.addEventListener("input", checkPwMatch);

// 4. 이름: 한글 또는 영문 2자 이상
name.addEventListener("input", () => {
  const regex = /^[가-힣a-zA-Z]{2,}$/;
  validate(name, regex, document.querySelector("#nameMsg"), "name");
});

// 5. 이메일: 이메일 형식
email.addEventListener("input", () => {
  // 일반적인 이메일 정규식
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  validate(email, regex, document.querySelector("#emailMsg"), "email");
});

// 6. 전화번호: 010-0000-0000 형식
phone.addEventListener("input", () => {
  const regex = /^010-\d{4}-\d{4}$/;
  validate(phone, regex, document.querySelector("#phoneMsg"), "phone");
});

// 7. 폼 제출 시 전체 확인
form.addEventListener("submit", (e) => {
  e.preventDefault(); // 새로고침 방지

  // 모든 필드가 true인지 확인
  const isAllValid = Object.values(checkStatus).every(
    (status) => status === true,
  );

  if (isAllValid) {
    alert("회원가입되었습니다");
    // 실제 서버 전송 로직은 여기에 작성 (form.submit() 등)
    // form.submit();
  } else {
    alert("입력 정보를 다시 확인해주세요.");

    // 유효하지 않은 첫 번째 필드로 포커스 이동 (사용자 편의성)
    if (!checkStatus.id) id.focus();
    else if (!checkStatus.pw) pw.focus();
    else if (!checkStatus.pwCheck) pwCheck.focus();
    else if (!checkStatus.name) name.focus();
    else if (!checkStatus.email) email.focus();
    else if (!checkStatus.phone) phone.focus();
  }
});

// 8. 취소 버튼 (새로고침)
document.querySelector("#cancelBtn").addEventListener("click", () => {
  location.reload();
});
