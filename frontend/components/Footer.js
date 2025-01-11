import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="footer">
      <div className="container flex flex-wrap">
        <div className="footer_logo">
          <Link href="/">
            <Image src="/img/Logo/BeatMaster_3.PNG" alt="logo" width={100} height={100} />
          </Link>
          <h4>&copy; 2024 All Rights Reserved.</h4>
          <h3>
            Coded By <span>@JRcoder</span>
          </h3>
        </div>
        <div className="q_links">
          <h3>Legal Stuff Links</h3>
          <ul>
            <li>
              <Link href="/disclaimer">Disclaimer</Link>
            </li>
            <li>
              <Link href="/">Cookie Policy</Link>
            </li>
            <li>
              <Link href="/">Terms Of Use</Link>
            </li>
          </ul>
        </div>
        <div className="q_links affiliate_disclaimer">
          <h3>Disclaimer</h3>
          <p>
            As an Amazon Associate, we earn from qualifying purchases. <br />
            This means that if you click on a link to an Amazon product on this site and make a purchase, we may receive
            a commission at no additional cost to you. This helps support the site and allows us to continue providing
            useful content. <br />
            <br />
            Thank you for your support!
          </p>
        </div>
      </div>
    </div>
  );
}

{
  /* <div className="q_links">
            <h3>Social Media</h3>
            <ul>
              <li>
                <Link href="/">Instagram</Link>
              </li>
              <li>
                <Link href="/">Pinterest</Link>
              </li>
              <li>
                <Link href="/">Facebook</Link>
              </li>
            </ul>
          </div> */
}
