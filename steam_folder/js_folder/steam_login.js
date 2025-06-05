import { session_set, session_check } from './steam_session.js';
import { encrypt_text, decrypt_text } from './crypto.js';
import { generateJWT } from './jwt_token.js';

const MAX_LOGIN_ATTEMPTS = 3; // 최대 로그인 시도 횟수
const LOCKOUT_TIME = 4 * 60 * 1000; // 로그인 제한 시간(4분, ms)

// 페이지 초기화 및 쿠키/세션 체크
function init() {
    const emailInput = document.getElementById('typeEmailX');
    const idsave_check = document.getElementById('idSaveCheck');
    if (emailInput && idsave_check) {
        let get_id = getCookie("id");
        if (get_id) {
            emailInput.value = get_id;
            idsave_check.checked = true;
        }
    }
    session_check();
    displayLoginStatus();
}

// 로그인 후 페이지에서 복호화 등 처리
export function init_logined() {
    if (sessionStorage) {
        // 복호화 로직 필요
    } else {
        alert("세션 스토리지 지원 x");
    }
}

// 이메일 형식 검증
const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return emailRegex.test(email);
};

// 비밀번호 복잡성 검증
const validatePassword = (password) => {
    if (password.length <= 8 || password.length >= 15) {
        return { valid: false, message: '비밀번호는 8자 초과 15자 미만이어야 합니다.' };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: '비밀번호는 대문자를 1개 이상 포함해야 합니다.' };
    }
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: '비밀번호는 소문자를 1개 이상 포함해야 합니다.' };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: '비밀번호는 숫자를 1개 이상 포함해야 합니다.' };
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        return { valid: false, message: '비밀번호는 특수문자를 1개 이상 포함해야 합니다.' };
    }
    return { valid: true, message: '유효한 비밀번호입니다.' };
};

// 로그인 실패 처리 및 제한
function login_failed(reason = '') {
    let failCount = getCookie("login_fail_count");
    if (!failCount) failCount = 0;
    failCount = parseInt(failCount) + 1;
    setCookie("login_fail_count", failCount, 1);
    if (failCount >= MAX_LOGIN_ATTEMPTS) {
        let lockoutStartTime = new Date().getTime();
        setCookie("lockout_start_time", lockoutStartTime, 1);
        setCookie("login_locked", "true", 1);
        alert(`로그인 가능 횟수를 초과했습니다. 4분 간 로그인할 수 없습니다.\n현재 실패 횟수: ${failCount}회\n실패 사유: ${reason}`);
        displayLoginStatus();
        return true;
    } else {
        alert(`로그인에 실패했습니다.\n실패 사유: ${reason}\n남은 시도 횟수: ${MAX_LOGIN_ATTEMPTS - failCount}회`);
        displayLoginStatus();
        return false;
    }
}

// 로그인 제한 상태 확인
function checkLoginLock() {
    let isLocked = getCookie("login_locked");
    let lockoutStartTime = getCookie("lockout_start_time");
    if (isLocked === "true" && lockoutStartTime) {
        let currentTime = new Date().getTime();
        let elapsedTime = currentTime - parseInt(lockoutStartTime);
        if (elapsedTime < LOCKOUT_TIME) {
            let remainingTime = Math.ceil((LOCKOUT_TIME - elapsedTime) / 1000 / 60);
            alert(`로그인이 제한되었습니다. ${remainingTime}분 후에 다시 시도해주세요.`);
            return true;
        } else {
            setCookie("login_locked", "", -1);
            setCookie("lockout_start_time", "", -1);
            setCookie("login_fail_count", "", -1);
            displayLoginStatus();
            return false;
        }
    }
    return false;
}

// 로그인 성공 시 실패 카운트 초기화
function resetLoginFailCount() {
    setCookie("login_fail_count", "", -1);
    setCookie("login_locked", "", -1);
    setCookie("lockout_start_time", "", -1);
}

