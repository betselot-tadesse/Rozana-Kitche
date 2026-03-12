/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ChevronRight, ChevronDown, Star, Clock, Utensils, Heart, Quote, Mail, Phone, MapPin } from "lucide-react";
import { useState, useEffect } from "react";

const Logo = ({ className = "", light = false }) => (
  <div className={`inline-flex flex-col items-center justify-center leading-none ${className}`}>
    <span className={`font-serif text-3xl md:text-4xl font-bold italic ${light ? 'text-white' : 'text-brand-dark'}`}>
      Rozana
    </span>
    <div className="flex items-center gap-2 w-full mt-1">
      <div className={`h-[1px] flex-grow ${light ? 'bg-white/30' : 'bg-brand-dark/30'}`}></div>
      <span className={`text-[10px] md:text-[12px] font-bold tracking-[0.3em] uppercase ${light ? 'text-white/80' : 'text-brand-dark/80'}`}>
        Kitchen
      </span>
      <div className={`h-[1px] flex-grow ${light ? 'bg-white/30' : 'bg-brand-dark/30'}`}></div>
    </div>
  </div>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#" className="flex items-center">
          <Logo className="scale-75 md:scale-100 origin-left" />
        </a>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#menu" className="text-sm font-medium hover:text-brand-primary transition-colors">Menu</a>
          <a href="#about" className="text-sm font-medium hover:text-brand-primary transition-colors">About</a>
          {/* <a href="#contact" className="text-sm font-medium hover:text-brand-primary transition-colors">Contact</a> */}
          <a href="#order" className="bg-brand-dark text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-brand-primary transition-all shadow-md">
            Order Now
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-brand-dark" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white border-b border-black/5 px-6 py-4 flex flex-col space-y-4 overflow-hidden"
          >
            <a href="#menu" onClick={() => setIsOpen(false)} className="text-lg font-medium">Menu</a>
            <a href="#about" onClick={() => setIsOpen(false)} className="text-lg font-medium">About</a>
            {/* <a href="#contact" onClick={() => setIsOpen(false)} className="text-lg font-medium">Contact</a> */}
            <a href="#order" onClick={() => setIsOpen(false)} className="bg-brand-dark text-white px-6 py-3 rounded-xl text-center font-medium">
              Order Now
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const languages = [
    { text: "Rozana", lang: "English" },
    { text: "रोज़ाना", lang: "Hindi" },
    { text: "روزانا", lang: "Arabic" },
    { text: "ਰੋਜ਼ਾਨਾ", lang: "Punjabi" }
  ];

  const [langIndex, setLangIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLangIndex((prev) => (prev + 1) % languages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-[#0f3d2c] to-[#2f7d4f]">
      {/* Floating Food Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[10%] text-white/10"
        >
          <Utensils size={120} />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[20%] left-[5%] text-white/10"
        >
          <Heart size={80} />
        </motion.div>
        <motion.div 
          animate={{ y: [0, -30, 0], rotate: [0, 20, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[15%] right-[15%] text-white/10"
        >
          <Utensils size={100} />
        </motion.div>
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] right-[10%] text-white/10"
        >
          <div className="w-32 h-32 border-4 border-current rounded-full flex items-center justify-center">
            <Utensils size={60} />
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-6">
            Ghar Jaisa Khana,<br />
            <AnimatePresence mode="wait">
              <motion.span
                key={langIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-white/80 italic font-light block"
              >
                {languages[langIndex].text}.
              </motion.span>
            </AnimatePresence>
          </h1>
          <p className="text-xl text-white/90 mb-10 max-w-lg leading-relaxed">
            Freshly prepared North Indian comfort food delivered straight to you.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#order" className="bg-white text-brand-dark px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:bg-brand-bg transition-all shadow-lg group">
              Order Now <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#menu" className="border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all">
              View Menu
            </a>
          </div>
        </motion.div>

        <div className="relative h-[500px] w-full">
          <div className="absolute -inset-4 bg-white/10 rounded-3xl blur-2xl -z-10"></div>
          <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 relative bg-brand-dark/50 flex items-center justify-center">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover"
              poster="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80"
            >
              {/* Replace 'hero-video.mp4' with your uploaded video file */}
              <source src="/hero-video.mp4" type="video/mp4" />
              <source src="https://player.vimeo.com/external/370331493.sd.mp4?s=7b0cd519d76097c4f5d7b1021000e4418e4f0273&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            
            {/* Instruction overlay for the user (only visible if video fails or as a hint) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center opacity-0 hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
              <Utensils className="text-white mb-4" size={48} />
              <p className="text-white font-bold">Upload 'hero-video.mp4' to the root folder to replace this placeholder</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Heart className="text-red-500" />,
      title: "Home Style Cooking",
      desc: "Recipes inspired by everyday Indian kitchens, made with love and traditional spices.",
      img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: <Clock className="text-brand-primary" />,
      title: "Per your Taste",
      desc: "Fresh ingredients prepared exactly how you like them. No frozen shortcuts, just pure taste.",
      img: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: <Utensils className="text-amber-600" />,
      title: "Made to share",
      desc: "Delicious, high-quality meals designed to bring people together around the table.",
      img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-brand-dark mb-16">Why People Love Rozana Kitchen</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="bg-brand-bg rounded-3xl border border-black/5 transition-all overflow-hidden flex flex-col h-full"
            >
              <div className="h-56 overflow-hidden bg-gray-100 relative">
                <img 
                  src={f.img} 
                  alt="" 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1495195129352-aec329a778a5?auto=format&fit=crop&w=800&q=80";
                  }}
                />
              </div>
              <div className="p-8 flex-grow">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-brand-dark">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const MenuCard = ({ item, index }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={item.img} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-brand-dark shadow-sm">
          {item.price}
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-1 text-amber-500 mb-2">
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />
          <span className="text-xs text-gray-400 ml-1">(4.9)</span>
        </div>
        <h3 className="text-xl font-bold mb-2 text-brand-dark">{item.name}</h3>
        
        <div className="relative flex-1">
          <motion.div
            initial={false}
            animate={{ height: isExpanded ? "auto" : "40px" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-gray-600 text-sm leading-relaxed">
              {item.desc}
            </p>
          </motion.div>
          
          {!isExpanded && (
            <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-white to-transparent" />
          )}
        </div>

        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 text-brand-primary text-xs font-bold flex items-center gap-1 hover:text-brand-dark transition-colors uppercase tracking-wider"
        >
          {isExpanded ? "Show Less" : "Read More"}
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
             <ChevronDown size={14} />
          </motion.div>
        </button>
      </div>
    </motion.div>
  );
};

const MenuSection = () => {
  const items = [
    {
      name: "Chicken Biryani",
      desc: "Fragrant long-grain basmati rice layered with succulent pieces of spiced chicken, slow-cooked to perfection with caramelized onions, fresh mint, and a secret blend of aromatic spices. Served with cooling raita and spicy salan.",
      img: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a",
      price: "₹249"
    },
    {
      name: "Butter Chicken",
      desc: "Our signature dish featuring tender tandoori-grilled chicken pieces simmered in a rich, velvety tomato and butter gravy. Infused with dried fenugreek leaves and finished with a dollop of fresh cream for that authentic home-style indulgence.",
      img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398",
      price: "₹289"
    },
    {
      name: "Chicken Thali",
      desc: "A complete, balanced comfort meal that brings the variety of an Indian home kitchen to your plate. Includes a hearty chicken curry, yellow dal tadka, steamed basmati rice, two handmade rotis, fresh garden salad, and a sweet treat of the day.",
      img: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976",
      price: "₹329"
    }
  ];

  return (
    <section id="menu" className="py-24 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div>
            <h2 className="text-4xl font-bold text-brand-dark mb-4">Rozana with Love</h2>
            <p className="text-gray-600 max-w-md">Our most ordered dishes that bring the taste of home to your table.</p>
          </div>
          <button className="text-brand-primary font-semibold flex items-center gap-2 hover:underline">
            View Full Menu <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <MenuCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-[2px] bg-brand-primary"></div>
              <span className="text-brand-primary font-bold uppercase tracking-widest text-xs">Our Heritage</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-8 leading-tight">The Story of Rozana Kitchen</h2>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                Rozana has grown in the UAE, We have seen the hustle bustle of Business Bay to the calm of Ajman Beaches. We as a team are foodies and fanatics of the trade that is “Taste”.
              </p>
              <p>
                Seeing that there is none in the market who could provide North Indian flavours just like our mother cooked, we curated some handpicked recipes from the moms of the UAE and made Rozana Kitchen.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-brand-primary/10 rounded-[2rem] blur-2xl -z-10"></div>
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white relative bg-brand-bg flex items-center justify-center">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover"
                poster="https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80"
              >
                {/* Replace 'about-video.mp4' with your uploaded video file */}
                <source src="/about-video.mp4" type="video/mp4" />
                <source src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27db96a9db273f6427db96a9db273f6427db96a&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-sm font-bold uppercase tracking-widest mb-1">Handcrafted</p>
                <p className="text-2xl font-serif italic">With Love & Spices</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};


const Testimonials = () => {
  const reviews = [
    {
      name: "Anjali Sharma",
      text: "The Butter Chicken is exactly how my mom makes it. Truly ghar jaisa khana! It's become my weekend ritual.",
      rating: 5,
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
    },
    {
      name: "Rahul Verma",
      text: "Fresh, hot, and delicious. My daily go-to for lunch at the office. The packaging is great and it always arrives on time.",
      rating: 5,
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
    },
    {
      name: "Priya Iyer",
      text: "Finally found a place that doesn't use too much oil. Healthy, light, and incredibly tasty. Highly recommended!",
      rating: 5,
      img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
    }
  ];

  return (
    <section className="bg-brand-dark py-20 overflow-hidden relative">
      {/* Decorative Strip */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center mb-12">
          <span className="text-brand-primary font-bold uppercase tracking-[0.3em] text-xs mb-2">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center">What Our Customers Say</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex-1 bg-white/5 backdrop-blur-sm p-8 rounded-[2rem] border border-white/10 relative group hover:bg-white/10 transition-all"
            >
              <Quote className="absolute top-6 right-8 text-brand-primary/20 group-hover:text-brand-primary/40 transition-colors" size={40} />
              <div className="flex items-center gap-1 text-amber-500 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="text-white/80 italic mb-8 leading-relaxed text-lg">"{review.text}"</p>
              <div className="flex items-center gap-4">
                <img 
                  src={review.img} 
                  alt={review.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-brand-primary/30"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="block font-bold text-white">{review.name}</span>
                  <span className="text-xs text-white/40 uppercase tracking-widest">Verified Customer</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-50"></div>
    </section>
  );
};

const CTA = () => {
  const partners = [
    { 
      name: "Keeta", 
      status: "Available Now", 
      logo: "https://logo.clearbit.com/keeta.com",
      color: "from-yellow-400 to-orange-500"
    },
    { 
      name: "Talabat", 
      status: "Coming Soon", 
      logo: "https://www.google.com/s2/favicons?domain=talabat.com&sz=128",
      color: "from-orange-500 to-red-600"
    },
    { 
      name: "Noon Food", 
      status: "Coming Soon", 
      logo: "https://www.google.com/s2/favicons?domain=noon.com&sz=128",
      color: "from-yellow-300 to-yellow-500"
    },
    { 
      name: "Careem", 
      status: "Coming Soon", 
      logo: "https://www.google.com/s2/favicons?domain=careem.com&sz=128",
      color: "from-green-400 to-emerald-600"
    },
  ];

  return (
    <section id="order" className="py-16 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto bg-brand-dark rounded-[2.5rem] p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl"
      >
        {/* Video Background for CTA */}
        <div className="absolute inset-0 opacity-20">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27db96a9db273f6427db96a9db273f6427db96a&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
          </video>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-primary/20 via-transparent to-transparent"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to order? We are nearby!</h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Join thousands of happy customers who enjoy fresh, home-style meals every day. Order now and get your first meal delivered in 30 minutes.
          </p>
          <a 
            href="#" 
            className="inline-block bg-white text-brand-dark px-8 py-4 rounded-full text-lg font-bold hover:bg-brand-bg transition-all shadow-xl hover:-translate-y-1 mb-12"
          >
            Order Now
          </a>

          <div className="pt-12 border-t border-white/10">
            <p className="text-sm uppercase tracking-[0.2em] text-white/40 mb-8 font-bold">Our Delivery Partners</p>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
              {partners.map((p, i) => (
                <div key={i} className="flex flex-col items-center gap-3 group">
                  <div className={`relative p-1 rounded-2xl transition-all duration-500 ${p.status === 'Available Now' ? 'scale-110' : 'opacity-40 grayscale hover:grayscale-0 hover:opacity-70'}`}>
                    {/* Gradient Border for active */}
                    {p.status === 'Available Now' && (
                      <div className={`absolute -inset-0.5 bg-gradient-to-r ${p.color} rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse`}></div>
                    )}
                    
                    <div className="relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-xl overflow-hidden border border-white/10 p-3">
                      <img 
                        src={p.logo} 
                        alt={p.name} 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const domain = p.name.toLowerCase().replace(" food", "") + ".com";
                          if (!target.src.includes("google.com")) {
                            target.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
                          } else {
                            target.src = `https://ui-avatars.com/api/?name=${p.name}&background=f3f4f6&color=111&bold=true`;
                          }
                        }}
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {p.status === 'Coming Soon' && (
                      <div className="absolute -top-2 -right-2 bg-brand-dark/80 backdrop-blur-sm text-white/60 text-[8px] font-bold px-2 py-1 rounded-full border border-white/10 shadow-lg uppercase tracking-tighter">
                        Soon
                      </div>
                    )}
                  </div>
                  <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${p.status === 'Available Now' ? 'text-white' : 'text-white/20'}`}>
                    {p.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

// const Contact = () => {
//   return (
//     <section id="contact" className="py-24 px-6 bg-brand-bg">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-16">
//           <motion.span 
//             initial={{ opacity: 0, y: 10 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="text-brand-primary font-bold tracking-[0.2em] uppercase text-sm mb-4 block"
//           >
//             Get In Touch
//           </motion.span>
//           <motion.h2 
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.1 }}
//             className="text-4xl md:text-5xl font-bold text-brand-dark"
//           >
//             Contact Us
//           </motion.h2>
//         </div>
// 
//         <div className="grid lg:grid-cols-2 gap-12 items-start">
//           {/* Contact Info */}
//           <motion.div 
//             initial={{ opacity: 0, x: -30 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             className="space-y-8"
//           >
//             <div className="bg-white p-8 rounded-3xl shadow-sm border border-black/5">
//               <h3 className="text-2xl font-bold text-brand-dark mb-6">Contact Information</h3>
//               <div className="space-y-6">
//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary shrink-0">
//                     <Phone size={24} />
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-400 uppercase tracking-wider font-bold mb-1">Phone</p>
//                     <p className="text-lg font-medium text-brand-dark">+971 50 123 4567</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary shrink-0">
//                     <Mail size={24} />
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-400 uppercase tracking-wider font-bold mb-1">Email</p>
//                     <p className="text-lg font-medium text-brand-dark">hello@rozanakitchen.com</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary shrink-0">
//                     <MapPin size={24} />
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-400 uppercase tracking-wider font-bold mb-1">Location</p>
//                     <p className="text-lg font-medium text-brand-dark">Jumeirah Village Circle, Dubai, UAE</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
// 
//             <div className="bg-brand-dark p-8 rounded-3xl shadow-xl text-white">
//               <h3 className="text-2xl font-bold mb-4">Opening Hours</h3>
//               <div className="space-y-3">
//                 <div className="flex justify-between items-center">
//                   <span className="text-white/60">Monday - Friday</span>
//                   <span className="font-medium">11:00 AM - 11:00 PM</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-white/60">Saturday - Sunday</span>
//                   <span className="font-medium">10:00 AM - 12:00 AM</span>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
// 
//           {/* Contact Form */}
//           <motion.div 
//             initial={{ opacity: 0, x: 30 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-black/5"
//           >
//             <form className="space-y-6">
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label className="text-sm font-bold text-brand-dark uppercase tracking-wider">Name</label>
//                   <input 
//                     type="text" 
//                     placeholder="John Doe"
//                     className="w-full px-6 py-4 bg-brand-bg rounded-2xl border-none focus:ring-2 focus:ring-brand-primary transition-all outline-none"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-bold text-brand-dark uppercase tracking-wider">Email</label>
//                   <input 
//                     type="email" 
//                     placeholder="john@example.com"
//                     className="w-full px-6 py-4 bg-brand-bg rounded-2xl border-none focus:ring-2 focus:ring-brand-primary transition-all outline-none"
//                   />
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <label className="text-sm font-bold text-brand-dark uppercase tracking-wider">Subject</label>
//                 <input 
//                   type="text" 
//                   placeholder="How can we help?"
//                   className="w-full px-6 py-4 bg-brand-bg rounded-2xl border-none focus:ring-2 focus:ring-brand-primary transition-all outline-none"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="text-sm font-bold text-brand-dark uppercase tracking-wider">Message</label>
//                 <textarea 
//                   rows={4}
//                   placeholder="Your message here..."
//                   className="w-full px-6 py-4 bg-brand-bg rounded-2xl border-none focus:ring-2 focus:ring-brand-primary transition-all outline-none resize-none"
//                 ></textarea>
//               </div>
//               <button 
//                 type="submit"
//                 className="w-full bg-brand-dark text-white py-5 rounded-2xl font-bold text-lg hover:bg-brand-primary transition-all shadow-lg hover:-translate-y-1"
//               >
//                 Send Message
//               </button>
//             </form>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// };

const Footer = () => {
  return (
    <footer className="bg-[#111] text-gray-400 py-16">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
        <div className="col-span-2">
          <Logo light className="mb-6 scale-110 origin-left" />
          <p className="max-w-sm leading-relaxed">
            Bringing the authentic taste of North Indian home-style cooking to your doorstep. Fresh, healthy, and delicious meals, every single day.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4">
            <li><a href="#menu" className="hover:text-white transition-colors">Menu</a></li>
            <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#order" className="hover:text-white transition-colors">Order Now</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Follow Us</h4>
          <ul className="space-y-4">
            <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 text-center text-sm">
        <p>© 2026 Rozana Kitchen. All rights reserved. Home Style Indian Meals.</p>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <main className="font-sans">
      <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      <MenuSection />
      <About />
      <CTA />
      {/* <Contact /> */}
      <Footer />
    </main>
  );
}
