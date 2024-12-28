import MiningVisualizer from '@/components/MiningVisualizer';
import CommentSection from '@/components/CommentSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">
          Bitcoin Mining Simulator
        </h1>
        <MiningVisualizer />
        <CommentSection />
      </div>
    </main>
  );
}
