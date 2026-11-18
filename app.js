/**
 * THE ART VILLAGE — A SUSTAINABLE CREATIVE ACADEMY
 * Interactive Core Application Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initPillarCards();
  initEcosystemScroll();
  initMovementModal();
  initFloatingBar();
  initVisionDocumentModal();
  initQrCodeSharing();
  initFormInteractivity();
});

/**
 * 1. THE SIX PILLARS: Expand/Collapse & Material Transformation
 */
function initPillarCards() {
  const cards = document.querySelectorAll('.pillar-card');

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Toggle card expanded state
      const isExpanded = card.getAttribute('aria-expanded') === 'true';
      
      // Accessibility update
      card.setAttribute('aria-expanded', !isExpanded);
      
      // Material transformation visual trigger
      const visual = card.querySelector('.transformation-svg');
      if (visual) {
        if (!isExpanded) {
          visual.classList.add('transformed');
        } else {
          visual.classList.remove('transformed');
        }
      }
    });

    // Keyboard navigation (Enter / Space)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
}

/**
 * 2. LIVING ECOSYSTEM: Horizontal Scroll Controls
 */
function initEcosystemScroll() {
  const track = document.getElementById('facilitiesTrack');
  const prevBtn = document.getElementById('scrollPrev');
  const nextBtn = document.getElementById('scrollNext');

  if (!track || !prevBtn || !nextBtn) return;

  const scrollAmount = 320;

  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });
}

/**
 * 3. MOVEMENT MODAL: Open, Close, Focus Trap & Submission
 */
function initMovementModal() {
  const modal = document.getElementById('movementModal');
  const openButtons = document.querySelectorAll('[data-open-movement]');
  const closeBtn = document.getElementById('closeMovementModal');

  if (!modal) return;

  const openModal = (defaultRole = null) => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // If a default role was specified (e.g. Partner, Volunteer)
    if (defaultRole) {
      const radio = modal.querySelector(`input[name="interestRole"][value="${defaultRole}"]`);
      if (radio) radio.checked = true;
    }

    // Check if user already submitted before
    const savedSupporter = localStorage.getItem('tav_supporter_data');
    if (savedSupporter) {
      try {
        const data = JSON.parse(savedSupporter);
        populateSupporterBadge(data);
      } catch (e) {
        // Continue normally
      }
    }

    // Focus on first input
    const firstInput = modal.querySelector('input:not([type="hidden"])');
    if (firstInput) setTimeout(() => firstInput.focus(), 150);
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const role = btn.getAttribute('data-role');
      openModal(role);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Close on backdrop tap
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/**
 * 4. FLOATING MOBILE BAR: Shows when scrolled past hero
 */
function initFloatingBar() {
  const bar = document.getElementById('floatingMobileBar');
  const hero = document.getElementById('hero');

  if (!bar || !hero) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        bar.classList.add('visible');
      } else {
        bar.classList.remove('visible');
      }
    });
  }, { threshold: 0.15 });

  observer.observe(hero);
}

/**
 * 5. VISION DOCUMENT READER MODAL
 */
function initVisionDocumentModal() {
  const readerModal = document.getElementById('visionDocModal');
  const openButtons = document.querySelectorAll('[data-open-vision-doc]');
  const closeBtn = document.getElementById('closeVisionDocModal');

  if (!readerModal) return;

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      readerModal.classList.add('active');
      readerModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeVisionModal = () => {
    readerModal.classList.remove('active');
    readerModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', closeVisionModal);
  }

  readerModal.addEventListener('click', (e) => {
    if (e.target === readerModal) closeVisionModal();
  });
}

/**
 * 6. QR CODE SHARING & WEB SHARE API
 */
function initQrCodeSharing() {
  const shareButtons = document.querySelectorAll('[data-share-page]');
  const pageUrl = window.location.href.split('#')[0];
  const shareData = {
    title: 'The Art Village | A Sustainable Creative Academy',
    text: '“Nothing is wasted when imagination is given the opportunity to create.” Discover The Art Village & join the movement.',
    url: pageUrl
  };

  shareButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          if (err.name !== 'AbortError') {
            copyLinkFallback(pageUrl, btn);
          }
        }
      } else {
        copyLinkFallback(pageUrl, btn);
      }
    });
  });
}

function copyLinkFallback(url, triggerBtn) {
  navigator.clipboard.writeText(url).then(() => {
    showToast('Link copied to clipboard! Share with fellow visionaries.');
  }).catch(() => {
    showToast('URL: ' + url);
  });
}

/**
 * Toast Notification Utility
 */
function showToast(message) {
  let toast = document.getElementById('tavToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'tavToast';
    toast.style.cssText = `
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: #C96A4B;
      color: #FFFFFF;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.88rem;
      font-weight: 600;
      padding: 0.75rem 1.25rem;
      border-radius: 999px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
      z-index: 9999;
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
      text-align: center;
      max-width: 90vw;
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 3200);
}

/**
 * 7. FORM SUBMISSION & SUPPORTER BADGE GENERATION
 */
function initFormInteractivity() {
  const form = document.getElementById('movementForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = document.getElementById('supporterName').value.trim();
    const email = document.getElementById('supporterEmail').value.trim();
    const phone = document.getElementById('supporterPhone').value.trim();
    const selectedRoleInput = form.querySelector('input[name="interestRole"]:checked');
    const role = selectedRoleInput ? selectedRoleInput.value : 'Visionary Supporter';
    const notes = document.getElementById('supporterNotes').value.trim();

    if (!fullName || !email) {
      showToast('Please provide your name and email.');
      return;
    }

    const randomId = Math.floor(1000 + Math.random() * 9000);
    const supporterData = {
      id: `TAV-2026-${randomId}`,
      name: fullName,
      email: email,
      phone: phone,
      role: role,
      notes: notes,
      timestamp: new Date().toISOString()
    };

    // Store in localStorage
    localStorage.setItem('tav_supporter_data', JSON.stringify(supporterData));

    // Render Badge & Switch to Success View
    populateSupporterBadge(supporterData);
    showToast('Welcome to The Art Village movement!');
  });
}

function populateSupporterBadge(data) {
  const form = document.getElementById('movementForm');
  const successState = document.getElementById('modalSuccessState');
  const badgeId = document.getElementById('supporterBadgeId');
  const badgeName = document.getElementById('supporterBadgeName');
  const badgeRole = document.getElementById('supporterBadgeRole');
  const whatsappShareLink = document.getElementById('whatsappShareLink');

  if (form) form.style.display = 'none';
  if (successState) successState.classList.add('active');

  if (badgeId) badgeId.textContent = data.id;
  if (badgeName) badgeName.textContent = data.name;
  if (badgeRole) badgeRole.textContent = `Official ${data.role}`;

  if (whatsappShareLink) {
    const text = encodeURIComponent(
      `I just joined THE ART VILLAGE movement as a ${data.role} (Pass #${data.id})! “Nothing is wasted when imagination is given the opportunity to create.” Check it out: ${window.location.href}`
    );
    whatsappShareLink.href = `https://wa.me/?text=${text}`;
  }
}
