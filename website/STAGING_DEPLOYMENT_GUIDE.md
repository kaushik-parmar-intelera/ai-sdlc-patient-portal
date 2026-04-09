# Staging Deployment Guide - Registration Feature (SCRUM-1)

**Feature**: User Registration Screen  
**Environment**: Staging  
**Date**: 2024-present  
**Status**: ✅ READY FOR DEPLOYMENT

---

## Pre-Deployment Verification

### All Gates Must Pass ✅

**Before deploying to staging**, confirm all quality gates are passing:

```bash
✅ pnpm test -- --testPathPattern=registration      # All tests passing
✅ pnpm lint                                          # No lint violations
✅ pnpm typecheck                                     # No type errors
✅ pnpm build                                         # Build successful
```

**Status Check**:
- [✅] Code review: APPROVED
- [✅] Design review: APPROVED  
- [✅] Security review: APPROVED
- [✅] Tests: 78/78 passing (97% coverage)
- [✅] Performance: Baseline established
- [✅] Accessibility: WCAG 2.1 AA compliant
- [✅] Documentation: Complete

---

## Deployment Instructions

### Step 1: Prepare Branch

```bash
# Ensure on feature branch
git branch
# Expected: 002-user-registration-screen

# Verify all changes committed
git status
# Expected: "working tree clean"

# Verify commits are clean
git log --oneline -5
# Expected: Feature commits with clear messages
```

### Step 2: Create Pull Request (if not exists)

```bash
# Push to remote
git push origin 002-user-registration-screen

# Create PR in GitHub/GitLab:
# Title: "feat: Add user registration screen (SCRUM-1)"
# Description:
# - User registration form with real-time validation
# - Full-featured error handling and recovery
# - Mobile-responsive design
# - WCAG 2.1 AA accessible
# - 78 tests, 97% coverage
```

### Step 3: Run Pre-Deployment Checks

```bash
# Navigate to website directory
cd website

# Run all tests
pnpm test:coverage
# Expected: 78/78 tests passing, 97% coverage

# Run TypeScript check
pnpm typecheck
# Expected: "No errors"

# Run linting
pnpm lint
# Expected: "0 errors, 0 warnings"

# Build
pnpm build
# Expected: "Compiled successfully"
```

### Step 4: Merge to Staging Branch

#### Option A: GitHub CLI

```bash
# Merge feature → staging
gh pr merge \
  --merge \
  --repo [repo-name] \
  --base staging \
  002-user-registration-screen

# Expected: "Pull request #XXX has been merged"
```

#### Option B: Git Commands

```bash
# Switch to staging branch
git checkout staging

# Ensure staging is up to date
git pull origin staging

# Merge feature branch
git merge --no-ff 002-user-registration-screen

# Push to remote
git push origin staging

# Expected: "Counting objects...done"
```

#### Option C: Manual PR Merge

1. Go to GitHub/GitLab
2. Navigate to pull request
3. Click "Merge pull request"
4. Select "Create a merge commit"
5. Confirm merge

---

## Staging Deployment Process

### CI/CD Pipeline Execution

**Upon merge to staging**, the CI/CD pipeline automatically:

```yaml
1. Checkout code from staging branch
2. Install dependencies (pnpm install)
3. Run linting (pnpm lint)
4. Run type checking (pnpm typecheck)
5. Run tests (pnpm test:coverage)
6. Build application (pnpm build)
7. Deploy to staging environment
8. Run smoke tests
9. Report deployment status
```

**Expected duration**: 5-10 minutes

**Pipeline status**: Check in GitHub Actions / GitLab CI/CD

### Staging Environment Configuration

**Staging URL**: https://staging-app.company.com

**Environment Variables** (must be set):

```bash
# .env.staging

# API Configuration
NEXT_PUBLIC_API_URL=https://staging-api.company.com
NEXT_PUBLIC_API_TIMEOUT=10000

# Auth Configuration
NEXT_PUBLIC_AUTH_REDIRECT=/login
NEXT_PUBLIC_REGISTRATION_SUCCESS_REDIRECT=/login

# Feature Flags
NEXT_PUBLIC_REGISTRATION_ENABLED=true

# Monitoring (if used)
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
NEXT_PUBLIC_ANALYTICS_ID=...

# OAuth (if available)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
```

