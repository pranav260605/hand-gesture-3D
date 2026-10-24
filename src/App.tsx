import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Canvas } from '@react-three/fiber';
import { Trash2 } from 'lucide-react';
import { initializeHandTracker, detectHands } from './HandTracker';
import { Scene } from './Scene';

function App() {
  const webcamRef = useRef<Webcam>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const setupAI = async () => {
      await initializeHandTracker();
      setIsLoading(false);
      
      const detectLoop = () => {
        if (webcamRef.current && webcamRef.current.video) {
          detectHands(webcamRef.current.video, performance.now());
        }
        requestAnimationFrame(detectLoop);
      };
      detectLoop();
    };
    setupAI();
  }, []);

  return (
    <div className="app-container">
      {isLoading && <div className="loading">Loading AI Vision Models...</div>}
      
      <Webcam
        ref={webcamRef}
        className="webcam-feed"
        mirrored={true}
        videoConstraints={{ facingMode: "user" }}
      />
      
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <Scene />
        </Canvas>
      </div>

      <div className="ui-overlay">
        <div className="instructions">
          <h1>AR Hand Gestures</h1>
          <p>👉 <b>Create:</b> Bring both hands into frame, pinch fingers together, and move hands close.</p>
          <p>↔️ <b>Scale:</b> While pinching with both hands, move hands apart to resize.</p>
          <p>👆 <b>Move:</b> Pinch a shape with one hand to drag it.</p>
          <p>🗑️ <b>Delete:</b> Drag a shape into the recycle bin below.</p>
        </div>

        <div className="trash-bin">
          <Trash2 size={48} />
          <span>Recycle Bin</span>
        </div>
      </div>
    </div>
  );
}

export default App;