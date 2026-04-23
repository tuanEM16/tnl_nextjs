// components/public/ui/SectionTitle.js
export default function SectionTitle({ title, subtitle, align = "left" }) {
  const alignment = align === "center" ? "items-center text-center" : "items-start";

  return (
    <div className={`flex flex-col gap-2 mb-12 ${alignment}`}>
      <span className="text-orange-600 font-black tracking-[0.3em] text-xs uppercase">
        // {subtitle}
      </span>
      <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none border-b-[6px] border-black pb-4">
        {title}
      </h2>
    </div>
  );
}