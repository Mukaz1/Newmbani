export interface Topic {
  _id?: string;
  title?: string;
  slug?: string;
}

export interface SubTopic {
  _id?: string;
  title?: string;
  slug?: string;
}

export interface FAQ {
  _id?: string;
  question?: string;
  answer?: string;
}

export interface HelpCenterSettings {
  appName?: string;
}
