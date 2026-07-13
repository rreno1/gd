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
      icon: 'GD',
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
      icon: 'EL',
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
      icon: 'PR',
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
      icon: 'TY',
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
      icon: 'CO',
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
      icon: 'GR',
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
      icon: 'AX',
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
