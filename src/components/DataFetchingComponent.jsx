import {useState, useEffect} from "react";

function DataFetchingComponent() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/data")
      .then((response) => {
        console.log(response); // Log the response object
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data); // Log the JSON data
        setData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message);
      });
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Data from MySQL</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            ID: {item.dzialka_id}, Name: {item.nazwa}, Area: {item.powierzchnia_ha}ha
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DataFetchingComponent;
