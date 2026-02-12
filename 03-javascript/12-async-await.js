document.querySelector("#callback").addEventListener("click", () => {
  const result = document.querySelector("#callback");
  result.textContent = "콜백 시작!";

  setTimeout(() => {
    result.textContent = "1초후 실행!";
  }, timeout);
});
