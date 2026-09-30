interface FilterChipProps {
  label: string
  selected: boolean
  onClick: () => void
}

export default function FilterChip({ label, selected, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer ${
        selected
          ? 'border-brand bg-brand text-ink shadow-md shadow-brand/20'
          : 'border-white/10 bg-white/[0.03] text-mist/60 hover:border-brand/40 hover:text-mist'
      }`}
    >
      {label}
    </button>
  )
}
