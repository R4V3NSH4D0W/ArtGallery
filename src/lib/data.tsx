import {
  FaBrush,
  FaFacebook,
  FaInstagram,
  FaLeaf,
  FaTiktok,
  FaTruck,
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
    title: "Custom Creations",
    description:
      "Bring your vision to life! We accept custom requests to craft personalized string art.",
  },
  {
    icon: <FaLeaf size={20} />,
    title: "Sustainable Materials",
    description:
      "Our commitment to sustainability ensures that each piece is crafted with eco-friendly materials.",
  },
  {
    icon: <FaTruck size={20} />,
    title: "Shipping in Nepal",
    description:
      "We currently ship across Nepal, ensuring your artwork reaches you safely and securely.",
  },
];

export const creatorsData = [
  {
    image: "/gallary_static/puranimage.jpeg",
    name: "Puran Gupta",
    position: "Creative Director",
  },
  {
    image: "/gallary_static/manish.jpeg",
    name: "Manish shrestha",
    position: "Senior Designer",
  },
  {
    image: "/gallary_static/samiimage.jpeg",
    name: "Samikshya Bhatta",
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
      street: "Taukhel",
      city: "Godawari , Lalitpur",
      state: "Bagmati",
      zip: "90210",
      country: "Nepal",
    },
  },
  {
    id: "contact",
    icon: <FaPhoneAlt size={20} />,
    title: "Contact Us",
    details: {
      phone1: "+977 980-8890392",
    },
  },
];

export const socialMediaLinks = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/profile.php?id=100006964359185",
    icon: <FaFacebook size={30} />,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/newayukyaa/",
    icon: <FaInstagram size={30} />,
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@user9973295",
    icon: <FaTiktok size={30} />,
  },
];

export const CollectionTypes = [
  {
    id: 1,
    type: "Abstract Art",
  },
  {
    id: 2,
    type: "Modern Art",
  },
  {
    id: 3,
    type: "Classic Art",
  },
  {
    id: 4,
    type: "Minimalist Art",
  },
  {
    id: 5,
    type: "Pop Art",
  },
];
