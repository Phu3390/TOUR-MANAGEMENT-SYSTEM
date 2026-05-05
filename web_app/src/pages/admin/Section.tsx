type SectionProps = {
  title: string
}

export default function Section({ title }: SectionProps) {
  return (
    <section className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
      <p className="text-6xl font-bold leading-tight text-slate-900">{title}</p>
      <p className="mt-4 text-sm text-slate-600">Noi dung cho muc {title} se duoc bo sung tai day.</p>
    </section>
  )
}
