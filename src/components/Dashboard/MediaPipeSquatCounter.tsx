'use client';

import { useRef, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Camera, Play, Square, RotateCcw } from 'lucide-react';
import { useSupabase } from '@/lib/supabase-context';
import type { ExerciseSession } from '@/types';

interface Props {
  userId: string;
  onExerciseSaved?: () => void; // Callback to trigger refresh
}

export function MediaPipeSquatCounter({ userId, onExerciseSaved }: Props) {
  const supabase = useSupabase();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [squatCount, setSquatCount] = useState(0);
  const [feedback, setFeedback] = useState('Stand straight to begin');
  const [sessionStart, setSessionStart] = useState<Date | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0); // Track duration
  
  const poseLandmarkerRef = useRef<any>(null);
  const animationFrameRef = useRef<number>();
  const squatState = useRef<'up' | 'down'>('up');
  const sessionStartTimeRef = useRef<number>(0); // For precise timing
  const minConfidence = 0.7;

  useEffect(() => {
    loadMediaPipe();
    return () => {
      stopDetection();
    };
  }, []);

  const loadMediaPipe = async () => {
    try {
      const vision = await import('@mediapipe/tasks-vision');
      const { PoseLandmarker, FilesetResolver } = vision;

      const filesetResolver = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(
        filesetResolver,
        {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numPoses: 1,
          minPoseDetectionConfidence: minConfidence,
          minPosePresenceConfidence: minConfidence,
          minTrackingConfidence: minConfidence,
        }
      );
      setIsLoaded(true);
    } catch (error) {
      toast.error('Failed to load MediaPipe model');
      console.error(error);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        detectPoses();
      }
    } catch (error) {
      toast.error('Failed to access camera');
      console.error(error);
    }
  };

  const detectPoses = () => {
    if (!videoRef.current || !canvasRef.current || !poseLandmarkerRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const detect = async () => {
      const timestamp = performance.now();
      const results = await poseLandmarkerRef.current.detectForVideo(video, timestamp);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (results.landmarks && results.landmarks[0]) {
        const landmarks = results.landmarks[0];
        
        drawPoseLandmarks(ctx, landmarks, canvas.width, canvas.height);
        checkSquatForm(landmarks);
      }

      animationFrameRef.current = requestAnimationFrame(detect);
    };

    detect();
  };

  const drawPoseLandmarks = (ctx: CanvasRenderingContext2D, landmarks: any[], width: number, height: number) => {
    const connections = [
      [11, 12], [11, 23], [12, 24], [23, 24], [23, 25], [24, 26],
      [25, 27], [26, 28], [27, 29], [28, 30], [29, 31], [30, 32],
    ];

    ctx.strokeStyle = '#0891b2';
    ctx.lineWidth = 3;
    connections.forEach(([start, end]) => {
      if (landmarks[start] && landmarks[end]) {
        ctx.beginPath();
        ctx.moveTo(landmarks[start].x * width, landmarks[start].y * height);
        ctx.lineTo(landmarks[end].x * width, landmarks[end].y * height);
        ctx.stroke();
      }
    });

    landmarks.forEach((landmark, i) => {
      if (i >= 11 && i <= 32) {
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(landmark.x * width, landmark.y * height, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  };

  const checkSquatForm = (landmarks: any[]) => {
    const leftHip = landmarks[23];
    const leftKnee = landmarks[25];
    const leftAnkle = landmarks[27];
    const leftShoulder = landmarks[11];

    if (!leftHip || !leftKnee || !leftAnkle || !leftShoulder) return;

    const hipKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const kneePosition = leftKnee.y;
    const hipPosition = leftHip.y;
    const shoulderPosition = leftShoulder.y;

    if (squatState.current === 'up' && hipKneeAngle < 140 && kneePosition > shoulderPosition) {
      squatState.current = 'down';
      setFeedback('Good! Now push up');
    } else if (squatState.current === 'down' && hipKneeAngle > 160) {
      squatState.current = 'up';
      setSquatCount(prev => prev + 1); // ✅ Just increment counter, don't save yet
      setFeedback('Great! Another rep!');
    } else if (squatState.current === 'down' && hipKneeAngle < 90) {
      setFeedback('Too deep! Keep knees at 90°');
    } else if (squatState.current === 'up') {
      setFeedback('Ready to squat');
    }
  };

  const calculateAngle = (a: any, b: any, c: any): number => {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * (180 / Math.PI));
    if (angle > 180) angle = 360 - angle;
    return angle;
  };

  const saveSession = async () => {
    try {
      const duration = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
      
      const insertData = {
        user_id: userId,
        exercise_type: 'squat',
        session_date: new Date().toISOString(),
        count: squatCount,
        duration_seconds: duration,
        notes: `AI session: ${squatCount} squats in ${duration}s`,
      } as const;

      console.log('Saving session:', insertData);

      const { error } = await supabase.from('exercise_sessions').insert([insertData]);

      if (error) {
        console.error('Save error:', error);
        toast.error(`Session save failed: ${error.message}`);
        return;
      }

      toast.success(`Session saved: ${squatCount} squats in ${duration} seconds!`);
      
      // Trigger parent refresh
      if (onExerciseSaved) {
        onExerciseSaved();
      }
    } catch (error) {
      console.error('Exception in saveSession:', error);
    }
  };

  const startDetection = async () => {
    if (!isLoaded) return;
    setIsDetecting(true);
    setSessionStart(new Date());
    sessionStartTimeRef.current = Date.now();
    setSquatCount(0);
    setSessionDuration(0);
    setFeedback('Stand straight to begin');
    await startCamera();
  };

  const stopDetection = () => {
    setIsDetecting(false);
    
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Calculate final duration and save session
    if (sessionStartTimeRef.current && squatCount > 0) {
      const duration = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
      setSessionDuration(duration);
      saveSession(); // ✅ Save ONE record with total count and duration
    } else if (squatCount === 0) {
      toast.info('No squats detected in session');
    }
  };

  const resetCounter = () => {
    setSquatCount(0);
    setFeedback('Stand straight to begin');
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-teal-100 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">AI Squat Counter</h3>
        {!isLoaded && (
          <div className="text-sm text-yellow-600">Loading AI model...</div>
        )}
      </div>

      <div className="relative">
        {!isDetecting ? (
          <div className="h-64 flex flex-col items-center justify-center bg-white rounded-xl border-2 border-dashed border-teal-200">
            <Camera className="w-16 h-16 text-gray-500 mb-4" />
            <p className="text-gray-500 mb-4">Camera is off</p>
            <button
              onClick={startDetection}
              disabled={!isLoaded}
              className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition"
            >
              <Play className="w-5 h-5" />
              Start Session
            </button>
          </div>
        ) : (
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full rounded-lg border border-teal-100"
              playsInline
              muted
              style={{ transform: 'scaleX(-1)' }}
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              style={{ transform: 'scaleX(-1)' }}
            />
            {sessionDuration > 0 && (
              <div className="absolute top-4 right-4 bg-white/90 rounded-lg p-2 border border-teal-100">
                <div className="text-sm font-bold text-gray-900">{sessionDuration}s</div>
              </div>
            )}
            <div className="absolute top-4 left-4 bg-white/90 rounded-lg p-4 border border-teal-100">
              <div className="text-3xl font-bold text-teal-600">{squatCount}</div>
              <div className="text-sm text-gray-600">Squats</div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 rounded-lg p-3 border border-teal-100">
              <div className="text-sm text-gray-900 text-center">{feedback}</div>
            </div>
          </div>
        )}
      </div>

      {isDetecting && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={stopDetection}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition"
          >
            <Square className="w-4 h-4" />
            End Session
          </button>
          <button
            onClick={resetCounter}
            className="p-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition"
            title="Reset Counter"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}