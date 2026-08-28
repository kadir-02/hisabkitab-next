export default function Wordmark() {
  return (
    <div className="flex items-center gap-3">
      <div className="ink-stamp shrink-0 w-12 h-12 rounded-full border-[2.5px] border-brand text-brand flex items-center justify-center font-display font-bold text-lg shadow-stamp">
        HK
      </div>
      <div>
        <h1 className="text-2xl font-display font-bold text-ink leading-none">HisabKitab</h1>
        <p className="text-[11px] text-ink-faint mt-1 tracking-wide">हिसाब-किताब · Tiffin Ledger</p>
      </div>
    </div>
  );
}
