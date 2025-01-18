import {
  FaBrush,
  FaFacebook,
  FaGlobe,
  FaInstagram,
  FaLeaf,
  FaTiktok,
  FaTwitter,
} from "react-icons/fa";
import { IoIosColorPalette } from "react-icons/io";
import { FaClock, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

export const gridData = [
  {
    icon: <IoIosColorPalette size={20} />,
    title: "Unique Designs",
    description:
      "Each string art piece is a unique creation, blending modern aesthetics with traditional techniques.",
  },
  {
    icon: <FaBrush size={20} />,
    title: "Custom Commissions",
    description:
      "Collaborate with our artists to create a bespoke piece that perfectly complements your space.",
  },
  {
    icon: <FaLeaf size={20} />,
    title: "Sustainable Materials",
    description:
      "Our commitment to sustainability ensures that each piece is crafted with eco-friendly materials.",
  },
  {
    icon: <FaGlobe size={20} />,
    title: "Worldwide Shipping",
    description:
      "Enjoy our art no matter where you are, with reliable shipping options available globally.",
  },
];

export const creatorsData = [
  {
    image: "/wallhaven-rrmwo7.png",
    name: "Whitney Francis",
    position: "Creative Director",
  },
  {
    image: "/wallhaven-vq83e5.jpg",
    name: "Leonard Krasner",
    position: "Senior Designer",
  },
  {
    image: "/wallhaven-gprxpq.jpg",
    name: "Floyd Miles",
    position: "Visual Artist",
  },
];

export const officeData = [
  {
    id: "officeHours",
    icon: <FaClock size={20} />,
    title: "Office Hours",
    details: {
      days: "Monday - Friday",
      time: "9:00 am to 6:00 pm",
    },
  },
  {
    id: "studioAddress",
    icon: <FaMapMarkerAlt size={20} />,
    title: "Our Studio",
    details: {
      street: "123 Art Lane",
      city: "Creativity City",
      state: "CA",
      zip: "90210",
      country: "USA",
    },
  },
  {
    id: "contact",
    icon: <FaPhoneAlt size={20} />,
    title: "Contact Us",
    details: {
      phone1: "+1-555-789-1234",
      phone2: "+1-555-456-7890",
    },
  },
];

export const socialMediaLinks = [
  {
    name: "Facebook",
    url: "https://www.facebook.com",
    icon: <FaFacebook size={40} />,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com",
    icon: <FaInstagram size={40} />,
  },
  {
    name: "Twitter",
    url: "https://www.twitter.com",
    icon: <FaTwitter size={40} />,
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com",
    icon: <FaTiktok size={40} />,
  },
];
