# Design Guidelines: Color Sync LED Ambilight App

## Architecture Decisions

### Authentication
**No Authentication Required**
- This is a single-user utility app with local device functionality
- Data (crop settings, ESP IP configuration) stored locally via AsyncStorage
- **Include a Settings/Profile screen with:**
  - User-customizable avatar (1 preset neon/tech-themed avatar)
  - Display name field
  - App preferences (theme toggle, LED count settings, UDP port)

### Navigation
**Stack-Only Navigation**
- The app has a single primary flow: Camera → Calibration → LED Control
- No tab bar needed - this is a focused utility
- Floating action buttons for key controls

**Screen Structure:**
1. **Main Camera Screen** (root) - Live camera feed with active LED sync
2. **Calibration Modal** - Overlay for TV corner selection
3. **Settings Screen** - Pushed from header button
4. **ESP Configuration Screen** - Network settings for UDP connection

---

## Screen Specifications

### 1. Main Camera Screen
**Purpose:** Real-time camera capture with LED color synchronization

**Layout:**
- **Header:** Transparent, custom navigation header
  - Left: Settings icon button
  - Center: App title "Color Sync"
  - Right: Info icon (shows connection status)
- **Main Content:** Full-screen camera preview (not scrollable)
  - 10x10 grid overlay (subtle, semi-transparent white lines, 0.5 opacity)
  - Cropped area highlighted with green border (2px solid, when calibration saved)
  - Floating elements:
    - Bottom center: Calibration button (pill-shaped, 120px wide, with icon)
    - Bottom right: Power toggle (circular, 56px diameter) - enables/disables LED sync
    - Connection status indicator (top right corner, small badge)

**Safe Area Insets:**
- Top: `insets.top + Spacing.xl` (transparent header)
- Bottom: `insets.bottom + Spacing.xl`
- Sides: `Spacing.lg`

**Components:**
- Camera view (expo-camera)
- Grid overlay (SVG lines)
- Crop area border (animated border when active)
- Floating action buttons with drop shadows

---

### 2. Calibration Modal
**Purpose:** Allow user to select 4 corners of TV screen within camera view

**Layout:**
- **Header:** Semi-transparent dark overlay bar
  - Left: "Cancel" text button
  - Center: "Calibrate TV Area"
  - Right: "Save" text button (highlighted in accent color)
- **Main Content:** Camera preview with interactive overlay
  - 4 draggable corner handles (circular, 44x44px touch targets)
  - Corner handles connected by animated dashed lines (green when valid, red when invalid)
  - Semi-transparent blue fill inside selected area (0.2 opacity)
  - Instruction text at top: "Drag corners to match your TV screen"

**Safe Area Insets:**
- Full screen with overlay
- Corner handles must be at least 44px from screen edges
- Instruction text: `insets.top + Spacing.xl`

**Interaction:**
- Pan gesture on each corner handle
- Haptic feedback on drag start/end
- Visual snap animation when corners align reasonably
- Invalid shape (crossed lines) shows warning state

---

### 3. Settings Screen
**Purpose:** Configure app preferences and ESP connection

**Layout:**
- **Header:** Standard navigation header (not transparent)
  - Left: Back button
  - Center: "Settings"
- **Main Content:** Scrollable form
  - Profile section (avatar, display name)
  - ESP Configuration section
    - IP Address input field
    - UDP Port input field
    - "Test Connection" button
  - LED Configuration section
    - LED count slider (1-300)
    - Grid resolution dropdown (fixed at 10x10 for now)
  - Appearance section
    - Dark/Light theme toggle
  - Calibration section
    - "Reset TV Calibration" button (destructive style)
  - About section
    - App version
    - Help/Instructions link

**Safe Area Insets:**
- Top: `Spacing.xl` (with standard header)
- Bottom: `insets.bottom + Spacing.xl`

**Components:**
- Form inputs with labels
- Section headers (bold, uppercase, small)
- Toggle switches
- Buttons (primary, destructive)

