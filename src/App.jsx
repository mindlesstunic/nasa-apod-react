import { useEffect, useState } from "react";
import SideBar from "./components/SideBar";
import Main from "./components/Main";
import Footer from "./components/Footer";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setshowModal] = useState(false);

  function handleToggleModal() {
    setshowModal(!showModal);
  }

  useEffect(() => {
    async function fetchAPIData() {
      const NASA_KEY = import.meta.env.VITE_NASA_API_KEY;
      const url =
        "https://api.nasa.gov/planetary/apod" + `?api_key=${NASA_KEY}`;

      const today = (new Date()).toDateString();
      const localKey = `NASA-${today}`;

      if (localStorage.getItem(localKey)) {
        const apiData = JSON.parse(localStorage.getItem(localKey));
        console.log("data fetched from cache");
        setData(apiData);
        return;
      }
      localStorage.clear();

      try {
        const res = await fetch(url);
        const apidata = await res.json();
        localStorage.setItem(localKey, JSON.stringify(apidata));
        setData(apidata);
        console.log("data fetched from API");
      } catch (err) {
        console.error({ message: err.message });
      }
    }
    fetchAPIData();
  }, []);

  return (
    <>
      {data ? (
        <Main data={data} />
      ) : (
        <div className="loadingState">
          <i className="fa-solid fa-gear"></i>
        </div>
      )}
      {showModal && (
        <SideBar data={data} handleToggleModal={handleToggleModal} />
      )}
      {data && <Footer data={data} handleToggleModal={handleToggleModal} />}
    </>
  );
}

export default App;
