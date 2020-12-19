import React, { useState, useEffect } from "react";
import WaffleMarker from "./WaffleMarker/WaffleMarker";
import waffle_marker from "./img/waffle_marker.png";
const { kakao } = window;

const Map = ({ loc }) => {
    const [nowLoc, setNowLoc] = useState();
    useEffect(() => {
        if (loc) {
            mapscript();
        }
    }, [loc]);

    const mapscript = () => {
        var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

        var mapContainer = document.getElementById("map"), // 지도를 표시할 div
            mapOption = {
                center: new kakao.maps.LatLng(loc?.position[0], loc?.position[1]), // 지도의 중심좌표
                level: 3, // 지도의 확대 레벨
            };

        // 지도를 생성합니다
        var map = new kakao.maps.Map(mapContainer, mapOption);

        // 마우스 드래그로 지도 이동이 완료되었을 때 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
        kakao.maps.event.addListener(map, "dragend", function () {
            // 지도 중심좌표를 얻어옵니다
            var latlng = map.getCenter();

            var message = "변경된 지도 중심좌표는 " + latlng.getLat() + " 이고, ";
            message += "경도는 " + latlng.getLng() + " 입니다";

            console.log(message);
            setNowLoc([latlng.getLat(), latlng.getLng()]);
        });

        const ps = new kakao.maps.services.Places(map);
        var latlng = new kakao.maps.LatLng(loc.position[0], loc.position[1]);

        var latlng = map.getCenter();
        for (var i = 1; i <= 2; i++) {
            ps.keywordSearch("와플", placesSearchCB, {
                location: latlng,
                radius: 5000,
                page: i,
            });
        }
        function placesSearchCB(data, status, pagination) {
            if (status === kakao.maps.services.Status.OK) {
                let bounds = new kakao.maps.LatLngBounds();
                for (let i = 0; i < data.length; i++) {
                    displayMarker(data[i]);
                    bounds.extend(new kakao.maps.LatLng(latlng.getLat(), latlng.getLng()));
                }
                map.setBounds(bounds);
            }
        }

        // "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png"
        var imageSrc = waffle_marker, // 마커이미지의 주소입니다
            imageSize = new kakao.maps.Size(40, 49), // 마커이미지의 크기입니다
            imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
        function displayMarker(place) {
            let marker = new kakao.maps.Marker({
                map: map,
                position: new kakao.maps.LatLng(place.y, place.x),
                image: markerImage, // 마커이미지 설정
            });
            // var overlay = new kakao.maps.CustomOverlay({
            //     content: WaffleMarker,
            //     map: map,
            //     position: marker.getPosition(),
            // });
            // // 마커를 클릭했을 때 커스텀 오버레이를 표시합니다
            kakao.maps.event.addListener(marker, "click", function () {
                alert("Marker Click!");
                console.log(place);
            });
        }

        // 인포윈도우를 표시하는 클로저를 만드는 함수입니다
        function makeOverListener(map, marker, infowindow) {
            return function () {
                infowindow.open(map, marker);
            };
        }

        // 인포윈도우를 닫는 클로저를 만드는 함수입니다
        function makeOutListener(infowindow) {
            return function () {
                infowindow.close();
            };
        }
    };

    return <div id="map" style={{ width: "100vw", height: "100vh" }}></div>;
};

export default Map;
