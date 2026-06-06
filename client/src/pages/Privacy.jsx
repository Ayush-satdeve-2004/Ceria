import React from 'react';

const Privacy = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-slate-950 text-white leading-relaxed min-h-screen font-sans">
      
      {/* Header Section */}
      <div className="border-b border-slate-800 pb-6 mb-8">
        <h1 className="text-4xl font-black text-white uppercase tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-400 font-bold mt-2">Last updated: June 06, 2026</p>
      </div>

      {/* Content Container */}
      <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl space-y-10 text-sm md:text-base">
        
        {/* Introduction */}
        <section className="space-y-4">
          <p>
            This Privacy Notice for <strong>Ceria</strong> (doing business as <strong>An Agent</strong>) ("<strong>we</strong>," "<strong>us</strong>," or "<strong>our</strong>"), describes how and why we might access, collect, store, use, and/or share ("<strong>process</strong>") your personal information when you use our services ("<strong>Services</strong>"), including when you:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li>Visit our website or any website of ours that links to this Privacy Notice.</li>
            <li>Engage with us in other related ways, including any marketing or events.</li>
          </ul>
          <p>
            <strong>Questions or concerns?</strong> Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at <a href="mailto:support.ceria@gmail.com" className="text-blue-400 hover:text-blue-300 hover:underline">support.ceria@gmail.com</a>.
          </p>
        </section>

        {/* Summary of Key Points */}
        <section className="space-y-4">
          <h2 className="text-xl font-extrabold text-white uppercase tracking-wide border-b border-slate-800 pb-2">Summary of Key Points</h2>
          <p className="text-slate-400 italic">This summary provides key points from our Privacy Notice, but you can find out more details about any of these topics by using our table of contents below to find the section you are looking for.</p>
          <ul className="space-y-3 text-slate-300">
            <li><strong className="text-white">What personal information do we process?</strong> When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services.</li>
            <li><strong className="text-white">Do we process any sensitive personal information?</strong> We do not process sensitive personal information.</li>
            <li><strong className="text-white">Do we collect any information from third parties?</strong> We do not collect any information from third parties.</li>
            <li><strong className="text-white">How do we process your information?</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.</li>
            <li><strong className="text-white">In what situations and with which parties do we share personal information?</strong> We may share information in specific situations and with specific third parties.</li>
            <li><strong className="text-white">How do we keep your information safe?</strong> We have adequate organizational and technical processes and procedures in place to protect your personal information.</li>
            <li><strong className="text-white">What are your rights?</strong> Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information.</li>
          </ul>
        </section>

        {/* Table of Contents */}
        <section className="space-y-4 bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
          <h2 className="text-lg font-extrabold text-white uppercase">Table of Contents</h2>
          <ol className="list-decimal pl-6 space-y-2 font-medium text-blue-400">
            <li><a href="#infocollect" className="hover:underline hover:text-blue-300">What information do we collect?</a></li>
            <li><a href="#infouse" className="hover:underline hover:text-blue-300">How do we process your information?</a></li>
            <li><a href="#legalbases" className="hover:underline hover:text-blue-300">What legal bases do we rely on to process your personal information?</a></li>
            <li><a href="#whoshare" className="hover:underline hover:text-blue-300">When and with whom do we share your personal information?</a></li>
            <li><a href="#sociallogins" className="hover:underline hover:text-blue-300">How do we handle your social logins?</a></li>
            <li><a href="#inforetain" className="hover:underline hover:text-blue-300">How long do we keep your information?</a></li>
            <li><a href="#infosafe" className="hover:underline hover:text-blue-300">How do we keep your information safe?</a></li>
            <li><a href="#privacyrights" className="hover:underline hover:text-blue-300">What are your privacy rights?</a></li>
            <li><a href="#DNT" className="hover:underline hover:text-blue-300">Controls for do-not-track features</a></li>
            <li><a href="#uslaws" className="hover:underline hover:text-blue-300">Do United States residents have specific privacy rights?</a></li>
            <li><a href="#otherlaws" className="hover:underline hover:text-blue-300">Do other regions have specific privacy rights?</a></li>
            <li><a href="#policyupdates" className="hover:underline hover:text-blue-300">Do we make updates to this notice?</a></li>
            <li><a href="#contact" className="hover:underline hover:text-blue-300">How can you contact us about this notice?</a></li>
            <li><a href="#request" className="hover:underline hover:text-blue-300">How can you review, update, or delete the data we collect from you?</a></li>
          </ol>
        </section>

        {/* Sections */}
        <div className="space-y-12">
          
          {/* 1. Information Collection */}
          <section id="infocollect" className="space-y-4">
            <h3 className="text-lg font-extrabold text-white uppercase">1. What Information Do We Collect?</h3>
            <h4 className="font-bold text-slate-200">Personal information you disclose to us</h4>
            <p className="text-slate-400 italic">In Short: We collect personal information that you provide to us.</p>
            <p>We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.</p>
            <p><strong>Personal Information Provided by You.</strong> The personal information we collect may include the following:</p>
            <ul className="list-disc pl-6 space-y-1 text-slate-300">
              <li>Names</li>
              <li>Phone numbers</li>
              <li>Email addresses</li>
              <li>Passwords</li>
            </ul>
            <p><strong>Sensitive Information.</strong> We do not process sensitive information.</p>
            <p>All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.</p>
          </section>

          {/* 2. How Do We Process Your Information */}
          <section id="infouse" className="space-y-4">
            <h3 className="text-lg font-extrabold text-white uppercase">2. How Do We Process Your Information?</h3>
            <p className="text-slate-400 italic">In Short: We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.</p>
            <ul className="list-disc pl-6 space-y-3 text-slate-300">
              <li><strong className="text-white">To facilitate account creation and authentication and otherwise manage user accounts.</strong> We may process your information so you can create and log in to your account, as well as keep your account in working order.</li>
              <li><strong className="text-white">To fulfill and manage your orders.</strong> We may process your information to fulfill and manage your orders, payments, returns, and exchanges made through the Services.</li>
              <li><strong className="text-white">To request feedback.</strong> We may process your information when necessary to request feedback and to contact you about your use of our Services.</li>
            </ul>
          </section>

          {/* ... (Sections 3 to 9 remain standard text) ... */}
          <section id="legalbases" className="space-y-4">
            <h3 className="text-lg font-extrabold text-white uppercase">3. What Legal Bases Do We Rely On To Process Your Information?</h3>
            <p className="text-slate-400 italic">In Short: We only process your personal information when we believe it is necessary and we have a valid legal reason (i.e., legal basis) to do so under applicable law...</p>
          </section>

          <section id="whoshare" className="space-y-4">
            <h3 className="text-lg font-extrabold text-white uppercase">4. When And With Whom Do We Share Your Personal Information?</h3>
            <p className="text-slate-400 italic">In Short: We may share information in specific situations described in this section and/or with the following third parties.</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li><strong className="text-white">Business Transfers.</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
            </ul>
          </section>

          <section id="sociallogins" className="space-y-4">
            <h3 className="text-lg font-extrabold text-white uppercase">5. How Do We Handle Your Social Logins?</h3>
            <p className="text-slate-400 italic">In Short: If you choose to register or log in to our Services using a social media account, we may have access to certain information about you.</p>
          </section>

          <section id="inforetain" className="space-y-4">
            <h3 className="text-lg font-extrabold text-white uppercase">6. How Long Do We Keep Your Information?</h3>
            <p className="text-slate-400 italic">In Short: We keep your information for as long as necessary to fulfill the purposes outlined in this Privacy Notice unless otherwise required by law.</p>
          </section>

          <section id="infosafe" className="space-y-4">
            <h3 className="text-lg font-extrabold text-white uppercase">7. How Do We Keep Your Information Safe?</h3>
            <p className="text-slate-400 italic">In Short: We aim to protect your personal information through a system of organizational and technical security measures.</p>
          </section>

          <section id="privacyrights" className="space-y-4">
            <h3 className="text-lg font-extrabold text-white uppercase">8. What Are Your Privacy Rights?</h3>
            <p className="text-slate-400 italic">In Short: Depending on your state of residence in the US or in some regions, such as Canada, you have rights that allow you greater access to and control over your personal information.</p>
          </section>

          <section id="DNT" className="space-y-4">
            <h3 className="text-lg font-extrabold text-white uppercase">9. Controls For Do-Not-Track Features</h3>
            <p>Most web browsers and some mobile operating systems include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected.</p>
          </section>

          {/* 10. US Rights with TABLE */}
          <section id="uslaws" className="space-y-6">
            <h3 className="text-lg font-extrabold text-white uppercase border-b border-slate-800 pb-2">10. Do United States Residents Have Specific Privacy Rights?</h3>
            <p className="text-slate-400 italic">In Short: If you are a resident of California, Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky, Maryland, Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Rhode Island, Tennessee, Texas, Utah, or Virginia, you may have the right to request access to and receive details about the personal information we maintain about you.</p>
            
            <h4 className="font-bold text-white text-lg mt-6">Categories of Personal Information We Collect</h4>
            <p>The table below shows the categories of personal information we have collected in the past twelve (12) months.</p>

            <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-800/50 my-6">
              <table className="w-full text-left text-sm whitespace-normal">
                <thead className="bg-slate-800 text-white">
                  <tr>
                    <th className="p-4 border-b border-r border-slate-700 font-bold w-1/3">Category</th>
                    <th className="p-4 border-b border-r border-slate-700 font-bold w-1/2">Examples</th>
                    <th className="p-4 border-b border-slate-700 font-bold text-center w-1/6">Collected</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700 text-slate-300">
                  <tr className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 border-r border-slate-700 align-top">A. Identifiers</td>
                    <td className="p-4 border-r border-slate-700">Contact details, such as real name, alias, postal address, telephone or mobile contact number, unique personal identifier, online identifier, Internet Protocol address, email address, and account name</td>
                    <td className="p-4 text-center font-bold text-white align-middle">NO</td>
                  </tr>
                  <tr className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 border-r border-slate-700 align-top">B. Personal information as defined in the California Customer Records statute</td>
                    <td className="p-4 border-r border-slate-700">Name, contact information, education, employment, employment history, and financial information</td>
                    <td className="p-4 text-center font-bold text-white align-middle">NO</td>
                  </tr>
                  <tr className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 border-r border-slate-700 align-top">C. Protected classification characteristics under state or federal law</td>
                    <td className="p-4 border-r border-slate-700">Gender, age, date of birth, race and ethnicity, national origin, marital status, and other demographic data</td>
                    <td className="p-4 text-center font-bold text-white align-middle">NO</td>
                  </tr>
                  <tr className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 border-r border-slate-700 align-top">D. Commercial information</td>
                    <td className="p-4 border-r border-slate-700">Transaction information, purchase history, financial details, and payment information</td>
                    <td className="p-4 text-center font-bold text-white align-middle">NO</td>
                  </tr>
                  <tr className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 border-r border-slate-700 align-top">E. Biometric information</td>
                    <td className="p-4 border-r border-slate-700">Fingerprints and voiceprints</td>
                    <td className="p-4 text-center font-bold text-white align-middle">NO</td>
                  </tr>
                  <tr className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 border-r border-slate-700 align-top">F. Internet or other similar network activity</td>
                    <td className="p-4 border-r border-slate-700">Browsing history, search history, online behavior, interest data, and interactions with our and other websites, applications, systems, and advertisements</td>
                    <td className="p-4 text-center font-bold text-white align-middle">NO</td>
                  </tr>
                  <tr className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 border-r border-slate-700 align-top">G. Geolocation data</td>
                    <td className="p-4 border-r border-slate-700">Device location</td>
                    <td className="p-4 text-center font-bold text-white align-middle">NO</td>
                  </tr>
                  <tr className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 border-r border-slate-700 align-top">H. Audio, electronic, sensory, or similar information</td>
                    <td className="p-4 border-r border-slate-700">Images and audio, video or call recordings created in connection with our business activities</td>
                    <td className="p-4 text-center font-bold text-white align-middle">NO</td>
                  </tr>
                  <tr className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 border-r border-slate-700 align-top">I. Professional or employment-related information</td>
                    <td className="p-4 border-r border-slate-700">Business contact details in order to provide you our Services at a business level or job title, work history, and professional qualifications if you apply for a job with us</td>
                    <td className="p-4 text-center font-bold text-white align-middle">NO</td>
                  </tr>
                  <tr className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 border-r border-slate-700 align-top">J. Education Information</td>
                    <td className="p-4 border-r border-slate-700">Student records and directory information</td>
                    <td className="p-4 text-center font-bold text-white align-middle">NO</td>
                  </tr>
                  <tr className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 border-r border-slate-700 align-top">K. Inferences drawn from collected personal information</td>
                    <td className="p-4 border-r border-slate-700">Inferences drawn from any of the collected personal information listed above to create a profile or summary about, for example, an individual’s preferences and characteristics</td>
                    <td className="p-4 text-center font-bold text-white align-middle">NO</td>
                  </tr>
                  <tr className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 border-r border-slate-700 align-top">L. Sensitive personal Information</td>
                    <td className="p-4 border-r border-slate-700"></td>
                    <td className="p-4 text-center font-bold text-white align-middle">NO</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <p>We may also collect other personal information outside of these categories through instances where you interact with us in person, online, or by phone or mail in the context of:</p>
            <ul className="list-disc pl-6 space-y-1 text-slate-300">
              <li>Receiving help through our customer support channels;</li>
              <li>Participation in customer surveys or contests; and</li>
              <li>Facilitation in the delivery of our Services and to respond to your inquiries.</li>
            </ul>
          </section>

          {/* 11. Other Regions */}
          <section id="otherlaws" className="space-y-4">
            <h3 className="text-lg font-extrabold text-white uppercase">11. Do Other Regions Have Specific Privacy Rights?</h3>
            <p className="text-slate-400 italic">In Short: You may have additional rights based on the country you reside in, such as Australia, New Zealand, or the Republic of South Africa.</p>
          </section>

          {/* 12. Updates */}
          <section id="policyupdates" className="space-y-4">
            <h3 className="text-lg font-extrabold text-white uppercase">12. Do We Make Updates To This Notice?</h3>
            <p className="text-slate-400 italic">In Short: Yes, we will update this notice as necessary to stay compliant with relevant laws.</p>
          </section>

          {/* 13. Contact */}
          <section id="contact" className="space-y-4">
            <h3 className="text-lg font-extrabold text-white uppercase">13. How Can You Contact Us About This Notice?</h3>
            <p>If you have questions or comments about this notice, you may email us at <a href="mailto:support.ceria@gmail.com" className="text-blue-400 hover:text-blue-300 hover:underline">support.ceria@gmail.com</a> or contact us by post at:</p>
            <address className="not-italic text-slate-300 p-4 bg-slate-800/50 rounded-lg inline-block border border-slate-700/50">
              Ceria<br />
              Dr Colony Bela<br />
              Bhandara, Maharashtra 441906<br />
              India
            </address>
          </section>

          {/* 14. Review/Update/Delete */}
          <section id="request" className="space-y-4">
            <h3 className="text-lg font-extrabold text-white uppercase">14. How Can You Review, Update, or Delete The Data We Collect From You?</h3>
            <p>Based on the applicable laws of your country or state of residence, you may have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information. To request to review, update, or delete your personal information, please submit a <a href="https://app.termly.io/dsar/127b638e-d47a-4603-9e18-dee8aa965859" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline">data subject access request</a>.</p>
          </section>

        </div>
        
        {/* Footer Attribution */}
        <div className="pt-8 mt-8 border-t border-slate-800 text-xs text-slate-500 text-center">
          This Privacy Policy was originally generated using Termly's Privacy Policy Generator.
        </div>

      </div>
    </div>
  );
};

export default Privacy;