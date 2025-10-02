import { Users, School, Clock, Palette, Flame, Coffee, Rabbit, MapPin, Smile, MessageCircle } from 'lucide-react';

export const topicsData = [
  {
    slug: 'people-and-family',
    name: 'People and Family',
    icon: Users,
    description: 'Learn vocabulary about family members, social relationships, and people around us',
    wordCount: 50,
    color: 'from-primary-400 via-primary-500 to-primary-600',
    order: 1
  },
  {
    slug: 'school-and-classroom',
    name: 'School and Classroom',
    icon: School,
    description: 'Vocabulary about school, classroom, learning equipment, and educational activities',
    wordCount: 50,
    color: 'from-secondary-400 via-secondary-500 to-secondary-600',
    order: 2
  },
  {
    slug: 'numbers-and-time',
    name: 'Numbers and Time',
    icon: Clock,
    description: 'Numbers, time, days, months, years, and temporal expressions in English',
    wordCount: 70,
    color: 'from-accent-400 via-accent-500 to-accent-600',
    order: 3
  },
  {
    slug: 'colors-and-shapes',
    name: 'Colors and Shapes',
    icon: Palette,
    description: 'Colors, geometric shapes, and visual descriptions',
    wordCount: 50,
    color: 'from-secondary-300 via-secondary-500 to-secondary-700',
    order: 4
  },
  {
    slug: 'daily-activities',
    name: 'Daily Activities',
    icon: Flame,
    description: 'Daily routines from waking up to going to bed at night',
    wordCount: 50,
    color: 'from-primary-300 via-primary-500 to-primary-700',
    order: 5
  },
  {
    slug: 'food-and-drinks',
    name: 'Food and Drinks',
    icon: Coffee,
    description: 'Food, beverages, fruits, vegetables, and culinary vocabulary',
    wordCount: 70,
    color: 'from-accent-300 via-accent-500 to-accent-700',
    order: 6
  },
  {
    slug: 'animals',
    name: 'Animals',
    icon: Rabbit,
    description: 'Various types of land, water, air animals, and insects',
    wordCount: 50,
    color: 'from-secondary-400 via-secondary-600 to-secondary-800',
    order: 7
  },
  {
    slug: 'places',
    name: 'Places',
    icon: MapPin,
    description: 'Public places, parts of the house, and important locations',
    wordCount: 50,
    color: 'from-primary-600 via-primary-700 to-primary-900',
    order: 8
  },
  {
    slug: 'adjectives',
    name: 'Adjectives',
    icon: Smile,
    description: 'Adjectives to describe people, objects, and situations',
    wordCount: 50,
    color: 'from-accent-500 via-accent-600 to-accent-800',
    order: 9
  },
  {
    slug: 'common-expressions',
    name: 'Common Expressions',
    icon: MessageCircle,
    description: 'Common expressions and daily conversation phrases',
    wordCount: 50,
    color: 'from-primary-500 via-primary-600 to-primary-800',
    order: 10
  }
];
