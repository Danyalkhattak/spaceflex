import { useState } from "react";
import Icon from "../../components/ui/Icon.jsx";

const Gallery = ({ images, title }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[16/9] rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300">
        <Icon name="building" className="w-14 h-14" />
      </div>
    );
  }

  const active = images[activeIndex] ?? images[0];

  return (
    <div>
      <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100">
        <img
          src={active.secureUrl}
          alt={active.altText || title}
          className="w-full h-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img._id}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                i === activeIndex ? "border-slate-900" : "border-transparent"
              }`}
            >
              <img
                src={img.secureUrl}
                alt={img.altText || title}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
