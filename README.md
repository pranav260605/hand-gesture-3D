# 🖐️ 3D Hand Gesture AR (aka The Tony Stark Simulator)

Ever wanted to feel like Tony Stark manipulating holograms with your bare hands? 

Welcome to a purely browser-based, zero-controller Augmented Reality experiment. No VR headset required. No heavy backend processing. Just you, your webcam, and a whole lot of math running in real-time.

🎥 **[Click here to watch the direct video demo!](https://pranav260605.github.io/hand-gesture-3d/demo.mp4)**
*(Replace YOUR_USERNAME in this link with your actual GitHub username)*

## 🚀 What is happening here?
I built a spatial computing interface straight in the browser. It tracks your hand landmarks at 60fps and maps them into a 3D coordinate system. 

*   **Creation:** Bring both hands into the frame, pinch your fingers, and pull them apart to spawn and scale 3D wireframe geometry out of thin air.
*   **Telekinesis:** Drop a hand, pinch an existing shape, and physically drag it across your room.
*   **The Void:** Drag a shape down to the bottom of your screen to obliterate it into the digital recycle bin.

## 🛠️ Tech Stack
*   **React, Three.js, & React Three Fiber** 
*   **Google MediaPipe Vision** 
*   **Vite** 

## 💻 Run it locally
Clone it, install it, and become a wizard on your own machine.
```bash
npm install
npm run dev