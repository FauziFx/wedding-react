import React from "react";
import Countdown from "react-countdown";
import dayjs from "dayjs";
import "dayjs/locale/id";
dayjs.locale("id");

function CountdownTimer({ date, time }) {
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return (
        <h1 className="text-xl md:text-3xl py-4 text-center col-span-4">
          Hari yang Dinanti Telah Tiba!
        </h1>
      );
    } else {
      // Render a countdown
      return (
        <>
          <div className="py-4 inline">
            <h2 className="text-xl md:text-3xl inline">{days}</h2>
            <span className="text-xs inline"> Hari</span>
          </div>
          <div className="py-4 inline">
            <h2 className="text-xl md:text-3xl inline">{hours}</h2>
            <span className="text-xs inline"> Jam</span>
          </div>
          <div className="py-4 inline">
            <h2 className="text-xl md:text-3xl inline">{minutes}</h2>
            <span className="text-xs inline"> Menit</span>
          </div>
          <div className="py-4 inline">
            <h2 className="text-xl md:text-3xl inline">{seconds}</h2>
            <span className="text-xs inline"> Detik</span>
          </div>
        </>
      );
    }
  };
  return (
    <Countdown
      date={dayjs(date).tz("Asia/Jakarta").format("YYYY-MM-DD") + "T" + time}
      renderer={renderer}
    />
  );
}

export default CountdownTimer;
