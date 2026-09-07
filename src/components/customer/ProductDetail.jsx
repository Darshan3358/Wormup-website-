import React, { useState, useEffect } from 'react';
import { useRouter } from '../../navigation/RouterContext';
import { useProducts } from '../../context/ProductContext';
import { useLocation } from '../../context/LocationContext';
import { useCart } from '../../context/CartContext';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icons';
import { getVariantPricing } from '../../data/mockData';
import { ProductCard } from './ProductCard';

// Nutritional profiles mapping for fresh produce
const NUTRITION_MAP = {
  P101: { calories: '77 kcal', carbs: '17.5 g', protein: '2.0 g', fat: '0.1 g', fiber: '2.2 g', vitC: '19.7 mg' }, // Potato
  P102: { calories: '18 kcal', carbs: '3.9 g', protein: '0.9 g', fat: '0.2 g', fiber: '1.2 g', vitC: '13.7 mg' }, // Tomato
  P103: { calories: '40 kcal', carbs: '9.3 g', protein: '1.1 g', fat: '0.1 g', fiber: '1.7 g', vitC: '7.4 mg' },  // Onion
  P104: { calories: '23 kcal', carbs: '3.6 g', protein: '2.9 g', fat: '0.4 g', fiber: '2.2 g', vitC: '28.1 mg' }, // Spinach
  P105: { calories: '23 kcal', carbs: '3.7 g', protein: '2.1 g', fat: '0.5 g', fiber: '2.8 g', vitC: '27.0 mg' }, // Coriander
  P106: { calories: '40 kcal', carbs: '8.8 g', protein: '1.9 g', fat: '0.4 g', fiber: '1.5 g', vitC: '143.7 mg' },// Green Chilli
  P107: { calories: '41 kcal', carbs: '9.6 g', protein: '0.9 g', fat: '0.2 g', fiber: '2.8 g', vitC: '5.9 mg' },  // Carrot
  P108: { calories: '25 kcal', carbs: '5.0 g', protein: '1.9 g', fat: '0.3 g', fiber: '2.0 g', vitC: '48.2 mg' }, // Cauliflower
  P109: { calories: '20 kcal', carbs: '4.6 g', protein: '0.9 g', fat: '0.2 g', fiber: '1.7 g', vitC: '80.4 mg' }, // Capsicum
  P110: { calories: '80 kcal', carbs: '17.8 g', protein: '1.8 g', fat: '0.8 g', fiber: '2.0 g', vitC: '5.0 mg' }  // Ginger
};

