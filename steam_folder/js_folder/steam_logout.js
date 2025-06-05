function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/; SameSite=Lax";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// 로그아웃 처리 및 로그아웃 횟수 카운트
function handleLogoutAndCount() {
    let logoutCount = getCookie("logout_cnt");
    if (logoutCount) {
        logoutCount = parseInt(logoutCount, 10) + 1;
    } else {
        logoutCount = 1;
    }
    setCookie("logout_cnt", logoutCount.toString(), 365);
    alert(`로그아웃 되었습니다. (총 ${logoutCount}회 로그아웃)`);

    if (sessionStorage) {
        sessionStorage.removeItem("Session_Storage_id");
        sessionStorage.removeItem("Session_Storage_object");
        sessionStorage.removeItem("Session_Storage_pass");
    }
    localStorage.removeItem('jwt_token');
    window.location.href = '../steam_main.html';
}

// DOMContentLoaded 시 로그아웃 버튼에 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', () => {
    const confirmLogoutButton = document.getElementById('confirm_logout_action_btn');
    if (confirmLogoutButton) {
        confirmLogoutButton.addEventListener('click', () => {
            handleLogoutAndCount();
        });
    }
});