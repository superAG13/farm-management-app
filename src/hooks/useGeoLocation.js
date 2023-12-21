import {useState, useEffect} from "react";

const useGeolocation = () => {
  const [location, setLocation] = useState({latitude: null, longitude: null, error: null});

  useEffect(() => {
    const handleSuccess = (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
      });
    };

    const handleError = (error) => {
      setLocation((prevState) => ({...prevState, error}));
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    } else {
      setLocation((prevState) => ({...prevState, error: "Geolocation is not supported by this browser."}));
    }
  }, []);

  return location;
};

export default useGeolocation;
