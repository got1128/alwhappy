(() => {
 const toggle=document.querySelector('.mobile-toggle'),menu=document.querySelector('.mobile-nav');
 if(toggle&&menu){toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));menu.dataset.open=String(open)});}
 const selectorChoices=document.querySelector('.selector-choices');
 if(selectorChoices&&!selectorChoices.querySelector('[data-journey="cabin-crew"]')){const cabinButton=document.createElement('button');cabinButton.type='button';cabinButton.dataset.journey='cabin-crew';cabinButton.setAttribute('aria-pressed','false');cabinButton.textContent='想成為空服人員';const aspiringButton=selectorChoices.querySelector('[data-journey="aspiring"]');if(aspiringButton)aspiringButton.insertAdjacentElement('afterend',cabinButton);else selectorChoices.append(cabinButton);}
 const selectorTitle=document.getElementById('selector-title');if(selectorTitle)selectorTitle.textContent='四種身分，一個清楚的入口。';
 const choices=document.querySelectorAll('[data-journey]');if(!choices.length)return;
 const journeys={pilot:{title:'下一份工作，先看清條件與取捨。',text:'探索機型、飛行時數、執照與基地要求，釐清下一步適合的機會。',href:'for-pilots/index.html',cta:'進入機師專區'},aspiring:{title:'想成為機師，從路徑開始。',text:'先掌握體檢、英文、訓練與取得執照後的職涯銜接。',href:'become-a-pilot/index.html',cta:'探索成為機師'},'cabin-crew':{title:'想成為空服人員，從準備開始。',text:'從英文、履歷、形象到面試準備，讓每一步都有清楚方向。',href:'cabin-crew/index.html',cta:'探索空服人員專區'},airline:{title:'尋找符合條件、也願意到位的人。',text:'從機型、資格、基地與時程定義需求，讓人才搜尋更聚焦。',href:'for-airlines/index.html',cta:'進入航空公司專區'}};
 const title=document.getElementById('journey-title'),text=document.getElementById('journey-text'),link=document.getElementById('journey-link');
 choices.forEach(button=>button.addEventListener('click',()=>{const choice=button.dataset.journey,entry=journeys[choice];choices.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));title.textContent=entry.title;text.textContent=entry.text;link.href=entry.href;link.innerHTML=entry.cta+' <span aria-hidden="true">↗</span>'}));
})();

(() => {
 const header=document.querySelector('.header-row');
 const menuButton=document.querySelector('.mobile-toggle');
 if(!header||!menuButton||!document.querySelector('.home-hero')) return;
 const switcher=document.createElement('div');
 switcher.className='language-switch';
 switcher.innerHTML='<button type="button" class="language-button" aria-label="語言選擇" aria-haspopup="true" aria-expanded="false">語言 <span aria-hidden="true">⌄</span></button><div class="language-menu" role="menu" aria-label="選擇語言"><button type="button" role="menuitem" aria-pressed="true">繁中</button><button type="button" role="menuitem" aria-pressed="false">簡中</button><button type="button" role="menuitem" aria-pressed="false">English</button></div>';
 header.insertBefore(switcher,menuButton);
 const languageButton=switcher.querySelector('.language-button'),languageMenu=switcher.querySelector('.language-menu');
 languageButton.addEventListener('click',()=>{const open=switcher.classList.toggle('is-open');languageButton.setAttribute('aria-expanded',String(open));});
 languageMenu.querySelectorAll('button').forEach(option=>option.addEventListener('click',()=>{languageMenu.querySelectorAll('button').forEach(item=>item.setAttribute('aria-pressed',String(item===option)));switcher.classList.remove('is-open');languageButton.setAttribute('aria-expanded','false');}));
 document.addEventListener('click',event=>{if(!switcher.contains(event.target)){switcher.classList.remove('is-open');languageButton.setAttribute('aria-expanded','false');}});
})();

(() => {
 const heroTitle=document.querySelector('.home-hero .hero-copy h1');
 if(!heroTitle) return;
 heroTitle.innerHTML='我的飛行經驗，<br><em>值得一個更精準的選擇。</em>';
 const heroSubtitle=document.querySelector('.home-hero .hero-copy p');
 if(heroSubtitle) heroSubtitle.textContent='Always Happy 專注服務現役機師，以及有志投入飛行職涯者，以專業媒合與清楚方向，陪伴每一段職涯選擇。';
})();

