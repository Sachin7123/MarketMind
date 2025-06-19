"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FileClock,
  Home,
  WalletCards,
  User,
  ArrowRight,
  Sparkles,
  Zap,
  Brain,
  Rocket,
  Star,
  Users,
  Shield,
  Code,
  ChevronRight,
  CheckCircle2,
  Lightbulb,
  BarChart3,
  Globe,
  Lock,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
};

export default function LandingPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Array<{ x: number; y: number }>>(
    []
  );
  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  useEffect(() => {
    setIsVisible(true);
    // Initialize particles on client side
    const initialParticles = Array.from({ length: 30 }, () => ({
      x:
        Math.random() *
        (typeof window !== "undefined" ? window.innerWidth : 1000),
      y:
        Math.random() *
        (typeof window !== "undefined" ? window.innerHeight : 1000),
    }));
    setParticles(initialParticles);
  }, []);

  const features = [
    {
      title: "AI-Powered Content",
      description: "Generate high-quality content with advanced AI technology",
      icon: Brain,
      gradient: "from-purple-500 to-pink-500",
      color: "purple",
    },
    {
      title: "Smart Templates",
      description: "Access pre-built templates for various content types",
      icon: Code,
      gradient: "from-blue-500 to-cyan-500",
      color: "blue",
    },
    {
      title: "Real-time Analytics",
      description: "Track performance and engagement metrics",
      icon: BarChart3,
      gradient: "from-yellow-500 to-orange-500",
      color: "yellow",
    },
    {
      title: "Team Collaboration",
      description: "Work seamlessly with your team members",
      icon: Users,
      gradient: "from-green-500 to-emerald-500",
      color: "green",
    },
  ];

  const testimonials = [
    {
      quote:
        "MarketMind has revolutionized our content creation process. The AI capabilities are incredible!",
      author: "Sarah Johnson",
      role: "Content Director",
      company: "TechCorp",
      image: "/testimonials/sarah.jpg",
    },
    {
      quote:
        "The templates and analytics have helped us scale our content strategy significantly.",
      author: "Michael Chen",
      role: "Marketing Manager",
      company: "GrowthLabs",
      image: "/testimonials/michael.jpg",
    },
    {
      quote:
        "Best AI content platform we've used. The results speak for themselves.",
      author: "Emma Davis",
      role: "CEO",
      company: "StartupX",
      image: "/testimonials/emma.jpg",
    },
  ];

  const benefits = [
    { text: "No credit card required", icon: Lock },
    { text: "14-day free trial", icon: Lightbulb },
    { text: "Cancel anytime", icon: Globe },
    { text: "24/7 support", icon: Users },
    { text: "Regular updates", icon: Zap },
    { text: "Secure & reliable", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative bg-gradient-to-b from-blue-50 to-white overflow-hidden min-h-screen flex items-center"
      >
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-500 rounded-full"
              initial={{
                x: particle.x,
                y: particle.y,
                scale: 0,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10"
        >
          <div className="text-center ">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4"
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium shadow-lg">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Content Creation
              </span>
            </motion.div>
            <motion.h1
              className="text-6xl md:text-7xl font-bold text-gray-900 mb-6"
              variants={fadeIn}
            >
              Create Amazing Content with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                MarketMind
              </span>
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
              variants={fadeIn}
            >
              MarketMind helps you generate, optimize, and manage content at
              scale. Powered by advanced AI technology.
            </motion.p>
            <motion.div className="flex gap-4 justify-center" variants={fadeIn}>
              <Button
                onClick={() => router.push("/dashboard")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Learn More
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="bg-white py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { value: "10K+", label: "Active Users" },
              { value: "1M+", label: "Content Generated" },
              { value: "98%", label: "Customer Satisfaction" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={scaleIn}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-white to-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="bg-gray-50 py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeIn} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features for Content Creation
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to create, manage, and optimize your content
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={scaleIn}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
                  <div
                    className={`p-3 rounded-lg bg-gradient-to-r ${feature.gradient} w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="bg-white py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeIn} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Loved by Content Creators
            </h2>
            <p className="text-xl text-gray-600">
              See what our users have to say about MarketMind
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.author}
                variants={scaleIn}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="p-6 bg-gradient-to-br from-white to-blue-50 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">{testimonial.quote}</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-gray-600">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Benefits Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="bg-gray-50 py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {benefits.map((benefit) => (
              <motion.div
                key={benefit.text}
                variants={fadeIn}
                className="flex items-center gap-2 text-gray-600 p-4 rounded-lg hover:bg-white hover:shadow-md transition-all duration-300"
              >
                <benefit.icon className="h-5 w-5 text-blue-500" />
                <span>{benefit.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="bg-gradient-to-r from-blue-600 to-purple-600 py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Content Creation?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of content creators using MarketMind
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Creating Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
