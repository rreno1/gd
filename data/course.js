(function () {
  'use strict';

  const modules = [
    {
      id: 'introduction',
      number: 1,
      title: 'Introduction to Graphic Design',
      shortTitle: 'Introduction',
      description: 'See design as purposeful visual communication and connect the elements, principles, type, color, grids, and accessibility.',
      duration: '55 min',
      lessonTotal: 8,
      icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
      accent: '#43d6b5'
    },
    {
      id: 'elements-of-design',
      number: 2,
      title: 'Elements of Design',
      shortTitle: 'Elements',
      description: 'Work with line, shape, form, color, value, texture, and space as the raw materials of visual composition.',
      duration: '60 min',
      lessonTotal: 8,
      icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="10" height="10" rx="1"/><circle cx="14" cy="14" r="6"/></svg>',
      accent: '#ff9d5c'
    },
    {
      id: 'principles',
      number: 3,
      title: 'Principles of Design',
      shortTitle: 'Principles',
      description: 'Organize visual material through balance, contrast, hierarchy, rhythm, unity, and other compositional strategies.',
      duration: '75 min',
      lessonTotal: 8,
      icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="12" y1="21" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="9"/><line x1="2" y1="21" x2="22" y2="21"/></svg>',
      accent: '#9f8cff'
    },
    {
      id: 'typography',
      number: 4,
      title: 'Typography',
      shortTitle: 'Typography',
      description: 'Shape the voice and readability of language through classification, anatomy, hierarchy, spacing, and pairing.',
      duration: '60 min',
      lessonTotal: 8,
      icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 20 12 4 20 20"/><line x1="8" y1="14" x2="16" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>',
      accent: '#f2cf62'
    },
    {
      id: 'color-theory',
      number: 5,
      title: 'Color Theory',
      shortTitle: 'Color',
      description: 'Build intentional palettes with color models, properties, harmonies, context, cultural awareness, and access needs.',
      duration: '65 min',
      lessonTotal: 8,
      icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><circle cx="8" cy="15" r="5"/><circle cx="16" cy="15" r="5"/></svg>',
      accent: '#ff6f91'
    },
    {
      id: 'grids',
      number: 6,
      title: 'Grids & Layout',
      shortTitle: 'Grids',
      description: 'Use columns, modules, spatial zones, and responsive rules to create flexible, coherent page systems.',
      duration: '60 min',
      lessonTotal: 8,
      icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>',
      accent: '#5eb7ff'
    },
    {
      id: 'contrast-accessibility',
      number: 7,
      title: 'Contrast & Accessibility',
      shortTitle: 'Accessibility',
      description: 'Design perceivable, operable, understandable, and robust experiences with measurable inclusive practices.',
      duration: '70 min',
      lessonTotal: 8,
      icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 0 0 20z" fill="currentColor"/></svg>',
      accent: '#7cdd7a'
    }
  ];

  window.GD = window.GD || {};
  window.GD.course = {
    code: 'GD 101',
    title: 'Graphic Design Foundations',
    institution: 'MLG College of Learning',
    academicYear: '2026',
    modules
  };
  window.GDLessons = window.GDLessons || {};
})();
