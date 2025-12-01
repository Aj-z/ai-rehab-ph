"use client";
import { useEffect, useRef, useState } from "react";
import PoseModule from "@mediapipe/pose";
const { Pose } = PoseModule;
import CameraModule from "@mediapipe/camera_utils";
const Camera = CameraModule.Camera || CameraModule;

const COUNTDOWN_OPTS = [3, 5, 10];

export default function SquatCounter() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState<"idle" | "countdown" | "running" | "finished">("idle");
  const [secondsLeft, setSecondsLeft] = useState(3);
  const [selectedSec, setSelectedSec] = useState<number>(3);
  const [glow, setGlow] = useState(false);
  const [camReady, setCamReady] = useState(false);

  let down = useRef(false);

  /* ----------  MEDIA-PIPE SETUP  ---------- */
  useEffect(() => {
    if (status !== "running") return;

    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });
    pose.setOptions({ modelComplexity: 1, smoothLandmarks: true });
    pose.onResults((results) => {
      if (!results.poseLandmarks) return;
      const hip = results.poseLandmarks[23];
      const knee = results.poseLandmarks[25];
      const ankle = results.poseLandmarks[27];
      const angle = Math.atan2(ankle.y - knee.y, ankle.x - knee.x) - Math.atan2(hip.y - knee.y, hip.x - knee.x);
      const isDown = angle < 1.2;
      if (!down.current && isDown) {
        down.current = true;
      } else if (down.current && !isDown) {
        down.current = false;
        setCount((c) => c + 1);
        setGlow(true);
        setTimeout(() => setGlow(false), 300);
      }
    });

    const startCam = async () => {
      if (!videoRef.current) return;
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current) await pose.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      await camera.start();
      setCamReady(true);
      return camera;
    };

    startCam().then((cam) => cam && (() => cam.stop()));
  }, [status]);

  /* ----------  COUNT-DOWN  ---------- */
  useEffect(() => {
    if (status === "countdown") {
      const id = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(id);
            setStatus("running");
            return 0;
          }
          return s - 1;
        });
      }, 1000);
      return () => clearInterval(id);
    }
  }, [status]);

  /* ----------  CONTROLS  ---------- */
  const start = () => {
    setCount(0);
    setSecondsLeft(selectedSec);
    setStatus("countdown");
  };

  const reset = () => {
    setCount(0);
    setStatus("idle");
    setCamReady(false);
  };

  const confirm = () => {
    setStatus("finished");
    alert(`✅  Confirmed: ${count} squats logged!`);
    // TODO: save to DB here
  };

  /* ----------  RENDER  ---------- */
  return (
    <div className="glass rounded-xl p-6 shadow-2xl border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">AI Squat Counter</h3>
        {status === "idle" && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">Ready in</span>
            <select
              value={selectedSec}
              onChange={(e) => setSelectedSec(Number(e.target.value))}
              className="bg-gray-700/60 text-white text-sm rounded px-2 py-1 border-0 ring-1 ring-white/20 focus:ring-indigo-400"
            >
              {COUNTDOWN_OPTS.map((n) => (
                <option key={n} value={n}>{n}s</option>
              ))}
            </select>
            <button
              onClick={start}
              className="btn-glow bg-indigo-600 px-4 py-1 rounded text-sm font-medium"
            >
              Start
            </button>
          </div>
        )}
      </div>

      {status === "countdown" && (
        <div className="text-center text-white">
          <div className="text-5xl font-black drop-shadow-lg">{secondsLeft}</div>
          <div className="text-sm text-gray-300">Get ready…</div>
        </div>
      )}

      {status === "running" && (
        <>
          <div className={`relative rounded-lg overflow-hidden border-2 transition ${glow ? "border-indigo-400 shadow-lg shadow-indigo-500/50" : "border-transparent"}`}>
            {!camReady && <div className="skeleton h-48 w-full" />}
            <video ref={videoRef} className="w-full" autoPlay muted onLoadedData={() => setCamReady(true)} />
          </div>
          <div className="mt-4 text-center">
            <div className="text-4xl font-bold text-white drop-shadow-md">{count}</div>
            <div className="text-sm text-gray-300">squats</div>
          </div>
          <div className="mt-4 flex gap-2 justify-center">
            <button onClick={reset} className="px-4 py-2 rounded bg-gray-700/60 text-white hover:bg-gray-600 transition">Reset</button>
            <button onClick={confirm} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-500 transition">Confirm</button>
          </div>
        </>
      )}

      {status === "finished" && (
        <div className="text-center text-white">
          <div className="text-2xl font-bold mb-2">🎉 Done!</div>
          <div className="text-lg">{count} squats confirmed.</div>
          <button onClick={reset} className="mt-3 px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-500 transition">Again</button>
        </div>
      )}
    </div>
  );
}