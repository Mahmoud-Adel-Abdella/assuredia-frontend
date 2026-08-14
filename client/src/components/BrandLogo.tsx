/* Assuredia official logo: rendered directly with no synthetic frame, border, or shadow. */
const officialLogo = "/manus-storage/assuredia-official-logo-wordmark_cbf8e770.png";

export default function BrandLogo({ className = "", alt = "Assuredia" }: { className?: string; alt?: string }) {
  return <img src={officialLogo} alt={alt} className={`official-logo ${className}`.trim()} />;
}
