import { useState, useEffect } from "react";
import Head from "next/head";
import { BsArrowRight } from "react-icons/bs";
import { motion } from "framer-motion";
import { fadeIn } from "../../variants";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [formMessage, setFormMessage] = useState("");

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (value.length < 2 || value.length > 30) {
          error = "Name must be between 2 and 30 characters.";
        }
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Enter a valid email address.";
        }
        break;
      case "subject":
        if (value.length < 3) {
          error = "Subject must be at least 3 characters.";
        }
        break;
      case "message":
        if (value.trim().split(" ").length < 1) {
          error = "Message must contain at least one word.";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    const error = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error
    }));
  };

  const isFormValid = () => {
    return (
      Object.values(errors).every((error) => error === "") &&
      Object.values(formData).every((field) => field.trim() !== "")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormMessage("Email sent successfully!");
      } else {
        setFormMessage("Something went wrong, please try again.");
      }

      setTimeout(() => {
        setFormMessage("");
      }, 5000);

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      setErrors({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      setFormMessage("An error occurred. Please try again later.");
      setTimeout(() => {
        setFormMessage("");
      }, 5000);
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us | Beat MasterMind</title>
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_SITE_URL || "https://www.beatmastermind.com"}/contact`}
        />
        <meta
          name="description"
          content="Have questions about electronic drums or accessories? Get in touch with the experts at Beat Mastermind today!"
        />
      </Head>
      <div className="slugpage min-h-screen flex flex-col">
        <div className="container px-4">
          <div className="mailform max-w-2xl w-full shadow-lg rounded-lg p-8 mx-auto mt-4">
            <motion.h2
              variants={fadeIn("up", 0.2)}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="text-2xl font-semibold text-center text-gray-800 mb-6"
            >
              <h1 className="text-accent">Connect </h1>with us
            </motion.h2>
            <motion.form
              onSubmit={handleSubmit}
              variants={fadeIn("up", 0.4)}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`input bg-gray-50 border ${
                      errors.name ? "border-red-500" : formData.name ? "border-green-500" : "border-gray-300"
                    } text-gray-800 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`input bg-gray-50 border ${
                      errors.email ? "border-red-500" : formData.email ? "border-green-500" : "border-gray-300"
                    } text-gray-800 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>
              <div>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`input bg-gray-50 border ${
                    errors.subject ? "border-red-500" : formData.subject ? "border-green-500" : "border-gray-300"
                  } text-gray-800 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5`}
                />
                {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
              </div>
              <div>
                <textarea
                  name="message"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleChange}
                  className={`textarea bg-gray-50 border ${
                    errors.message ? "border-red-500" : formData.message ? "border-green-500" : "border-gray-300"
                  } text-gray-800 text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 h-32 resize-none`}
                ></textarea>
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={!isFormValid()}
                  className={`btn rounded-full border border-white/50 max-w-[170px] px-8 transition-all duration-300 flex items-center justify-center overflow-hidden ${
                    isFormValid() ? "hover:border-green-500 group" : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <span
                    className={`${
                      isFormValid() ? "group-hover:-translate-y-[120%] group-hover:opacity-0" : ""
                    } transition-all duration-500`}
                  >
                    Let´s drum
                  </span>
                  <BsArrowRight
                    className={`${
                      isFormValid()
                        ? "-translate-y-[120%] opacity-0 group-hover:flex group-hover:-translate-y-0 group-hover:opacity-100"
                        : "hidden"
                    } transition-all duration-300 absolute text-[22px]`}
                  />
                </button>
                {formMessage && <p className="text-green-500 text-sm ml-4">{formMessage}</p>}
              </div>
            </motion.form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
