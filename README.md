# AR Campus Tour

An interactive **Web-based Augmented Reality (AR) Campus Tour** built using **8th Wall WebAR** and **A-Frame**.  
The application allows users to explore a university campus through AR markers, guided navigation, and interactive information panels.

---

## 🎯 Project Goal

The goal of this project is to create an immersive **AR campus tour experience** that helps users explore different campus locations in an intuitive and engaging way using their mobile device.

The project fulfills the requirements of an **XR (AR) semester project**, focusing on:
- Real-world interaction
- Clear user guidance
- Multiple interaction methods
- Responsive UI/UX design

---

## 📱 Features

- 🌍 **Web-based AR experience** (no app installation required)
- 📍 **Interactive AR markers** for campus locations
- 🧭 **Guided tour navigation** using arrows and “Next Spot”
- 📊 **Progress tracking** (Visited X/Y locations)
- 🖼 **Information panels** with images and descriptions
- 🔊 **Background ambient audio** with mute/unmute option
- ❓ **Help & instruction overlay**
- ♻️ **Tour restart & completion celebration**
- 💾 **Progress saved using LocalStorage**
- 📱 **Mobile-first responsive UI**

---

## 🏫 Campus Locations Included

1. Main Entrance  
2. Cafeteria & Foyer  
3. Library  
4. Academic Blocks  
5. Medical Lab  
6. Outdoor Seating Area  

The system is **scalable** — new locations can be added by extending the data model without changing core logic.

---

## 🕹 Interaction Methods (Requirement Fulfilled)

The application supports **multiple interaction types**:

- **UI Interaction**  
  - Start Tour, Next Spot, Restart buttons  
  - Help (`?`) button  
  - Mute/Unmute audio  

- **Object Interaction**  
  - Tapping AR markers  
  - Tapping navigation arrows  

- **Touch / Gesture Interaction**  
  - Mobile touch input for selecting objects and UI  

- **Audio Interaction**  
  - User-controlled background music  

---

## 🧠 Technology Stack

- **8th Wall WebAR**
- **A-Frame**
- **JavaScript**
- **HTML5 / CSS3**
- **WebXR**

---

## 🧭 User Guidance & UX Concept

- A **welcome overlay** introduces the experience
- On-screen instructions guide first-time users
- Floating markers visually indicate points of interest
- A **Help panel** is accessible at any time
- Visual feedback highlights the current location
- Clear progress indicators help users understand tour status

---

## ⚠️ Error Handling & Fallbacks

- If AR markers are not visible, users are instructed to:
  - Move the device slowly
  - Scan the environment
- Fallback geometry is used if 3D models fail to load
- Audio playback respects browser autoplay policies and starts only after user interaction

---

## ♿ Accessibility Considerations

- Large, high-contrast buttons for easy touch interaction
- Minimal text with readable font sizes
- Audio can be muted at any time
- Simple navigation flow suitable for a wide range of users

---

## 🤖 AI / Computer Vision Usage

The application uses **SLAM-based world tracking and surface detection** provided by 8th Wall, which relies on:
- Computer vision
- Environment understanding
- Device pose estimation

This enables accurate placement of AR content in the real world.

---

## 🌐 Multi-Platform Support

- Built on **WebXR**
- Runs on modern mobile browsers
- Cross-platform (Android & iOS compatible)

---

## 🎥 Demo Video

▶️ **Demo Video Link:**  
PASTE YOUR DEMO VIDEO LINK HERE

(Video duration: ≥ 60 seconds)

---

## 📂 Repository Structure


---

## 📝 Notes

- The demo video was recorded indoors / in low-light conditions.
- For best AR tracking results, the application is intended to be used outdoors in daylight.
- The project was developed and tested on mobile devices.

---

## 👨‍🎓 Author

**Rohail Ahmad**  
Semester Project – XR / AR Development

---

## ✅ Project Status

✔ Fully implemented  
✔ Meets all MUST requirements  
✔ Meets SHOULD requirements  
✔ Includes additional features beyond minimum scope  


