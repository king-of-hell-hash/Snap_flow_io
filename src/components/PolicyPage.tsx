import React from 'react';
import { TabType } from '../types';

interface PolicyPageProps {
  pageType: Extract<TabType, 'about' | 'privacy' | 'terms' | 'disclaimer' | 'contact'>;
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ pageType }) => {
  const contentMap = {
    about: {
      title: 'About Us',
      content: `Welcome to SnapFlow.io! We are dedicated to providing the highest quality, completely free utility tools for creators, students, and professionals around the world.
      
Our mission is to simplify everyday tasks—like saving social media inspiration offline, compressing images, and editing documents—without the heavy bloat, subscription fees, or invasive tracking found in modern software. 

All of our document processing (like our PDF to Word converter) is done 100% locally in your browser. We never upload your sensitive documents to remote servers.`
    },
    privacy: {
      title: 'Privacy Policy',
      content: `At SnapFlow.io, your privacy is our top priority.

**1. Information We Collect:**
We do not collect any personal data or require accounts to use our core utilities. If you use our contact forms, we only retain the information necessary to respond.

**2. Third-Party Services (AdSense):**
To keep our tools free, we use Google AdSense. Third party vendors, including Google, use cookies to serve ads based on a user's prior visits to our website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.

**3. Data Processing:**
Our PDF tools and Image Conversion tools operate strictly on the client-side (in your browser) or using transient serverless architecture where files are immediately discarded from memory after processing. We do not store your files.`
    },
    terms: {
      title: 'Terms & Conditions',
      content: `By accessing and using SnapFlow.io, you agree to these Terms and Conditions.

**1. Acceptable Use:**
You agree to use our tools only for lawful purposes. You must not use our Social Media Downloader to download or distribute copyrighted material without explicit permission from the rights holder. Our downloader is intended for archiving your own content or public domain content for personal offline use.

**2. Intellectual Property:**
SnapFlow.io and its original content, features, and functionality are owned by our development team and are protected by international copyright, trademark, and other intellectual property laws.

**3. Disclaimer of Warranties:**
The tools are provided "as is" without warranty of any kind. We do not guarantee continuous availability or flawless execution across all possible devices and browsers.`
    },
    disclaimer: {
      title: 'Disclaimer',
      content: `**Content Liability:**
The Social Media Downloader tool relies on third-party APIs and public metadata to resolve links. SnapFlow.io does not host any media files. We act only as a conduit for the user to access files hosted on external servers (like TikTok, Instagram, or YouTube).

**Copyright Notice:**
We strongly condemn piracy and copyright infringement. Users bear total responsibility for their actions. If you are a copyright owner and believe a user is misusing our tool, please understand we do not host the content and cannot remove it from the origin server.`
    },
    contact: {
      title: 'Contact Us',
      content: `We'd love to hear from you! Whether you have a feature request, a bug report, or a business inquiry, please reach out.

**Email:**
You can reach our development team at: adil3jamil3@gmail.com

**Advertising:**
If you wish to advertise directly on SnapFlow.io or partner with us for sponsored utility integrations, please contact us at the email above with the subject "Partnership Inquiry".`
    }
  };

  const { title, content } = contentMap[pageType];

  return (
    <div className="w-full max-w-3xl mx-auto py-12 px-6">
      <article className="prose dark:prose-invert max-w-none text-left">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
          {title}
        </h1>
        <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
          {content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('**') && paragraph.includes('**\n')) {
               const [heading, ...rest] = paragraph.split('\n');
               return (
                 <div key={idx} className="mb-4">
                   <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-6 mb-2">
                     {heading.replace(/\*\*/g, '')}
                   </h3>
                   <p>{rest.join('\n')}</p>
                 </div>
               )
            }
            return <p key={idx}>{paragraph}</p>;
          })}
        </div>
      </article>
    </div>
  );
};
