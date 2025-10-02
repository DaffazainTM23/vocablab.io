import { Volume2, Gamepad2, MessageSquare, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: Volume2,
    title: 'Audio Jelas',
    description: 'Dengarkan pronunciation UK/US dengan mode lambat untuk belajar lebih detail.',
    gradient: 'from-blue-500 to-purple-500'
  },
  {
    icon: Gamepad2,
    title: 'Games Interaktif',
    description: 'Quiz, Matching, Spelling, dan Listening Challenge yang seru dan menantang.',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: MessageSquare,
    title: 'Contoh Nyata',
    description: 'Kalimat sehari-hari yang mudah dipahami untuk setiap kata baru.',
    gradient: 'from-pink-500 to-red-500'
  },
  {
    icon: TrendingUp,
    title: 'Lacak Kemajuan',
    description: 'Monitor skor, badge, dan streak harian untuk motivasi belajar.',
    gradient: 'from-blue-500 to-cyan-500'
  }
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Mengapa <span className="gradient-text">VocabLab</span>?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Platform pembelajaran kosakata yang dirancang khusus untuk siswa SMP kelas 7
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="topic-card text-center group"
            >
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-4 transform group-hover:scale-110 transition-transform`}>
                <feature.icon className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
