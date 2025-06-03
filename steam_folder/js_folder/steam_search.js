function googleSearch() {
    console.log("googleSearch 함수 실행됨"); // 실행 확인용 로그

    const searchInput = document.getElementById("search_input"); // input 요소 자체를 가져옴
    const searchTerm = searchInput.value.trim(); // 입력값 가져와서 앞뒤 공백 제거

    // 1. 공백 검사 (입력값이 비어있는지 확인)
    if (searchTerm === "") {
        alert("검색어를 입력해주세요.");
        searchInput.focus(); // 검색창에 다시 포커스
        return false; // 폼 제출을 막고 함수 종료
    }

    // 2. 비속어 검사
    // 비속어 목록 (실제로는 더 많은 단어를 포함해야 합니다. 예시입니다.)
    const badWords = ["바보", "멍청이", "쓰레기", "나쁜놈", "개자식", "비속어"]; // 5개 이상으로 구성
    // 사용자가 입력한 검색어를 소문자로 변환하여 검사 (대소문자 구분 없이)
    const searchTermLower = searchTerm.toLowerCase();

    for (let i = 0; i < badWords.length; i++) {
        if (searchTermLower.includes(badWords[i])) {
            alert(`"${badWords[i]}"와(과) 같은 부적절한 단어는 검색할 수 없습니다.`);
            searchInput.value = ""; // 검색창 내용 비우기
            searchInput.focus(); // 검색창에 다시 포커스
            return false; // 폼 제출을 막고 함수 종료
        }
    }

    // 모든 유효성 검사 통과 시 구글 검색 실행
    console.log("유효성 검사 통과, 검색어:", searchTerm);
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
    window.open(googleSearchUrl, "_blank"); // 새 창에서 구글 검색 결과 표시

    // HTML form의 onsubmit에서 호출될 경우, false를 반환하여 현재 페이지에서 폼이 실제로 제출되는 것을 방지
    return false;
}

