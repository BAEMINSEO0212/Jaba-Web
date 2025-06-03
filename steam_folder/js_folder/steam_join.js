// js_folder/steam_join.js

// 필요한 모듈 import
import { session_set2 } from './steam_session.js'; // 세션 저장 함수
import { encrypt_text } from './crypto.js';     // 비밀번호 암호화 함수

// SignUp 클래스 정의 (생성자가 암호화된 비밀번호를 받는다고 가정)
class SignUp {
    constructor(name, email, encryptedPassword) {
        this._name = name;
        this._email = email;
        this._password = encryptedPassword; // 암호화된 비밀번호 저장
        // console.log("SignUp 객체 생성됨:", this); // 객체 생성 확인용 로그
    }
    // 전체 회원 정보를 한 번에 설정하는 함수
    setUserInfo(name, email, password, re_password) {
        this._name = name;
        this._email = email;
        this._password = password;
        this._re_password = re_password;
    }
    // (필요한 다른 getter, setter, 메소드들...)
    getUserInfo() { // 예시: 저장된 객체 정보 확인용 (비밀번호는 암호화 상태)
        return {
            name: this._name,
            email: this._email,
            encryptedPassword: this._password // 실제로는 이 정보를 직접 반환/사용하지 않도록 주의
        };
    }
}

function join() { // 회원가입 기능
    console.log("join 함수 실행됨");

    // HTML 요소 가져오기
    const form = document.querySelector("#join_form");
    const nameInput = document.querySelector("#form3Example1c");
    const emailInput = document.querySelector("#form3Example3c");
    const passwordInput = document.querySelector("#form3Example4c");
    const re_passwordInput = document.querySelector("#form3Example4cd");
    const agreeCheckbox = document.querySelector("#form2Example3c");

    // 입력값 가져오기 (trim()으로 앞뒤 공백 제거)
    const nameValue = nameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value; // 비밀번호는 사용자가 입력한 그대로
    const re_passwordValue = re_passwordInput.value;

    // 1. 모든 필드 입력 여부 확인
    if (nameValue === "" || emailValue === "" || passwordValue === "" || re_passwordValue === "") {
        alert("회원가입 폼에 모든 정보를 입력해주세요.");
        return; // 함수 종료
    }

    // 2. 정규표현식을 사용한 유효성 검사
    const nameRegex = /^[가-힣]{2,}$/; // 한글 2자 이상
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/; // 8자 이상, 대/소/숫자/특수문자 각 1개 이상

    if (!nameRegex.test(nameValue)) {
        alert("이름은 2자 이상의 한글만 입력 가능합니다.");
        nameInput.focus();
        return;
    }
    if (!emailRegex.test(emailValue)) {
        alert("올바른 이메일 형식을 입력해주세요.");
        emailInput.focus();
        return;
    }
    if (!pwRegex.test(passwordValue)) {
        alert("비밀번호는 8자 이상이며, 대문자, 소문자, 숫자, 특수문자를 각각 하나 이상 포함해야 합니다.");
        passwordInput.focus();
        return;
    }

    // 3. 비밀번호와 비밀번호 확인 일치 여부 검사
    if (passwordValue !== re_passwordValue) {
        alert("비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
        re_passwordInput.focus();
        re_passwordInput.value = "";
        return;
    }

    // 4. 약관 동의 여부 확인
    if (!agreeCheckbox.checked) {
        alert("서비스 이용 약관에 동의해주세요.");
        return;
    }

    // 모든 유효성 검사 통과
    console.log("모든 유효성 검사 통과!");
    console.log("원본 비밀번호:", passwordValue); // 암호화 전 비밀번호 확인

    // ★★★ 비밀번호 암호화 ★★★
    const encryptedPassword = encrypt_text(passwordValue);
    console.log("암호화된 비밀번호:", encryptedPassword); // 암호화된 비밀번호 확인

    // 암호화된 비밀번호로 SignUp 객체 생성
    const newUser = new SignUp(nameValue, emailValue, encryptedPassword);
    // console.log("생성된 newUser 객체:", newUser.getUserInfo()); // 저장 전 객체 내용 확인 (암호화된 비번 포함)

    // 세션에 사용자 객체 저장 (session_set2는 객체를 받아 JSON.stringify 후 저장)
    session_set2(newUser); // steam_session.js의 session_set2 함수 호출
    console.log("세션에 사용자 정보 저장 완료 (암호화된 비밀번호 포함)");

    alert("회원가입이 완료되었습니다! 메인 페이지로 이동합니다.");

    // 폼 제출 또는 페이지 이동
    form.action = "../steam_main.html"; // 회원가입 성공 후 이동할 페이지
    form.method = "get"; // GET 방식은 URL에 데이터 노출, 실제로는 POST 방식 권장
    form.submit();
}

// "가입하기" 버튼에 이벤트 리스너 등록
const joinSubmitButton = document.getElementById("join_btn");
if (joinSubmitButton) {
    joinSubmitButton.addEventListener('click', join);
    console.log("가입하기 버튼에 이벤트 리스너 등록됨");
} else {
    console.error("가입하기 버튼(join_btn)을 찾을 수 없습니다. HTML의 버튼 ID를 확인해주세요.");
}