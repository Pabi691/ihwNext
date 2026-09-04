import React, { useState } from 'react';
import { BiSolidHomeSmile } from 'react-icons/bi';
import { FaUser, FaPhone, FaWhatsapp, FaXmark } from 'react-icons/fa6';
import { Link, useLocation } from '@/components/compat/router';
import { ShoppingBagIcon } from '@heroicons/react/20/solid';
import { ShoppingBasketIcon } from 'lucide-react';
import { useFestivalTheme } from '@/components/newui/FestivalThemeContext';
import { BRANCHES } from '@/config/branches';

const navItems = [
  { to: '/', label: 'Home', Icon: BiSolidHomeSmile },
  { to: '/shop', label: 'Shop', Icon: ShoppingBasketIcon },
  { to: '/cart', label: 'Cart', Icon: ShoppingBagIcon },
  { to: '/myaccount', label: 'Profile', Icon: FaUser },
];

const CONTACT_MSG = 'Hi, I’m interested in your products';

const BottomFixedNav = () => {
  const location = useLocation();
  const { theme } = useFestivalTheme();
  const bn = (theme && theme.active && theme.bottomNav) || null;
  const [contactOpen, setContactOpen] = useState(false);

  // Frosted-glass bar. Festival can override with an image (opaque) or a solid
  // colour (used as the glass tint); otherwise the --site-nav-bg token tints it
  // (the festival <style> re-maps that from the palette when a theme is active).
  const hasImage = !!(bn && bn.bgImage);
  const tint = bn && /^#[0-9a-fA-F]{6}$/.test(bn.bg || '') ? bn.bg : 'var(--site-nav-bg)';
  const barStyle = hasImage
    ? { backgroundImage: `url("${bn.bgImage}")`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: `color-mix(in srgb, ${tint} 78%, transparent)` };

  return (
    <>
      <div className='block md:hidden'>
        <div
          className='ihw-bottom-nav fixed bottom-0 z-50 w-full backdrop-blur-xl border-t border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.12)]'
          style={barStyle}
        >
          <div className='flex items-end justify-around px-3 py-2.5'>
            {navItems.map(({ to, label, Icon }, i) => {
              const isActive = location.pathname === to;
              const customIcon = bn && bn.icons && bn.icons[i];
              return (
                <React.Fragment key={to}>
                  {/* raised centre call button — docked between Shop and Cart.
                      Solid fill; only the translucent border frosts the backdrop. */}
                  {i === 2 && (
                    <button
                      type='button'
                      onClick={() => setContactOpen(true)}
                      aria-label='Call us'
                      className='flex-shrink-0 -mt-11 flex items-center justify-center w-[68px] h-[68px] rounded-full bg-[var(--site-primary)] border-[6px] border-white/40 backdrop-blur-md text-white shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-transform active:scale-95'
                    >
                      <FaPhone className='w-6 h-6' />
                    </button>
                  )}
                  {/* Icon only — the label is carried by aria-label so the
                      control stays accessible without visible text. */}
                  <Link
                    to={to}
                    aria-label={label}
                    title={label}
                    className='flex flex-col items-center justify-center flex-1 transition-all duration-200'
                  >
                    <div className='relative flex items-center justify-center w-[40px] h-[38px]'>
                      {customIcon ? (
                        <img
                          src={customIcon}
                          alt=''
                          aria-hidden='true'
                          className={`w-[35px] h-[35px] object-contain transition-all duration-200 ${
                            isActive ? '' : 'opacity-70'
                          }`}
                        />
                      ) : (
                        <Icon
                          aria-hidden='true'
                          className={`w-[35px] h-[35px] text-[35px] transition-all duration-200 ${
                            isActive ? 'text-white' : 'text-gray-300'
                          }`}
                        />
                      )}
                    </div>
                  </Link>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
      {/* Spacer so page content doesn't hide behind the fixed nav */}
      <div className='block md:hidden h-[64px]' />

      {/* Branch picker — same as the floating contact button: call / WhatsApp any branch */}
      {contactOpen && (
        <div className='branch-modal-overlay' onClick={() => setContactOpen(false)}>
          <div className='branch-modal' onClick={(e) => e.stopPropagation()}>
            <div className='branch-modal-header'>
              <h4>Select Branch</h4>
              <button onClick={() => setContactOpen(false)} aria-label='Close'>
                <FaXmark />
              </button>
            </div>

            {BRANCHES.map((branch) => (
              <div key={branch.id} className='branch-item'>
                <span>{branch.name}</span>
                <div className='branch-actions'>
                  <a href={`tel:${branch.phone}`} className='call' aria-label={`Call ${branch.name}`}>
                    <FaPhone />
                  </a>
                  <a
                    href={`https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(CONTACT_MSG)}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='whatsapp'
                    aria-label={`WhatsApp ${branch.name}`}
                  >
                    <FaWhatsapp />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default BottomFixedNav;
