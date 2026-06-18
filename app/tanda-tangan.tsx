// Tanda kecil pembuat aplikasi — sengaja halus / tidak menonjol (sekadar "sign").
export function TandaTangan({ className = "" }: { className?: string }) {
  return (
    <p
      className={`text-center text-xs text-zinc-400 dark:text-zinc-600 ${className}`}
    >
      Didesain oleh Muhammad Rizki Yaznil
    </p>
  );
}
