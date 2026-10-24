import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { useStore } from "./store";

let handLandmarker: HandLandmarker;
let isTrackerReady = false;

export const initializeHandTracker = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/wasm"
  );
  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
      delegate: "GPU"
    },
    runningMode: "VIDEO",
    numHands: 2,
    minHandDetectionConfidence: 0.5,
    minHandPresenceConfidence: 0.5,
    minTrackingConfidence: 0.5
  });
  isTrackerReady = true;
};

export const detectHands = (video: HTMLVideoElement, time: number) => {
  if (!isTrackerReady || !video || video.readyState !== 4) return;
  const results = handLandmarker.detectForVideo(video, time);
  
  useStore.getState().setHandLandmarks(results.landmarks);
};