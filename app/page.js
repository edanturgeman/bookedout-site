'use client'
import { useEffect } from 'react'
import Link from 'next/link'

export default function HomePage() {
  useEffect(() => {
    // Scroll reveal
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          observer.unobserve(e.target)
        }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))

    // FAQ accordion
    const toggleFaq = (el) => {
      const item = el.parentElement
      const isOpen = item.classList.contains('open')
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'))
      if (!isOpen) item.classList.add('open')
    }
    document.querySelectorAll('.faq-question').forEach(q => {
      q.addEventListener('click', () => toggleFaq(q))
    })

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --bg:#0A0908;
          --surface:#111010;
          --surface-2:#181716;
          --surface-3:#1F1E1C;
          --border:#272523;
          --border-2:#312F2D;
          --text:#F0EDE8;
          --text-2:#9B9690;
          --text-3:#5C5955;
          --gold:#C9A84C;
          --gold-dim:#8A7033;
          --gold-bg:rgba(201,168,76,0.08);
          --rose:#B87460;
          --rose-bg:rgba(184,116,96,0.10);
          --green:#4E9B6F;
          --green-bg:rgba(78,155,111,0.10);
          --radius-sm:6px;
          --radius:10px;
          --radius-lg:16px;
          --radius-xl:24px;
          --font-display:'Cormorant Garamond',Georgia,serif;
          --font-body:'DM Sans',system-ui,sans-serif;
        }
        html{scroll-behavior:smooth;}
        body{
          background:var(--bg);
          color:var(--text);
          font-family:var(--font-body);
          font-size:14px;
          line-height:1.6;
          -webkit-font-smoothing:antialiased;
          overflow-x:hidden;
        }
        body::before{
          content:'';
          position:fixed;
          inset:0;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events:none;
          z-index:0;
          opacity:0.5;
        }
        .nav{
          position:fixed;top:0;left:0;right:0;z-index:100;
          display:flex;align-items:center;justify-content:space-between;
          padding:0 48px;height:64px;
          background:rgba(10,9,8,0.8);
          backdrop-filter:blur(16px);
          border-bottom:1px solid rgba(39,37,35,0.6);
          animation:fadeDown 0.6s ease both;
        }
        @keyframes fadeDown{from{opacity:0;transform:translateY(-12px);}to{opacity:1;transform:translateY(0);}}
        .nav-logo{font-family:var(--font-display);font-size:22px;color:var(--text);letter-spacing:0.02em;text-decoration:none;}
        .nav-logo em{color:var(--gold);font-style:italic;}
        .nav-links{display:flex;gap:4px;align-items:center;}
        .nav-link{padding:7px 14px;border-radius:var(--radius-sm);font-size:13px;color:var(--text-3);text-decoration:none;transition:all 0.15s;}
        .nav-link:hover{color:var(--text);background:var(--surface-2);}
        .nav-cta{display:inline-flex;align-items:center;gap:6px;padding:0 18px;height:34px;background:var(--gold);color:#0A0908;border-radius:var(--radius-sm);font-size:13px;font-weight:600;text-decoration:none;transition:all 0.15s;margin-left:8px;}
        .nav-cta:hover{background:#D4B558;box-shadow:0 4px 20px rgba(201,168,76,0.3);transform:translateY(-1px);}
        .hero{min-height:100vh;display:flex;align-items:center;padding:120px 48px 80px;position:relative;overflow:hidden;}
        .hero::after{content:'';position:absolute;top:-20%;left:-10%;width:700px;height:700px;background:radial-gradient(ellipse at center, rgba(201,168,76,0.07) 0%, transparent 65%);pointer-events:none;}
        .hero-inner{max-width:1200px;margin:0 auto;width:100%;display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;position:relative;z-index:1;}
        .hero-eyebrow{display:inline-flex;align-items:center;gap:8px;padding:5px 12px;border-radius:99px;background:var(--gold-bg);border:1px solid rgba(201,168,76,0.2);font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold);margin-bottom:28px;animation:fadeUp 0.7s 0.2s ease both;}
        .hero-eyebrow-dot{width:5px;height:5px;border-radius:50%;background:var(--gold);}
        .hero-headline{font-family:var(--font-display);font-size:clamp(52px, 6vw, 80px);line-height:1.02;color:var(--text);letter-spacing:-0.01em;margin-bottom:24px;animation:fadeUp 0.8s 0.3s ease both;}
        .hero-headline em{color:var(--gold);font-style:italic;}
        .hero-headline .line2{display:block;font-weight:300;}
        .hero-sub{font-size:16px;color:var(--text-2);line-height:1.75;max-width:440px;margin-bottom:40px;animation:fadeUp 0.8s 0.45s ease both;}
        .hero-actions{display:flex;gap:12px;align-items:center;animation:fadeUp 0.8s 0.55s ease both;}
        .btn-hero-primary{display:inline-flex;align-items:center;gap:8px;padding:0 28px;height:50px;background:var(--gold);color:#0A0908;border-radius:var(--radius-sm);font-size:14px;font-weight:600;text-decoration:none;transition:all 0.2s;border:none;cursor:pointer;font-family:var(--font-body);}
        .btn-hero-primary:hover{background:#D4B558;box-shadow:0 8px 32px rgba(201,168,76,0.35);transform:translateY(-2px);}
        .btn-hero-ghost{display:inline-flex;align-items:center;gap:8px;padding:0 24px;height:50px;background:transparent;color:var(--text-2);border-radius:var(--radius-sm);font-size:14px;font-weight:400;text-decoration:none;transition:all 0.15s;border:1px solid var(--border);cursor:pointer;font-family:var(--font-body);}
        .btn-hero-ghost:hover{background:var(--surface-2);color:var(--text);border-color:var(--border-2);}
        .hero-trust{display:flex;align-items:center;gap:10px;margin-top:28px;font-size:12px;color:var(--text-3);animation:fadeUp 0.8s 0.65s ease both;}
        .hero-trust-dot{width:4px;height:4px;border-radius:50%;background:var(--text-3);}
        .hero-right{position:relative;animation:fadeUp 0.9s 0.4s ease both;}
        .mockup-wrap{position:relative;border-radius:var(--radius-xl);overflow:hidden;border:1px solid var(--border-2);box-shadow:0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.08);background:var(--surface);animation:float 6s ease-in-out infinite;}
        @keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
        .m-topbar{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--border);background:var(--surface);}
        .m-dots{display:flex;gap:6px;}
        .m-dot{width:10px;height:10px;border-radius:50%;}
        .m-title{font-family:var(--font-display);font-size:14px;color:var(--text-2);}
        .m-date{font-size:11px;color:var(--text-3);}
        .m-body{display:flex;height:360px;}
        .m-sidebar{width:48px;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;align-items:center;padding:16px 0;gap:12px;}
        .m-s-icon{width:32px;height:32px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;font-size:14px;color:var(--text-3);transition:all 0.12s;}
        .m-s-icon.active{background:var(--surface-3);color:var(--gold);}
        .m-main{flex:1;padding:20px;background:var(--bg);overflow:hidden;}
        .m-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:18px;}
        .m-stat{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px 14px;}
        .m-stat-label{font-size:9px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-3);margin-bottom:4px;}
        .m-stat-val{font-family:var(--font-display);font-size:22px;color:var(--text);}
        .m-stat-val.gold{color:var(--gold);}
        .m-stat-sub{font-size:10px;color:var(--green);margin-top:2px;}
        .m-schedule-label{font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-3);margin-bottom:10px;}
        .m-appt{display:flex;gap:10px;align-items:center;padding:10px 12px;border-radius:var(--radius-sm);background:var(--surface);border:1px solid var(--border);margin-bottom:8px;}
        .m-appt-bar{width:2px;height:32px;border-radius:99px;flex-shrink:0;}
        .m-appt-info{flex:1;}
        .m-appt-name{font-size:11px;font-weight:600;color:var(--text);}
        .m-appt-svc{font-size:10px;color:var(--text-3);}
        .m-appt-price{font-size:11px;font-weight:600;color:var(--gold);}
        .m-badge{font-size:9px;font-weight:600;padding:2px 7px;border-radius:99px;border:1px solid transparent;}
        .m-badge-green{background:var(--green-bg);color:var(--green);border-color:rgba(78,155,111,0.2);}
        .m-badge-gold{background:var(--gold-bg);color:var(--gold);border-color:rgba(201,168,76,0.2);}
        .mockup-glow{position:absolute;bottom:-60px;right:-60px;width:300px;height:300px;background:radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, transparent 70%);pointer-events:none;border-radius:50%;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
        section{position:relative;z-index:1;}
        .section-wrap{max-width:1200px;margin:0 auto;padding:0 48px;}
        .section-eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--gold);margin-bottom:16px;}
        .section-eyebrow::before{content:'';width:24px;height:1px;background:var(--gold-dim);}
        .section-title{font-family:var(--font-display);font-size:clamp(36px,4vw,52px);line-height:1.08;color:var(--text);margin-bottom:16px;}
        .section-title em{font-style:italic;color:var(--gold);}
        .section-body{font-size:15px;color:var(--text-2);line-height:1.75;max-width:560px;}
        .reveal{opacity:0;transform:translateY(32px);transition:opacity 0.7s ease, transform 0.7s ease;}
        .reveal.visible{opacity:1;transform:translateY(0);}
        .reveal-delay-1{transition-delay:0.1s;}
        .reveal-delay-2{transition-delay:0.2s;}
        .reveal-delay-3{transition-delay:0.3s;}
        .for-section{padding:100px 0;border-top:1px solid var(--border);}
        .for-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:56px;}
        .for-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:28px;transition:all 0.25s;cursor:default;position:relative;overflow:hidden;}
        .for-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(201,168,76,0.04) 0%,transparent 60%);opacity:0;transition:opacity 0.3s;}
        .for-card:hover{border-color:rgba(201,168,76,0.3);transform:translateY(-4px);box-shadow:0 16px 48px rgba(0,0,0,0.4);}
        .for-card:hover::before{opacity:1;}
        .for-icon{width:44px;height:44px;border-radius:var(--radius-sm);background:var(--gold-bg);border:1px solid rgba(201,168,76,0.15);display:flex;align-items:center;justify-content:center;font-size:20px;margin-bottom:16px;}
        .for-title{font-family:var(--font-display);font-size:20px;color:var(--text);margin-bottom:8px;}
        .for-body{font-size:13px;color:var(--text-3);line-height:1.65;}
        .features-section{padding:100px 0;border-top:1px solid var(--border);}
        .feature-row{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;margin-bottom:100px;}
        .feature-row:last-child{margin-bottom:0;}
        .feature-row.reverse .feature-visual{order:-1;}
        .feature-label{font-size:10px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--gold);margin-bottom:12px;display:flex;align-items:center;gap:8px;}
        .feature-label::before{content:'';width:20px;height:1px;background:var(--gold-dim);}
        .feature-title{font-family:var(--font-display);font-size:clamp(28px,3vw,40px);line-height:1.1;color:var(--text);margin-bottom:16px;}
        .feature-title em{font-style:italic;color:var(--gold);}
        .feature-body{font-size:14px;color:var(--text-2);line-height:1.8;margin-bottom:24px;}
        .feature-points{display:flex;flex-direction:column;gap:10px;}
        .feature-point{display:flex;align-items:flex-start;gap:10px;font-size:13px;color:var(--text-3);}
        .feature-point-dot{width:5px;height:5px;border-radius:50%;background:var(--gold);flex-shrink:0;margin-top:6px;}
        .feature-visual{border-radius:var(--radius-lg);background:var(--surface);border:1px solid var(--border);overflow:hidden;box-shadow:0 16px 48px rgba(0,0,0,0.4);}
        .fv-header{padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;background:var(--surface-2);}
        .fv-title{font-family:var(--font-display);font-size:14px;color:var(--text-2);}
        .fv-body{padding:20px;}
        .cal-mini-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;margin-bottom:12px;}
        .cal-day{height:36px;border-radius:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:10px;color:var(--text-3);border:1px solid transparent;transition:all 0.12s;cursor:default;}
        .cal-day.has{background:var(--surface-2);border-color:var(--border);}
        .cal-day.appt{background:rgba(201,168,76,0.1);border-color:rgba(201,168,76,0.25);color:var(--gold);}
        .cal-day.today{background:var(--gold);color:#0A0908;font-weight:700;}
        .cal-day-name{font-size:9px;color:var(--text-3);text-align:center;padding:3px 0;font-weight:600;letter-spacing:0.06em;}
        .cal-appt-row{display:flex;gap:8px;align-items:center;padding:8px 10px;border-radius:6px;background:var(--surface-2);border:1px solid var(--border);margin-bottom:6px;}
        .cal-bar{width:3px;height:28px;border-radius:99px;flex-shrink:0;}
        .cal-info{flex:1;}
        .cal-name{font-size:11px;font-weight:600;color:var(--text);}
        .cal-time{font-size:10px;color:var(--text-3);}
        .client-row-m{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:8px;border:1px solid var(--border);background:var(--surface-2);margin-bottom:8px;transition:border-color 0.15s;}
        .client-row-m:hover{border-color:var(--border-2);}
        .c-avatar{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;}
        .c-info{flex:1;}
        .c-name{font-size:12px;font-weight:600;color:var(--text);}
        .c-meta{font-size:10px;color:var(--text-3);margin-top:1px;}
        .c-badge{font-size:9px;font-weight:600;padding:2px 8px;border-radius:99px;}
        .reminder-item{display:flex;gap:12px;align-items:flex-start;padding:12px 14px;border-radius:8px;border:1px solid var(--border);background:var(--surface-2);margin-bottom:8px;}
        .r-icon{width:32px;height:32px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;}
        .r-info{flex:1;}
        .r-title{font-size:12px;font-weight:600;color:var(--text);}
        .r-body{font-size:10px;color:var(--text-3);margin-top:2px;line-height:1.5;}
        .r-time{font-size:10px;color:var(--gold);}
        .pricing-section{padding:100px 0;border-top:1px solid var(--border);}
        .pricing-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;max-width:780px;margin:56px auto 0;}
        .pricing-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-xl);padding:36px;transition:all 0.25s;position:relative;overflow:hidden;}
        .pricing-card.featured{border-color:rgba(201,168,76,0.4);background:linear-gradient(145deg,var(--surface) 0%,rgba(201,168,76,0.05) 100%);box-shadow:0 0 0 1px rgba(201,168,76,0.15), 0 24px 64px rgba(0,0,0,0.5);}
        .pricing-card:hover{transform:translateY(-4px);box-shadow:0 24px 64px rgba(0,0,0,0.5);}
        .pricing-card.featured:hover{box-shadow:0 0 0 1px rgba(201,168,76,0.25), 0 32px 80px rgba(0,0,0,0.6);}
        .pricing-badge{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:99px;background:var(--gold);color:#0A0908;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:20px;}
        .pricing-name{font-family:var(--font-display);font-size:26px;color:var(--text);margin-bottom:4px;}
        .pricing-desc{font-size:13px;color:var(--text-3);margin-bottom:24px;line-height:1.5;}
        .pricing-amount{display:flex;align-items:flex-end;gap:4px;margin-bottom:6px;}
        .pricing-dollar{font-size:20px;color:var(--text-2);font-weight:300;padding-bottom:6px;}
        .pricing-number{font-family:var(--font-display);font-size:52px;color:var(--text);line-height:1;}
        .pricing-period{font-size:13px;color:var(--text-3);padding-bottom:10px;}
        .pricing-trial{font-size:12px;color:var(--gold);margin-bottom:28px;}
        .pricing-divider{height:1px;background:var(--border);margin:24px 0;}
        .pricing-features{display:flex;flex-direction:column;gap:10px;margin-bottom:32px;}
        .pricing-feature{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--text-2);}
        .pricing-check{width:18px;height:18px;border-radius:50%;background:var(--green-bg);border:1px solid rgba(78,155,111,0.2);display:flex;align-items:center;justify-content:center;font-size:9px;color:var(--green);flex-shrink:0;}
        .pricing-cta{display:block;text-align:center;padding:0;height:46px;line-height:46px;border-radius:var(--radius-sm);font-size:14px;font-weight:600;text-decoration:none;transition:all 0.2s;}
        .pricing-cta.primary{background:var(--gold);color:#0A0908;}
        .pricing-cta.primary:hover{background:#D4B558;box-shadow:0 8px 24px rgba(201,168,76,0.3);transform:translateY(-1px);}
        .pricing-cta.ghost{background:transparent;color:var(--text-2);border:1px solid var(--border);}
        .pricing-cta.ghost:hover{background:var(--surface-2);color:var(--text);}
        .pricing-footer{text-align:center;margin-top:20px;font-size:12px;color:var(--text-3);}
        .about-section{padding:100px 0;border-top:1px solid var(--border);}
        .about-inner{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;}
        .about-visual{border-radius:var(--radius-xl);overflow:hidden;border:1px solid var(--border);background:var(--surface);padding:36px;position:relative;}
        .about-visual::before{content:'';position:absolute;top:-40px;right:-40px;width:200px;height:200px;background:radial-gradient(ellipse,rgba(201,168,76,0.1) 0%,transparent 70%);border-radius:50%;}
        .about-stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
        .about-stat{background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius);padding:20px;text-align:center;}
        .about-stat-num{font-family:var(--font-display);font-size:36px;color:var(--gold);}
        .about-stat-label{font-size:11px;color:var(--text-3);margin-top:4px;line-height:1.4;}
        .about-mission{margin-top:20px;padding:20px;background:var(--gold-bg);border:1px solid rgba(201,168,76,0.15);border-radius:var(--radius);font-family:var(--font-display);font-size:16px;font-style:italic;color:var(--text-2);line-height:1.6;}
        .about-story{font-size:15px;color:var(--text-2);line-height:1.85;margin-bottom:20px;}
        .about-signature{display:flex;align-items:center;gap:14px;padding:16px 20px;border-radius:var(--radius);background:var(--surface-2);border:1px solid var(--border);margin-top:32px;}
        .about-avatar{width:44px;height:44px;border-radius:50%;background:var(--gold-bg);border:1px solid rgba(201,168,76,0.3);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:18px;color:var(--gold);flex-shrink:0;}
        .about-sig-name{font-size:14px;font-weight:600;color:var(--text);}
        .about-sig-title{font-size:12px;color:var(--text-3);margin-top:1px;}
        .faq-section{padding:100px 0;border-top:1px solid var(--border);}
        .faq-wrap{max-width:720px;margin:56px auto 0;}
        .faq-item{border-bottom:1px solid var(--border);overflow:hidden;}
        .faq-question{display:flex;align-items:center;justify-content:space-between;padding:20px 0;cursor:pointer;font-size:15px;font-weight:500;color:var(--text);transition:color 0.15s;user-select:none;}
        .faq-question:hover{color:var(--gold);}
        .faq-icon{width:24px;height:24px;border-radius:50%;background:var(--surface-2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:14px;color:var(--text-3);flex-shrink:0;transition:all 0.25s;}
        .faq-item.open .faq-icon{background:var(--gold-bg);border-color:rgba(201,168,76,0.3);color:var(--gold);transform:rotate(45deg);}
        .faq-answer{max-height:0;overflow:hidden;transition:max-height 0.35s cubic-bezier(0.4,0,0.2,1), padding 0.35s;font-size:14px;color:var(--text-3);line-height:1.8;}
        .faq-item.open .faq-answer{max-height:300px;padding-bottom:20px;}
        .footer{padding:64px 0 40px;border-top:1px solid var(--border);}
        .footer-inner{max-width:1200px;margin:0 auto;padding:0 48px;}
        .footer-top{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;margin-bottom:48px;}
        .footer-logo{font-family:var(--font-display);font-size:22px;color:var(--text);margin-bottom:12px;}
        .footer-logo em{color:var(--gold);font-style:italic;}
        .footer-tagline{font-size:13px;color:var(--text-3);line-height:1.65;max-width:240px;}
        .footer-col-title{font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-3);margin-bottom:16px;}
        .footer-link{display:block;font-size:13px;color:var(--text-3);text-decoration:none;margin-bottom:10px;transition:color 0.12s;}
        .footer-link:hover{color:var(--text);}
        .footer-bottom{display:flex;align-items:center;justify-content:space-between;padding-top:28px;border-top:1px solid var(--border);font-size:12px;color:var(--text-3);}
        .footer-bottom a{color:var(--text-3);text-decoration:none;}
        .footer-bottom a:hover{color:var(--text-2);}
        .cta-banner{padding:80px 48px;position:relative;overflow:hidden;border-top:1px solid var(--border);}
        .cta-banner::before{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:600px;height:300px;background:radial-gradient(ellipse,rgba(201,168,76,0.08) 0%,transparent 70%);pointer-events:none;}
        .cta-inner{max-width:680px;margin:0 auto;text-align:center;position:relative;}
        .cta-title{font-family:var(--font-display);font-size:clamp(36px,5vw,56px);line-height:1.05;color:var(--text);margin-bottom:16px;}
        .cta-title em{font-style:italic;color:var(--gold);}
        .cta-sub{font-size:15px;color:var(--text-2);margin-bottom:36px;line-height:1.7;}
        .cta-actions{display:flex;gap:12px;justify-content:center;}
        ::-webkit-scrollbar{width:6px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:var(--border-2);border-radius:99px;}
      `}</style>

      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* NAVBAR */}
      <nav className="nav">
        <Link className="nav-logo" href="/">Booked<em>Out</em></Link>
        <div className="nav-links">
          <a className="nav-link" href="#features">Features</a>
          <a className="nav-link" href="#for">Who It&apos;s For</a>
          <a className="nav-link" href="#pricing">Pricing</a>
          <a className="nav-link" href="#about">About</a>
          <a className="nav-link" href="#faq">FAQ</a>
          <Link className="nav-link" href="/login">Log in</Link>
          <Link className="nav-cta" href="/signup">Start Free Trial →</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-eyebrow">
              <div className="hero-eyebrow-dot"></div>
              Built for personal care professionals
            </div>
            <h1 className="hero-headline">
              Your business,<br />
              <em>elevated.</em><br />
              <span className="line2">Book more. Stress less.</span>
            </h1>
            <p className="hero-sub">
              BookedOut is the all-in-one platform for barbers, stylists, nail techs, estheticians, and every personal care professional who runs their business like a pro.
            </p>
            <div className="hero-actions">
              <Link className="btn-hero-primary" href="/signup">Start Free — 30 Days →</Link>
              <a className="btn-hero-ghost" href="#features">See How It Works</a>
            </div>
            <div className="hero-trust">
              <span>No credit card required</span>
              <div className="hero-trust-dot"></div>
              <span>Set up in 5 minutes</span>
              <div className="hero-trust-dot"></div>
              <span>Cancel anytime</span>
            </div>
          </div>

          {/* Dashboard Mockup */}
          <div className="hero-right">
            <div className="mockup-wrap">
              <div className="m-topbar">
                <div className="m-dots">
                  <div className="m-dot" style={{background:'#ff5f57'}}></div>
                  <div className="m-dot" style={{background:'#febc2e'}}></div>
                  <div className="m-dot" style={{background:'#28c840'}}></div>
                </div>
                <div className="m-title">BookedOut — Dashboard</div>
                <div className="m-date">Sat, Mar 7</div>
              </div>
              <div className="m-body">
                <div className="m-sidebar">
                  <div className="m-s-icon active">⊞</div>
                  <div className="m-s-icon">◷</div>
                  <div className="m-s-icon">◉</div>
                  <div className="m-s-icon">✉</div>
                  <div className="m-s-icon" style={{marginTop:'auto'}}>⚙</div>
                </div>
                <div className="m-main">
                  <div className="m-stats">
                    <div className="m-stat">
                      <div className="m-stat-label">Today</div>
                      <div className="m-stat-val">8</div>
                      <div className="m-stat-sub">↑ 2 vs last Sat</div>
                    </div>
                    <div className="m-stat">
                      <div className="m-stat-label">Revenue</div>
                      <div className="m-stat-val gold">$2,840</div>
                      <div className="m-stat-sub">↑ 12% this month</div>
                    </div>
                    <div className="m-stat">
                      <div className="m-stat-label">Clients</div>
                      <div className="m-stat-val">143</div>
                      <div className="m-stat-sub">↑ 6 new this week</div>
                    </div>
                  </div>
                  <div className="m-schedule-label">Today&apos;s Schedule</div>
                  <div className="m-appt">
                    <div className="m-appt-bar" style={{background:'var(--gold)'}}></div>
                    <div className="m-appt-info">
                      <div className="m-appt-name">Jordan Smith</div>
                      <div className="m-appt-svc">Fade + Line-up · 9:00 AM</div>
                    </div>
                    <div className="m-appt-price">$45</div>
                    <div className="m-badge m-badge-green">Now</div>
                  </div>
                  <div className="m-appt">
                    <div className="m-appt-bar" style={{background:'var(--green)'}}></div>
                    <div className="m-appt-info">
                      <div className="m-appt-name">Aaliyah Laurent</div>
                      <div className="m-appt-svc">Color · 10:30 AM</div>
                    </div>
                    <div className="m-appt-price">$85</div>
                    <div className="m-badge m-badge-gold">Next</div>
                  </div>
                  <div className="m-appt">
                    <div className="m-appt-bar" style={{background:'var(--rose)'}}></div>
                    <div className="m-appt-info">
                      <div className="m-appt-name">Nina Clarke</div>
                      <div className="m-appt-svc">Full Set · 12:00 PM</div>
                    </div>
                    <div className="m-appt-price">$65</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mockup-glow"></div>
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="for-section" id="for">
        <div className="section-wrap">
          <div className="reveal">
            <div className="section-eyebrow">Who It&apos;s For</div>
            <h2 className="section-title">Built for every<br />pro in the chair<em>.</em></h2>
            <p className="section-body">Whether you&apos;re an independent booth renter or running a full shop, BookedOut fits the way you work.</p>
          </div>
          <div className="for-grid">
            {[
              {icon:'✂️', title:'Barbers', body:"Manage your book, send reminders, track client preferences, and never let a chair sit empty again."},
              {icon:'💇', title:'Hair Stylists', body:"Keep track of color formulas, cut history, and long-term client relationships all in one place."},
              {icon:'💅', title:'Nail Techs', body:"Book appointments, track service history, and send automated follow-ups to keep clients coming back."},
              {icon:'✨', title:'Estheticians', body:"Manage facials, waxing, and skincare appointments with ease. Build a loyal clientele that trusts you."},
              {icon:'👁️', title:'Lash & Brow Artists', body:"Track fill schedules, send timely reminders, and grow your reputation with every set you deliver."},
              {icon:'🏪', title:'Shop Owners', body:"Manage multiple chairs, track shop-wide performance, and keep your team organized — without the chaos."},
            ].map((card, i) => (
              <div key={i} className={`for-card reveal reveal-delay-${(i % 3) + 1}`}>
                <div className="for-icon">{card.icon}</div>
                <div className="for-title">{card.title}</div>
                <div className="for-body">{card.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section" id="features">
        <div className="section-wrap">
          <div className="reveal">
            <div className="section-eyebrow">Features</div>
            <h2 className="section-title">Everything you need.<br /><em>Nothing you don&apos;t.</em></h2>
          </div>

          {/* Feature 1: Calendar */}
          <div className="feature-row" style={{marginTop:'64px'}}>
            <div className="feature-text reveal">
              <div className="feature-label">Scheduling</div>
              <h3 className="feature-title">Your calendar,<br /><em>finally organized.</em></h3>
              <p className="feature-body">A beautiful week and month view that shows your entire schedule at a glance. Add appointments in seconds, move them with a click, and never double-book again.</p>
              <div className="feature-points">
                {['Week, day, and month views','Color-coded by service type','Walk-in and scheduled appointments','Real-time availability'].map((p,i) => (
                  <div key={i} className="feature-point"><div className="feature-point-dot"></div>{p}</div>
                ))}
              </div>
            </div>
            <div className="feature-visual reveal reveal-delay-2">
              <div className="fv-header">
                <div className="fv-title">Calendar — March 2026</div>
                <span style={{fontSize:'10px',color:'var(--text-3)'}}>Week View</span>
              </div>
              <div className="fv-body">
                <div className="cal-mini-grid">
                  {['S','M','T','W','T','F','S'].map((d,i) => <div key={i} className="cal-day-name">{d}</div>)}
                  <div className="cal-day has">1</div>
                  <div className="cal-day appt">2</div>
                  <div className="cal-day has">3</div>
                  <div className="cal-day appt">4</div>
                  <div className="cal-day has">5</div>
                  <div className="cal-day appt">6</div>
                  <div className="cal-day today">7</div>
                </div>
                {[
                  {color:'var(--gold)', name:'Jordan Smith', time:'9:00 AM · Fade · $45'},
                  {color:'var(--green)', name:'Aaliyah Laurent', time:'10:30 AM · Color · $85'},
                  {color:'var(--rose)', name:'Nina Clarke', time:'12:00 PM · Full Set · $65'},
                ].map((a,i) => (
                  <div key={i} className="cal-appt-row">
                    <div className="cal-bar" style={{background:a.color}}></div>
                    <div className="cal-info"><div className="cal-name">{a.name}</div><div className="cal-time">{a.time}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feature 2: Clients */}
          <div className="feature-row reverse">
            <div className="feature-text reveal reveal-delay-1">
              <div className="feature-label">Client Management</div>
              <h3 className="feature-title">Know your clients<br /><em>by heart.</em></h3>
              <p className="feature-body">Every client gets a full profile — visit history, service preferences, contact info, notes, and more. Build relationships that keep people coming back.</p>
              <div className="feature-points">
                {['Full visit history per client','Service notes and preferences','Birthday tracking','Lapsed client alerts'].map((p,i) => (
                  <div key={i} className="feature-point"><div className="feature-point-dot"></div>{p}</div>
                ))}
              </div>
            </div>
            <div className="feature-visual reveal">
              <div className="fv-header">
                <div className="fv-title">Clients</div>
                <span style={{fontSize:'10px',color:'var(--text-3)'}}>143 total</span>
              </div>
              <div className="fv-body">
                {[
                  {initials:'JS', name:'Jordan Smith', meta:'Last visit Mar 7 · 22 visits total', badge:'VIP', bg:'var(--gold-bg)', color:'var(--gold)'},
                  {initials:'AL', name:'Aaliyah Laurent', meta:'Last visit Mar 7 · 14 visits total', badge:'Regular', bg:'var(--green-bg)', color:'var(--green)'},
                  {initials:'MW', name:'Marcus Webb', meta:'Last visit Feb 18 · 3 visits total', badge:'New', bg:'var(--surface-3)', color:'var(--text-3)'},
                ].map((c,i) => (
                  <div key={i} className="client-row-m">
                    <div className="c-avatar" style={{background:c.bg, color:c.color}}>{c.initials}</div>
                    <div className="c-info"><div className="c-name">{c.name}</div><div className="c-meta">{c.meta}</div></div>
                    <span className="c-badge" style={{background:c.bg, color:c.color}}>{c.badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feature 3: Reminders */}
          <div className="feature-row">
            <div className="feature-text reveal">
              <div className="feature-label">Automation</div>
              <h3 className="feature-title">Reminders that<br /><em>run themselves.</em></h3>
              <p className="feature-body">Automated appointment reminders go out 24 hours and 1 hour before every appointment. Fewer no-shows, less chasing, more time doing what you love.</p>
              <div className="feature-points">
                {['24hr and 1hr reminders','Booking confirmations','Win-back campaigns for lapsed clients','Birthday messages'].map((p,i) => (
                  <div key={i} className="feature-point"><div className="feature-point-dot"></div>{p}</div>
                ))}
              </div>
            </div>
            <div className="feature-visual reveal reveal-delay-2">
              <div className="fv-header">
                <div className="fv-title">Automated Reminders</div>
                <span style={{fontSize:'10px',color:'var(--green)'}}>● Active</span>
              </div>
              <div className="fv-body">
                {[
                  {bg:'var(--gold-bg)', color:'var(--gold)', icon:'✉', title:'Appointment Reminder — Jordan Smith', body:'Hi Jordan, just a reminder about your fade tomorrow at 9 AM. See you then!', time:'Sending in 2 hours · 24hr reminder'},
                  {bg:'var(--green-bg)', color:'var(--green)', icon:'🎂', title:'Birthday Message — Aaliyah Laurent', body:'Happy birthday Aaliyah! Treat yourself — book your next appointment today.', time:'Scheduled for Mar 14'},
                  {bg:'var(--rose-bg)', color:'var(--rose)', icon:'↩', title:'Win-Back — Marcus Webb', body:'Hey Marcus, it\'s been a while. Ready for a fresh cut? Book your spot now.', time:'Last visit 18 days ago · Auto-triggered'},
                ].map((r,i) => (
                  <div key={i} className="reminder-item">
                    <div className="r-icon" style={{background:r.bg, color:r.color}}>{r.icon}</div>
                    <div className="r-info">
                      <div className="r-title">{r.title}</div>
                      <div className="r-body">{r.body}</div>
                      <div className="r-time">{r.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing-section" id="pricing">
        <div className="section-wrap" style={{textAlign:'center'}}>
          <div className="reveal">
            <div className="section-eyebrow" style={{justifyContent:'center'}}>Pricing</div>
            <h2 className="section-title">Simple pricing.<br /><em>No surprises.</em></h2>
            <p className="section-body" style={{margin:'0 auto'}}>Start with a 30-day free trial on any plan. No credit card required. Cancel anytime.</p>
          </div>
          <div className="pricing-grid reveal reveal-delay-1">
            <div className="pricing-card">
              <div className="pricing-name">Solo</div>
              <div className="pricing-desc">For independent providers and booth renters running their own book.</div>
              <div className="pricing-amount">
                <div className="pricing-dollar">$</div>
                <div className="pricing-number">14</div>
                <div className="pricing-period">.99 / mo</div>
              </div>
              <div className="pricing-trial">30-day free trial included</div>
              <div className="pricing-divider"></div>
              <div className="pricing-features">
                {['Appointment calendar','Unlimited client profiles','Automated reminders','Revenue analytics','Win-back campaigns','Birthday messages'].map((f,i) => (
                  <div key={i} className="pricing-feature"><div className="pricing-check">✓</div>{f}</div>
                ))}
              </div>
              <Link className="pricing-cta ghost" href="/signup">Start Free Trial</Link>
            </div>
            <div className="pricing-card featured">
              <div className="pricing-badge">Most Popular</div>
              <div className="pricing-name">Shop Owner</div>
              <div className="pricing-desc">For barbershops, salons, and spas managing multiple chairs and providers.</div>
              <div className="pricing-amount">
                <div className="pricing-dollar">$</div>
                <div className="pricing-number">99</div>
                <div className="pricing-period">.99 / mo</div>
              </div>
              <div className="pricing-trial">Includes 6 chairs · +$9.99 per additional chair</div>
              <div className="pricing-divider"></div>
              <div className="pricing-features">
                {['Everything in Solo','Up to 6 provider chairs','Shop-level analytics','Chair utilization reports','Team management','Provider invites'].map((f,i) => (
                  <div key={i} className="pricing-feature"><div className="pricing-check">✓</div>{f}</div>
                ))}
              </div>
              <Link className="pricing-cta primary" href="/signup">Start Free Trial →</Link>
            </div>
          </div>
          <div className="pricing-footer reveal">All plans include a 30-day free trial. No credit card required. You won&apos;t be charged until your trial ends.</div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about-section" id="about">
        <div className="section-wrap">
          <div className="about-inner">
            <div className="about-visual reveal">
              <div className="about-stat-grid">
                {[
                  {num:'6+', label:'Personal care specialties supported'},
                  {num:'$0', label:'Cost for your first 30 days'},
                  {num:'5min', label:'Average setup time'},
                  {num:'∞', label:'Client profiles on every plan'},
                ].map((s,i) => (
                  <div key={i} className="about-stat">
                    <div className="about-stat-num">{s.num}</div>
                    <div className="about-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="about-mission">
                &ldquo;We built BookedOut because the tools available to personal care professionals were either too generic, too complicated, or too expensive. You deserve something built specifically for you.&rdquo;
              </div>
            </div>
            <div className="about-right reveal reveal-delay-2">
              <div className="section-eyebrow">About Us</div>
              <h2 className="section-title" style={{fontSize:'clamp(32px,3.5vw,44px)'}}>Built by someone<br />who <em>gets it.</em></h2>
              <p className="about-story">BookedOut was born out of a simple frustration — personal care professionals are some of the hardest working people in any industry, yet the tools built for them have never matched that standard.</p>
              <p className="about-story">We set out to build something different. A platform that feels as premium as the services you provide. One that respects your time, knows your industry, and grows with your business.</p>
              <p className="about-story">BookedOut is built specifically for barbers, stylists, nail techs, estheticians, lash artists, and shop owners — not adapted from some generic scheduling tool. Every feature exists because a real professional needed it.</p>
              <div className="about-signature">
                <div className="about-avatar">E</div>
                <div>
                  <div className="about-sig-name">Edan Turgeman</div>
                  <div className="about-sig-title">Founder, BookedOut</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section" id="faq">
        <div className="section-wrap" style={{textAlign:'center'}}>
          <div className="reveal">
            <div className="section-eyebrow" style={{justifyContent:'center'}}>FAQ</div>
            <h2 className="section-title">Questions,<br /><em>answered.</em></h2>
          </div>
          <div className="faq-wrap">
            {[
              {q:'Do I need a credit card to start my free trial?', a:"No. Your 30-day free trial starts the moment you sign up — no credit card required. You'll only be asked for payment information when your trial ends and you choose to continue."},
              {q:'What happens when my trial ends?', a:"At the end of your 30-day trial, you'll be prompted to choose a plan and enter your payment information. If you choose not to continue, your account will be paused and your data will be retained for 30 days before deletion."},
              {q:'Can I switch between Solo and Shop Owner plans?', a:"Yes — you can upgrade or downgrade your plan at any time from your account settings. Upgrades take effect immediately. Downgrades take effect at the end of your current billing period."},
              {q:"How does the Shop Owner plan work for multiple chairs?", a:"The Shop Owner plan includes up to 6 chairs at $99.99/month. Each additional chair beyond 6 is $9.99/month. Each provider gets their own login and manages their own clients and appointments, while the shop owner gets an operational overview of the entire shop."},
              {q:"Are my clients' data and my business data secure?", a:"Yes. All data is encrypted in transit and at rest. We use industry-standard security practices and your client data is never shared with third parties."},
              {q:'Can I cancel anytime?', a:"Yes, always. You can cancel your subscription at any time from your account settings. Cancellation takes effect at the end of your current billing period and subscription fees are non-refundable except in cases of billing errors."},
            ].map((item,i) => (
              <div key={i} className="faq-item">
                <div className="faq-question">
                  {item.q}
                  <div className="faq-icon">+</div>
                </div>
                <div className="faq-answer">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-banner">
        <div className="cta-inner reveal">
          <h2 className="cta-title">Ready to run your<br />business like a <em>pro?</em></h2>
          <p className="cta-sub">Join BookedOut today. Your first 30 days are completely free — no credit card, no commitment, no risk.</p>
          <div className="cta-actions">
            <Link className="btn-hero-primary" href="/signup">Start Free Trial →</Link>
            <Link className="btn-hero-ghost" href="/login">Log In</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <div className="footer-logo">Booked<em>Out</em></div>
              <div className="footer-tagline">Personal care management software built for the professionals who never settle for less than their best.</div>
            </div>
            <div>
              <div className="footer-col-title">Product</div>
              <a className="footer-link" href="#features">Features</a>
              <a className="footer-link" href="#pricing">Pricing</a>
              <Link className="footer-link" href="/login">Log In</Link>
              <Link className="footer-link" href="/signup">Sign Up</Link>
            </div>
            <div>
              <div className="footer-col-title">Company</div>
              <a className="footer-link" href="#about">About</a>
              <a className="footer-link" href="#faq">FAQ</a>
              <a className="footer-link" href="mailto:bookedoutservices@gmail.com">Contact</a>
            </div>
            <div>
              <div className="footer-col-title">Legal</div>
              <Link className="footer-link" href="/privacy">Privacy Policy</Link>
              <Link className="footer-link" href="/terms">Terms of Service</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 BookedOut. All rights reserved.</span>
            <span>Built for personal care professionals · <a href="mailto:bookedoutservices@gmail.com">bookedoutservices@gmail.com</a></span>
          </div>
        </div>
      </footer>
    </>
  )
}