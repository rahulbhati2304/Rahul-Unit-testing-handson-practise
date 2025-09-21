/* 
  1. validation check
  2. input
  3. button click
  4. accessibility
*/

import { expect, fixture, html } from '@open-wc/testing';
import { stub, restore, spy } from 'sinon';
import '../src/LoanBasicDetails/BasicDetails.js';
import { Router } from '@vaadin/router';

describe('BasicDetails - Min/Max Validation Tests', () => {
  let element;
  
  // Test 1: "Does it show error for amounts less than ₹10,000?"
  // Test 2: "Does it NOT show error for amounts ≥ ₹10,000?"
  // Test 3: "Is the period slider set to 1-20 years?"
  // Test 4: "Does the error message disappear after 2 seconds?"

  beforeEach(async () => {
    // Mock localStorage
    stub(window.localStorage, 'getItem').returns('Personal Loan');
    stub(window.localStorage, 'setItem');

    element = await fixture(html`<basic-details></basic-details>`);
    await element.updateComplete;
    console.log(element, 'element');
  });

  afterEach(() => {
    restore();
  });

  it('should reject amount below minimum (10000) and add error class', () => {
    const amountInput = element.shadowRoot.querySelector('.amount');
    amountInput.value = '5000';

    element._captureDetails();

    expect(amountInput.classList.contains('e-handle')).to.be.true;
  });

  it('should accept amount above minimum (10000) without error class', () => {
    const amountInput = element.shadowRoot.querySelector('.amount');
    amountInput.value = '50000';

    element._captureDetails();

    expect(amountInput.classList.contains('e-handle')).to.be.false;
  });

  it('should validate range input has correct min and max attributes', () => {
    const rangeInput = element.shadowRoot.querySelector('.period');

    expect(rangeInput.getAttribute('min')).to.equal('1');
    expect(rangeInput.getAttribute('max')).to.equal('20');
  });

  it('should remove error class after 2 seconds for invalid amount', function (done) {
    this.timeout(3000);

    const amountInput = element.shadowRoot.querySelector('.amount');
    amountInput.value = '8000';

    element._captureDetails();
    expect(amountInput.classList.contains('e-handle')).to.be.true;

    setTimeout(() => {
      expect(amountInput.classList.contains('e-handle')).to.be.false;
      done();
    }, 2100);
  });
});

describe('BasicDetails - Input Tests', () => {
  let element;

  beforeEach(async () => {
    stub(window.localStorage, 'getItem').returns('Personal Loan');
    stub(window.localStorage, 'setItem');

    element = await fixture(html`<basic-details></basic-details>`);
    await element.updateComplete;
  });

  afterEach(() => {
    restore();
  });

  it('should initialize with default amount value of 10000', () => {
    const amountInput = element.shadowRoot.querySelector('.amount');

    expect(element.amount).to.equal(10000);
    expect(amountInput.modelValue).to.equal(10000);
  });

  it('should update amount input when user types', async () => {
    const amountInput = element.shadowRoot.querySelector('.amount');

    amountInput.modelValue = 50000;
    await element.updateComplete;

    expect(amountInput.modelValue).to.equal(50000);
  });

  it('should load loan type from browser storage', () => {
    const typeInput = element.shadowRoot.querySelector('.type');

    expect(element.type).to.equal('Personal Loan');
    expect(typeInput.value).to.equal('Personal Loan');
    expect(typeInput.hasAttribute('disabled')).to.be.true;
  });
});

describe('BasicDetails - Button Click Tests', () => {
  let element;
  let fetchStub;

  beforeEach(async () => {
    stub(window.localStorage, 'getItem').returns('Personal Loan');
    stub(window.localStorage, 'setItem');
    fetchStub = stub(window, 'fetch');

    element = await fixture(html`<basic-details></basic-details>`);
    await element.updateComplete;
  });

  afterEach(() => {
    restore();
  });

  it('should navigate to dashboard when Previous button is clicked', () => {
    const routerSpy = spy(Router, 'go');
    const prevButton = element.shadowRoot.querySelector('.btn-previous');

    prevButton.click();

    expect(routerSpy).to.have.been.calledWith('/');
    routerSpy.restore();
  });

  it('should make API call with correct data when form is valid', async () => {
    const mockResponse = { emi: 1000, totalAmount: 60000 };
    fetchStub.resolves({
      json: () => Promise.resolve(mockResponse),
    });

    element.shadowRoot.querySelector('.type').value = 'Personal Loan';
    element.shadowRoot.querySelector('.amount').value = '50,000';
    element.shadowRoot.querySelector('.period').value = '5';

    await element._captureDetails();

    expect(fetchStub).to.have.been.calledWith(
      'https://loanfeapi.herokuapp.com/calculate-emi',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Personal Loan',
          amount: '50,000',
          period: '5',
        }),
      }
    );
  });

  it('should not make API call when amount is invalid', () => {
    element.shadowRoot.querySelector('.type').value = 'Personal Loan';
    element.shadowRoot.querySelector('.amount').value = '5000';
    element.shadowRoot.querySelector('.period').value = '5';

    element._captureDetails();

    expect(fetchStub).to.not.have.been.called;
  });
});

describe('BasicDetails - Accessibility Tests', () => {
  let element;

  beforeEach(async () => {
    // Setup: Create fake localStorage and component
    stub(window.localStorage, 'getItem').returns('Personal Loan');
    stub(window.localStorage, 'setItem');

    element = await fixture(html`<basic-details></basic-details>`);
    await element.updateComplete;
  });

  afterEach(() => {
    restore(); // Cleanup: Put everything back to normal
  });

  it('should have proper labels for all input fields', () => {
    // What we're checking: Can screen readers understand what each field is for?

    // Find all input fields
    const typeInput = element.shadowRoot.querySelector('.type');
    const amountInput = element.shadowRoot.querySelector('.amount');
    const periodInput = element.shadowRoot.querySelector('.period');

    // FIX 2: Check if elements exist first, then check labels
    expect(typeInput).to.exist;
    expect(amountInput).to.exist;
    expect(periodInput).to.exist;

    // Check: Every input should have a label attribute
    const typeLabel = typeInput.getAttribute('label');
    const amountLabel = amountInput.getAttribute('label');
    const periodLabel = periodInput.getAttribute('label');

    expect(typeLabel).to.exist;
    expect(typeLabel).to.be.a('string');
    expect(amountLabel).to.exist;
    expect(amountLabel).to.be.a('string');
    expect(periodLabel).to.exist;
    expect(periodLabel).to.be.a('string');
  });
});
