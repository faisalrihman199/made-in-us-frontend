import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("our-mission");

  const contentData = [
    {
      id: "our-mission",
      name: "Our Mission",
      title: "Our Mission",
      content: (
        <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
          <p>
            Our mission is to make U.S. vehicles accessible nationally and worldwide, with complete transparency and no hidden costs.
          </p>
          <p>
            Whether buying domestically or importing internationally, we simplify the process while ensuring trust and fairness.
          </p>
          <p>
            By combining direct access to U.S. vehicle listings with expert negotiation support, 
            <span className="font-semibold text-gray-900"> Made-in-US.com</span> provides a smarter and more cost-effective way to purchase vehicles from the United States.
          </p>
        </div>
      ),
    },
    {
      id: "how-it-works",
      name: "How it works",
      title: "How It Works",
      content: (
        <div className="space-y-8">
          <p className="text-lg text-gray-700">The process of buying your dream car is simple and transparent:</p>
          <div className="space-y-6">
            {[
              { step: "1", title: "Send us your inquiry", desc: "Submit your request through our contact form with the vehicle you are interested in." },
              { step: "2", title: "We contact you within 24 hours", desc: "Our team reviews your request and gets back to you quickly." },
              { step: "3", title: "We contact the seller directly", desc: "We inform the seller that one of our clients is interested in the vehicle and begin discussions." },
              { step: "4", title: "Vehicle availability & document verification", desc: "We confirm the vehicle's availability and ensure the seller has the proper ownership and vehicle documentation." },
              { step: "5", title: "National or worldwide transport arrangement", desc: "We coordinate transportation with trusted shipping partners." },
              { step: "6", title: "Administrative and export documentation", desc: "Our team manages all the required export paperwork." },
              { step: "7", title: "Vehicle delivery", desc: "Your vehicle is shipped by the freight forwarder closest to the seller, depending on availability." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "buying-a-car",
      name: "Buying a Car",
      title: "How to Buy a Vehicle on Made-in-US.com",
      content: (
        <div className="space-y-8">
          <p className="text-lg text-gray-700">Buying a vehicle through Made-in-US.com is simple and secure. Our platform connects national and international buyers with vehicles located in the United States.</p>
          <div className="space-y-6">
            {[
              { step: "1", title: "Browse the Marketplace", desc: "Explore our selection of vehicles available across the United States. Each listing includes photos, detailed specifications, and vehicle history when available." },
              { step: "2", title: "Request Information", desc: "If a vehicle interests you, simply submit an inquiry through the platform. Our team will provide additional details, answer your questions, and confirm availability." },
              { step: "3", title: "Price Negotiation", desc: "We negotiate directly with the seller to obtain the best possible price for you. When a price reduction is achieved, 20% of the negotiated savings is returned to the client, while the remaining portion covers the work performed and the operation of the platform." },
              { step: "4", title: "Secure the Vehicle", desc: "Once you approve the deal, a $2,000 deposit may be required to reserve the vehicle and prevent it from being sold to another buyer." },
              { step: "5", title: "Payment", desc: "The remaining balance is paid via secure bank transfer. All transaction details and documentation are provided for your records." },
              { step: "6", title: "Transportation (National or Export)", desc: "We organize transportation from the seller's location either to your address within the United States or to the nearest export port." },
              { step: "7", title: "Worldwide Shipping", desc: "Your vehicle is shipped to your country via container or RoRo shipping. All export documents are provided to facilitate customs clearance." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "faq",
      name: "FAQ",
      title: "Frequently Asked Questions",
      content: (
        <div className="space-y-6">
          {[
            { q: "What is Made-in-US.com?", a: "Made-in-US.com is a marketplace that connects national and international buyers with sellers of authentic American vehicles. We help buyers find unique vehicles in the United States and assist with the purchase process." },
            { q: "Does Made-in-US.com sell the vehicles directly?", a: "No. Made-in-US.com is a marketplace. We connect buyers with sellers and assist throughout the process, including negotiation, logistics, and export." },
            { q: "How does the buying process work?", a: "Once you find a vehicle you like, contact us through the platform. We will review the vehicle, communicate with the seller, negotiate if possible, and guide you through the purchase and shipping process." },
            { q: "Do you help negotiate the price?", a: "Yes. When possible, we negotiate directly with the seller to obtain the best possible price for the buyer. In this case, we return 20% of the negotiation to the client and keep the rest for the work performed." },
            { q: "How does the payment process work?", a: "Made-in-US.com acts as a secure escrow service. The buyer sends payment to our company, which holds the funds during the transaction. Once the purchase is confirmed, we release the payment to the seller. Our escrow fee is $350. A 3.5% service fee is applied to the total vehicle price." },
            { q: "Are you responsible for the vehicle's condition?", a: "No. Vehicles are sold directly by the seller. Made-in-US.com does not guarantee the mechanical condition, history, or authenticity. Buyers are encouraged to request inspections." },
            { q: "What documents are required for export?", a: "To export a vehicle from the United States, several documents are required, including the Certificate of Title, Bill of Sale, and export declarations. Our team manages all administrative formalities to ensure a smooth export process." },
            { q: "Can a vehicle be transported worldwide?", a: "Yes. We organize transportation from the seller's location to the port of export and coordinate international shipping by container or RoRo (Roll-on/Roll-off) to your destination country." },
            { q: "How are shipping costs calculated?", a: "Shipping costs depend on the vehicle's size, its location in the United States, and the destination port. We provide customized quotes for each shipment." },
            { q: "What happens if a vehicle is already sold?", a: "If a vehicle is no longer available, we will inform you immediately and help you find a similar vehicle that meets your criteria." },
            { q: "Are there any hidden costs?", a: "No. We believe in complete transparency. All costs, including logistics, administration, and fees, are clearly communicated before any payment is made." },
            { q: "How can I contact Made-in-US.com?", a: "You can contact us through the inquiry form on any vehicle listing or via our general contact form. We aim to respond to all inquiries within 24 hours." },
          ].map((item, idx) => (
            <div key={idx} className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:border-primary/20 transition-colors">
              <h3 className="font-bold text-gray-900 flex gap-3 mb-2">
                <span className="text-primary">Q:</span> {item.q}
              </h3>
              <p className="text-gray-600 flex gap-3 text-[15px] leading-relaxed">
                <span className="text-gray-400 font-bold italic">A:</span> {item.a}
              </p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "terms",
      name: "TERMS OF SERVICE",
      title: "Terms of Service",
      content: (
        <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
          {[
            { 
              t: "1. Acceptance of Terms", 
              c: "By accessing and using Made-in-US.com (the \"Platform\"), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform." 
            },
            { 
              t: "2. Description of Services", 
              c: "Made-in-US.com provides a marketplace that connects buyers with sellers of vehicles located in the United States. We also provide negotiation assistance, logistics coordination, and administrative support for vehicle purchases and exports." 
            },
            { 
              t: "3. Marketplace Nature", 
              c: "Made-in-US.com is not the seller of the vehicles listed on the Platform. We act as an intermediary to facilitate transactions between buyers and third-party sellers. Any contract for the purchase of a vehicle is directly between the buyer and the seller." 
            },
            { 
              t: "4. Account Registration", 
              c: "Users may be required to create an account to access certain features. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account." 
            },
            { 
              t: "5. Information Accuracy", 
              c: "While we strive for accuracy, vehicle descriptions, photos, and prices are provided by sellers. Made-in-US.com does not guarantee the accuracy, completeness, or reliability of any information on the Platform." 
            },
            { 
              t: "6. Negotiation and Fees", 
              c: "When Made-in-US.com assists in price negotiation, we return 20% of the achieved savings to the client. The remaining 80% is retained by the Platform as a service fee. These terms are agreed upon at the start of the negotiation process." 
            },
            { 
              t: "7. Secure Escrow and Payment", 
              c: "We provide a secure escrow service for transactions. Buyers send funds to our designated company account, and we hold them until the purchase is confirmed. A non-refundable escrow fee of $350 and a 3.5% service fee on the total vehicle price apply to each transaction." 
            },
            { 
              t: "8. Vehicle Deposits", 
              c: "To reserve a vehicle, a deposit of $2,000 may be required. This deposit is generally non-refundable if the buyer chooses not to proceed with the transaction, as it compensates the seller for removing the vehicle from the market." 
            },
            { 
              t: "9. Vehicle Inspections", 
              c: "Made-in-US.com does not inspect vehicles. Buyers are strongly encouraged to hire a professional third-party inspector to verify the vehicle's condition before finalizing a purchase." 
            },
            { 
              t: "10. Condition and Warranty", 
              c: "All vehicles are sold \"as is\" by the seller, without any warranty, express or implied, from Made-in-US.com. We are not responsible for mechanical failures, hidden defects, or any issues discovered after delivery." 
            },
            { 
              t: "11. Logistics and Shipping", 
              c: "Logistics and shipping services are provided by third-party freight forwarders. Made-in-US.com coordinates these services but is not responsible for delays, damage, or loss occurring during transport." 
            },
            { 
              t: "12. Export Compliance", 
              c: "Buyers are responsible for ensuring that the vehicle they purchase complies with the import regulations of their destination country. Made-in-US.com manages export documentation but does not guarantee import eligibility." 
            },
            { 
              t: "13. Intellectual Property", 
              c: "All content on the Platform, including text, logos, and software, is the property of Made-in-US.com or its licensors and is protected by intellectual property laws." 
            },
            { 
              t: "14. Limitation of Liability", 
              c: "To the maximum extent permitted by law, Made-in-US.com shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the Platform or the purchase of any vehicle." 
            },
            { 
              t: "15. Indemnification", 
              c: "You agree to indemnify and hold Made-in-US.com harmless from any claims, losses, or damages resulting from your breach of these Terms of Service or your violation of any law or third-party right." 
            },
            { 
              t: "16. Modifications to Service", 
              c: "We reserve the right to modify or discontinue the Platform or any part of our services at any time without notice." 
            },
            { 
              t: "17. Governing Law", 
              c: "These Terms of Service are governed by the laws of the State of Delaware, United States, without regard to its conflict of law principles." 
            },
            { 
              t: "18. Contact Information", 
              c: "If you have any questions regarding these Terms of Service, please contact us at legal@made-in-us.com." 
            }
          ].map((item, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="font-bold text-gray-900 text-base underline">{item.t}</h3>
              <p className="text-[15px] text-gray-600 leading-relaxed font-medium">{item.c}</p>
            </div>
          ))}
        </div>
      ),
    },
  ];

  // Effect to handle navigation from external links (like footer)
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      // Find the corresponding section in contentData
      const sectionId = contentData.find(item => item.id === hash)?.id;
      if (sectionId) {
        setActiveSection(sectionId);
        // Scroll to top of content when switching
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [location]);

  const activeContent = contentData.find((item) => item.id === activeSection);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="sticky top-32 space-y-1">
              <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] px-4 mb-4">About Us</h2>
              {contentData.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full text-left px-5 py-4 rounded-2xl transition-all duration-200 group flex items-center justify-between ${
                    activeSection === item.id
                      ? "bg-[#60E677]/10 text-[#003B21] shadow-sm"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className={`text-[15px] font-bold ${activeSection === item.id ? "translate-x-1" : "group-hover:translate-x-1"} transition-transform`}>
                    {item.name}
                  </span>
                  {activeSection === item.id && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#60E677]" />
                  )}
                </button>
              ))}
            </div>
          </aside>

          {/* Content Area */}
          <section className="flex-1 min-h-[600px] bg-gray-50/50 rounded-[2.5rem] p-8 sm:p-12 border border-gray-100/50">
            {activeContent && (
              <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-10 tracking-tight leading-[1.1]">
                  {activeContent.title}
                </h1>
                <div className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-xl shadow-gray-200/40 border border-white">
                  {activeContent.content}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
