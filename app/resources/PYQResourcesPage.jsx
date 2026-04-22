"use client";
import Link from 'next/link';
import { useRouter, useParams, usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import styles from "./PYQResourcesPage.module.css";
import { 
  Download, 
  FileText, 
  ArrowLeft, 
  LayoutGrid, 
  CalendarDays, 
  Search, 
  Sparkles, 
  AlertCircle,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { PYQ_DATA } from '@/data/resourceData';

const MigrationNotice = () => (
  <div style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '15px 20px', borderRadius: '8px', margin: '20px 5%', border: '1px solid #ffeeba', fontFamily: 'inherit', lineHeight: '1.6', position: 'relative', zIndex: 10 }}>
    <h3 style={{ marginTop: 0, marginBottom: '10px', color: '#856404', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
      <AlertCircle size={20} /> Important Migration Notice
    </h3>
    <p style={{ marginBottom: '10px', fontSize: '0.95rem' }}>
      We have recently migrated this portal from React JS to Next.js, and the setup is currently under migration. If you are experiencing any technical issues (e.g., while giving mock tests), please use the old portal: <a href="https://mathemsolvex.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: '#0056b3', textDecoration: 'underline', fontWeight: 'bold' }}>https://mathemsolvex.vercel.app/</a>
    </p>
    <p style={{ margin: 0, fontSize: '0.95rem' }}>
      If you have suggestions or want to help with the migration process, please contact the developer via LinkedIn: <a href="https://www.linkedin.com/in/vivek33pal" target="_blank" rel="noopener noreferrer" style={{ color: '#0056b3', textDecoration: 'underline', fontWeight: 'bold' }}>Vivek Kumar</a> or WhatsApp: <a href="https://wa.me/919354368207" target="_blank" rel="noopener noreferrer" style={{ color: '#0056b3', textDecoration: 'underline', fontWeight: 'bold' }}>+91 9354368207</a>. We are working hard to help you out. Best of luck ❤️! <br />— Vivek Kumar
    </p>
  </div>
);

const PYQResourcesPage = () => {
  const { examName } = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const [viewType, setViewType] = useState('yearwise'); // 'yearwise' or 'topicwise'
  const [searchTerm, setSearchTerm] = useState('');

  // Reset view to yearwise when exam changes to avoid stuck states
  useEffect(() => {
    setViewType('yearwise');
    setSearchTerm('');
  }, [examName]);

  // Robust exam lookup logic
  const decodedExamName = decodeURIComponent(examName || "");
  const matchedKey = Object.keys(PYQ_DATA).find(key => {
    const k = key.toUpperCase();
    const d = decodedExamName.toUpperCase();
    return k === d || 
           k.replace(/-/g, ' ') === d || 
           k === d.replace(/-/g, ' ') ||
           k.replace(/[- ]/g, '') === d.replace(/[- ]/g, '');
  });
  
  const currentExamData = PYQ_DATA[matchedKey];
  const formattedExamName = matchedKey || decodedExamName.replace(/-/g, ' ');

  // --- 1. LANDING PAGE VIEW (No exam selected) ---
  if (!examName) {
    const landingJsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Where can I find MCA entrance previous year papers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can find all official MCA entrance papers for NIMCET, CUET PG, JAMIA, and more at Mathem Solvex Resource Center."
          }
        }
      ]
    };

    return (
      <div className={styles.container}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(landingJsonLd) }}
        />
        
        {/* Immersive Background Elements */}
        <div className={styles.meshGlow}></div>
        <div className={styles.particle1}></div>
        <div className={styles.particle2}></div>
        <div className={styles.particle3}></div>
        
        <MigrationNotice />
        
        <header className={styles.heroSection}>
          <div className={styles.heroBadge}>
            <div className={styles.pulsePoint}></div>
            <span>Premium Resource Library</span>
          </div>
          <h1 className={styles.heroTitle}>
            Master Your Exam with <span>Official PYQs</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Direct access to official previous year question papers. Verified, categorized, and optimized for your high-performance preparation.
          </p>
          
          <div className={styles.heroStats}>
            <div className={styles.heroStatItem}>
               <strong>15+</strong>
               <span>Exams</span>
            </div>
            <div className={styles.heroStatItem}>
               <strong>500+</strong>
               <span>PDF Papers</span>
            </div>
            <div className={styles.heroStatItem}>
               <strong>10K+</strong>
               <span>Learners</span>
            </div>
          </div>
        </header>
        
        <section className={styles.examGrid}>
          {Object.keys(PYQ_DATA).map((exam, index) => {
            const data = PYQ_DATA[exam];
            const totalPapers = (data.yearwise?.length || 0) + (data.topicwise?.length || 0);
            
            return (
              <Link href={`/resources/${exam}`} 
                key={exam} 
                className={styles.pExamCard}
                style={{ '--index': index }}
              >
                <div className={styles.cardAura}></div>
                <div className={styles.cardHeader}>
                  <div className={styles.cardIconWrapper}>
                    <BookOpen size={28} />
                  </div>
                  <span className={styles.verifyBadge}>VERIFIED</span>
                </div>
                <div className={styles.cardBody}>
                  <h2>{exam}</h2>
                  <p>Access specialized year-wise and topic-wise official papers for {exam} preparation.</p>
                  <div className={styles.metaPills}>
                    <span className={styles.pill}><FileText size={12} /> {totalPapers} Resources</span>
                    <span className={styles.pill}><Sparkles size={12} /> Free Access</span>
                  </div>
                </div>
                <div className={styles.cardAction}>
                  <span>Explore Papers</span>
                  <div className={styles.arrowBox}>
                    <ArrowLeft size={16} />
                  </div>
                </div>
              </Link>
            );
          })}
        </section>

        {/* Optimized FAQ Section (Accordion Style) */}
        <section className={styles.faqSection}>
          <div className={styles.faqHeader}>
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about our study materials and papers.</p>
          </div>
          
          <div className={styles.faqAccordion}>
            <details>
              <summary>Are these official previous year question papers?</summary>
              <p>Yes, all PDF resources provided in our center are verified official question papers from the respective exam conducting bodies like NITs for NIMCET and NTA for CUET PG.</p>
            </details>
            
            <details>
              <summary>How can I download the NIMCET Previous Year Papers?</summary>
              <p>Simply select 'NIMCET' from the exam grid above. You will find a list of papers from 2008 to 2024. Click on 'Download' or 'Open' to access the PDF immediately.</p>
            </details>
            
            <details>
              <summary>Do you provide solutions with these papers?</summary>
              <p>We primarily provide original question papers to aid your practice. For detailed step-by-step solutions and video explanations, you can check our Question Library or Latest Updates section.</p>
            </details>
            
            <details>
              <summary>Is there any fee for downloading these resources?</summary>
              <p>No, Mathem Solvex provides all previous year question papers and basic study materials 100% free of charge to help students in their preparation.</p>
            </details>
            
            <details>
              <summary>Which MCA entrance exams are covered here?</summary>
              <p>We cover all major MCA entrance exams including NIMCET, CUET PG, MAH-CET, WB-JECA, VITMEE, JAMIA, and AMU, with papers updated for the current year.</p>
            </details>

            <details>
              <summary>Can I practice these papers as live tests?</summary>
              <p>Yes! For most year-wise papers, we have a 'Live Test' feature that allows you to solve the paper in a real exam environment with a timer and automated marking.</p>
            </details>
          </div>
        </section>

        {/* Trust Section */}
        <div className={styles.trustFooter}>
          <div className={styles.trustItem}>
             <Download size={24} />
             <div>
               <strong>50K+</strong>
               <span>Downloads</span>
             </div>
          </div>
          <div className={styles.trustSeparator}></div>
          <div className={styles.trustItem}>
             <LayoutGrid size={24} />
             <div>
               <strong>15+</strong>
               <span>Exams Covered</span>
             </div>
          </div>
          <div className={styles.trustSeparator}></div>
          <div className={styles.trustItem}>
             <Sparkles size={24} />
             <div>
               <strong>100%</strong>
               <span>Official Papers</span>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. DETAIL PAGE VIEW (Exam selected) ---
  
  // 404 Handling
  if (!currentExamData) {
    return (
      <div className={styles.container}>
         <div className={styles.emptyContainer}>
            <AlertCircle size={48} color="#FF5E0E" />
            <h2>Exam Not Found</h2>
            <p>We couldn't find resources for "{formattedExamName}".</p>
            <Link href="/resources" className={styles.pDownloadBtn} style={{marginTop: '20px'}}>Back to All Exams</Link>
         </div>
      </div>
    );
  }

  const hasYearWise = currentExamData.yearwise && currentExamData.yearwise.length > 0;
  const hasTopicWise = currentExamData.topicwise && currentExamData.topicwise.length > 0;
  const currentList = currentExamData[viewType] || [];
  const filteredData = currentList.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const detailJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": `${formattedExamName} Previous Year Question Papers`,
    "description": `Official ${formattedExamName} previous year question papers in PDF format for free download and practice.`,
    "distribution": currentList.map(item => ({
      "@type": "DataDownload",
      "encodingFormat": "application/pdf",
      "contentUrl": item.url,
      "name": item.title
    }))
  };

  return (
    <div className={styles.container}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(detailJsonLd) }}
      />
      <div className={styles.meshGlow}></div>
      <div className={styles.particle1}></div>
      <div className={styles.particle2}></div>

      {/* Navigation Bar */}
      <div className={styles.topNav}>
        <Link href="/resources" className={styles.backBtn}>
          <ArrowLeft size={18} /> <span>All Exams</span>
        </Link>
        <div className={styles.breadcrumb}>
          <span>Resources</span> / <span className={styles.activeCrumb}>{formattedExamName}</span>
        </div>
      </div>

      <MigrationNotice />

      <div className={styles.detailHeader}>
        <div className={styles.headerTitleArea}>
          <div className={styles.examTag}>OFFICIAL ARCHIVE</div>
          <h1>{formattedExamName} <span>Resources</span></h1>
          <p>Download year-wise and topic-wise official papers for {formattedExamName}.</p>
        </div>
        
        <div className={styles.detailControls}>
           {currentList.length > 3 && (
            <div className={styles.detailSearch}>
              <Search size={18} className={styles.searchIcon}/>
              <input 
                type="text" 
                placeholder={`Search papers...`} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
           )}

          {hasTopicWise && hasYearWise && (
            <div className={styles.modernToggle}>
              <button 
                className={`${styles.mToggleBtn} ${viewType === 'yearwise' ? styles.mActive : ''}`}
                onClick={() => setViewType('yearwise')}
              >
                <CalendarDays size={18} /> <span>Year-wise</span>
              </button>
              <button 
                className={`${styles.mToggleBtn} ${viewType === 'topicwise' ? styles.mActive : ''}`}
                onClick={() => setViewType('topicwise')}
              >
                <LayoutGrid size={18} /> <span>Topic-wise</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.resourceGrid}>
        {filteredData.length > 0 ? (
          filteredData.map((pdf, idx) => (
            <div key={pdf.id} className={`${styles.premiumPdfCard} ${pdf.isSpecial ? styles.isSpecial : ''}`} style={{'--i': idx}}>
              <div className={styles.pdfInner}>
                <div className={styles.pdfMain}>
                  <div className={styles.pdfVisual}>
                    <div className={styles.pdfIconCircle}>
                      <FileText size={24} />
                    </div>
                    {pdf.isNew && <span className={styles.newIndicator}>NEW</span>}
                  </div>
                  <div className={styles.pdfMeta}>
                      <h3>{pdf.title}</h3>
                      <div className={styles.metaRow}>
                        {pdf.year ? (
                          <span className={styles.yearTag}><CalendarDays size={12} /> {pdf.year}</span>
                        ) : (
                          <span className={styles.topicTag}><LayoutGrid size={12} /> Topic Wise</span>
                        )}
                        <span className={styles.verifiedTag}><CheckCircle2 size={12} /> Official PDF</span>
                      </div>
                      {pdf.description && <p className={styles.pdfDesc}>{pdf.description}</p>}
                  </div>
                </div>
                
                <div className={styles.pdfActions}>
                  {pdf.year ? (
                    <Link href={`/test?exam=${encodeURIComponent(formattedExamName)}&year=${pdf.year}`} className={styles.pSolveBtn}>
                      <Sparkles size={16} /> <span>Live Test</span>
                    </Link>
                  ) : (
                    <div className={styles.topicTestButtons}>
                      {[1, 2, 3, 4, 5].map(testNum => {
                        // Determine subject for better filtering
                        let subj = "";
                        const t = pdf.title.toLowerCase();
                        if (formattedExamName === "NIMCET") subj = "Mathematics";
                        else if (formattedExamName === "CUET PG") {
                          if (t.includes("computer")) subj = "Computer";
                          else if (t.includes("mathematics")) subj = "Mathematics";
                          else if (t.includes("reasoning")) subj = "Logical Reasoning";
                        }
                        
                        // Use search for better matching of display titles, but keep topic for backend compatibility
                        // Also include subject to prevent "other topic" questions from appearing
                        const href = `/test?exam=${encodeURIComponent(formattedExamName)}${subj ? `&subject=${encodeURIComponent(subj)}` : ""}&search=${encodeURIComponent(pdf.title)}&page=${testNum}&limit=20`;
                        
                        return (
                          <Link 
                            key={testNum}
                            href={href} 
                            className={styles.pTopicTestBtn}
                          >
                            Test {testNum}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                  <a href={pdf.url} target={pdf.openInSamePage ? "_self" : "_blank"} rel="noopener noreferrer" className={styles.pDownloadBtn}>
                    {pdf.openInSamePage ? <BookOpen size={18} /> : <Download size={18} />} 
                    <span>{pdf.openInSamePage ? "Open" : "Download"}</span>
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyContainer}>
            <div className={styles.emptyIcon}><Search size={48} /></div>
            <h3>No results for "{searchTerm}"</h3>
            <p>Try different keywords or browse other categories.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PYQResourcesPage;