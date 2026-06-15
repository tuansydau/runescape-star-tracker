'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const fetchStars = async () => {
      const response = await fetch('/api/scrape');
      const jsonData = await response.json();
      setStars(jsonData);
    };
    fetchStars();
  }, []);

  return (
    <div className="w-screen h-screen">
      {/* Header that's like "Shooting Stars" */}
      <div className="pl-8 pt-8 text-[#a7b68d]">
        <h1 className="text-6xl">Moo&apos;s Shooting Stars</h1>
        <div className="mt-4" />
        <p className="text-sm">
          A list of all of the shooting stars that moo&apos;s GIM can access at
          the moment.
        </p>
        <p className="text-sm">
          I&apos;m too lazy to make this accessible to everyone else, but maybe
          I can later on?
        </p>
      </div>

      <div className="mt-16" />

      {/* Let's make a table */}
      <table id="stars-data" className="w-full text-[#a7b68d] text-left">
        <tbody key="stars-data-body" className="w-full">
          <tr className="border-b-2 border-[#a7b68d]">
            <th className="w-2/12 pl-8 py-2">Time</th>
            <th className="w-2/12">World</th>
            <th className="w-2/12">Tier</th>
            <th className="w-6/12">Location</th>
          </tr>
          {stars.length !== 0
            ? stars.map((star, index) => (
                <tr key={index} className="border-b border-[#a7b68d]">
                  <td className="pl-8 py-2">{star[0]}</td>
                  <td>{star[1]}</td>
                  <td>{star[2]}</td>
                  <td>{star[3]}</td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </div>
  );
}
