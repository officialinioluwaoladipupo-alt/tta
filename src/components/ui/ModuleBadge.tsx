
export function ModuleBadge({ title, label, border = true }: { title: string, label: string, border?: boolean }) {
  return (
    <div className={`p-12 flex flex-col gap-2 ${border ? 'border-b md:border-r border-foreground/5' : ''}`}>
       <span className="text-[10px] font-black uppercase tracking-widest text-accent mb-2">{title}</span>
       <span className="text-2xl font-black uppercase tracking-tighter leading-tight text-foreground">{label}</span>
    </div>
  );
}
