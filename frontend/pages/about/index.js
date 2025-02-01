import Head from "next/head";
import React from "react";

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us | Beat MasterMind</title>
        <meta
          name="description"
          content="Learn about Beat Mastermind, the ultimate resource for drummers seeking expert advice on electronic drums and accessories."
        />

        {/* Open Graph Metadata */}
        <meta property="og:title" content="About Us | Beat MasterMind" />
        <meta
          property="og:description"
          content="Learn about Beat Mastermind, the ultimate resource for drummers seeking expert advice on electronic drums and accessories."
        />
        <meta property="og:image" content="/img/about-og-image.jpg" />
        <meta property="og:type" content="website" />

        {/* Twitter Card Metadata */}
        <meta name="twitter:title" content="About Us | Beat MasterMind" />
        <meta
          name="twitter:description"
          content="Learn about Beat Mastermind, the ultimate resource for drummers seeking expert advice on electronic drums and accessories."
        />
        <meta name="twitter:image" content="/img/about-og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <main>
        <div className="slugpage">
          <div className="container">
            <div className="leftblog_data_markdown pb-5">
              <>
                <div className="w-100 blogcontent">
                  <h1>About us</h1>
                  <h2>Who we are and what we do</h2>
                  <p>
                    Welcome to <b>Beat Mastermind</b>, your go-to resource for everything related to electronic drums
                    and their essential accessories. Whether you're a seasoned drummer or just starting your rhythm
                    journey, we’re here to guide you with tips, reviews, and insights to elevate your drumming
                    experience.
                    <br />
                    <br />
                    The team behind Beat Mastermind brings together a unique blend of expertise and passion: <br />
                    <br />
                    <b>Johan</b> is a software developer and test engineer with deep roots in music. Having spent years
                    behind the drum kit, he combines his technical knowledge with hands-on experience to provide
                    reliable advice and product recommendations. <br />
                    <br />
                    <b>Pernilla</b> is a skilled writer and communication specialist who ensures our content is engaging
                    and easy to understand. Her love for storytelling brings clarity and connection to every article.{" "}
                    <br />
                    <br />
                    At Beat Mastermind, we believe electronic drums are more than just instruments They’re tools for
                    creativity, self-expression, and endless possibilities. Our mission is to share valuable knowledge
                    and empower drummers of all levels to make informed decisions, enhance their setups, and stay
                    inspired. <br />
                    <br />
                    Thank you for joining us on this journey. <br />
                    <br />
                    Let’s make every beat count!
                  </p>
                </div>
              </>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
