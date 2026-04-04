export interface ISocialLink {
  name: string;
  url: string;
}

export interface IPaymentMethod {
  name: string;
}

export interface IAnalyticsStat {
  value: string;
  label: string;
}

export interface I18nText {
  en: string;
}

export interface ICoreValue {
  icon: string;
  title: I18nText;
  description: I18nText;
}

export interface IShippingPolicy {
  title: I18nText;
  freeShipping: I18nText;
  standardDelivery: I18nText;
  returnsPolicy: I18nText;
  returnsDays: number;
}

export interface IFooterLink {
  label: I18nText;
  url: string;
}

export interface IFooterLinkSection {
  section: I18nText;
  links: IFooterLink[];
}

export interface IHeroSection {
  heroSlogan: string;
  heroTitle: {
    line1: string;
    line2: string;
    line3: string;
  };
  heroDescription: string;
  heroImage: string;
  season: string;
}

export interface IAboutSection {
  aboutSlogan: string;
  aboutTitle: {
    line1: string;
    line2: string;
    line3: string;
  };
  aboutDescription: string;
  analytics: {
    stat1: IAnalyticsStat;
    stat2: IAnalyticsStat;
    stat3: IAnalyticsStat;
    stat4: IAnalyticsStat;
  };
}

export interface IFooterSection {
  footerText: string;
  socialLinks: ISocialLink[];
  contactEmail: string;
  contactPhone: string;
  paymentMethods: IPaymentMethod[];
  copyrightText: string;
}

export interface IShopPage {
  heading: I18nText;
  subtitle: I18nText;
}

export interface IContactPage {
  eyebrow: I18nText;
  heading: I18nText;
  subtitle: I18nText;
  emailHeading: I18nText;
  emailDesc: I18nText;
  phoneHeading: I18nText;
  phoneDesc: I18nText;
  visitHeading: I18nText;
  visitDesc: I18nText;
  socialEyebrow: I18nText;
  socialHeading: I18nText;
  faqText: I18nText;
  faqLinkText: I18nText;
}

export interface IFaqPage {
  heading: I18nText;
  subtitle: I18nText;
  footerText: I18nText;
  footerButtonText: I18nText;
}

export interface INotFoundSuggestion {
  label: I18nText;
  url: string;
}

export interface INotFoundPage {
  eyebrow: I18nText;
  heading: I18nText;
  subtitle: I18nText;
  suggestionsHeading: I18nText;
  suggestions: INotFoundSuggestion[];
}

export interface INavLink {
  label: I18nText;
  url: string;
  queryParams?: Record<string, any>;
}

export interface ISiteConfig {
  _id: string;
  announcement: string;
  siteName: string;

  heroSection: IHeroSection;

  aboutSection: IAboutSection;

  footerSection: IFooterSection;

  coreValues: ICoreValue[];
  shippingPolicy: IShippingPolicy;
  footerLinks: IFooterLinkSection[];
  shopPage: IShopPage;
  contactPage: IContactPage;
  faqPage: IFaqPage;
  notFoundPage: INotFoundPage;
  navLinks: INavLink[];
}

export interface ISiteConfigResponse {
  message: string;
  data: ISiteConfig;
}
