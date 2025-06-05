import { session_get } from './steam_session.js';
import { decrypt_text } from './crypto.js';
import { checkAuth } from './jwt_token.js';

// 로그인 후 페이지 초기화 함수
function init_logined_for_index_page() {
    if (sessionStorage) {
        const encryptedData = session_get();
        if (encryptedData) {
            try {
                const decryptedData = decrypt_text(encryptedData);
                console.log("로그인 후 페이지 - 복호화된 데이터:", decryptedData);
            } catch (error) {
                console.error("데이터 복호화 중 오류 발생:", error);
            }
        }
    } else {
        alert("세션 스토리지를 지원하지 않습니다. 일부 기능이 제한될 수 있습니다.");
    }
}

// 로그아웃 버튼 클릭 시 세션 및 토큰 삭제 후 메인 페이지로 이동
const logoutButton = document.getElementById('logout_btn');
if (logoutButton) {
    function handleLogout() {
        if (sessionStorage) {
            sessionStorage.removeItem("Session_Storage_id");
            sessionStorage.removeItem("Session_Storage_object");
            sessionStorage.removeItem("Session_Storage_pass");
        }
        localStorage.removeItem('jwt_token');
        location.href = '../steam_main.html';
    }
    logoutButton.addEventListener('click', handleLogout);
}

// DOMContentLoaded 시 인증 확인 및 초기화
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) {
        return;
    }
    init_logined_for_index_page();
});