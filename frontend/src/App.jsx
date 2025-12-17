import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  Briefcase, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Loader, 
  Sparkles,
  Award,
  Target,
  Zap,
  BookOpen,
  X
} from 'lucide-react';

function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (file) => {
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
      setError(null);
    } else {
      setError('Please upload a valid PDF file');
      setResumeFile(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const clearResume = () => {
    setResumeFile(null);
    setResults(null);
  };

  const analyzeResume = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      setError('Please upload a resume and enter a job description');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('job_description', jobDescription);

      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData
      });


      if (!response.ok) {
        throw new Error('Failed to analyze resume');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setResults(data);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'from-green-500 to-emerald-600';
    if (score >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-600';
  };

  const getScoreTextColor = (score) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 75) return 'Excellent Match';
    if (score >= 50) return 'Good Match';
    return 'Needs Improvement';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 50%, #FEF2F2 100%)', padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ maxWidth: '1280px', margin: '0 auto 2rem' }}>
        <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '2rem', border: '1px solid #F3F4F6' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ background: 'linear-gradient(135deg, #6366F1, #9333EA)', padding: '0.75rem', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                <Sparkles style={{ width: '32px', height: '32px', color: 'white' }} />
              </div>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', background: 'linear-gradient(to right, #6366F1, #9333EA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
                  Smart Recruitment
                </h1>
                <p style={{ color: '#6B7280', margin: '0.25rem 0 0', fontSize: '1rem' }}>AI-Powered Resume Analyzer & Job Matcher</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#ECFDF5', borderRadius: '9999px', border: '1px solid #D1FAE5' }}>
                <div style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
                <span style={{ fontSize: '0.875rem', color: '#047857', fontWeight: '500' }}>System Active</span>
              </div>
            </div>
            {/* <p style={{ fontSize: '0.875rem', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <Award style={{ width: '16px', height: '16px' }} />
              Developed by: Srijan Sasmal, Rakesh De, Soumyajit Chowdhury, Shrimanta Ghosh
            </p> */}
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div style={{ maxWidth: '1280px', margin: '0 auto 1.5rem' }}>
          <div style={{ background: '#FEF2F2', borderLeft: '4px solid #EF4444', padding: '1rem', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertCircle style={{ width: '20px', height: '20px', color: '#EF4444', flexShrink: 0 }} />
              <p style={{ color: '#B91C1C', fontWeight: '500', margin: 0 }}>{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Input Section */}
      <div style={{ maxWidth: '1280px', margin: '0 auto 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Resume Upload */}
          <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '1.5rem', border: '1px solid #F3F4F6' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1F2937' }}>
              <Upload style={{ width: '24px', height: '24px', color: '#6366F1' }} />
              Upload Your Resume
            </h2>
            
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${isDragging ? '#6366F1' : '#D1D5DB'}`,
                borderRadius: '16px',
                padding: '2rem',
                textAlign: 'center',
                transition: 'all 0.3s',
                cursor: 'pointer',
                background: isDragging ? '#EEF2FF' : 'transparent'
              }}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileUpload(e.target.files[0])}
                style={{ display: 'none' }}
                id="resume-upload"
              />
              
              {resumeFile ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ background: '#D1FAE5', padding: '1rem', borderRadius: '50%' }}>
                      <CheckCircle style={{ width: '48px', height: '48px', color: '#059669' }} />
                    </div>
                  </div>
                  <div>
                    <p style={{ color: '#047857', fontWeight: '600', fontSize: '1.125rem', wordBreak: 'break-all', padding: '0 1rem' }}>{resumeFile.name}</p>
                    <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginTop: '0.25rem' }}>
                      {(resumeFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <button
                    onClick={clearResume}
                    style={{
                      marginTop: '1rem',
                      padding: '0.5rem 1rem',
                      background: '#EF4444',
                      color: 'white',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      margin: '1rem auto 0'
                    }}
                  >
                    <X style={{ width: '16px', height: '16px' }} />
                    Remove File
                  </button>
                </div>
              ) : (
                <label htmlFor="resume-upload" style={{ cursor: 'pointer', display: 'block' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <div style={{ background: '#E0E7FF', padding: '1rem', borderRadius: '50%' }}>
                      <FileText style={{ width: '48px', height: '48px', color: '#6366F1' }} />
                    </div>
                  </div>
                  <p style={{ color: '#374151', fontWeight: '500', marginBottom: '0.5rem' }}>
                    Drop your resume here or click to browse
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>
                    PDF format only • Max 10MB
                  </p>
                </label>
              )}
            </div>
          </div>

          {/* Job Description */}
          <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '1.5rem', border: '1px solid #F3F4F6' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1F2937' }}>
              <Briefcase style={{ width: '24px', height: '24px', color: '#6366F1' }} />
              Job Description
            </h2>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the complete job description here...

Include:
- Required skills and technologies
- Years of experience needed
- Education requirements
- Key responsibilities"
              style={{
                width: '100%',
                height: '256px',
                padding: '1rem',
                border: '2px solid #E5E7EB',
                borderRadius: '12px',
                resize: 'none',
                color: '#374151',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'all 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#6366F1'}
              onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '0.25rem', margin: 0 }}>
                <Target style={{ width: '16px', height: '16px' }} />
                {jobDescription.length} characters
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Analyze Button */}
      <div style={{ maxWidth: '1280px', margin: '0 auto 3rem', textAlign: 'center' }}>
        <button
          onClick={analyzeResume}
          disabled={loading || !resumeFile || !jobDescription.trim()}
          style={{
            padding: '1rem 3rem',
            background: 'linear-gradient(to right, #6366F1, #9333EA)',
            color: 'white',
            borderRadius: '16px',
            fontWeight: 'bold',
            fontSize: '1.125rem',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            border: 'none',
            cursor: loading || !resumeFile || !jobDescription.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !resumeFile || !jobDescription.trim() ? 0.5 : 1,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            transition: 'all 0.3s'
          }}
        >
          {loading ? (
            <>
              <Loader style={{ width: '24px', height: '24px', animation: 'spin 1s linear infinite' }} />
              Analyzing Your Resume...
            </>
          ) : (
            <>
              <Zap style={{ width: '24px', height: '24px' }} />
              Analyze Match
            </>
          )}
        </button>
      </div>

      {/* Results Section - Will be shown after analysis */}
      {results && (
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', padding: '2.5rem', border: '1px solid #F3F4F6' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#1F2937' }}>
              <TrendingUp style={{ width: '32px', height: '32px', color: '#6366F1' }} />
              Overall Match Score
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '5rem',
                  fontWeight: '900',
                  background: `linear-gradient(to right, ${getScoreColor(results.overallMatch).split(' ')[0].replace('from-', '#')})`,
                  WebkitBackgroundClip: 'text',
                  // WebkitTextFillColor: 'transparent',
                  marginBottom: '1rem'
                }}>
                  {results.overallMatch}%
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '600', color: getScoreTextColor(results.overallMatch).replace('text-', '#'), display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                  <Award style={{ width: '24px', height: '24px' }} />
                  {getScoreLabel(results.overallMatch)}
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#374151', fontWeight: '600' }}>Skills Match</span>
                    <span style={{ fontWeight: 'bold', color: '#111827' }}>{results.sections.skills.score}%</span>
                  </div>
                  <div style={{ width: '100%', background: '#E5E7EB', borderRadius: '9999px', height: '12px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      background: `linear-gradient(to right, #10B981, #059669)`,
                      width: `${results.sections.skills.score}%`,
                      transition: 'width 1s ease-out',
                      borderRadius: '9999px'
                    }}></div>
                  </div>
                </div>
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#374151', fontWeight: '600' }}>Experience Match</span>
                    <span style={{ fontWeight: 'bold', color: '#111827' }}>{results.sections.experience.score}%</span>
                  </div>
                  <div style={{ width: '100%', background: '#E5E7EB', borderRadius: '9999px', height: '12px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      background: `linear-gradient(to right, #3B82F6, #2563EB)`,
                      width: `${results.sections.experience.score}%`,
                      transition: 'width 1s ease-out',
                      borderRadius: '9999px'
                    }}></div>
                  </div>
                </div>
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#374151', fontWeight: '600' }}>Education Match</span>
                    <span style={{ fontWeight: 'bold', color: '#111827' }}>{results.sections.education.score}%</span>
                  </div>
                  <div style={{ width: '100%', background: '#E5E7EB', borderRadius: '9999px', height: '12px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      background: `linear-gradient(to right, #8B5CF6, #7C3AED)`,
                      width: `${results.sections.education.score}%`,
                      transition: 'width 1s ease-out',
                      borderRadius: '9999px'
                    }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Analysis */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {/* Matched Skills */}
            <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '1.5rem', border: '1px solid #F3F4F6' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1F2937' }}>
                <CheckCircle style={{ width: '24px', height: '24px', color: '#059669' }} />
                Your Strengths
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {results.matchedSkills.length > 0 ? (
                  results.matchedSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'linear-gradient(to right, #10B981, #059669)',
                        color: 'white',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                      }}
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p style={{ color: '#9CA3AF', fontStyle: 'italic' }}>No matched skills detected</p>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '1.5rem', border: '1px solid #F3F4F6' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1F2937' }}>
                <AlertCircle style={{ width: '24px', height: '24px', color: '#DC2626' }} />
                Skills to Develop
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {results.missingSkills.length > 0 ? (
                  results.missingSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'linear-gradient(to right, #EF4444, #DC2626)',
                        color: 'white',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                      }}
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p style={{ color: '#059669', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle style={{ width: '20px', height: '20px' }} />
                    All key skills covered!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '2rem', border: '1px solid #F3F4F6' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#1F2937' }}>
              <BookOpen style={{ width: '28px', height: '28px', color: '#6366F1' }} />
              Personalized Recommendations
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {results.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '1.25rem',
                    background: 'linear-gradient(to right, #EEF2FF, #F5F3FF)',
                    borderRadius: '12px',
                    border: '1px solid #E0E7FF'
                  }}
                >
                  <div style={{ flexShrink: 0 }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, #6366F1, #9333EA)',
                      color: 'white',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.125rem',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                    }}>
                      {idx + 1}
                    </div>
                  </div>
                  <p style={{ color: '#374151', flex: 1, paddingTop: '0.5rem', lineHeight: '1.625', margin: 0 }}>{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;