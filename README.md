# Meeting Notes App

[![CI/CD Pipeline](https://github.com/yourusername/meeting-notes/workflows/Basic%20CI/badge.svg)](https://github.com/yourusername/meeting-notes/actions)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/meeting-notes)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, clean meeting transcription application built with Next.js and TypeScript, featuring a 90s Apple-inspired aesthetic. This app allows you to record meetings, generate real-time transcripts, and manage your meeting library with powerful search and export capabilities.

![Meeting Notes App](https://via.placeholder.com/800x400/f5f5f5/333333?text=Meeting+Notes+App+Screenshot)

## ✨ Features

### 🎙️ Recording & Transcription
- **High-quality audio recording** with configurable sample rates and channels
- **Real-time transcription** using Web Speech API with fallback mock engine
- **Live audio level monitoring** with visual feedback
- **Speaker detection** and timestamp tracking
- **Pause/resume functionality** during recordings

### 🔍 Advanced Search & Filtering
- **Full-text search** across meeting titles, participants, and topics
- **Advanced filtering** by date range, duration, participants, topics, and status
- **Real-time search results** with highlighted matches
- **Saved search filters** for quick access

### 📊 Meeting Management
- **Comprehensive dashboard** with meeting statistics and overview
- **Detailed meeting view** with tabbed interface (Overview, Transcript, Summary, Audio)
- **Meeting cards** with status indicators and quick actions
- **Grid and list view modes** for flexible browsing

### 📤 Export Capabilities
- **Multiple export formats**: Plain text, Markdown, JSON, PDF, and audio files
- **Customizable export content** with preview functionality
- **Batch export options** for multiple meetings
- **Professional formatting** for shared documents

### ⚙️ Settings & Customization
- **Audio settings**: Sample rate, channel count, noise reduction, auto-gain
- **Transcription settings**: Language selection, speaker detection, punctuation
- **Storage management**: Local storage limits, retention policies, auto-cleanup
- **Privacy controls**: Local-only processing, encryption options

### ⌨️ Keyboard Shortcuts
- **Global shortcuts**: Navigation, search, new meetings
- **Recording controls**: Start/stop/pause with keyboard
- **Quick actions**: Export, settings, dashboard navigation
- **Help dialog**: Built-in shortcut reference (press `?`)

### 📱 Responsive Design
- **Mobile-first approach** with touch-friendly interfaces
- **Adaptive layouts** for different screen sizes
- **Sidebar overlay** on mobile devices
- **Optimized typography** for readability across devices

### 🎨 90s Apple Aesthetic
- **Sharp, geometric design** with precise borders and spacing
- **Classic Mac color palette** with clean grays and Apple blue
- **8-point grid system** for consistent spacing
- **Typography hierarchy** inspired by classic Apple interfaces
- **Subtle animations** with Apple's easing curves

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or later
- npm, yarn, or pnpm

### Installation

1. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

3. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Tech Stack

### Core Technologies
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[React 19](https://react.dev/)** - User interface library
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework

### State Management & Data
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[TanStack Query](https://tanstack.com/query)** - Server state management
- **[IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)** - Local database storage

### UI Components & Styling
- **[Radix UI](https://www.radix-ui.com/)** - Headless UI components
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Class Variance Authority](https://cva.style/docs)** - Component variants

### Audio & Transcription
- **[Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)** - Audio processing
- **[MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)** - Audio recording
- **[Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)** - Speech recognition

## 📁 Project Structure

```
MeetingNotes/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── audio/            # Recording interfaces
│   ├── export/           # Export functionality
│   ├── help/             # Help and documentation
│   ├── layout/           # Layout components
│   ├── meeting/          # Meeting-related components
│   ├── search/           # Search and filtering
│   ├── settings/         # Settings dialogs
│   └── ui/               # Reusable UI components
├── hooks/                # Custom React hooks
├── lib/                  # Core libraries and utilities
├── stores/               # Zustand stores
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## 🎯 Key Components

### Audio Engine (`lib/audio-engine.ts`)
- Web Audio API integration
- Real-time audio level monitoring
- Multi-format recording support
- Noise reduction and audio enhancement

### Transcription Engine (`lib/transcription-engine.ts`)
- Web Speech API integration
- Mock engine for development
- Speaker detection algorithms
- Confidence scoring

### Meeting Store (`stores/meeting-store.ts`)
- Centralized state management
- Recording state tracking
- Search and filter management
- Settings persistence

### Storage System (`lib/storage.ts`)
- IndexedDB integration
- Meeting metadata storage
- Audio file management
- Export functionality

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘ + N` | Start new meeting |
| `⌘ + K` | Open search |
| `⌘ + D` | Go to dashboard |
| `⌘ + ,` | Open settings |
| `⌘ + ⇧ + R` | Start recording |
| `⌘ + ⇧ + S` | Stop recording |
| `⌘ + ⇧ + P` | Pause/resume recording |
| `⌘ + E` | Export current meeting |
| `⌘ + B` | Toggle sidebar |
| `?` | Show keyboard shortcuts |

## 🎨 Design System

### Color Palette
The app uses a carefully crafted color system inspired by classic Apple interfaces:

- **Primary**: Bright Apple blue (`hsl(210, 100%, 40%)`)
- **Background**: Classic Mac gray (`hsl(0, 0%, 96%)`)
- **Card**: Pure white (`hsl(0, 0%, 100%)`)
- **Muted**: Light gray backgrounds (`hsl(0, 0%, 92%)`)
- **Border**: Clean, precise borders (`hsl(0, 0%, 88%)`)

### Typography
- **Display**: SF Pro Display for headings (28px)
- **Titles**: SF Pro Display for subheadings (24px, 20px, 18px)
- **Body**: SF Pro Text for content (14px)
- **Caption**: SF Pro Text for metadata (12px)

### Spacing System
8-point grid system for consistent spacing:
- `grid-1`: 8px
- `grid-2`: 16px
- `grid-3`: 24px
- `grid-4`: 32px
- `grid-6`: 48px
- `grid-8`: 64px

## 🔧 Configuration

### Audio Settings
Configure recording quality in settings:
- Sample rates: 22.05kHz, 44.1kHz, 48kHz
- Channels: Mono, Stereo
- Enhancement: Noise reduction, auto-gain control

### Transcription Settings
Customize transcription behavior:
- Language selection (9+ languages supported)
- Speaker detection toggle
- Confidence threshold adjustment
- Smart punctuation

### Storage Settings
Manage local storage:
- Maximum storage size limits
- Retention period configuration
- Auto-cleanup policies

## 📱 Usage

### Starting a Meeting
1. Click "New Meeting" in the sidebar or dashboard
2. Enter a meeting title and optional participants
3. Click "Start Recording" to begin (⌘⇧R)
4. Grant microphone permissions when prompted

### During Recording
- View real-time audio levels with visual feedback
- See live transcription as participants speak
- Pause/resume recording as needed (⌘⇧P)
- Monitor recording duration and status

### After Recording
- Automatic saving to local IndexedDB storage
- View meeting in dashboard with statistics
- Access transcript, audio, and meeting details
- Export in multiple formats or share

### Managing Meetings
- Browse all meetings in the dashboard
- Use advanced search and filtering options
- Click any meeting to view detailed information
- Delete meetings you no longer need

## 🚀 Deployment & CI/CD

### Quick Deployment Options

#### Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/meeting-notes)

1. Connect your repository to Vercel
2. Deploy with default settings
3. No additional configuration required

#### Other Platforms
- **Netlify**: Connect repo, build command: `npm run build`
- **Railway**: Auto-detects Next.js, zero configuration
- **Docker**: Use included Dockerfile for containerized deployment

### CI/CD Pipeline

This project includes comprehensive GitHub Actions workflows:

#### Continuous Integration
- ✅ **Automated testing** on every push and pull request
- ✅ **ESLint** code quality checks
- ✅ **TypeScript** type checking
- ✅ **Prettier** code formatting validation
- ✅ **Multi-Node.js version** testing (18.x, 20.x)
- ✅ **Build verification** to ensure deployment readiness

#### Continuous Deployment
- 🚀 **Automatic preview deployments** for pull requests
- 🚀 **Production deployments** on main branch pushes
- 📊 **Build artifacts** and deployment status tracking
- 💬 **Automated PR comments** with build status

#### Workflow Files
- `.github/workflows/basic-ci.yml` - Essential CI checks
- `.github/workflows/ci.yml` - Full CI/CD with Vercel deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🔒 Privacy & Security

### Local-First Approach
- All data stored locally in IndexedDB
- No external API calls for core functionality
- Complete offline capability after initial load
- User owns and controls all meeting data

### Browser Permissions
- Microphone access required for recording
- Storage quota for local meeting data
- Transparent permission handling with user consent

## 📄 Browser Support

### Required Features
- Web Audio API for recording
- MediaRecorder API for audio files
- Web Speech API for transcription (with fallback)
- IndexedDB for local storage
- ES2022 support

### Recommended Browsers
- Chrome 91+ (full feature support)
- Firefox 88+ (full feature support)
- Safari 14+ (limited transcription)
- Edge 91+ (full feature support)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

### Development Guidelines
- Follow the existing code style and conventions
- Add TypeScript types for all new code
- Include JSDoc comments for complex functions
- Test your changes across different devices and browsers
- Maintain the 90s Apple aesthetic in new UI components

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by classic Apple interface design from the 1990s
- Built with modern web technologies and best practices
- Community feedback and contributions welcome

---

**Made with ❤️ and a lot of ☕ by a team that loves clean, functional design**