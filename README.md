# 🖐️ 3D Hand Gesture AR (aka The Tony Stark Simulator)

A browser-based Augmented Reality application that uses a webcam and MediaPipe hand tracking to create, scale, and move 3D objects using hand gestures. 

🔗 **[View Live Interactive App](https://hand-gesture-3-d-lemon.vercel.app/)**  
🎥 **[Watch Direct Video Demo](https://pranav260605.github.io/hand-gesture-3D/demo.mp4)**

## 🚀 Features
*   **Creation:** Bring both hands into frame, pinch fingers, and pull them apart to spawn and scale 3D geometry.
*   **Telekinesis:** Grab and drag existing shapes across the scene with one hand.
*   **Deletion:** Drag shapes into the dynamic recycle bin zone at the bottom to remove them.

## 🛠️ Tech Stack
*   React & Vite (Frontend)
*   Three.js & React Three Fiber (3D Graphics)
*   Google MediaPipe Vision (Real-time Hand Landmark Tracking)
*   Zustand (State Management)

## 💻 Run Locally
```bash
git clone [https://github.com/pranav260605/hand-gesture-3D.git](https://github.com/pranav260605/hand-gesture-3D.git)
cd hand-gesture-3D
npm install
npm run dev