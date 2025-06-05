// 지도 영역을 가져와서 지도 객체를 생성
var container = document.getElementById('map');
var options = {
    center: new kakao.maps.LatLng(37.38028587259246, 126.92762494494222), // 지도 중심 좌표
    level: 3 // 지도 확대/축소 레벨
};
var map = new kakao.maps.Map(container, options);

// 지도 타입(일반/스카이뷰) 컨트롤을 우측 상단에 추가
var mapTypeControl = new kakao.maps.MapTypeControl();
map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

// 지도 확대/축소 컨트롤을 우측에 추가
var zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

// 초기 마커 위치를 지정하고 지도에 표시
var markerPosition = new kakao.maps.LatLng(37.38028587259246, 126.92762494494222);
var marker = new kakao.maps.Marker({
    position: markerPosition
});
marker.setMap(map);

// 지도 클릭 시 마커를 클릭 위치로 이동시키고, 위도/경도 정보를 화면에 표시
kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
    var latlng = mouseEvent.latLng;
    marker.setPosition(latlng);
    var message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고, ';
    message += '경도는 ' + latlng.getLng() + ' 입니다';
    var resultDiv = document.getElementById('clickLatlng');
    resultDiv.innerHTML = message;
});