import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  chaptersSidebar: [
    {
      type: 'category',
      label: 'Physical AI & Humanoid Robotics',
      collapsible: false,
      items: [
        'chapters/ch1-introduction',
        'chapters/ch2-humanoid-fundamentals',
        'chapters/ch3-sensors-perception',
        'chapters/ch4-motion-planning',
        'chapters/ch5-ai-integration',
        'chapters/ch6-applications',
      ],
    },
  ],
};

export default sidebars;
