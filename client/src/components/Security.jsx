import React from 'react';
import { Shield, Lock, UserCheck, Server, Key, Database } from 'lucide-react';

function Security() {
  const securityFeatures = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "End-to-End Encryption",
      description: "Your conversations with teachers and AI are fully encrypted and secure."
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Data Protection",
      description: "GDPR compliant data handling ensures your learning data stays private."
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: "Verified Teachers",
      description: "All teachers undergo thorough verification and background checks."
    },
    {
      icon: <Server className="w-6 h-6" />,
      title: "Secure Infrastructure",
      description: "Cloud infrastructure with multiple layers of security and redundancy."
    },
    {
      icon: <Key className="w-6 h-6" />,
      title: "Access Control",
      description: "Role-based access control for students and teachers."
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Data Backup",
      description: "Regular backups and disaster recovery protocols."
    }
  ];

  return (
    <div className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-[#00FF9D] to-[#00FF9D]/50 bg-clip-text text-transparent">
            Security You Can Trust
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Your learning journey is protected by industry-leading security measures
            and data protection protocols.
          </p>
        </div>

        {/* Main Security Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {securityFeatures.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md hover:border-[#00FF9D]/30 transition-all duration-500"
            >
              {/* Gradient Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00FF9D]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative p-8">
                {/* Icon Container */}
                <div className="mb-6 w-12 h-12 rounded-lg bg-[#00FF9D]/10 flex items-center justify-center text-[#00FF9D] group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-[#00FF9D] transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Certification Banner */}
        <div className="mt-20 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-semibold mb-4 text-[#00FF9D]">
                Industry Standard Certifications
              </h3>
              <p className="text-gray-400">
                Our platform adheres to the highest security standards and certifications
              </p>
            </div>
            <div className="flex items-center gap-8">
              <div className="px-6 py-3 rounded-xl bg-[#00FF9D]/10 border border-[#00FF9D]/30 text-[#00FF9D] font-medium">
                ISO 27001
              </div>
              <div className="px-6 py-3 rounded-xl bg-[#00FF9D]/10 border border-[#00FF9D]/30 text-[#00FF9D] font-medium">
                GDPR
              </div>
              <div className="px-6 py-3 rounded-xl bg-[#00FF9D]/10 border border-[#00FF9D]/30 text-[#00FF9D] font-medium">
                SOC 2
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Security;