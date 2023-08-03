import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer: React.FC = () => {
  return (
    <div className="border-t border-indigo-500 ">
      <div className="flex justify-center items-center text-blue-dark my-4">
        {/* <div className="flex items-center"> */}
        <div className="flex">
          <a className="mr-3 flex" href="https://polygon.technology/">
            <Image src="/polygon.svg" alt="polygon" height={60} width={135} />
          </a>
          <a className="mr-5 flex" href="https://www.superfluid.finance/">
            <Image
              src="/superfluid.svg"
              alt="superfluid"
              height={10}
              width={110}
            />
          </a>
          <a className="flex" href="https://sequence.info/">
            <Image src="/sequence.svg" alt="sequence" height={20} width={120} />
          </a>
        </div>
      </div>

      <div className="flex justify-center text-blue-dark mx-4">
        <div className="flex items-center">
          <p className="cursor-pointer ml-8">
            <Link href="https://twitter.com/defikids_">
              Twitter - @defikids_
            </Link>
          </p>
          {/* <p className="cursor-pointer">FAQ</p> */}

          <p className="cursor-pointer ml-8">
            <Link href="https://learncrypto.com/glossary">Crypto Glossary</Link>
          </p>
          <p className="cursor-pointer ml-8"> DefiKids @ 2022</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
