import { encrypt_text } from './crypto.js';

// 로그인 시 입력값을 객체로 만들어 세션스토리지에 저장
export function session_set() {
    let id = document.querySelector("#typeEmailX");
    let password = document.querySelector("#typePasswordX");
    let random = new Date();
    const obj = {
        id: id.value,
        otp: random
    };
    if (sessionStorage) {
        const objString = JSON.stringify(obj);
        let en_text = encrypt_text(objString);
        sessionStorage.setItem("Session_Storage_id", id.value);
        sessionStorage.setItem("Session_Storage_object", objString);
        sessionStorage.setItem("Session_Storage_pass", en_text);
    } else {
        alert("세션 스토리지 지원 x");
    }
}

// 회원가입 시 객체를 받아 세션스토리지에 저장
export function session_set2(userObject) {
    if (sessionStorage) {
        const userObjectString = JSON.stringify(userObject);
        sessionStorage.setItem("Session_Storage_object", userObjectString);
        console.log("session_set2: 객체를 세션에 저장 - ", userObjectString);
    } else {
        alert("세션 스토리지 지원 x");
    }
}

// 세션스토리지에서 암호화된 데이터(비밀번호 등) 반환
export function session_get() {
    if (sessionStorage) {
        return sessionStorage.getItem("Session_Storage_pass");
    } else {
        alert("세션 스토리지 지원 x");
    }
}

// 이미 로그인된 상태인지 세션을 검사하고, 로그인 상태면 로그인된 페이지로 이동
export function session_check() {
    if (sessionStorage.getItem("Session_Storage_id")) {
        alert("이미 로그인 되었습니다.");
        location.href = '../login_folder/steam_index_login.html';
    }
}

// 세션스토리지의 로그인 관련 데이터 전체 삭제(로그아웃 처리)
export function session_del() {
    if (sessionStorage) {
        sessionStorage.removeItem("Session_Storage_id");
        sessionStorage.removeItem("Session_Storage_object");
        sessionStorage.removeItem("Session_Storage_pass");
        alert('로그아웃 버튼 클릭 확인 : 세션 스토리지를 삭제합니다.');
    } else {
        alert("세션 스토리지 지원 x");
    }
}