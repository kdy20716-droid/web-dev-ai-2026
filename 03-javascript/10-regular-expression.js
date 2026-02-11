console.log(`^ 테스트 : `, /^H/.test("Hello World"));
console.log(`$ 테스트 : `, /d$/.test("Hello World"));
console.log(`. 테스트 : `, /H.llo/.test("Hello World"));
console.log(`* 테스트 : `, /abc*d/.test("abd"));
console.log(`+ 테스트 : `, /abc+d/.test("abccd"));
console.log(`? 테스트 : `, /abc?d/.test("abd"));
console.log(`{m,n} 테스트 : `, /^a{2,4}$/.test("aa"));
// 그냥쓰면 n개이상도 true로 표기됨 ^로 시작해서 $로 끝내는걸 해야됨
console.log(`[] 테스트 : `, /^[a-zA-Z0-9]{2,8}$/.test("abABC012"));
// a-z : 알파벳 소문자, A-Z : 알파벳 대문자
// 0-9 : 숫자, 가-힣 : 한글, !~~ : 특수문자 + 알파벳 소문자 + 대문자 + 숫자
console.log(`( | ) 테스트 : `, /(dog|cat)/.test("dog"));
// dog 또는 cat이 포함되어있는지
console.log(`( \d ) 테스트 : `, /^\d+$/.test("12345"));
console.log(`( \D ) 테스트 : `, /^\D+$/.test("hello"));
console.log(`( \w ) 테스트 : `, /^\w+$/.test("abcde_12345"));
console.log(`( \W ) 테스트 : `, /^\W+$/.test("!@#$%^&*()"));
console.log(`( \s ) 테스트 : `, /\s+/.test("abcde 12345"));
console.log(`( \S ) 테스트 : `, /^\S+$/.test("abcde12345"));

// 2. match /replace / split
const test = "apple banana kiwi orange";
console.log("match", test.match(/kiwi/)[0]);
console.log("replace", test.replace(/a/g, "c"));
console.log("split", "010-1234-5678".split(/-/));

// 3. 주민등록번호 정규표현식
const input = document.querySelector("#input");
const result = document.querySelector("#result");
input.addEventListener("input", (e) => {
  // 000000-0000000
  let regEXP = /^\d{6}-\d{7}$/;
  // 성별 : - 다음 바로 나오는 숫자는 1~4까지만 허용
  regEXP = /^\d{6}-[1-4][0-9]{6}$/;
  // 생년월일 : 년 - 두자리 숫자, 월 - 01~12, 일 - 01~31
  regEXP = /^\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[01])-[1-4][0-9]{6}$/;

  if (regEXP.test(e.target.value)) {
    result.textContent = "유효한 주민등록번호입니다.";
    result.style.color = "green";
    result.style.fontWeight = "bold";
  } else {
    result.textContent = "유효하지 않은 주민등록번호입니다.";
    result.style.color = "red";
    result.style.fontWeight = "bold";
  }
  console.log(regEXP.test(e.target.value));
});
