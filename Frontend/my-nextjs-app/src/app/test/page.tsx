'use client'
import React, { useEffect, useState } from "react";

interface Province {
  province: string;
  id: number;
  subdistrict:string;
}

export default function test(){
const [allProvince, setAllProvince] = useState<Province[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null); 

useEffect(() => {
  async function fetchProvinces() {
    try {
      const prov = await fetch(`http://127.0.0.1:5000/api/locations/provinces`);
      if (!prov.ok) throw new Error("Failed to fetch category");
      const data = await prov.json();
      setAllProvince(data);
    } catch (error) {
      console.error("Error fetching category:", error);
      setError("Error loading category");
    } finally {
      setLoading(false);
    }
  }

  fetchProvinces();
}, []);
if (loading) return <main>loading</main>;
  if (error) return <main>{error}</main>;
return(
<div>
{allProvince.map((province) => (
  <button
  key={province.id}
  type="button"
  id={`province-${province.id}`}
  className="bg-blue-500"
>
  {province.province}
</button>

))}

</div>
)
}