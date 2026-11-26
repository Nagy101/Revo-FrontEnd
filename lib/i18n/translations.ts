export const translations = {
  en: {
    // Nav
    nav_home: "Home",
    nav_about: "About",
    nav_services: "Services",
    nav_portfolio: "Portfolio",
    nav_contact: "Contact",
    nav_quote: "Let's Talk",
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
    contact_send: "Submit",
    contact_sending: "Submitting...",
    contact_success: "Thank you! Your inquiry has been sent to our team.",

    // Footer
    footer_tagline: "Directing stadium concerts, cinematic brand anthems, and high-impact visual narratives.",
    footer_rights: "All rights reserved.",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
