// AES256 방식으로 문자열을 암호화하는 함수
function encodeByAES256(key, data) {
    const cipher = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(""), // 초기화 벡터(IV)는 빈 문자열로 설정
        padding: CryptoJS.pad.Pkcs7,     // PKCS7 패딩 방식 사용
        mode: CryptoJS.mode.CBC          // CBC(암호 블록 체인) 모드 사용
    });
    return cipher.toString();
}

// AES256 방식으로 암호화된 문자열을 복호화하는 함수
function decodeByAES256(key, data) {
    const cipher = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(""), // 초기화 벡터(IV)는 빈 문자열로 설정
        padding: CryptoJS.pad.Pkcs7,     // PKCS7 패딩 방식 사용
        mode: CryptoJS.mode.CBC          // CBC(암호 블록 체인) 모드 사용
    });
    return cipher.toString(CryptoJS.enc.Utf8);
}

// 입력받은 비밀번호를 AES256 방식으로 암호화하여 반환하는 함수
export function encrypt_text(password) {
    const k = "key";                  // 암호화에 사용할 기본 키
    const rk = k.padEnd(32, " ");     // AES256은 32바이트 키가 필요하므로 길이 맞춤
    const eb = encodeByAES256(rk, password); // 암호화 수행
    console.log(eb);                  // 암호화된 결과 콘솔 출력
    return eb;                        // 암호화된 문자열 반환
}

// 세션에서 암호화된 값을 가져와 복호화하여 반환하는 함수
export function decrypt_text() {
    const k = "key";                  // 복호화에 사용할 기본 키
    const rk = k.padEnd(32, " ");     // AES256은 32바이트 키가 필요하므로 길이 맞춤
    const eb = session_get();         // 세션에서 암호화된 값 가져오기 (session_get 함수 필요)
    const b = decodeByAES256(rk, eb); // 복호화 수행
    console.log(b);                   // 복호화된 결과 콘솔 출력
}