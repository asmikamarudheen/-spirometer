# 🌬️ BreatheQuest

**Turn Every Breath Into Progress**

BreatheQuest is an open-source web application designed to gamify respiratory physical therapy. By utilizing a standard webcam and computer vision, it transforms the mundane task of using an incentive spirometer into an engaging, interactive game for patients recovering from surgery or managing respiratory conditions.

![BreatheQuest Dashboard](public/bg-cave.jpg)

## 🚀 Features

*   **Real-time Computer Vision:** Uses `opencv.js` running entirely in the browser (WebAssembly) to track the indicator ball of a standard plastic incentive spirometer at 60fps.
*   **Zero-Friction Setup:** No apps to download, no hardware to buy, and no complex calibration. Patients just point their laptop webcam at their spirometer.
*   **Privacy First:** All video processing happens client-side in the browser. No video data is ever sent to a server.
*   **Multi-Game Architecture:** Features a modular game engine that translates breath volume into generic score metrics.
    *   💎 **Diamond Mine:** Use your inhale power as a vacuum tractor beam to pull in coins, crystals, and giant diamonds.
    *   🎯 **Prehistoric Javelin:** Fill up your breath power gauge to hurl a javelin across a prehistoric landscape. The deeper the breath, the further it flies!
*   **Mobile Responsive:** Fully playable on smartphones, tablets, and desktop computers.

## 🛠️ Tech Stack

*   **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
*   **UI Library:** [React](https://react.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Computer Vision:** [OpenCV.js](https://docs.opencv.org/4.x/d5/d10/tutorial_js_root.html)
*   **Icons:** [Lucide React](https://lucide.dev/)

## 💻 Getting Started (Local Development)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/modamaan/spirometer.git
    cd spirometer
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open the app:**
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser. Ensure your browser has camera permissions enabled.

## 🔮 Roadmap: Production Accuracy

The current prototype uses **HSV Color Thresholding** to track the red ball. While fast and effective for prototyping, it is sensitive to lighting changes and "The Elevator Cheat" (moving the device up and down manually). 

Future iterations will explore two primary paths for medical-grade production accuracy:
1.  **Software Only (Vision AI):** Replacing OpenCV with a custom lightweight Object Detection model (e.g., YOLOv8-Nano via TensorFlow.js) trained to track the distance *between* the spirometer base and the ball, effectively neutralizing environmental and movement interference.
2.  **Hardware Integration (ESP32):** Developing a cheap, Bluetooth-enabled (BLE) hardware clip utilizing an ESP32 and a Time-of-Flight (ToF) laser sensor that attaches to existing spirometers for foolproof, clinical-grade volumetric accuracy.

---
*Disclaimer: BreatheQuest is an experimental prototype and is not a certified medical diagnostic device.*
