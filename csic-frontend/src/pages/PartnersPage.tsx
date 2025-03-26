import React from "react";

interface Company {
  name: string;
  logo: string; // URL to the logo image
  description: string;
}

const companies: Company[] = [
  {
    name: "Goldman Sachs International",
    logo: "/images/GoldmanSachs.png", // Updated path
    description: "Leading global investment banking, securities, and investment management firm.",
  },
  {
    name: "Tata Consultancy Services (TCS)",
    logo: "/images/TCS.png", // Updated path
    description: "Global leader in IT services, consulting, and business solutions.",
  },
  {
    name: "BlackLine",
    logo: "/images/Blackline.png", // Updated path
    description: "Modernizing finance and accounting with cloud-based solutions.",
  },
  {
    name: "Majestic",
    logo: "/images/majestic.png", // Updated path
    description: "World's largest link index database for SEO and marketing professionals.",
  },
  {
    name: "Phoebus Software",
    logo: "/images/phoebus.png", // Updated path
    description: "Specialist software solutions for the financial services sector.",
  },
  {
    name: "Pinsent Masons",
    logo: "/images/pinsent.png", // Updated path
    description: "International law firm with a focus on innovation and technology.",
  },
  {
    name: "Civico",
    logo: "/images/civico.png", // Updated path
    description: "Empowering communities with digital tools and solutions.",
  },
];

const PartnersPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900">Our Partners</h1>
      <p className="mt-4 text-lg text-gray-600">
        Meet the companies that help us bring amazing experiences to life.
      </p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {companies.map((company, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
          >
            <img
              src={company.logo}
              alt={`${company.name} logo`}
              className="w-full h-32 object-contain mb-4"
            />
            <h2 className="text-2xl font-semibold text-gray-800">
              {company.name}
            </h2>
            <p className="mt-2 text-gray-600">{company.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnersPage;