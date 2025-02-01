import Head from "next/head";
import Link from "next/link";

export default function DisclaimerPage() {
  return (
    <>
      <Head>
        <title>Disclaimer | Beat MasterMind</title>
        <meta name="description" content="Learn more about Beat MasterMind and our mission." />

        {/* Open Graph Metadata */}
        <meta property="og:title" content="Disclaimer | Beat MasterMind" />
        <meta property="og:description" content="Learn more about Beat MasterMind and our mission." />
        <meta property="og:image" content="/img/disclaimer-og-image.jpg" />
        <meta property="og:type" content="website" />

        {/* Twitter Card Metadata */}
        <meta name="twitter:title" content="Disclaimer | Beat MasterMind" />
        <meta name="twitter:description" content="Learn more about Beat MasterMind and our mission." />
        <meta name="twitter:image" content="/img/disclaimer-og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <main>
        <div className="slugpage">
          <div className="container">
            <div className="leftblog_data_markdown pb-5">
              <>
                <div className="w-100 blogcontent">
                  <h1>Disclaimer</h1>
                  <h2>How do we make money from our blog?</h2>
                  Some links on our blog are "affiliate links," which contain a special tracking code. <br />
                  This means if you click on an affiliate link and buy something, we get a commission at no extra cost
                  to you. The price is the same whether you use an affiliate link or not.
                  <h2>What are affiliate links?</h2>
                  When you click an affiliate link on Beat MasterMind.com and buy something, you buy it directly from
                  the seller (not from Beat MasterMind). We may get a small commission from Amazon or other companies
                  for sending customers to their websites. The price is the same for you whether you use an affiliate
                  link or not.
                  <br />
                  Clicking an affiliate link doesn’t change the price or anything else for you.{" "}
                  <h3>Amazon affiliate links</h3>
                  Beat MasterMind.com is part of the Amazon Services LLC Associates Program, an affiliate advertising
                  program designed to let sites earn fees by linking to Amazon.com and related sites.
                  <br />
                  If you click a product affiliate link and buy the product, we get a percentage of the sale or some
                  other type of compensation. Again, using these affiliate links doesn’t change the price for you. You
                  won’t pay more by clicking through the link. These links are not "pay per click."{" "}
                  <h2>Why trust our product recommendations?</h2>
                  By telling you about our use of affiliate links, we want to show our commitment to being open and
                  honest about the products we review.
                  <br />
                  <h2>FTC disclosure compliance rules</h2>
                  In 2015, the Federal Trade Commission set rules for Disclosure Compliance.
                  <br />
                  These rules make sure readers know if a blogger or publisher is sponsored or partnered with a company.
                  Readers need to know if the publisher makes money from sharing a link or product. Following FTC
                  guidelines, please assume this about links and posts on this site: Some or all links on Beat
                  MasterMind.com are affiliate links, which means we earn a small commission from sales.
                  <br />
                  <br />
                  <h21>AI-images</h21>
                  <h3>Usage of images.</h3>
                  Some of the images featured on this blog may have been generated using artificial intelligence (AI)
                  tools. These AI-generated images are used to enhance the content and provide visual representation.
                  While efforts are made to ensure that these images are accurate and appropriate, they may not always
                  perfectly reflect reality or the subjects being depicted.
                  <br />
                  <br />
                  Please note that AI-generated images are created based on algorithms and may not be entirely original
                  or unique. They should not be interpreted as actual photographs or artistic works created by human
                  artists unless explicitly stated otherwise.
                  <br />
                  <br />
                  If you have any questions or concerns about the use of AI-generated images on this blog, feel free to{" "}
                  <Link href="/contact">Contact</Link> us.
                  <br />
                  <br />
                </div>
              </>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
