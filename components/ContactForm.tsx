'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { z } from 'zod';
import Confetti from './Confetti';

// Stricter email validation regex
// Requires: local-part @ domain . tld
// - Local part: alphanumeric, dots, hyphens, underscores (must start/end with alphanumeric)
// - Domain: alphanumeric and hyphens (must start/end with alphanumeric)
// - TLD: at least 2 letters
const EMAIL_REGEX = /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

// Zod validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string()
    .min(1, 'Email is required')
    .regex(EMAIL_REGEX, 'Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').optional().or(z.literal('')),
  projectType: z.string().min(1, 'Please select a project type'),
  budget: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message is too long'),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface FormErrors {
  [key: string]: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    budget: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    try {
      contactSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            newErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 429) {
          // Rate limit exceeded
          setErrors({ submit: data.message || 'Too many submissions. Please try again later.' });
        } else if (response.status === 400) {
          // Validation error
          setErrors({ submit: data.message || 'Please check your input and try again.' });
        } else {
          // Server error
          setErrors({ submit: data.message || 'Something went wrong. Please try again.' });
        }
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus('idle'), 5000);
        return;
      }

      // Success
      setSubmitStatus('success');
      setShowConfetti(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        projectType: '',
        budget: '',
        message: '',
      });
      
      // Reset success message and confetti after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
        setShowConfetti(false);
      }, 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ submit: 'Network error. Please check your connection and try again.' });
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const projectTypes = [
    'Residential Construction',
    'Commercial Project',
    'Industrial Facility',
    'Renovation & Remodeling',
    'Infrastructure Development',
    'Construction Consulting',
    'Other',
  ];

  const budgetRanges = [
    'Under $50,000',
    '$50,000 - $100,000',
    '$100,000 - $250,000',
    '$250,000 - $500,000',
    '$500,000 - $1,000,000',
    'Over $1,000,000',
    'Not Sure',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Confetti Animation on Success */}
      {showConfetti && <Confetti />}
      
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onFocus={() => setFocusedField('name')}
          onBlur={() => setFocusedField(null)}
          className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:outline-none transition-all duration-300 ${
            errors.name
              ? 'border-red-500 focus:border-red-500'
              : focusedField === 'name'
              ? 'border-gold focus:border-gold shadow-lg shadow-gold/20 animate-input-focus'
              : 'border-gray-700 focus:border-gold'
          }`}
          placeholder="John Doe"
        />
        {errors.name && <p className="mt-2 text-sm text-red-500 animate-shake">{errors.name}</p>}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField(null)}
          className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:outline-none transition-all duration-300 ${
            errors.email
              ? 'border-red-500 focus:border-red-500'
              : focusedField === 'email'
              ? 'border-gold focus:border-gold shadow-lg shadow-gold/20 animate-input-focus'
              : 'border-gray-700 focus:border-gold'
          }`}
          placeholder="john@example.com"
        />
        {errors.email && <p className="mt-2 text-sm text-red-500 animate-shake">{errors.email}</p>}
      </div>

      {/* Phone Field */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          onFocus={() => setFocusedField('phone')}
          onBlur={() => setFocusedField(null)}
          className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:outline-none transition-all duration-300 ${
            errors.phone
              ? 'border-red-500 focus:border-red-500'
              : focusedField === 'phone'
              ? 'border-gold focus:border-gold shadow-lg shadow-gold/20 animate-input-focus'
              : 'border-gray-700 focus:border-gold'
          }`}
          placeholder="+1 (555) 123-4567"
        />
        {errors.phone && <p className="mt-2 text-sm text-red-500 animate-shake">{errors.phone}</p>}
      </div>

      {/* Project Type Field */}
      <div>
        <label htmlFor="projectType" className="block text-sm font-medium text-gray-300 mb-2">
          Project Type *
        </label>
        <select
          id="projectType"
          name="projectType"
          value={formData.projectType}
          onChange={handleChange}
          onFocus={() => setFocusedField('projectType')}
          onBlur={() => setFocusedField(null)}
          className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:outline-none transition-all duration-300 ${
            errors.projectType
              ? 'border-red-500 focus:border-red-500'
              : focusedField === 'projectType'
              ? 'border-gold focus:border-gold shadow-lg shadow-gold/20 animate-input-focus'
              : 'border-gray-700 focus:border-gold'
          }`}
        >
          <option value="">Select a project type</option>
          {projectTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.projectType && <p className="mt-2 text-sm text-red-500 animate-shake">{errors.projectType}</p>}
      </div>

      {/* Budget Field */}
      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-2">
          Estimated Budget
        </label>
        <select
          id="budget"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          onFocus={() => setFocusedField('budget')}
          onBlur={() => setFocusedField(null)}
          className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:outline-none transition-all duration-300 ${
            focusedField === 'budget'
              ? 'border-gold focus:border-gold shadow-lg shadow-gold/20 animate-input-focus'
              : 'border-gray-700 focus:border-gold'
          }`}
        >
          <option value="">Select a budget range</option>
          {budgetRanges.map((range) => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </select>
      </div>

      {/* Message Field */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
          Project Details *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          onFocus={() => setFocusedField('message')}
          onBlur={() => setFocusedField(null)}
          rows={5}
          className={`w-full px-4 py-3 bg-gray-900 border rounded-lg focus:outline-none transition-all duration-300 resize-none ${
            errors.message
              ? 'border-red-500 focus:border-red-500'
              : focusedField === 'message'
              ? 'border-gold focus:border-gold shadow-lg shadow-gold/20 animate-input-focus'
              : 'border-gray-700 focus:border-gold'
          }`}
          placeholder="Tell us about your project..."
        />
        {errors.message && <p className="mt-2 text-sm text-red-500 animate-shake">{errors.message}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-4 px-8 rounded-lg font-bold text-lg transition-all duration-300 ${
          isSubmitting
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-gold text-black hover:bg-gold-light hover:scale-105 hover:shadow-2xl hover:shadow-gold/50'
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Sending...
          </span>
        ) : (
          'Send Message'
        )}
      </button>

      {/* Success/Error Messages */}
      {submitStatus === 'success' && (
        <div className="p-4 bg-green-900/50 border border-green-500 rounded-lg text-green-300 animate-celebrate">
          <div className="flex items-center gap-3">
            <div className="text-3xl animate-pulse-success">🎉</div>
            <div>
              <p className="font-semibold text-lg">✓ Message sent successfully!</p>
              <p className="text-sm mt-1">We'll get back to you within 24 hours.</p>
            </div>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-300 animate-shake">
          <p className="font-semibold">✗ Something went wrong</p>
          <p className="text-sm mt-1">{errors.submit || 'Please try again or contact us directly.'}</p>
        </div>
      )}
    </form>
  );
}
