import React from "react";

const Developer = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">Developer & Contributors</h1>
          <p className="text-gray-600 mt-3">
            Meet the team behind Fashion Hub
          </p>
        </div>

        {/* Main Developer */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6">
            Main Developer
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-4xl">
              👩‍💻
            </div>

            <div>
              <h3 className="text-2xl font-semibold">
                Ritu Sharma
              </h3>

              <p className="text-blue-600 font-medium">
                Full Stack Developer | Project Lead
              </p>

              <p className="mt-3 text-gray-700">
                Developed and managed the complete Fashion Hub
                MERN Stack E-Commerce Website.
              </p>
            </div>
          </div>
        </div>

        {/* Contributors */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">
            Contributors
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-4xl mb-3">👩‍🎓</div>

              <h3 className="text-xl font-semibold">
                Aadti
              </h3>

              <p className="text-gray-600">
                BCA Student
              </p>

              <p className="text-gray-600">
                Gagan College of Management and Technology
              </p>

              <p className="mt-3">
                Project Support & Testing
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-4xl mb-3">👩‍🎓</div>

              <h3 className="text-xl font-semibold">
                Diksha
              </h3>

              <p className="text-gray-600">
                BCA Student
              </p>

              <p className="text-gray-600">
                Gagan College of Management and Technology
              </p>

              <p className="mt-3">
                Project Support & Documentation
              </p>
            </div>

          </div>
        </div>

        {/* Project Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
          <h2 className="text-2xl font-bold mb-4">
            Project Overview
          </h2>

          <p className="text-gray-700">
            Fashion Hub is a modern MERN Stack E-Commerce Website
            built for seamless online shopping and management.
          </p>
        </div>

        {/* Technologies */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
          <h2 className="text-2xl font-bold mb-4">
            Technologies Used
          </h2>

          <div className="flex flex-wrap gap-3">
            {[
              "React.js",
              "Node.js",
              "Express.js",
              "MongoDB",
              "Tailwind CSS",
              "JWT",
              "Redux Toolkit",
              "Razorpay",
            ].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600">
          <p>
            Developed by Ritu Sharma with support from Aadti and
            Diksha (BCA Students, Gagan College of Management and
            Technology) © 2026
          </p>
        </div>

      </div>
    </div>
  );
};

export default Developer;