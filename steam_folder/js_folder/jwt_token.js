// JWT 비밀 키(운영 환경에서는 복잡한 키 사용 권장)
const JWT_SECRET = "your_secret_key_here";

// JWT 토큰을 생성하는 함수
export function generateJWT(payload) {
    // 헤더와 페이로드를 Base64로 인코딩
    const header = { alg: "HS256", typ: "JWT" };
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));
    // HMAC-SHA256으로 서명 생성 후 Base64 인코딩
    const signature = CryptoJS.HmacSHA256(`${encodedHeader}.${encodedPayload}`, JWT_SECRET);
    const encodedSignature = CryptoJS.enc.Base64.stringify(signature);
    // 최종 JWT 토큰 반환
    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

// JWT 토큰을 검증하는 함수
function verifyJWT(token) {
    try {
        // 토큰을 헤더, 페이로드, 서명으로 분리
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const [encodedHeader, encodedPayload, encodedSignature] = parts;
        // 서명을 재계산하여 비교
        const signature = CryptoJS.HmacSHA256(`${encodedHeader}.${encodedPayload}`, JWT_SECRET);
        const calculatedSignature = CryptoJS.enc.Base64.stringify(signature);
        if (calculatedSignature !== encodedSignature) return null;
        // 페이로드를 디코딩하여 만료 시간 확인
        const payload = JSON.parse(atob(encodedPayload));
        if (payload.exp < Math.floor(Date.now() / 1000)) {
            console.log('보안 토큰이 만료되었습니다');
            return null;
        }
        return payload;
    } catch (error) {
        return null;
    }
}

// JWT 토큰이 유효한지 인증 상태를 확인하는 함수
function isAuthenticated() {
    const token = localStorage.getItem('jwt_token');
    if (!token) return false;
    const payload = verifyJWT(token);
    console.log(payload);
    return !!payload;
}

// 인증 상태를 검사하고, 실패 시 로그인 페이지로 이동하는 함수
export function checkAuth() {
    const authenticated = isAuthenticated();
    if (authenticated) {
        alert('정상적으로 토큰이 검증되었습니다.');
    } else {
        alert('토큰 검증 에러!! 인증되지 않은 접근입니다.');
        window.location.href = '../login_folder/steam_login.html';
    }
}