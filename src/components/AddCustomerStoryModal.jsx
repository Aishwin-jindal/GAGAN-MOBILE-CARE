import React, { useState } from 'react';
import { X, Upload, Camera, Video, Star, CheckCircle, Image as ImageIcon, Play, Film, Link as LinkIcon } from 'lucide-react';

export const isVideoMedia = (url) => {
  if (!url || typeof url !== 'string') return false;
  return (
    url.startsWith('data:video/') ||
    url.endsWith('.mp4') ||
    url.endsWith('.webm') ||
    url.endsWith('.mov') ||
    url.endsWith('.m4v') ||
    url.includes('blob:') ||
    url.toLowerCase().includes('.mp4') ||
    url.toLowerCase().includes('video')
  );
};

export default function AddCustomerStoryModal({ isOpen, onClose, onAddStory }) {
  const [mediaTab, setMediaTab] = useState('upload'); // 'upload' | 'url'
  const [mediaType, setMediaType] = useState('image'); // 'image' | 'video'
  const [customerName, setCustomerName] = useState('');
  const [phoneBought, setPhoneBought] = useState('');
  const [brand, setBrand] = useState('apple');
  const [feedback, setFeedback] = useState('');
  const [storeLocation, setStoreLocation] = useState('GMC Main Showroom, Maur Mandi');
  const [mediaPreview, setMediaPreview] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [rating, setRating] = useState(5);

  if (!isOpen) return null;

  const handleMediaFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      setMediaType(isVideo ? 'video' : 'image');
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const isCurrentMediaVideo =
    mediaType === 'video' ||
    (mediaTab === 'url' && isVideoMedia(mediaUrl)) ||
    (mediaTab === 'upload' && isVideoMedia(mediaPreview));

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalMedia =
      mediaPreview ||
      mediaUrl ||
      (mediaType === 'video'
        ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
        : '/customers/customer_iphone16.png');

    const determinedType = isCurrentMediaVideo || isVideoMedia(finalMedia) ? 'video' : 'image';

    const newStory = {
      id: `story-${Date.now()}`,
      customerName: customerName.trim() || 'Happy Customer',
      phoneBought: phoneBought.trim() || 'Flagship Smartphone',
      brand: brand,
      mediaType: determinedType,
      image: finalMedia,
      videoUrl: determinedType === 'video' ? finalMedia : null,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      rating: Number(rating),
      tag: determinedType === 'video' ? 'Video Handover' : 'New Delivery',
      feedback:
        feedback.trim() ||
        (determinedType === 'video'
          ? 'Live unboxing & customer handover moment at Gagan Mobile Care!'
          : 'Had a great smartphone buying experience at Gagan Mobile Care!'),
      storeLocation: storeLocation.trim() || 'GMC Store Counter #1',
      verified: true
    };

    onAddStory(newStory);
    onClose();
    // Reset form
    setCustomerName('');
    setPhoneBought('');
    setFeedback('');
    setMediaPreview('');
    setMediaUrl('');
    setMediaType('image');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-lg flex-col rounded-2xl border border-outline-variant/40 bg-surface-container shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/30 bg-surface-container-high px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500/20 to-purple-500/20 text-pink-400 border border-pink-500/30">
              <Film size={18} />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Add Customer Diary / Video Reel</h3>
              <p className="text-xs text-on-surface-variant">Post a photo or video handover moment on the store</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Media Type Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Camera size={14} className="text-pink-400" />
                Upload Photo or Video Reel
              </label>

              {/* Mode Toggle */}
              <div className="flex rounded-lg bg-surface-container-high p-0.5 border border-white/10">
                <button
                  type="button"
                  onClick={() => setMediaTab('upload')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                    mediaTab === 'upload' ? 'bg-primary text-black shadow' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Upload size={12} /> Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setMediaTab('url')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                    mediaTab === 'url' ? 'bg-primary text-black shadow' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <LinkIcon size={12} /> Link URL
                </button>
              </div>
            </div>

            {/* Preview Box */}
            {mediaPreview || (mediaTab === 'url' && mediaUrl) ? (
              <div className="relative h-52 w-full rounded-xl overflow-hidden border border-pink-500/40 bg-black flex items-center justify-center group">
                {isCurrentMediaVideo ? (
                  <video
                    src={mediaPreview || mediaUrl}
                    controls
                    autoPlay
                    muted
                    playsInline
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <img
                    src={mediaPreview || mediaUrl}
                    alt="Customer preview"
                    className="h-full w-full object-contain"
                  />
                )}

                <div className="absolute top-2 left-2 rounded-full bg-black/80 px-2.5 py-1 text-[10px] font-bold text-amber-300 border border-white/20 backdrop-blur-md flex items-center gap-1">
                  {isCurrentMediaVideo ? (
                    <>
                      <Video size={11} className="text-pink-400" /> Video Reel
                    </>
                  ) : (
                    <>
                      <ImageIcon size={11} className="text-cyan-400" /> Photo
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMediaPreview('');
                    setMediaUrl('');
                  }}
                  className="absolute top-2 right-2 rounded-full bg-black/80 p-1.5 text-white hover:bg-red-600 transition-colors shadow-lg"
                  title="Remove media"
                >
                  <X size={14} />
                </button>
              </div>
            ) : mediaTab === 'upload' ? (
              <div className="flex flex-col gap-2">
                <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-pink-500/40 hover:border-pink-400 rounded-xl cursor-pointer bg-gradient-to-b from-pink-500/5 to-surface-container-low transition-all p-4 text-center group">
                  <div className="flex items-center gap-2 mb-2 text-pink-400 group-hover:scale-110 transition-transform">
                    <Camera size={22} />
                    <span className="text-gray-400">/</span>
                    <Video size={24} />
                  </div>
                  <span className="text-xs font-semibold text-white">Click to upload Photo or Video</span>
                  <span className="text-[10px] text-on-surface-variant mt-1">
                    Supports <strong>MP4, WebM, MOV videos</strong> & <strong>JPG, PNG, WEBP photos</strong>
                  </span>
                  <span className="mt-2 text-[10px] text-pink-400 font-medium px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/20">
                    Auto-detects Videos & Photos
                  </span>
                  <input
                    type="file"
                    accept="image/*,video/mp4,video/webm,video/quicktime,video/*"
                    onChange={handleMediaFile}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="space-y-2 p-3 bg-surface-container-low rounded-xl border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <button
                    type="button"
                    onClick={() => setMediaType('image')}
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      mediaType === 'image' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-gray-400'
                    }`}
                  >
                    Photo URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaType('video')}
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      mediaType === 'video' ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40' : 'text-gray-400'
                    }`}
                  >
                    Video (.mp4) URL
                  </button>
                </div>
                <input
                  type="url"
                  placeholder={
                    mediaType === 'video'
                      ? 'https://example.com/customer-unboxing-video.mp4'
                      : 'https://example.com/customer-photo.jpg'
                  }
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  className="form-input text-xs w-full"
                />
              </div>
            )}
          </div>

          {/* Customer Name */}
          <div>
            <label className="block text-xs font-semibold text-white mb-1">Customer / Buyer Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Rahul Mehta & Friends"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="form-input text-xs"
            />
          </div>

          {/* Phone Bought & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-white mb-1">Phone / Model Purchased</label>
              <input
                type="text"
                required
                placeholder="e.g. iPhone 16 128GB"
                value={phoneBought}
                onChange={(e) => setPhoneBought(e.target.value)}
                className="form-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1">Brand Category</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="form-select text-xs"
              >
                <option value="apple">Apple iPhone</option>
                <option value="samsung">Samsung Galaxy</option>
                <option value="vivo">Vivo</option>
                <option value="iqoo">iQOO</option>
                <option value="oneplus">OnePlus</option>
                <option value="google">Google Pixel</option>
                <option value="xiaomi">Xiaomi / Redmi</option>
                <option value="all">Other Brand</option>
              </select>
            </div>
          </div>

          {/* Customer Feedback / Quote */}
          <div>
            <label className="block text-xs font-semibold text-white mb-1">Customer Quote / Feedback</label>
            <textarea
              rows={3}
              placeholder="What did the customer say about GMC's price, unboxing experience, or delivery?"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="form-input text-xs resize-none"
            />
          </div>

          {/* Rating & Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-white mb-1">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="form-select text-xs"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1">Store Location / Counter</label>
              <input
                type="text"
                placeholder="e.g. GMC Hub, Counter #1"
                value={storeLocation}
                onChange={(e) => setStoreLocation(e.target.value)}
                className="form-input text-xs"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/25 hover:from-pink-600 hover:to-rose-700 active:scale-[0.98] transition-all"
            >
              <CheckCircle size={15} /> Publish Customer Diary Moment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

