import { Link } from 'react-router-dom';
import { Users, School, Clock, Palette, Coffee, Flame } from 'lucide-react';

const popularTopics = [
  {
    slug: 'people-and-family',
    name: 'People and Family',
    icon: Users,
    description: 'Pelajari kosakata tentang anggota keluarga dan hubungan sosial',
    wordCount: 50,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    slug: 'school-and-classroom',
    name: 'School and Classroom',
    icon: School,
    description: 'Kosakata seputar sekolah, ruang kelas, dan perlengkapan belajar',
    wordCount: 50,
    color: 'from-purple-500 to-pink-500'
  },
  {
    slug: 'numbers-and-time',
    name: 'Numbers and Time',
    icon: Clock,
    description: 'Angka, waktu, dan ungkapan temporal dalam bahasa Inggris',
    wordCount: 70,
    color: 'from-orange-500 to-red-500'
  },
  {
    slug: 'colors-and-shapes',
    name: 'Colors and Shapes',
    icon: Palette,
    description: 'Warna-warna dan berbagai bentuk geometris',
    wordCount: 50,
    color: 'from-green-500 to-teal-500'
  },
  {
    slug: 'daily-activities',
    name: 'Daily Activities',
    icon: Flame,
    description: 'Kegiatan sehari-hari dari bangun tidur hingga tidur malam',
    wordCount: 50,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    slug: 'food-and-drinks',
    name: 'Food and Drinks',
    icon: Coffee,
    description: 'Makanan, minuman, dan kosakata kuliner',
    wordCount: 70,
    color: 'from-pink-500 to-rose-500'
  }
];

export function PopularTopics() {
  return (
    <section id="topics" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Topik <span className="gradient-text">Populer</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Mulai belajar dari topik favorit atau jelajahi semua kategori
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {popularTopics.map((topic) => (
            <Link
              key={topic.slug}
              to={`/topics/${topic.slug}`}
              className="topic-card group"
            >
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${topic.color} mb-4`}>
                <topic.icon className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:gradient-text transition-all">
                {topic.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 leading-relaxed">
                {topic.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary-500">
                  {topic.wordCount} words
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Start learning →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link to="/topics" className="btn-primary inline-block">
            View All Topics
          </Link>
        </div>
      </div>
    </section>
  );
}
