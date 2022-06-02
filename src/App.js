import { useEffect, useState } from "react";
import "./styles.css";

// https://randomuser.me/api/?results=20

export default function App() {
  const [locations, setLocations] = useState([]);
  const [sortDirection, setSortDirection] = useState("unsorted");

  const sortByDirection = (data) => {
    console.log(sortDirection);
    let sortedData = data;
    if (sortDirection === "unsorted") {
      sortedData = sortedData.sort((a, b) => a > b);
    }
    if (sortDirection === "ascending") {
      sortedData = sortedData.sort((a, b) => b < a);
    }
    if (sortDirection === "descending") {
      sortedData = sortedData.sort((a, b) => a < b);
    }
    setSortDirection((prevState) =>
      prevState === "unsorted"
        ? "ascending"
        : prevState === "ascending"
        ? "descending"
        : "ascending"
    );
    return sortedData;
  };

  const sortColumn = (e) => {
    const columnToSort = e.target.getAttribute("name");
    const newLocations = [];
    const data = sortByDirection(
      locations.map((location) => location[columnToSort])
    );
    const locationCopy = [...locations];
    data.forEach((ordered) => {
      const a = locationCopy.findIndex(
        (location) => location[columnToSort] === ordered
      );
      // mutation location copy so that we retain entries from same category
      newLocations.push(locationCopy[a]);
      locationCopy.splice(a, 1);
    });

    setLocations(newLocations);
  };

  const fetchData = async () => {
    const result = await fetch("https://randomuser.me/api/?results=20");
    const data = await result.json();
    return data.results.map((result) => result.location);
  };

  const flattenObj = (obj) => {
    const objKeys = Object.keys(obj);
    let newObj = {};
    objKeys.forEach((key) => {
      if (typeof obj[key] !== "object") {
        newObj[key] = obj[key];
      } else {
        newObj = { ...newObj, ...flattenObj(obj[key]) };
      }
    });
    return newObj;
  };

  const flattenLocations = (locations) => {
    let data = [];
    locations.forEach((location) => {
      data.push(flattenObj(location));
    });
    return data;
  };

  useEffect(() => {
    (async () => {
      const data = await fetchData();
      setLocations(flattenLocations(data));
    })();
  }, []);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <table>
        <thead>
          <tr>
            {locations.length > 0 &&
              Object.keys(locations[0]).map((key, i) => {
                return (
                  <th name={key} key={i} onClick={sortColumn}>
                    {key}
                  </th>
                );
              })}
          </tr>
        </thead>
        <tbody>
          {locations.map((location, i) => {
            return (
              <tr key={i}>
                {Object.keys(location).map((key) => {
                  return <td>{location[key]}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