(() => {
 if(!location.pathname.replace(/\\/g,'/').includes('/for-pilots/')) return;
 const pilotEyebrow=document.querySelector('.subhero .eyebrow');
 if(pilotEyebrow) pilotEyebrow.textContent='PROFESSIONAL PILOTS / 現役機師';
 const pilotTitle=document.querySelector('.subhero h1');
 if(pilotTitle) pilotTitle.textContent='我的飛行經驗，值得一個更精準的選擇。';
 const pilotSubtitle=document.querySelector('.subhero p');
 if(pilotSubtitle) pilotSubtitle.textContent='與 Always Happy 一起，成就更好的飛行選擇。';
 const pilotGrid=document.querySelector('.submain .content-grid');
 document.querySelectorAll('.submain .content-grid .content-box').forEach((card,index)=>{
   if(index>0) card.remove();
 });
 const pilotSectionTitle=document.querySelector('.submain h2');
 if(pilotSectionTitle) pilotSectionTitle.textContent='從你的飛行經驗開始';
 const pilotCard=pilotGrid?.querySelector('.content-box');
 if(pilotGrid&&pilotCard){
   pilotGrid.style.gridTemplateColumns='minmax(0, 1fr)';
   pilotCard.classList.add('pilot-resume-card');
   pilotCard.innerHTML='<h3>飛行履歷</h3><p>先整理能讓 Always Happy 了解你的核心飛行資料。</p><div class="pilot-summary"><button type="button" data-profile-target="licence">執照</button><button type="button" data-profile-target="aircraft-types">曾飛行機型</button><button type="button" data-profile-target="total-hours">總飛行時數</button><button type="button" data-profile-target="pic-hours">PIC 時數</button></div>';
   const aircraftSummary=pilotCard.querySelector('.pilot-summary button:nth-child(2)');
   if(aircraftSummary) aircraftSummary.textContent='曾飛行機型';
   const note=document.querySelector('.submain .sub-note');
   if(note) note.remove();
   if(!document.querySelector('.pilot-steps')) pilotGrid.insertAdjacentHTML('afterend','<section class="pilot-steps" aria-labelledby="pilot-steps-title"><span class="eyebrow">HOW ALWAYS HAPPY HELPS</span><h3 id="pilot-steps-title">Always Happy 如何協助你</h3><div class="pilot-steps-grid"><article><span>01</span><strong>留下資料</strong><p>從飛行履歷開始，整理你的核心經驗。</p></article><article><span>02</span><strong>專人聯繫與資格審核</strong><p>由 Always Happy 審核完畢後，主動與你聯繫。</p></article></div></section>');
   if(!document.getElementById('pilot-layout-style')){
     const layoutStyle=document.createElement('style');
     layoutStyle.id='pilot-layout-style';
     layoutStyle.textContent='.pilot-resume-card{max-width:720px;padding:34px;background:#f5f7f7}.pilot-resume-card h3{font-size:28px;margin:14px 0 8px}.pilot-resume-card p{max-width:500px}.pilot-summary{display:flex;flex-wrap:wrap;gap:9px;margin-top:23px}.pilot-summary span{border:1px solid #9eb8c7;padding:7px 11px;border-radius:3px;color:#395f74;font-size:13px;font-weight:700}.pilot-steps{margin:64px 0 42px;padding:35px 0 0;border-top:1px solid #d7e0e4}.pilot-steps h3{font-size:29px;margin:9px 0 24px}.pilot-steps-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.pilot-steps-grid article{border-top:2px solid #176c90;padding:16px 14px 0 0}.pilot-steps-grid article>span{color:#a45c32;font-size:12px;font-weight:800;letter-spacing:.14em}.pilot-steps-grid strong{display:block;margin:10px 0 5px;font-size:17px}.pilot-steps-grid p{font-size:14px;margin:0;line-height:1.7}@media(max-width:720px){.pilot-resume-card{padding:25px}.pilot-steps{margin-top:45px}.pilot-steps-grid{grid-template-columns:1fr;gap:18px}}';
     document.head.append(layoutStyle);
   }
 }
 const pilotStepsGrid=document.querySelector('.pilot-steps-grid');
 if(pilotStepsGrid) pilotStepsGrid.style.gridTemplateColumns='repeat(2,minmax(0,1fr))';
  document.querySelectorAll('[data-profile-target]').forEach(button=>{
   button.addEventListener('click',()=>{
     const field=document.querySelector(`[name="${button.dataset.profileTarget}"]`);
     if(!field) return;
     field.closest('fieldset')?.scrollIntoView({behavior:'smooth',block:'center'});
     setTimeout(()=>field.focus({preventScroll:true}),500);
   });
 });
 if(!document.getElementById('pilot-summary-style')){
   const summaryStyle=document.createElement('style');
   summaryStyle.id='pilot-summary-style';
   summaryStyle.textContent='.pilot-summary button{border:1px solid #9eb8c7;border-radius:3px;background:white;padding:8px 12px;color:#395f74;font:700 13px/1.35 "DM Sans","Noto Sans TC",sans-serif;transition:background .2s,color .2s,transform .2s}.pilot-summary button:hover{background:#176c90;color:#fff;transform:translateY(-2px)}';
   document.head.append(summaryStyle);
 }
 const heroMedia=document.querySelector('.subhero .subhero-media');
 if(heroMedia&&!heroMedia.querySelector('.hero-choice')){
   heroMedia.insertAdjacentHTML('beforeend','<span class="hero-choice" aria-hidden="true">Choice</span>');
   const choiceStyle=document.createElement('style');
   choiceStyle.textContent='.hero-choice{position:absolute;top:8%;right:6%;z-index:2;color:#fff;font:italic 500 clamp(42px,4.8vw,68px)/.88 "Segoe Print","Bradley Hand",cursive;letter-spacing:.03em;text-shadow:0 3px 16px #071724c7;transform:rotate(-5deg);animation:choice-drift 4.8s ease-in-out infinite}@keyframes choice-drift{50%{transform:translate(6px,-5px) rotate(-3deg)}}@media(prefers-reduced-motion:reduce){.hero-choice{animation:none}}@media(max-width:720px){.hero-choice{top:8%;right:6%;font-size:40px}}';
   document.head.append(choiceStyle);
 }
})();

