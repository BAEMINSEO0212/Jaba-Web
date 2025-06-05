function googleSearch() {
    const searchInput = document.getElementById("search_input");
    const searchTerm = searchInput.value.trim();

    if (searchTerm === "") {
        alert("검색어를 입력해주세요.");
        searchInput.focus();
        return false;
    }

    const badWords = ["바보", "병신", "시발", "멍청이", "쓰레기", "나쁜놈", "개자식", "개새끼", "좆같은", "좆", "씨발", "개새끼", "개새끼들", "개새끼야", "씨발놈", "씨발년", "씨발새끼"];
    const searchTermLower = searchTerm.toLowerCase();

    for (let i = 0; i < badWords.length; i++) {
        if (searchTermLower.includes(badWords[i])) {
            alert(`"${badWords[i]}"와(과) 같은 부적절한 단어는 검색할 수 없습니다.`);
            searchInput.value = "";
            searchInput.focus();
            return false;
        }
    }

    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
    window.open(googleSearchUrl, "_blank");
    return false;
}