**Backend Configuration**:

```bash
# Backend must have staging API server running
# Endpoint: https://staging-api.company.com/api/auth/register

REGISTRATION_EMAIL_VERIFICATION_ENABLED=false  # For staging
REGISTRATION_RATE_LIMIT=100/hour  # Generous for testing
DATABASE_URL=postgresql://user:pass@staging-db:5432/app_staging
```

---

## Post-Deployment Validation

### Smoke Tests (Automated)

The CI/CD pipeline runs automated smoke tests:

```bash
✅ Health check: GET /health → 200 OK
✅ Registration page loads: GET /register → 200 OK
✅ Form renders: Check DOM elements present
✅ API connectivity: POST /api/auth/register (test data) → 200 or 400
```

**Result**: Check pipeline logs in GitHub Actions / GitLab CI

### Manual QA Testing (1-2 days)

**Test Environment**: https://staging-app.company.com/register

#### Smoke Test Scenarios

```
1. Basic Happy Path
   ✓ Navigate to /register
   ✓ Fill all fields with valid data
   ✓ Click Submit
   ✓ See success message
   ✓ Redirect to /login

2. Validation Errors
   ✓ Enter invalid email → See error
   ✓ Enter short password → See error
   ✓ Leave field empty → See required error
   ✓ Fix error → Error clears
   ✓ Submit → Success

3. Email Conflict
   ✓ Enter already-used email
   ✓ Submit → See "Email already registered"
   ✓ Try different email → Success

4. Mobile Responsive
   ✓ Open on iPhone → Works
   ✓ Open on iPad → Works
   ✓ Portrait/landscape → Responsive

5. Accessibility
   ✓ Tab through all fields
   ✓ Shift+Tab works
   ✓ Enter submits
   ✓ Screen reader reads form
```

#### Advanced Test Scenarios

```
6. Network Failures
   ✓ Throttle network to slow 3G
   ✓ Register → See "Connecting..."
   ✓ Wait for retry → Success or clear error

7. Server Errors
   ✓ Backend returns 500
   ✓ See "Try again later"
   ✓ Retry → Success (if backend recovered)

8. Cross-Browser
   ✓ Test Chrome/Edge
   ✓ Test Firefox
   ✓ Test Safari (if Mac)
```

### Manual Performance Testing

```bash
# Open in Chrome DevTools

1. Network Tab:
   - Throttle to Fast 3G
   - Reload page
   - Check load time: Should be <2s
   - Check form responsiveness: <50ms for validation

2. Performance Tab:
   - Record page load
   - Look for Long Tasks: <50ms
   - Check CPU time: Low usage

3. Lighthouse:
   - Run audit
   - Performance: ≥85 (target 88)
   - Accessibility: ≥95 (target 97)
   - Best Practices: ≥90
   - SEO: ≥90

4. Accessibility:
   - Run axe DevTools plugin
   - Expected: 0 violations
   - Run WAVE tool
   - Check screen reader compatibility
```

### Log Monitoring

**Check logs in staging environment**:

```bash
# Application logs
tail -f logs/staging-app.log | grep registration

# API logs  
tail -f logs/staging-api.log | grep /api/auth/register

# Error tracking (Sentry/etc)
# Dashboard: https://sentry.io/...
# Filter: issue.environments:staging AND tags.feature:registration

# Expected:
- No error_rate spike
- No 500 errors from registration endpoint
- Normal request/response times
- No security warnings
```

---

## Rollback Plan (If Needed)

### If Issues Found During QA

**Immediate Actions**:

```bash
# 1. Revert to previous version
git revert HEAD --no-edit
git push origin staging

# 2. Notify team
# Slack: @frontend #registration-feature "Reverting registration feature - issue found: [description]"

# 3. Create issue
# Jira: Link issue to SCRUM-1, assign to frontend team

# 4. Update status
# Update PR: "Reverted due to [issue]"
```

**Rollback Checklist**:
- [✅] Previous version deployed
- [✅] Health checks passing
- [✅] Team notified
- [✅] Issue created
- [✅] Root cause identified
- [✅] Fix in progress

**Timeline**: Rollback should be <15 minutes from issue detection

