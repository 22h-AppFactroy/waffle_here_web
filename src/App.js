import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import Map from "./Map";
const App = () => {
    const [loc, setLoc] = useState();
    useEffect(() => {
        const script = document.createElement("script");
        script.async = true;
        script.src =
            "https://dapi.kakao.com/v2/maps/sdk.js?appkey=3a52dc7347afcbfa5e9179ac1450da9f&libraries=services;";
        document.head.appendChild(script);
        var locData = JSON.parse(sessionStorage.getItem("loc"));
        if (locData?.position) {
            var p = locData?.position;
            setLoc({
                position: [parseFloat(p[0]), parseFloat(p[1])],
            });
        } else {
            navigator.geolocation.getCurrentPosition((p) => {
                // 아래 api 위도 경도가 조금 정확하지 않아서 html5 스펙인 geolocation 사용
                setLoc({
                    position: [p.coords.latitude, p.coords.longitude],
                });
            });
        }
    }, []);
    useEffect(() => {
        console.log(loc);
    }, [loc]);
    if (loc?.position) {
        return (
            <div className="App">
                <Map loc={loc} />
            </div>
        );
    } else {
        return <div className="App">No Locs</div>;
    }
};

export default App;
