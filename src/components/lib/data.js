// lib/data.js

// Generate 30 dummy drivers to match the pagination
export const drivers = Array.from({ length: 30 }).map((_, i) => ({
  id: (i + 1).toString(),
  name: "John Keita",
  number: "+223 78 22 14 99",
  licenseFront: "/license-front.png",  
  licenseBack: "/license-back.png",
}));

export const getDriver = (id) => drivers.find((d) => d.id === id);
