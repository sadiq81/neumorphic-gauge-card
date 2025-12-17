# Neumorphic Gauge Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![License](https://img.shields.io/github/license/yourusername/neumorphic-gauge-card)](LICENSE)

A beautiful neumorphic-styled gauge card for Home Assistant with support for both circular progress and needle-style gauges.

![Neumorphic Gauge Card](https://via.placeholder.com/800x400?text=Neumorphic+Gauge+Card+Preview)

## Features

✨ **Beautiful Neumorphic Design** - Soft UI with professional shadows and styling  
🎨 **Light & Dark Mode** - Automatic theme support  
📊 **Two Gauge Types** - Circular progress or classic needle gauge  
🌈 **Custom Gradients** - Define your own color segments  
📱 **Fully Responsive** - Works on all screen sizes  
⚡ **Smooth Animations** - Beautiful transitions and effects  
🎯 **Entity Attributes** - Display additional sensor attributes  
🔧 **Highly Configurable** - Extensive customization options

## Installation

### HACS (Recommended)

1. Make sure [HACS](https://hacs.xyz/) is installed
2. Go to HACS → Frontend
3. Click the three dots in the top right corner
4. Select "Custom repositories"
5. Add this repository URL: `https://github.com/yourusername/neumorphic-gauge-card`
6. Category: `Lovelace`
7. Click "Add"
8. Click "Install" on the Neumorphic Gauge Card
9. Restart Home Assistant

### Manual Installation

1. Download `neumorphic-gauge-card.js` from the [latest release](https://github.com/yourusername/neumorphic-gauge-card/releases)
2. Copy it to `<config>/www/neumorphic-gauge-card.js`
3. Add the resource to your `configuration.yaml`:

```yaml
lovelace:
  resources:
    - url: /local/neumorphic-gauge-card.js
      type: module
```

4. Restart Home Assistant

## Usage

### Basic Configuration

```yaml
type: custom:neumorphic-gauge-card
entity: sensor.living_room_temperature
name: Living Room
min: 15
max: 30
unit: "°C"
```

### With Needle Gauge

```yaml
type: custom:neumorphic-gauge-card
entity: sensor.battery_level
name: Battery
min: 0
max: 100
unit: "%"
needle: true
icon: mdi:battery
```

### With Custom Color Segments

```yaml
type: custom:neumorphic-gauge-card
entity: sensor.power_consumption
name: Power Usage
min: 0
max: 5000
unit: "W"
segments:
  - from: 0
    color: "#4CAF50"
  - from: 2000
    color: "#FFC107"
  - from: 3500
    color: "#f44336"
```

### With Severity Colors

```yaml
type: custom:neumorphic-gauge-card
entity: sensor.cpu_temperature
name: CPU Temp
min: 30
max: 90
unit: "°C"
severity:
  green: 60
  yellow: 70
  red: 80
```

### With Additional Attributes

```yaml
type: custom:neumorphic-gauge-card
entity: sensor.electric_vehicle
name: E-Niro
min: 0
max: 100
unit: "%"
needle: true
icon: mdi:car-electric
attributes:
  - attribute: range
    name: Range
    unit: " km"
  - attribute: charging_power
    name: Charging
    unit: " kW"
```

## Configuration Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `entity` | string | **Required** | Entity ID |
| `name` | string | Entity name | Display name for the gauge |
| `min` | number | `0` | Minimum value |
| `max` | number | `100` | Maximum value |
| `unit` | string | Entity unit | Unit of measurement |
| `needle` | boolean | `false` | Use needle gauge instead of circular |
| `icon` | string | `null` | Icon to display (e.g., `mdi:temperature`) |
| `decimals` | number | `1` | Number of decimal places |
| `show_minmax` | boolean | `true` | Show min/max values |
| `show_state` | boolean | `true` | Show entity name below value |
| `theme` | string | `light` | Theme: `light` or `dark` |

### Segments Configuration

Define custom color segments for the gauge:

```yaml
segments:
  - from: 0        # Starting value
    color: "#4CAF50"  # Color (hex or CSS name)
  - from: 50
    color: "#FFC107"
  - from: 75
    color: "#f44336"
```

### Severity Configuration

Set colors based on value thresholds:

```yaml
severity:
  green: 70   # Values >= 70 show green indicator
  yellow: 40  # Values >= 40 show yellow indicator
  red: 0      # Values >= 0 show red indicator
```

### Attributes Configuration

Display additional entity attributes:

```yaml
attributes:
  - attribute: battery_level  # Attribute name from entity
    name: Battery            # Display name
    unit: " %"               # Unit to display
  - attribute: power
    name: Power
    unit: " W"
```

## Examples

### Energy Monitoring Dashboard

```yaml
type: grid
columns: 3
cards:
  - type: custom:neumorphic-gauge-card
    entity: sensor.solar_production
    name: Solar Production
    min: 0
    max: 5000
    unit: "W"
    icon: mdi:solar-power
    segments:
      - from: 0
        color: "#2196F3"
      - from: 2000
        color: "#4CAF50"
      - from: 3500
        color: "#FFC107"
    
  - type: custom:neumorphic-gauge-card
    entity: sensor.house_power
    name: House Usage
    min: 0
    max: 3000
    unit: "W"
    icon: mdi:home-lightning-bolt
    
  - type: custom:neumorphic-gauge-card
    entity: sensor.battery_charge
    name: Battery
    min: 0
    max: 100
    unit: "%"
    needle: true
    icon: mdi:battery
    attributes:
      - attribute: power
        name: Power
        unit: " W"
      - attribute: energy
        name: Energy
        unit: " kWh"
```

### Climate Control

```yaml
type: custom:neumorphic-gauge-card
entity: sensor.living_room_temperature
name: Living Room
min: 15
max: 30
unit: "°C"
needle: true
icon: mdi:thermometer
segments:
  - from: 15
    color: "#2196F3"
  - from: 19
    color: "#4CAF50"
  - from: 24
    color: "#FFC107"
  - from: 27
    color: "#f44336"
attributes:
  - attribute: humidity
    name: Humidity
    unit: " %"
  - attribute: target_temperature
    name: Target
    unit: " °C"
```

### Vehicle Charging

```yaml
type: custom:neumorphic-gauge-card
entity: sensor.ev_battery
name: Kia E-Niro
min: 0
max: 100
unit: "%"
needle: true
icon: mdi:car-electric
severity:
  green: 70
  yellow: 30
  red: 0
attributes:
  - attribute: charging_rate
    name: Charging
    unit: " kW"
  - attribute: range
    name: Range
    unit: " km"
  - attribute: time_to_full
    name: Time left
    unit: " min"
```

## Styling with Themes

The card uses CSS variables for easy theming. Add this to your theme:

```yaml
# themes.yaml
neumorphic-light:
  # Neumorphic variables
  neumorphic-bg: "#e6e7ee"
  neumorphic-shadow: "9px 9px 16px #b8b9be, -9px -9px 16px #ffffff"
  neumorphic-shadow-hover: "12px 12px 20px #b8b9be, -12px -12px 20px #ffffff"
  neumorphic-shadow-sm: "4px 4px 8px #b8b9be, -4px -4px 8px #ffffff"
  neumorphic-shadow-inset: "inset 2px 2px 4px #b8b9be, inset -2px -2px 4px #ffffff"
  neumorphic-text: "#44476A"
  neumorphic-text-secondary: "#7C7E8C"
  neumorphic-text-muted: "#8A93A5"
  neumorphic-accent: "#31344b"
  neumorphic-track: "#d1d9e6"
  neumorphic-radius: "1.5rem"

neumorphic-dark:
  neumorphic-bg: "#262833"
  neumorphic-shadow: "9px 9px 16px #1a1b25, -9px -9px 16px #31344b"
  neumorphic-shadow-hover: "12px 12px 20px #1a1b25, -12px -12px 20px #31344b"
  neumorphic-shadow-sm: "4px 4px 8px #1a1b25, -4px -4px 8px #31344b"
  neumorphic-shadow-inset: "inset 2px 2px 4px #1a1b25, inset -2px -2px 4px #31344b"
  neumorphic-text: "#D1D9E6"
  neumorphic-text-secondary: "#8A93A5"
  neumorphic-text-muted: "#7C7E8C"
  neumorphic-accent: "#e6e7ee"
  neumorphic-track: "#31344b"
  neumorphic-radius: "1.5rem"
```

## Troubleshooting

### Card not showing up

1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Check browser console for errors (F12)
3. Verify the resource is added to Lovelace
4. Restart Home Assistant

### Styles look wrong

1. Make sure you're using a compatible theme
2. Check that CSS variables are defined
3. Try the default theme first

### Animations not working

1. Check if browser supports CSS animations
2. Disable any ad blockers or extensions
3. Try in a different browser

## Development

Want to contribute? Great! Here's how to set up for development:

```bash
# Clone the repository
git clone https://github.com/yourusername/neumorphic-gauge-card.git
cd neumorphic-gauge-card

# Link to your Home Assistant
ln -s $(pwd)/neumorphic-gauge-card.js /config/www/

# Make changes and test in Home Assistant
# Browser console will show any errors
```

## Credits

- Inspired by [Themesberg Neumorphism UI](https://github.com/themesberg/neumorphism-ui-bootstrap)
- Design based on [neumorph.scss](https://github.com/ChemaAlfonso/neumorph.scss)
- Created by [Tommy Sadiq Hinrichsen](https://github.com/yourusername)

## License

MIT License - see [LICENSE](LICENSE) file for details

## Support

If you like this card, please ⭐ star this repo!

For issues and feature requests, please use [GitHub Issues](https://github.com/yourusername/neumorphic-gauge-card/issues).

---

Made with ❤️ for the Home Assistant community
