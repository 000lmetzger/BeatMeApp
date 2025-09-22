import React, { useState, useRef, useEffect } from "react";
import { AppBar, Tabs, Tab, Box } from "@mui/material";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import Voting from "../pages/Voting";
import Challenge from "../pages/Challenge";
import Ranking from "../pages/Ranking";

export default function GroupTabs() {
    const [index, setIndex] = useState(1);
    const swiperRef = useRef(null);

    const handleTabChange = (event, newValue) => {
        setIndex(newValue);
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slideTo(newValue);
        }
    };

    return (
        <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <Box sx={{ flex: 1, mb: "56px" }}>
                <Swiper
                    ref={swiperRef}
                    style={{ height: "100%" }}
                    onSlideChange={(swiper) => setIndex(swiper.activeIndex)}
                    spaceBetween={50}
                    slidesPerView={1}
                >
                    <SwiperSlide>
                        <Box sx={{ height: "100%", backgroundColor: "red" }}>
                            <Voting />
                        </Box>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Box sx={{ height: "100%", backgroundColor: "green" }}>
                            <Challenge />
                        </Box>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Box sx={{ height: "100%", backgroundColor: "orange" }}>
                            <Ranking />
                        </Box>
                    </SwiperSlide>
                </Swiper>
            </Box>

            <AppBar position="fixed" color="default" sx={{ top: 'auto', bottom: 0 }}>
                <Tabs
                    value={index}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab label="Voting" />
                    <Tab label="Challenge" />
                    <Tab label="Ranking" />
                </Tabs>
            </AppBar>
        </Box>
    );
}
