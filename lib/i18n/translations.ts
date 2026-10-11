export const translations = {
  en: {
    // Nav
    nav_home: "Home",
    nav_about: "About",
    nav_services: "Services",
    nav_portfolio: "Portfolio",
    nav_contact: "Contact",
    nav_quote: "Get Quote",
    nav_admin: "Admin",

    // Hero
    hero_title_1: "Bold Vision.",
    hero_title_2: "Stadium Scale.",
    hero_title_3: "Cinematic Impact.",
    hero_subtitle: "We create bold visual experiences, stadium concert productions, and cinematic commercial films that captivate audiences.",
    hero_cta_explore: "Explore Works",
    hero_cta_contact: "Let's Talk",

    // Portfolio
    portfolio_title: "Featured Works",
    portfolio_subtitle: "A look at the moments we've captured, the stories we've shaped, and the ideas we've brought to life.",
    portfolio_all: "All Works",
    portfolio_search_placeholder: "Search projects by title or client...",
    portfolio_reset: "Reset Filters",
    portfolio_no_results: "No projects found",
    portfolio_view_project: "View Project",

    // Services
    services_title: "Our Capabilities",
    services_subtitle: "Full-scale media production, concert broadcasting, and commercial filmmaking.",
    services_view_details: "Explore Service",
    services_learn_more: "Learn More",

    // About
    about_title: "Who We Are",
    about_subtitle: "REVO is an elite powerhouse of visual storytellers, concert directors, and creative cinematographers.",

    // Contact
    contact_title: "Let's Create Together",
    contact_subtitle: "Tell us about your upcoming project, concert, or brand campaign.",
    contact_name: "Full Name",
    contact_email: "Email Address",
    contact_phone: "Phone Number",
    contact_service: "Select Service",
    contact_message: "Project Details / Message",
    contact_send: "Send Message",
    contact_sending: "Sending...",
    contact_success: "Thank you! Your inquiry has been sent to our team.",

    // Footer
    footer_tagline: "Directing stadium concerts, cinematic brand anthems, and high-impact visual narratives.",
    footer_rights: "All rights reserved.",
  },
  ar: {
    // Nav
    nav_home: "الرئيسية",
    nav_about: "من نحن",
    nav_services: "خدماتنا",
    nav_portfolio: "أعمالنا",
    nav_contact: "تواصل معنا",
    nav_quote: "احجز مشروعك",
    nav_admin: "لوحة التحكم",

    // Hero
    hero_title_1: "رؤية جريئة.",
    hero_title_2: "إنتاج أرينا واستادات.",
    hero_title_3: "إخراج سينمائي مبهر.",
    hero_subtitle: "نصنع تجارب بصرية استثنائية، ونقود أضخم إنتاجات الحفلات والمهرجانات والأفلام الإعلانية التي تأسر الجمهور.",
    hero_cta_explore: "استكشف أعمالنا",
    hero_cta_contact: "تحدث معنا",

    // Portfolio
    portfolio_title: "أحدث الأعمال والمشاريع",
    portfolio_subtitle: "نظرة على اللحظات التي وثقناها، والقصص التي رويناها، والأفكار التي حولناها لواقع سينمائي.",
    portfolio_all: "جميع الأعمال",
    portfolio_search_placeholder: "ابحث في المشاريع باسم العمل أو العميل...",
    portfolio_reset: "إعادة ضبط الفلاتر",
    portfolio_no_results: "لم يتم العثور على أي أعمال مطابقة",
    portfolio_view_project: "عرض المشروع",

    // Services
    services_title: "خدماتنا وقدراتنا الإنتاجية",
    services_subtitle: "إنتاج متكامل وضخم للحفلات، والتغطيات الجوية والسينمائية، والإعلانات الكبرى.",
    services_view_details: "تفاصيل الخدمة",
    services_learn_more: "اكتشف المزيد",

    // About
    about_title: "من هي ريفو (REVO)",
    about_subtitle: "ريفو هي منظومة إبداعية متكاملة من المخرجين والمصورين وصناع السينما المتخصصين في أضخم الفعاليات.",

    // Contact
    contact_title: "فلنصنع العظمة معاً",
    contact_subtitle: "أخبرنا بتفاصيل حفلتك القادمة، أو حملتك الإعلانية، أو فكرتك السينمائية.",
    contact_name: "الاسم بالكامل",
    contact_email: "البريد الإلكتروني",
    contact_phone: "رقم الهاتف",
    contact_service: "الخدمة المطلوبة",
    contact_message: "تفاصيل المشروع أو الرسالة",
    contact_send: "إرسال الطلب",
    contact_sending: "جاري الإرسال...",
    contact_success: "شكراً لك! تم استلام رسالتك وسيتواصل معك فريق الإنتاج فوراً.",

    // Footer
    footer_tagline: "إخراج حفلات الاستادات، والأفلام الإعلانية الكبرى، وتجارب بصرية استثنائية.",
    footer_rights: "جميع الحقوق محفوظة.",
  }
} as const;

export type TranslationKey = keyof typeof translations.en;
