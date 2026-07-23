import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useBars } from "../hooks/useBars.js";

const markerIcon = L.divIcon({
  className: "",
  html: '<div style="width:16px;height:16px;background:#7b2d43;border:2px solid white;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.4);"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -10],
});

const YONGSAN_CENTER = [37.5326, 126.9905];

const BarsPage = () => {
  const [keyword, setKeyword] = useState("");
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const { data: bars = [], isLoading } = useBars(appliedKeyword);

  const handleSubmit = (event) => {
    event.preventDefault();
    setAppliedKeyword(keyword);
  };

  const barsWithLocation = bars.filter((bar) => bar.lat && bar.lng);
  const center =
    barsWithLocation.length > 0
      ? [
          barsWithLocation.reduce((sum, bar) => sum + Number(bar.lat), 0) / barsWithLocation.length,
          barsWithLocation.reduce((sum, bar) => sum + Number(bar.lng), 0) / barsWithLocation.length,
        ]
      : YONGSAN_CENTER;

  return (
    <div className="max-w-[900px] mx-auto my-10 px-6">
      <form className="flex gap-2.5 mb-6" onSubmit={handleSubmit}>
        <input
          className="flex-1 px-[18px] py-3 border-[1.5px] border-gray-300 rounded-[10px] text-[15px] outline-none bg-[#fafafa] transition-colors focus:border-[#7b2d43] focus:bg-white"
          type="text"
          placeholder="가게명으로 검색"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
        <button className="px-6 py-3 bg-[#7b2d43] text-white rounded-[10px] text-[15px] font-semibold cursor-pointer transition-colors hover:bg-[#5f2233]">
          검색
        </button>
      </form>

      <MapContainer
        key={appliedKeyword}
        center={center}
        zoom={14}
        scrollWheelZoom={false}
        className="w-full h-[380px] rounded-[14px] mb-6"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
        />
        {barsWithLocation.map((bar) => (
          <Marker key={bar.id} position={[Number(bar.lat), Number(bar.lng)]} icon={markerIcon}>
            <Popup>
              <strong>{bar.name}</strong>
              <br />
              {bar.address}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <ul className="list-none grid gap-4 p-0">
        {isLoading && <li className="text-gray-500">불러오는 중...</li>}
        {!isLoading && bars.length === 0 && <li className="text-gray-500">검색 결과가 없습니다</li>}
        {bars.map((bar) => (
          <li className="px-5 py-4 bg-white rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.07)]" key={bar.id}>
            <h3 className="mt-0 mb-1.5 text-[17px] font-bold text-gray-800">{bar.name}</h3>
            <p className="my-0.5 text-[13px] text-gray-500">{bar.address}</p>
            {bar.street && <p className="my-0.5 text-[13px] text-[#7b2d43] font-semibold">{bar.street}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BarsPage;
