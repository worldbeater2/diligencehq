import type { Metadata } from 'next';
import { CONTACT_EMAIL } from '@/components/site/brand';
import { LegalDocument } from '@/components/site/LegalDocument';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'The terms that apply to your use of the Diligence AI Technologies website.',
};

const email = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

export default function TermsPage() {
  return (
    <LegalDocument
      label="Legal"
      title="Terms of Use"
      updated="11 October 2026"
      intro={
        <p>
          These terms apply to your use of this website, which is operated by Diligence AI Technologies Ltd, a private limited company registered in England and Wales (Company No. 17441022). By using the website, you agree to them.
        </p>
      }
      sections={[
        {
          title: 'Using this website',
          body: (
            <p>
              You may use this website for lawful purposes only. You must not misuse it, including by introducing malicious code, attempting to gain unauthorised access to it or to the systems that host it, or interfering with its operation.
            </p>
          ),
        },
        {
          title: 'Information on this website',
          body: (
            <p>
              The content of this website is general information about Diligence AI Technologies and its products. It is not legal or professional advice and should not be relied on as such. We may change the content at any time. Our products, including DARA, are provided under their own terms.
            </p>
          ),
        },
        {
          title: 'Intellectual property',
          body: (
            <p>
              The content, design, names and marks on this website, including Diligence and DARA, belong to Diligence AI Technologies Ltd or its licensors. You may view and print pages for your own reference. Any other use requires our written permission.
            </p>
          ),
        },
        {
          title: 'Links to other websites',
          body: <p>Where this website links to other websites, those links are provided for convenience. We are not responsible for the content or practices of websites we do not operate.</p>,
        },
        {
          title: 'Our liability',
          body: (
            <p>
              This website is provided free of charge and on an &ldquo;as is&rdquo; basis. To the extent permitted by law, we are not liable for any loss arising from your use of, or inability to use, the website or its content. Nothing in these terms limits or excludes liability that cannot be limited or excluded by law, including liability for death or personal injury caused by negligence, or for fraud.
            </p>
          ),
        },
        {
          title: 'Changes to these terms',
          body: <p>We may update these terms from time to time. The date at the top shows when they were last changed.</p>,
        },
        {
          title: 'Governing law',
          body: <p>These terms are governed by the law of England and Wales, and the courts of England and Wales have exclusive jurisdiction.</p>,
        },
        {
          title: 'Contact',
          body: <p>For any question about these terms, write to {email}.</p>,
        },
      ]}
    />
  );
}
