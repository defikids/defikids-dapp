"use client";

import { useAuthStore } from "@/store/auth/authStore";
import {
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Tooltip,
} from "@chakra-ui/react";
import { useState } from "react";
import shallow from "zustand/shallow";

export function BgOpacitySliderThumbWithTooltip({
  setBackgroundOpacity,
}: {
  setBackgroundOpacity: (v: number) => void;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);

  const { userDetails, setOpacity } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
      opacity: state.opacity,
      setOpacity: state.setOpacity,
    }),
    shallow
  );

  return (
    <Slider
      id="slider"
      defaultValue={(userDetails?.opacity?.background * 100 || 100) as number}
      min={0}
      max={100}
      colorScheme="teal"
      onChange={(v) => {
        setDisplayValue(v);

        // persist the opacity to the store
        setOpacity(v / 100);

        // set the temp opacity for the card or background
        setBackgroundOpacity(v / 100);
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <SliderMark value={25} mt="1" ml="-2.5" fontSize="sm">
        25%
      </SliderMark>
      <SliderMark value={50} mt="1" ml="-2.5" fontSize="sm">
        50%
      </SliderMark>
      <SliderMark value={75} mt="1" ml="-2.5" fontSize="sm">
        75%
      </SliderMark>
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <Tooltip
        hasArrow
        bg="teal.500"
        color="white"
        placement="top"
        isOpen={showTooltip}
        label={`${displayValue}%`}
      >
        <SliderThumb />
      </Tooltip>
    </Slider>
  );
}
