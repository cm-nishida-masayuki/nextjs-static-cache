"use client";

import { useEffect, useState } from "react";

export const Header = () => {
  const [name, setName] = useState("");
  const [cart, setCart] = useState(0);

  useEffect(() => {
    fetch("/api/").then(async (res) => {
      const body = await res.json();
      setName(body.name);
      setCart(body.cart);
    });
  }, []);

  return (
    <header className="py-2 px-4">
      <div className="flex">
        <ul className="flex gap-x-3">
          <li>{name}</li>
          <li>カート1({cart})</li>
        </ul>
      </div>
      <div className="bg-[#222] h-8 mx-[calc(50%_-_50vw)]" />
    </header>
  );
};
