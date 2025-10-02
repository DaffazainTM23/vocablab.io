import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Siti Nurhaliza',
    role: 'Siswa Kelas 7A',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti',
    content: 'VocabLab sangat membantu! Sekarang saya lebih percaya diri berbicara bahasa Inggris. Audio pronunciation-nya jelas banget dan game-nya seru!',
    rating: 5
  },
  {
    name: 'Budi Santoso',
    role: 'Siswa Kelas 7B',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi',
    content: 'Belajar vocabulary jadi gak boring lagi. Suka banget sama listening challenge dan spelling bee-nya. Bikin ketagihan!',
    rating: 5
  },
  {
    name: 'Ibu Ratna Dewi',
    role: 'Guru Bahasa Inggris',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ratna',
    content: 'Platform yang sangat interaktif untuk siswa SMP. Fitur progress tracking-nya memudahkan saya memantau perkembangan murid-murid. Highly recommended!',
    rating: 5
  }
];

export function Testimonials() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Apa Kata <span className="gradient-text">Mereka</span>?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Testimoni dari siswa dan guru yang sudah menggunakan VocabLab
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="glass-card-light p-6 relative">
              <Quote className="absolute top-4 right-4 text-primary-200 dark:text-primary-900" size={40} />

              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700"
                />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              <div className="flex gap-1 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="text-yellow-400 fill-yellow-400"
                    size={16}
                  />
                ))}
              </div>

              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {testimonial.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
