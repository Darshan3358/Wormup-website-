import React, { useState } from 'react';
import { useLocation } from '../../context/LocationContext';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { useRouter } from '../../navigation/RouterContext';
import { Icon } from '../common/Icons';
import { getVariantPricing } from '../../data/mockData';

export const ProductCard = ({ product }) => {
  const { selectedArea } = useLocation();
  const { getProductAreaPrice } = useProducts();
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const { navigate } = useRouter();

  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || product.unit);

  const basePricing = getProductAreaPrice(product.id, selectedArea.id);
  const pricing = getVariantPricing(basePricing.price, basePricing.mrp, product.unit, selectedVariant);
  const qty = getItemQuantity(product.id, selectedVariant);

  const isOutOfStock = !basePricing.available || basePricing.stock <= 0;
  const isLowStock = basePricing.stock > 0 && basePricing.stock <= 10;

  const handleOpenDetail = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="womup-product-card">
      {/* Product Image Box (Clickable to open Detail Page) */}
      <div 
        onClick={handleOpenDetail}
        style={{
          position: 'relative',
          width: '100%',
          height: 'clamp(115px, 28vw, 145px)',
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '10px',
          background: '#F7F6FB',
          cursor: 'pointer'
        }}
        title={`View ${product.name} details`}
      >
        <img 
          src={product.image} 
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.25s ease' }}
          loading="lazy"
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />

        {/* Freshness Tag */}
        <div style={{ position: 'absolute', top: '8px', left: '8px' }}>
          <span className="badge-fresh" style={{ fontSize: '10px', padding: '3px 8px', background: 'var(--fresh-green-soft)', color: 'var(--fresh-green)', fontWeight: 800 }}>
            {product.freshness}
          </span>
        </div>

        {/* Discount Badge */}
        {pricing.discount > 0 && (
          <div style={{
            position: 'absolute',
            bottom: '8px',
            left: '8px',
            background: 'var(--gradient-brand)',
            color: '#FFFFFF',
            fontSize: '10px',
            fontWeight: 800,
            padding: '2px 7px',
            borderRadius: '4px',
            boxShadow: '0 2px 6px rgba(232, 67, 147, 0.4)'
          }}>
            {pricing.discount}% OFF
          </div>
        )}

        {/* Low Stock Warning */}
        {isLowStock && !isOutOfStock && (
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'var(--warn-amber)',
            color: '#12101B',
            fontSize: '9px',
            fontWeight: 800,
            padding: '2px 6px',
            borderRadius: '4px'
          }}>
            Only {pricing.stock} left
          </div>
        )}
      </div>

      {/* Product Details */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 
          onClick={handleOpenDetail}
          style={{ 
            fontSize: '14px', 
            fontWeight: 700, 
            color: 'var(--text-primary)', 
            marginBottom: '4px', 
            lineHeight: 1.3,
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--womup-violet)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          title={`View ${product.name} details`}
        >
          {product.name}
        </h3>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          {selectedVariant}
        </span>

        {/* Variants Selection */}
        {product.variants && product.variants.length > 1 && (
          <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
            {product.variants.map(v => (
              <button
                key={v}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedVariant(v);
                }}
                style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: selectedVariant === v ? 'rgba(142, 92, 247, 0.12)' : 'transparent',
                  border: `1px solid ${selectedVariant === v ? 'var(--womup-violet)' : 'var(--border)'}`,
                  color: selectedVariant === v ? 'var(--womup-violet)' : 'var(--text-secondary)',
                  fontWeight: selectedVariant === v ? 700 : 500
                }}
              >
                {v}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Pricing & Add Button Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '10px',
        borderTop: '1px solid var(--border)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)' }}>
              ₹{pricing.price}
            </span>
            {pricing.mrp > pricing.price && (
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>
                ₹{pricing.mrp}
              </span>
            )}
          </div>
          <span style={{ fontSize: '10px', color: 'var(--womup-violet)', fontWeight: 600 }}>
            in {selectedArea.name}
          </span>
        </div>

        {/* ADD Button */}
        <div>
          {isOutOfStock ? (
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--error-red)' }}>
              Out of stock
            </span>
          ) : qty === 0 ? (
            <button
              onClick={() => addToCart(product, selectedVariant)}
              className="btn-add-cart"
            >
              <Icon name="plus" size={13} /> ADD
            </button>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--gradient-brand)',
              borderRadius: 'var(--radius-md)',
              padding: '2px',
              color: '#FFFFFF',
              fontWeight: 800,
              boxShadow: '0 2px 10px rgba(142, 92, 247, 0.35)'
            }}>
              <button
                onClick={() => updateQuantity(product.id, selectedVariant, -1)}
                style={{
                  background: 'none',
                  color: '#FFFFFF',
                  padding: '4px 8px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Icon name="minus" size={12} />
              </button>
              <span style={{ fontSize: '12px', minWidth: '18px', textAlign: 'center' }}>
                {qty}
              </span>
              <button
                onClick={() => updateQuantity(product.id, selectedVariant, 1)}
                style={{
                  background: 'none',
                  color: '#FFFFFF',
                  padding: '4px 8px',
                  display: 'flex',
                  alignItems: 'center'
                }}
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
