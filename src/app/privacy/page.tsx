import type { Metadata } from 'next';
import { CONTACT_EMAIL } from '@/components/site/brand';
import { LegalDocument } from '@/components/site/LegalDocument';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Diligence AI Technologies Ltd handles personal data on this website.',
};

const email = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

export default function PrivacyPage() {
  return (
    <LegalDocument
      label="Legal"
      title="Privacy Policy"
      updated="11 October 2026"
      intro={<p>This policy explains how Diligence AI Technologies Ltd uses personal data when you visit this website or contact us.</p>}
      sections={[
        {
          title: 'Who we are',
          body: (
            <p>
              Diligence AI Technologies Ltd is a private limited company registered in England and Wales (Company No. 17441022), with its registered office at 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom. We are the controller of the personal data described in this policy. You can reach us at {email}.
            </p>
          ),
        },
        {
          title: 'What this policy covers',
          body: (
            <p>
              This policy covers this website. Our products, including DARA, have their own privacy information, available at{' '}
              <a href="https://getdaralegal.com/privacy" target="_blank" rel="noopener noreferrer">getdaralegal.com/privacy</a>.
            </p>
          ),
        },
        {
          title: 'Information we collect',
          body: (
            <ul>
              <li>Information you send us, such as your name, email address and the content of your message when you write to us.</li>
              <li>Technical information recorded when you visit, such as your IP address, browser type, the pages you request and the date and time of your visit, which our hosting provider uses to deliver and secure the website.</li>
              <li>This website does not use cookies for analytics or advertising.</li>
            </ul>
          ),
        },
        {
          title: 'How we use it',
          body: (
            <ul>
              <li>To respond to your enquiry and to keep a record of our correspondence.</li>
              <li>To operate, maintain and protect this website.</li>
              <li>To comply with our legal obligations.</li>
            </ul>
          ),
        },
        {
          title: 'Our lawful bases',
          body: (
            <p>
              Under UK data protection law, we rely on our legitimate interests in responding to enquiries and running a secure website, on taking steps at your request before entering into a contract, and on compliance with legal obligations where they apply.
            </p>
          ),
        },
        {
          title: 'Sharing',
          body: (
            <p>
              We share personal data only with service providers who help us run this website and our email, and who act on our instructions; with professional advisers where necessary; and with authorities where the law requires it. We do not sell personal data.
            </p>
          ),
        },
        {
          title: 'International transfers',
          body: <p>Where a service provider processes personal data outside the United Kingdom, we put appropriate safeguards in place as required by UK data protection law.</p>,
        },
        {
          title: 'Retention',
          body: <p>We keep enquiries for as long as needed to respond and to maintain proper business records. Technical logs are kept for limited periods for security and operational purposes.</p>,
        },
        {
          title: 'Your rights',
          body: (
            <p>
              You may have the right to access, correct or delete your personal data, to restrict or object to how we use it, and to data portability. To exercise these rights, contact {email}. You may also complain to the Information Commissioner&apos;s Office at{' '}
              <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">ico.org.uk</a>.
            </p>
          ),
        },
        {
          title: 'Changes to this policy',
          body: <p>We may update this policy from time to time. The date at the top shows when it was last changed.</p>,
        },
        {
          title: 'Contact',
          body: <p>For any question about this policy or your personal data, write to {email}.</p>,
        },
      ]}
    />
  );
}
