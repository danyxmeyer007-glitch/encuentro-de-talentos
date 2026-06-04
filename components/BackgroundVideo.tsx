export default function BackgroundVideo() {
  return (
    <div className="fixed inset-0 -z-10 flex items-center justify-center overflow-hidden bg-black">
      <video
        src="/videos/ETportada.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-contain"
      />

      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}