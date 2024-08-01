'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import './globals.css';

// 都道府県名のリスト
const PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県', 
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県', 
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', 
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県', 
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県', 
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県', 
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
];

// ボタンラベルとID範囲のマッピング
const PREFECTURE_RANGES = PREFECTURES.map((prefecture, index) => ({
  label: prefecture,
  start: index * 20 + 1,
  end: (index + 1) * 20
}));

// 座標の型を定義
interface Location {
  lat: number;
  lon: number;
}

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // データを取得する関数
  const fetchData = async (start: number, end: number) => {
    const { data: places, error } = await supabase
      .from('places')
      .select('*')
      .gte('id', start)
      .lte('id', end);

    if (error) {
      console.error('Error fetching data:', error);
      return;
    }
    console.log('Fetched Data:', places); // デバッグ用
    setData(places || []);
  };

  // 地図の埋め込みURLを生成する関数
  const getMapUrl = (lat: number, lon: number) => {
    console.log(`Generating map URL for lat: ${lat}, lon: ${lon}`); // デバッグ用
    return `https://maps.gsi.go.jp/#15/${lat}/${lon}/&base=std&ls=std&disp=1&vs=c1g1j0h0k0l0u0t0z0r0s0m0f1`;
  };

  const handleMapButtonClick = (coordinate: string) => {
    console.log(`Selected Coordinate: ${coordinate}`); // デバッグ用
    const [latStr, lonStr] = coordinate.split(',').map(coord => coord.trim());
    const lat = parseFloat(latStr);
    const lon = parseFloat(lonStr);
    if (!isNaN(lat) && !isNaN(lon)) {
      setSelectedLocation({ lat, lon });
    } else {
      console.error('Invalid coordinate format:', coordinate);
    }
  };

  useEffect(() => {
    if (selectedLocation && mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedLocation]);

  return (
    <div className="container">
      <h1 className="title">都道府県データ</h1>
      <div className="buttonGroup">
        {PREFECTURE_RANGES.map((range, index) => (
          <button 
            key={index} 
            className="button"
            onClick={() => fetchData(range.start, range.end)}
          >
            {range.label}
          </button>
        ))}
      </div>
      <div className="grid">
        {data.map((item) => (
          <div key={item.id} className="card">
            <div className="cardTitle">{item.name}</div>
            <a href={item.URL} className="link" target="_blank" rel="noopener noreferrer">
              {item.URL}
            </a>
            {item.coordinate && (
              <button 
                className="button" 
                onClick={() => handleMapButtonClick(item.coordinate)}
              >
                地図で表示
              </button>
            )}
          </div>
        ))}
      </div>
      {selectedLocation && (
        <div className="map" ref={mapRef}>
          <iframe
            width="100%"
            height="500"
            src={getMapUrl(selectedLocation.lat, selectedLocation.lon)}
            style={{ border: 0 }}
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
}
