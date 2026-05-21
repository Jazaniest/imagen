# 🎨 Image Agent App

AI-powered image transformation app with 5 wildly different agents. Upload an image, get a transformed image back.

## Features

| Agent | Description |
|---|---|
| 🤠 Wanted Poster | Turn any photo into a Wild West wanted poster |
| 🐾 Pet → Human | Reimagine your pet as a human character |
| 🔬 Food Autopsy | Scientific cross-section diagram of any dish |
| 🎵 Album Cover | Any photo → cinematic album cover |
| 🏠 Cursed Diorama | Shrink any room into a miniature diorama |

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure API Key

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then edit `.env` and add your lunos.tech API key:

```
VITE_LUNOS_API_KEY=your_actual_api_key_here
```

### 3. Run the app

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Tech Stack

- **React 18** + **Vite**
- **Tailwind CSS** for styling
- **bytedance-seed/seedream-4.5** model via [lunos.tech](https://lunos.tech)

## Image Input

Users can upload images via:
- 📁 Click to browse files
- 🖱️ Drag and drop
- 📋 Paste from clipboard (Ctrl+V / Cmd+V)

Images are sent as base64 to the API. Supported formats: JPG, PNG, WebP, GIF.

## Build for Production

```bash
npm run build
```