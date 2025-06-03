function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/; SameSite=Lax"; // SameSite=Lax 기본 권장
    // 로컬 테스트 환경(http)에서는 Secure 속성 사용 시 쿠키 저장 안 될 수 있음
    // 실제 HTTPS 환경에서는 "; Secure" 추가 권장:
    // document.cookie = name + "=" + (value || "")  + expires + "; path=/; SameSite=None; Secure";
    console.log("쿠키 설정:", name, value, days);
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    console.log("쿠키 가져오기 - 해당 이름 없음:", name);
    return null;
}

// 로그아웃 횟수 카운팅 및 실제 로그아웃 처리 함수
function handleLogoutAndCount() {
    console.log("로그아웃 처리 및 횟수 카운팅 시작");

    // 1. 로그아웃 횟수 쿠키 가져오기
    let logoutCount = getCookie("logout_cnt");
    if (logoutCount) {
        logoutCount = parseInt(logoutCount, 10) + 1;
    } else {
        logoutCount = 1;
    }
    // 2. 새로운 로그아웃 횟수 쿠키에 저장 (예: 365일간 유지)
    setCookie("logout_cnt", logoutCount.toString(), 365);
    console.log("현재 로그아웃 횟수:", logoutCount);
    alert(`로그아웃 되었습니다. (총 ${logoutCount}회 로그아웃)`); // 사용자에게 횟수 알림 (선택 사항)

    // 3. 세션 스토리지 클리어 (기존 session_del 로직과 유사)
    if (sessionStorage) {
        sessionStorage.removeItem("Session_Storage_id");
        sessionStorage.removeItem("Session_Storage_object");
        sessionStorage.removeItem("Session_Storage_pass");
        console.log('세션 스토리지가 삭제되었습니다.');
    }

    // 4. 로컬 스토리지 JWT 토큰 삭제
    localStorage.removeItem('jwt_token');
    console.log('JWT 토큰이 삭제되었습니다.');

    // 5. 로그인 전 메인 페이지로 리다이렉트
    window.location.href = '../steam_main.html';
}

// DOM이 로드된 후 "로그아웃" 버튼에 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', () => {
    const confirmLogoutButton = document.getElementById('confirm_logout_action_btn');

    if (confirmLogoutButton) {
        confirmLogoutButton.addEventListener('click', () => {
            handleLogoutAndCount();
        });
        console.log("로그아웃 버튼에 이벤트 리스너 등록 완료.");
    } else {
        console.error("로그아웃 버튼(confirm_logout_action_btn)을 찾을 수 없습니다.");
    }
});