export const ProductDetail = () => {
  const { currentPath, navigate } = useRouter();
  const { products, getProductAreaPrice, categories } = useProducts();
  const { selectedArea, setIsLocationModalOpen } = useLocation();
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const { showToast } = useApp();

  // Extract productId from /product/:id or /product/:slug
  const pathPart = currentPath.replace('/product/', '').split('/')[0].split('?')[0];
  const product = products.find(p => p.id === pathPart || p.slug === pathPart) || products[0];

  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] || product?.unit || '1 kg');
  const [activeTab, setActiveTab] = useState('description'); // 'description' | 'nutrition' | 'storage' | 'quality'

  // Update selected variant when product changes
  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants?.[0] || product.unit || '1 kg');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <span style={{ fontSize: '56px' }}>🥬</span>
        <h2 style={{ fontSize: '22px', fontWeight: 800, marginTop: '14px', color: 'var(--text-primary)' }}>
          Produce Item Not Found
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '8px 0 24px 0' }}>
          This vegetable or fruit batch may have sold out or is currently unavailable.
        </p>
        <button onClick={() => navigate('/')} className="btn-primary" style={{ padding: '12px 24px' }}>
          ← Back to Fresh Market
        </button>
      </div>
    );
  }

  // Calculate live dark store pricing & variant adjustment
  const basePricing = getProductAreaPrice(product.id, selectedArea.id);
  const pricing = getVariantPricing(basePricing.price, basePricing.mrp, product.unit, selectedVariant);
  const qty = getItemQuantity(product.id, selectedVariant);

  const isOutOfStock = !basePricing.available || basePricing.stock <= 0;
  const isLowStock = basePricing.stock > 0 && basePricing.stock <= 10;
  const savings = Math.max(0, pricing.mrp - pricing.price);
  const nutrition = NUTRITION_MAP[product.id] || { calories: '35 kcal', carbs: '7.2 g', protein: '1.4 g', fat: '0.2 g', fiber: '2.1 g', vitC: '18.5 mg' };

  // Matching related items in same category
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const categoryMeta = categories.find(c => c.id === product.category) || { name: 'Fresh Vegetables', icon: '🥦' };

  const handleShare = () => {
    const fullUrl = `${window.location.origin}/product/${product.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      showToast('Product link copied to clipboard! 📋', 'success');
    } else {
      showToast(`Link: ${fullUrl}`, 'info');
    }
  };

  return (
    <div className="pdp-container animate-fade-up" style={{ maxWidth: '1180px', margin: '0 auto', padding: '16px 16px 80px 16px' }}>
      
      {/* Top Breadcrumb & Back Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '13px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #ECEAF2',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#12101B',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}
          >
            ← Back
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6B6878', fontSize: '12px' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span>
            <span>/</span>
            <span style={{ color: '#12101B', fontWeight: 600 }}>{categoryMeta.name}</span>
            <span>/</span>
            <span style={{ color: 'var(--womup-violet)', fontWeight: 700 }}>{product.name}</span>
          </div>
        </div>

        {/* Share & Location Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setIsLocationModalOpen(true)}
            style={{
              background: 'rgba(31, 175, 110, 0.1)',
              border: '1px solid rgba(31, 175, 110, 0.3)',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#047857',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Change Delivery Dark Store"
          >
            <Icon name="clock" size={13} color="#10B981" />
            <span>{selectedArea.eta} to {selectedArea.name}</span>
          </button>

          <button
            onClick={handleShare}
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #ECEAF2',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#12101B',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Share this product"
          >
            <span>🔗</span> Share
          </button>
        </div>
      </div>

      {/* Main 2-Column Product Grid */}
      <div className="pdp-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '32px',
        marginBottom: '40px'
      }}>
        
        {/* Left Column: Visual Showcase & Quality Guarantees */}
        <div>
          {/* Main Hero Product Image Showcase */}
          <div style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            background: '#FFFFFF',
            border: '1.5px solid #ECEAF2',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
            marginBottom: '20px'
          }}>
            <img 
              src={product.image} 
              alt={product.name}
              style={{
                width: '100%',
                height: 'clamp(280px, 45vw, 420px)',
                objectFit: 'cover',
                display: 'block'
              }}
            />

            {/* Freshness Badge */}
            <div style={{ position: 'absolute', top: '14px', left: '14px' }}>
              <span className="badge-fresh" style={{
                fontSize: '12px',
                padding: '6px 14px',
                background: 'rgba(31, 175, 110, 0.92)',
                color: '#FFFFFF',
                fontWeight: 800,
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(31, 175, 110, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>🌱</span> {product.freshness}
              </span>
            </div>

            {/* Discount Badge */}
            {pricing.discount > 0 && (
              <div style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                background: 'var(--gradient-brand)',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 800,
                padding: '5px 12px',
                borderRadius: '8px',
                boxShadow: '0 4px 14px rgba(232, 67, 147, 0.45)'
              }}>
                {pricing.discount}% OFF
              </div>
            )}

            {/* Farm Direct Source Tag */}
            <div style={{
              position: 'absolute',
              bottom: '14px',
              left: '14px',
              background: 'rgba(18, 16, 27, 0.88)',
              backdropFilter: 'blur(8px)',
              padding: '6px 14px',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <span>🚜</span> Direct Sourced Farm Produce
            </div>
          </div>

          {/* Quick-Commerce Trust Highlights (4-Pillar Guarantee) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            background: '#FFFFFF',
            padding: '16px',
            borderRadius: '16px',
            border: '1px solid #ECEAF2'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '22px' }}>⚡</span>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#12101B' }}>10 Mins Cold Transit</div>
                <div style={{ fontSize: '10px', color: '#6B6878' }}>From nearest local dark store</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '22px' }}>🔒</span>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#12101B' }}>Tamper-Proof Seal</div>
                <div style={{ fontSize: '10px', color: '#6B6878' }}>±5% digital scale check</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '22px' }}>🥦</span>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#12101B' }}>Grade-A Handpicked</div>
                <div style={{ fontSize: '10px', color: '#6B6878' }}>3-level sorting at station</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '22px' }}>🔄</span>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#12101B' }}>Doorstep Return</div>
                <div style={{ fontSize: '10px', color: '#6B6878' }}>Instant refund if unsatisfied</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Pack Sizes, Buy Controller & Details */}
        <div>
          {/* Category & Tags Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span style={{
              background: 'rgba(142, 92, 247, 0.1)',
              color: 'var(--womup-violet)',
              fontSize: '11px',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '6px'
            }}>
              {categoryMeta.icon} {categoryMeta.name}
            </span>
            {product.tags && product.tags.map((tag, idx) => (
              <span key={idx} style={{
                background: '#F0EEF6',
                color: '#6B6878',
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '6px'
              }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Product Headline */}
          <h1 style={{
            fontSize: 'clamp(22px, 4vw, 30px)',
            fontWeight: 900,
            color: '#12101B',
            lineHeight: 1.25,
            marginBottom: '8px',
            letterSpacing: '-0.5px'
          }}>
            {product.name}
          </h1>

          <p style={{ fontSize: '13px', color: '#6B6878', lineHeight: 1.5, marginBottom: '18px' }}>
            {product.description}
          </p>

          {/* Dark Store & Inventory Status Card */}
          <div style={{
            background: '#FAF9FC',
            border: '1px solid #ECEAF2',
            borderRadius: '12px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isOutOfStock ? '#EF4444' : '#1FAF6E' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#12101B' }}>
                Fulfillment Hub: <strong style={{ color: 'var(--womup-violet)' }}>{selectedArea.storeName}</strong>
              </span>
            </div>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              color: isOutOfStock ? '#EF4444' : isLowStock ? '#D97706' : '#047857'
            }}>
              {isOutOfStock ? 'Out of Stock' : isLowStock ? `Only ${pricing.stock} packs left!` : 'In Stock ✓'}
            </span>
          </div>

          {/* Pack Size / Variant Selector */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#12101B', marginBottom: '10px' }}>
              Select Pack Size:
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {(product.variants || [product.unit]).map(v => {
                const isSelected = selectedVariant === v;
                const vPrice = getVariantPricing(basePricing.price, basePricing.mrp, product.unit, v);

                return (
                  <button
                    key={v}
                    onClick={() => setSelectedVariant(v)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '10px',
                      background: isSelected ? 'rgba(142, 92, 247, 0.08)' : '#FFFFFF',
                      border: `2px solid ${isSelected ? 'var(--womup-violet)' : '#ECEAF2'}`,
                      color: isSelected ? 'var(--womup-violet)' : '#12101B',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 4px 12px rgba(142, 92, 247, 0.15)' : 'none'
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 800 }}>{v}</div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: isSelected ? 'var(--womup-violet)' : '#6B6878', marginTop: '2px' }}>
                      ₹{vPrice.price}
                      {vPrice.mrp > vPrice.price && (
                        <span style={{ fontSize: '10px', textDecoration: 'line-through', marginLeft: '4px', color: '#9CA3AF' }}>
                          ₹{vPrice.mrp}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Price & Big Add to Cart Controller Box */}
          <div style={{
            background: 'linear-gradient(135deg, #FAF9FC 0%, #FFFFFF 100%)',
            border: '1.5px solid #ECEAF2',
            borderRadius: '16px',
            padding: '20px 24px',
            marginBottom: '26px',
            boxShadow: '0 4px 18px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#6B6878', fontWeight: 600, textTransform: 'uppercase' }}>
                  Special DarkStore Price ({selectedVariant})
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '3px' }}>
                  <span style={{ fontSize: '32px', fontWeight: 900, color: '#12101B', letterSpacing: '-0.5px' }}>
                    ₹{pricing.price}
                  </span>
                  {pricing.mrp > pricing.price && (
                    <span style={{ fontSize: '16px', color: '#9CA3AF', textDecoration: 'line-through' }}>
                      MRP ₹{pricing.mrp}
                    </span>
                  )}
                  {savings > 0 && (
                    <span style={{
                      background: 'rgba(31, 175, 110, 0.15)',
                      color: '#047857',
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}>
                      Save ₹{savings}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>
                  (Inclusive of all local taxes • Weight ±5% guaranteed)
                </div>
              </div>

              {/* Quantity Add / Stepper Controller */}
              <div>
                {isOutOfStock ? (
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#EF4444', padding: '8px 16px', background: '#FEE2E2', borderRadius: '8px' }}>
                    Sold Out in Area
                  </span>
                ) : qty === 0 ? (
                  <button
                    onClick={() => {
                      addToCart(product, selectedVariant);
                      showToast(`Added 1x ${product.name} (${selectedVariant}) to cart!`, 'success');
                    }}
                    style={{
                      background: 'var(--gradient-brand)',
                      color: '#FFFFFF',
                      padding: '12px 32px',
                      borderRadius: '10px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(232, 67, 147, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'transform 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <Icon name="plus" size={16} /> ADD TO CART
                  </button>
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'var(--gradient-brand)',
                    borderRadius: '10px',
                    padding: '4px',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 16px rgba(142, 92, 247, 0.35)'
                  }}>
                    <button
                      onClick={() => updateQuantity(product.id, selectedVariant, -1)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#FFFFFF',
                        padding: '8px 14px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 900
                      }}
                      title="Decrease quantity"
                    >
                      <Icon name="minus" size={14} />
                    </button>
                    <span style={{ fontSize: '16px', fontWeight: 900, minWidth: '28px', textAlign: 'center' }}>
                      {qty}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, selectedVariant, 1)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#FFFFFF',
                        padding: '8px 14px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 900
                      }}
                      title="Increase quantity"
                    >
                      <Icon name="plus" size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Deep Information Tabs */}
          <div style={{
            background: '#FFFFFF',
            border: '1.5px solid #ECEAF2',
            borderRadius: '16px',
            overflow: 'hidden'
          }}>
            {/* Tab Navigation */}
            <div style={{
              display: 'flex',
              borderBottom: '1px solid #ECEAF2',
              background: '#FAF9FC',
              overflowX: 'auto',
              scrollbarWidth: 'none'
            }}>
              {[
                { id: 'description', label: 'Culinary Uses & Taste' },
                { id: 'nutrition', label: 'Nutritional Facts' },
                { id: 'storage', label: 'Storage & Shelf Life' },
                { id: 'quality', label: 'Quality Verification' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '12px 18px',
                    border: 'none',
                    borderBottom: `2px solid ${activeTab === tab.id ? 'var(--womup-violet)' : 'transparent'}`,
                    background: activeTab === tab.id ? '#FFFFFF' : 'transparent',
                    color: activeTab === tab.id ? 'var(--womup-violet)' : '#6B6878',
                    fontWeight: activeTab === tab.id ? 800 : 600,
                    fontSize: '12px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Body */}
            <div style={{ padding: '20px', fontSize: '13px', lineHeight: 1.6, color: '#374151' }}>
              {activeTab === 'description' && (
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#12101B', margin: '0 0 8px 0' }}>
                    Fresh Farm Description & Preparation Tips
                  </h4>
                  <p style={{ margin: '0 0 12px 0' }}>
                    Harvested fresh at daybreak, this batch of <strong>{product.name}</strong> offers superior natural crispness, farm-fresh sweetness, and vibrant color without artificial waxing or polishing.
                  </p>
                  <div style={{ background: '#FAF9FC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #ECEAF2' }}>
                    <div style={{ fontWeight: 700, color: '#12101B', marginBottom: '4px' }}>🍳 Best Culinary Pairings:</div>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#6B6878', fontSize: '12px' }}>
                      <li>Traditional Gujarati and North Indian daily curries & gravies.</li>
                      <li>Crisp garden fresh salads, juicing, and quick skillet roasts.</li>
                      <li>Steamed or blanched with fresh herbs for light wholesome dinners.</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'nutrition' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#12101B', margin: 0 }}>
                      Nutritional Value (Approx. per 100g serving)
                    </h4>
                    <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700 }}>100% Organic certified</span>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: '10px'
                  }}>
                    <div style={{ background: '#FAF9FC', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ECEAF2' }}>
                      <div style={{ fontSize: '10px', color: '#6B6878', textTransform: 'uppercase', fontWeight: 700 }}>Energy</div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#12101B', marginTop: '2px' }}>{nutrition.calories}</div>
                    </div>
                    <div style={{ background: '#FAF9FC', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ECEAF2' }}>
                      <div style={{ fontSize: '10px', color: '#6B6878', textTransform: 'uppercase', fontWeight: 700 }}>Carbohydrates</div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#12101B', marginTop: '2px' }}>{nutrition.carbs}</div>
                    </div>
                    <div style={{ background: '#FAF9FC', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ECEAF2' }}>
                      <div style={{ fontSize: '10px', color: '#6B6878', textTransform: 'uppercase', fontWeight: 700 }}>Dietary Fiber</div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#12101B', marginTop: '2px' }}>{nutrition.fiber}</div>
                    </div>
                    <div style={{ background: '#FAF9FC', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ECEAF2' }}>
                      <div style={{ fontSize: '10px', color: '#6B6878', textTransform: 'uppercase', fontWeight: 700 }}>Protein</div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#12101B', marginTop: '2px' }}>{nutrition.protein}</div>
                    </div>
                    <div style={{ background: '#FAF9FC', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ECEAF2' }}>
                      <div style={{ fontSize: '10px', color: '#6B6878', textTransform: 'uppercase', fontWeight: 700 }}>Vitamin C</div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#047857', marginTop: '2px' }}>{nutrition.vitC}</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'storage' && (
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#12101B', margin: '0 0 8px 0' }}>
                    Storage Recommendations & Shelf Life
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: '#4B5563', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <li><strong>Optimal Storage:</strong> Store in the vegetable crisper compartment of your refrigerator at 4°C to 8°C.</li>
                    <li><strong>Packaging:</strong> Keep in perforated breathable brown paper bags or reusable produce pouches.</li>
                    <li><strong>Shelf Life:</strong> Best enjoyed within 4 to 6 days from delivery for peak moisture and flavor.</li>
                    <li><strong>Washing Tip:</strong> Wash thoroughly with clean water right before preparation, rather than before storage.</li>
                  </ul>
                </div>
              )}

              {activeTab === 'quality' && (
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#12101B', margin: '0 0 8px 0' }}>
                    WOMUP 3-Stage DarkStore Quality Assurance
                  </h4>
                  <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#4B5563' }}>
                    Every batch arriving at <strong>{selectedArea.storeName}</strong> undergoes optical sorting, residue screening, and certified electronic weight verification within ±5% tolerance.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#047857', fontWeight: 700, fontSize: '12px' }}>
                    <span>🛡️</span> Zero synthetic chemical ripening • 100% Farm Batch Traceability
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div style={{ marginTop: '30px', paddingTop: '24px', borderTop: '1px solid #ECEAF2' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#12101B', margin: 0 }}>
                Customers Also Bought
              </h3>
              <p style={{ fontSize: '12px', color: '#6B6878', margin: '2px 0 0 0' }}>
                Handpicked fresh pairs in {categoryMeta.name}
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--womup-violet)',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              See all →
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Sticky Bottom Bar for Mobile (SRS Section: 100% Mobile Responsiveness) */}
      <div className="pdp-mobile-sticky-bar" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#FFFFFF',
        borderTop: '1.5px solid #ECEAF2',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 90,
        boxShadow: '0 -4px 16px rgba(0,0,0,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#12101B', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {product.name}
            </div>
            <div style={{ fontSize: '11px', color: '#6B6878' }}>
              <span style={{ fontWeight: 800, color: '#12101B' }}>₹{pricing.price}</span> ({selectedVariant})
            </div>
          </div>
        </div>

        <div>
          {isOutOfStock ? (
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#EF4444' }}>Sold Out</span>
          ) : qty === 0 ? (
            <button
              onClick={() => {
                addToCart(product, selectedVariant);
                showToast(`Added ${product.name} to cart!`, 'success');
              }}
              style={{
                background: 'var(--gradient-brand)',
                color: '#FFFFFF',
                padding: '9px 20px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 800,
                fontSize: '12px',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(232, 67, 147, 0.35)'
              }}
            >
              + ADD
            </button>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--gradient-brand)',
              borderRadius: '8px',
              padding: '2px',
              color: '#FFFFFF'
            }}>
              <button
                onClick={() => updateQuantity(product.id, selectedVariant, -1)}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', padding: '6px 10px', cursor: 'pointer' }}
              >
                <Icon name="minus" size={12} />
              </button>
              <span style={{ fontSize: '13px', fontWeight: 800, minWidth: '20px', textAlign: 'center' }}>
                {qty}
              </span>
              <button
                onClick={() => updateQuantity(product.id, selectedVariant, 1)}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', padding: '6px 10px', cursor: 'pointer' }}
              >
                <Icon name="plus" size={12} />
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
