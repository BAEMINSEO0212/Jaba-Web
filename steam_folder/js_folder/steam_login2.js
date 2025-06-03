// js_folder/steam_login2.js
// 이 파일은 steam_index_login.html (로그인 후 페이지)에서 사용됩니다.

// 필요한 모듈 import
import { session_get } from './steam_session.js';    // 세션에서 데이터를 가져오는 함수 (Session_Storage_pass 용)
import { decrypt_text } from './crypto.js';         // 암호화된 데이터를 복호화하는 함수
import { checkAuth } from './jwt_token.js';         // JWT 토큰 기반 사용자 인증 상태 확인 함수
// import { logout } from './steam_session.js'; // 만약 steam_session.js에 logout 함수가 export 되어 있다면
                                             // 또는 logout 함수를 이 파일에 직접 정의

// (만약 이 페이지에서 이미지 호버, 팝업, 검색 등의 기능이 필요하다면 해당 JS 파일에서 함수 import)
// 예: import { over, out } from './steam_image_hover.js';
// 예: import { googleSearch } from './steam_search.js';


// 로그인 후 페이지를 위한 초기화 함수
function init_logined_for_index_page() {
    console.log("steam_login2.js - init_logined_for_index_page() 함수 실행");
    if (sessionStorage) {
        const encryptedData = session_get(); // session_get은 'Session_Storage_pass' 값을 반환하도록 되어 있음
        if (encryptedData) {
            try {
                const decryptedData = decrypt_text(encryptedData);
                console.log("로그인 후 페이지 - 복호화된 데이터:", decryptedData);
            } catch (error) {
                console.error("데이터 복호화 중 오류 발생:", error);
            }
        } else {
            console.log("세션에서 가져올 암호화된 데이터가 없습니다.");
        }
    } else {
        alert("세션 스토리지를 지원하지 않습니다. 일부 기능이 제한될 수 있습니다.");
    }
}

// (만약 steam_index_login.html의 로그아웃 버튼이 이 파일의 JS로 제어된다면)
// 로그아웃 버튼에 대한 이벤트 리스너 추가
const logoutButton = document.getElementById('logout_btn'); // HTML에 logout_btn ID가 있어야 함
if (logoutButton) {
    // logout 함수는 steam_session.js에서 import 하거나 여기에 직접 정의
    // 예시: import { logout } from './steam_session.js';
    // 또는 아래처럼 직접 정의
    function handleLogout() {
        console.log("로그아웃 버튼 클릭됨 (steam_login2.js)");
        // steam_session.js의 session_del()을 직접 호출하거나,
        // steam_session.js에서 export된 logout 함수를 호출
        // 예: import { session_del } from './steam_session.js';
        // session_del();
        // localStorage.removeItem('jwt_token'); // JWT 토큰도 삭제
        // location.href = '../steam_main.html'; // 메인 페이지로 이동

        // 만약 steam_session.js에 export된 logout 함수가 있다면:
        // import { logout } from './steam_session.js';
        // logout();
        // (위의 logout() 함수에는 localStorage.removeItem('jwt_token') 로직 추가 필요할 수 있음)

        // 임시로 여기에 로그아웃 로직 직접 작성 (실제로는 steam_session.js의 함수 사용 권장)
        if (sessionStorage) {
            sessionStorage.removeItem("Session_Storage_id");
            sessionStorage.removeItem("Session_Storage_object");
            sessionStorage.removeItem("Session_Storage_pass");
            console.log('세션 스토리지가 삭제되었습니다. (steam_login2.js)');
        }
        localStorage.removeItem('jwt_token');
        console.log('JWT 토큰이 삭제되었습니다. (steam_login2.js)');
        location.href = '../steam_main.html'; // 메인 페이지로 이동
    }
    logoutButton.addEventListener('click', handleLogout);
}


// DOM이 완전히 로드된 후 실행될 메인 로직
document.addEventListener('DOMContentLoaded', () => {
    console.log("steam_index_login.html - DOM 로드 완료 (steam_login2.js 실행)");

    // 1. 사용자 인증 상태 확인 (JWT 토큰 기반)
    // checkAuth() 함수는 인증 실패 시 자동으로 로그인 페이지로 리다이렉트 시킬 수 있음
    if (!checkAuth()) { // checkAuth가 boolean (인증 성공 여부)을 반환하고, 실패 시 리다이렉트 한다면
        // 이미 checkAuth 내부에서 리다이렉트 되었을 것이므로, 추가 작업이 필요 없을 수 있음
        // 또는, checkAuth가 리다이렉트 안 시키고 false만 반환한다면 여기서 명시적으로 리다이렉트
        // console.log("인증 실패, 로그인 페이지로 이동합니다.");
        // window.location.href = '../login_folder/steam_login.html'; // 경로 확인 필요
        return; // 인증 실패 시 더 이상 진행하지 않음
    }
    console.log("사용자 인증 성공 (steam_login2.js)");

    // 2. 로그인된 사용자를 위한 페이지 초기화 작업 수행
    init_logined_for_index_page();

    // 3. 이 페이지에서 필요한 다른 이벤트 리스너 등록 또는 초기화 코드 실행
    // 예: 이미지 호버 기능 초기화 (steam_image_hover.js에서 over, out 함수 import 가정)
    // const hoverImages = document.querySelectorAll('.some_hover_image_class');
    // hoverImages.forEach(img => {
    //     img.addEventListener('mouseover', function() { over(this); });
    //     img.addEventListener('mouseout', function() { out(this); });
    // });

    // 예: 검색 기능 초기화 (steam_search.js에서 googleSearch 함수 import 가정)
    // const searchForm = document.getElementById('some_search_form_id');
    // if (searchForm) {
    //     searchForm.addEventListener('submit', function(event) {
    //         event.preventDefault(); // 기본 폼 제출 방지
    //         if (googleSearch()) { // googleSearch가 boolean을 반환하며 새 창을 띄운다면
    //             // 성공 처리 (필요시)
    //         }
    //     });
    // }
});