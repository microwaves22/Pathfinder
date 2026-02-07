import Hero3D from "./components/Hero3D";
import Interaction from "./components/Interaction";

export default function Page() {
  return (
    <main className="bg-black text-white">
      <Hero3D />

      {/* Interactive dialogue */}
      <div className="py-20">
        <Interaction />
      </div>
    </main>
  );
}