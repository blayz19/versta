interface FilterChipProps {
  label: string
  selected: boolean
  onClick: () => void
}

export default function FilterChip({ label, selected, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink ${
        selected
          ? 'border-brand bg-brand text-ink shadow-md shadow-brand/25'
          : 'border-border bg-surface text-mist-soft/80 hover:border-brand/40 hover:text-mist hover:bg-surface-hover'
      }`}
    >
      {label}
    </button>
  )
}
