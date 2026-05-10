export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-100/80 py-6">
      <div className="mx-auto max-w-7xl px-6 text-sm text-slate-600">
        <div className="flex flex-col items-center gap-4 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
          <a href="/client" className="inline-flex items-baseline rounded-md px-1 py-1 text-blue-700 transition hover:text-blue-800" aria-label="TourTravel">
            <span className="text-lg font-extrabold tracking-tight sm:text-xl">Tour</span>
            <span className="text-lg font-black tracking-tight text-orange-500 sm:text-xl">Travel</span>
          </a>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-slate-500">
            <a href="#" className="transition hover:text-slate-700">About Us</a>
            <a href="#" className="transition hover:text-slate-700">Privacy Policy</a>
            <a href="#" className="transition hover:text-slate-700">Terms of Service</a>
            <a href="#" className="transition hover:text-slate-700">Contact</a>
          </div>

          <div className="text-slate-500">© 2024 TourTravel. All rights reserved.</div>
        </div>
      </div>
    </footer>
  )
}
