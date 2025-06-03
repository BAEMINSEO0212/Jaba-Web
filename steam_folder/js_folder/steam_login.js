// js_folder/steam_login.js

// 필요한 모듈 import
import { session_set, session_check } from './steam_session.js';
import { encrypt_text, decrypt_text } from './crypto.js';
import { generateJWT } from './jwt_token.js';

// 로그인 제한 관련 상수
const MAX_LOGIN_ATTEMPTS = 3;
const LOCKOUT_TIME = 4 * 60 * 1000; // 4분 (밀리초)

// 페이지 로드 시 아이디 저장 쿠키 확인 및 세션 체크
function init() {
    console.log("steam_login.js - init() 함수 실행");
    const emailInput = document.getElementById('typeEmailX');
    const idsave_check = document.getElementById('idSaveCheck');
    if (emailInput && idsave_check) {
        let get_id = getCookie("id");
        if (get_id) {
            emailInput.value = get_id;
            idsave_check.checked = true;
        }
    } else {
        console.warn("init(): 이메일 입력 필드 또는 아이디 저장 체크박스를 찾을 수 없습니다.");
    }
    session_check();
    displayLoginStatus(); // 로그인 상태 표시
}

// 로그인 후 페이지에서 사용될 함수
export function init_logined() {
    console.log("steam_login.js - init_logined() 함수 실행");
    if (sessionStorage) {
        console.log("init_logined: 복호화 로직 필요 (현재는 decrypt_text()만 호출)");
    } else {
        alert("세션 스토리지 지원 x");
    }
}

// 이메일 형식 검증 함수
const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return emailRegex.test(email);
};

// 비밀번호 복잡성 검증 함수
const validatePassword = (password) => {
    // 길이 체크 (8자 초과, 15자 미만)
    if (password.length <= 8 || password.length >= 15) {
        return {
            valid: false,
            message: '비밀번호는 8자 초과 15자 미만이어야 합니다.'
        };
    }
    
    // 대문자 체크
    const hasUpperCase = /[A-Z]/.test(password);
    if (!hasUpperCase) {
        return {
            valid: false,
            message: '비밀번호는 대문자를 1개 이상 포함해야 합니다.'
        };
    }
    
    // 소문자 체크
    const hasLowerCase = /[a-z]/.test(password);
    if (!hasLowerCase) {
        return {
            valid: false,
            message: '비밀번호는 소문자를 1개 이상 포함해야 합니다.'
        };
    }
    
    // 숫자 체크
    const hasNumber = /[0-9]/.test(password);
    if (!hasNumber) {
        return {
            valid: false,
            message: '비밀번호는 숫자를 1개 이상 포함해야 합니다.'
        };
    }
    
    // 특수문자 체크
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    if (!hasSpecialChar) {
        return {
            valid: false,
            message: '비밀번호는 특수문자를 1개 이상 포함해야 합니다.'
        };
    }
    
    return {
        valid: true,
        message: '유효한 비밀번호입니다.'
    };
};

// 로그인 실패 처리 함수
function login_failed(reason = '') {
    let failCount = getCookie("login_fail_count");
    if (!failCount) {
        failCount = 0;
    }
    failCount = parseInt(failCount) + 1;
    
    setCookie("login_fail_count", failCount, 1); // 1일 저장
    
    if (failCount >= MAX_LOGIN_ATTEMPTS) {
        // 로그인 제한 시작 시간 저장
        let lockoutStartTime = new Date().getTime();
        setCookie("lockout_start_time", lockoutStartTime, 1);
        setCookie("login_locked", "true", 1);
        
        alert(`로그인 가능 횟수를 초과했습니다. 4분 간 로그인할 수 없습니다.\n현재 실패 횟수: ${failCount}회\n실패 사유: ${reason}`);
        displayLoginStatus();
        return true; // 로그인 제한됨
    } else {
        alert(`로그인에 실패했습니다.\n실패 사유: ${reason}\n남은 시도 횟수: ${MAX_LOGIN_ATTEMPTS - failCount}회`);
        displayLoginStatus();
        return false; // 아직 로그인 가능
    }
}

