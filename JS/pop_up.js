    function pop_up() {
        window.open("../popup/popup.html", "팝업테스트", "width=400, height=300, top=10, left=10");
    } // 여기서 ../을 하는 이유는 상위의 상위폴더에서 찾기 위해서이다!

    function show_clock(){
        let currentDate = new Date(); // 현재 시스템 날짜 객체 생성
        let divClock = document.getElementById('divClock');
        let msg = "현재 시간 : ";
        if(currentDate.getHours()>12){ // 12시 보다 크면 오후 아니면 오전
            msg += "오후";
            msg += currentDate.getHours()-12+"시";
            }
        else {
            msg += "오전";
            msg += currentDate.getHours()+"시";
            }
        msg += currentDate.getMinutes()+"분";
        msg += currentDate.getSeconds()+"초";
        divClock.innerText = msg;
        if (currentDate.getMinutes()>58) { //정각 1분전 빨강색 출력
            divClock.style.color="red";
            }
        setTimeout(show_clock, 1000); //1초마다 갱신

    }
    function over(obj) {
        obj.src="lol/lol title.png";
    }
    function out(obj) {
        obj.src="lol/lol title2.webp";
    }
    
    var close_time;
    var cloae_time2 = 10;
    cleartTimeout(cloae_time)
    close_time = setTimeout("close_window()", 10000)
    show_time()
    function show_time(){
        let divClock = document.getElementById('Time');
        divClock.innerText = close_time2; 
        close_time2--; 
        setTimeout(show_time, 1000); 
    }
    function close_window(){
        window.close();
    }

    




    // 화살표 함수
    // const over = (obj) => {
    //     obj.src = "image/LOGO.png";
    //     };