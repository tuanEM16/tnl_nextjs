// components/public/ui/Button.js
export default function Button({ 
  children, 
  variant = "primary", 
  className = "", 
  ...props 
}) {
  const variants = {
    primary: "bg-black text-white hover:bg-orange-600 shadow-[4px_4px_0_0_#ea580c]",
    outline: "bg-white text-black border-4 border-black hover:bg-black hover:text-white shadow-[4px_4px_0_0_#000]",
    ghost: "bg-transparent text-black border-2 border-transparent hover:border-black"
  };

  return (
    <button 
      className={`px-8 py-3 font-black uppercase italic tracking-widest transition-all active:translate-x-1 active:translate-y-1 active:shadow-none ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}