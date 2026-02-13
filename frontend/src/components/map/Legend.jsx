export default function Legend() {
  return (
    <div className="absolute bottom-6 right-6 bg-slate-900/90 backdrop-blur p-4 rounded-lg shadow-xl z-[1000] text-xs border border-slate-700 text-slate-300 hidden md:block">
      <h4 className="font-bold mb-3 text-white uppercase">Legenda</h4>
      <div className="space-y-2">
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></span> PLTS
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span> PLTD
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-gray-400 mr-2"></span> PLTU
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span> PLT Air
        </div>
      </div>
    </div>
  );
}
