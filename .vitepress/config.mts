import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/twinkle-docs/',
  title: "TWINKLE DOCS",
  description: "Documentation of Twinkle firmware",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      // { text: 'Home', link: '/' },
      // { text: 'Flashing', link: '/docs/hardware/flashing-the-hardware' },
      // { text: 'Time', link: '/time' }
    ],

    sidebar: [
      {
        text: 'Hardware',
        items: [
          { text: 'Flashing Hardware', link: '/docs/hardware/flashing-the-hardware' },
          { text: 'Hardware Schematic', link: '/docs/hardware/hardware-schematic' }
        ]
      },

      {
        text: 'Providers',
        items: [
          { text: 'Time Provider', link: '/docs/providers/time-provider' },
          { text: 'Location Provider', link: '/docs/providers/location-provider' },
          { text: 'Prayer Time Provider', link: '/docs/providers/prayertime-provider' }
        ]
      },

      {
        text: 'Text Template',
        items: [
          { text: 'Time Template', link: '/docs/template/time-template' },
          { text: 'Prayer Time Template', link: '/docs/template/prayertime-template' },
          { text: 'Hijri Template', link: '/docs/template/hijri-template' },
          { text: 'Location Template', link: '/docs/template/location-template' },
          { text: 'Moon Phase Template', link: '/docs/template/moonphase-template' },
          { text: 'Math Template', link: '/docs/template/math-template' },
          { text: 'Conditional Template', link: '/docs/template/conditional-template' },
          { text: 'Formatter Template', link: '/docs/template/formatter-template' },
        ]
      },

      {
        text: 'API',
        items: [
          { text: 'Overview', link: '/docs/api/' },
          { text: 'Scene', link: '/docs/api/scene' },
          { text: 'Provider', link: '/docs/api/provider' },
          { text: 'Global', link: '/docs/api/global' },
          { text: 'Audio', link: '/docs/api/audio' },
          { text: 'Buzzer', link: '/docs/api/buzzer' },
          { text: 'Font', link: '/docs/api/font' },
          { text: 'Automation', link: '/docs/api/automation' },
          { text: 'Playlist', link: '/docs/api/playlist' },
          { text: 'Events', link: '/docs/api/events' },
          { text: 'Files', link: '/docs/api/file' },
          { text: 'OTA', link: '/docs/api/ota' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/karbyt/twinkle' },
      { icon: 'whatsapp', link: 'https://chat.whatsapp.com/CmIYOnsoUEa91QlJvnxgKS?s=cl&p=a&iam=2' }
    ]
  }
})
