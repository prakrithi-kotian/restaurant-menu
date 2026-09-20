"use client";

import React, { useEffect, useState } from "react";

interface CountdownProps {
  availableAt: string;
  onExpire?: () => void;
}

export function Countdown({ availableAt, onExpire }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({ minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    function calculateTime() {
      const targetTime = new Date(availableAt).getTime();
      const currentTime = new Date().getTime();
      const diffMs = targetTime - currentTime;

      if (diffMs <= 0) {
        setTimeLeft({ minutes: 0, seconds: 0, isExpired: true });
        if (onExpire) onExpire();
        return;
      }

      const minutes = Math.floor(diffMs / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      setTimeLeft({ minutes, seconds, isExpired: false });
    }

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [availableAt, onExpire]);

  if (timeLeft.isExpired) {
    return <span>Available now</span>;
  }

  if (timeLeft.minutes === 0) {
    return (
      <span>
        In {timeLeft.seconds}s
      </span>
    );
  }

  return (
    <span>
      Available in {timeLeft.minutes}m {timeLeft.seconds}s
    </span>
  );
}
