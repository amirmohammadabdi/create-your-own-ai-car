# 🚗 Create Your AI Car

An interactive web application where you can **design, train, and test your own neural-network-powered car brain** — built entirely with **Next.js** and **TypeScript**, without using any external AI libraries.

> Everything — from neurons to connections to decision-making — is implemented from scratch.

---

## 🌟 Overview

**Create Your AI Car** allows you to:

1. 🧠 Build a neural network manually  
2. 🛣️ Design a custom road/path  
3. 🏎️ Test your AI car on the created path  

You have full control over neuron types, thresholds, connection weights, and structure — giving you a hands-on understanding of how neural networks work internally.

---

## 🧠 Neural Network Architecture

The brain consists of three types of neurons:

- **Sensory Neurons** – Receive environmental input  
- **Intermediate Neurons** – Process signals  
- **Action Neurons** – Control the car  

There are **four static action neurons**:
- They cannot be removed or moved.
- If you want to disable one:
  - Do not connect anything to it.
  - Set its threshold to maximum (most red).

---

## 🛠 How to Use the Platform

---

# 🧠 Creating the Brain

### ➕ Adding Neurons
- Select the neuron type from the panel.
- Left-click on the canvas to place it.

### 🖱 Moving Neurons
- Click and drag any neuron to reposition it.

### ❌ Removing Neurons
- Hover over a neuron.
- Right-click to remove it (this also removes its connections).

### 🔌 Connecting Neurons
- Select one neuron.
- Select another neuron to create a connection.
- Restrictions:
  - ❌ No connections between two sensory neurons.
  - ❌ No connections between two action neurons.

### 🎚 Setting Thresholds
- Only applies to **Intermediate** and **Action** neurons.
- Hover over the neuron.
- Use the **mouse wheel** to adjust.
- Color guide:
  - More red = higher threshold.

You can also randomize thresholds.

### ⚖ Setting Connection Weights
- Hover over the connection.
- Use the mouse wheel to adjust.
- Color guide:
  - 🔵 Blue = Negative weight
  - 🟡 Yellow = Positive weight

### 🧹 Unselecting
- Right-click empty canvas space to unselect a neuron.

---

# 🛣 Creating the Road

Design your own custom path for the car to follow.

### ➕ Adding Points
- Left-click to add path points.
- Points automatically connect via segments.

### ➖ Removing Points
- Hover over a point.
- Right-click to delete.

### 🔄 Moving Points
- Click and drag any point.

### ❌ Removing Segments
- Hover over a segment.
- Right-click to remove it.

### 📏 Creating Straight Lines
- Hold **Shift** while placing points.

### 🔍 Zooming
- Use mouse wheel to zoom in/out.

### 🖐 Panning
- Hold **Alt + Left Click** and drag.

### 🚦 Start & End Zones
You must:
- Add a **starting rectangle**
- Add an **ending rectangle**
- Then save the road

⚠ Important:
If you modify the road after placing start/end zones, they might not align correctly anymore.  
In that case, delete and recreate them.

---

# 🏎 Testing the Car

After building the brain and road:

1. Save both.
2. Start the simulation.
3. Watch your AI car react based on:
   - Sensory input
   - Weighted connections
   - Neuron thresholds

This allows you to experiment and understand how structural changes affect behavior.

---

## ⚙ Tech Stack

- ✅ Next.js
- ✅ TypeScript
- ✅ HTML Canvas API
- ✅ Zero external AI libraries
- ✅ Neural logic implemented manually

Everything — including:
- Neuron system
- Signal propagation
- Threshold logic
- Simulation engine

was built from scratch.

---

## 🎯 Educational Purpose

This project was created to:
- Deeply understand neural network fundamentals
- Explore how weights and thresholds affect decisions
- Learn advanced canvas interaction
- Strengthen TypeScript architecture skills
- Build a complete AI simulation system without dependencies

---

## 🚀 Getting Started

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
npm install
npm run dev
```

## Special Appreciation

I want to express my deepest appreciation to **Radu**.

Everything I know about building projects like this — from neural networks to architecture thinking and problem solving — comes from learning through Radu’s teachings.

This project would not exist without that foundation.

Thank you for:
- Teaching concepts clearly and deeply
- Encouraging building from scratch
- Inspiring real understanding instead of shortcuts
- Showing how to think like a developer

This project is a reflection of that learning journey.