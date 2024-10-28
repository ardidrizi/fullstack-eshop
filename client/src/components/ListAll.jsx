import { useState, useEffect } from "react";
import axios from "axios";

function ListAll() {
  const [data, setData] = useState([]);
  console.log(data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get("http://localhost:3000/api/products", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setData(resp.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="item-container">
      {/* <p>{JSON.stringify(data)}</p>; */}
      {data.map((item) => (
        <div key={item._id}>
          <p>{item.name}</p>
          <p>{item.price}</p>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
}

export default ListAll;
