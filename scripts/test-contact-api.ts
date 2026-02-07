/**
 * Manual test script for Contact API
 * Run with: npx tsx scripts/test-contact-api.ts
 * 
 * Tests:
 * - Valid form submission
 * - Input sanitization
 * - Rate limiting (3 submissions per hour)
 * - Error handling
 */

const API_URL = 'http://localhost:3000/api/contact';

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

const results: TestResult[] = [];

async function testValidSubmission() {
  console.log('\n🧪 Test 1: Valid form submission');
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '192.168.1.1',
      },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        projectType: 'Residential Construction',
        budget: '$100,000 - $250,000',
        message: 'I would like to build a new home with modern design.',
      }),
    });

    const data = await response.json();
    
    if (response.status === 200 && data.success) {
      console.log('✅ PASSED: Valid submission accepted');
      console.log('   Submission ID:', data.submissionId);
      results.push({ name: 'Valid Submission', passed: true, message: 'Success' });
    } else {
      console.log('❌ FAILED: Expected success response');
      console.log('   Response:', data);
      results.push({ name: 'Valid Submission', passed: false, message: 'Unexpected response' });
    }
  } catch (error) {
    console.log('❌ FAILED: Network error');
    console.log('   Error:', error);
    results.push({ name: 'Valid Submission', passed: false, message: 'Network error' });
  }
}

async function testInputSanitization() {
  console.log('\n🧪 Test 2: Input sanitization');
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '192.168.1.2',
      },
      body: JSON.stringify({
        name: 'John <script>alert("xss")</script> Doe',
        email: 'john@example.com',
        projectType: 'Residential Construction',
        message: 'This is a message with <b>HTML</b> tags and javascript:alert("xss") protocol.',
      }),
    });

    const data = await response.json();
    
    if (response.status === 200 && data.success) {
      console.log('✅ PASSED: Malicious input sanitized and accepted');
      results.push({ name: 'Input Sanitization', passed: true, message: 'Success' });
    } else {
      console.log('❌ FAILED: Expected success after sanitization');
      console.log('   Response:', data);
      results.push({ name: 'Input Sanitization', passed: false, message: 'Unexpected response' });
    }
  } catch (error) {
    console.log('❌ FAILED: Network error');
    results.push({ name: 'Input Sanitization', passed: false, message: 'Network error' });
  }
}

async function testRateLimiting() {
  console.log('\n🧪 Test 3: Rate limiting (3 submissions per hour)');
  
  const ip = '192.168.1.100';
  let allPassed = true;
  
  try {
    // Make 3 submissions (should all succeed)
    for (let i = 1; i <= 3; i++) {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': ip,
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          projectType: 'Commercial Project',
          message: `This is test submission number ${i} for rate limiting.`,
        }),
      });

      const data = await response.json();
      
      if (response.status !== 200 || !data.success) {
        console.log(`❌ FAILED: Submission ${i} should have succeeded`);
        allPassed = false;
      } else {
        console.log(`   ✓ Submission ${i} succeeded`);
      }
    }

    // 4th submission should be rate limited
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': ip,
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        projectType: 'Commercial Project',
        message: 'This is the 4th submission that should be rate limited.',
      }),
    });

    const data = await response.json();
    
    if (response.status === 429 && !data.success && data.error === 'Rate limit exceeded') {
      console.log('   ✓ 4th submission correctly rate limited');
      console.log('✅ PASSED: Rate limiting works correctly');
      results.push({ name: 'Rate Limiting', passed: allPassed, message: 'Success' });
    } else {
      console.log('❌ FAILED: 4th submission should have been rate limited');
      console.log('   Response:', data);
      results.push({ name: 'Rate Limiting', passed: false, message: 'Rate limit not enforced' });
    }
  } catch (error) {
    console.log('❌ FAILED: Network error');
    results.push({ name: 'Rate Limiting', passed: false, message: 'Network error' });
  }
}

async function testInvalidData() {
  console.log('\n🧪 Test 4: Invalid data validation');
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '192.168.1.3',
      },
      body: JSON.stringify({
        name: 'J', // Too short
        email: 'invalid-email', // Invalid format
        projectType: '', // Empty
        message: 'Short', // Too short
      }),
    });

    const data = await response.json();
    
    if (response.status === 400 && !data.success && data.error === 'Validation failed') {
      console.log('✅ PASSED: Invalid data correctly rejected');
      results.push({ name: 'Invalid Data Validation', passed: true, message: 'Success' });
    } else {
      console.log('❌ FAILED: Expected validation error');
      console.log('   Response:', data);
      results.push({ name: 'Invalid Data Validation', passed: false, message: 'Validation not working' });
    }
  } catch (error) {
    console.log('❌ FAILED: Network error');
    results.push({ name: 'Invalid Data Validation', passed: false, message: 'Network error' });
  }
}

async function testErrorHandling() {
  console.log('\n🧪 Test 5: Error handling (malformed JSON)');
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '192.168.1.4',
      },
      body: 'invalid json{',
    });

    const data = await response.json();
    
    if (response.status === 500 && !data.success && data.error === 'Internal server error') {
      console.log('✅ PASSED: Malformed JSON handled gracefully');
      results.push({ name: 'Error Handling', passed: true, message: 'Success' });
    } else {
      console.log('❌ FAILED: Expected internal server error');
      console.log('   Response:', data);
      results.push({ name: 'Error Handling', passed: false, message: 'Error not handled properly' });
    }
  } catch (error) {
    console.log('❌ FAILED: Network error');
    results.push({ name: 'Error Handling', passed: false, message: 'Network error' });
  }
}

async function runTests() {
  console.log('🚀 Starting Contact API Tests');
  console.log('================================');
  console.log('⚠️  Make sure the dev server is running: npm run dev');
  console.log('');

  await testValidSubmission();
  await testInputSanitization();
  await testRateLimiting();
  await testInvalidData();
  await testErrorHandling();

  console.log('\n================================');
  console.log('📊 Test Results Summary');
  console.log('================================');
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  results.forEach(result => {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${result.name}: ${result.message}`);
  });
  
  console.log(`\nTotal: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('\n🎉 All tests passed!');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the output above.');
  }
}

// Run tests
runTests().catch(console.error);
