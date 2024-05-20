'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from "react";

export default function Dashboard() {
  const router = useRouter()
  const [temperature, setTemperature] = useState(10);
  const [humidity, setHumidity] = useState(33);
  const [heartbeat, setHeartbeat] = useState(10);
  const [automaticControl, setAutomaticControl] = useState(false);
  const [minTemperature, setMinTemperature] = useState(5);
  const [maxTemperature, setMaxTemperature] = useState(30);
  const [lightOn, setLightOn] = useState(false);
  const [fanOn, setFanOn] = useState(false);

  const flaskIp = "http://localhost:5000";

  const handleAutomaticControlToggle = async () => {
    const newAutomaticControl = !automaticControl;
    setAutomaticControl(newAutomaticControl);

    await sendTemperatureRange(newAutomaticControl);
  };

  const updateServerTemp = async () => {
    await sendTemperatureRange(automaticControl);
  };

  const sendTemperatureRange = async (automaticControlState:any) => {
    try {
      const response = await fetch(`${flaskIp}/temperature/range`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          min: minTemperature, 
          max: maxTemperature, 
          automaticControl: automaticControlState 
        }),
      });
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error('Error setting temperature range:', error);
    }
  };

  const handleLightToggle = async () => {
    const newLightState = !lightOn;
    setLightOn(newLightState);

    try {
      const response = await fetch(`${flaskIp}/light/${newLightState ? 'on' : 'off'}`, {
        method: 'POST'
      });
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error('Error toggling light:', error);
    }
  };

  const handleFanToggle = async () => {
    const newFanState = !fanOn;
    setFanOn(newFanState);

    try {
      const response = await fetch(`${flaskIp}/fan/${newFanState ? 'on' : 'off'}`, {
        method: 'POST'
      });
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error('Error toggling fan:', error);
    }
  };

  const handleLogout = (e:any) => {
    router.push("/")
  };

  // Fetch data from Flask server every 10 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${flaskIp}/data`);
        const data = await response.json();
        setTemperature(data.temperature);
        setHumidity(data.humidity);
        setHeartbeat(data.heartbeat);
      } catch (error) {
        console.error('Error fetching data from Flask server:', error);
      }
    };

    const intervalId = setInterval(fetchData, 10000); // 10 seconds interval

    // Cleanup function to clear the interval
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <nav className="bg-white dark:bg-gray-900 w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600 mb-10">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-black">SmartBabyIncubator</span>
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button onClick={handleLogout} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Logout</button>
            <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
      <div className='flex justify-center '>
        {/* Cards for displaying temperature, humidity, and heartbeat */}
        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-5">
          <span className='text-4xl mb-2'>
            🌡️
          </span>
          <a href="#">
            <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{temperature}°C</h5>
          </a>
          <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">Temperature</p>
        </div>

        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-5">
          <span className='text-4xl mb-2'>
            💦
          </span>
          <a href="#">
            <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{humidity}%</h5>
          </a>
          <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">Humidity</p>
        </div>

        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-5">
          <span className='text-4xl mb-2'>
            ❤️
          </span>
          <a href="#">
            <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{heartbeat} bpm</h5>
          </a>
          <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">Heartbeat</p>
        </div>

        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-5">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mb-4">Peripheral Controls</h2>
          <label htmlFor="automaticControl" className="flex items-center cursor-pointer">
            <span className="mr-2 text-gray-900 dark:text-white">Automatic Control </span>
            <input
              type="checkbox"
              id="automaticControl"
              className="form-checkbox h-5 w-5 text-blue-500 cursor-pointer"
              checked={automaticControl}
              onChange={handleAutomaticControlToggle}
            />
          </label>
          <div className="flex justify-between mt-4">
            <div className="flex items-center">
              <span className="mr-2 text-gray-900 dark:text-white">Light</span>
              <label className="switch">
                <input
                  type="checkbox"
                  disabled={automaticControl}
                  checked={lightOn}
                  onChange={handleLightToggle}
                />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-gray-900 dark:text-white">Fan</span>
              <label className="switch">
                <input
                  type="checkbox"
                  disabled={automaticControl}
                  checked={fanOn}
                  onChange={handleFanToggle}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Section for setting min and max temperature */}
      { automaticControl &&
      <div className="flex justify-center mt-10">
      <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-5">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mb-4">Set Temperature Range</h2>
        <div className="mb-4">
          <label htmlFor="minTemperature" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Min Temperature (°C)</label>
          <input
            type="number"
            id="minTemperature"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={minTemperature}
            onChange={(e) => setMinTemperature(Number(e.target.value))}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="maxTemperature" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Max Temperature (°C)</label>
          <input
            type="number"
            id="maxTemperature"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={maxTemperature}
            onChange={(e) => setMaxTemperature(Number(e.target.value))}
          />
        </div>
        <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Temperature range: {minTemperature}°C - {maxTemperature}°C</p>
        <button onClick={updateServerTemp} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Update</button>
      </div>
    </div>
      
      }
      
    </div>
  );
}