// 로그인 상태 표시
function displayLoginStatus() {
    let failCount = getCookie("login_fail_count");
    let isLocked = getCookie("login_locked");
    let lockoutStartTime = getCookie("lockout_start_time");
    let statusDiv = document.getElementById('login_status');
    if (!statusDiv) {
        statusDiv = document.createElement('div');
        statusDiv.id = 'login_status';
        statusDiv.style.marginTop = '15px';
        statusDiv.style.padding = '15px';
        statusDiv.style.borderRadius = '8px';
        statusDiv.style.fontSize = '14px';
        statusDiv.style.textAlign = 'center';
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

// XSS 방지(입력값 정화)
const check_xss = (input) => {
    const DOMPurify = window.DOMPurify;
    if (!DOMPurify) {
        return input;
    }
    const sanitizedInput = DOMPurify.sanitize(input);
    if (sanitizedInput !== input) {
        alert('XSS 공격 가능성이 있는 입력값을 발견했습니다.');
        return false;
    }
    return sanitizedInput;
};

// 로그인 입력값 유효성 검사 및 처리
const check_input = () => {
    if (checkLoginLock()) return false;
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
    const sanitizedEmail = check_xss(emailValue);
    const sanitizedPassword = check_xss(passwordValue);
    if (sanitizedEmail === false || sanitizedPassword === false) {
        if (login_failed('XSS 공격 의심 입력값 감지')) return false;
        return false;
    }
    if (emailValue === '') {
        alert('이메일을 입력하세요.');
        emailInput.focus();
        if (login_failed('이메일이 입력되지 않았습니다.')) return false;
        return false;
    }
    if (passwordValue === '') {
        alert('비밀번호를 입력하세요.');
        passwordInput.focus();
        if (login_failed('비밀번호가 입력되지 않았습니다.')) return false;
        return false;
    }
    if (!validateEmail(emailValue)) {
        alert('올바른 이메일 형식이 아닙니다.');
        emailInput.focus();
        if (login_failed('이메일 형식이 올바르지 않습니다.')) return false;
        return false;
    }
    const passwordValidation = validatePassword(passwordValue);
    if (!passwordValidation.valid) {
        alert(passwordValidation.message);
        passwordInput.focus();
        if (login_failed(passwordValidation.message)) return false;
        return false;
    }
    const repeatCharRegex = /(.)\1\1/;
    if (repeatCharRegex.test(emailValue)) {
        alert('이메일에 3회 이상 반복되는 문자를 사용할 수 없습니다.');
        emailInput.focus();
        if (login_failed('이메일에 3회 이상 반복 문자 사용')) return false;
        return false;
    }
    if (repeatCharRegex.test(passwordValue)) {
        alert('비밀번호에 3회 이상 반복되는 문자를 사용할 수 없습니다.');
        passwordInput.focus();
        if (login_failed('비밀번호에 3회 이상 반복 문자 사용')) return false;
        return false;
    }
    const repeatNumRegex = /(\d)\1\1/;
    if (repeatNumRegex.test(passwordValue)) {
        alert('비밀번호에 3회 이상 반복되는 숫자를 사용할 수 없습니다.');
        passwordInput.focus();
        if (login_failed('비밀번호에 3회 이상 반복 숫자 사용')) return false;
        return false;
    }
    resetLoginFailCount();
    displayLoginStatus();
    if (idsave_check.checked) {
        setCookie("id", emailValue, 7);
    } else {
        setCookie("id", "", 0);
    }
    const payloadForJwt = {
        id: emailValue,
        exp: Math.floor(Date.now() / 1000) + (60 * 60)
    };
    const jwtToken = generateJWT(payloadForJwt);
    localStorage.setItem('jwt_token', jwtToken);
    session_set();
    alert("로그인 성공! 메인 페이지로 이동합니다.");
    loginForm.submit();
    return true;
};

// 쿠키 설정
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
}

// 쿠키 값 가져오기
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}

// 로그인 버튼에 이벤트 리스너 등록
const loginButton = document.getElementById("login_btn");
if (loginButton) {
    loginButton.addEventListener('click', check_input);
} 

// 페이지 로드 시 초기화 및 상태 표시
document.addEventListener('DOMContentLoaded', () => {
    init();
    setInterval(displayLoginStatus, 60000);
});