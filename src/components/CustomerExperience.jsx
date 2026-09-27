import React, { useState, useMemo } from 'react';
import { Star, CheckCircle, Plus, Camera, Video, Play, Sparkles, MapPin, Calendar, Smartphone, Film } from 'lucide-react';

const isStoryVideo = (story) => {
  if (!story) return false;
  if (story.mediaType === 'video' || story.videoUrl) return true;
  const src = story.image || '';
  if (typeof src !== 'string') return false;
  return (
    src.startsWith('data:video/') ||
    src.endsWith('.mp4') ||
    src.endsWith('.webm') ||
    src.endsWith('.mov') ||
    src.endsWith('.m4v') ||
    src.includes('blob:') ||
    src.toLowerCase().includes('.mp4') ||
    src.toLowerCase().includes('video')
  );
};

export default function CustomerExperience({ stories, onOpenAddModal, onSelectStory }) {
  const [filter, setFilter] = useState('all');

  const filteredStories = useMemo(() => {
    if (filter === 'all') return stories;
    if (filter === 'apple') return stories.filter((s) => s.brand === 'apple');
    if (filter === 'android') return stories.filter((s) => s.brand !== 'apple' && s.brand !== 'all');
    return stories;
  }, [stories, filter]);

  return (
    <section id="customer-experience-section" className="mx-auto max-w-[1440px] px-container-padding-mobile py-16 md:px-container-padding-desktop scroll-mt-20">
      {/* Section Header */}
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <Sparkles size={16} className="text-amber-400" />
            <span>Customer Diaries & Deliveries</span>
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] text-emerald-400 border border-emerald-500/30">
              100% Genuine Buyers
            </span>
          </div>
          <h2 className="mt-1 font-headline-lg text-2xl font-bold tracking-tight text-white md:text-3xl">
            Happy Customers & Handover Moments
          </h2>
          <p className="mt-1 text-sm text-on-surface-variant max-w-2xl">
            Real customers unboxing their new iPhones, Vivo, and iQOO smartphones directly at the Gagan Mobile Care retail counter.
          </p>
        </div>

        {/* Action Button for Store Owner */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(236,72,153,0.35)] transition-all hover:scale-105 hover:opacity-95"
          >
            <Film size={15} />
            + Add Customer Photo / Video
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/20 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: `All Deliveries (${stories.length})` },
            { id: 'apple', label: 'iPhone Handover' },
            { id: 'android', label: 'Vivo / iQOO / Android' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                filter === tab.id
                  ? 'bg-primary text-on-primary shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                  : 'bg-surface-container text-on-surface-variant hover:text-white hover:bg-surface-container-high'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
          <span className="flex text-amber-400">★★★★★</span>
          <span className="font-semibold text-white">4.9/5</span>
          <span>from 1,500+ store deliveries</span>
        </div>
      </div>

      {/* Customer Moments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {filteredStories.map((story) => {
          const isVideo = isStoryVideo(story);
          return (
            <div
              key={story.id}
              onClick={() => onSelectStory && onSelectStory(story)}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container transition-all duration-300 hover:border-pink-500/60 hover:shadow-[0_12px_35px_rgba(0,0,0,0.7)] cursor-pointer"
            >
              {/* Top Media Container */}
              <div className="relative h-80 w-full overflow-hidden bg-black">
                {isVideo ? (
                  <video
                    src={story.image || story.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <img
                    src={story.image}
                    alt={story.phoneBought}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                )}

                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-black/40 pointer-events-none" />

                {/* Video Play / Reel Indicator */}
                {isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-pink-500/40 text-pink-400 shadow-2xl">
                      <Play size={20} className="fill-pink-400 ml-0.5" />
                    </span>
                  </div>
                )}

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="rounded-full bg-black/70 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white border border-white/20 flex items-center gap-1 shadow-lg">
                    <Smartphone size={12} className="text-primary" />
                    {story.phoneBought.split('(')[0].trim()}
                  </span>

                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold flex items-center gap-1 shadow-md text-white ${
                    isVideo ? 'bg-gradient-to-r from-pink-500 to-rose-600' : 'bg-emerald-500/90'
                  }`}>
                    {isVideo ? (
                      <>
                        <Video size={10} /> Video Reel
                      </>
                    ) : (
                      <>
                        <CheckCircle size={11} /> Verified
                      </>
                    )}
                  </span>
                </div>

                {/* Star Rating Overlay */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-md bg-black/60 px-2 py-0.5 text-xs text-amber-400 backdrop-blur-sm">
                  {'★'.repeat(story.rating || 5)}
                </div>
              </div>

              {/* Story Details Card */}
              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-pink-400 transition-colors line-clamp-1">
                    {story.customerName}
                  </h4>

                  <p className="mt-1.5 text-xs text-on-surface-variant leading-relaxed line-clamp-3 italic">
                    "{story.feedback}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} className="text-primary/70" />
                    {story.date}
                  </span>

                  <span className="flex items-center gap-1 truncate max-w-[130px]" title={story.storeLocation}>
                    <MapPin size={12} className="text-primary/70" />
                    {(story.storeLocation || 'Maur Mandi').replace('GMC ', '')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
