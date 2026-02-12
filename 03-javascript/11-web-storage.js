// 세션
const setSession = document.querySelector("#setsession");
setSession.addEventListener("click", () => {
  // 세션에 저장 & 수정
  sessionStorage.setItem("session", "세션");
  sessionStorage.setItem("session2", "세션2");
});
const getSession = document.querySelector("#getsession");
getSession.addEventListener("click", () => {
  // 세션에서 가져오기
  sessionStorage.getItem("session");
  alert(session);
});
const removeSession = document.querySelector("#removesession");
removeSession.addEventListener("click", () => {
  // 세션에서 제거
  sessionStorage.removeItem("session");
});
const clearSession = document.querySelector("#clearsession");
clearSession.addEventListener("click", () => {
  // 세션 전체 제거
  sessionStorage.clear();
});
//로컬
const setlocal = document.querySelector("#setlocal");
setlocal.addEventListener("click", () => {
  // 로컬에 저장 & 수정 -> 값은 무조건 문자열 (보통 JSON 객체로 넣는 편)
  // 객체 자체를 직접 넣으면 안들어가져요! -> 객체 -> 문자열로 변경해서 추가
  localStorage.setItem("local", "로컬");
  localStorage.setItem("user", { name: "사용자", age: 25 });
});
const getlocal = document.querySelector("#getlocal");
getlocal.addEventListener("click", () => {
  const user = localStorage.getItem("user");
  alert(user);
});
const removelocal = document.querySelector("#removelocal");
const clearlocal = document.querySelector("#clearlocal");
