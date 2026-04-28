import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Linkedin, Heart, Zap, Target } from 'lucide-react';
import { foundersAPI } from '../utils/api';

export default function About() {
  const [founders, setFounders] = useState([]);
  useEffect(() => { foundersAPI.getAll().then(r => setFounders(r.data.founders)).catch(() => {}); }, []);

  const values = [
    { icon: <Heart className="text-rose-500" />, title: 'Customer First', desc: 'Every decision we make starts with what is best for our customers.' },
    { icon: <Zap className="text-amber-500" />, title: 'Innovation', desc: 'We constantly push boundaries to deliver the best shopping experience.' },
    { icon: <Target className="text-blue-500" />, title: 'Authenticity', desc: '100% genuine products — we never compromise on quality.' },
  ];

  return (
    <div className="pt-24 pb-16">
      {/* Hero */}
      <section className="relative py-24 bg-gray-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950" />
        <div className="container-custom relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="badge bg-primary-500/20 text-primary-400 mb-4 text-sm">Our Story</span>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">
              Built for <span className="text-primary-400">Nepal</span>
            </h1>
            <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
              SabaiSale was born from a simple idea: everyone deserves access to premium products at fair prices, delivered right to their door anywhere in Nepal.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="container-custom max-w-4xl text-center">
          <h2 className="font-display text-4xl font-bold text-[var(--text)] mb-6">Our Mission</h2>
          <p className="text-[var(--text-muted)] text-xl leading-relaxed">
            To democratize access to quality products in Nepal — making premium shopping accessible, affordable, and enjoyable for every Nepali household. We believe great products shouldn't require a passport.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="container-custom">
          <h2 className="font-display text-4xl font-bold text-center text-[var(--text)] mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="card p-8 text-center"
              >
                <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {v.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-[var(--text)] mb-2">{v.title}</h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-primary-500 font-semibold uppercase tracking-widest text-sm">The Team</span>
            <h2 className="font-display text-4xl font-bold text-[var(--text)] mt-2">Meet the Founders</h2>
            <p className="text-[var(--text-muted)] mt-3 max-w-lg mx-auto">The passionate people behind SabaiSale, working every day to bring you the best shopping experience.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {(founders.length > 0 ? founders : [
              { name: 'Jeevan Shakya', role: 'CEO & Co-Founder', bio: 'Visionary entrepreneur with a passion for connecting Nepali consumers with premium products.', image: 'https://raw.githubusercontent.com/oshodo/site_project1/main/jeevan.jpg', social: {} },
              { name: 'Sabin Subedi', role: 'CTO & Co-Founder', bio: 'Full-stack developer who built SabaiSale from the ground up. Passionate about seamless digital experiences.', image: 'https://raw.githubusercontent.com/oshodo/site_project1/main/sabin.jpg', social: {} },
            ]).map((founder, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="card overflow-hidden"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img src={founder.image} alt={founder.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl font-bold text-[var(--text)]">{founder.name}</h3>
                  <p className="text-primary-500 font-semibold text-sm mt-0.5 mb-3">{founder.role}</p>
                  <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-4">{founder.bio}</p>
                  <div className="flex gap-3">
                    {founder.social?.linkedin && <a href={founder.social.linkedin} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-950 text-[var(--text-muted)] hover:text-blue-600 rounded-lg transition-colors"><Linkedin size={18} /></a>}
                    {founder.social?.twitter && <a href={founder.social.twitter} className="p-2 hover:bg-sky-50 dark:hover:bg-sky-950 text-[var(--text-muted)] hover:text-sky-500 rounded-lg transition-colors"><Twitter size={18} /></a>}
                    {founder.social?.instagram && <a href={founder.social.instagram} className="p-2 hover:bg-pink-50 dark:hover:bg-pink-950 text-[var(--text-muted)] hover:text-pink-500 rounded-lg transition-colors"><Instagram size={18} /></a>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary-500">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[['10K+', 'Happy Customers'], ['500+', 'Products Listed'], ['4.9★', 'Average Rating'], ['2021', 'Founded']].map(([num, label]) => (
              <div key={label}>
                <div className="font-display text-4xl font-bold mb-1">{num}</div>
                <div className="text-white/80 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
