import React, { useState, useEffect } from "react";
import { Container, Card } from "react-bootstrap";
import PriceFeed from "../components/getPriceFeedData";
import useFetch from "../components/getPriceFeedData";

const Chainlink = () => {
  const [addr, setAddr] = useState([
    //Mumbai Testnet addresses listed on chainlink docs
    { id: "1", address: "0x007A22900a3B98143368Bd5906f8E17e9867581b" }, //BTC
    { id: "2", address: "0x0FCAa9c899EC5A91eBc3D5Dd869De833b06fB046" }, //DAI
    { id: "3", address: "0x0715A7794a1dc8e42615F059dD6e406A6594651A" }, //ETH
    { id: "4", address: "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada" }, //MATIC
    { id: "5", address: "0x9dd18534b8f456557d11B9DDB14dA89b2e52e308" }, //SAND
    { id: "6", address: "0x572dDec9087154dC5dfBB1546Bb62713147e0Ab0" }, //USCC
    { id: "7", address: "0x92C09849638959196E976289418e5973CC96d645" }, //USDT
  ]);
  const { price, name, error } = useFetch(addr);

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <h1 className="text-hero text-blue-dark text-center mb-[8vh]">
        View Chainlink Data Feed:
      </h1>
      <div>
        {addr.map((data) => (
          <Container key={data.id}>
            <Card>
              <h2>{data.name}</h2>
              <p>Price: {data.price}</p>
            </Card>
          </Container>
        ))}
      </div>
    </div>
  );
};

export default Chainlink;
