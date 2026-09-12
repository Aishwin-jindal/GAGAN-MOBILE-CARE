import React, { useState } from 'react';
import { X, Upload, Camera, Star, CheckCircle, Image as ImageIcon } from 'lucide-react';

export default function AddCustomerStoryModal({ isOpen, onClose, onAddStory }) {
  const [customerName, setCustomerName] = useState('');
  const [phoneBought, setPhoneBought] = useState('');
  const [brand, setBrand] = useState('apple');
  const [feedback, setFeedback] = useState('');
  const [storeLocation, setStoreLocation] = useState('GMC Retail Hub, Delhi');
  const [imagePreview, setImagePreview] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [rating, setRating] = useState(5);

  if (!isOpen) return null;

  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalImage = imagePreview || imageUrl || '/customers/customer_iphone16.png';

    const newStory = {
      id: `story-${Date.now()}`,
      customerName: customerName.trim() || 'Happy Customer',
      phoneBought: phoneBought.trim() || 'Flagship Smartphone',
      brand: brand,
      image: finalImage,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      rating: Number(rating),
      tag: 'New Delivery',
      feedback: feedback.trim() || 'Had a great smartphone buying experience at Gagan Mobile Care!',
      storeLocation: storeLocation.trim() || 'GMC Store Counter #1',
      verified: true
    };

    onAddStory(newStory);
    onClose();
    // Reset form
    setCustomerName('');
    setPhoneBought('');
    setFeedback('');
    setImagePreview('');
    setImageUrl('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div
        className="relative flex max-h-[92vh] w-full max-w-lg flex-col rounded-2xl border border-outline-variant/40 bg-surface-container shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/30 bg-surface-container-high px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary border border-primary/30">
              <Camera size={18} />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Add Customer Experience Photo</h3>
              <p className="text-xs text-on-surface-variant">Post a photo with your customer and their new phone</p>
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
          {/* Photo Upload / Preview */}
          <div>
            <label className="block text-xs font-bold text-white mb-2">Customer & Phone Photo</label>
            {imagePreview ? (
              <div className="relative h-48 w-full rounded-xl overflow-hidden border border-primary/40 bg-black flex items-center justify-center group">
                <img src={imagePreview} alt="Customer preview" className="h-full w-full object-contain" />
                <button
                  type="button"
                  onClick={() => setImagePreview('')}
                  className="absolute top-2 right-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-red-600 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-outline-variant/50 rounded-xl cursor-pointer bg-surface-container-low hover:border-primary/60 transition-colors p-4 text-center">
                  <Upload size={24} className="text-primary mb-2" />
                  <span className="text-xs font-semibold text-white">Click to upload photo from your device</span>
                  <span className="text-[10px] text-on-surface-variant mt-1">Supports JPG, PNG, WEBP from mobile or computer</span>
                  <input type="file" accept="image/*" onChange={handleImageFile} className="hidden" />
                </label>

                <div className="text-center text-[11px] text-on-surface-variant">or paste an image link:</div>
                <input
                  type="url"
                  placeholder="https://example.com/customer-photo.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="form-input text-xs"
                />
              </div>
            )}
          </div>

          {/* Customer Name */}
          <div>
            <label className="block text-xs font-semibold text-white mb-1">Customer Name / Buyer</label>
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
              <label className="block text-xs font-semibold text-white mb-1">Brand</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="form-select text-xs"
              >
                <option value="apple">Apple</option>
                <option value="samsung">Samsung</option>
                <option value="vivo">Vivo</option>
                <option value="iqoo">iQOO</option>
                <option value="oneplus">OnePlus</option>
                <option value="google">Google</option>
                <option value="xiaomi">Xiaomi</option>
                <option value="all">Other / Multiple</option>
              </select>
            </div>
          </div>

          {/* Customer Feedback / Quote */}
          <div>
            <label className="block text-xs font-semibold text-white mb-1">Customer Feedback / Words</label>
            <textarea
              rows={3}
              placeholder="What did the customer say about GMC's price, service, or delivery?"
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
              <label className="block text-xs font-semibold text-white mb-1">Store Counter / Location</label>
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
              className="btn-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2"
            >
              <CheckCircle size={15} /> Publish Customer Moment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
