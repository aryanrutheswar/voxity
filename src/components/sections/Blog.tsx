'use client';

import React, { useState } from 'react';
import { BLOG_POSTS } from '@/data/mockData';
import { BlogPost } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, ArrowUpRight, BookOpen, X, Share2 } from 'lucide-react';

export function Blog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);
  const [postsList, setPostsList] = useState<BlogPost[]>(BLOG_POSTS);

  React.useEffect(() => {
    fetch('/api/cms')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data && data.success && data.data?.blogPosts) {
          setPostsList(data.data.blogPosts);
        }
      })
      .catch((err) => console.error('Failed to fetch CMS blog posts', err));
  }, []);

  const categories = ['All', 'SEO', 'Paid Ads', 'AI Marketing'];

  const filteredPosts = postsList.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="blog" className="py-24 sm:py-32 relative overflow-hidden bg-white dark:bg-[#0B0F19] text-black dark:text-white border-t-2 border-black dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-black dark:text-[#FFE600] mb-3 block">
            Knowledge & Strategy Hub
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-black dark:text-white tracking-tight">
            Latest Marketing & AI Frameworks
          </h2>
          <p className="mt-4 text-base sm:text-lg text-black dark:text-slate-200 font-extrabold leading-relaxed">
            Actionable playbooks, algorithm breakdowns, and revenue growth frameworks.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-14 max-w-4xl mx-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
            <input
              type="text"
              placeholder="Search guides & frameworks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-md bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-black dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-black dark:focus:border-[#FFE600] font-bold"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-center sm:justify-end">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-md text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#FFE600] text-black border-2 border-black dark:border-slate-950 shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#FFFFFF]'
                    : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-black dark:text-slate-200 hover:border-black dark:hover:border-[#FFE600]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden group cursor-pointer flex flex-col justify-between border-2 border-black dark:border-slate-700 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#FFE600] hover:shadow-[8px_8px_0px_#000000] dark:hover:shadow-[8px_8px_0px_#FFE600] transition-all"
              onClick={() => setActiveArticle(post)}
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-black border-b-2 border-black dark:border-slate-700">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#FFE600] text-black text-[10px] font-black uppercase tracking-wider border border-black shadow-xs">
                    {post.category}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-[11px] font-extrabold text-black dark:text-[#FFE600] uppercase mb-3">
                    <Clock className="w-3.5 h-3.5 text-black dark:text-[#FFE600]" />
                    <span>{post.readTime}</span>
                    <span>•</span>
                    <span>{post.publishedAt}</span>
                  </div>

                  <h3 className="font-heading text-lg font-black text-black dark:text-white group-hover:text-slate-800 dark:group-hover:text-[#FFE600] transition-colors line-clamp-2 mb-3">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 mt-4">
                <div className="flex items-center gap-2">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-6 h-6 rounded-full object-cover border border-black dark:border-slate-700"
                  />
                  <span className="text-xs font-extrabold text-black dark:text-slate-200">{post.author.name}</span>
                </div>

                <span className="text-xs font-black text-black dark:text-[#FFE600] uppercase flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Read <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Full Article Modal */}
        <AnimatePresence>
          {activeArticle && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-900 max-w-3xl w-full max-h-[85vh] rounded-xl p-6 sm:p-10 relative overflow-y-auto border-2 border-black dark:border-slate-700 text-left shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#FFE600]"
              >
                <button
                  onClick={() => setActiveArticle(null)}
                  className="absolute top-5 right-5 p-2 rounded-md bg-black text-[#FFE600] dark:bg-[#FFE600] dark:text-black hover:bg-slate-900 border border-black cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <span className="px-3 py-1 rounded-md bg-[#FFE600] border border-black text-black text-xs font-black uppercase tracking-wider mb-4 inline-block">
                  {activeArticle.category}
                </span>

                <h2 className="font-heading text-2xl sm:text-4xl font-black text-black dark:text-white mb-4">
                  {activeArticle.title}
                </h2>

                <div className="flex items-center gap-4 text-xs font-extrabold text-black dark:text-slate-300 mb-6 pb-6 border-b-2 border-black dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <img src={activeArticle.author.avatar} alt={activeArticle.author.name} className="w-8 h-8 rounded-full object-cover border border-black dark:border-slate-700" />
                    <div>
                      <span className="font-black text-black dark:text-white block">{activeArticle.author.name}</span>
                      <span className="text-[10px] text-slate-700 dark:text-slate-400">{activeArticle.author.role}</span>
                    </div>
                  </div>
                  <span>•</span>
                  <span>{activeArticle.publishedAt}</span>
                  <span>•</span>
                  <span>{activeArticle.readTime}</span>
                </div>

                <div className="text-black dark:text-slate-200 text-sm leading-relaxed space-y-4 font-medium">
                  <p className="font-extrabold text-black dark:text-white text-base leading-relaxed">
                    {activeArticle.excerpt}
                  </p>
                  <p>{activeArticle.content}</p>
                </div>

                <div className="mt-8 pt-6 border-t-2 border-black dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    {activeArticle.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-md bg-[#FFE600]/20 dark:bg-[#FFE600]/10 border border-black dark:border-[#FFE600] text-black dark:text-white text-[11px] font-black uppercase">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveArticle(null)}
                    className="w-full sm:w-auto btn-gradient px-6 py-2.5 rounded-md text-xs font-black uppercase tracking-wider"
                  >
                    Close Article
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
