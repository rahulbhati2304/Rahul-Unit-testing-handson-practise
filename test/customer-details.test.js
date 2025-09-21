import { html, fixture } from '@open-wc/testing';
import sinon, { stub } from 'sinon';
import { expect } from 'chai';
import '../src/Customer/Customer-details.js';
import { Router } from '@vaadin/router';
import { localize } from '@lion/localize';

describe('customer details', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<customer-details></customer-details>`);
  });

  afterEach(() => {
    sinon.restore();
  });

  /**
   * Test Case 1: Component renders correctly
   */
  it('should render the customer details form', async () => {
    expect(element).to.exist;

    const title = element.shadowRoot.querySelector('h2');
    expect(title).to.exist;

    const form = element.shadowRoot.querySelector('lion-form');
    expect(form).to.exist;

    const firstNameInput = element.shadowRoot.querySelector('#first_name');
    const emailInput = element.shadowRoot.querySelector('#email');
    const mobileInput = element.shadowRoot.querySelector('#mobile_number');

    expect(firstNameInput).to.exist;
    expect(emailInput).to.exist;
    expect(mobileInput).to.exist;
  });

  /**
   * Test Case 2: Required field validation
   */
  it('should show error when first name is empty', async () => {
    const firstNameInput = element.shadowRoot.querySelector('#first_name');

    firstNameInput.modelValue = '';
    await element.updateComplete;

    firstNameInput.focus();
    firstNameInput.blur();

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(firstNameInput.hasFeedbackFor.includes('error')).to.be.true;
  });

  /**
   * Test Case 3: Email format validation
   */
  it('should show error for invalid email format', async () => {
    const emailInput = element.shadowRoot.querySelector('#email');

    emailInput.modelValue = 'invalid-email';
    await element.updateComplete;

    emailInput.focus();
    emailInput.blur();

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(emailInput.hasFeedbackFor.includes('error')).to.be.true;
  });

  /**
   * Test Case 4: Mobile number validation
   */
  it('should show error for invalid mobile number', async () => {
    const mobileInput = element.shadowRoot.querySelector('#mobile_number');

    mobileInput.modelValue = '123';
    await element.updateComplete;

    mobileInput.focus();
    mobileInput.blur();

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(mobileInput.hasFeedbackFor.includes('error')).to.be.true;
  });

  /**
   * Test Case 5: Back button navigation
   */
  it('should navigate to EMI details when back button is clicked', async () => {
    const routerSpy = sinon.spy(Router, 'go');

    const backButton = element.shadowRoot.querySelector('.backbg-btn-color');
    expect(backButton).to.exist;

    backButton.click();

    expect(routerSpy.calledWith('/emidetails')).to.be.true;
  });
});