// 로그인 제한 상태 확인 함수
function checkLoginLock() {
    let isLocked = getCookie("login_locked");
    let lockoutStartTime = getCookie("lockout_start_time");
    
    if (isLocked === "true" && lockoutStartTime) {
        let currentTime = new Date().getTime();
        let elapsedTime = currentTime - parseInt(lockoutStartTime);
        
        if (elapsedTime < LOCKOUT_TIME) {
            let remainingTime = Math.ceil((LOCKOUT_TIME - elapsedTime) / 1000 / 60);
            alert(`로그인이 제한되었습니다. ${remainingTime}분 후에 다시 시도해주세요.`);
            return true; // 여전히 제한됨
        } else {
            // 제한 시간이 지났으므로 제한 해제
            setCookie("login_locked", "", -1);
            setCookie("lockout_start_time", "", -1);
            setCookie("login_fail_count", "", -1);
            displayLoginStatus();
            return false; // 제한 해제됨
        }
    }
    return false; // 제한되지 않음
}

// 로그인 성공 시 실패 카운트 초기화
function resetLoginFailCount() {
    setCookie("login_fail_count", "", -1);
    setCookie("login_locked", "", -1);
    setCookie("lockout_start_time", "", -1);
}

// 로그인 상태 표시 함수
function displayLoginStatus() {
    let failCount = getCookie("login_fail_count");
    let isLocked = getCookie("login_locked");
    let lockoutStartTime = getCookie("lockout_start_time");
    
    // 상태 표시를 위한 div 요소 생성 (없다면)
    let statusDiv = document.getElementById('login_status');
    if (!statusDiv) {
        statusDiv = document.createElement('div');
        statusDiv.id = 'login_status';
        statusDiv.style.marginTop = '15px';
        statusDiv.style.padding = '15px';
        statusDiv.style.borderRadius = '8px';
        statusDiv.style.fontSize = '14px';
        statusDiv.style.textAlign = 'center';
        
        // 로그인 폼 아래에 추가
        const loginForm = document.getElementById('login_form');
        if (loginForm) {
            loginForm.parentNode.insertBefore(statusDiv, loginForm.nextSibling);
        }
    }
    
    if (isLocked === "true" && lockoutStartTime) {
        let currentTime = new Date().getTime();
        let elapsedTime = currentTime - parseInt(lockoutStartTime);
        
        if (elapsedTime < LOCKOUT_TIME) {
            let remainingTime = Math.ceil((LOCKOUT_TIME - elapsedTime) / 1000 / 60);
            statusDiv.innerHTML = `
                <div style="color: #fff; background-color: #dc3545; padding: 12px; border-radius: 6px; border: 2px solid #721c24;">
                    <strong>🚫 로그인 제한</strong><br>
                    ${remainingTime}분 후에 다시 시도해주세요.<br>
                    <small>실패 횟수: ${failCount || 0}회</small>
                </div>
            `;
        } else {
            statusDiv.innerHTML = '';
        }
    } else if (failCount && parseInt(failCount) > 0) {
        let remaining = MAX_LOGIN_ATTEMPTS - parseInt(failCount);
        if (remaining > 0) {
            statusDiv.innerHTML = `
                <div style="color: #fff; background-color: #fd7e14; padding: 12px; border-radius: 6px; border: 2px solid #d63384;">
                    <strong>⚠️ 로그인 실패 경고</strong><br>
                    실패 횟수: ${failCount}회<br>
                    남은 시도 횟수: ${remaining}회
                </div>
            `;
        }
    } else {
        statusDiv.innerHTML = '';
    }
}

// XSS 방지 함수
const check_xss = (input) => {
    const DOMPurify = window.DOMPurify;
    if (!DOMPurify) {
        console.warn("DOMPurify 라이브러리가 로드되지 않았습니다. XSS 방지 기능이 동작하지 않을 수 있습니다.");
        return input;
    }
    const sanitizedInput = DOMPurify.sanitize(input);
    if (sanitizedInput !== input) {
        alert('XSS 공격 가능성이 있는 입력값을 발견했습니다.');
        return false;
    }
    return sanitizedInput;
};

