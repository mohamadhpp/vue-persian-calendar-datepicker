---
home: true
title: Get Started
heroImage: "logo.svg"
actions:
  - text: Introduction
    link: /Introduction.html
    type: primary

  - text: Github
    link: https://github.com/mohamadhpp/vue-persian-calendar-datepicker
    type: secondary

  - text: Online Demo
    link: https://codepen.io/mohamadhpp/pen/vELRmNa
    type: secondary

features:
  - title: Multiple Calendar Systems
    details: Display dates in Persian (Jalali), Hijri (Islamic), and Gregorian calendars simultaneously with automatic conversions.
  
  - title: Rich Event Support
    details: Show Persian holidays, Islamic events, and international observances with customizable tooltips and event displays.
  
  - title: Smart Date Picking
    details: Choose between a full calendar view or a compact date picker with date range restrictions and format options.
  
  - title: Theme Flexibility
    details: Support for light and dark themes with automatic system preference detection for seamless user experience.
  
  - title: Fully Customizable
    details: Extensive slot-based customization allows you to tailor every aspect of the calendar to your design needs.
  
  - title: TypeScript Ready
    details: Full type definitions included for a better development experience with IDE support and type checking.

footer: MIT Licensed | Copyright © 2024
---

## Quick Start

### Installation

```bash
npm install vue-persian-calendar-datepicker
```

### Basic Usage

```vue
<script setup>
import { PersianCalendar } from 'vue-persian-calendar-datepicker'
</script>

<template>
  <PersianCalendar />
</template>
```

### Date Picker

```vue
<script setup>
import { ref } from 'vue'
import { PersianDatePicker } from 'vue-persian-calendar-datepicker'

const selectedDate = ref(null)
</script>

<template>
  <PersianDatePicker v-model="selectedDate" />
</template>
```

## Key Capabilities

- **Full Calendar View**  
Display a complete month view with date selection, today indicator, and comprehensive event information.

- **Flexible Date Picker**  
Standalone datepicker component with popup calendar, format options, and quick action buttons.

- **Event Management**  
Automatically display Persian holidays, Islamic calendar events, and international observances on relevant dates.

- **Date Range Restriction**  
Set `from` and `to` dates to prevent selection of dates outside your desired range.

- **Theme Customization**  
Choose between light, dark, or automatic themes that respond to system preferences.

- **Extensible via Slots**  
Customize headers, day cells, information displays, and more through named slots.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT Licensed | Copyright © 2024