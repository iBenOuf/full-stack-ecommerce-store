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

export interface ISiteConfig {
  _id: string;
  announcement: string;
  siteName: string;

  heroSection: IHeroSection;

  aboutSection: IAboutSection;

  footerSection: IFooterSection;
}

export interface ISiteConfigResponse {
  message: string;
  data: ISiteConfig;
}
