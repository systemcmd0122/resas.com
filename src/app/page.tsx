"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import './globals.css';

interface Place {
  id: number;
  name: string;
  URL: string;
}

export default function Home() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [range, setRange] = useState([0, 19]);

  const fetchData = async (from: number, to: number) => {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .order('id')
      .range(from, to);

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setPlaces(data || []);
    }
  };

  useEffect(() => {
    fetchData(range[0], range[1]);
  }, [range]);

  const handleButtonClick = (start: number, end: number) => {
    setRange([start, end]);
  };

  const renderButtons = () => {
    const buttons = [];
    for (let i = 0; i < 940; i += 20) {
      const start = i;
      const end = i + 19;
      buttons.push(
        <button key={i} onClick={() => handleButtonClick(start, end)} className="button">
          {`${start + 1} - ${end + 1}`}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="container">
      <h1 className="title">Places</h1>
      <div className="buttonGroup">{renderButtons()}</div>
      <div className="grid">
        {places.map((place) => (
          <div key={place.id} className="card">
            <h2 className="cardTitle">{place.name}</h2>
            <a href={place.URL} target="_blank" rel="noopener noreferrer" className="link">
              {place.URL}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