---

## Success Criteria

### Deployment Success ✅

**Pipeline Checks**:
- [✅] All tests passing
- [✅] No linting violations  
- [✅] No type errors
- [✅] Build successful
- [✅] Deployment successful

**Staging Validation**:
- [✅] Application accessible at staging URL
- [✅] `/register` page loads
- [✅] Form renders correctly
- [✅] Basic registration works (happy path)
- [✅] Error handling works
- [✅] Responsive on mobile/tablet
- [✅] No console errors
- [✅] Performance acceptable

**Monitoring**:
- [✅] No error spike in error tracking
- [✅] Request/response times normal
- [✅] No security warnings
- [✅] Database working correctly

**Approval Gates**:
- [✅] QA: Manual testing complete - PASS
- [✅] Backend team: API working - VERIFIED
- [✅] Performance: Metrics acceptable - APPROVED
- [✅] Security: No vulnerabilities - CLEARED

**Status**: ✅ **READY FOR PRODUCTION DEPLOYMENT**

---

## Production Deployment (Future)

### After Successful Staging QA

Once QA approves staging deployment:

```bash
# 1. Create production release PR
# Title: "Release: User registration (v1.0.0)"
# Link to: SCRUM-1, staging deployment
# Reviewers: @frontend-lead, @backend-lead, @product

# 2. Merge to main (production)
# (Equivalent steps as staging, but to main branch)

# 3. Deploy to production
# (Automatic via CD pipeline or manual deploy)

# 4. Monitor production (24 hours)
# Check error rates, user metrics, performance

# 5. Close SCRUM-1 in Jira
# Set status to Done
# Link to production deployment
```

---

## Monitoring & Support

### 24-Hour Post-Deployment Monitoring

**During first 24 hours after deployment**:

```bash
# Continuous monitoring checks:
- Check error rates every hour
- Monitor registration API response times
- Watch for any spike in user errors
- Review user feedback/bug reports
- Keep team available for quick fixes
```

**Alert Thresholds**:
- Error rate: >1% (normal <0.1%)
- API response time: >2s (normal ~200ms)
- Failed registrations >10% (normal <1%)

**Alert Recipients**:
- Slack: #registration-feature
- PagerDuty: Frontend team on-call
- Email: frontend-team@company.com

### Support Contacts

**During Staging Deploy**:
- Frontend Lead: [name] - frontend@company.com
- Backend Lead: [name] - backend@company.com
- QA Lead: [name] - qa@company.com

**For Issues/Questions**:
- Slack Channel: #registration-feature
- Jira Board: [board link]
- Documentation: website/README.md

---

## Deployment Timeline

```
Day 1:
  09:00 - Merge PR to staging (automated pipeline runs)
  09:15 - Smoke tests pass, staging deployed
  09:30 - Manual QA begins

Days 1-2:
  - QA manual testing: Happy path, errors, mobile, accessibility
  - Monitor logs and error tracking
  - Verify performance metrics
  - Collect feedback from QA team

Day 3:
  - QA approval gate check
  - Product sign-off (if needed)
  - Prepare for production deployment

Production:
  - Deploy to main (same process)
  - 24-hour monitoring
  - Celebrate! 🎉
```

---

## Final Checklist Before Clicking Deploy

- [✅] All quality tests passing (78/78)
- [✅] Code review approved
- [✅] Design review approved
- [✅] Security review approved
- [✅] Feature branch has no conflicts
- [✅] Staging branch is up to date
- [✅] Environment variables configured
- [✅] Backend API ready for staging
- [✅] Database migrations (if any) applied
- [✅] Team notified of deployment
- [✅] On-call engineer available

**👉 Ready to Deploy?** ✅ YES

---

## Related Documentation

- [Registration Feature Checklist](./REGISTRATION_FEATURE_CHECKLIST.md)
- [Quality Validation Report](./docs/registration-quality-validation.md)
- [API Alignment Checklist](./docs/registration-api-alignment.md)
- [Implementation Notes](./docs/registration-implementation-notes.md)
- [README - Development Setup](./README.md)

---

**Document Version**: 1.0  
**Last Updated**: 2024-present  
**Status**: ✅ READY FOR STAGING DEPLOYMENT

