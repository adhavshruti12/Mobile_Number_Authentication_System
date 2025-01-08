import React, { useState, useEffect } from 'react';
import OtpInput from 'react-otp-input';
import './PhoneAuth.css';
import mobileIcon from './assets/mobile-icon.svg';
import { auth, signInWithPhoneNumber, RecaptchaVerifier } from '../firebase';

const PhoneAuth = () => {
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false); // ✅ Track OTP verification status

  // ✅ Initialize reCAPTCHA on mount
  useEffect(() => {
    initializeRecaptcha();

    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  const initializeRecaptcha = () => {
    if (!window.recaptchaVerifier && document.getElementById('recaptcha-container')) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => console.log('✅ reCAPTCHA verified'),
        'expired-callback': () => {
          console.warn('⚠️ reCAPTCHA expired. Resetting...');
          if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
          }
        },
      });
    }
  };

  // ✅ Validate Indian Phone Number Format
  const isValidIndianPhoneNumber = (number) => {
    const indianPhoneRegex = /^\+91\d{10}$/;
    return indianPhoneRegex.test(number);
  };

  const handleSendOTP = async () => {
    setError('');
    if (!isValidIndianPhoneNumber(phoneNumber)) {
      setError('Please enter a valid Indian phone number (e.g., +919876543210).');
      return;
    }
  
    try {
      setLoading(true);
  
      if (!window.recaptchaVerifier) {
        setError('reCAPTCHA not initialized. Please refresh the page.');
        initializeRecaptcha();
        return;
      }
  
      const confirmationResult = await Promise.race([
        signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), 15000)),
      ]);
  
      window.confirmationResult = confirmationResult;
      setVerificationId(confirmationResult.verificationId);
      setOtp('');
      setStep('otp');
      alert('✅ OTP sent successfully!');
    } catch (error) {
      console.error('❌ Error sending OTP:', error);
      setError(
        error.message.includes('Timeout')
          ? 'Request timed out. Please try again.'
          : 'Failed to send OTP. Please try again.'
      );
      
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        initializeRecaptcha(); // Re-initialize after clearing
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Verify OTP
  const handleVerifyOTP = async () => {
    setError('');
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    try {
      setLoading(true);

      if (!window.confirmationResult) {
        setError('OTP not sent. Please request a new OTP.');
        return;
      }

      const credential = await Promise.race([
        window.confirmationResult.confirm(otp),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), 15000)),
      ]);

      console.log('✅ User:', credential.user);
      setIsOtpVerified(true); // ✅ Mark OTP as verified
      alert('✅ OTP Verified Successfully!');
    } catch (error) {
      console.error('❌ Error verifying OTP:', error);
      setError(error.message.includes('Timeout') ? 'Request timed out. Please try again.' : 'Failed to verify OTP.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Retry phone number step (Refresh the page)
  const handleRetryPhone = () => {
    window.location.reload(); // ✅ Refresh the page to reset everything
  };

  // ✅ Go Back to Phone Number Step
  const handleBackToPhone = () => {
    window.location.reload(); // ✅ Refresh page on back
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* ✅ Header Section */}
        <div className="auth-header">
          <img src={mobileIcon} alt="Mobile Icon" className="mobile-icon" />
          <h2>Verify Your Phone</h2>
        </div>
        <p>We will send you a one-time password</p>
        {error && <p className="error-message">{error}</p>}

        {/* ✅ Phone Number Input Step */}
        {step === 'phone' && (
          <>
            <input
              type="tel"
              placeholder="+91XXXXXXXXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={loading}
            />
            <div id="recaptcha-container"></div>
            <button id="send-otp-button" onClick={handleSendOTP} disabled={loading}>
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </>
        )}

        {/* ✅ OTP Input Step */}
        {step === 'otp' && (
          <>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              separator={<span>-</span>}
              renderInput={(props) => <input {...props} />}
              inputStyle={{
                width: '2.5rem',
                height: '2.5rem',
                margin: '0.5rem',
                fontSize: '1.5rem',
                textAlign: 'center',
                border: '1px solid rgba(0,0,0,0.3)',
                borderRadius: '4px',
              }}
            />
            <button onClick={handleVerifyOTP} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button onClick={handleRetryPhone} className="retry-button">
              Retry Phone Number
            </button>
      {/* Back Button (Visible after OTP Verification) */}
{isOtpVerified && (
  <button 
    onClick={handleBackToPhone} 
    className="back-button"
    title="Back to previous page"
  >
    Back
  </button>
)}

            
          </>
        )}
      </div>
    </div>
  );
};

export default PhoneAuth;
