"use client";
import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaPinterestP } from "react-icons/fa";

export default function Footer() {
  return (
    <div className="footer">
      <div className="container flex flex-wrap justify-between items-start">
        <div className="footer_logo flex flex-col justify-start">
          <Link href="/">
            <Image src="/img/Logo/BeatMaster_3.PNG" alt="logo" width={100} height={100} />
          </Link>
          <h4>&copy; 2024 All Rights Reserved.</h4>
          <h3>
            Coded By <span>@JRcoder</span>
          </h3>
        </div>
        <div className="q_links flex flex-col justify-start">
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
        <div className="q_links affiliate_disclaimer flex flex-col justify-start">
          <h3>Disclaimer</h3>
          <p className="text-center text-xs">
            As an Amazon Associate, we earn from qualifying purchases. <br />
            This means that if you click on a link to an Amazon product on this site and make a purchase, we may receive
            a commission at no additional cost to you. This helps support the site and allows us to continue providing
            useful content. <br />
            <br />
            Thank you for your support!
          </p>
        </div>
        <div className="q_links flex flex-col justify-start">
          <h3>Social Media</h3>
          <ul>
            <li>
              <Link
                href="https://www.instagram.com/beatmastermind"
                target="_blank"
                style={{ color: "#de3fac", fontSize: "14px" }}
              >
                <FaInstagram style={{ color: "#de3fac", fontSize: "28px" }} />
              </Link>
            </li>
            <li>
              <Link
                href="https://se.pinterest.com/beatmastermindaff"
                target="_blank"
                style={{ color: "#e60023", fontSize: "14px" }}
              >
                <FaPinterestP style={{ color: "#e60023", fontSize: "28px" }} />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
