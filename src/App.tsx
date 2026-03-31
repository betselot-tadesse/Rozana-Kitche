/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ChevronRight, ChevronDown, Star, Clock, Utensils, Heart, Quote, Mail, Phone, MapPin, Plus, Trash2, Edit2, LogIn, LogOut, Settings, Save, Image as ImageIcon, Share2, Facebook, Instagram, Twitter, Youtube, Linkedin } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { auth, db, googleProvider, signInWithPopup, signInAnonymously, signOut, onAuthStateChanged,
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy, addDoc, serverTimestamp,
  handleFirestoreError, OperationType
} from "./firebase";
import { Language, translations } from "./translations";

const LanguageContext = React.createContext<{
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.en;
}>({
  lang: 'en',
  setLang: () => {},
  t: translations.en
});

const useLanguage = () => React.useContext(LanguageContext);

const Logo = ({ className = "", light = false }) => {
  const { lang } = useLanguage();
  return (
    <div className={`inline-flex flex-col items-center justify-center leading-none ${className}`}>
      <span className={`font-serif text-3xl md:text-4xl font-bold italic ${light ? 'text-white' : 'text-brand-dark'}`}>
        {lang === 'ar' ? 'روزانا' : lang === 'ur' ? 'روزانہ' : lang === 'hi' ? 'रोज़ाना' : 'Rozana'}
      </span>
      <div className="flex items-center gap-2 w-full mt-1">
        <div className={`h-[1px] flex-grow ${light ? 'bg-white/30' : 'bg-brand-dark/30'}`}></div>
        <span className={`text-[10px] md:text-[12px] font-bold tracking-[0.3em] uppercase ${light ? 'text-white/80' : 'text-brand-dark/80'}`}>
          {lang === 'ar' || lang === 'ur' ? 'مطبخ' : lang === 'hi' ? 'किचन' : 'Kitchen'}
        </span>
        <div className={`h-[1px] flex-grow ${light ? 'bg-white/30' : 'bg-brand-dark/30'}`}></div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const navLinks = isHomePage ? [
    { name: t.nav.menu, href: "#menu" },
    { name: t.nav.about, href: "#about" },
    { name: t.nav.order, href: "#order", cta: true }
  ] : [
    { name: t.nav.home, href: "/" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <Logo className="scale-75 md:scale-100 origin-left" />
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">

          {navLinks.map((link) => (
            link.cta ? (
              <a key={link.name} href={link.href} className="bg-brand-dark text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-brand-primary transition-all shadow-md">
                {link.name}
              </a>
            ) : (
              link.href.startsWith("#") ? (
                <a key={link.name} href={link.href} className="text-sm font-medium hover:text-brand-primary transition-colors">{link.name}</a>
              ) : (
                <Link key={link.name} to={link.href} className="text-sm font-medium hover:text-brand-primary transition-colors">{link.name}</Link>
              )
            )
          ))}
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button className="text-brand-dark" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
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
            {navLinks.map((link) => (
              link.cta ? (
                <a key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="bg-brand-dark text-white px-6 py-3 rounded-xl text-center font-medium">
                  {link.name}
                </a>
              ) : (
                link.href.startsWith("#") ? (
                  <a key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-lg font-medium">{link.name}</a>
                ) : (
                  <Link key={link.name} to={link.href} onClick={() => setIsOpen(false)} className="text-lg font-medium">{link.name}</Link>
                )
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const { t } = useLanguage();
  const languages = [
    { text: "Rozana", lang: "English" },
    { text: "रोज़ाना", lang: "Hindi" },
    { text: "روزانا", lang: "Arabic" },
    { text: "روزانہ", lang: "Urdu" }
  ];

  const [sliderImages, setSliderImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=1200&q=80"
  ]);

  const [langIndex, setLangIndex] = useState(0);
  const [sliderIndex, setSliderIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, "slider"), orderBy("order", "asc")), (snapshot) => {
      if (!snapshot.empty) {
        const images = snapshot.docs.map(doc => doc.data().url);
        setSliderImages(images);
      } else {
        // If empty, we can either keep defaults or set to empty. 
        // Let's set to empty so the admin can see it's empty, 
        // but maybe keep one default if we want something to show.
        setSliderImages([]);
      }
    }, (err) => {
      console.error("Hero Slider Error:", err);
      handleFirestoreError(err, OperationType.GET, "slider");
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const langInterval = setInterval(() => {
      setLangIndex((prev) => (prev + 1) % languages.length);
    }, 3000);
    
    const sliderInterval = setInterval(() => {
      if (sliderImages.length > 0) {
        setSliderIndex((prev) => (prev + 1) % sliderImages.length);
      }
    }, 5000);

    return () => {
      clearInterval(langInterval);
      clearInterval(sliderInterval);
    };
  }, [sliderImages.length]);

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
            {t.hero.title}<br />
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
            {t.hero.subtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#order" className="bg-white text-brand-dark px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:bg-brand-bg transition-all shadow-lg group">
              {t.hero.orderBtn} <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#menu" className="border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all">
              {t.hero.menuBtn}
            </a>
          </div>
        </motion.div>

        <div className="relative h-[400px] md:h-[500px] w-full">
          <div className="absolute -inset-4 bg-white/10 rounded-3xl blur-2xl -z-10"></div>
          <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 relative bg-brand-dark/50">
            <AnimatePresence mode="wait">
              <motion.img
                key={sliderIndex}
                src={sliderImages[sliderIndex] || "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=1200&q=80"}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="w-full h-full object-cover"
                alt="Delicious North Indian Food"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
            
            {/* Slider Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {sliderImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSliderIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    sliderIndex === i ? "bg-white w-6" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const { t } = useLanguage();
  const [features, setFeatures] = useState<any[]>([
    {
      icon: <Heart className="text-red-500" />,
      title: t.features.f1Title,
      desc: t.features.f1Desc,
      img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: <Clock className="text-brand-primary" />,
      title: t.features.f2Title,
      desc: t.features.f2Desc,
      img: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: <Utensils className="text-amber-600" />,
      title: t.features.f3Title,
      desc: t.features.f3Desc,
      img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
    }
  ]);

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, "features"), orderBy("order", "asc")), (snapshot) => {
      if (!snapshot.empty) {
        const featureItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFeatures(featureItems);
      }
    });
    return () => unsubscribe();
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Heart": return <Heart className="text-red-500" />;
      case "Clock": return <Clock className="text-brand-primary" />;
      case "Utensils": return <Utensils className="text-amber-600" />;
      case "Star": return <Star className="text-amber-500" />;
      case "Mail": return <Mail className="text-brand-primary" />;
      case "Phone": return <Phone className="text-brand-primary" />;
      case "MapPin": return <MapPin className="text-brand-primary" />;
      default: return <Heart className="text-red-500" />;
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-brand-dark mb-16">{t.features.sectionTitle}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div 
              key={f.id || i}
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
                  {f.id ? getIcon(f.icon) : f.icon}
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
  const { t } = useLanguage();

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
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={14} 
              fill={i < Math.floor(item.rating) ? "currentColor" : "none"} 
              className={i < Math.floor(item.rating) ? "" : "text-gray-300"}
            />
          ))}
          <span className="text-xs text-gray-400 ml-1">({item.rating.toFixed(1)})</span>
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
          {isExpanded ? t.menu.showLess : t.menu.readMore}
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
             <ChevronDown size={14} />
          </motion.div>
        </button>
      </div>
    </motion.div>
  );
};

const MenuSection = () => {
  const { t } = useLanguage();
  const [items, setItems] = useState<any[]>([
    {
      name: "Chicken Biryani",
      desc: "Fragrant long-grain basmati rice layered with succulent pieces of spiced chicken, slow-cooked to perfection with caramelized onions, fresh mint, and a secret blend of aromatic spices. Served with cooling raita and spicy salan.",
      img: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a",
      price: "AED 35",
      rating: 4.2
    },
    {
      name: "Butter Chicken",
      desc: "Our signature dish featuring tender tandoori-grilled chicken pieces simmered in a rich, velvety tomato and butter gravy. Infused with dried fenugreek leaves and finished with a dollop of fresh cream for that authentic home-style indulgence.",
      img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398",
      price: "AED 38",
      rating: 4.5
    },
    {
      name: "Chicken Thali",
      desc: "A complete, balanced comfort meal that brings the variety of an Indian home kitchen to your plate. Includes a hearty chicken curry, yellow dal tadka, steamed basmati rice, two handmade rotis, fresh garden salad, and a sweet treat of the day.",
      img: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976",
      price: "AED 45",
      rating: 5.0
    }
  ]);

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, "menu"), orderBy("order", "asc")), (snapshot) => {
      if (!snapshot.empty) {
        const menuItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setItems(menuItems);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <section id="menu" className="py-24 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div>
            <h2 className="text-4xl font-bold text-brand-dark mb-4">{t.menu.sectionTitle}</h2>
            <p className="text-gray-600 max-w-md">{t.menu.sectionSubtitle}</p>
          </div>
          <button className="text-brand-primary font-semibold flex items-center gap-2 hover:underline">
            {t.menu.viewFull} <ChevronRight size={18} />
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
  const { t } = useLanguage();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "about"), (snap) => {
      if (!snap.empty) {
        setData(snap.docs[0].data());
      }
    });
    return () => unsub();
  }, []);

  const aboutTitle = data?.title || t.about.title;
  const p1 = data?.p1 || t.about.p1;
  const p2 = data?.p2 || t.about.p2;
  const videoUrl = data?.videoUrl || "https://player.vimeo.com/external/434045526.sd.mp4?s=c27db96a9db273f6427db96a9db273f6427db96a&profile_id=164&oauth2_token_id=57447761";
  const videoLabel = data?.label || t.about.videoLabel;
  const videoSub = data?.sub || t.about.videoSub;

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
              <span className="text-brand-primary font-bold uppercase tracking-widest text-xs">{t.about.label}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-8 leading-tight">{aboutTitle}</h2>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                {p1}
              </p>
              <p>
                {p2}
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
                key={videoUrl}
                className="w-full h-full object-cover"
                poster="https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80"
              >
                <source src={videoUrl} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-sm font-bold uppercase tracking-widest mb-1">{videoLabel}</p>
                <p className="text-2xl font-serif italic">{videoSub}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};


const Testimonials = () => {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, "testimonials"), orderBy("order", "asc")), (snap) => {
      setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const defaultReviews = [
    {
      name: "Anjali Sharma",
      text: "The Butter Chicken is exactly how my mom makes it. Truly ghar jaisa khana! It's become my weekend ritual.",
      rating: 5,
      img: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRwOfMwQzEe6iEJ4htHWzJd7ivHaC2xGax6JvnNOpv1qe3tv36x"
    },
    {
      name: "Laxman Singh",
      text: "Fresh, hot, and delicious. My daily go-to for lunch at the office. The packaging is great and it always arrives on time.",
      rating: 5,
      img: "https://d2he8nskrbhxwq.cloudfront.net/upload/photos/2023/08/yZgOi2lcp8D2NiLaMgNQ_LaxmanSinghchouhan.jpeg"
    },
    {
      name: "Priya Iyer",
      text: "Finally found a place that doesn't use too much oil. Healthy, light, and incredibly tasty. Highly recommended!",
      rating: 5,
      img: "https://i.pinimg.com/originals/57/d8/09/57d809c016446ea2e5a218cb65596755.jpg"
    }
  ];

  const displayReviews = reviews.length > 0 ? reviews : defaultReviews;

  return (
    <section className="bg-brand-dark py-20 overflow-hidden relative">
      {/* Decorative Strip */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center mb-12">
          <span className="text-brand-primary font-bold uppercase tracking-[0.3em] text-xs mb-2">{t.testimonials.label}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center">{t.testimonials.title}</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {displayReviews.map((review, i) => (
            <motion.div
              key={review.id || i}
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
                  <span className="text-xs text-white/40 uppercase tracking-widest">{t.testimonials.verified}</span>
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
  const { t } = useLanguage();
  const partners = [
    { 
      name: "Keeta", 
      status: t.cta.available, 
      logo: "https://images.seeklogo.com/logo-png/64/1/keeta-logo-png_seeklogo-647664.png",
      color: "from-yellow-400 to-orange-500"
    },
    { 
      name: "Talabat", 
      status: t.cta.soon, 
      logo: "https://www.google.com/s2/favicons?domain=talabat.com&sz=128",
      color: "from-orange-500 to-red-600"
    },
    { 
      name: "Noon Food", 
      status: t.cta.soon, 
      logo: "https://www.google.com/s2/favicons?domain=noon.com&sz=128",
      color: "from-yellow-300 to-yellow-500"
    },
    { 
      name: "Careem", 
      status: t.cta.soon, 
      logo: "https://play-lh.googleusercontent.com/h5yVKbsRAo8WWePHLbHtisPrilCU3SM-tBecXmAVEA_8qOXqCigrZNYJNnDn7Q9BYg",
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
          <h2 className="text-3xl md:text-5xl font-bold mb-6">{t.cta.title}</h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            {t.cta.subtitle}
          </p>
          <a 
            href="#" 
            className="inline-block bg-white text-brand-dark px-8 py-4 rounded-full text-lg font-bold hover:bg-brand-bg transition-all shadow-xl hover:-translate-y-1 mb-12"
          >
            {t.cta.orderBtn}
          </a>

          <div className="pt-12 border-t border-white/10">
            <p className="text-sm uppercase tracking-[0.2em] text-white/40 mb-8 font-bold">{t.cta.partners}</p>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
              {partners.map((p, i) => (
                <div key={i} className="flex flex-col items-center gap-3 group">
                  <div className={`relative p-1 rounded-2xl transition-all duration-500 ${p.status === t.cta.available ? 'scale-110' : 'opacity-40 grayscale hover:grayscale-0 hover:opacity-70'}`}>
                    {/* Gradient Border for active */}
                    {p.status === t.cta.available && (
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

                    {p.status === t.cta.soon && (
                      <div className="absolute -top-2 -right-2 bg-brand-dark/80 backdrop-blur-sm text-white/60 text-[8px] font-bold px-2 py-1 rounded-full border border-white/10 shadow-lg uppercase tracking-tighter">
                        {t.cta.soon.replace("Coming ", "")}
                      </div>
                    )}
                  </div>
                  <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${p.status === t.cta.available ? 'text-white' : 'text-white/20'}`}>
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
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, "social"), orderBy("order", "asc")), (snap) => {
      setSocialLinks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <footer className="bg-[#111] text-gray-400 py-16">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
        <div className="col-span-2">
          <Logo light className="mb-6 scale-110 origin-left" />
          <p className="max-w-sm leading-relaxed">
            {t.footer.desc}
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">{t.footer.quickLinks}</h4>
          <ul className="space-y-4">
            <li><a href="#menu" className="hover:text-white transition-colors">{t.nav.menu}</a></li>
            <li><a href="#about" className="hover:text-white transition-colors">{t.nav.about}</a></li>
            <li><a href="#order" className="hover:text-white transition-colors">{t.nav.order}</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">{t.footer.followUs}</h4>
          <ul className="space-y-4">
            {socialLinks.length > 0 ? (
              socialLinks.map(link => (
                <li key={link.id}>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-3 hover:text-white transition-colors group"
                  >
                    <span className="text-gray-500 group-hover:text-brand-primary transition-colors">
                      {link.platform === 'facebook' && <Facebook size={18} />}
                      {link.platform === 'instagram' && <Instagram size={18} />}
                      {link.platform === 'twitter' && <Twitter size={18} />}
                      {link.platform === 'youtube' && <Youtube size={18} />}
                      {link.platform === 'linkedin' && <Linkedin size={18} />}
                    </span>
                    <span className="capitalize">{link.platform}</span>
                  </a>
                </li>
              ))
            ) : (
              <>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              </>
            )}
            <li><Link to="/admin" className="hover:text-white transition-colors">{t.footer.login}</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 text-center text-sm">
        <p>{t.footer.copyright}</p>
      </div>
    </footer>
  );
};

const AdminPanel = ({ isLoggedIn, setIsLoggedIn }: { isLoggedIn: boolean, setIsLoggedIn: (val: boolean) => void }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"menu" | "slider" | "social" | "features" | "about" | "testimonials">("menu");
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [sliderImages, setSliderImages] = useState<any[]>([]);
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [features, setFeatures] = useState<any[]>([]);
  const [aboutData, setAboutData] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Reset login form when not logged in or when navigating to admin
    if (!isLoggedIn) {
      setLoginForm({ username: "", password: "" });
    }
  }, [isLoggedIn, location.pathname]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => setSaveSuccess(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  // Form states
  const [newItem, setNewItem] = useState({ name: "", desc: "", img: "", price: "", rating: 5, order: 0 });
  const [newSlide, setNewSlide] = useState({ url: "", order: 0 });
  const [newSocial, setNewSocial] = useState({ platform: "facebook", url: "", order: 0 });
  const [newFeature, setNewFeature] = useState({ title: "", desc: "", img: "", icon: "Heart", order: 0 });
  const [newAbout, setNewAbout] = useState({ title: "", p1: "", p2: "", videoUrl: "", label: "", sub: "" });
  const [newTestimonial, setNewTestimonial] = useState({ name: "", text: "", rating: 5, img: "", order: 0 });
  
  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);

  const menuFileRef = useRef<HTMLInputElement>(null);
  const sliderFileRef = useRef<HTMLInputElement>(null);
  const featureFileRef = useRef<HTMLInputElement>(null);
  const testimonialFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubMenu = onSnapshot(query(collection(db, "menu"), orderBy("order", "asc")), (snap) => {
      setMenuItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => handleFirestoreError(err, OperationType.GET, "menu"));

    const unsubSlider = onSnapshot(query(collection(db, "slider"), orderBy("order", "asc")), (snap) => {
      setSliderImages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => handleFirestoreError(err, OperationType.GET, "slider"));

    const unsubSocial = onSnapshot(query(collection(db, "social"), orderBy("order", "asc")), (snap) => {
      setSocialLinks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => handleFirestoreError(err, OperationType.GET, "social"));

    const unsubFeatures = onSnapshot(query(collection(db, "features"), orderBy("order", "asc")), (snap) => {
      setFeatures(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => handleFirestoreError(err, OperationType.GET, "features"));

    const unsubAbout = onSnapshot(collection(db, "about"), (snap) => {
      setAboutData(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => handleFirestoreError(err, OperationType.GET, "about"));

    const unsubTestimonials = onSnapshot(query(collection(db, "testimonials"), orderBy("order", "asc")), (snap) => {
      setTestimonials(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => handleFirestoreError(err, OperationType.GET, "testimonials"));

    return () => { 
      unsubMenu(); unsubSlider(); unsubSocial(); unsubFeatures(); unsubAbout(); unsubTestimonials();
    };
  }, []);

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
    setEditingId(null);
    setNewItem({ name: "", desc: "", img: "", price: "", rating: 5, order: 0 });
    setNewSlide({ url: "", order: 0 });
    setNewSocial({ platform: "facebook", url: "", order: 0 });
    setNewFeature({ title: "", desc: "", img: "", icon: "Heart", order: 0 });
    setNewTestimonial({ name: "", text: "", rating: 5, img: "", order: 0 });
    
    if (tab === "about" && aboutData.length > 0) {
      const item = aboutData[0];
      setNewAbout({
        title: item.title || "",
        p1: item.p1 || "",
        p2: item.p2 || "",
        videoUrl: item.videoUrl || "",
        label: item.label || "",
        sub: item.sub || ""
      });
    } else {
      setNewAbout({ title: "", p1: "", p2: "", videoUrl: "", label: "", sub: "" });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === "rozana" && loginForm.password === "1061") {
      try {
        // Use anonymous authentication to allow Firestore writes without a popup
        if (!auth.currentUser) {
          await signInAnonymously(auth);
        }
        setIsLoggedIn(true);
        setLoginError("");
      } catch (error: any) {
        console.error("Firebase Auth Error:", error);
        setLoginError(`Authentication failed: ${error.message || "Unknown error"}. Please check your connection.`);
      }
    } else {
      setLoginError("Invalid username or password");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "menu" | "slider" | "feature" | "testimonial") => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 512 * 1024) {
        setToast("File too large! Please upload an image smaller than 500KB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (type === "menu") {
          setNewItem({ ...newItem, img: base64String });
        } else if (type === "slider") {
          setNewSlide({ ...newSlide, url: base64String });
        } else if (type === "feature") {
          setNewFeature({ ...newFeature, img: base64String });
        } else if (type === "testimonial") {
          setNewTestimonial({ ...newTestimonial, img: base64String });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaveSuccess(false);
    try {
      // About is usually a single document or we update the first one
      const docId = aboutData.length > 0 ? aboutData[0].id : "main";
      await setDoc(doc(db, "about", docId), newAbout);
      
      setSaveSuccess(true);
      setToast("About section updated successfully!");
      setTimeout(() => {
        setSaveSuccess(false);
        setLoading(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      setLoading(false);
      handleFirestoreError(err, OperationType.WRITE, "about");
      setToast("Error saving about section. Please try again.");
    }
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonial.img && !editingId) {
      setToast("Please upload an image first!");
      return;
    }
    setLoading(true);
    setSaveSuccess(false);
    try {
      if (editingId) {
        await updateDoc(doc(db, "testimonials", editingId), { ...newTestimonial, rating: Number(newTestimonial.rating), order: Number(newTestimonial.order) });
        setEditingId(null);
      } else {
        await addDoc(collection(db, "testimonials"), { ...newTestimonial, rating: Number(newTestimonial.rating), order: Number(newTestimonial.order) });
      }
      setNewTestimonial({ name: "", text: "", rating: 5, img: "", order: 0 });
      if (testimonialFileRef.current) testimonialFileRef.current.value = "";
      setSaveSuccess(true);
      setToast("Testimonial saved successfully!");
      setTimeout(() => {
        setSaveSuccess(false);
        setLoading(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      setLoading(false);
      handleFirestoreError(err, OperationType.WRITE, "testimonials");
      setToast("Error saving testimonial. Please try again.");
    }
  };

  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.img && !editingId) {
      setToast("Please upload an image first!");
      return;
    }
    setLoading(true);
    setSaveSuccess(false);
    try {
      if (editingId) {
        await updateDoc(doc(db, "menu", editingId), { ...newItem, rating: Number(newItem.rating), order: Number(newItem.order) });
        setEditingId(null);
      } else {
        await addDoc(collection(db, "menu"), { ...newItem, rating: Number(newItem.rating), order: Number(newItem.order) });
      }
      setNewItem({ name: "", desc: "", img: "", price: "", rating: 5, order: 0 });
      if (menuFileRef.current) menuFileRef.current.value = "";
      setSaveSuccess(true);
      setToast("Dish saved successfully!");
      setTimeout(() => {
        setSaveSuccess(false);
        setLoading(false);
      }, 1500);
    } catch (err) { 
      console.error(err);
      setLoading(false);
      handleFirestoreError(err, OperationType.WRITE, "menu");
      setToast("Error saving dish. Please try again.");
    }
  };

  const handleAddSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Attempting to save slide:", newSlide, "Editing ID:", editingId);
    if (!newSlide.url && !editingId) {
      setToast("Please upload an image first!");
      return;
    }
    setLoading(true);
    setSaveSuccess(false);
    try {
      const slideData = { 
        url: newSlide.url, 
        order: Number(newSlide.order || 0) 
      };
      
      if (editingId) {
        console.log("Updating slide:", editingId, slideData);
        await updateDoc(doc(db, "slider", editingId), slideData);
        setEditingId(null);
      } else {
        console.log("Adding new slide:", slideData);
        await addDoc(collection(db, "slider"), slideData);
      }
      setNewSlide({ url: "", order: 0 });
      if (sliderFileRef.current) sliderFileRef.current.value = "";
      setSaveSuccess(true);
      setToast("Slide saved successfully!");
      console.log("Slide saved successfully!");
      setTimeout(() => {
        setSaveSuccess(false);
        setLoading(false);
      }, 1500);
    } catch (err) { 
      console.error("Error in handleAddSlide:", err);
      setLoading(false);
      handleFirestoreError(err, OperationType.WRITE, "slider");
      setToast("Error saving slide. Please try again.");
    }
  };

  const handleAddSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocial.url) {
      setToast("Please enter a URL!");
      return;
    }
    setLoading(true);
    setSaveSuccess(false);
    try {
      if (editingId) {
        await updateDoc(doc(db, "social", editingId), { ...newSocial, order: Number(newSocial.order) });
        setEditingId(null);
      } else {
        await addDoc(collection(db, "social"), { ...newSocial, order: Number(newSocial.order) });
      }
      setNewSocial({ platform: "facebook", url: "", order: 0 });
      setSaveSuccess(true);
      setToast("Social link saved successfully!");
      setTimeout(() => {
        setSaveSuccess(false);
        setLoading(false);
      }, 1500);
    } catch (err) { 
      console.error(err);
      setLoading(false);
      handleFirestoreError(err, OperationType.WRITE, "social");
      setToast("Error saving social link. Please try again.");
    }
  };

  const handleAddFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeature.img && !editingId) {
      setToast("Please upload an image first!");
      return;
    }
    setLoading(true);
    setSaveSuccess(false);
    try {
      if (editingId) {
        await updateDoc(doc(db, "features", editingId), { ...newFeature, order: Number(newFeature.order) });
        setEditingId(null);
      } else {
        await addDoc(collection(db, "features"), { ...newFeature, order: Number(newFeature.order) });
      }
      setNewFeature({ title: "", desc: "", img: "", icon: "Heart", order: 0 });
      if (featureFileRef.current) featureFileRef.current.value = "";
      setSaveSuccess(true);
      setToast("Feature saved successfully!");
      setTimeout(() => {
        setSaveSuccess(false);
        setLoading(false);
      }, 1500);
    } catch (err) { 
      console.error(err);
      setLoading(false);
      handleFirestoreError(err, OperationType.WRITE, "features");
      setToast("Error saving feature. Please try again.");
    }
  };

  const startEdit = (type: "menu" | "slider" | "social" | "feature" | "testimonial" | "about", item: any) => {
    setEditingId(item.id);
    if (type === "menu") {
      setNewItem({ 
        name: item.name || "", 
        desc: item.desc || "", 
        img: item.img || "", 
        price: item.price || "", 
        rating: item.rating ?? 5, 
        order: item.order ?? 0 
      });
      setActiveTab("menu");
    } else if (type === "slider") {
      setNewSlide({ 
        url: item.url || "", 
        order: item.order ?? 0 
      });
      setActiveTab("slider");
    } else if (type === "social") {
      setNewSocial({ 
        platform: item.platform || "facebook", 
        url: item.url || "", 
        order: item.order ?? 0 
      });
      setActiveTab("social");
    } else if (type === "feature") {
      setNewFeature({
        title: item.title || "",
        desc: item.desc || "",
        img: item.img || "",
        icon: item.icon || "Heart",
        order: item.order ?? 0
      });
      setActiveTab("features");
    } else if (type === "testimonial") {
      setNewTestimonial({
        name: item.name || "",
        text: item.text || "",
        rating: item.rating ?? 5,
        img: item.img || "",
        order: item.order ?? 0
      });
      setActiveTab("testimonials");
    } else if (type === "about") {
      setNewAbout({
        title: item.title || "",
        p1: item.p1 || "",
        p2: item.p2 || "",
        videoUrl: item.videoUrl || "",
        label: item.label || "",
        sub: item.sub || ""
      });
      setActiveTab("about");
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewItem({ name: "", desc: "", img: "", price: "", rating: 5, order: 0 });
    setNewSlide({ url: "", order: 0 });
    setNewSocial({ platform: "facebook", url: "", order: 0 });
    setNewFeature({ title: "", desc: "", img: "", icon: "Heart", order: 0 });
    setNewAbout({ title: "", p1: "", p2: "", videoUrl: "", label: "", sub: "" });
    setNewTestimonial({ name: "", text: "", rating: 5, img: "", order: 0 });
  };

  const handleDelete = async (coll: string, id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteDoc(doc(db, coll, id));
      setToast("Item deleted successfully!");
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `${coll}/${id}`);
    }
  };

  if (!isLoggedIn) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bg p-6 text-center">
      <div className="bg-white p-12 rounded-[3rem] shadow-2xl max-w-md w-full border border-black/5">
        <Logo className="mb-8" />
        <h2 className="text-3xl font-bold text-brand-dark mb-4">{t.admin.loginTitle}</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">{t.admin.loginDesc}</p>
        
        <form onSubmit={handleLogin} className="space-y-4 text-left" autoComplete="off">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.admin.username}</label>
            <input 
              type="text" 
              required 
              autoComplete="off"
              className="admin-input" 
              value={loginForm.username || ""} 
              onChange={e => setLoginForm({...loginForm, username: e.target.value || ""})} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.admin.password}</label>
            <input 
              type="password" 
              required 
              autoComplete="new-password"
              className="admin-input" 
              value={loginForm.password || ""} 
              onChange={e => setLoginForm({...loginForm, password: e.target.value || ""})} 
            />
          </div>
          {loginError && <p className="text-red-500 text-sm font-bold">{loginError}</p>}
          <button 
            type="submit"
            className="w-full bg-brand-dark text-white py-5 rounded-2xl font-bold text-lg hover:bg-brand-primary transition-all shadow-lg flex items-center justify-center gap-3"
          >
            <LogIn size={24} /> {t.admin.loginBtn}
          </button>
        </form>

        <Link to="/" className="inline-block mt-8 text-sm font-bold text-brand-primary hover:underline uppercase tracking-widest">
          {t.admin.backToWeb}
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-bg pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col min-h-[80vh]">
          <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-brand-dark text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center">
                <Settings size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{t.admin.dashboard}</h2>
                <p className="text-white/60 text-sm">{t.admin.welcome}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-sm font-bold"
              >
                <LogOut size={18} /> {t.admin.logout}
              </button>
              <Link to="/" className="p-3 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </Link>
            </div>
          </div>

          <div className="flex border-b border-gray-100 bg-gray-50/50">
            <button 
              onClick={() => setActiveTab("menu")}
              className={`flex-1 py-6 font-bold text-sm uppercase tracking-widest transition-all ${activeTab === 'menu' ? 'text-brand-primary border-b-4 border-brand-primary bg-white' : 'text-gray-400 hover:text-brand-dark'}`}
            >
              {t.admin.foodMenu}
            </button>
            <button 
              onClick={() => setActiveTab("slider")}
              className={`flex-1 py-6 font-bold text-sm uppercase tracking-widest transition-all ${activeTab === 'slider' ? 'text-brand-primary border-b-4 border-brand-primary bg-white' : 'text-gray-400 hover:text-brand-dark'}`}
            >
              {t.admin.heroSlider}
            </button>
            <button 
              onClick={() => setActiveTab("social")}
              className={`flex-1 py-6 font-bold text-sm uppercase tracking-widest transition-all ${activeTab === 'social' ? 'text-brand-primary border-b-4 border-brand-primary bg-white' : 'text-gray-400 hover:text-brand-dark'}`}
            >
              {t.admin.socialLinks}
            </button>
            <button 
              onClick={() => setActiveTab("features")}
              className={`flex-1 py-6 font-bold text-sm uppercase tracking-widest transition-all ${activeTab === 'features' ? 'text-brand-primary border-b-4 border-brand-primary bg-white' : 'text-gray-400 hover:text-brand-dark'}`}
            >
              {t.admin.features}
            </button>
            <button 
              onClick={() => setActiveTab("about")}
              className={`flex-1 py-6 font-bold text-sm uppercase tracking-widest transition-all ${activeTab === 'about' ? 'text-brand-primary border-b-4 border-brand-primary bg-white' : 'text-gray-400 hover:text-brand-dark'}`}
            >
              {t.admin.about || "About"}
            </button>
            <button 
              onClick={() => setActiveTab("testimonials")}
              className={`flex-1 py-6 font-bold text-sm uppercase tracking-widest transition-all ${activeTab === 'testimonials' ? 'text-brand-primary border-b-4 border-brand-primary bg-white' : 'text-gray-400 hover:text-brand-dark'}`}
            >
              {t.admin.testimonials || "Testimonials"}
            </button>
          </div>

          <div className="flex-1 p-8 md:p-12 relative">
            <AnimatePresence>
              {toast && (
                <motion.div 
                  initial={{ opacity: 0, y: -20, x: "-50%" }}
                  animate={{ opacity: 1, y: 0, x: "-50%" }}
                  exit={{ opacity: 0, y: -20, x: "-50%" }}
                  className="fixed top-24 left-1/2 bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl font-bold z-[100] flex items-center gap-3 border-2 border-white/20"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Save size={18} />
                  </div>
                  {toast}
                </motion.div>
              )}
            </AnimatePresence>
            {activeTab === "menu" ? (
              <div className="space-y-12">
                <form onSubmit={handleAddMenuItem} className="bg-brand-bg p-8 rounded-[2rem] border border-black/5 space-y-6">
                  <h3 className="font-bold text-xl flex items-center gap-3">
                    {editingId ? <Edit2 size={24} className="text-brand-primary" /> : <Plus size={24} className="text-brand-primary" />} 
                    {editingId ? t.admin.editDish : t.admin.addDish}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.admin.dishName}</label>
                      <input required placeholder={t.admin.dishNamePlaceholder} className="admin-input" value={newItem.name || ""} onChange={e => setNewItem({...newItem, name: e.target.value || ""})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.admin.price}</label>
                      <input required placeholder={t.admin.pricePlaceholder} className="admin-input" value={newItem.price || ""} onChange={e => setNewItem({...newItem, price: e.target.value || ""})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.admin.imageUpload}</label>
                      <input ref={menuFileRef} type="file" accept="image/*" className="admin-input" onChange={e => handleFileUpload(e, "menu")} />
                      {newItem.img && <p className="text-[10px] text-green-600 font-bold">{t.admin.imageReady}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.admin.rating}</label>
                        <input type="number" step="0.1" max="5" min="1" className="admin-input" value={newItem.rating ?? 5} onChange={e => setNewItem({...newItem, rating: Number(e.target.value) || 0})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.admin.order}</label>
                        <input type="number" className="admin-input" value={newItem.order ?? 0} onChange={e => setNewItem({...newItem, order: Number(e.target.value) || 0})} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.admin.description}</label>
                    <textarea required placeholder={t.admin.descriptionPlaceholder} className="admin-input w-full h-32 resize-none" value={newItem.desc || ""} onChange={e => setNewItem({...newItem, desc: e.target.value || ""})} />
                  </div>
                  <div className="flex gap-4">
                    <button disabled={loading} type="submit" className={`flex-1 py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-xl ${saveSuccess ? 'bg-green-600 text-white' : 'bg-brand-primary text-white hover:bg-brand-dark'}`}>
                      {saveSuccess ? <><Save size={24} /> {t.admin.saved || "Saved!"}</> : loading ? t.admin.saving : <><Save size={24} /> {editingId ? t.admin.updateDish : t.admin.saveDish}</>}
                    </button>
                    {editingId && (
                      <button type="button" onClick={cancelEdit} className="px-8 bg-gray-200 text-gray-600 py-5 rounded-2xl font-bold text-lg hover:bg-gray-300 transition-all">
                        {t.admin.cancel}
                      </button>
                    )}
                  </div>
                </form>

                <div className="space-y-6">
                  <h3 className="font-bold text-xl">{t.admin.currentItems}</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {menuItems.map(item => (
                      <div key={item.id} className="flex items-center gap-6 p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all group">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                          <img src={item.img} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-brand-dark text-lg">{item.name}</p>
                          <p className="text-sm text-brand-primary font-bold">{item.price}</p>
                          <p className="text-xs text-gray-400 mt-1">{t.admin.order}: {item.order} • {t.admin.rating}: {item.rating}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button onClick={() => startEdit("menu", item)} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-brand-primary hover:bg-brand-bg rounded-xl transition-colors">
                            <Edit2 size={16} />
                            {t.admin.edit}
                          </button>
                          <button onClick={() => handleDelete("menu", item.id)} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                            <Trash2 size={16} />
                            {t.admin.delete}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : activeTab === "slider" ? (
              <div className="space-y-12">
                <form onSubmit={handleAddSlide} className="bg-brand-bg p-8 rounded-[2rem] border border-black/5 space-y-6">
                  <h3 className="font-bold text-xl flex items-center gap-3">
                    {editingId ? <Edit2 size={24} className="text-brand-primary" /> : <ImageIcon size={24} className="text-brand-primary" />} 
                    {editingId ? t.admin.editSlide : t.admin.addSlide}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.admin.imageUpload}</label>
                      <input ref={sliderFileRef} type="file" accept="image/*" className="admin-input" onChange={e => handleFileUpload(e, "slider")} />
                      {newSlide.url && <p className="text-[10px] text-green-600 font-bold">{t.admin.imageReady}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.admin.displayOrder}</label>
                      <input type="number" className="admin-input" value={newSlide.order ?? 0} onChange={e => setNewSlide({...newSlide, order: Number(e.target.value) || 0})} />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button disabled={loading} type="submit" className={`flex-1 py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-xl ${saveSuccess ? 'bg-green-600 text-white' : 'bg-brand-primary text-white hover:bg-brand-dark'}`}>
                      {saveSuccess ? <><Save size={24} /> {t.admin.saved || "Saved!"}</> : loading ? t.admin.saving : <><Save size={24} /> {editingId ? t.admin.updateImage : t.admin.saveImage}</>}
                    </button>
                    {editingId && (
                      <button type="button" onClick={cancelEdit} className="px-8 bg-gray-200 text-gray-600 py-5 rounded-2xl font-bold text-lg hover:bg-gray-300 transition-all">
                        {t.admin.cancel}
                      </button>
                    )}
                  </div>
                </form>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {sliderImages.map(slide => (
                    <div key={slide.id} className="relative group rounded-[2rem] overflow-hidden aspect-video shadow-lg border-4 border-white">
                      <img src={slide.url} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <button onClick={() => startEdit("slider", slide)} className="bg-white px-4 py-2 rounded-xl text-brand-primary shadow-xl hover:scale-105 transition-all flex items-center gap-2 font-bold text-sm">
                          <Edit2 size={16} />
                          {t.admin.edit}
                        </button>
                        <button onClick={() => handleDelete("slider", slide.id)} className="bg-white px-4 py-2 rounded-xl text-red-500 shadow-xl hover:scale-105 transition-all flex items-center gap-2 font-bold text-sm">
                          <Trash2 size={16} />
                          {t.admin.delete}
                        </button>
                      </div>
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full">
                        {t.admin.order}: {slide.order}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeTab === "features" ? (
              <div className="space-y-12">
                <form onSubmit={handleAddFeature} className="bg-brand-bg p-8 rounded-[2rem] border border-black/5 space-y-6">
                  <h3 className="font-bold text-xl flex items-center gap-3">
                    {editingId ? <Edit2 size={24} className="text-brand-primary" /> : <Plus size={24} className="text-brand-primary" />} 
                    {editingId ? t.admin.editFeature : t.admin.addFeature}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.admin.featureTitle}</label>
                      <input required className="admin-input" value={newFeature.title || ""} onChange={e => setNewFeature({...newFeature, title: e.target.value || ""})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.admin.featureIcon}</label>
                      <select className="admin-input" value={newFeature.icon || "Heart"} onChange={e => setNewFeature({...newFeature, icon: e.target.value})}>
                        {["Heart", "Clock", "Utensils", "Star", "Mail", "Phone", "MapPin"].map(icon => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.admin.imageUpload}</label>
                      <input ref={featureFileRef} type="file" accept="image/*" className="admin-input" onChange={e => handleFileUpload(e, "feature")} />
                      {newFeature.img && <p className="text-[10px] text-green-600 font-bold">{t.admin.imageReady}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.admin.order}</label>
                      <input type="number" className="admin-input" value={newFeature.order ?? 0} onChange={e => setNewFeature({...newFeature, order: Number(e.target.value) || 0})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.admin.description}</label>
                    <textarea required className="admin-input w-full h-32 resize-none" value={newFeature.desc || ""} onChange={e => setNewFeature({...newFeature, desc: e.target.value || ""})} />
                  </div>
                  <div className="flex gap-4">
                    <button disabled={loading} type="submit" className={`flex-1 py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-xl ${saveSuccess ? 'bg-green-600 text-white' : 'bg-brand-primary text-white hover:bg-brand-dark'}`}>
                      {saveSuccess ? <><Save size={24} /> {t.admin.saved || "Saved!"}</> : loading ? t.admin.saving : <><Save size={24} /> {editingId ? t.admin.updateFeature : t.admin.saveFeature}</>}
                    </button>
                    {editingId && (
                      <button type="button" onClick={cancelEdit} className="px-8 bg-gray-200 text-gray-600 py-5 rounded-2xl font-bold text-lg hover:bg-gray-300 transition-all">
                        {t.admin.cancel}
                      </button>
                    )}
                  </div>
                </form>

                <div className="space-y-6">
                  <h3 className="font-bold text-xl">{t.admin.currentFeatures}</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {features.map(f => (
                      <div key={f.id} className="flex items-center gap-6 p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all group">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                          <img src={f.img} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-brand-dark text-lg">{f.title}</p>
                          <p className="text-xs text-gray-400 mt-1">{t.admin.order}: {f.order} • {t.admin.featureIcon}: {f.icon}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button onClick={() => startEdit("feature", f)} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-brand-primary hover:bg-brand-bg rounded-xl transition-colors">
                            <Edit2 size={16} />
                            {t.admin.edit}
                          </button>
                          <button onClick={() => handleDelete("features", f.id)} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                            <Trash2 size={16} />
                            {t.admin.delete}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : activeTab === "social" ? (
              <div className="space-y-12">
                <form onSubmit={handleAddSocial} className="bg-brand-bg p-8 rounded-[2rem] border border-black/5 space-y-6">
                  <h3 className="font-bold text-xl flex items-center gap-3">
                    {editingId ? <Edit2 size={24} className="text-brand-primary" /> : <Share2 size={24} className="text-brand-primary" />} 
                    {editingId ? t.admin.editSocial : t.admin.addSocial}
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.admin.platform}</label>
                      <select 
                        className="admin-input w-full" 
                        value={newSocial.platform || "facebook"} 
                        onChange={e => setNewSocial({...newSocial, platform: e.target.value})}
                      >
                        <option value="facebook">Facebook</option>
                        <option value="instagram">Instagram</option>
                        <option value="twitter">Twitter / X</option>
                        <option value="youtube">YouTube</option>
                        <option value="linkedin">LinkedIn</option>
                      </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.admin.profileUrl}</label>
                      <input 
                        required 
                        placeholder={t.admin.urlPlaceholder} 
                        className="admin-input" 
                        value={newSocial.url || ""} 
                        onChange={e => setNewSocial({...newSocial, url: e.target.value || ""})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.admin.displayOrder}</label>
                      <input 
                        type="number" 
                        className="admin-input" 
                        value={newSocial.order ?? 0} 
                        onChange={e => setNewSocial({...newSocial, order: Number(e.target.value) || 0})} 
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button disabled={loading} type="submit" className={`flex-1 py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-xl ${saveSuccess ? 'bg-green-600 text-white' : 'bg-brand-primary text-white hover:bg-brand-dark'}`}>
                      {saveSuccess ? <><Save size={24} /> {t.admin.saved || "Saved!"}</> : loading ? t.admin.saving : <><Save size={24} /> {editingId ? t.admin.updateLink : t.admin.saveLink}</>}
                    </button>
                    {editingId && (
                      <button type="button" onClick={cancelEdit} className="px-8 bg-gray-200 text-gray-600 py-5 rounded-2xl font-bold text-lg hover:bg-gray-300 transition-all">
                        {t.admin.cancel}
                      </button>
                    )}
                  </div>
                </form>

                <div className="space-y-6">
                  <h3 className="font-bold text-xl">{t.admin.currentSocial}</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {socialLinks.map(link => (
                      <div key={link.id} className="flex items-center gap-6 p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all group">
                        <div className="w-12 h-12 bg-brand-bg rounded-xl flex items-center justify-center text-brand-primary shrink-0">
                          {link.platform === 'facebook' && <Facebook size={24} />}
                          {link.platform === 'instagram' && <Instagram size={24} />}
                          {link.platform === 'twitter' && <Twitter size={24} />}
                          {link.platform === 'youtube' && <Youtube size={24} />}
                          {link.platform === 'linkedin' && <Linkedin size={24} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-brand-dark capitalize">{link.platform}</p>
                          <p className="text-xs text-gray-400 truncate">{link.url}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button onClick={() => startEdit("social", link)} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-brand-primary hover:bg-brand-bg rounded-xl transition-colors">
                            <Edit2 size={16} />
                            {t.admin.edit}
                          </button>
                          <button onClick={() => handleDelete("social", link.id)} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                            <Trash2 size={16} />
                            {t.admin.delete}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : activeTab === "about" ? (
              <div className="space-y-12">
                <form onSubmit={handleAddAbout} className="bg-brand-bg p-8 rounded-[2rem] border border-black/5 space-y-6">
                  <h3 className="font-bold text-xl flex items-center gap-3">
                    <Edit2 size={24} className="text-brand-primary" /> 
                    {t.admin.editAbout || "Edit About Section"}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.admin.title || "Title"}</label>
                      <input required className="admin-input" value={newAbout.title || ""} onChange={e => setNewAbout({...newAbout, title: e.target.value || ""})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.admin.videoUrl || "Video URL"}</label>
                      <input className="admin-input" value={newAbout.videoUrl || ""} onChange={e => setNewAbout({...newAbout, videoUrl: e.target.value || ""})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.admin.videoLabel || "Video Label"}</label>
                      <input className="admin-input" value={newAbout.label || ""} onChange={e => setNewAbout({...newAbout, label: e.target.value || ""})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.admin.videoSub || "Video Subtitle"}</label>
                      <input className="admin-input" value={newAbout.sub || ""} onChange={e => setNewAbout({...newAbout, sub: e.target.value || ""})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.admin.paragraph1 || "Paragraph 1"}</label>
                    <textarea required className="admin-input w-full h-32 resize-none" value={newAbout.p1 || ""} onChange={e => setNewAbout({...newAbout, p1: e.target.value || ""})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.admin.paragraph2 || "Paragraph 2"}</label>
                    <textarea required className="admin-input w-full h-32 resize-none" value={newAbout.p2 || ""} onChange={e => setNewAbout({...newAbout, p2: e.target.value || ""})} />
                  </div>
                  <div className="flex gap-4">
                    <button disabled={loading} type="submit" className={`flex-1 py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-xl ${saveSuccess ? 'bg-green-600 text-white' : 'bg-brand-primary text-white hover:bg-brand-dark'}`}>
                      {saveSuccess ? <><Save size={24} /> {t.admin.saved || "Saved!"}</> : loading ? t.admin.saving : <><Save size={24} /> {t.admin.saveAbout || "Save About Section"}</>}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-12">
                <form onSubmit={handleAddTestimonial} className="bg-brand-bg p-8 rounded-[2rem] border border-black/5 space-y-6">
                  <h3 className="font-bold text-xl flex items-center gap-3">
                    {editingId ? <Edit2 size={24} className="text-brand-primary" /> : <Plus size={24} className="text-brand-primary" />} 
                    {editingId ? t.admin.editTestimonial || "Edit Testimonial" : t.admin.addTestimonial || "Add Testimonial"}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.admin.clientName || "Client Name"}</label>
                      <input required className="admin-input" value={newTestimonial.name || ""} onChange={e => setNewTestimonial({...newTestimonial, name: e.target.value || ""})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.admin.rating || "Rating"}</label>
                      <input type="number" step="1" max="5" min="1" className="admin-input" value={newTestimonial.rating ?? 5} onChange={e => setNewTestimonial({...newTestimonial, rating: Number(e.target.value) || 0})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.admin.imageUpload || "Image Upload"}</label>
                      <input ref={testimonialFileRef} type="file" accept="image/*" className="admin-input" onChange={e => handleFileUpload(e, "testimonial")} />
                      {newTestimonial.img && <p className="text-[10px] text-green-600 font-bold">{t.admin.imageReady}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.admin.order || "Order"}</label>
                      <input type="number" className="admin-input" value={newTestimonial.order ?? 0} onChange={e => setNewTestimonial({...newTestimonial, order: Number(e.target.value) || 0})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.admin.testimonialText || "Testimonial Text"}</label>
                    <textarea required className="admin-input w-full h-32 resize-none" value={newTestimonial.text || ""} onChange={e => setNewTestimonial({...newTestimonial, text: e.target.value || ""})} />
                  </div>
                  <div className="flex gap-4">
                    <button disabled={loading} type="submit" className={`flex-1 py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-xl ${saveSuccess ? 'bg-green-600 text-white' : 'bg-brand-primary text-white hover:bg-brand-dark'}`}>
                      {saveSuccess ? <><Save size={24} /> {t.admin.saved || "Saved!"}</> : loading ? t.admin.saving : <><Save size={24} /> {editingId ? t.admin.updateTestimonial || "Update Testimonial" : t.admin.saveTestimonial || "Save Testimonial"}</>}
                    </button>
                    {editingId && (
                      <button type="button" onClick={cancelEdit} className="px-8 bg-gray-200 text-gray-600 py-5 rounded-2xl font-bold text-lg hover:bg-gray-300 transition-all">
                        {t.admin.cancel}
                      </button>
                    )}
                  </div>
                </form>

                <div className="space-y-6">
                  <h3 className="font-bold text-xl">{t.admin.currentTestimonials || "Current Testimonials"}</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {testimonials.map(tst => (
                      <div key={tst.id} className="flex items-center gap-6 p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all group">
                        <div className="w-16 h-16 rounded-full overflow-hidden shrink-0">
                          <img src={tst.img} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-brand-dark">{tst.name}</p>
                          <p className="text-xs text-gray-400 line-clamp-2">{tst.text}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button onClick={() => startEdit("testimonial", tst)} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-brand-primary hover:bg-brand-bg rounded-xl transition-colors">
                            <Edit2 size={16} />
                            {t.admin.edit}
                          </button>
                          <button onClick={() => handleDelete("testimonials", tst.id)} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                            <Trash2 size={16} />
                            {t.admin.delete}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => (
  <>
    <Hero />
    <Features />
    <Testimonials />
    <MenuSection />
    <About />
    <CTA />
    <Footer />
  </>
);

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem("rozana_lang");
    return (saved as Language) || 'en';
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("rozana_isLoggedIn") === "true";
  });

  useEffect(() => {
    localStorage.setItem("rozana_isLoggedIn", isLoggedIn ? "true" : "false");
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem("rozana_lang", lang);
    document.documentElement.dir = translations[lang].dir;
    document.documentElement.lang = lang;
  }, [lang]);

  const value = {
    lang,
    setLang,
    t: translations[lang]
  };

  return (
    <LanguageContext.Provider value={value}>
      <BrowserRouter>
        <main className="font-sans">
          <Navbar />
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminPanel isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
          </Routes>
        </main>
      </BrowserRouter>
    </LanguageContext.Provider>
  );
}
