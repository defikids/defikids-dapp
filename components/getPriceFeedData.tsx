import { useState, useEffect } from "react";
import ethers from "ethers";
import aggregatorV3Interface from "../abis/aggregatorV3Interface";

const useFetch = ({ addr }) => {
  //provider
  const provider = new ethers.providers.JsonRpcProvider(
    "https://polygon-mumbai.infura.io/v3/4625d8a5e77f4c678b39423652c6f6cd"
  );
  //ABI

  //data variables
  const [name, setName] = useState(null);
  const [price, setPrice] = useState(null);
  const [error, setError] = useState(null);

  //fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const priceFeed = new ethers.Contract(
          addr,
          aggregatorV3Interface,
          provider
        );
        priceFeed.latestRoundData().then((roundData) => {
          let priceCalc = roundData.answer._hex;
          let DecimalValue = parseInt(priceCalc, 16);
          priceCalc = DecimalValue / 10 ** 8; //price
          setPrice(priceCalc);
        });
        priceFeed.description().then((roundData) => {
          setName(roundData.slice(0, 3)); //get the name and slice off the first 3 chars
        });
        setError(null);
      } catch (err) {
        if (err) {
          setError(err);
          console.log("There was an error fetching data");
        }
      }
    };
    fetchData();
  }, [addr]); //should this have addr in it?

  return { name, price, error };
};
export default useFetch;
