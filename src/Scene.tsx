import { useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useStore, ShapeType } from './store';
import * as THREE from 'three';

const SHAPE_COLORS = ['#00ff00', '#ff8800', '#ff00ff', '#00ffff'];
const SHAPE_TYPES: ShapeType[] = ['cylinder', 'box', 'cone', 'sphere'];
const PINCH_THRESHOLD = 0.05;

export const Scene = () => {
  const { shapes, handLandmarks, addShape, updateShape, removeShape } = useStore();
  const { viewport } = useThree();
  
  const [activeShapeId, setActiveShapeId] = useState<string | null>(null);
  // ADDED 'cooldown' TO THE STATE HERE:
  const [interactionMode, setInteractionMode] = useState<'idle' | 'creating' | 'moving' | 'cooldown'>('idle');
  const [initialScaleDist, setInitialScaleDist] = useState(0);
  const [initialShapeScale, setInitialShapeScale] = useState(1);

  const mapToWorld = (x: number, y: number) => {
    const mappedX = -(x - 0.5) * viewport.width;
    const mappedY = -(y - 0.5) * viewport.height;
    return new THREE.Vector3(mappedX, mappedY, 0);
  };

  useFrame(() => {
    if (handLandmarks.length === 0) {
      setInteractionMode('idle');
      setActiveShapeId(null);
      return;
    }

    const hands = handLandmarks.map(landmarks => {
      const thumb = landmarks[4];
      const index = landmarks[8];
      
      const thumbWorld = mapToWorld(thumb.x, thumb.y);
      const indexWorld = mapToWorld(index.x, index.y);
      
      const pinchDist = Math.sqrt(Math.pow(thumb.x - index.x, 2) + Math.pow(thumb.y - index.y, 2));
      const isPinching = pinchDist < PINCH_THRESHOLD;
      const midpoint = thumbWorld.clone().lerp(indexWorld, 0.5);

      return { isPinching, midpoint };
    });

    // 2-Hand Gesture Logic: Create & Scale
    if (hands.length === 2 && hands[0].isPinching && hands[1].isPinching) {
      const distBetweenHands = hands[0].midpoint.distanceTo(hands[1].midpoint);
      const centerPoint = hands[0].midpoint.clone().lerp(hands[1].midpoint, 0.5);

      if (interactionMode === 'idle' && distBetweenHands < 2.5) {
        const newId = Math.random().toString(36).substring(2, 9);
        addShape({
          id: newId,
          type: SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)],
          position: [centerPoint.x, centerPoint.y, 0],
          scale: 1,
          color: SHAPE_COLORS[Math.floor(Math.random() * SHAPE_COLORS.length)],
        });
        setActiveShapeId(newId);
        setInteractionMode('creating');
        setInitialScaleDist(distBetweenHands);
        setInitialShapeScale(1);
      } else if (interactionMode === 'creating' && activeShapeId) {
        const scaleFactor = distBetweenHands / initialScaleDist;
        const newScale = Math.max(0.2, initialShapeScale * scaleFactor);
        updateShape(activeShapeId, { 
          scale: newScale,
          position: [centerPoint.x, centerPoint.y, 0] 
        });
      }
      return; 
    }

    // 1-Hand Gesture Logic: Move & Delete
    if (hands.length >= 1 && hands[0].isPinching) {
      const handPos = hands[0].midpoint;
      
      if (interactionMode === 'idle') {
        let closestId = null;
        let minDist = 3.0; 
        
        shapes.forEach(shape => {
          const sPos = new THREE.Vector3(...shape.position);
          const dist = sPos.distanceTo(handPos);
          if (dist < minDist) {
            minDist = dist;
            closestId = shape.id;
          }
        });

        if (closestId) {
          setActiveShapeId(closestId);
          setInteractionMode('moving');
        }
      } else if (interactionMode === 'moving' && activeShapeId) {
        updateShape(activeShapeId, { position: [handPos.x, handPos.y, 0] });
        
        const trashZoneY = -(viewport.height * 0.25);
        
        if (handPos.y < trashZoneY) {
          removeShape(activeShapeId);
          setActiveShapeId(null);
          // SET TO COOLDOWN: Forces you to un-pinch before grabbing another shape
          setInteractionMode('cooldown');
        }
      }
    } else {
      // WHEN YOU UN-PINCH: Resets cooldown back to idle
      setInteractionMode('idle');
      setActiveShapeId(null);
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {shapes.map((shape) => {
        let Geometry;
        switch (shape.type) {
          case 'box': Geometry = <boxGeometry args={[1, 1, 1]} />; break;
          case 'cylinder': Geometry = <cylinderGeometry args={[0.5, 0.5, 1, 16]} />; break;
          case 'cone': Geometry = <coneGeometry args={[0.5, 1, 16]} />; break;
          case 'sphere': Geometry = <sphereGeometry args={[0.6, 16, 16]} />; break;
        }

        return (
          <mesh 
            key={shape.id} 
            position={new THREE.Vector3(...shape.position)} 
            scale={shape.scale}
            rotation={[0.5, 0.5, 0]}
          >
            {Geometry}
            <meshBasicMaterial 
              color={shape.color} 
              wireframe 
              wireframeLinewidth={2}
            />
          </mesh>
        );
      })}

      {handLandmarks.map((landmarks, index) => {
        const thumbWorld = mapToWorld(landmarks[4].x, landmarks[4].y);
        const indexWorld = mapToWorld(landmarks[8].x, landmarks[8].y);
        return (
          <group key={`hand-${index}`}>
            <mesh position={thumbWorld}>
              <sphereGeometry args={[0.1]} />
              <meshBasicMaterial color="#00ffff" />
            </mesh>
            <mesh position={indexWorld}>
              <sphereGeometry args={[0.1]} />
              <meshBasicMaterial color="#00ffff" />
            </mesh>
          </group>
        );
      })}
    </>
  );
};