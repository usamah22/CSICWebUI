import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/code.png)' }} // Updated background image
      >
        {/* Full-width background */}
        <div className="w-full bg-black bg-opacity-50">
          {/* Inner content with padding */}
          <div className="px-4 py-20 text-center sm:px-6 lg:px-8">
            <h1 className="text-5xl font-bold text-white sm:text-6xl">
              Welcome to the Computer Science Industry Club
            </h1>
            <p className="mt-4 text-xl text-gray-200 sm:text-2xl">
              Connecting Aston’s Computer Science and Cybersecurity students with top-tier technology companies.
            </p>
            <Link
              to="/events"
              className="mt-8 inline-block px-8 py-3 bg-[#880090] text-white font-semibold rounded hover:bg-[#7a0082] transition duration-300"
            >
              Explore Events
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Wrap the rest of the page in a constrained container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* About Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="py-16 bg-white"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4 sm:text-4xl">
            What is the Computer Science Industry Club?
          </h2>
          <p className="text-gray-700 leading-relaxed">
            The Computer Science Industry Club is an exclusive network that connects Aston’s Computer Science and Cybersecurity students with top-tier technology companies and other prominent employers seeking to hire talented students. Each year, the Club runs a series of events that provide students with invaluable opportunities to meet industry professionals, showcase their work, and develop the skills and knowledge that employers look for. This includes guest lectures, individual and team project showcases, professional mentoring, and visits to company offices. Furthermore, official members receive direct emails about placement and graduate roles from our member companies.
          </p>
        </motion.section>

        {/* Why Get Involved Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="py-16 bg-white"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4 sm:text-4xl">
            Why Get Involved?
          </h2>
          <p className="text-gray-700 mb-6">
            Enhance your time at Aston University by developing your skills, increasing your employability, and building industry connections. Membership is FREE for all Computer Science and Cybersecurity students. Register as an official member to unlock full benefits.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 sm:columns-2">
            <li>Access placement and graduate job opportunities</li>
            <li>Network with industry professionals</li>
            <li>Showcase your work to potential employers</li>
            <li>Develop skills and knowledge that employers value</li>
            <li>Gain unique insights into the tech industry</li>
            <li>Boost your confidence in engaging with employers</li>
            <li>Enhance your academic ability</li>
          </ul>
        </motion.section>

        {/* Partners Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="py-16 bg-white"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4 sm:text-4xl">
            What Companies Take Part?
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Our network of partner companies ranges from large consultancies to leading SMEs that specialise in tech. All partner companies share a passion for supporting students to reach their full potential. They actively engage with students by delivering guest lectures, providing valuable feedback, acting as mentors, and more. These partners keep an eye out for ideal candidates for placement and graduate roles, recruiting through the Club.
          </p>
        </motion.section>
      </div>
    </div>
  );
};

export default HomePage;