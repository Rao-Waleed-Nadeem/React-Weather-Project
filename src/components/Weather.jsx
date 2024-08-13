import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Search } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";

function Weather() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [currentDay, setCurrentDay] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [cityName, setCityName] = useState("");
  const [loading, setLoading] = useState(false);
  const [timezone, setTimezone] = useState(0);
  let Blue = false;
  let Gray = false;
  const search = (city) => {
    setLoading(true);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${
      import.meta.env.VITE_APP_ID
    }`;
    Gray = false;
    Blue = false;
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
        setTimezone(data.timezone);
        setError("");
        console.log(data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching data: " + error.message);
        setData("");
        setLoading(false);
      });
  };

  const updateTime = () => {
    const date = new Date();
    const localDate = new Date(date.getTime() + timezone * 1000);
    const hours = localDate.getUTCHours();
    const minutes = localDate.getUTCMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    const minutesPadded = minutes.toString().padStart(2, "0");

    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const monthsOfYear = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const currentDay = daysOfWeek[localDate.getUTCDay()];
    const currentMonth = monthsOfYear[localDate.getUTCMonth()];
    const currentDate = `${currentDay}, ${currentMonth} ${localDate.getUTCDate()}`;

    setCurrentTime(`${hours12}:${minutesPadded} ${ampm}`);
    setCurrentDay(currentDay);
    setCurrentDate(currentDate);
  };

  useEffect(() => {
    updateTime();
    const intervalId = setInterval(updateTime, 60000); // Update time every minute
    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [timezone]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cityName) {
      search(cityName);
      setCityName("");
    } else {
      setError("Please enter a city name");
    }
  };

  const isDayTime = () => {
    const date = new Date();
    const localDate = new Date(date.getTime() + timezone * 1000);
    const hours = localDate.getHours();
    return hours >= 6 && hours < 18;
  };

  let backgroundImage = "home.jpg"; // Default background image
  if (data) {
    switch (data.weather[0].description) {
      case "smoke":
        backgroundImage = "smoke-img.jpg";
        Blue = false;
        Gray = true;
        break;
      case "light rain":
      case "moderate rain":
        backgroundImage = !isDayTime() ? "rain-img.jpg" : "night-rain-img.jpg";
        Blue = false;
        Gray = true;
        break;
      case "haze":
        Blue = false;
        Gray = true;
        backgroundImage = "haze-img.jpg";
        break;
      case "clear sky":
        backgroundImage = !isDayTime() ? "clear-sky-img.jpg" : "night-img.jpg";
        Blue = !isDayTime ? true : false;
        Gray = false;
        break;
      case "mostly sunny":
        backgroundImage = !isDayTime()
          ? "mostly-sunny-img.jpg"
          : "night-img.jpg";
        Blue = false;
        Gray = false;
        break;
      case "clouds":
      case "broken clouds":
        backgroundImage = !isDayTime()
          ? "clouds-img.jpg"
          : "night-cloud-img.jpg";
        Blue = false;
        Gray = true;
        break;
      default:
        break;
    }
  }

  return (
    <div
      style={{
        backgroundImage: `url('/${backgroundImage}')`,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        transition: "background-image 0.5s ease-in-out",
      }}
      className="w-screen bg-cover bg-gray-600 h-screen flex flex-col items-center justify-center text-white"
    >
      <div className="w-1/3 h-2/3 backdrop-blur-xl rounded-3xl px-6 flex flex-col items-center ">
        <div className="text-center mb-4 mt-10">
          <p>{currentDate}</p>
          <p>{currentTime}</p>
        </div>
        <form onSubmit={handleSubmit} className="mb-4 flex">
          <input
            type="text"
            value={cityName}
            onChange={(e) => {
              setCityName(e.target.value);
              setLoading(true);
            }}
            name="search"
            id="search"
            className={` ${
              Blue ? "text-cyan-950" : "text-white"
            }  p-2 rounded mr-4  placeholder-slate-300 
             
            ${
              Gray
                ? "bg-gradient-to-r from-neutral-500 to-neutral-400"
                : "bg-gradient-to-r from-sky-500 to-blue-400"
            } outline-none border-sky-800`}
            placeholder="Enter city name"
          />
          {Gray ? (
            <Button
              type="submit"
              variant="contained"
              style={{ backgroundColor: "gray" }}
              endIcon={<Search />}
            >
              Search
            </Button>
          ) : (
            <Button type="submit" variant="contained" endIcon={<Search />}>
              Search
            </Button>
          )}
        </form>
        {loading === true && error === "" ? (
          <div>
            <CircularProgress />
          </div>
        ) : data ? (
          <div className="mt-4 ">
            <div className="flex ">
              <div className="">
                <h1
                  className={`text-4xl ${
                    Blue ? "text-sky-700" : "text-white"
                  } `}
                >
                  {data.name}
                </h1>
              </div>
              <div className="flex flex-col ml-28">
                <h1
                  className={`text-5xl font-semibold ${
                    Blue ? "text-sky-700" : "text-white"
                  }`}
                >
                  {(data.main.temp - 273.15).toFixed(1)}°C
                </h1>
                <p className={`${Blue ? "text-sky-700" : "text-white"}`}>
                  {data.weather[0].description}
                </p>
              </div>
            </div>

            <div className="flex mt-6">
              <div className=" ">
                <p
                  className={`${Blue ? "text-sky-700" : "text-white"} text-lg`}
                >
                  Humidity: {data.main.humidity}%
                </p>
                <p
                  className={`text-lg ${Blue ? "text-sky-700" : "text-white"}`}
                >
                  Wind Speed: {data.wind.speed} km/h
                </p>
                <p
                  className={`text-lg ${Blue ? "text-sky-700" : "text-white"}`}
                >
                  Clouds: {data.clouds.all}%
                </p>
              </div>
              <div className="p-4 ml-20 pt-0">
                {(data.main.humidity >= 50 && data.clouds >= 40) ||
                data.weather[0].description === "smoke" ? (
                  <img src="/smoke.png" className="w-20 h-20 " alt="" />
                ) : (data.main.humidity <= 40 && data.clouds <= 30) ||
                  data.weather[0].description === "clear sky" ? (
                  <img src="/clear.png" className="w-20 h-20 " alt="" />
                ) : (data.main.humidity >= 50 && data.clouds >= 60) ||
                  data.weather[0].description === "moderate rain" ? (
                  <img src="/rain.png" className="w-20 h-20 " alt="" />
                ) : (data.main.humidity >= 40 && data.clouds >= 40) ||
                  data.weather[0].description === "mostly sunny" ? (
                  <img src="/sky-clouds.png" className="w-20 h-20 " alt="" />
                ) : (data.main.humidity >= 60 && data.clouds >= 60) ||
                  data.weather[0].description === "haze" ? (
                  <img src="/haze.png" className="w-20 h-20 " alt="" />
                ) : (
                  <img src="/clouds.png" className="w-20 h-20 " alt="" />
                )}
              </div>
            </div>
          </div>
        ) : error ? (
          <p
            style={{
              color: "#ff6b6b",
              backgroundColor: "#ffe6e6",
              padding: "10px",
              borderRadius: "5px",
              textAlign: "center",
            }}
          >
            {error}
          </p>
        ) : cityName === "" ? (
          <h3 className="text-3xl ml-5 mt-6">
            Welcome to Waleed's Weather Application
          </h3>
        ) : (
          <div>
            <CircularProgress />
          </div>
        )}
      </div>
    </div>
  );
}

export default Weather;