// 로그인 입력값 유효성 검사 및 처리 함수 (수정된 버전)
const check_input = () => {
    console.log("check_input 함수 시작");
    
    // 먼저 로그인 제한 상태 확인
    if (checkLoginLock()) {
        return false;
    }

    const loginForm = document.getElementById('login_form');
    const emailInput = document.getElementById('typeEmailX');
    const passwordInput = document.getElementById('typePasswordX');
    const idsave_check = document.getElementById('idSaveCheck');

    if (!loginForm || !emailInput || !passwordInput || !idsave_check) {
        alert("로그인 폼의 일부 요소를 찾을 수 없습니다. HTML을 확인해주세요.");
        return false;
    }

    alert('아이디, 패스워드를 체크합니다');

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value;

    // 1. XSS 방지 (Sanitize)
    const sanitizedEmail = check_xss(emailValue);
    const sanitizedPassword = check_xss(passwordValue);

    if (sanitizedEmail === false || sanitizedPassword === false) {
        console.log("XSS 의심으로 처리 중단");
        if (login_failed('XSS 공격 의심 입력값 감지')) {
            return false;
        }
        return false;
    }

    // 2. 필수 입력 검사
    if (emailValue === '') {
        alert('이메일을 입력하세요.');
        emailInput.focus();
        if (login_failed('이메일이 입력되지 않았습니다.')) {
            return false;
        }
        return false;
    }
    
    if (passwordValue === '') {
        alert('비밀번호를 입력하세요.');
        passwordInput.focus();
        if (login_failed('비밀번호가 입력되지 않았습니다.')) {
            return false;
        }
        return false;
    }

    // 3. 이메일 형식 검증
    if (!validateEmail(emailValue)) {
        alert('올바른 이메일 형식이 아닙니다.');
        emailInput.focus();
        if (login_failed('이메일 형식이 올바르지 않습니다.')) {
            return false;
        }
        return false;
    }

    // 4. 비밀번호 복잡성 검증
    const passwordValidation = validatePassword(passwordValue);
    if (!passwordValidation.valid) {
        alert(passwordValidation.message);
        passwordInput.focus();
        if (login_failed(passwordValidation.message)) {
            return false;
        }
        return false;
    }

    // 5. 기존 반복 문자 검사 유지
    const repeatCharRegex = /(.)\1\1/;
    if (repeatCharRegex.test(emailValue)) {
        alert('이메일에 3회 이상 반복되는 문자를 사용할 수 없습니다.');
        emailInput.focus();
        if (login_failed('이메일에 3회 이상 반복 문자 사용')) {
            return false;
        }
        return false;
    }
    
    if (repeatCharRegex.test(passwordValue)) {
        alert('비밀번호에 3회 이상 반복되는 문자를 사용할 수 없습니다.');
        passwordInput.focus();
        if (login_failed('비밀번호에 3회 이상 반복 문자 사용')) {
            return false;
        }
        return false;
    }

    const repeatNumRegex = /(\d)\1\1/;
    if (repeatNumRegex.test(passwordValue)) {
        alert('비밀번호에 3회 이상 반복되는 숫자를 사용할 수 없습니다.');
        passwordInput.focus();
        if (login_failed('비밀번호에 3회 이상 반복 숫자 사용')) {
            return false;
        }
        return false;
    }

    // 모든 유효성 검사 통과 - 로그인 성공
    resetLoginFailCount(); // 실패 카운트 초기화
    displayLoginStatus(); // 상태 업데이트
    
    console.log("모든 유효성 검사 통과!");
    console.log('이메일:', emailValue);
    console.log('원본 비밀번호 (암호화 전):', passwordValue);

    // 아이디 저장 쿠키 처리
    if (idsave_check.checked) {
        console.log("쿠키를 저장합니다:", emailValue);
        setCookie("id", emailValue, 7);
    } else {
        console.log("아이디 저장 쿠키를 삭제하거나 생성하지 않습니다.");
        setCookie("id", "", 0);
    }

    // 세션 생성
    const payloadForJwt = {
        id: emailValue,
        exp: Math.floor(Date.now() / 1000) + (60 * 60)
    };
    const jwtToken = generateJWT(payloadForJwt);
    localStorage.setItem('jwt_token', jwtToken);

    session_set();

    console.log("세션 및 JWT 토큰 저장 완료");

    alert("로그인 성공! 메인 페이지로 이동합니다.");
    loginForm.submit();
    return true;
};

// 쿠키 설정 함수
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
    console.log(`쿠키 설정: ${name}=${value}, 만료일: ${days}일 후`);
}

// 쿠키 가져오는 함수
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
            console.log(`쿠키 값 (${name}) 가져옴: ${c.substring(nameEQ.length, c.length)}`);
            return c.substring(nameEQ.length, c.length);
        }
    }
    console.log(`쿠키 (${name}) 없음`);
    return null;
}

// 로그인 버튼에 이벤트 리스너 등록
const loginButton = document.getElementById("login_btn");
if (loginButton) {
    loginButton.addEventListener('click', check_input);
    console.log("로그인 버튼에 클릭 이벤트 리스너 등록 완료");
} else {
    console.error("로그인 버튼(login_btn)을 HTML에서 찾을 수 없습니다.");
}

// 페이지 로드 시 init 함수 실행
document.addEventListener('DOMContentLoaded', () => {
    console.log("steam_login.html - DOM 로드 완료 (steam_login.js 실행)");
    init();
    
    // 1분마다 상태 업데이트
    setInterval(displayLoginStatus, 60000);
});