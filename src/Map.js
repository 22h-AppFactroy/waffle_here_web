// /*global kakao*/
import React, { useState, useEffect, useRef } from "react";
import WaffleMarker from "./WaffleMarker/WaffleMarker";
import waffle_marker from "./img/waffle_marker.png";
const { kakao } = window;

const Map = ({ loc, setLoc }) => {
    var mapCircle;
    const [state, setState] = useState();
    const myMap = React.useRef(state);
    const setMyMap = (data) => {
        myMap.current = data;
        setState(data);
    };

    useEffect(() => {
        if (loc) {
            mapscript();
        }
    }, [loc]);
    useEffect(() => {
        window.addEventListener(
            "message",
            function (event) {
                switch (event.data) {
                    case "REFRESH":
                        refereshLocation();
                        break;
                    case "GOBACK":
                        break;
                    case "GOFRONT":

                    default:
                }
            },
            false
        );
        document.addEventListener(
            "message",
            function (event) {
                switch (event.data) {
                    case "REFRESH":
                        refereshLocation();
                        break;
                    case "GOBACK":
                        break;
                    case "GOFRONT":

                    default:
                }
            },
            false
        );
    }, []);

    const refereshLocation = () => {
        var map = myMap.current.map;
        var latlng = myMap.current.map.getCenter();
        console.log(map.getLevel());
        var newLoc = [latlng.getLat(), latlng.getLng()];
        findWaffle(newLoc);
        drawCircle(newLoc);
        map.setCenter(newLoc);
        map.setLevel(map.getLevel());
    };

    const drawCircle = (locs) => {
        var map = myMap?.current?.map;
        if (mapCircle) {
            mapCircle?.setMap(null);
        }
        // 지도에 표시할 원을 생성합니다
        var circle = new kakao.maps.Circle({
            center: new kakao.maps.LatLng(locs[0], locs[1]), // 원의 중심좌표 입니다
            radius: 2000, // 미터 단위의 원의 반지름입니다
            strokeWeight: 5, // 선의 두께입니다
            strokeColor: "red", // 선의 색깔입니다
            strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            strokeStyle: "dashed", // 선의 스타일 입니다
            fillColor: "#FFEFD5", // 채우기 색깔입니다
            fillOpacity: 0.2, // 채우기 불투명도 입니다
        });

        // 지도에 원을 표시합니다
        circle.setMap(map);
        mapCircle = circle;
    };

    const findWaffle = (searchLoc) => {
        var map = myMap?.current?.map;
        const ps = new kakao.maps.services.Places(map);
        var latlng = new kakao.maps.LatLng(searchLoc[0], searchLoc[1]);
        for (var i = 1; i <= 2; i++) {
            ps.keywordSearch("와플", placesSearchCB, {
                location: latlng,
                radius: 2000,
                page: i,
            });
        }
        function placesSearchCB(data, status, pagination) {
            if (status === kakao.maps.services.Status.OK) {
                let bounds = new kakao.maps.LatLngBounds();
                for (let i = 0; i < data.length; i++) {
                    console.log("와플 찍기!");
                    displayMarker(data[i]);
                    bounds.extend(new kakao.maps.LatLng(latlng.getLat(), latlng.getLng()));
                }
                // map.setBounds(bounds);
            }
        }

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
            kakao.maps.event.addListener(marker, "click", function () {
                if (window.ReactNativeWebView) {
                    var postData = place;
                    window.ReactNativeWebView.postMessage(JSON.stringify(postData));
                }
                console.log(JSON.stringify(postMessage));
            });
        }
    };

    const mapscript = () => {
        var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
        var mapContainer = document.getElementById("map"), // 지도를 표시할 div
            mapOption = {
                center: new kakao.maps.LatLng(loc?.position[0], loc?.position[1]), // 지도의 중심좌표
                level: 3, // 지도의 확대 레벨
            };
        // 지도를 생성합니다
        var map = new kakao.maps.Map(mapContainer, mapOption);
        setMyMap({
            map: map,
            infowindow: infowindow,
        });

        // findWaffle(loc.position);
        // drawCircle(loc.position);
    };

    return (
        <>
            <div id="map" style={{ width: "100vw", height: "100vh" }}></div>
        </>
    );
};

export default Map;
