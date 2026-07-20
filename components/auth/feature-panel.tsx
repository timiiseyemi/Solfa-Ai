export function FeaturePanel() {
  return (
    <aside className="relative min-h-screen overflow-hidden bg-[#0c0c16] p-10 lg:flex lg:flex-col lg:justify-between">
      <img
        src="/studio/footer-music-2.png"
        alt="Hands playing a grand piano"
        className="absolute inset-0 size-full object-cover object-center brightness-115 contrast-105"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-[#0a0a10]/35 via-transparent to-[#0a0a10]/45" />
    </aside>
  )
}