---

### 4. ESP Configuration Screen
**Purpose:** First-time setup or network configuration

**Layout:**
- **Header:** Standard navigation header
  - Left: Back button
  - Center: "ESP Setup"
- **Main Content:** Scrollable form with centered content
  - Step-by-step instructions
  - IP address input (numeric keyboard)
  - Port input (numeric keyboard)
  - "Scan Network" button (searches for ESP devices)
  - Connection status card (success/error state)

**Form Buttons:** Below form content, sticky to bottom
- Submit: "Connect" button (primary, full-width)

**Safe Area Insets:**
- Top: `Spacing.xl`
- Bottom: `insets.bottom + Spacing.xl`

---

## Design System

### Color Palette
**Dark Theme (Primary):**
- Background: `#0A0A0A` (true black)
- Surface: `#1A1A1A` (elevated cards)
- Primary: `#00FF88` (neon green - for active states, calibration borders)
- Secondary: `#8B5CF6` (purple - for accents)
- Error: `#FF4444`
- Text Primary: `#FFFFFF`
- Text Secondary: `#A0A0A0`
- Border: `#2A2A2A`

**Light Theme:**
- Background: `#F5F5F5`
- Surface: `#FFFFFF`
- Primary: `#00CC6A` (darker green for light mode)
- Secondary: `#7C3AED`
- Error: `#DC2626`
- Text Primary: `#0A0A0A`
- Text Secondary: `#6B7280`
- Border: `#E5E5E5`

### Typography
- **Headers:** SF Pro Display (iOS) / Roboto (Android)
  - H1: 32px, Bold
  - H2: 24px, Semibold
  - H3: 18px, Semibold
- **Body:** SF Pro Text / Roboto
  - Body: 16px, Regular
  - Caption: 14px, Regular
- **Buttons:** 16px, Medium

### Spacing
- xs: 4px
- sm: 8px
- md: 12px
- lg: 16px
- xl: 24px
- 2xl: 32px

---

## Interaction Design

### Touchable Feedback
- **Buttons:** Scale down to 0.96 on press, with 0.7 opacity
- **Floating Action Buttons:** 
  - Shadow specifications:
    - shadowOffset: { width: 0, height: 2 }
    - shadowOpacity: 0.10
    - shadowRadius: 2
  - Elevation: 4 (Android)
- **Corner Handles:** Scale to 1.2 when dragging, with neon green glow
- **Toggle Switches:** System native switches (green when active)

### Animations
- Calibration border: Animated dashed line (marching ants effect)
- Grid overlay: Fade in/out (300ms ease)
- Connection status: Pulse animation when connecting
- Power toggle: Rotation animation (180° when toggling)

---

## Accessibility

### Touch Targets
- Minimum 44x44px for all interactive elements
- Corner handles: 44x44px touch area (visual circle 32px)
- Floating buttons: 56px diameter minimum

### Visual Feedback
- High contrast mode support
- Clear focus states for screen readers
- Haptic feedback on critical interactions (calibration save, power toggle)

### Error States
- Clear error messages for UDP connection failures
- Visual indicator when ESP is unreachable
- Calibration validation (prevent saving invalid shapes)

---

## Assets Required

### Icons (Feather Icons from @expo/vector-icons)
- `settings` - Settings button
- `info` - Connection info
- `target` - Calibration mode
- `power` - LED sync toggle
- `wifi` - Network status
- `check` - Save/confirm
- `x` - Cancel/close
- `refresh-cw` - Reset calibration
- `sliders` - LED configuration

### Generated Assets
**1 User Avatar Preset:**
- Neon-themed geometric avatar with LED light aesthetic
- Gradient colors (cyan to purple)
- 200x200px PNG with transparent background
- Style: Futuristic, tech-inspired circular design

### No Additional Assets Needed
- Use system camera interface
- Grid overlay rendered programmatically (SVG)
- Corner handles rendered as styled Views
- All other UI elements use standard React Native components