(() => {
 if(!location.pathname.replace(/\\/g,'/').includes('/pilot-jobs/')) return;
 const jobsHeroImage=document.querySelector('.subhero .subhero-media img');
 const jobsSubtitle=document.querySelector('.subhero .subhero-copy p');
 if(jobsSubtitle) jobsSubtitle.textContent='Always Happy，為你篩選更合適的飛行選擇。';
 if(!jobsHeroImage) return;
 jobsHeroImage.src='../assets/pilot-jobs-captain-cap.png';
 jobsHeroImage.alt='座艙內的機長帽與跑道晨光';
 jobsHeroImage.style.objectPosition='right center';
})();

(() => {
 if(!location.pathname.replace(/\\/g,'/').includes('/become-a-pilot/')) return;
 const aspiringTitle=document.querySelector('.subhero h1');
 if(aspiringTitle) aspiringTitle.textContent='想成為機師的路徑';
 const aspiringSubtitle=document.querySelector('.subhero p');
 if(aspiringSubtitle) aspiringSubtitle.textContent='Always Happy，為您提供精準導航。';
})();
// AIAC 2026 entry requirements shown in the local "Become a Pilot" preview.
(() => {
  if (!location.pathname.includes('/become-a-pilot/')) return;
  if (document.querySelector('.aiac-eligibility')) return;

  const main = document.querySelector('.submain .container') || document.querySelector('main .container') || document.querySelector('main');
  if (!main) return;

  const section = document.createElement('section');
  section.className = 'aiac-eligibility';
  section.setAttribute('aria-labelledby', 'aiac-eligibility-title');
  section.innerHTML = `
    <div class="aiac-eligibility__intro">
      <h2 id="aiac-eligibility-title">確認條件</h2>
      <p>以下為申請飛行訓練與規劃航空職涯前，建議先確認的基本條件。</p>
    </div>
    <div class="aiac-eligibility__grid">
      <article><span class="aiac-eligibility__number">01</span><h3>年滿 18 歲</h3><p>若未來目標為台灣航空公司機師，須完成大學學歷。</p></article>
      <article><span class="aiac-eligibility__number">02</span><h3>高中畢業或同等學歷</h3><p>具備高中畢業證書，或同等學歷資格。若未來目標為台灣航空公司，須完成大學學歷。</p></article>
      <article><span class="aiac-eligibility__number">03</span><h3>英文能力</h3><p>IELTS 6.0（單項不低於 5.5），或具備同等 TOEFL／TOEIC 成績。</p></article>
      <article><span class="aiac-eligibility__number">04</span><h3>航空體檢準備</h3><p>建議在居住地先完成或安排 Class I 體檢評估。</p></article>
    </div>
    <p class="aiac-eligibility__note">附註：大學學歷為未來申請台灣航空公司職缺的重要條件；海外航空公司的學歷要求可能不同。各訓練單位與航空公司的實際要求，請以最新公告為準。</p>
  `;

  const insertBefore = main.querySelector('.next-links, .sub-note, .contact-panel');
  if (insertBefore) main.insertBefore(section, insertBefore);
  else main.appendChild(section);

  const style = document.createElement('style');
  style.textContent = `
    .aiac-eligibility{margin:72px 0 56px;padding:44px clamp(22px,4.5vw,58px);border-radius:26px;background:#f6f8fb;border:1px solid #dce4ed;color:#172330}
    .aiac-eligibility__intro{max-width:700px;margin-bottom:30px}.aiac-eligibility .eyebrow{display:block;margin-bottom:10px;color:#4c85b8;font-size:.75rem;font-weight:800;letter-spacing:.15em}.aiac-eligibility h2{margin:0 0 12px;font-size:clamp(1.65rem,3vw,2.45rem);line-height:1.2}.aiac-eligibility__intro p{margin:0;color:#5d6b79;line-height:1.7}
    .aiac-eligibility__grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.aiac-eligibility__grid article{min-height:180px;padding:22px;border-radius:18px;background:#fff;border:1px solid #e4eaf0}.aiac-eligibility__number{color:#4c85b8;font-size:.75rem;font-weight:800;letter-spacing:.11em}.aiac-eligibility h3{margin:18px 0 9px;font-size:1.05rem}.aiac-eligibility__grid p{margin:0;color:#5d6b79;font-size:.92rem;line-height:1.65}.aiac-eligibility__note{margin:22px 0 0;color:#73808d;font-size:.8rem;line-height:1.6}
    @media(max-width:800px){.aiac-eligibility{margin:50px 0 38px;padding:30px 22px}.aiac-eligibility__grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:480px){.aiac-eligibility__grid{grid-template-columns:1fr}.aiac-eligibility__grid article{min-height:0}}
  `;
  document.head.appendChild(style);
})();
// Preview wording for the prospective-pilot journey.
(() => {
  if (!location.pathname.includes('/become-a-pilot/')) return;
  const updateJourney = () => {
    const findText = (text) => [...document.querySelectorAll('h2, h3, h4, p, span')].find((el) => el.textContent.trim() === text);
    const training = findText('比較訓練');
    const planning = findText('規劃銜接');
    if (training) {
      training.textContent = '客製化航校安排及未來航空公司規劃';
      const card = training.closest('article, .card, .step, li, div');
      const description = card && [...card.querySelectorAll('p')].find((p) => p !== training);
      if (description) description.textContent = '依你的條件與目標，安排適合的航校選擇。';
    }
    if (planning) {
      const card = planning.closest('article, .card, .step, li');
      if (card) card.remove();
      else planning.remove();
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', updateJourney, { once: true });
  else updateJourney();
})();
// Place customised school planning directly after the eligibility block in the preview.
(() => {
  if (!location.pathname.includes('/become-a-pilot/')) return;
  const placePlanning = () => {
    const eligibility = document.querySelector('.aiac-eligibility');
    if (!eligibility || document.querySelector('.custom-school-planning')) return;
    const sourceHeading = [...document.querySelectorAll('h2, h3, h4')].find((el) => ['比較訓練', '客製化航校安排及未來航空公司規劃'].includes(el.textContent.trim()));
    if (sourceHeading) {
      const sourceCard = sourceHeading.closest('article, .card, .step, .journey-card, li') || sourceHeading.parentElement;
      if (sourceCard) sourceCard.style.display = 'none';
    }
    const section = document.createElement('section');
    section.className = 'custom-school-planning';
    section.innerHTML = `<span class="custom-school-planning__number">02</span><h2>客製化航校安排及未來航空公司規劃</h2><p>依你的條件與目標，安排適合的航校選擇，並同步規劃未來航空公司的發展方向。</p>`;
    eligibility.insertAdjacentElement('afterend', section);
    const style = document.createElement('style');
    style.textContent = `.custom-school-planning{margin:-30px 0 56px;padding:34px clamp(22px,4.5vw,58px);border-radius:22px;background:#fff;border:1px solid #dce4ed;color:#172330}.custom-school-planning__number{display:block;margin-bottom:12px;color:#4c85b8;font-size:.75rem;font-weight:800;letter-spacing:.15em}.custom-school-planning h2{margin:0 0 12px;font-size:clamp(1.35rem,2.5vw,1.9rem);line-height:1.28}.custom-school-planning p{max-width:690px;margin:0;color:#5d6b79;line-height:1.75}@media(max-width:800px){.custom-school-planning{margin:-22px 0 38px;padding:28px 22px}}`;
    document.head.appendChild(style);
  };
  const schedule = () => setTimeout(placePlanning, 50);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, { once: true });
  else schedule();
})();
// Group pilot jobs beneath the airline partnership navigation item.
(() => {
  const findLink = (nav, part) => [...nav.querySelectorAll('a')].find((link) => (link.getAttribute('href') || '').includes(part));
  const desktop = document.querySelector('.desktop-nav');
  if (desktop) {
    const jobs = findLink(desktop, 'pilot-jobs/');
    const airlines = findLink(desktop, 'for-airlines/');
    if (jobs && airlines && !desktop.querySelector('.nav-group--airlines')) {
      const group = document.createElement('div');
      group.className = 'nav-group nav-group--airlines';
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'nav-group__toggle';
      toggle.setAttribute('aria-label', '展開航空公司合作選單');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = '▾';
      const submenu = document.createElement('div');
      submenu.className = 'nav-submenu';
      submenu.setAttribute('aria-label', '航空公司合作子選單');
      airlines.replaceWith(group);
      group.append(airlines, toggle, submenu);
      submenu.append(jobs);
      toggle.addEventListener('click', () => {
        const isOpen = group.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });
    }
  }

  const mobile = document.querySelector('.mobile-nav');
  if (mobile) {
    const jobs = findLink(mobile, 'pilot-jobs/');
    const airlines = findLink(mobile, 'for-airlines/');
    if (jobs && airlines && !mobile.querySelector('.mobile-nav__sub')) {
      jobs.classList.add('mobile-nav__sub');
      jobs.textContent = '↳ 機師職缺';
      airlines.insertAdjacentElement('afterend', jobs);
    }
  }
})();
// Keep pilot jobs out of global navigation and surface it within airline collaboration instead.
(() => {
  document.querySelectorAll('.desktop-nav .nav-group--airlines').forEach((group) => {
    const airlineLink = [...group.querySelectorAll('a')].find((link) => (link.getAttribute('href') || '').includes('for-airlines/'));
    if (airlineLink) group.replaceWith(airlineLink);
  });
  document.querySelectorAll('.desktop-nav a, .mobile-nav a').forEach((link) => {
    if ((link.getAttribute('href') || '').includes('pilot-jobs/')) link.remove();
  });

})();
// Display the compact job-information table within airline collaboration.
(() => {
  if (!location.pathname.replace(/\\/g, '/').includes('/for-airlines/')) return;
  const main = document.querySelector('.submain .container');
  if (!main || main.querySelector('.airline-job-entry')) return;
  const requirementGrid = main.querySelector('.content-grid');
  const requirementNote = main.querySelector('.sub-note');
  const sectionTitle = main.querySelector('h2');
  if (requirementGrid) requirementGrid.remove();
  if (requirementNote) requirementNote.remove();

  const entry = document.createElement('section');
  entry.className = 'airline-job-entry';
  entry.innerHTML = `<span class="eyebrow">JOB UPDATES</span><h3>職缺訊息</h3><p>已核實並獲授權公開的職缺訊息，將在這裡集中呈現。</p><div class="job-info-fields" aria-label="職缺資訊欄位"><span>職位</span><span>機型</span><span>聯絡人</span></div>`;
  if (sectionTitle) sectionTitle.insertAdjacentElement('afterend', entry);
  else main.prepend(entry);
})();
// Add a global navigation entry for the cabin-crew pathway.
(() => {
  const addCabinCrewLink = (nav) => {
    if (!nav || nav.querySelector('[data-cabin-crew-nav]')) return;
    const aspiring = [...nav.querySelectorAll('a')].find((link) => (link.getAttribute('href') || '').includes('become-a-pilot/'));
    const brandHref = document.querySelector('.brand')?.getAttribute('href') || 'index.html';
    const cabinCrew = document.createElement('a');
    cabinCrew.href = `${brandHref.replace(/index\.html$/, '')}cabin-crew/index.html`;
    cabinCrew.textContent = '空服員';
    cabinCrew.dataset.cabinCrewNav = 'true';
    if (aspiring) aspiring.insertAdjacentElement('afterend', cabinCrew);
    else nav.append(cabinCrew);
  };
  addCabinCrewLink(document.querySelector('.desktop-nav'));
  addCabinCrewLink(document.querySelector('.mobile-nav'));
})();
// Cabin-crew application is a local preview only until a secure data workflow is connected.
(() => {
  if (!location.pathname.replace(/\\/g, '/').includes('/cabin-crew/')) return;
  const form=document.querySelector('[data-cabin-crew-form]');
  const status=form?.querySelector('.profile-status');
  if(!form||!status)return;
  form.addEventListener('submit',event=>{event.preventDefault();status.textContent='預覽模式：資料尚未送出或儲存。';});
})();
