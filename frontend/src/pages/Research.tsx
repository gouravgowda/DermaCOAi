import { useState } from 'react'
import { Search, Filter, BookOpen, Share2, ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'

interface Article {
  id: number
  title: string
  category: string
  author: string
  date: string
  readTime: string
  image: string
  summary: string
}

export function Research() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'clinical' | 'academic'>('all')

  const articles: Article[] = [
    {
      id: 1,
      title: 'Advanced Wound Care Solutions for Chronic Ulcers',
      category: 'Clinical',
      author: 'Dr. Sarah Chen',
      date: 'Mar 15, 2024',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80',
      summary: 'New protocols using alginate dressings show 40% faster healing in diabetic foot ulcers.'
    },
    {
      id: 2,
      title: 'AI in Dermatology: The Future of Diagnostics',
      category: 'Academic',
      author: 'Prof. James Wilson',
      date: 'Mar 12, 2024',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80',
      summary: 'A comprehensive review of convolutional neural networks in detecting melanoma patterns.'
    },
    {
      id: 3,
      title: 'Pediatric Wound Management Guidelines',
      category: 'Clinical',
      author: 'Dr. Emily R.',
      date: 'Mar 10, 2024',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&q=80',
      summary: 'Updated guidelines for managing acute burns in pediatric patients under 5 years.'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Research & Clinical Hub</h1>
          <p className="text-slate-600 max-w-2xl text-lg">
            Access the latest medical research, clinical guidelines, and AI-driven insights for dermatological care.
          </p>
          
          <div className="mt-8 flex gap-4 max-w-xl">
             <div className="relative flex-1">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search articles, guidelines..." 
                 className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
               />
             </div>
             <button className="px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium">
               <Filter className="w-5 h-5" />
               Filters
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {['all', 'clinical', 'academic', 'guidelines', 'case-studies'].map((cat) => (
             <button
               key={cat}
               onClick={() => setActiveCategory(cat as any)}
               className={`px-4 py-2 rounded-full text-sm font-semibold capitalize whitespace-nowrap transition-all ${
                 activeCategory === cat 
                   ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                   : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
               }`}
             >
               {cat.replace('-', ' ')}
             </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div key={article.id} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
               <div className="relative h-48 overflow-hidden">
                 <img 
                   src={article.image} 
                   alt={article.title} 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                 />
                 <div className="absolute top-4 left-4">
                   <Badge variant="info" className="bg-white/90 backdrop-blur text-blue-700">{article.category}</Badge>
                 </div>
               </div>
               
               <div className="p-6 flex-1 flex flex-col">
                 <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                   <span>{article.date}</span>
                   <span>•</span>
                   <span>{article.readTime}</span>
                 </div>
                 
                 <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                   {article.title}
                 </h3>
                 <p className="text-slate-500 text-sm mb-6 flex-1 text-ellipsis overflow-hidden">
                   {article.summary}
                 </p>
                 
                 <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-sm font-medium text-slate-700">{article.author}</span>
                    <div className="flex gap-2">
                       <button className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors">
                         <Share2 className="w-4 h-4" />
                       </button>
                       <button className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors">
                         <BookOpen className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
               </div>
            </div>
          ))}
          
          {/* Ad / Promo Card */}
          <div className="bg-blue-600 rounded-2xl p-8 text-white flex flex-col justify-center items-start shadow-xl shadow-blue-600/20">
             <h3 className="text-2xl font-bold mb-4">Join our Clinical Trial Network</h3>
             <p className="text-blue-100 mb-8">Contribute to the world's largest dataset of wound imagery and help advance AI diagnostics.</p>
             <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center gap-2">
               Learn More <ArrowUpRight className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>
    </div>
  )
}
