import { session_set2 } from './steam_session.js'; // 세션 저장 함수 import
import { encrypt_text } from './crypto.js';        // 비밀번호 암호화 함수 import

class SignUp {
    constructor(name, email, encryptedPassword) {
        this._name = name;
        this._email = email;
        this._password = encryptedPassword; // 암호화된 비밀번호 저장
    }
    setUserInfo(name, email, password, re_password) {
        this._name = name;
        this._email = email;
        this._password = password;
        this._re_password = re_password;
    }
    getUserInfo() {
        return {
            name: this._name,
            email: this._email,
            encryptedPassword: this._password
        };
    }
}

function join() {
    // 회원가입 폼 요소 및 입력값 가져오기
    const form = document.querySelector("#join_form");
    const nameInput = document.querySelector("#form3Example1c");
    const emailInput = document.querySelector("#form3Example3c");
    const passwordInput = document.querySelector("#form3Example4c");
    const re_passwordInput = document.querySelector("#form3Example4cd");
    const agreeCheckbox = document.querySelector("#form2Example3c");

    const nameValue = nameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value;
    const re_passwordValue = re_passwordInput.value;

    // 입력값이 모두 채워졌는지 확인
    if (nameValue === "" || emailValue === "" || passwordValue === "" || re_passwordValue === "") {
        alert("회원가입 폼에 모든 정보를 입력해주세요.");
        return;
    }

    // 이름, 이메일, 비밀번호 정규표현식 유효성 검사
    const nameRegex = /^[가-힣]{2,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

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

    // 비밀번호와 비밀번호 확인 일치 여부 검사
    if (passwordValue !== re_passwordValue) {
        alert("비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
        re_passwordInput.focus();
        re_passwordInput.value = "";
        return;
    }

    // 약관 동의 체크 여부 확인
    if (!agreeCheckbox.checked) {
        alert("서비스 이용 약관에 동의해주세요.");
        return;
    }

    // 비밀번호 암호화
    const encryptedPassword = encrypt_text(passwordValue);

    // 암호화된 비밀번호로 회원 객체 생성
    const newUser = new SignUp(nameValue, emailValue, encryptedPassword);

    // 세션에 회원 정보 저장
    session_set2(newUser);

    alert("회원가입이 완료되었습니다! 메인 페이지로 이동합니다.");

    // 메인 페이지로 이동
    form.action = "../steam_main.html";
    form.method = "get";
    form.submit();
}

// 가입하기 버튼에 클릭 이벤트 리스너 등록
const joinSubmitButton = document.getElementById("join_btn");
if (joinSubmitButton) {
    joinSubmitButton.addEventListener('click', join);
} else {
    console.error("가입하기 버튼(join_btn)을 찾을 수 없습니다. HTML의 버튼 ID를 확인해주세요.");
}   