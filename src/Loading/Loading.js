import React, { useState, useEffect } from "react";
import "./Loading.css";
import waffle from "./../img/waffle_marker.png";
const Loading = () => {
    return (
        <div className="loading-wrapper">
            <div className="text-div">
                <span>근처의 와플을 찾는 중이에요!</span>
                <label>조금만 기다려주세요!</label>
            </div>
            <div className="loading">
                <img src={waffle} />
            </div>
        </div>
    );
};

export default Loading;
