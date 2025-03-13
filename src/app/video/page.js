"use client";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";

export default function VideoPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-5xl font-bold mb-12">Choose a Call Type</h1>
        <div className="flex flex-col md:flex-row gap-10 justify-center">
          {/* Audio Call Button */}
          <Button
            className="flex flex-col items-center justify-center w-800 h-800 bg-gray-800 hover:bg-gray-700 rounded-2xl p-6 transition-all duration-300 shadow-lg"
            onClick={() => router.push("/audio-call")}
          >
            <img
              src="/icons/audio.svg" // Replace with a proper local or hosted icon
              alt="Audio Call"
              className="w-24 h-24 mb-4"
            />
            <span className="text-2xl font-medium">Audio Call</span>
          </Button>

          {/* Video Call Button */}
          <Button
            className="flex flex-col items-center justify-center w-800 h-800 bg-gray-800 hover:bg-gray-700 rounded-2xl p-6 transition-all duration-300 shadow-lg"
            onClick={() => router.push("/video-call")}
          >
            <img
              src="/icons/video.svg" // Replace with a proper local or hosted icon
              alt="Video Call"
              className="w-24 h-24 mb-4"
            />
            <span className="text-2xl font-medium">Video Call</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
