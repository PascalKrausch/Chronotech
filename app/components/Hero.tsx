
export default function Hero () {

    return (

      <section className="relative flex flex-col items-center justify-center text-center py-24 px-6 overflow-hidden">
      
      
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-blue-400/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto z-10">
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-stone-800 via-zinc-600 to-stone-900 pb-2">
          Chronotech 
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
          Das Community-Forum für Technikgeschichte und mehr
        </p>


      </div>
    </section>


    )
}