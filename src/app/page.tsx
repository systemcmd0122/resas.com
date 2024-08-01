'use client';

import { useState } from 'react';
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

export default function Home() {
  const [data, setData] = useState<any[]>([]);

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
    setData(places || []);
  };

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
          </div>
        ))}
      </div>
    </div>
  );
}
