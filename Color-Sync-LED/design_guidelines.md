# Design Guidelines: Ambilight LED Controller

## Architecture Decisions

### Authentication
**No Authentication Required** - This is a single-user utility app with local functionality.
- Include a **Settings screen** with:
  - User-customizable display name
  - App preferences (sensitivity, update speed)
  - No avatar needed (utility-focused)

### Navigation
**Tab Navigation (3 tabs):**
1. **Ana Sayfa** (Home) - Main camera view and color detection
2. **Cihazlar** (Devices) - Bluetooth LED device management
3. **Ayarlar** (Settings) - App configuration

### Screen Specifications

#### 1. Ana Sayfa (Home Screen)
**Purpose:** Real-time camera feed with color detection and LED control

**Layout:**
- Header: Transparent with right button (info icon for quick tips)
- Main content: Full-screen camera preview (non-scrollable)
- Floating elements:
  - **Color visualization bar** - Horizontal strip showing detected colors from screen regions (left, top, right, bottom)
  - **Large circular Start/Stop button** - Center bottom, uses accent color when active
  - **Status indicator** - Top of screen showing connection status
- Safe area: 
  - Top: `headerHeight + Spacing.xl`
  - Bottom: `tabBarHeight + Spacing.xl + 80` (extra space for floating button)

**Components:**
- Camera preview (expo-camera)
- Color bars (4 colored rectangles showing region colors)
- Floating action button with pulse animation when active
- Connection status chip

#### 2. Cihazlar (Devices Screen)
**Purpose:** Scan, connect, and manage Bluetooth LED devices

**Layout:**
- Header: Default with title "Cihazlar", right button (refresh/scan icon)
- Main content: Scrollable list
- Safe area:
  - Top: `Spacing.xl`
  - Bottom: `tabBarHeight + Spacing.xl`

**Components:**
- **Scanning indicator** when searching for devices
- **Device list cards** with:
  - Device name and icon
  - Signal strength indicator
  - Connection status (Bağlı/Bağlı Değil)
  - Connect/Disconnect button
- **Empty state** when no devices found (illustration + "Tarama Başlat" button)
- **Connected device card** (if connected) - highlighted with border, shows battery level if available

#### 3. Ayarlar (Settings Screen)
**Purpose:** Configure app behavior and color detection parameters

**Layout:**
- Header: Default with title "Ayarlar"
- Main content: Scrollable form
- Safe area:
  - Top: `Spacing.xl`
  - Bottom: `tabBarHeight + Spacing.xl`

**Components:**
- **Grouped settings sections:**
  1. Renk Algılama (Color Detection)
     - Hassasiyet slider (Sensitivity 1-10)
     - Güncelleme Hızı slider (Update rate: 10fps - 60fps)
     - Parlaklık ayarı toggle
  2. Kamera
     - Ön/Arka kamera seçimi
     - Çözünürlük tercihi
  3. Hakkında
     - App version
     - Tutorial button
     - İletişim/Destek

## Design System

### Color Palette
**Primary Colors:**
- Background: `#0A0E14` (Dark blue-black)
- Surface: `#151B23` (Elevated dark surface)
- Accent: `#00D9FF` (Bright cyan - represents LED/tech)
- Accent Secondary: `#7B61FF` (Purple for secondary actions)

**Semantic Colors:**
- Success: `#00E676` (Connected state)
- Warning: `#FFB300` (Low signal)
- Error: `#FF3D71` (Disconnected)
- Text Primary: `#FFFFFF`
- Text Secondary: `#8F9BB3`

**Color Visualization:**
- Use actual detected colors in the color bars
- Add subtle glow effect to active color regions

### Typography
- **Headers:** SF Pro Display (iOS) / Roboto (Android)
  - Large Title: 34pt, Bold
  - Title: 28pt, Semibold
  - Headline: 17pt, Semibold
- **Body:** SF Pro Text / Roboto
  - Body: 17pt, Regular
  - Caption: 12pt, Regular
  - Button: 16pt, Semibold

### Visual Design

**Component Specifications:**

1. **Floating Action Button (Start/Stop):**
   - Size: 72x72pt
   - Border radius: 36pt
   - Shadow (EXACT specs):
     - shadowOffset: {width: 0, height: 2}
     - shadowOpacity: 0.10
     - shadowRadius: 2
   - Active state: Pulsing glow animation
   - Press feedback: Scale to 0.95

2. **Color Region Bars:**
   - Height: 8pt each
   - Horizontal arrangement with 4pt gap
   - Smooth color transitions (500ms)
   - Subtle inner shadow for depth

3. **Device Cards:**
   - Background: Surface color
   - Border radius: 12pt
   - Padding: 16pt
   - Press feedback: Opacity 0.8
   - NO drop shadow (flat design)

4. **Status Indicators:**
   - Pill-shaped chips
   - Height: 28pt
   - Border radius: 14pt
   - Semi-transparent background
   - Use semantic colors for states

5. **Sliders:**
   - Track height: 4pt
   - Thumb size: 24x24pt
   - Active thumb: 28x28pt
   - Accent color for active track

### Icons
- Use **Feather icons** from @expo/vector-icons
- Icon sizes:
  - Navigation: 24pt
  - Cards: 20pt
  - Status: 16pt
- Icons: bluetooth, camera, settings, zap, wifi, power, sliders, refresh-cw

### Critical Assets
**Generate 1 custom illustration:**
- **Empty device state illustration** - Minimalist line art of a smartphone scanning for Bluetooth devices with radiating waves, using accent colors on dark background (size: 200x200pt)

**System Icons Only:**
- Use Feather icons for all UI actions
- No emoji usage
- Camera permission placeholder: Use camera icon

### Interaction Design
- **Camera Preview:** Tap to focus
- **Start/Stop Button:** 
  - Haptic feedback on press
  - Smooth color change on state toggle
  - Disable when no device connected (show tooltip)
- **Device Cards:** 
  - Swipe left to forget device
  - Tap to connect/disconnect
- **Sliders:** Real-time preview of sensitivity changes

### Accessibility
- Minimum touch target: 44x44pt
- Color contrast ratio: 4.5:1 for text
- Support VoiceOver/TalkBack labels in Turkish
- Haptic feedback for important actions
- Camera permission explanations in Turkish
- Bluetooth permission explanations in Turkish

### Special Considerations
- **Camera Performance:** Optimize color detection to run at selected FPS without lag
- **Battery Indicator:** Show warning if intensive usage detected
- **Connection State:** Always display current Bluetooth connection status
- **Permissions Flow:** Guide users through camera and Bluetooth permissions with clear Turkish explanations